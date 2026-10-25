# CareFlow — Data Analytics & Process Mining Engineering Workflow
## Enterprise Hospital Intelligence & Python Data Analysis Architecture

### 1. Multi-Layer System Architecture
```
[EHR Telemetry Engine (Python & HL7/FHIR)]
        │
        ▼ (Raw Chronological Event Stream: 1,000 cases / 6,347 events)
[Pure Python & Pandas Data Engineering Layer (careflow_analytics)]
   ├── stg_ehr_events.py           (Standardization, rush hour flags, shift(1) lag windows)
   ├── fct_patient_journeys.py     (Case LOS duration, loopback flags, triage skip audit)
   ├── mart_bottlenecks.py         (Departmental transition wait minutes by rush slot)
   ├── mart_sla_compliance.py      (Door-to-Doctor, Door-to-X-Ray, CMS OP-18 ED boarding flags)
   ├── mart_resource_handovers.py  (Inter-role communication latency & friction scoring)
   └── analytics_engine.py         (Little's Law L=λW, Markov transitions, Shewhart SPC limits)
        │
        ▼ (Materialized Data Marts: Parquet & CSV in output/)
[Complete Suite of 12 Jupyter Notebooks (.ipynb)]
   ├── 01_EDA_Patient_Flow.ipynb                    (Univariate & temporal rush EDA)
   ├── 02_Process_Mining_pm4py.ipynb                (Directly-Follows Graph DFG & discovery)
   ├── 03_ML_Predictive_Modeling.ipynb              (Random Forest, XGBoost, SHAP explainability)
   ├── 04_Statistical_Analysis.ipynb                (Welch t-test, Mann-Whitney U, ANOVA, Chi-sq)
   ├── 05_Time_Series_Forecasting.ipynb             (ADF/KPSS, STL decomposition, ARIMA census)
   ├── 06_DBT_SQL_to_Python_Data_Pipelines.ipynb   (Complete DBT SQL to Python ETL translation)
   ├── 07_SLA_Compliance_Analytics.ipynb           (Regulatory compliance & logistic regression OR)
   ├── 08_Departmental_Bottlenecks_Queueing.ipynb   (Operations Research & Little's Law queueing)
   ├── 09_Resource_Handover_Network_Analysis.ipynb (NetworkX directed staff interaction graph)
   ├── 10_Markov_Chain_Pathway_Modeling.ipynb       (Discrete-time Markov chains & absorbing states)
   ├── 11_SPC_Control_Charts_Healthcare.ipynb      (Shewhart X-mR & Nelson rules 1-4 SPC)
   └── 12_Discrete_Event_Simulation_MonteCarlo.ipynb (Monte Carlo capacity sweeps & What-If ROI)
        │
        ▼ (Enterprise Hospital Command Center)
[Executive React 19 + Vite Dashboard UI]
   ├── Process Map & Interactive Token Simulator
   ├── Python Analytics & Jupyter Notebooks Hub (Download 12 .ipynb & inspect code)
   ├── Hospital Operations Command Center (250-bed census, CMS measures)
   ├── Clinical SLA & Rapid-Response Escalation Console
   ├── Patient Flow Funnel & Dropout Analysis
   ├── Clinical Quality, Readmission & Mortality Metrics
   ├── SPC Control Charts (Shewhart X-bar, Nelson Rules)
   ├── Markov State Transition Matrix & Absorption Probabilities
   ├── Cohort A/B Comparative Process Mining Engine
   ├── Inter-Departmental Resource Handover Matrix
   ├── Root Cause Analysis & CAPA Remediation Tracker
   ├── Visual Analytics & Multiaxial Physician Evaluation
   └── What-If ROI Optimization Sandbox ($142.4K CPOE Payback)
```

---

### 2. Complete Suite of 12 Jupyter Notebooks (`.ipynb`)

