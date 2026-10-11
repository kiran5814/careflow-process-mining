-- Bottleneck table: average minutes between consecutive activities
with ordered as (
    select
        case_id,
        activity_name,
        `timestamp`,
        lead(activity_name) over (partition by case_id order by `timestamp`) as next_activity,
        lead(timestamp)     over (partition by case_id order by `timestamp`) as next_time
    from {{ ref('event_log') }}
)
select
    activity_name as from_activity,
    next_activity as to_activity,
    count(*) as transitions,
    round(avg(timestamp_diff(next_time, `timestamp`, minute)), 1) as avg_minutes
from ordered
where next_activity is not null
group by 1, 2
order by avg_minutes desc
