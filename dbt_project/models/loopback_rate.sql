-- Share of patients sent back to Triage after X-Ray (the hidden bottleneck)
with seq as (
    select case_id, activity_name,
           lag(activity_name) over (partition by case_id order by `timestamp`) as prev_activity
    from {{ ref('event_log') }}
)
select
    count(distinct case when activity_name = 'Triage' and prev_activity = 'X-Ray' then case_id end) as patients_looped_back,
    count(distinct case_id) as total_patients,
    round(100 * count(distinct case when activity_name = 'Triage' and prev_activity = 'X-Ray' then case_id end)
          / count(distinct case_id), 1) as loopback_pct
from seq
