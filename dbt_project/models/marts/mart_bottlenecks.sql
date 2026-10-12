-- Mart model: Departmental queue delays and bottleneck analysis
with events as (
    select * from {{ ref('stg_ehr_events') }}
),

transitions as (
    select
        previous_activity as source_activity,
        activity_name as target_activity,
        is_morning_rush,
        datediff('minute', previous_event_timestamp, event_timestamp) as transition_wait_minutes
    from events
    where previous_activity is not null
)

select
    source_activity,
    target_activity,
    is_morning_rush,
    count(*) as transition_volume,
    round(avg(transition_wait_minutes), 1) as avg_wait_minutes,
    round(median(transition_wait_minutes), 1) as median_wait_minutes,
    max(transition_wait_minutes) as max_wait_minutes
from transitions
group by 1, 2, 3
order by transition_volume desc
