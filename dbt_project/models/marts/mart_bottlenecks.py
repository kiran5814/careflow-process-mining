"""
Python Model: mart_bottlenecks.py
1:1 Pure Python replacement for mart_bottlenecks.sql
"""

import pandas as pd


def model(stg_ehr_events: pd.DataFrame) -> pd.DataFrame:
    trans = stg_ehr_events[stg_ehr_events["previous_activity"].notna()].copy()
    trans["source_activity"] = trans["previous_activity"]
    trans["target_activity"] = trans["activity_name"]
    trans["transition_wait_minutes"] = (
        (trans["event_timestamp"] - trans["previous_event_timestamp"]).dt.total_seconds() / 60.0
    )

    grouped = trans.groupby(["source_activity", "target_activity", "is_morning_rush"])
    result = grouped.agg(
        transition_volume=("transition_wait_minutes", "count"),
        avg_wait_minutes=("transition_wait_minutes", lambda s: round(s.mean(), 1)),
        median_wait_minutes=("transition_wait_minutes", lambda s: round(s.median(), 1)),
        max_wait_minutes=("transition_wait_minutes", lambda s: round(s.max(), 1)),
    ).reset_index()

    return result.sort_values(by="transition_volume", ascending=False).reset_index(drop=True)
