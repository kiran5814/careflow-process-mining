-- Final process-mining Event Log: Case_ID, Activity_Name, Timestamp (+ attributes)
select
    case_id,
    activity_name,
    `timestamp`,
    doctor,
    age_group
from {{ ref('stg_ehr_events') }}
order by case_id, `timestamp`
