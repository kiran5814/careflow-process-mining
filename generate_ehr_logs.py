"""
CareFlow - EHR Event Log Simulator (Week 1)

Generates MOCK hospital Emergency Room event logs (no real patient data).
Each row is one event: which patient (Case_ID) did which activity, and when.

Operational inefficiencies are deliberately built in so that process mining
(PM4Py, Week 2+) has real bottlenecks to discover:

  1. ~40% of patients who get an X-Ray are sent BACK to Triage because of a
     missing paperwork form (the loop-back from the project brief).
  2. X-Ray waits are much longer during the morning rush (8-11 AM).
  3. ~5% of patients skip Triage entirely (non-compliant path, used for
     conformance checking in Week 4).
  4. A few patients are rushed through without Registration being logged first.

Usage:
    python generate_ehr_logs.py                  # 5,000 cases
    python generate_ehr_logs.py --cases 20000    # more cases
    python generate_ehr_logs.py --seed 7         # different random data
"""

import argparse
import csv
import os
import random
from datetime import datetime, timedelta

# ----------------------------- Configuration ----------------------------- #

DOCTORS = ["Dr. Sharma", "Dr. Reddy", "Dr. Iyer", "Dr. Khan", "Dr. Patel"]
GENDERS = ["Male", "Female"]
AGE_GROUPS = ["0-17", "18-40", "41-60", "61+"]
SEVERITY = ["Low", "Medium", "High"]

LOOP_BACK_RATE = 0.40        # X-Ray -> back to Triage (missing form)
SKIP_TRIAGE_RATE = 0.05      # non-compliant: no triage
SKIP_REGISTRATION_RATE = 0.03
XRAY_RATE = 0.60             # share of patients who need an X-Ray
LAB_RATE = 0.35              # share of patients who need a lab test
ADMIT_RATE = 0.15            # share admitted instead of discharged

START_DATE = datetime(2026, 1, 1)
DAYS = 90                    # arrivals spread over 90 days

# Arrival volume by hour of day (relative weights): morning and evening peaks
HOUR_WEIGHTS = [
    1, 1, 1, 1, 1, 2,        # 00-05
    3, 5, 9, 10, 9, 7,       # 06-11  (morning rush)
    6, 5, 5, 5, 6, 7,        # 12-17
    8, 8, 6, 4, 3, 2,        # 18-23  (evening bump)
]


# ------------------------------- Helpers --------------------------------- #

def minutes(low, high):
    """Random duration in minutes, rounded to a whole second."""
    return timedelta(minutes=random.uniform(low, high))


def random_arrival():
    day = random.randrange(DAYS)
    hour = random.choices(range(24), weights=HOUR_WEIGHTS)[0]
    return START_DATE + timedelta(
        days=day,
        hours=hour,
        minutes=random.randrange(60),
        seconds=random.randrange(60),
    )


def wait_for(activity, current_time):
    """Waiting time before an activity starts. Bottlenecks live here."""
    hour = current_time.hour
    rush = 8 <= hour <= 11

    if activity == "X-Ray":
        # Deliberate bottleneck: radiology is slow, and worse in the morning
        return minutes(25, 70) if rush else minutes(8, 25)
    if activity == "Triage":
        return minutes(5, 20) if rush else minutes(2, 8)
    if activity == "Doctor Consultation":
        return minutes(15, 45) if rush else minutes(8, 25)
    if activity == "Lab Test":
        return minutes(10, 30)
    if activity == "Registration":
        return minutes(1, 6)
    return minutes(3, 15)


# --------------------------- Case generation ----------------------------- #

def generate_case(case_number):
    """Return a list of event dicts for one patient visit."""
    case_id = f"CASE{case_number:06d}"
    patient = {
        "Gender": random.choice(GENDERS),
        "Age_Group": random.choices(AGE_GROUPS, weights=[15, 40, 28, 17])[0],
        "Severity": random.choices(SEVERITY, weights=[50, 35, 15])[0],
    }
    doctor = random.choice(DOCTORS)

    # Build the sequence of activities for this patient
    path = []

    if random.random() > SKIP_REGISTRATION_RATE:
        path.append("Registration")

    skip_triage = random.random() < SKIP_TRIAGE_RATE
    if not skip_triage:
        path.append("Triage")

    if random.random() < XRAY_RATE:
        path.append("X-Ray")
        # The big hidden bottleneck: sent back to Triage after X-Ray
        if not skip_triage and random.random() < LOOP_BACK_RATE:
            path.append("Triage")        # loop-back (missing form)
            path.append("X-Ray")         # has to repeat the X-Ray

    if random.random() < LAB_RATE:
        path.append("Lab Test")

    path.append("Doctor Consultation")
    path.append("Treatment")
    path.append("Admission" if random.random() < ADMIT_RATE else "Discharge")

    # Turn the path into timestamped events
    events = []
    now = random_arrival()
    for activity in path:
        now += wait_for(activity, now)
        events.append({
            "Case_ID": case_id,
            "Activity_Name": activity,
            "Timestamp": now.strftime("%Y-%m-%d %H:%M:%S"),
            "Resource": doctor if activity in ("Doctor Consultation", "Treatment") else "Staff",
            **patient,
        })
        # Time spent doing the activity itself
        now += minutes(3, 20)

    return events


# --------------------------------- Main ---------------------------------- #

def main():
    parser = argparse.ArgumentParser(description="Generate mock EHR event logs")
    parser.add_argument("--cases", type=int, default=5000, help="number of patient visits")
    parser.add_argument("--seed", type=int, default=42, help="random seed (repeatable data)")
    parser.add_argument("--out", default=os.path.join("output", "ehr_event_log.csv"),
                        help="output CSV path")
    args = parser.parse_args()

    random.seed(args.seed)

    all_events = []
    for i in range(1, args.cases + 1):
        all_events.extend(generate_case(i))

    # Sort by time, like a real EHR system export would be
    all_events.sort(key=lambda e: e["Timestamp"])

    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    fields = ["Case_ID", "Activity_Name", "Timestamp", "Resource",
              "Gender", "Age_Group", "Severity"]
    with open(args.out, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(all_events)

    print(f"Generated {args.cases} cases / {len(all_events)} events")
    print(f"Saved to: {args.out}")


if __name__ == "__main__":
    main()
*** End Patch