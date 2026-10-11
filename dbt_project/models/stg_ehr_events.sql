-- Staging: clean raw EHR logs (trim, standardise names, drop nulls and duplicates)
with cleaned as (
    select
        patient_id as case_id,
        case
            when lower(trim(event_name)) in ('registration') then 'Registration'
            when lower(trim(event_name)) in ('triage') then 'Triage'
            when lower(trim(event_name)) in ('x-ray', 'xray') then 'X-Ray'
            when lower(trim(event_name)) in ('doctor consultation', 'dr consult') then 'Doctor Consultation'
            when lower(trim(event_name)) in ('lab test') then 'Lab Test'
            when lower(trim(event_name)) in ('treatment') then 'Treatment'
            when lower(trim(event_name)) in ('discharge') then 'Discharge'
            else 'Unknown'
        end as activity_name,
        event_time as `timestamp`,
        doctor,
        age_group
    from {{ source('careflow', 'raw_ehr_events') }}
    where event_time is not null
)
select distinct * from cleaned where activity_name != 'Unknown'
