"""
Python Model: mart_resource_handovers.py
1:1 Pure Python replacement for mart_resource_handovers.sql
"""

import pandas as pd


def model(stg_ehr_events: pd.DataFrame) -> pd.DataFrame:
    df = stg_ehr_events.copy()
    df["source_resource"] = df.groupby("case_id")["resource_name"].shift(1)
    df["target_resource"] = df["resource_name"]

    handovers = df[df["previous_activity"].notna()].copy()
    handovers["source_activity"] = handovers["previous_activity"]
    handovers["target_activity"] = handovers["activity_name"]
    handovers["source_role"] = handovers["source_resource"].fillna("Triage Staff")
    handovers["target_role"] = handovers["target_resource"].fillna("Clinical Team")
    handovers["handover_latency_minutes"] = (
        (handovers["event_timestamp"] - handovers["previous_event_timestamp"]).dt.total_seconds() / 60.0
    )

    grouped = handovers.groupby(
        ["source_activity", "target_activity", "source_role", "target_role", "is_morning_rush"]
    )
    result = grouped.agg(
        handover_volume=("handover_latency_minutes", "count"),
        avg_latency_minutes=("handover_latency_minutes", lambda s: round(s.mean(), 1)),
        median_latency_minutes=("handover_latency_minutes", lambda s: round(s.median(), 1)),
        max_latency_minutes=("handover_latency_minutes", lambda s: round(s.max(), 1)),
    ).reset_index()

    def rate_friction(val):
        if val > 40: return "Critical Friction"
        elif val > 25: return "Moderate Friction"
        return "Nominal Velocity"

    result["communication_friction_rating"] = result["avg_latency_minutes"].apply(rate_friction)
    return result.sort_values(by="handover_volume", ascending=False).reset_index(drop=True)
