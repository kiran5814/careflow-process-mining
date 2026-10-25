"""
Python Model: fct_patient_journeys.py
1:1 Pure Python replacement for fct_patient_journeys.sql
"""

import pandas as pd


def model(stg_ehr_events: pd.DataFrame) -> pd.DataFrame:
    grouped = stg_ehr_events.groupby("case_id")
    fct = grouped.agg(
        patient_gender=("patient_gender", "first"),
        patient_age_group=("patient_age_group", "first"),
        clinical_severity=("clinical_severity", "first"),
        visit_start_time=("event_timestamp", "min"),
        visit_end_time=("event_timestamp", "max"),
        total_events_count=("activity_name", "count"),
        triage_executions_count=("activity_name", lambda s: (s == "Triage").sum()),
        xray_executions_count=("activity_name", lambda s: (s == "X-Ray").sum()),
        lab_executions_count=("activity_name", lambda s: (s == "Lab Test").sum()),
    ).reset_index()

    doc_events = stg_ehr_events[stg_ehr_events["activity_name"].isin(["Doctor Consultation", "Treatment"])]
    doc_map = doc_events.groupby("case_id")["resource_name"].last()
    fct["primary_physician"] = fct["case_id"].map(doc_map).fillna("Unassigned / Nurse")

    fct["total_los_minutes"] = (
        (fct["visit_end_time"] - fct["visit_start_time"]).dt.total_seconds() / 60.0
    ).round(1)

    fct["has_radiology_loopback_rework"] = (
        (fct["xray_executions_count"] > 0) & (fct["triage_executions_count"] > 1)
    )
    fct["is_triage_bypassed_anomaly"] = fct["triage_executions_count"] == 0
    return fct
