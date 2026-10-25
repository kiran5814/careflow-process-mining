# Week 2 - CareFlow Process-Mining Workflow

## Proposed Workflow
1. Obtain an available and authorised hospital event-log dataset.
2. Inspect the columns, data types, missing values, and duplicate records.
3. Identify the case identifier, activity name, and event timestamp.
4. Clean and prepare the event log for analysis.
5. Use process-mining methods to examine activity sequences and bottlenecks.
6. Summarise findings for dashboard presentation.

## Event-Log Data Requirements
A typical event log may contain:
- Case ID: identifies a patient journey or process instance.
- Activity: records an event such as registration or consultation.
- Timestamp: records when the activity occurred.
- Resource: optionally identifies the department or role involved.

Use only authorised data and avoid exposing patient-identifying information.

## Project Components
- dashboard: intended for presenting analytical results.
- pm4py_engine: intended for process-mining logic.
- dbt_project: intended for data transformation workflows.
- simulator: intended for simulated process scenarios.
- docs: project documentation.

These descriptions indicate intended roles; verify the actual implementation before presenting them as completed features.

## Progress Record
Document the actual Week 2 work here. Include files implemented, tests performed, and findings observed. Mark unfinished tasks as pending.
