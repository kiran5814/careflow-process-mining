# CareFlow — Enterprise Clinical Process Mining & Hospital Intelligence

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15-22c55e?logo=d3.js&logoColor=white)](https://recharts.org/)
[![PM4Py](https://img.shields.io/badge/PM4Py-Process_Mining-06b6d4)](https://pm4py.fit.fraunhofer.de/)
[![dbt](https://img.shields.io/badge/dbt-Clinical_ELT-FF694B?logo=dbt&logoColor=white)](https://www.getdbt.com/)
[![Branch](https://img.shields.io/badge/Branch-dev--Riddi-818cf8?logo=git&logoColor=white)](https://github.com/kiran5814/careflow-process-mining/tree/dev-Riddi)
[![Status](https://img.shields.io/badge/Hospital_Status-Surge_Level_2_(Active)-10b981)]()

> **CareFlow** is an institutional-grade healthcare process mining and hospital operations command platform developed for **Metropolitan Academic Medical Center**. It converts continuous Electronic Health Record (EHR) event logs into directly actionable clinical process intelligence, throughput optimization, and regulatory conformance.

---

## 🏥 Hospital Operational Problem Statement

Emergency departments and acute inpatient units face compounding operational bottlenecks:
1. **The Radiology Paperwork Loop**: **39.8%** of patients requiring diagnostic imaging experience repeat nursing triage due to missing manual paper requisition signatures, adding **+48 minutes** of non-clinical dwell time and burning **$142,400 / year** in operational waste.
2. **Morning Surge Congestion (08:00 - 11:00 AM)**: Patient arrival spikes to **102 patients/hour** while single-technician staffing causes radiology queue delays to surge by **+237% (54 min average wait)**.
3. **Inpatient ED Boarding Crisis**: Admitted patients dwell in acute emergency bays for an average of **4h 12m** waiting for inpatient bed turnover, increasing ambulance diversion risk.
4. **Clinical Protocol Governance**: **5.1%** of patients bypass nursing triage acuity assessment directly to doctor consultation without explicit emergency fast-track documentation.

---

## 🚀 Key Modules & System Capabilities

### 1. Hospital Operations Command Center & Ward Census (`HospitalCommandCenter.jsx`)
* **Real-Time Facility Census**: Live occupancy tracking across **250 licensed hospital beds** with automated surge warnings.
* **Unit Bed Saturation BarChart (Recharts)**: Visualizes occupancy across **ED Zone A, ED Zone B, Trauma Resus, MICU, CCU, Step-Down, and Med-Surg** with **85% Advisory** and **90% Critical Saturation** thresholds.
* **ED Boarding & EVS Bed Turnover**: Interactive bed cleaning triggers for Environmental Services (EVS) to expedite patient transfers.
* **Emergency Dispatch Feed**: Live telemetry tracking **Code STEMI**, **Code Sepsis**, and **Trauma Delta** team activations.

### 2. CMS & The Joint Commission Regulatory Quality Measures
* **CMS SEP-1 (Severe Sepsis 3-Hour Bundle Adherence)**: **98.2%** adherence (National benchmark: ≥ 95.0%).
* **CMS OP-18 (Emergency Length of Stay for Non-Admitted)**: 165 min compliant vs 315 min loopback.
* **CMS ED-2b (Admit Decision to ED Departure Boarding)**: 252 min (4h 12m).
* **CMS OP-40 (Door-to-ECG for ACS / Chest Pain)**: **7.2 min** (Benchmark: < 10.0 min).
* **CMS STK-OP (Acute Stroke Door-to-Needle tPA)**: **38 min** (Benchmark: < 45 min).
* **CMS HRRP-30 (30-Day Hospital Readmission Rate)**: **4.8%** (Penalty-free, benchmark < 6.5%).

### 3. Interactive DFG Process Map & Token Simulation (`ProcessMap.jsx`)
* **Directly-Follows Graph (DFG)**: Graph topology automatically discovered from timestamped EHR event logs.
* **Live In-Flight Token Simulation**: Multi-speed (1x, 2x, 4x) animated replay showing patients moving through clinical stages.
* **Clinical Stage Inspector Drawer**: Clicking any node reveals assigned clinical staffing (e.g., *1 Lead Radiologic Tech*), medical equipment (*GE Discovery XR656*), and SLA quality standards.

### 4. Advanced Visual Analytics Workspace (`VisualAnalytics.jsx`)
* **30-Day Cohort Volume, Lead Time & Conformance Dual Trend**: Dual-axis `ComposedChart` pairing daily intake volume with mean stay duration (hours).
* **Activity Execution vs Queue Wait Delay Waterfall**: Highlights that X-Ray wait (42m) and Consult wait (24m) represent **66.6%** of non-clinical waiting waste.
* **Patient Journey Care Funnel**: Ecommerce-grade conversion waterfall from arrival through triage, diagnostics, consultation, treatment, and disposition.
* **Physician Multi-Axial Radar Evaluation**: Evaluates all 5 attending physicians across *Speed*, *Throughput*, *Patient CSAT*, *Guideline Adherence*, and *Inpatient Parity*.

### 5. Enterprise KPI Scorecard & Deep-Dive Forensic Audit (`KpiMetrics.jsx`)
* **14+ Quantitative Metrics**: Organized into *Flow & Velocity*, *Clinical Governance*, *Economics & ROI*, and *Workforce Productivity*.
* **Interactive Deep-Dive Audit Modal**: Clicking any KPI displays:
  * Mathematical formulation & EHR data lineage.
  * 30-day historical variance AreaChart.
  * Prescribed clinical remediation plan.
  * One-click **Export Metric (CSV)** audit report.

### 6. Clinical Case Log Trace Inspector (`CaseExplorer.jsx`)
* **Ecommerce-Grade Data Table**: Column sorting, multi-select checkboxes, search bar, and pagination.
* **Status Indicators**: *Optimal Compliant Flow* (green), *Rework Loop* (amber), and *Protocol Anomaly* (rose).
* **Export Actions**: Export selected or filtered records to standard CSV.

### 7. What-If ROI Simulation Engine (`WhatIfSimulation.jsx`)
* **CPOE Digitalization Payback**: Models net annual savings from eliminating paper form bounce-backs:
  * **Gross Annual Savings**: **$142,400**
  * **Implementation CAPEX**: **$24,000**
  * **Net Year 1 ROI**: **394%** (1.8-month payback period)

### 8. Root Cause Analysis & Forensic Explainable AI (`RootCauseAnalysis.jsx`)
* **Interactive Ishikawa (Fishbone) Diagram**: Joint Commission 6-dimension clinical root cause framework (Process, People, Tech, Policy, Environment, Measurement) with interactive bone inspection and severity profiling.
* **SHAP Explainable AI Waterfall**: Marginal feature contribution decomposition showing positive and negative minute impacts from baseline expected stay $E[Y]=110\text{ min}$ to final stay $f(x)$. Includes 4 preset clinical cohorts and custom patient simulator.
* **Interactive 5-Whys Clinical Forensic Drilldown**: Step-by-step Six Sigma inquiry into the 39.8% Radiology Paperwork Loop and the +237% Morning Congestion Surge, complete with quantitative EHR telemetry evidence.
* **Hospital Quality Governance CAPA Register**: Formal Corrective and Preventive Action tracker matching ISO 9001 and Joint Commission standards with interactive status updating and dynamic CSV export.
* **Predictive ML Diagnostics**: XGBoost model performance metrics (0.942 ROC-AUC, 92.4% accuracy), confusion matrix (1,000 cases), Gini feature importance ranking, and clinical association rules.

### 9. Clinical SLA & Rapid-Response Escalation Engine (`ClinicalSlaCenter.jsx`)
* **Live In-Flight Patient Countdown Queue**: Tracks real-time countdown timers to regulatory SLA breach across Door-to-Doctor (<30m), Door-to-ECG (<10m), STAT Radiology (<45m), and ED Boarding (<240m).
* **Automated Rapid Clinical Escalation Actions**: One-click paging workflows (*Trigger Consult Pager*, *Expedite STAT Radiology*, *Elevate EVS Bed Cleaning Priority to Level 1*) with toast alerts.
* **24-Hour SLA Breach & Volume Dual-Axis Trend**: Correlates hourly intake surge patterns with regulatory SLA breach clusters and calculates $285,000/yr in CMS penalty avoidance.

### 10. Cohort A/B Comparative Process Mining (`CohortBenchmark.jsx`)
* **Side-by-Side Dimensional Benchmarking**: Evaluates clinical pathway divergences across *Morning Surge vs. Nominal Hours*, *Paperwork Loopback vs. First-Pass Flow*, and *High Acuity vs. Low Acuity*.
* **Stage-by-Stage Latency Waterfall**: Compares exact dwell and transit times across all 6 clinical stages to isolate operational time expansion.
* **Hypothesis Significance & Statistical Diagnostics**: Automated Welch's two-sample t-test ($p < 0.0001$) and one-click comparative benchmark CSV export.

### 11. Inter-Departmental Resource Handover & Social Network Mining (`ResourceHandoverNetwork.jsx`)
* **Care Team Handover-of-Work Matrix**: Maps communication channels and transfer latencies across Triage Nurses, Attending Physicians, Radiologists, Inpatient Ward Charge Nurses, and EVS Housekeeping.
* **Friction Level Scoring & Delay Sinks**: Pinpoints communication voids (e.g., telephone call tag, paper requisition transit) and specifies direct EHR automated push protocols.
* **Normal vs. Surge Latency Breakdown**: Quantifies how morning emergency influxes double handoff latencies between emergency medicine and inpatient bed placement.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Dashboard** | React 19, Vite, Recharts, Lucide Icons, Vanilla CSS Design System |
| **Process Mining Engine** | Python, PM4Py (Process Mining for Python), Pandas, NumPy |
| **Data Transformation & ELT** | dbt (Data Build Tool), SQLite / PostgreSQL Event Log Modeling |
| **Architecture Standard** | Healthcare ESI 1-5, HL7/FHIR event schema conventions |

---

## ⚡ Quickstart & Local Installation

### 1. Prerequisites
* **Node.js** (v18 or higher)
* **Python** (v3.10 or higher)
* **Git**

### 2. Clone and Checkout Branch
```bash
git clone https://github.com/kiran5814/careflow-process-mining.git
cd careflow-process-mining
git checkout dev-Riddi
```

### 3. Launch the Hospital Dashboard
```bash
cd dashboard
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🐍 100% Python Data Analytics & Jupyter Notebooks Suite

All data transformations, ELT models, process mining, and clinical operations analytics have been fully ported to **Pure Python** and **Jupyter Notebooks (`.ipynb`)**.

### Complete Suite of 19 Jupyter Notebooks (`.ipynb` in `/notebooks`)
0. [`00_MASTER_CareFlow_End_to_End_Data_Analysis.ipynb`](notebooks/00_MASTER_CareFlow_End_to_End_Data_Analysis.ipynb): **All-in-One Master Data Analysis Pipeline**.
1. [`01_EDA_Patient_Flow.ipynb`](notebooks/01_EDA_Patient_Flow.ipynb): Univariate & temporal rush EDA (1,000 cases / 6,347 events).
2. [`02_Process_Mining_pm4py.ipynb`](notebooks/02_Process_Mining_pm4py.ipynb): PM4Py Directly-Follows Graph (DFG) discovery & conformance.
3. [`03_ML_Predictive_Modeling.ipynb`](notebooks/03_ML_Predictive_Modeling.ipynb): Random Forest & XGBoost predictive modeling with SHAP explainability.
4. [`04_Statistical_Analysis.ipynb`](notebooks/04_Statistical_Analysis.ipynb): Welch t-test, Mann-Whitney U, One-Way ANOVA, Kruskal-Wallis & Chi-Square.
5. [`05_Time_Series_Forecasting.ipynb`](notebooks/05_Time_Series_Forecasting.ipynb): ADF/KPSS stationarity, STL decomposition, and ARIMA census forecasting.
6. [`06_DBT_SQL_to_Python_Data_Pipelines.ipynb`](notebooks/06_DBT_SQL_to_Python_Data_Pipelines.ipynb): 1:1 translation of all 5 dbt SQL models into Python & Pandas.
7. [`07_SLA_Compliance_Analytics.ipynb`](notebooks/07_SLA_Compliance_Analytics.ipynb): Regulatory SLA compliance modeling, multivariable logit & Odds Ratios.
8. [`08_Departmental_Bottlenecks_Queueing.ipynb`](notebooks/08_Departmental_Bottlenecks_Queueing.ipynb): Operations research & Little's Law ($L = \lambda W$) queue sizing.
9. [`09_Resource_Handover_Network_Analysis.ipynb`](notebooks/09_Resource_Handover_Network_Analysis.ipynb): NetworkX social network analysis of healthcare team handovers.
10. [`10_Markov_Chain_Pathway_Modeling.ipynb`](notebooks/10_Markov_Chain_Pathway_Modeling.ipynb): Discrete-Time Markov Chains (DTMC), fundamental matrix $N$, and absorption probabilities.
11. [`11_SPC_Control_Charts_Healthcare.ipynb`](notebooks/11_SPC_Control_Charts_Healthcare.ipynb): Shewhart $X-mR$ control charts and Nelson Rules 1-4 tests for healthcare quality.
12. [`12_Discrete_Event_Simulation_MonteCarlo.ipynb`](notebooks/12_Discrete_Event_Simulation_MonteCarlo.ipynb): Monte Carlo capacity sweeps and What-If staffing ROI simulations.
13. [`13_Patient_Flow_Funnel_and_Dropouts.ipynb`](notebooks/13_Patient_Flow_Funnel_and_Dropouts.ipynb): 7-Stage care funnel and Left Without Being Seen (LWBS) attrition.
14. [`14_Clinical_Quality_and_Safety_Metrics.ipynb`](notebooks/14_Clinical_Quality_and_Safety_Metrics.ipynb): HRRP readmissions, mortality rates, and multi-axial physician radar.
15. [`15_What_If_Staffing_and_ROI_Simulation.ipynb`](notebooks/15_What_If_Staffing_and_ROI_Simulation.ipynb): CPOE pre-registration digital gateway payback model.
16. [`16_Root_Cause_Analysis_Ishikawa_CAPA.ipynb`](notebooks/16_Root_Cause_Analysis_Ishikawa_CAPA.ipynb): Lean Six Sigma Ishikawa 6M fishbone and CAPA prioritization matrix.
17. [`17_Cohort_Benchmark_AB_Testing.ipynb`](notebooks/17_Cohort_Benchmark_AB_Testing.ipynb): Cohort A/B comparative analysis, Welch's t-test, and Cohen's $d$.
18. [`18_Hospital_Census_and_Operations.ipynb`](notebooks/18_Hospital_Census_and_Operations.ipynb): 250-bed ward capacity monitoring, ED boarding, and EVS bed turnover.

### Run the Pure Python Web Application (Streamlit):
```bash
streamlit run app.py
```

### Run the Pure Python Pipeline:
```bash
python careflow_analytics/run_pipeline.py
```
* Generates all analytical marts in both **CSV** and high-performance **Parquet** format in `careflow_analytics/output/`.

---

## 📂 Repository Directory Structure

```
careflow-process-mining/
├── careflow_analytics/             # Production pure Python data engineering & analytics package
│   ├── dbt_models.py               # 1:1 Python translation of all dbt SQL staging & marts
│   ├── analytics_engine.py         # Little's Law, Markov chains & SPC control limit engine
│   ├── run_pipeline.py             # CLI master runner generating Parquet & CSV marts
│   └── output/                     # Materialized analytical marts (Parquet & CSV)
├── notebooks/                      # 12 Production Jupyter Notebooks (.ipynb)
│   ├── 01_EDA_Patient_Flow.ipynb
│   ├── 02_Process_Mining_pm4py.ipynb
│   ├── 03_ML_Predictive_Modeling.ipynb
│   ├── 04_Statistical_Analysis.ipynb
│   ├── 05_Time_Series_Forecasting.ipynb
│   ├── 06_DBT_SQL_to_Python_Data_Pipelines.ipynb
│   ├── 07_SLA_Compliance_Analytics.ipynb
│   ├── 08_Departmental_Bottlenecks_Queueing.ipynb
│   ├── 09_Resource_Handover_Network_Analysis.ipynb
│   ├── 10_Markov_Chain_Pathway_Modeling.ipynb
│   ├── 11_SPC_Control_Charts_Healthcare.ipynb
│   └── 12_Discrete_Event_Simulation_MonteCarlo.ipynb
├── dashboard/                      # Enterprise React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── PythonAnalyticsHub.jsx     # Interactive 12-notebook hub & SQL-to-Python rosetta
│   │   │   ├── PatientFlowFunnel.jsx      # 7-stage patient flow funnel & dropout analysis
│   │   │   ├── ClinicalQualityMetrics.jsx # Readmission, mortality & clinical safety radar
│   │   │   ├── SpcControlCharts.jsx       # Shewhart X-bar & S control charts + Nelson rules
│   │   │   ├── MarkovTransitionMatrix.jsx # DTMC state transition probabilities & absorption
│   │   │   ├── HospitalCommandCenter.jsx  # Ward bed census, CMS measures & ESI protocols
│   │   │   ├── ClinicalSlaCenter.jsx      # Live SLA breach countdowns & rapid-response escalation
│   │   │   ├── CohortBenchmark.jsx        # Side-by-side A/B comparative process mining
│   │   │   ├── ResourceHandoverNetwork.jsx# Care team handover-of-work matrix & friction analysis
│   │   │   ├── VisualAnalytics.jsx       # Recharts area, bar, funnel & radar charts
│   │   │   ├── KpiMetrics.jsx            # 14 enterprise KPIs + deep-dive audit modal
│   │   │   ├── ProcessMap.jsx            # Interactive DFG with live token simulator
│   │   │   ├── BottleneckAnalytics.jsx   # Hourly congestion & shift rebalance simulator
│   │   │   ├── RootCauseAnalysis.jsx     # Ishikawa fishbone, SHAP XAI waterfall & CAPA tracker
│   │   │   ├── CaseExplorer.jsx          # Sortable & paginated clinical trace table
│   │   │   ├── ComplianceChecker.jsx     # Clinical protocol violation auditor
│   │   │   ├── PatientHeatmap.jsx        # 7x24 patient volume density heatmap
│   │   │   ├── LiveActivityFeed.jsx      # Streaming emergency event ticker
│   │   │   ├── WhatIfSimulation.jsx      # Interactive ROI & staffing simulation engine
│   │   │   └── Navbar.jsx                # Multi-group hospital navigation & telemetry
│   │   ├── App.jsx                       # Core application router & state manager
│   │   └── index.css                     # Hospital design tokens & micro-animations
│   └── package.json                      # React 19 + Recharts dependencies
├── dbt_project/                    # Original dbt SQL models for clinical event log transformation
├── pm4py_engine/                   # PM4Py Python process discovery & conformance scripts
├── simulator/                      # Synthetic EHR log generation engine
└── README.md                       # Comprehensive project documentation
```

---

## 👥 Contributors & Branch Attribution
* **Branch**: [`dev-Riddi`](https://github.com/kiran5814/careflow-process-mining/tree/dev-Riddi)
* **Project**: CareFlow — Hospital Process Mining & Operational Intelligence Platform
* **Repository**: [https://github.com/kiran5814/careflow-process-mining](https://github.com/kiran5814/careflow-process-mining)