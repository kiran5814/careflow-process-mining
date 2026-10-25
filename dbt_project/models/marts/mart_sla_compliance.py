"""
Python Model: mart_sla_compliance.py
1:1 Pure Python replacement for mart_sla_compliance.sql
"""

import pandas as pd


def model(stg_ehr_events: pd.DataFrame) -> pd.DataFrame:
    grouped = stg_ehr_events.groupby("case_id")

    def get_time(activity_filter):
        sub = stg_ehr_events[stg_ehr_events["activity_name"] == activity_filter]
        return sub.groupby("case_id")["event_timestamp"].min()

    reg_time = get_time("Registration")
    triage_time = get_time("Triage")
    xray_time = get_time("X-Ray")
    doc_time = get_time("Doctor Consultation")
    disp_time = grouped["event_timestamp"].max()

    doc_events = stg_ehr_events[stg_ehr_events["activity_name"].isin(["Doctor Consultation", "Treatment"])]
    doc_map = doc_events.groupby("case_id")["resource_name"].last()

    base_cases = grouped.agg(
        patient_gender=("patient_gender", "first"),
        patient_age_group=("patient_age_group", "first"),
        clinical_severity=("clinical_severity", "first"),
    ).reset_index()

    base_cases["primary_physician"] = base_cases["case_id"].map(doc_map).fillna("Unassigned / Nurse")
    base_cases["registration_time"] = base_cases["case_id"].map(reg_time)
    base_cases["triage_time"] = base_cases["case_id"].map(triage_time)
    base_cases["xray_time"] = base_cases["case_id"].map(xray_time)
    base_cases["doctor_consult_time"] = base_cases["case_id"].map(doc_time)
    base_cases["disposition_time"] = base_cases["case_id"].map(disp_time)

    entry_time = base_cases["registration_time"].combine_first(base_cases["triage_time"])
    base_cases["door_to_doctor_minutes"] = (
        (base_cases["doctor_consult_time"] - entry_time).dt.total_seconds() / 60.0
    ).round(1)

    base_cases["triage_to_xray_minutes"] = (
        (base_cases["xray_time"] - base_cases["triage_time"]).dt.total_seconds() / 60.0
    ).round(1)

    base_cases["total_ed_los_minutes"] = (
        (base_cases["disposition_time"] - entry_time).dt.total_seconds() / 60.0
    ).round(1)

    base_cases["is_door_to_doctor_breached"] = base_cases["door_to_doctor_minutes"] > 30.0
    base_cases["is_radiology_sla_breached"] = base_cases["triage_to_xray_minutes"] > 45.0
    base_cases["is_ed_boarding_breached"] = base_cases["total_ed_los_minutes"] > 240.0

    return base_cases
