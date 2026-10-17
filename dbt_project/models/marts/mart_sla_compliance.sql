-- Mart model: Clinical SLA compliance monitoring and emergency breach detection
with events as (
    select * from {{ ref('stg_ehr_events') }}
),

patient_milestones as (
    select
        case_id,
        patient_gender,
        patient_age_group,
        clinical_severity,
        min(case when activity_name = 'Registration' then event_timestamp end) as registration_time,
        min(case when activity_name = 'Triage' then event_timestamp end) as triage_time,
        min(case when activity_name = 'X-Ray' then event_timestamp end) as xray_time,
        min(case when activity_name = 'Doctor Consultation' then event_timestamp end) as doctor_consult_time,
        min(case when activity_name = 'Treatment' then event_timestamp end) as treatment_time,
        max(event_timestamp) as disposition_time,
        max(case when activity_name in ('Doctor Consultation', 'Treatment') then resource_name end) as primary_physician
    from events
    group by 1, 2, 3, 4
),

sla_calculations as (
    select
        case_id,
        patient_gender,
        patient_age_group,
        clinical_severity,
        primary_physician,
        registration_time,
        triage_time,
        doctor_consult_time,
        disposition_time,
        -- Door-to-Doctor SLA (Target < 30 minutes)
        datediff('minute', coalesce(registration_time, triage_time), doctor_consult_time) as door_to_doctor_minutes,
        -- Radiology Wait Time SLA (Target < 45 minutes)
        datediff('minute', triage_time, xray_time) as triage_to_xray_minutes,
        -- Total Emergency Length of Stay (CMS OP-18)
        datediff('minute', coalesce(registration_time, triage_time), disposition_time) as total_ed_los_minutes
    from patient_milestones
)

select
    case_id,
    patient_gender,
    patient_age_group,
    clinical_severity,
    primary_physician,
    door_to_doctor_minutes,
    triage_to_xray_minutes,
    total_ed_los_minutes,
    -- Regulatory SLA Breach Status Flags
    case 
        when door_to_doctor_minutes > 30 then true 
        else false 
    end as is_door_to_doctor_breached,
    case 
        when triage_to_xray_minutes > 45 then true 
        else false 
    end as is_radiology_sla_breached,
    case 
        when total_ed_los_minutes > 240 then true 
        else false 
    end as is_ed_boarding_breached
from sla_calculations
