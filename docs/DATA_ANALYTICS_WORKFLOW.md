# CareFlow — Data Analytics & Process Mining Engineering Workflow
## Enterprise Hospital Intelligence & 100% Python Architecture

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
[Complete Suite of 19 Jupyter Notebooks (.ipynb)]
   ├── 00_MASTER_CareFlow_End_to_End_Data_Analysis.ipynb (ALL-IN-ONE Master Pipeline)
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
   ├── 12_Discrete_Event_Simulation_MonteCarlo.ipynb (Monte Carlo capacity sweeps & What-If ROI)
   ├── 13_Patient_Flow_Funnel_and_Dropouts.ipynb   (7-Stage Care Funnel & LWBS Analysis)
   ├── 14_Clinical_Quality_and_Safety_Metrics.ipynb (Readmissions, Mortality, Physician Radar)
   ├── 15_What_If_Staffing_and_ROI_Simulation.ipynb (CPOE Digital Payback & Bed-Hour Economics)
   ├── 16_Root_Cause_Analysis_Ishikawa_CAPA.ipynb   (Ishikawa 6M, 5-Whys, CAPA Prioritization)
   ├── 17_Cohort_Benchmark_AB_Testing.ipynb        (Loopback vs Clean Cohort A/B Welch Test)
   └── 18_Hospital_Census_and_Operations.ipynb      (250-Bed Ward Saturation & EVS Telemetry)
        │
        ▼ (Two Enterprise Web Applications)
[Streamlit 100% Pure Python App (app.py) + React 19 / Vite Dashboard]
   ├── Streamlit App: `streamlit run app.py` (Zero external web dependencies, 100% Python)
   └── React + Vite: `npm run dev` (Interactive token simulator, 19-notebook hub)
```

---

### 2. Complete Suite of 19 Jupyter Notebooks (`.ipynb`)

| # | Notebook File | Core Focus | Python Libraries | Key Deliverables & Findings |
|---|---------------|------------|------------------|-----------------------------|
| **00** | [`00_MASTER_CareFlow_End_to_End_Data_Analysis.ipynb`](file:///d:/Careflow/notebooks/00_MASTER_CareFlow_End_to_End_Data_Analysis.ipynb) | **Master End-to-End Pipeline** | `pandas`, `scipy`, `sklearn`, `pm4py` | Complete end-to-end data analysis from raw ingestion to predictive ML in one notebook. |
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
| **13** | [`13_Patient_Flow_Funnel_and_Dropouts.ipynb`](file:///d:/Careflow/notebooks/13_Patient_Flow_Funnel_and_Dropouts.ipynb) | Funnel & Dropout Analysis | `pandas`, `matplotlib`, `seaborn` | 7-stage ED care funnel; Left Without Being Seen (LWBS) attrition factors |
| **14** | [`14_Clinical_Quality_and_Safety_Metrics.ipynb`](file:///d:/Careflow/notebooks/14_Clinical_Quality_and_Safety_Metrics.ipynb) | Quality & Safety Benchmarks | `pandas`, `seaborn` | 30-day readmissions, mortality rates, multi-axial physician performance radar |
| **15** | [`15_What_If_Staffing_and_ROI_Simulation.ipynb`](file:///d:/Careflow/notebooks/15_What_If_Staffing_and_ROI_Simulation.ipynb) | Economic ROI & Payback | `pandas`, `numpy` | CPOE pre-registration digital gateway payback model ($142,400 investment) |
| **16** | [`16_Root_Cause_Analysis_Ishikawa_CAPA.ipynb`](file:///d:/Careflow/notebooks/16_Root_Cause_Analysis_Ishikawa_CAPA.ipynb) | Root Cause Analysis | `pandas`, `numpy` | Ishikawa 6M fishbone root cause taxonomy; 5-Whys; quantitative CAPA prioritization |
| **17** | [`17_Cohort_Benchmark_AB_Testing.ipynb`](file:///d:/Careflow/notebooks/17_Cohort_Benchmark_AB_Testing.ipynb) | Cohort A/B Testing | `scipy.stats`, `pandas` | Paperwork Loopback vs First-Pass Clean cohorts; Welch's t-test; Cohen's $d$ |
| **18** | [`18_Hospital_Census_and_Operations.ipynb`](file:///d:/Careflow/notebooks/18_Hospital_Census_and_Operations.ipynb) | Ward Census Telemetry | `pandas`, `seaborn` | 250-bed ward capacity monitoring; ED boarding dwell times; EVS bed turnover |

---

### 3. Launching the Pure Python Streamlit Web Application
To run the website 100% in Python:

```bash
streamlit run app.py
```
This launches the full CareFlow platform in Python with interactive charts, KPIs, DFG process mining, and 1-click download of all 19 `.ipynb` notebooks.
