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

## 📂 Repository Directory Structure

```
careflow-process-mining/
├── dashboard/                      # Enterprise React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── HospitalCommandCenter.jsx  # Ward bed census, CMS measures & ESI protocols
│   │   │   ├── VisualAnalytics.jsx       # Recharts area, bar, funnel & radar charts
│   │   │   ├── KpiMetrics.jsx            # 14 enterprise KPIs + deep-dive audit modal
│   │   │   ├── ProcessMap.jsx            # Interactive DFG with live token simulator
│   │   │   ├── BottleneckAnalytics.jsx   # Hourly congestion & shift rebalance simulator
│   │   │   ├── CaseExplorer.jsx          # Sortable & paginated clinical trace table
│   │   │   ├── ComplianceChecker.jsx     # Clinical protocol violation auditor
│   │   │   ├── PatientHeatmap.jsx        # 7x24 patient volume density heatmap
│   │   │   ├── LiveActivityFeed.jsx      # Streaming emergency event ticker
│   │   │   ├── WhatIfSimulation.jsx      # Interactive ROI & staffing simulation engine
│   │   │   └── Navbar.jsx                # Two-row hospital navigation & telemetry
│   │   ├── data/
│   │   │   └── processData.js            # Clinical traces, ward census & time series
│   │   ├── App.jsx                       # Core application router & state manager
│   │   └── index.css                     # Hospital design tokens & micro-animations
│   └── package.json                      # React 19 + Recharts dependencies
├── dbt_project/                    # dbt SQL models for clinical event log transformation
├── pm4py_engine/                   # PM4Py Python process discovery & conformance scripts
├── simulator/                      # Synthetic EHR log generation engine
└── README.md                       # Comprehensive project documentation
```

---

## 👥 Contributors & Branch Attribution
* **Branch**: [`dev-Riddi`](https://github.com/kiran5814/careflow-process-mining/tree/dev-Riddi)
* **Project**: CareFlow — Hospital Process Mining & Operational Intelligence Platform
* **Repository**: [https://github.com/kiran5814/careflow-process-mining](https://github.com/kiran5814/careflow-process-mining)