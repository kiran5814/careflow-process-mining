"""
Step 3b: Pull the dbt-cleaned event_log from BigQuery into ../data/event_log.csv
so PM4Py (steps 4-6) can use it. Use this INSTEAD of 03_clean_local.py when you did the dbt step.
"""
from google.cloud import bigquery
PROJECT_ID = "YOUR_PROJECT_ID"   # <-- change this
client = bigquery.Client(project=PROJECT_ID)
df = client.query(f"select * from `{PROJECT_ID}.careflow_dbt.event_log` order by case_id, `timestamp`").to_dataframe()
df.to_csv("../data/event_log.csv", index=False)
print("Exported", len(df), "events")
