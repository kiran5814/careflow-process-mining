"""
CareFlow - Master Python Data Pipeline Runner
Executes the end-to-end Python data transformation and analytics workflow:
1. Standardizes EHR event logs (Staging)
2. Materializes analytical marts (Journeys, Bottlenecks, Handovers, SLA Compliance)
3. Computes Little's Law queue metrics, Markov chains, and SPC control limits
4. Saves high-performance Parquet and CSV files for BI and dashboard ingestion
"""

import sys
import os
import argparse

# Ensure local imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from careflow_analytics.dbt_models import run_full_dbt_python_pipeline
from careflow_analytics.analytics_engine import (
    calculate_queue_metrics,
    calculate_markov_matrix,
    calculate_spc_limits
)


def main():
    parser = argparse.ArgumentParser(description="CareFlow Python Analytics Pipeline")
    parser.add_argument(
        "--input", 
        default="simulator/output/ehr_event_log.csv", 
        help="Path to raw EHR event log CSV"
    )
    parser.add_argument(
        "--output", 
        default="careflow_analytics/output", 
        help="Directory to save analytical marts"
    )
    args = parser.parse_args()

    print("================================================================")
    print("      [CareFlow] End-to-End Python Analytics Pipeline           ")
    print("================================================================")
    print(f" Input:  {args.input}")
    print(f" Output: {args.output}")
    print("----------------------------------------------------------------")

    # Step 1: Run DBT models in pure Python
    marts = run_full_dbt_python_pipeline(args.input, args.output)

    # Step 2: Advanced Operations Research & Markov Analysis
    print(">> [Analytics] Computing Little's Law queue metrics...")
    q_metrics = calculate_queue_metrics(marts["stg_ehr_events"])
    q_metrics.to_csv(os.path.join(args.output, "mart_queue_metrics.csv"), index=False)
    print(f"   Top bottleneck: {q_metrics.iloc[0]['transition']} (avg {q_metrics.iloc[0]['mean_wait_min']} min)")

    print(">> [Analytics] Calculating Markov State Transition Matrix...")
    markov = calculate_markov_matrix(marts["stg_ehr_events"])
    markov["prob_matrix"].to_csv(os.path.join(args.output, "markov_transition_matrix.csv"))
    print(f"   Modeled {len(markov['activities'])} distinct clinical states.")

    print(">> [Analytics] Computing Healthcare SPC Control Limits...")
    fct = marts["fct_patient_journeys"].copy()
    fct["visit_date"] = fct["visit_start_time"].dt.date
    daily_los = fct.groupby("visit_date")["total_los_minutes"].mean()
    spc = calculate_spc_limits(daily_los)
    print(f"   Mean LOS: {spc['centerline']} min | UCL: {spc['ucl']} min | LCL: {spc['lcl']} min")

    print("----------------------------------------------------------------")
    print("[OK] CareFlow Python Analytics Pipeline completed successfully!")
    print("================================================================")


if __name__ == "__main__":
    main()
