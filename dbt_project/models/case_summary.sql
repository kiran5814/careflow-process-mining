-- One row per patient: length of stay + loop-back flag (feeds PowerBI KPIs & slicers)
with seq as (
    select
        case_id, activity_name, `timestamp`, doctor, age_group,
        lag(activity_name) over (partition by case_id order by `timestamp`) as prev_activity
    from {{ ref('event_log') }}
)
select
    case_id,
    any_value(doctor)    as doctor,
    any_value(age_group) as age_group,
    min(`timestamp`)     as arrival_time,
    max(`timestamp`)     as departure_time,
    timestamp_diff(max(`timestamp`), min(`timestamp`), minute) as los_minutes,
    max(case when activity_name = 'Triage' and prev_activity = 'X-Ray' then 1 else 0 end) as looped_back
from seq
group by case_id