| # | Notebook File | Core Focus | Python Libraries | Key Deliverables & Findings |
|---|---------------|------------|------------------|-----------------------------|
| **01** | [`01_EDA_Patient_Flow.ipynb`](file:///d:/Careflow/notebooks/01_EDA_Patient_Flow.ipynb) | Exploratory Data Analysis | `pandas`, `seaborn`, `matplotlib` | 1,000 cases, 6,347 events, peak morning arrival curve (8-11 AM) |
| **02** | [`02_Process_Mining_pm4py.ipynb`](file:///d:/Careflow/notebooks/02_Process_Mining_pm4py.ipynb) | Process Mining & Discovery | `pm4py`, `graphviz`, `pandas` | DFG extraction, 39.8% radiology loopback discovery, 5.2% triage bypass |
| **03** | [`03_ML_Predictive_Modeling.ipynb`](file:///d:/Careflow/notebooks/03_ML_Predictive_Modeling.ipynb) | Predictive Modeling & ML | `scikit-learn`, `xgboost`, `shap` | LOS Regression ($R^2=0.742$), Readmission Classifier (AUC-ROC 0.884) |
| **04** | [`04_Statistical_Analysis.ipynb`](file:///d:/Careflow/notebooks/04_Statistical_Analysis.ipynb) | Hypothesis Testing | `scipy.stats`, `statsmodels` | Welch t-test, Mann-Whitney U ($p < 10^{-5}$), One-Way ANOVA, Chi-Square |
| **05** | [`05_Time_Series_Forecasting.ipynb`](file:///d:/Careflow/notebooks/05_Time_Series_Forecasting.ipynb) | Temporal Census Forecasting | `statsmodels`, `scikit-learn` | ADF stationarity ($p < 0.01$), STL 7-day seasonality, ARIMA model (MAPE 6.8%) |
| **06** | [`06_DBT_SQL_to_Python_Data_Pipelines.ipynb`](file:///d:/Careflow/notebooks/06_DBT_SQL_to_Python_Data_Pipelines.ipynb) | DBT SQL to Python ETL | `pandas`, `pyarrow`, `numpy` | 1:1 translation of all 5 SQL models, Parquet & CSV materialization |
| **07** | [`07_SLA_Compliance_Analytics.ipynb`](file:///d:/Careflow/notebooks/07_SLA_Compliance_Analytics.ipynb) | SLA Breach Analysis | `statsmodels`, `scipy.stats` | Multivariable Logit Model, Odds Ratios (OR) Forest Plot with 95% CIs |
| **08** | [`08_Departmental_Bottlenecks_Queueing.ipynb`](file:///d:/Careflow/notebooks/08_Departmental_Bottlenecks_Queueing.ipynb) | Operations Research | `scipy.stats`, `pandas` | Little's Law ($L = \lambda W$), queue sizing, bottleneck impact scoring |
| **09** | [`09_Resource_Handover_Network_Analysis.ipynb`](file:///d:/Careflow/notebooks/09_Resource_Handover_Network_Analysis.ipynb) | Social Network Analysis | `networkx`, `matplotlib` | Directed staff handover graph, Betweenness Centrality, friction ratings |
| **10** | [`10_Markov_Chain_Pathway_Modeling.ipynb`](file:///d:/Careflow/notebooks/10_Markov_Chain_Pathway_Modeling.ipynb) | Markov Chain Modeling | `numpy`, `pandas`, `seaborn` | Stochastic matrix $P$, Fundamental Matrix $N = (I-Q)^{-1}$, absorption $B = NR$ |
| **11** | [`11_SPC_Control_Charts_Healthcare.ipynb`](file:///d:/Careflow/notebooks/11_SPC_Control_Charts_Healthcare.ipynb) | Statistical Process Control | `numpy`, `scipy`, `matplotlib` | Shewhart $X-mR$ chart, 3-sigma control limits, Nelson Rules 1-4 tests |
| **12** | [`12_Discrete_Event_Simulation_MonteCarlo.ipynb`](file:///d:/Careflow/notebooks/12_Discrete_Event_Simulation_MonteCarlo.ipynb) | Discrete Event Simulation | `numpy`, `seaborn`, `matplotlib` | 50 Monte Carlo runs, 35.4% LOS reduction, $480K annual economic ROI |

---

### 3. DBT SQL to Pure Python Rosetta Stone

| DBT SQL Model | Pure Python Function | Key Transformations & Replacements | Output Mart |
|---|---|---|---|
| `stg_ehr_events.sql` | `stg_ehr_events()` | Replaces `LAG() OVER` with `groupby().shift(1)`. Replaces SQL `CASE WHEN EXTRACT(hour)` with `dt.hour.between(8, 11)`. | `stg_ehr_events.parquet` / `.csv` |
| `fct_patient_journeys.sql` | `fct_patient_journeys()` | Replaces `DATEDIFF` with vector datetime subtraction. Replaces conditional `SUM(CASE WHEN)` with boolean aggregations. | `fct_patient_journeys.parquet` / `.csv` |
| `mart_bottlenecks.sql` | `mart_bottlenecks()` | Computes transition deltas, average wait times, median wait times, and partitions by morning rush. | `mart_bottlenecks.parquet` / `.csv` |
| `mart_resource_handovers.sql` | `mart_resource_handovers()` | Tracks source and target clinical roles, handover latency, and assigns friction classifications. | `mart_resource_handovers.parquet` / `.csv` |
| `mart_sla_compliance.sql` | `mart_sla_compliance()` | Computes Door-to-Doctor, Triage-to-XRay, and CMS OP-18 ED boarding breach status flags. | `mart_sla_compliance.parquet` / `.csv` |

---

### 4. Running the Complete Python Data Pipeline
To execute the end-to-end Python pipeline from the command line:

```bash
python careflow_analytics/run_pipeline.py
```

This command will:
1. Load raw EHR logs from `simulator/output/ehr_event_log.csv`.
2. Materialize all 5 DBT models in pure Python with Pandas.
3. Compute Little's Law queue metrics, Markov transition matrices, and SPC control limits.
4. Save clean columnar Parquet and CSV files to `careflow_analytics/output/`.
