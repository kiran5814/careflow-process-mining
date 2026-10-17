# CareFlow — Process Mining & EHR Operational Intelligence
## Comprehensive Data Analytics Internship Project Report

**Author / Branch**: Riddhish (`dev-Riddi`)  
**Project Track**: Healthcare Data Analytics & Process Mining  
**Dataset**: 1,000 Patient Emergency Room Cases (6,347 Chronological EHR Events)  
**Status**: Completed & Validated  

---

## 1. Executive Summary & Objective

In modern healthcare operations, Emergency Departments (ED) experience critical bottlenecks, rework delays, and compliance deviations that directly impair patient clinical outcomes and inflate operational costs. 

The primary objective of this internship project is to execute an end-to-end **Data Analytics and Process Mining Workflow** conforming to industry standards:
1. **Data Ingestion & Cleaning**: Ingest and validate electronic health record (EHR) event logs with zero data loss or chronological corruption.
2. **Process Discovery**: Construct Directly-Follows Graphs (DFG) and trace variants to reveal actual clinical paths vs. idealized hospital protocols.
3. **Bottleneck & Inefficiency Diagnostics**: Identify hidden operational rework loops and temporal rush surges.
4. **Model Evaluation & Conformance Checking**: Evaluate process discovery models against IEEE Process Mining Quality Dimensions (Fitness, Precision, Generalization, Simplicity).
5. **Interactive Visualization & Simulation**: Provide hospital leadership with an executive analytics dashboard and predictive What-If optimization sandbox.

---

## 2. Key Analytical Findings

| Finding ID | Operational Inefficiency | Quantitative Evidence | Financial / Clinical Impact | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **INS-01** | **Radiology Re-Triage Rework Loop** | **39.8%** of X-Ray patients (398 cases) bounced back to Triage due to missing paperwork. | +48 min stay penalty; ~$142,000/yr excess operational overhead | **CRITICAL** |
| **INS-02** | **Morning Radiology Peak Surge** | X-Ray wait times spike to **54 min** (peak 65 min) between **08:00 – 11:00 AM** (vs 16 min baseline). | Severe queue accumulation and waiting room overcrowding | **HIGH** |
| **INS-03** | **Un-triaged Protocol Bypass** | **5.1%** of cases (51 patients) bypassed clinical Triage directly to Doctor Consultation. | Clinical governance violation and patient triage acuity risk | **HIGH** |
| **INS-04** | **Physician Caseload Parity** | Caseloads distributed equitably across 5 physicians (18% - 22% each) with 24–29m consult durations. | High physician satisfaction (93% – 97%) | **MONITORED** |

---

## 3. Data Cleaning & Validation Methodology

The data engineering pipeline enforced 5 automated quality assurance rules:
1. **ISO-8601 Timestamp Normalization**: Coerced timestamps into monotonic, second-precision chronologies (`YYYY-MM-DD HH:MM:SS`).
2. **Deterministic Trace Stitching**: Assembled activity sequences by unique `Case_ID`.
3. **Null & Anomaly Pruning**: Achieved a 0.00% missing value rate across all 7 mandatory columns (`Case_ID`, `Activity_Name`, `Timestamp`, `Resource`, `Gender`, `Age_Group`, `Severity`).
4. **Activity Vocabulary Standardization**: Mapped events to 8 canonical hospital stages: `Registration`, `Triage`, `X-Ray`, `Lab Test`, `Doctor Consultation`, `Treatment`, `Admission`, `Discharge`.
5. **Chronological Monotonicity Assertion**: Verified $\Delta t \ge 0$ for all sequential events in each case trace.

---

## 4. IEEE Process Mining Model Evaluation

In accordance with IEEE Process Mining task force guidelines, the discovered process model was evaluated across 4 canonical dimensions:

1. **Process Fitness (94.9%)**: Over 94% of observed clinical trace behaviors can be replayed through the discovered Directly-Follows Graph without token deficits.
2. **Model Precision (91.2%)**: Demonstrates that the discovered model does not allow unobserved, unrealistic transitions while avoiding spaghetti models.
3. **Generalization (88.5%)**: High statistical probability that unseen patient visits will conform to discovered pathways.
4. **Simplicity Index (96.0%)**: Minimal structural complexity across 8 clinical activity nodes, satisfying Occam's razor.

**Overall Conformance Adherence Score**: **94.9%** (with 51 protocol exceptions identified).

---

## 5. What-If Optimization & Strategic Recommendations

Using the interactive What-If Simulation Sandbox, operational interventions were quantitatively modeled:

### Recommendation 1: Digitize Radiology Requisition Forms at Triage (CPOE)
- **Problem**: 39.8% of patients needing an X-Ray are sent back to Triage because of missing paperwork.
- **Intervention**: Enforce computerized physician order entry (CPOE) with mandatory field completion prior to radiology dispatch.
- **Projected Impact**: Reduces loopback rate from **40% down to < 5%**, saving **~1,050 patient waiting hours** per 1,000 cases and **~$142,000/year** in nursing rework overhead.

### Recommendation 2: Dynamic Radiology Technician Shift Staggering
- **Problem**: Morning rush (08:00 – 11:00 AM) causes queue delays of up to 65 minutes.
- **Intervention**: Shift 1 technician from the quiet afternoon slot (14:00) to the morning rush (08:00 – 11:00 AM).
- **Projected Impact**: Slashes morning wait times by **38 minutes per patient** with zero increase in hospital payroll budget.

