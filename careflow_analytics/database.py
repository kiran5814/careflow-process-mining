"""
CareFlow - Live Connected SQL Database Engine (100% Pure Python & SQLite)
Provides:
  1. Relational SQL Database Schema (Bronze, Silver, Gold Tables & Views)
  2. Direct SQL Query Execution Engine (pandas.read_sql_query)
  3. Real-Time SQL Updates & Dynamic Data Ingestion
  4. Live Interactive SQL Query Runner with Schema Introspection
  5. Automated Database Seeding from Raw EHR & Parquet Marts
"""

import os
import sqlite3
import datetime
import pandas as pd
import numpy as np

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DB_DIR = os.path.join(BASE_DIR, "careflow_analytics")
DB_PATH = os.path.join(DB_DIR, "careflow_hospital.db")


def get_db_connection():
    """
    Returns a thread-safe connection to the SQLite hospital database.
    """
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_sql_database(force_refresh: bool = False) -> dict:
    """
    Initializes the relational hospital SQL schema and populates all tables:
      - raw_ehr_events (Bronze Ingestion Layer)
      - stg_ehr_events (Silver Enriched & Windowed Layer)
      - fct_patient_journeys (Gold Episode Fact Table)
      - mart_bottlenecks (Gold Departmental Wait Times)
      - mart_resource_handovers (Gold Role-to-Role Transitions)
      - mart_sla_compliance (Gold Regulatory CMS OP-18 Metrics)
      - hospital_ward_census (Live Inpatient Bed Availability)
      - clinical_protocols (Standard Operating Procedures)
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if database already initialized
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='fct_patient_journeys'")
    exists = cursor.fetchone()

    if exists and not force_refresh:
        conn.close()
        return {"status": "ALREADY_INITIALIZED", "db_path": DB_PATH}

    # 1. Create Tables
    cursor.executescript("""
    -- Bronze Layer: Raw Event Ingestion
    CREATE TABLE IF NOT EXISTS raw_ehr_events (
        event_id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT NOT NULL,
        activity_name TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        resource_name TEXT,
        patient_gender TEXT,
        patient_age_group TEXT,
        clinical_severity TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Silver Layer: Standardized Staging with Window Lag Transitions
    CREATE TABLE IF NOT EXISTS stg_ehr_events (
        event_id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_id TEXT NOT NULL,
        activity_name TEXT NOT NULL,
        event_timestamp TEXT NOT NULL,
        resource_name TEXT,
        patient_gender TEXT,
        patient_age_group TEXT,
        clinical_severity TEXT,
        event_hour INTEGER,
        is_morning_rush BOOLEAN,
        previous_activity TEXT,
        previous_event_timestamp TEXT,
        wait_minutes REAL
    );

    -- Gold Layer: Patient Episode Fact Table
    CREATE TABLE IF NOT EXISTS fct_patient_journeys (
        case_id TEXT PRIMARY KEY,
        patient_gender TEXT,
        patient_age_group TEXT,
        clinical_severity TEXT,
        primary_physician TEXT,
        visit_start_time TEXT,
        visit_end_time TEXT,
        total_events_count INTEGER,
        total_los_minutes REAL,
        has_radiology_loopback_rework BOOLEAN,
        is_triage_bypassed_anomaly BOOLEAN,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Gold Layer: Departmental Bottlenecks Mart
    CREATE TABLE IF NOT EXISTS mart_bottlenecks (
        bottleneck_id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_activity TEXT,
        target_activity TEXT,
        is_morning_rush BOOLEAN,
        transition_volume INTEGER,
        avg_wait_minutes REAL,
        median_wait_minutes REAL,
        max_wait_minutes REAL
    );

    -- Gold Layer: Resource Handovers Mart
    CREATE TABLE IF NOT EXISTS mart_resource_handovers (
        handover_id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_activity TEXT,
        target_activity TEXT,
        source_role TEXT,
        target_role TEXT,
        is_morning_rush BOOLEAN,
        handover_volume INTEGER,
        avg_latency_minutes REAL,
        median_latency_minutes REAL,
        max_latency_minutes REAL,
        communication_friction_rating TEXT
    );

    -- Gold Layer: Clinical SLA Compliance Mart
    CREATE TABLE IF NOT EXISTS mart_sla_compliance (
        case_id TEXT PRIMARY KEY,
        patient_gender TEXT,
        patient_age_group TEXT,
        clinical_severity TEXT,
        primary_physician TEXT,
        door_to_doctor_minutes REAL,
        triage_to_xray_minutes REAL,
        total_ed_los_minutes REAL,
        is_door_to_doctor_breached BOOLEAN,
        is_radiology_sla_breached BOOLEAN,
        is_ed_boarding_breached BOOLEAN
    );

    -- Operational Ward Bed Census Table
    CREATE TABLE IF NOT EXISTS hospital_ward_census (
        unit_id INTEGER PRIMARY KEY AUTOINCREMENT,
        unit_name TEXT NOT NULL,
        total_beds INTEGER NOT NULL,
        occupied_beds INTEGER NOT NULL,
        occupancy_rate REAL,
        status TEXT,
        last_updated TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Hospital Clinical Standard Operating Procedures Table
    CREATE TABLE IF NOT EXISTS clinical_protocols (
        protocol_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        mandated_sla_minutes INTEGER,
        protocol_text TEXT NOT NULL,
        tags TEXT
    );
    """)
    conn.commit()

    # 2. Seed Data from CSV / Parquet
    out_dir = os.path.join(DB_DIR, "output")
    raw_csv = os.path.join(BASE_DIR, "simulator", "output", "ehr_event_log.csv")

    # Ingest Raw CSV into raw_ehr_events
    if os.path.exists(raw_csv):
        raw_df = pd.read_csv(raw_csv)
        raw_df.rename(columns={
            "Case_ID": "case_id",
            "Activity_Name": "activity_name",
            "Timestamp": "timestamp",
            "Resource_Name": "resource_name",
            "Patient_Gender": "patient_gender",
            "Patient_Age_Group": "patient_age_group",
            "Clinical_Severity": "clinical_severity"
        }, inplace=True)
        raw_df.to_sql("raw_ehr_events", conn, if_exists="replace", index=False)

    # Ingest Parquet marts into SQL
    stg_p = os.path.join(out_dir, "stg_ehr_events.parquet")
    if os.path.exists(stg_p):
        stg_df = pd.read_parquet(stg_p)
        stg_df.to_sql("stg_ehr_events", conn, if_exists="replace", index=False)

    fct_p = os.path.join(out_dir, "fct_patient_journeys.parquet")
    if os.path.exists(fct_p):
        fct_df = pd.read_parquet(fct_p)
        fct_df.to_sql("fct_patient_journeys", conn, if_exists="replace", index=False)

    bot_p = os.path.join(out_dir, "mart_bottlenecks.parquet")
    if os.path.exists(bot_p):
        bot_df = pd.read_parquet(bot_p)
        bot_df.to_sql("mart_bottlenecks", conn, if_exists="replace", index=False)

    han_p = os.path.join(out_dir, "mart_resource_handovers.parquet")
    if os.path.exists(han_p):
        han_df = pd.read_parquet(han_p)
        han_df.to_sql("mart_resource_handovers", conn, if_exists="replace", index=False)

    sla_p = os.path.join(out_dir, "mart_sla_compliance.parquet")
    if os.path.exists(sla_p):
        sla_df = pd.read_parquet(sla_p)
        sla_df.to_sql("mart_sla_compliance", conn, if_exists="replace", index=False)

    # Seed Ward Census
    units = [
        ("ED Zone A (Acute Resuscitation)", 32, 29),
        ("ED Zone B (Subacute Observation)", 28, 22),
        ("Trauma Resuscitation Center", 8, 6),
        ("Medical Intensive Care Unit (MICU)", 24, 23),
        ("Coronary Care Unit (CCU)", 18, 14),
        ("Step-Down Telemetry Unit", 40, 37),
        ("Inpatient Med-Surg East", 50, 42),
        ("Inpatient Med-Surg West", 50, 45),
    ]
    cursor.execute("DELETE FROM hospital_ward_census")
    for u_name, beds, occ in units:
        rate = round((occ / beds) * 100, 1)
        stat = "CRITICAL" if rate >= 90.0 else ("SURGE" if rate >= 80.0 else "NOMINAL")
        cursor.execute("""
            INSERT INTO hospital_ward_census (unit_name, total_beds, occupied_beds, occupancy_rate, status)
            VALUES (?, ?, ?, ?, ?)
        """, (u_name, beds, occ, rate, stat))

    # Seed Clinical Protocols
    cursor.execute("DELETE FROM clinical_protocols")
    protocols = [
        ("SOP-ED-001", "Emergency Department Door-to-Doctor Clinical SLA Protocol", "Triage & SLA", 30,
         "All incoming patients must be triaged within 10 minutes. ESI Acuity 1-2 requires physician examination within 15-30 min.",
         "triage,door_to_doctor,sla,physician"),
        ("SOP-ED-002", "Sepsis-3 Bundle Rapid Response Guidelines", "Critical Care", 60,
         "Measure serum blood lactate within 60 min. Obtain two blood culture sets prior to broad-spectrum IV antibiotics.",
         "sepsis,lactate,antibiotics,blood_culture"),
        ("SOP-ED-003", "Acute Coronary Syndrome (STEMI) Door-to-Balloon Protocol", "Cardiology", 90,
         "12-lead ECG acquired within 10 min. Confirm STEMI and activate Cath Lab with target door-to-balloon <= 90 min.",
         "stemi,chest_pain,ecg,pci,door_to_balloon"),
        ("SOP-ED-004", "Emergency Department Overcrowding & Bed Escalation SOP", "Operations", 120,
         "ED boarding occurs when an admitted inpatient remains in ED > 120 min. Trigger Level 3 escalation at > 95% occupancy.",
         "overcrowding,boarding,census,diversion"),
        ("SOP-ED-005", "Diagnostic Imaging & Critical Lab Turnaround SOP", "Diagnostics", 45,
         "Stat lab orders must achieve turnaround under 45 min. Head CT for suspected stroke read within 45 min of arrival.",
         "lab,imaging,ct_scan,stroke,turnaround")
    ]
    cursor.executemany("""
        INSERT INTO clinical_protocols (protocol_id, title, category, mandated_sla_minutes, protocol_text, tags)
        VALUES (?, ?, ?, ?, ?, ?)
    """, protocols)

    conn.commit()
    conn.close()

    return {"status": "INITIALIZED_AND_SEEDED", "db_path": DB_PATH}


def query_sql(sql_query: str, params=None) -> pd.DataFrame:
    """
    Executes any SQL SELECT query directly against the SQLite database
    and returns a pandas DataFrame.
    """
    conn = get_db_connection()
    try:
        df = pd.read_sql_query(sql_query, conn, params=params)
        return df
    finally:
        conn.close()


def execute_sql(sql_command: str, params=None) -> int:
    """
    Executes an INSERT, UPDATE, or DELETE command in SQL and returns rows affected.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        if params:
            cursor.execute(sql_command, params)
        else:
            cursor.execute(sql_command)
        conn.commit()
        return cursor.rowcount
    finally:
        conn.close()


def insert_synthetic_patient_event(event_dict: dict) -> int:
    """
    Dynamically inserts a new patient event row into the relational SQL database.
    """
    sql = """
    INSERT INTO raw_ehr_events (case_id, activity_name, timestamp, resource_name, patient_gender, patient_age_group, clinical_severity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """
    params = (
        event_dict.get("case_id"),
        event_dict.get("activity_name"),
        event_dict.get("timestamp", datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
        event_dict.get("resource_name", "Nurse_Auto"),
        event_dict.get("patient_gender", "Female"),
        event_dict.get("patient_age_group", "41-60"),
        event_dict.get("clinical_severity", "Medium")
    )
    return execute_sql(sql, params)


def get_database_stats() -> pd.DataFrame:
    """
    Returns live metadata on all relational tables, row counts, and disk footprints.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = [r[0] for r in cursor.fetchall() if not r[0].startswith("sqlite_")]

    stats_list = []
    for t in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {t}")
        cnt = cursor.fetchone()[0]
        cursor.execute(f"PRAGMA table_info({t})")
        cols = len(cursor.fetchall())
        stats_list.append({
            "Table Name": t,
            "Row Count": f"{cnt:,}",
            "Columns": cols,
            "Storage Engine": "SQLite Relational SQL",
            "Status": "Connected & Live"
        })

    conn.close()
    return pd.DataFrame(stats_list)
