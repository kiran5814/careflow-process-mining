-- Mart model: Inter-departmental resource handovers and communication latency
with events as (
    select * from {{ ref('stg_ehr_events') }}
),

handovers as (
    select
        previous_activity as source_activity,
        activity_name as target_activity,
        lag(resource_name) over (partition by case_id order by event_timestamp) as source_resource,
        resource_name as target_resource,
        is_morning_rush,
        datediff('minute', previous_event_timestamp, event_timestamp) as handover_latency_minutes
    from events
    where previous_activity is not null
)

select
    source_activity,
    target_activity,
    coalesce(source_resource, 'Triage Staff') as source_role,
    coalesce(target_resource, 'Clinical Team') as target_role,
    is_morning_rush,
    count(*) as handover_volume,
    round(avg(handover_latency_minutes), 1) as avg_latency_minutes,
    round(median(handover_latency_minutes), 1) as median_latency_minutes,
    max(handover_latency_minutes) as max_latency_minutes,
    case
        when avg(handover_latency_minutes) > 40 then 'Critical Friction'
        when avg(handover_latency_minutes) > 25 then 'Moderate Friction'
        else 'Nominal Velocity'
    end as communication_friction_rating
from handovers
group by 1, 2, 3, 4, 5
order by handover_volume desc
