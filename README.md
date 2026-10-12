# CareFlow – Emergency Room Process Mining

> **Status: temporary README (work in progress).** Structure, results and instructions may change.

An end-to-end process-mining project on a **simulated Emergency Room (EHR) event log**. It generates messy raw data, cleans it (via dbt/BigQuery or locally with pandas), discovers the "as-is" patient flow with PM4Py, finds bottlenecks, and checks conformance against an ideal care pathway. Outputs are designed to feed a Power BI dashboard.

## The story

The simulator deliberately builds in inefficiencies:

- **~40% of patients are sent back to Triage after X-Ray** (missing paperwork) – the hidden bottleneck.
- **~5% skip the Doctor Consultation** – a non-compliant path.
- Messy activity names (`xray`, `TRIAGE `, `Dr Consult`), **40 duplicate rows** and **15 missing timestamps**.

Ideal pathway: `Registration → Triage → X-Ray → Doctor Consultation → Treatment → Discharge` (Lab Test is an allowed optional step).

## Pipeline

```
01 generate ──► raw_ehr_events.csv ──► 02 load to BigQuery ──► dbt models ──► 03b export ──┐
                      │                                                                     ├─► event_log.csv ──► 04 / 05 / 06 ──► output/
                      └────────────────────► 03 clean locally (pandas fallback) ───────────┘
```

| Step | File | What it does |
|------|------|--------------|
| 1 | `01_generate_ehr_logs.py` | Simulates 5,000 patients (Sept 2026) with messy names, duplicates, and nulls → `data/raw_ehr_events.csv` |
| 2 | `02_load_to_bigquery.py` | Loads the raw CSV into BigQuery (`careflow.raw_ehr_events`) |
| 3 | `03_clean_local.py` | **Local fallback** – pandas equivalent of the dbt models → `data/event_log.csv` |
| 3b | `03b_export_from_bigquery.py` | Exports the dbt-built `careflow_dbt.event_log` → `data/event_log.csv` (use *instead of* step 3) |
| 4 | `04_process_discovery.py` | Directly-follows graphs (frequency + performance), variants, Petri net (inductive miner) |
| 5 | `05_bottlenecks.py` | Transition times, loop-back rate, length of stay, per-case summary |
| 6 | `06_conformance.py` | Token-based replay against the ideal Petri net → per-case fitness & compliance |

### dbt models (`models/`)

| File | Purpose |
|------|---------|
| `sources.yml` | Declares the `careflow.raw_ehr_events` source |
| `stg_ehr_events.sql` | Trims/standardises activity names, drops null timestamps and duplicates |
| `event_log.sql` | Final event log: `case_id, activity_name, timestamp, doctor, age_group` |
| `transition_times.sql` | Average minutes between consecutive activities |
| `loopback_rate.sql` | % of patients sent back to Triage after X-Ray |
| `case_summary.sql` | One row per patient: length of stay + loop-back flag |

## Setup

```bash
pip install pandas pm4py graphviz
pip install google-cloud-bigquery pyarrow db-dtypes   # only for the BigQuery route
```

Graphviz must also be installed on your system for PM4Py to render images.

Suggested folder layout (scripts use relative paths and are meant to be run from `scripts/`):

```
careflow/
├── scripts/    # 01–06 .py files
├── models/     # dbt .sql + sources.yml
├── data/       # raw_ehr_events.csv, event_log.csv
└── output/     # generated maps and CSVs
```

## How to run

**Option A – Local only (no cloud needed)**
```bash
cd scripts
python 01_generate_ehr_logs.py
python 03_clean_local.py
python 04_process_discovery.py
python 05_bottlenecks.py
python 06_conformance.py
```

**Option B – BigQuery + dbt**
```bash
cd scripts
python 01_generate_ehr_logs.py
gcloud auth application-default login
export GCP_PROJECT_ID=your-project-id     # optional; defaults are set in the script
python 02_load_to_bigquery.py
# run dbt (dbt run) to build careflow_dbt.* models
python 03b_export_from_bigquery.py        # set PROJECT_ID inside the file first
python 04_process_discovery.py
python 05_bottlenecks.py
python 06_conformance.py
```

> ⚠️ Do **not** commit real GCP project IDs or credentials. Use environment variables.

## Outputs (`output/`)

| File | Description |
|------|-------------|
| `process_map_frequency.png` | Directly-follows "spaghetti" map |
| `process_map_performance.png` | Same map with average time per arrow |
| `petri_net.png` | Petri net from the inductive miner |
| `variants.csv` | Distinct patient paths with counts and % |
| `transition_times.csv` | Average minutes between activities |
| `loopback_summary.csv` | Loop-back patient count and % |
| `case_summary.csv` | Per-patient LOS, doctor, age group, loop-back flag (Power BI) |
| `conformance_per_case.csv` | Per-patient fitness and compliance flag (Power BI) |

## Event log schema

| Column | Description |
|--------|-------------|
| `case_id` | Patient ID (`P00001`…) |
| `activity_name` | Cleaned activity |
| `timestamp` | Event time |
| `doctor` | Attending doctor |
| `age_group` | `0-17`, `18-40`, `41-60`, `60+` |

## Known notes / TODO

- Replace the placeholder `YOUR_PROJECT_ID` in `03b_export_from_bigquery.py` (and avoid hard-coding the project ID in `02_load_to_bigquery.py`).
- Add key findings (loop-back %, avg length of stay, conformance %) once the pipeline has been run.
- Add Power BI dashboard screenshots.
- Add `requirements.txt` and `dbt_project.yml`.
- Data is **fully synthetic** – no real patient information.