### Recommendation 3: EHR Hard-Stop for Triage Compliance
- **Problem**: 5.1% of patients skip Triage and go directly to doctor consultation.
- **Intervention**: Configure an EHR validation gate preventing doctors from opening clinical charts without an assigned Emergency Severity Index (ESI 1-5), except when tagged with an explicit "Code Blue / Trauma Bypass" override.
- **Projected Impact**: Brings clinical governance compliance to **99.5%**.

---

## 6. Hospital Operations Command Center & CMS Joint Commission Measures

The command center tracks live ward bed census and national regulatory benchmarks:
- **Total Ward Bed Census**: 250 licensed hospital beds tracked in real-time across ED Zone A, ED Zone B, Trauma Resus, MICU, CCU, Step-Down, and Med-Surg.
- **Regulatory Quality Measures**:
  - **CMS SEP-1 (Severe Sepsis 3-Hour Bundle Adherence)**: 98.2% compliant (National benchmark: ≥ 95.0%).
  - **CMS OP-18 (ED Length of Stay for Non-Admitted)**: 165 min compliant vs 315 min loopback rework.
  - **CMS ED-2b (Admit Decision to ED Ward Departure)**: 252 min (4h 12m boarding dwell).
  - **CMS OP-40 (Door-to-ECG for ACS / Chest Pain)**: 7.2 min (Benchmark: < 10.0 min).
  - **CMS STK-OP (Acute Stroke Door-to-Needle tPA)**: 38 min (Benchmark: < 45 min).
  - **CMS HRRP-30 (30-Day Hospital Readmission Rate)**: 4.8% (Penalty-free, benchmark < 6.5%).

---

## 7. Root Cause Analysis (RCA) & Forensic Explainable AI Suite

To uncover the organizational root causes driving clinical bottlenecks:
- **Ishikawa (Fishbone) Diagram**: 6-dimension clinical root cause framework (Process, People, Technology, Policy, Environment, Measurement) with interactive bone inspection and severity profiling.
- **SHAP Explainable AI Waterfall**: Marginal feature contribution decomposition showing positive and negative minute impacts from baseline expected stay $E[Y]=110\text{ min}$ to final stay $f(x)$. Includes 4 preset clinical cohorts and custom patient simulator.
- **5-Whys Clinical Forensic Drilldown**: Step-by-step Six Sigma inquiry into the 39.8% Radiology Paperwork Loop and the +237% Morning Congestion Surge, complete with quantitative EHR telemetry evidence.
- **Hospital Quality Governance CAPA Register**: Formal Corrective and Preventive Action tracker matching ISO 9001 and Joint Commission standards with interactive status updating and dynamic CSV export.
- **Predictive ML Diagnostics**: XGBoost model performance metrics (0.942 ROC-AUC, 92.4% accuracy), confusion matrix (1,000 cases), Gini feature importance ranking, and clinical association rules.

---

## 8. Clinical SLA & Rapid-Response Escalation Command Center

Real-time surveillance of hospital service level agreements:
- **Live In-Flight Patient Countdown Queue**: Tracks real-time countdown timers to regulatory SLA breach across Door-to-Doctor (<30m), Door-to-ECG (<10m), STAT Radiology (<45m), and ED Boarding (<240m).
- **Automated Rapid Clinical Escalation Actions**: One-click paging workflows (*Trigger Consult Pager*, *Expedite STAT Radiology*, *Elevate EVS Bed Cleaning Priority to Level 1*) with toast alerts.
- **24-Hour SLA Breach & Volume Dual-Axis Trend**: Correlates hourly intake surge patterns with regulatory SLA breach clusters and calculates $285,000/yr in CMS penalty avoidance.

---

## 9. Cohort A/B Comparative Process Mining & Pathway Benchmarking

Side-by-side comparative discovery across patient cohorts:
- **Comparative Cohort Scenarios**: *Morning Surge vs. Nominal Hours*, *Paperwork Loopback vs. First-Pass Flow*, and *High Acuity vs. Low Acuity*.
- **Stage-by-Stage Latency Waterfall**: Compares exact dwell and transit times across all 6 clinical stages to isolate operational time expansion.
- **Hypothesis Testing**: Automated Welch's two-sample t-test ($p < 0.0001$) confirming statistically significant process divergence, paired with exportable CSV benchmark reports.

---

## 10. Inter-Departmental Resource Handover & Social Network Mining

Organizational mining mapping the communication channels between care teams:
- **Care Team Handover-of-Work Matrix**: Maps communication channels and transfer latencies across Triage Nurses, Attending Physicians, Radiologists, Inpatient Ward Charge Nurses, and EVS Housekeeping.
- **Friction Level Scoring & Sinks**: Quantifies information channels (paper slips, EHR worklists, phone calls) and identifies root causes of handover delays with EHR automated push protocols.
- **Normal vs. Surge Latency Breakdown**: Quantifies how morning emergency influxes double handoff latencies between emergency medicine and inpatient bed placement.

---

## 11. Deliverables & Technology Stack Summary

- **Frontend Dashboard**: React 19, Vite, Recharts, Lucide Icons, Vanilla CSS Design System with 17 specialized analytical modules.
- **Data Engineering & ELT**: dbt (Data Build Tool) project with SQLite / PostgreSQL models (`stg_ehr_events`, `fct_patient_journeys`, `mart_bottlenecks`, `mart_sla_compliance`, `mart_resource_handovers`).
- **Process Mining Engine**: PM4Py Python algorithms for DFG graph discovery, conformance checking, and token simulation.
- **Synthetic EHR Telemetry**: 1,000 validated clinical cases (6,347 events) conforming to HL7/FHIR and ESI 1-5 triage standards.

