"""
Step 2: Load raw CSV into BigQuery (table: careflow.raw_ehr_events).
Before running:  pip install google-cloud-bigquery pandas pyarrow db-dtypes
                 gcloud auth application-default login

Set PROJECT_ID via env var GCP_PROJECT_ID or edit below.
"""
import os
from pathlib import Path

from google.auth.exceptions import DefaultCredentialsError
from google.cloud import bigquery

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "careflow-project-510612")
DATASET = os.getenv("BIGQUERY_DATASET", "careflow")
TABLE = os.getenv("BIGQUERY_TABLE", "raw_ehr_events")

project_root = Path(__file__).resolve().parents[1]
data_path = project_root / "data" / "raw_ehr_events.csv"

if not data_path.exists():
    raise FileNotFoundError(f"Input CSV not found: {data_path}")

try:
    client = bigquery.Client(project=PROJECT_ID)
except DefaultCredentialsError:
    print("BigQuery authentication is not configured.")
    print("Set it with either:")
    print("  gcloud auth application-default login")
    print("or:")
    print("  $env:GOOGLE_APPLICATION_CREDENTIALS='C:/path/to/service-account.json'")
    print(f"Then rerun: python {Path(__file__).resolve()}")
    raise SystemExit(1)

client.create_dataset(bigquery.Dataset(f"{PROJECT_ID}.{DATASET}"), exists_ok=True)

job_config = bigquery.LoadJobConfig(
    source_format=bigquery.SourceFormat.CSV,
    skip_leading_rows=1,
    autodetect=False,
    schema=[
        bigquery.SchemaField("patient_id", "STRING"),
        bigquery.SchemaField("event_name", "STRING"),
        bigquery.SchemaField("event_time", "TIMESTAMP"),
        bigquery.SchemaField("doctor", "STRING"),
        bigquery.SchemaField("age_group", "STRING"),
    ],
    write_disposition="WRITE_TRUNCATE",
)

with open(data_path, "rb") as f:
    job = client.load_table_from_file(f, f"{PROJECT_ID}.{DATASET}.{TABLE}", job_config=job_config)

job.result()
print("Loaded rows:", client.get_table(f"{PROJECT_ID}.{DATASET}.{TABLE}").num_rows)
