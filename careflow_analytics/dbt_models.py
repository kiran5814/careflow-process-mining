"""
CareFlow - DBT SQL Models Translated 1:1 into Pure Python & Pandas

Translates:
  1. stg_ehr_events.sql         -> stg_ehr_events(raw_df)
  2. fct_patient_journeys.sql   -> fct_patient_journeys(stg_df)
  3. mart_bottlenecks.sql       -> mart_bottlenecks(stg_df)
  4. mart_resource_handovers.sql-> mart_resource_handovers(stg_df)
  5. mart_sla_compliance.sql    -> mart_sla_compliance(stg_df)
"""

import os
import pandas as pd
import numpy as np


def stg_ehr_events(raw_df: pd.DataFrame) -> pd.DataFrame:
    """
    Python equivalent of dbt model: models/staging/stg_ehr_events.sql
    Standardizes types, case tracking, extracts rush hour flag, and computes window lag functions.
    """
    df = raw_df.copy()
    
    # 1. Type casting and column mapping
    df["case_id"] = df["Case_ID"].astype(str)
    df["activity_name"] = df["Activity_Name"].astype(str)
    df["event_timestamp"] = pd.to_datetime(df["Timestamp"])
    df["resource_name"] = df["Resource"].astype(str)
    df["patient_gender"] = df["Gender"].astype(str)
    df["patient_age_group"] = df["Age_Group"].astype(str)
    df["clinical_severity"] = df["Severity"].astype(str)

    # 2. Sort chronologically per case for window lag operations
    df = df.sort_values(by=["case_id", "event_timestamp"]).reset_index(drop=True)

    # 3. Extract hour of arrival for rush detection (8 to 11 AM)
    df["event_hour"] = df["event_timestamp"].dt.hour
    df["is_morning_rush"] = df["event_hour"].between(8, 11)

    # 4. Window functions: lag(activity_name) over (partition by case_id order by event_timestamp)
    df["previous_activity"] = df.groupby("case_id")["activity_name"].shift(1)
    df["previous_event_timestamp"] = df.groupby("case_id")["event_timestamp"].shift(1)

    # Select standardized staging columns
    cols = [
        "case_id", "activity_name", "event_timestamp", "resource_name",
        "patient_gender", "patient_age_group", "clinical_severity",
        "event_hour", "is_morning_rush", "previous_activity", "previous_event_timestamp"
    ]
    return df[cols]


