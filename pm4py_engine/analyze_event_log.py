"""Validate and summarize a CareFlow event log using pandas.

Run from the repository root after generating the sample data:
    python pm4py_engine/analyze_event_log.py

Input: data/sample_event_log.csv
Outputs: reports/activity_summary.csv and reports/case_durations.csv
"""
from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data" / "sample_event_log.csv"
REPORTS = ROOT / "reports"
REQUIRED_COLUMNS = {"case_id", "activity", "timestamp", "resource"}


def main() -> int:
    if not INPUT.exists():
        print(f"Input file not found: {INPUT}")
        print("First run: python simulator/generate_event_log.py")
        return 1

    df = pd.read_csv(INPUT)
    missing_columns = REQUIRED_COLUMNS - set(df.columns)
    if missing_columns:
        print(f"Missing required columns: {', '.join(sorted(missing_columns))}")
        return 1

    print("=== CareFlow Event Log Check ===")
    print(f"Rows loaded: {len(df)}")
    print(f"Cases loaded: {df['case_id'].nunique()}")
    print(f"Activities loaded: {df['activity'].nunique()}")
    print(f"Duplicate rows: {int(df.duplicated().sum())}")

    for column in ["case_id", "activity", "resource"]:
        df[column] = df[column].astype("string").str.strip()

    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    invalid_timestamp_count = int(df["timestamp"].isna().sum())
    print(f"Rows with invalid timestamps: {invalid_timestamp_count}")

    df = df.drop_duplicates().dropna(subset=["case_id", "activity", "timestamp"])
    df = df.sort_values(["case_id", "timestamp"]).copy()

    if df.empty:
        print("No valid events remain after cleaning.")
        return 1

    case_durations = (
        df.groupby("case_id")["timestamp"]
        .agg(first_event="min", last_event="max", event_count="count")
        .reset_index()
    )
    case_durations["duration_minutes"] = (
        case_durations["last_event"] - case_durations["first_event"]
    ).dt.total_seconds() / 60
    case_durations = case_durations.sort_values("duration_minutes", ascending=False)

    df["previous_activity"] = df.groupby("case_id")["activity"].shift(1)
    df["previous_timestamp"] = df.groupby("case_id")["timestamp"].shift(1)
    df["wait_minutes"] = (
        df["timestamp"] - df["previous_timestamp"]
    ).dt.total_seconds() / 60

    transitions = df.dropna(subset=["previous_activity", "wait_minutes"])
    activity_summary = (
        transitions.groupby("activity", as_index=False)
        .agg(
            events_after_previous=("wait_minutes", "count"),
            average_gap_minutes=("wait_minutes", "mean"),
            median_gap_minutes=("wait_minutes", "median"),
            maximum_gap_minutes=("wait_minutes", "max"),
        )
        .sort_values("average_gap_minutes", ascending=False)
    )

    REPORTS.mkdir(parents=True, exist_ok=True)
    case_output = REPORTS / "case_durations.csv"
    activity_output = REPORTS / "activity_summary.csv"
    case_durations.to_csv(case_output, index=False)
    activity_summary.to_csv(activity_output, index=False)

    print("\n=== Case Duration Summary (minutes) ===")
    print(case_durations["duration_minutes"].describe().round(2).to_string())
    print("\n=== Activities with Largest Average Gaps ===")
    print(activity_summary.head(10).round(2).to_string(index=False))
    print(f"\nSaved: {case_output}")
    print(f"Saved: {activity_output}")
    print("\nNote: these results describe synthetic practice data only.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
