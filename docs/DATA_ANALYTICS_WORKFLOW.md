# CareFlow — Data Analytics & Process Mining Engineering Workflow
## Enterprise Hospital Intelligence Architecture Documentation

### 1. Multi-Layer System Architecture
```
[EHR Telemetry Engine (Python & HL7/FHIR)]
        │
        ▼ (Raw Chronological Event Stream: 1,000 cases / 6,347 events)
[Data Transformation & Modeling Layer (dbt ELT)]
   ├── stg_ehr_events.sql           (Timestamp standardization, rush flags, lag windows)
   ├── fct_patient_journeys.sql     (Case LOS duration, loopback flags, triage skip audit)
   ├── mart_bottlenecks.sql         (Departmental transition wait minutes by rush slot)
   ├── mart_sla_compliance.sql      (Door-to-Doctor, Door-to-ECG, ED boarding breach flags)
   └── mart_resource_handovers.sql  (Inter-role communication latency & friction scoring)
        │
        ▼ (Validated Event Logs & Data Marts)
[Process Mining & Discovery Engine (PM4Py)]
   ├── Directly-Follows Graph (DFG) discovery
   ├── Trace variant extraction & frequency Pareto analysis
   ├── IEEE Conformance Evaluation (Fitness 94.9%, Precision 91.2%, Simplicity 96.0%)
   └── Live token-replay animation mechanics
        │
        ▼ (Explainable AI & Forensic Diagnostics)
[Predictive Machine Learning & Forensic Analytics]
   ├── XGBoost Gradient Boosted Classifier (0.942 ROC-AUC, 92.4% accuracy)
   ├── SHAP Explainable AI Waterfall (Marginal minutes attribution from E[Y]=110m)
   ├── Ishikawa (Fishbone) 6-dimension clinical root cause breakdown
   └── 5-Whys Six Sigma forensic inquiry trees
        │
        ▼ (Enterprise Hospital Command Center)
[Executive React 19 + Vite Dashboard UI]
   ├── Process Map & Interactive Token Simulator
   ├── Hospital Operations Command Center (250-bed census, CMS measures)
   ├── Clinical SLA & Rapid-Response Escalation Console
   ├── Cohort A/B Comparative Process Mining Engine
   ├── Inter-Departmental Resource Handover Matrix
   ├── Root Cause Analysis & CAPA Remediation Tracker
   ├── Visual Analytics & Multiaxial Physician Evaluation
   └── What-If ROI Optimization Sandbox ($142.4K CPOE Payback)
```

### 2. Dataset Schema Definition
| Column Name | Type | PM4Py Role | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `Case_ID` | String | Case Identifier | No | Unique patient emergency room encounter (`CASE000001` - `CASE001000`) |
| `Activity_Name` | Categorical | Event Concept | No | Clinical stage (Registration, Triage, X-Ray, Lab Test, Consult, etc.) |
| `Timestamp` | Datetime (UTC) | Temporal Order | No | Exact monotonic timestamp (`YYYY-MM-DD HH:MM:SS`) |
| `Resource` | Categorical | Org Asset | No | Assigned clinical provider, nurse, or technologist |
| `Gender` | Categorical | Demographic | No | Patient gender (`Male`, `Female`) |
| `Age_Group` | Categorical | Demographic | No | Stratified demographic cohort (`0-17`, `18-40`, `41-60`, `61+`) |
| `Severity` | Categorical | Clinical Acuity | No | Emergency triage severity tier (`Low`, `Medium`, `High`, `Resuscitation`) |

### 3. IEEE Process Mining Model Evaluation Matrix
- **Fitness ($F$)**: $94.9\%$ (Trace replayability without token deficit)
- **Precision ($P$)**: $91.2\%$ (Avoidance of underfitting and unobserved paths)
- **Generalization ($G$)**: $88.5\%$ (Generalizability to future emergency arrivals)
- **Simplicity ($S$)**: $96.0\%$ (Occam's razor structural compactness)
- **Overall Quality Index**: $92.7\%$