def fct_patient_journeys(stg_df: pd.DataFrame) -> pd.DataFrame:
    """
    Python equivalent of dbt model: models/marts/fct_patient_journeys.sql
    Case-level patient journeys with duration, primary physician, and anomaly flags.
    """
    # 1. Aggregations per case
    grouped = stg_df.groupby("case_id")

    agg_df = grouped.agg(
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

    # 2. Extract primary physician (Doctor Consultation or Treatment resource)
    doc_events = stg_df[stg_df["activity_name"].isin(["Doctor Consultation", "Treatment"])]
    doc_map = doc_events.groupby("case_id")["resource_name"].last()
    agg_df["primary_physician"] = agg_df["case_id"].map(doc_map).fillna("Unassigned / Nurse")

    # 3. Throughput time (Length of Stay) in minutes
    agg_df["total_los_minutes"] = (
        (agg_df["visit_end_time"] - agg_df["visit_start_time"]).dt.total_seconds() / 60.0
    ).round(1)

    # 4. Anomaly & Rework flags
    agg_df["has_radiology_loopback_rework"] = (
        (agg_df["xray_executions_count"] > 0) & (agg_df["triage_executions_count"] > 1)
    )
    agg_df["is_triage_bypassed_anomaly"] = (agg_df["triage_executions_count"] == 0)

    # Final ordering
    cols = [
        "case_id", "patient_gender", "patient_age_group", "clinical_severity",
        "primary_physician", "visit_start_time", "visit_end_time", "total_events_count",
        "total_los_minutes", "has_radiology_loopback_rework", "is_triage_bypassed_anomaly"
    ]
    return agg_df[cols]


def mart_bottlenecks(stg_df: pd.DataFrame) -> pd.DataFrame:
    """
    Python equivalent of dbt model: models/marts/mart_bottlenecks.sql
    Departmental transition delays and bottleneck analysis.
    """
    # Filter transitions where previous activity is present
    trans = stg_df[stg_df["previous_activity"].notna()].copy()
    
    trans["source_activity"] = trans["previous_activity"]
    trans["target_activity"] = trans["activity_name"]
    trans["transition_wait_minutes"] = (
        (trans["event_timestamp"] - trans["previous_event_timestamp"]).dt.total_seconds() / 60.0
    )

    # Group by source, target, and morning rush status
    grouped = trans.groupby(["source_activity", "target_activity", "is_morning_rush"])
    
    result = grouped.agg(
        transition_volume=("transition_wait_minutes", "count"),
        avg_wait_minutes=("transition_wait_minutes", lambda s: round(s.mean(), 1)),
        median_wait_minutes=("transition_wait_minutes", lambda s: round(s.median(), 1)),
        max_wait_minutes=("transition_wait_minutes", lambda s: round(s.max(), 1)),
    ).reset_index()

    result = result.sort_values(by="transition_volume", ascending=False).reset_index(drop=True)
    return result


def mart_resource_handovers(stg_df: pd.DataFrame) -> pd.DataFrame:
    """
    Python equivalent of dbt model: models/marts/mart_resource_handovers.sql
    Inter-departmental resource handovers, latency, and communication friction rating.
    """
    df = stg_df.copy()
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

    # Friction rating
    def rate_friction(avg_val):
        if avg_val > 40:
            return "Critical Friction"
        elif avg_val > 25:
            return "Moderate Friction"
        else:
            return "Nominal Velocity"

    result["communication_friction_rating"] = result["avg_latency_minutes"].apply(rate_friction)
    result = result.sort_values(by="handover_volume", ascending=False).reset_index(drop=True)
    return result


def mart_sla_compliance(stg_df: pd.DataFrame) -> pd.DataFrame:
    """
    Python equivalent of dbt model: models/marts/mart_sla_compliance.sql
    Clinical SLA compliance monitoring and emergency breach detection (CMS OP-18).
    """
    grouped = stg_df.groupby("case_id")

    # Patient milestones
    def get_time(activity_filter):
        sub = stg_df[stg_df["activity_name"] == activity_filter]
        return sub.groupby("case_id")["event_timestamp"].min()

    reg_time = get_time("Registration")
    triage_time = get_time("Triage")
    xray_time = get_time("X-Ray")
    doc_time = get_time("Doctor Consultation")
    disp_time = grouped["event_timestamp"].max()

    doc_events = stg_df[stg_df["activity_name"].isin(["Doctor Consultation", "Treatment"])]
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

    # Door-to-Doctor SLA (target < 30m)
    entry_time = base_cases["registration_time"].combine_first(base_cases["triage_time"])
    base_cases["door_to_doctor_minutes"] = (
        (base_cases["doctor_consult_time"] - entry_time).dt.total_seconds() / 60.0
    ).round(1)

    # Triage-to-X-Ray SLA (target < 45m)
    base_cases["triage_to_xray_minutes"] = (
        (base_cases["xray_time"] - base_cases["triage_time"]).dt.total_seconds() / 60.0
    ).round(1)

    # Total ED Length of Stay (CMS OP-18 target < 240m)
    base_cases["total_ed_los_minutes"] = (
        (base_cases["disposition_time"] - entry_time).dt.total_seconds() / 60.0
    ).round(1)

    # Regulatory SLA Breach Status Flags
    base_cases["is_door_to_doctor_breached"] = base_cases["door_to_doctor_minutes"] > 30.0
    base_cases["is_radiology_sla_breached"] = base_cases["triage_to_xray_minutes"] > 45.0
    base_cases["is_ed_boarding_breached"] = base_cases["total_ed_los_minutes"] > 240.0

    cols = [
        "case_id", "patient_gender", "patient_age_group", "clinical_severity",
        "primary_physician", "door_to_doctor_minutes", "triage_to_xray_minutes",
        "total_ed_los_minutes", "is_door_to_doctor_breached",
        "is_radiology_sla_breached", "is_ed_boarding_breached"
    ]
    return base_cases[cols]


def run_full_dbt_python_pipeline(csv_path: str, output_dir: str):
    """
    Executes the complete Python ETL pipeline:
    stg_ehr_events -> fct_patient_journeys, mart_bottlenecks, mart_resource_handovers, mart_sla_compliance.
    Saves results to output_dir in both CSV and Parquet format.
    """
    os.makedirs(output_dir, exist_ok=True)
    print(f"[CareFlow Python DBT Pipeline] Loading raw data: {csv_path}")
    raw_df = pd.read_csv(csv_path)
    print(f"   Loaded {len(raw_df)} rows, {raw_df['Case_ID'].nunique()} cases.")

    # 1. Staging
    print(">> [1/5] Building Staging: stg_ehr_events...")
    stg = stg_ehr_events(raw_df)
    stg.to_csv(os.path.join(output_dir, "stg_ehr_events.csv"), index=False)
    stg.to_parquet(os.path.join(output_dir, "stg_ehr_events.parquet"), index=False)

    # 2. Fact Patient Journeys
    print(">> [2/5] Building Mart: fct_patient_journeys...")
    fct = fct_patient_journeys(stg)
    fct.to_csv(os.path.join(output_dir, "fct_patient_journeys.csv"), index=False)
    fct.to_parquet(os.path.join(output_dir, "fct_patient_journeys.parquet"), index=False)

    # 3. Mart Bottlenecks
    print(">> [3/5] Building Mart: mart_bottlenecks...")
    bottlenecks = mart_bottlenecks(stg)
    bottlenecks.to_csv(os.path.join(output_dir, "mart_bottlenecks.csv"), index=False)
    bottlenecks.to_parquet(os.path.join(output_dir, "mart_bottlenecks.parquet"), index=False)

    # 4. Mart Resource Handovers
    print(">> [4/5] Building Mart: mart_resource_handovers...")
    handovers = mart_resource_handovers(stg)
    handovers.to_csv(os.path.join(output_dir, "mart_resource_handovers.csv"), index=False)
    handovers.to_parquet(os.path.join(output_dir, "mart_resource_handovers.parquet"), index=False)

    # 5. Mart SLA Compliance
    print(">> [5/5] Building Mart: mart_sla_compliance...")
    sla = mart_sla_compliance(stg)
    sla.to_csv(os.path.join(output_dir, "mart_sla_compliance.csv"), index=False)
    sla.to_parquet(os.path.join(output_dir, "mart_sla_compliance.parquet"), index=False)

    print("[OK] [CareFlow Python DBT Pipeline] All models successfully materialized!")
    print(f"   Output files saved in: {output_dir}")
    return {
        "stg_ehr_events": stg,
        "fct_patient_journeys": fct,
        "mart_bottlenecks": bottlenecks,
        "mart_resource_handovers": handovers,
        "mart_sla_compliance": sla
    }
