-- Staging model: Raw EHR event logs standardized with proper typing and case tracking
with raw_source as (
    select
        cast(Case_ID as varchar(50)) as case_id,
        cast(Activity_Name as varchar(100)) as activity_name,
        cast(Timestamp as timestamp) as event_timestamp,
        cast(Resource as varchar(100)) as resource_name,
        cast(Gender as varchar(20)) as patient_gender,
        cast(Age_Group as varchar(20)) as patient_age_group,
        cast(Severity as varchar(20)) as clinical_severity
    from {{ source('careflow_raw', 'raw_ehr_events') }}
)

select
    case_id,
    activity_name,
    event_timestamp,
    resource_name,
    patient_gender,
    patient_age_group,
    clinical_severity,
    -- Extract hour of arrival for rush detection
    extract(hour from event_timestamp) as event_hour,
    case 
        when extract(hour from event_timestamp) between 8 and 11 then true 
        else false 
    end as is_morning_rush,
    -- Window functions for transition delta calculations
    lag(activity_name) over (partition by case_id order by event_timestamp) as previous_activity,
    lag(event_timestamp) over (partition by case_id order by event_timestamp) as previous_event_timestamp
from raw_source
