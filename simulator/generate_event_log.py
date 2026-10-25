"""Generate a clearly synthetic hospital event log for CareFlow practice.

This script does not use real patient information. It creates fictional cases so
that the event-log cleaning and process-analysis workflow can be tested.
Run from the repository root: python simulator/generate_event_log.py
"""
from __future__ import annotations

import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "sample_event_log.csv"
RANDOM_SEED = 42

BASE_ACTIVITIES = [
    "Patient Registration",
    "Initial Assessment",
    "Doctor Consultation",
    "Lab Test",
    "Treatment Decision",
    "Discharge",
]


def main() -> None:
    rng = random.Random(RANDOM_SEED)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    rows: list[dict[str, str]] = []
    start_date = datetime(2026, 1, 1, 8, 0)

    for case_number in range(1, 31):
        case_id = f"CF{case_number:04d}"
        current_time = start_date + timedelta(
            days=(case_number - 1) // 10,
            minutes=rng.randint(0, 240),
        )

        activities = BASE_ACTIVITIES.copy()
        # Fictional workflow variation: some cases do not require a lab test.
        if case_number % 4 == 0:
            activities.remove("Lab Test")
        # A few fictional cases revisit consultation after lab results.
        if case_number % 7 == 0 and "Lab Test" in activities:
            activities.insert(activities.index("Treatment Decision"), "Doctor Consultation")

        for step, activity in enumerate(activities, start=1):
            if step > 1:
                # Varied gaps make waiting-time analysis meaningful.
                gap_minutes = rng.randint(5, 35)
                if activity == "Doctor Consultation":
                    gap_minutes += rng.randint(10, 90)
                elif activity == "Lab Test":
                    gap_minutes += rng.randint(20, 120)
                current_time += timedelta(minutes=gap_minutes)

            rows.append(
                {
                    "case_id": case_id,
                    "activity": activity,
                    "timestamp": current_time.isoformat(timespec="seconds"),
                    "resource": rng.choice(["Registration Desk", "Nurse", "Doctor", "Lab Team"]),
                    "event_order": str(step),
                }
            )

    with OUTPUT.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(
            csv_file,
            fieldnames=["case_id", "activity", "timestamp", "resource", "event_order"],
        )
        writer.writeheader()
        writer.writerows(rows)

    print(f"Created {len(rows)} synthetic events across 30 fictional cases.")
    print(f"Output: {OUTPUT}")
    print("Reminder: this is generated practice data, not real hospital data.")


if __name__ == "__main__":
    main()
