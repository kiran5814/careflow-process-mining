"""
Step 3 (LOCAL FALLBACK for dbt): cleans raw logs into an event log CSV.
Does exactly what dbt models stg_ehr_events + event_log do, using pandas.
Output: ../data/event_log.csv   (columns: case_id, activity_name, timestamp, doctor, age_group)
"""
import pandas as pd

df = pd.read_csv("../data/raw_ehr_events.csv")
df = df.dropna(subset=["event_time"])
key = df["event_name"].str.strip().str.lower()
mapping = {
    "registration": "Registration", "triage": "Triage",
    "x-ray": "X-Ray", "xray": "X-Ray",
    "doctor consultation": "Doctor Consultation", "dr consult": "Doctor Consultation",
    "lab test": "Lab Test", "treatment": "Treatment", "discharge": "Discharge",
}
df["activity_name"] = key.map(mapping)
df = df.dropna(subset=["activity_name"])
df = df.rename(columns={"patient_id": "case_id", "event_time": "timestamp"})
df["timestamp"] = pd.to_datetime(df["timestamp"])
df = df[["case_id", "activity_name", "timestamp", "doctor", "age_group"]].drop_duplicates()
df = df.sort_values(["case_id", "timestamp"])
df.to_csv("../data/event_log.csv", index=False)
print(f"Clean event log: {len(df)} events, {df.case_id.nunique()} cases -> ../data/event_log.csv")
