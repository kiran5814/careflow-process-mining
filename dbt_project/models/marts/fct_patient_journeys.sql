-- Mart model: Case-level patient journeys with duration and anomaly flags
with events as (
    select * from {{ ref('stg_ehr_events') }}
),

case_aggregates as (
    select
        case_id,
        patient_gender,
        patient_age_group,
        clinical_severity,
        min(event_timestamp) as visit_start_time,
        max(event_timestamp) as visit_end_time,
        count(*) as total_events_count,
        -- Check clinical anomalies
        sum(case when activity_name = 'Triage' then 1 else 0 end) as triage_executions_count,
        sum(case when activity_name = 'X-Ray' then 1 else 0 end) as xray_executions_count,
        sum(case when activity_name = 'Lab Test' then 1 else 0 end) as lab_executions_count,
        max(case when activity_name in ('Doctor Consultation', 'Treatment') then resource_name end) as primary_physician
    from events
    group by 1, 2, 3, 4
)

select
    case_id,
    patient_gender,
    patient_age_group,
    clinical_severity,
    primary_physician,
    visit_start_time,
    visit_end_time,
    total_events_count,
    -- Throughput time in minutes
    datediff('minute', visit_start_time, visit_end_time) as total_los_minutes,
    -- Anomaly & Rework flags
    case 
        when xray_executions_count > 0 and triage_executions_count > 1 then true 
        else false 
    end as has_radiology_loopback_rework,
    case 
        when triage_executions_count = 0 then true 
        else false 
    end as is_triage_bypassed_anomaly
from case_aggregates
