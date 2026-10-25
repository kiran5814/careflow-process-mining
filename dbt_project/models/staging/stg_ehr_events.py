"""
Python Model: stg_ehr_events.py
1:1 Pure Python replacement for stg_ehr_events.sql
"""

import pandas as pd


def model(raw_source: pd.DataFrame) -> pd.DataFrame:
    df = raw_source.copy()
    df["case_id"] = df["Case_ID"].astype(str)
    df["activity_name"] = df["Activity_Name"].astype(str)
    df["event_timestamp"] = pd.to_datetime(df["Timestamp"])
    df["resource_name"] = df["Resource"].astype(str)
    df["patient_gender"] = df["Gender"].astype(str)
    df["patient_age_group"] = df["Age_Group"].astype(str)
    df["clinical_severity"] = df["Severity"].astype(str)

    df = df.sort_values(by=["case_id", "event_timestamp"]).reset_index(drop=True)
    df["event_hour"] = df["event_timestamp"].dt.hour
    df["is_morning_rush"] = df["event_hour"].between(8, 11)

    df["previous_activity"] = df.groupby("case_id")["activity_name"].shift(1)
    df["previous_event_timestamp"] = df.groupby("case_id")["event_timestamp"].shift(1)
    return df
