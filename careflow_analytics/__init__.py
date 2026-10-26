"""
CareFlow Python Analytics Suite
Translates all dbt SQL data transformations and models into high-performance Python & Pandas.
"""

from .dbt_models import (
    stg_ehr_events,
    fct_patient_journeys,
    mart_bottlenecks,
    mart_resource_handovers,
    mart_sla_compliance,
    run_full_dbt_python_pipeline
)
from .analytics_engine import (
    calculate_queue_metrics,
    calculate_markov_matrix,
    calculate_spc_limits
)
from .ml_engine import (
    train_ml_models,
    predict_single_patient,
    train_custom_user_model
)
from .genai_engine import (
    generate_clinical_discharge_summary,
    generate_sbar_handover,
    audit_clinical_protocol_rag,
    generate_synthetic_ehr_cohort,
    explain_process_bottleneck_ai
)
from .data_engineering import (
    run_data_quality_suite,
    get_medallion_stats
)
from .database import (
    get_db_connection,
    init_sql_database,
    query_sql,
    execute_sql,
    insert_synthetic_patient_event,
    get_database_stats
)

__version__ = "2.2.0"
__all__ = [
    "stg_ehr_events",
    "fct_patient_journeys",
    "mart_bottlenecks",
    "mart_resource_handovers",
    "mart_sla_compliance",
    "run_full_dbt_python_pipeline",
    "calculate_queue_metrics",
    "calculate_markov_matrix",
    "calculate_spc_limits",
    "train_ml_models",
    "predict_single_patient",
    "generate_clinical_discharge_summary",
    "generate_sbar_handover",
    "audit_clinical_protocol_rag",
    "generate_synthetic_ehr_cohort",
    "explain_process_bottleneck_ai",
    "run_data_quality_suite",
    "get_medallion_stats",
    "get_db_connection",
    "init_sql_database",
    "query_sql",
    "execute_sql",
    "insert_synthetic_patient_event",
    "get_database_stats"
]
