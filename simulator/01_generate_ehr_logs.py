"""
Step 1: EHR simulator for CareFlow.
Generates a raw, messy Emergency Room event log with deliberate inefficiencies:
  - ~40% of patients are sent BACK to Triage after X-Ray (missing paperwork)
  - some patients skip steps (non-compliant paths)
Output: ../data/raw_ehr_events.csv
Run:    python 01_generate_ehr_logs.py
"""
import random
from datetime import datetime, timedelta
import pandas as pd

random.seed(42)
N_PATIENTS = 5000
DOCTORS = ["Dr. Rao", "Dr. Mehta", "Dr. Khan", "Dr. Iyer", "Dr. Singh"]
AGE_GROUPS = ["0-17", "18-40", "41-60", "60+"]

# Messy activity names, as a real EHR would produce them (cleaned later in dbt)
MESSY = {
    "Registration": ["Registration", "registration ", "REGISTRATION"],
    "Triage": ["Triage", "triage", "TRIAGE "],
    "X-Ray": ["X-Ray", "xray", "X-RAY"],
    "Doctor Consultation": ["Doctor Consultation", "doctor consultation", "Dr Consult"],
    "Lab Test": ["Lab Test", "lab test"],
    "Treatment": ["Treatment", "treatment"],
    "Discharge": ["Discharge", "discharge", "DISCHARGE "],
}

def minutes(lo, hi):
    return timedelta(minutes=random.uniform(lo, hi))

rows = []
start_day = datetime(2026, 9, 1, 0, 0, 0)

for i in range(1, N_PATIENTS + 1):
    case_id = f"P{i:05d}"
    doctor = random.choice(DOCTORS)
    age = random.choices(AGE_GROUPS, weights=[15, 35, 30, 20])[0]
    t = start_day + timedelta(days=random.randint(0, 29),
                              hours=random.choice([8, 9, 10, 11, 12, 14, 16, 18, 20]),
                              minutes=random.randint(0, 59))

    path = [("Registration", 0)]
    path.append(("Triage", random.uniform(3, 12)))
    path.append(("X-Ray", random.uniform(10, 35)))

    # Bottleneck: 40% sent back to Triage after X-Ray (missing form)
    if random.random() < 0.40:
        path.append(("Triage", random.uniform(15, 40)))
        path.append(("X-Ray", random.uniform(10, 25)))

    if random.random() < 0.35:
        path.append(("Lab Test", random.uniform(15, 50)))

    # 5% skip the doctor (non-compliant path)
    if random.random() > 0.05:
        path.append(("Doctor Consultation", random.uniform(20, 60)))

    path.append(("Treatment", random.uniform(10, 45)))
    path.append(("Discharge", random.uniform(5, 20)))

    for activity, gap in path:
        t = t + timedelta(minutes=gap)
        rows.append({
            "patient_id": case_id,
            "event_name": random.choice(MESSY[activity]),
            "event_time": t.strftime("%Y-%m-%d %H:%M:%S"),
            "doctor": doctor,
            "age_group": age,
        })

df = pd.DataFrame(rows)

# Add messiness: a few duplicate rows and missing timestamps
dups = df.sample(40, random_state=1)
df = pd.concat([df, dups]).sample(frac=1, random_state=2).reset_index(drop=True)
df.loc[df.sample(15, random_state=3).index, "event_time"] = None

df.to_csv("../data/raw_ehr_events.csv", index=False)
print(f"Wrote {len(df)} rows for {N_PATIENTS} patients -> ../data/raw_ehr_events.csv")
