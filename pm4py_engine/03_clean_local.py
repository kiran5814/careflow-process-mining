"""
Step 3 (LOCAL FALLBACK for dbt): cleans raw logs into an event log CSV.
Does exactly what dbt models stg_ehr_events + event_log do, using pandas.
Output: ../data/event_log.csv   (columns: case_id, activity_name, timestamp, doctor, age_group)
"""
import pandas as pd

IN_PATH = "../data/raw_ehr_events.csv"
OUT_PATH = "../data/event_log.csv"

MAPPING = {
    "registration": "Registration", "triage": "Triage",
    "x-ray": "X-Ray", "xray": "X-Ray",
    "doctor consultation": "Doctor Consultation", "dr consult": "Doctor Consultation",
    "lab test": "Lab Test", "treatment": "Treatment", "discharge": "Discharge",
}
ACTIVITIES = sorted(set(MAPPING.values()))

# 1. Read only needed columns, with compact dtypes
df = pd.read_csv(
    IN_PATH,
    usecols=["patient_id", "event_name", "event_time", "doctor", "age_group"],
    dtype={"patient_id": "string", "event_name": "string",
           "doctor": "category", "age_group": "category"},
)

# 2. Drop rows with no time, then map activities (vectorized)
df = df.dropna(subset=["event_time"])
df["activity_name"] = (
    df["event_name"].str.strip().str.lower().map(MAPPING)
)
df = df.dropna(subset=["activity_name"])

# 3. Parse timestamps once; invalid values become NaT and are dropped
df["timestamp"] = pd.to_datetime(df["event_time"], errors="coerce")
df = df.dropna(subset=["timestamp"])

# 4. Rename, select, dedupe, sort
df = (
    df.rename(columns={"patient_id": "case_id"})
      [["case_id", "activity_name", "timestamp", "doctor", "age_group"]]
      .drop_duplicates()
      .sort_values(["case_id", "timestamp"], kind="stable")
)

df.to_csv(OUT_PATH, index=False)
print(f"Clean event log: {len(df)} events, {df.case_id.nunique()} cases -> {OUT_PATH}")
