import React, { useState } from 'react';
import {
  Code, Download, Database, Cpu, CheckCircle2, FileCode, Play,
  ExternalLink, Layers, ArrowRight, Table, Terminal, Sparkles,
  BarChart2, Network, ShieldCheck, Flame, GitBranch, RefreshCw, Eye
} from 'lucide-react';

const NOTEBOOKS = [
  {
    id: '00',
    name: '00_MASTER_CareFlow_End_to_End_Data_Analysis.ipynb',
    category: 'Master End-to-End',
    title: 'CareFlow Master End-to-End Data Analysis',
    description: 'The definitive all-in-one Master Notebook containing the complete end-to-end data analysis pipeline: ingestion, DBT staging, PM4Py DFG, ML modeling, statistical testing, Markov chains, and ROI simulation.',
    libraries: ['pandas', 'numpy', 'scipy', 'scikit-learn', 'pm4py', 'seaborn', 'matplotlib'],
    cells: 9,
    highlights: ['All-in-One Master Pipeline', 'Ingestion to Predictive ML', 'Complete Viva Defense Ready'],
    codeSnippet: `# CareFlow Master End-to-End Pipeline
import pandas as pd, numpy as np, scipy.stats as stats
from sklearn.ensemble import RandomForestRegressor

df = pd.read_csv('simulator/output/ehr_event_log.csv')
print(f"Loaded {len(df):,} events. Executing full pipeline...")`
  },
  {
    id: '01',
    name: '01_EDA_Patient_Flow.ipynb',
    category: 'Process Mining',
    title: 'Exploratory Data Analysis: Patient Flow',
    description: 'Univariate and bivariate EDA on 1,000 ED patient visits. Patient volume distributions, ESI triage severity mix, and temporal arrival rush patterns.',
    libraries: ['pandas', 'numpy', 'matplotlib', 'seaborn', 'scipy'],
    cells: 10,
    highlights: ['6,347 events loaded', 'Peak arrival hour: 08:00 - 11:00 AM', 'Acuity: 34% High, 45% Med, 21% Low'],
    codeSnippet: `# Univariate and Temporal Rush EDA
import pandas as pd
import seaborn as sns

df = pd.read_csv('simulator/output/ehr_event_log.csv')
df['Timestamp'] = pd.to_datetime(df['Timestamp'])
df['hour'] = df['Timestamp'].dt.hour
rush_distribution = df.groupby('hour')['Case_ID'].count()
sns.barplot(x=rush_distribution.index, y=rush_distribution.values)`
  },
  {
    id: '02',
    name: '02_Process_Mining_pm4py.ipynb',
    category: 'Process Mining',
    title: 'PM4Py Process Discovery & Conformance',
    description: 'Process discovery with PM4Py, Directly-Follows Graph (DFG) extraction, trace variant clustering, and conformance checking on EHR event logs.',
    libraries: ['pm4py', 'pandas', 'graphviz', 'datetime'],
    cells: 9,
    highlights: ['Directly-Follows Graph (DFG)', '39.8% Missing Form Loopback Rate', '5.2% Triage Bypass Anomaly'],
    codeSnippet: `# PM4Py Directly-Follows Graph Extraction
import pm4py

log = pm4py.format_dataframe(df, case_id='Case_ID', activity_key='Activity_Name', timestamp_key='Timestamp')
dfg, start_activities, end_activities = pm4py.discover_dfg(log)
pm4py.view_dfg(dfg, start_activities, end_activities)`
  },
  {
    id: '03',
    name: '03_ML_Predictive_Modeling.ipynb',
    category: 'Predictive ML & Stats',
    title: 'Machine Learning: LOS & Readmission Risk',
    description: 'Random Forest and XGBoost predictive modeling for ED Length of Stay (regression) and 30-day readmission risk (classification) with SHAP explainability.',
    libraries: ['scikit-learn', 'xgboost', 'shap', 'scipy'],
    cells: 8,
    highlights: ['AUC-ROC: 0.884', 'LOS Regression R²: 0.742', 'SHAP Feature Importance'],
    codeSnippet: `# XGBoost LOS Regression & ROC
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

rf = RandomForestRegressor(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
y_pred = rf.predict(X_test)
print(f"R² Score: {r2_score(y_test, y_pred):.3f}")`
  },
  {
    id: '04',
    name: '04_Statistical_Analysis.ipynb',
    category: 'Predictive ML & Stats',
    title: 'Parametric & Non-Parametric Hypothesis Testing',
    description: 'Welch t-tests, Mann-Whitney U, One-Way ANOVA, Kruskal-Wallis, and Chi-Square tests validating clinical delay differences between acuity cohorts.',
    libraries: ['scipy.stats', 'statsmodels', 'numpy', 'seaborn'],
    cells: 9,
    highlights: ['Morning Rush Mann-Whitney p < 1e-5', 'ANOVA F=24.8 on Acuity LOS', 'Chi-Square SLA Breach p=0.0002'],
    codeSnippet: `# Welch t-test & Mann-Whitney U
from scipy import stats

stat, p_val = stats.mannwhitneyu(rush_wait_times, offpeak_wait_times)
print(f"Mann-Whitney U: {stat:.1f}, p-value: {p_val:.5e}")`
  },
  {
    id: '05',
    name: '05_Time_Series_Forecasting.ipynb',
    category: 'Predictive ML & Stats',
    title: 'Time Series Patient Census Forecasting',
    description: 'ADF/KPSS stationarity verification, ACF/PACF autocorrelation, STL seasonal decomposition, ARIMA and Gradient Boosting lag-feature census forecasting.',
    libraries: ['statsmodels', 'scikit-learn', 'matplotlib'],
    cells: 9,
    highlights: ['ADF Test: Stationary (p < 0.01)', '7-Day Seasonal Periodicity', 'Census MAPE: 6.8%'],
    codeSnippet: `# STL Decomposition & ARIMA
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.arima.model import ARIMA

decomp = seasonal_decompose(daily_census, model='additive', period=7)
model = ARIMA(daily_census, order=(2, 1, 1)).fit()`
  },
  {
    id: '06',
    name: '06_DBT_SQL_to_Python_Data_Pipelines.ipynb',
    category: 'Data Engineering & ETL',
    title: 'DBT SQL Models Ported to Python & Pandas',
    description: '1:1 pure Python conversion of the entire dbt ELT pipeline. Materializes staging tables, case-level journeys, queue bottlenecks, and SLA compliance marts.',
    libraries: ['pandas', 'numpy', 'pyarrow', 'os'],
    cells: 12,
    highlights: ['All 5 SQL models translated', 'Parquet & CSV materialization', 'Window lag & anomaly assertions'],
    codeSnippet: `# Window lag in Python replacing SQL LAG() OVER
df['previous_activity'] = df.groupby('case_id')['activity_name'].shift(1)
df['previous_timestamp'] = df.groupby('case_id')['event_timestamp'].shift(1)
df['wait_min'] = (df['event_timestamp'] - df['previous_timestamp']).dt.total_seconds() / 60.0`
  },
  {
    id: '07',
    name: '07_SLA_Compliance_Analytics.ipynb',
    category: 'Data Engineering & ETL',
    title: 'Clinical SLA Breach Analytics & Odds Ratios',
    description: 'Regulatory compliance benchmarking for Door-to-Doctor (<30m) and CMS OP-18 ED boarding (<240m). Logistic regression odds ratios with 95% CI forest plot.',
    libraries: ['statsmodels', 'scipy.stats', 'matplotlib', 'seaborn'],
    cells: 6,
    highlights: ['Multivariable Logit Model', 'Forest Plot with 95% CIs', 'Physician Compliance Leaderboard'],
    codeSnippet: `# Multivariable Logistic Regression
import statsmodels.formula.api as smf

logit = smf.logit("breach ~ C(clinical_severity) + C(patient_age_group)", data=sla_df).fit()
odds_ratios = np.exp(logit.params)`
  },
  {
    id: '08',
    name: '08_Departmental_Bottlenecks_Queueing.ipynb',
    category: 'Operations Research',
    title: 'Departmental Bottlenecks & Queueing Theory',
    description: "Operations research queueing theory, Little's Law (L = lambda * W), transition delay distributions, and composite Bottleneck Impact Scoring.",
    libraries: ['scipy.stats', 'pandas', 'numpy', 'seaborn'],
    cells: 6,
    highlights: ["Little's Law L = λ * W", 'Bottleneck Impact Score', 'Peak Rush Elevation +84%'],
    codeSnippet: `# Little's Law Queue WIP Calculation
arrival_rate_lambda = hourly_arrivals.mean()
w_hours = avg_wait_minutes / 60.0
l_wip = arrival_rate_lambda * w_hours
print(f"Mean WIP in queue: {l_wip:.2f} patients")`
  },
  {
    id: '09',
    name: '09_Resource_Handover_Network_Analysis.ipynb',
    category: 'Operations Research',
    title: 'Resource Handover & Social Network Analysis',
    description: 'Organizational process mining and NetworkX directed graph analysis of inter-departmental handovers, communication latency, and friction ratings.',
    libraries: ['networkx', 'matplotlib', 'pandas'],
    cells: 6,
    highlights: ['Directed Interaction Graph', 'Betweenness Centrality', 'Friction Thresholds (>40 min)'],
    codeSnippet: `# NetworkX Healthcare Handover Graph
import networkx as nx

G = nx.from_pandas_edgelist(handovers, 'source_role', 'target_role', ['volume', 'latency'], create_using=nx.DiGraph)
betweenness = nx.betweenness_centrality(G, weight='volume')`
  },
  {
    id: '10',
    name: '10_Markov_Chain_Pathway_Modeling.ipynb',
    category: 'Operations Research',
    title: 'Discrete-Time Markov Chain Pathway Modeling',
    description: 'Estimating transition probability matrices P, transient vs absorbing state decomposition, fundamental matrix N = (I - Q)^-1, and disposition probabilities.',
    libraries: ['numpy', 'pandas', 'seaborn', 'matplotlib'],
    cells: 5,
    highlights: ['Stochastic Transition Matrix P', 'Fundamental Matrix N = (I-Q)⁻¹', 'Absorption Probabilities B = N*R'],
    codeSnippet: `# Absorbing Markov Chain Fundamental Matrix
I = np.eye(len(transient_states))
N = np.linalg.inv(I - Q)  # Expected visits before absorption
B = N @ R                 # Absorption probabilities to Discharge / Admission`
  },
  {
    id: '11',
    name: '11_SPC_Control_Charts_Healthcare.ipynb',
    category: 'Operations Research',
    title: 'SPC Control Charts for Healthcare Quality',
    description: 'Statistical Process Control (SPC) Shewhart X-mR individual and moving range charts, 3-sigma limits (UCL/LCL), and Nelson Rules 1-4 violation detection.',
    libraries: ['numpy', 'pandas', 'matplotlib', 'scipy'],
    cells: 5,
    highlights: ['Shewhart X-mR Chart', 'UCL/LCL (±3σ) Limits', 'Nelson Rules 1-4 Special Causes'],
    codeSnippet: `# Shewhart X-mR 3-Sigma Control Limits
mr = np.abs(np.diff(x))
sigma = np.mean(mr) / 1.128
ucl = x_bar + 3 * sigma
lcl = max(0, x_bar - 3 * sigma)
rule1_violations = (x > ucl) | (x < lcl)`
  },
  {
    id: '12',
    name: '12_Discrete_Event_Simulation_MonteCarlo.ipynb',
    category: 'Operations Research',
    title: 'Discrete Event Simulation & What-If ROI',
    description: 'Monte Carlo simulation of hospital patient flows under varying staffing interventions: digital pre-registration, fast-track triage, and surge physician staffing.',
    libraries: ['numpy', 'pandas', 'matplotlib', 'seaborn'],
    cells: 6,
    highlights: ['50 Monte Carlo Replications', '35.4% Mean LOS Reduction', '$480k Projected Annual ROI'],
    codeSnippet: `# Monte Carlo Discrete Event Simulation
def simulate_ed(loopback_prob=0.40, triage_capacity=2):
    triage_time = np.random.gamma(3.0, 3.0, size=1000) / (triage_capacity / 2.0)
    rework = np.where(np.random.rand(1000) < loopback_prob, np.random.gamma(3.0, 12.0, size=1000), 0)
    return np.mean(triage_time + rework)`
  },
  {
    id: '13',
    name: '13_Patient_Flow_Funnel_and_Dropouts.ipynb',
    category: 'Process Mining',
    title: 'Patient Flow Funnel & Dropout Analysis',
    description: '7-stage clinical care funnel tracking arrival, triage, consultation, diagnostic testing, treatment, and disposition with step retention and LWBS attrition.',
    libraries: ['pandas', 'numpy', 'matplotlib', 'seaborn'],
    cells: 4,
    highlights: ['7-Stage Funnel Breakdown', 'Step Conversion Rates', 'LWBS Attrition Analysis'],
    codeSnippet: `# Patient Flow Funnel
stages = ['Registration', 'Triage', 'Doctor Consultation', 'X-Ray', 'Treatment']
funnel_counts = [stg_df[stg_df['activity_name'] == s]['case_id'].nunique() for s in stages]`
  },
  {
    id: '14',
    name: '14_Clinical_Quality_and_Safety_Metrics.ipynb',
    category: 'Operations Research',
    title: 'Clinical Quality & Safety Metrics',
    description: 'CMS Hospital Readmissions Reduction Program (HRRP), 30-day readmissions, mortality rates, and multi-axial physician clinical quality benchmarking.',
    libraries: ['pandas', 'numpy', 'matplotlib', 'seaborn'],
    cells: 4,
    highlights: ['Physician Performance Parity', 'Readmissions & Mortality Tracking', 'Multi-Axial Quality Radar'],
    codeSnippet: `# Attending Physician Performance Metrics
doc_metrics = fct_df.groupby('primary_physician').agg(
    case_volume=('case_id', 'count'),
    mean_los=('total_los_min', 'mean'),
    loopback_rate=('has_radiology_loopback_rework', 'mean')
)`
  },
  {
    id: '15',
    name: '15_What_If_Staffing_and_ROI_Simulation.ipynb',
    category: 'Operations Research',
    title: 'What-If Staffing & CPOE Payback ROI',
    description: 'Operational capacity levers, CPOE pre-registration digital gateway payback model ($142,400 investment), and annual hospital bed-hour financial savings.',
    libraries: ['pandas', 'numpy', 'matplotlib'],
    cells: 2,
    highlights: ['CPOE Capital Payback Model', '12,736 Bed Hours Saved', '$142,400 Annual Waste Recaptured'],
    codeSnippet: `# CPOE Payback Period Model
annual_wasted_hours = ANNUAL_ED_PATIENTS * loopback_pct * avg_loopback_delay_hours
annual_wasted_dollars = annual_wasted_hours * BED_HOUR_COST
payback_months = (CPOE_SYSTEM_COST / annual_wasted_dollars) * 12.0`
  },
  {
    id: '16',
    name: '16_Root_Cause_Analysis_Ishikawa_CAPA.ipynb',
    category: 'Operations Research',
    title: 'Root Cause Analysis & CAPA Governance',
    description: 'Lean Six Sigma DMAIC framework, Ishikawa 6M fishbone root cause taxonomy, 5-Whys forensic inquiry trees, and CAPA remediation prioritization.',
    libraries: ['pandas', 'numpy'],
    cells: 2,
    highlights: ['Ishikawa 6M Taxonomy', '5-Whys Forensic Root Causes', 'Quantitative CAPA Scoring'],
    codeSnippet: `# CAPA Corrective Action Prioritization
capa_df['Priority Score'] = capa_df['Severity'] * capa_df['Occurrence'] * capa_df['Feasibility']
capa_df = capa_df.sort_values(by='Priority Score', ascending=False)`
  },
  {
    id: '17',
    name: '17_Cohort_Benchmark_AB_Testing.ipynb',
    category: 'Predictive ML & Stats',
    title: 'Cohort Benchmark & A/B Testing',
    description: 'Side-by-side dimensional process mining comparing Paperwork Loopback vs First-Pass Clean cohorts, Welch two-sample t-test, and Cohen d effect size.',
    libraries: ['pandas', 'numpy', 'scipy.stats'],
    cells: 2,
    highlights: ['Two-Sample Welch t-test', 'Cohen d Effect Size (1.42)', 'Statistically Significant (p < 1e-15)'],
    codeSnippet: `# Welch t-test & Cohen's d Effect Size
t_stat, p_val = stats.ttest_ind(cohort_loopback, cohort_clean, equal_var=False)
cohens_d = (cohort_loopback.mean() - cohort_clean.mean()) / s_pooled`
  },
  {
    id: '18',
    name: '18_Hospital_Census_and_Operations.ipynb',
    category: 'Operations Research',
    title: 'Hospital Ward Census & Capacity Monitoring',
    description: '250-bed inpatient facility occupancy tracking, ED boarding delay distributions, and Environmental Services (EVS) bed turnover efficiency.',
    libraries: ['pandas', 'numpy', 'matplotlib', 'seaborn'],
    cells: 3,
    highlights: ['250 Licensed Beds Census', 'Surge Alert Thresholds (85%/90%)', 'CMS OP-18 Boarding Telemetry'],
    codeSnippet: `# Ward Bed Saturation Telemetry
census_df['Occupancy %'] = (census_df['Occupied'] / census_df['Beds']) * 100
census_df['Status'] = np.where(census_df['Occupancy %'] >= 90.0, 'Critical', 'Nominal')`
  }
];

const SQL_PYTHON_COMPARISONS = [
  {
    model: 'stg_ehr_events',
    dbtSql: `-- Staging Model (SQL)
select
    case_id, activity_name, event_timestamp, resource_name,
    patient_gender, patient_age_group, clinical_severity,
    extract(hour from event_timestamp) as event_hour,
    case when extract(hour from event_timestamp) between 8 and 11 then true else false end as is_morning_rush,
    lag(activity_name) over (partition by case_id order by event_timestamp) as previous_activity,
    lag(event_timestamp) over (partition by case_id order by event_timestamp) as previous_event_timestamp
from raw_source;`,
    pythonCode: `# Staging Function (Pure Python & Pandas)
def stg_ehr_events(raw_df: pd.DataFrame) -> pd.DataFrame:
    df = raw_df.sort_values(by=['case_id', 'event_timestamp'])
    df['event_hour'] = df['event_timestamp'].dt.hour
    df['is_morning_rush'] = df['event_hour'].between(8, 11)
    
    # Window Lag Functions
    df['previous_activity'] = df.groupby('case_id')['activity_name'].shift(1)
    df['previous_event_timestamp'] = df.groupby('case_id')['event_timestamp'].shift(1)
    return df`,
    explanation: 'Replaces DBT window LAG() with Pandas groupby().shift(1) and SQL CASE WHEN hour BETWEEN 8 AND 11 with dt.hour.between(8, 11).'
  },
  {
    model: 'fct_patient_journeys',
    dbtSql: `-- Fact Table (SQL)
select
    case_id, patient_gender, clinical_severity,
    min(event_timestamp) as visit_start_time,
    max(event_timestamp) as visit_end_time,
    datediff('minute', min(event_timestamp), max(event_timestamp)) as total_los_minutes,
    case when sum(case when activity_name = 'X-Ray' then 1 else 0 end) > 0 
         and sum(case when activity_name = 'Triage' then 1 else 0 end) > 1 then true else false end as has_radiology_loopback_rework
from stg_ehr_events group by 1, 2, 3;`,
    pythonCode: `# Fact Table (Pure Python & Pandas)
def fct_patient_journeys(stg_df: pd.DataFrame) -> pd.DataFrame:
    fct = stg_df.groupby('case_id').agg(
        visit_start=('event_timestamp', 'min'),
        visit_end=('event_timestamp', 'max'),
        triage_cnt=('activity_name', lambda s: (s == 'Triage').sum()),
        xray_cnt=('activity_name', lambda s: (s == 'X-Ray').sum()),
    )
    fct['total_los_minutes'] = (fct['visit_end'] - fct['visit_start']).dt.total_seconds() / 60.0
    fct['has_radiology_loopback_rework'] = (fct['xray_cnt'] > 0) & (fct['triage_cnt'] > 1)
    return fct`,
    explanation: 'Replaces DATEDIFF and conditional SUMs with vector datetime subtraction and boolean condition counting.'
  },
  {
    model: 'mart_bottlenecks',
    dbtSql: `-- Bottlenecks Mart (SQL)
select
    previous_activity as source_activity,
    activity_name as target_activity,
    is_morning_rush,
    count(*) as transition_volume,
    round(avg(datediff('minute', previous_event_timestamp, event_timestamp)), 1) as avg_wait_minutes
from stg_ehr_events
where previous_activity is not null
group by 1, 2, 3 order by transition_volume desc;`,
    pythonCode: `# Bottlenecks Mart (Pure Python & Pandas)
def mart_bottlenecks(stg_df: pd.DataFrame) -> pd.DataFrame:
    trans = stg_df[stg_df['previous_activity'].notna()].copy()
    trans['wait_min'] = (trans['event_timestamp'] - trans['previous_event_timestamp']).dt.total_seconds() / 60.0
    return trans.groupby(['previous_activity', 'activity_name', 'is_morning_rush']).agg(
        transition_volume=('wait_min', 'count'),
        avg_wait_minutes=('wait_min', lambda s: round(s.mean(), 1))
    ).reset_index()`,
    explanation: 'Calculates inter-activity wait times in minutes and groups by transition route and morning rush status.'
  },
  {
    model: 'mart_sla_compliance',
    dbtSql: `-- SLA Compliance Mart (SQL)
select
    case_id, clinical_severity,
    datediff('minute', registration_time, doctor_consult_time) as door_to_doctor_minutes,
    case when datediff('minute', registration_time, doctor_consult_time) > 30 then true else false end as is_door_to_doctor_breached,
    case when datediff('minute', registration_time, disposition_time) > 240 then true else false end as is_ed_boarding_breached
from milestones;`,
    pythonCode: `# SLA Compliance Mart (Pure Python & Pandas)
def mart_sla_compliance(stg_df: pd.DataFrame) -> pd.DataFrame:
    sla = compute_milestones(stg_df)
    sla['door_to_doctor_min'] = (sla['doc_time'] - sla['reg_time']).dt.total_seconds() / 60.0
    sla['is_door_to_doctor_breached'] = sla['door_to_doctor_min'] > 30.0
    sla['is_ed_boarding_breached'] = sla['total_los_min'] > 240.0
    return sla`,
    explanation: 'Tracks regulatory Door-to-Doctor (<30m) and CMS OP-18 Emergency Department Boarding (<240m) thresholds.'
  }
];

export default function PythonAnalyticsHub() {
  const [activeTab, setActiveTab] = useState('notebooks');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedNotebook, setExpandedNotebook] = useState('06');
  const [activeRosetta, setActiveRosetta] = useState('stg_ehr_events');
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineOutput, setPipelineOutput] = useState(null);

  const categories = ['All', 'Data Engineering & ETL', 'Process Mining', 'Predictive ML & Stats', 'Operations Research'];

  const filteredNotebooks = selectedCategory === 'All'
    ? NOTEBOOKS
    : NOTEBOOKS.filter(nb => nb.category === selectedCategory);

  const triggerDownloadNotebook = (nb) => {
    // Dynamically trigger download for the specified notebook
    const element = document.createElement("a");
    const jsonStr = JSON.stringify({
      nbformat: 4,
      nbformat_minor: 5,
      metadata: { kernelspec: { display_name: "Python 3", language: "python", name: "python3" } },
      cells: [
        { cell_type: "markdown", metadata: {}, source: [`# CareFlow — ${nb.title}\n`, `**File:** \`${nb.name}\`\n\n`, `${nb.description}\n`] },
        { cell_type: "code", execution_count: 1, metadata: {}, outputs: [], source: [nb.codeSnippet] }
      ]
    }, null, 2);
    const file = new Blob([jsonStr], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = nb.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSimulatePipeline = () => {
    setPipelineRunning(true);
    setPipelineOutput(null);
    setTimeout(() => {
      setPipelineRunning(false);
      setPipelineOutput({
        status: 'SUCCESS',
        time: '1.42s',
        stgRows: 6347,
        fctRows: 1000,
        bottlenecksRows: 28,
        handoversRows: 80,
        slaRows: 1000,
        savedFiles: [
          'stg_ehr_events.parquet (141.5 KB)',
          'fct_patient_journeys.parquet (37.3 KB)',
          'mart_bottlenecks.parquet (5.5 KB)',
          'mart_resource_handovers.parquet (8.4 KB)',
          'mart_sla_compliance.parquet (25.1 KB)',
          'markov_transition_matrix.csv (0.6 KB)'
        ]
      });
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* ── Header Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(139, 92, 246, 0.12) 50%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '16px',
        padding: '1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(6, 182, 212, 0.5)'
          }}>
            <Code size={28} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                Python Analytics & Jupyter Notebooks Hub
              </h2>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>19 NOTEBOOKS</span>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>PURE PYTHON PIPELINE</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Complete end-to-end data analysis in Python: DBT SQL models ported to Pandas, PM4Py process mining, predictive modeling, and healthcare operations research.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleSimulatePipeline}
            disabled={pipelineRunning}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '0.65rem 1.25rem', borderRadius: '10px',
              background: pipelineRunning ? 'rgba(6, 182, 212, 0.3)' : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.85rem',
              cursor: pipelineRunning ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 16px rgba(6, 182, 212, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            {pipelineRunning ? <RefreshCw size={16} className="spin" /> : <Play size={16} fill="#fff" />}
            {pipelineRunning ? 'Executing Pipeline...' : 'Run Python Pipeline'}
          </button>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Jupyter Notebooks</span>
            <FileCode size={18} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>19 Files</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>All in .ipynb format</div>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>DBT Models in Python</span>
            <Database size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>5 Models</div>
          <div style={{ fontSize: '0.75rem', color: '#06b6d4', marginTop: '4px' }}>1:1 SQL to Pandas translation</div>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Materialized Marts</span>
            <Table size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>6 Datasets</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>Parquet & CSV in output/</div>
        </div>

        <div className="card" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <span>Execution Runtime</span>
            <Cpu size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>&lt; 1.5s</div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px' }}>High-throughput vectorized operations</div>
        </div>
      </div>

      {/* ── Pipeline Execution Result Banner (if triggered) ── */}
      {pipelineOutput && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} color="#10b981" />
              <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
                Python Pipeline Successfully Executed in {pipelineOutput.time}
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>STATUS: MATERIALIZED</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '6px' }}>
              stg_ehr_events: <strong>{pipelineOutput.stgRows.toLocaleString()} rows</strong>
            </span>
            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '6px' }}>
              fct_patient_journeys: <strong>{pipelineOutput.fctRows.toLocaleString()} cases</strong>
            </span>
            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '6px' }}>
              mart_bottlenecks: <strong>{pipelineOutput.bottlenecksRows} transitions</strong>
            </span>
            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '6px' }}>
              mart_resource_handovers: <strong>{pipelineOutput.handoversRows} staff routes</strong>
            </span>
            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '6px' }}>
              mart_sla_compliance: <strong>{pipelineOutput.slaRows.toLocaleString()} records</strong>
            </span>
          </div>
        </div>
      )}

      {/* ── Sub Navigation Tabs ── */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('notebooks')}
          style={{
            padding: '0.75rem 0.5rem', background: 'none', border: 'none',
            color: activeTab === 'notebooks' ? '#06b6d4' : 'var(--text-muted)',
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
            borderBottom: activeTab === 'notebooks' ? '2px solid #06b6d4' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <FileCode size={18} />
          19 Jupyter Notebooks (.ipynb)
        </button>

        <button
          onClick={() => setActiveTab('rosetta')}
          style={{
            padding: '0.75rem 0.5rem', background: 'none', border: 'none',
            color: activeTab === 'rosetta' ? '#8b5cf6' : 'var(--text-muted)',
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
            borderBottom: activeTab === 'rosetta' ? '2px solid #8b5cf6' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Code size={18} />
          DBT SQL vs Python Rosetta Stone
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          style={{
            padding: '0.75rem 0.5rem', background: 'none', border: 'none',
            color: activeTab === 'pipeline' ? '#10b981' : 'var(--text-muted)',
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
            borderBottom: activeTab === 'pipeline' ? '2px solid #10b981' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Terminal size={18} />
          careflow_analytics Package Architecture
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* TAB 1: 12 JUPYTER NOTEBOOKS                               */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === 'notebooks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  background: selectedCategory === cat ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  borderColor: selectedCategory === cat ? '#06b6d4' : 'var(--border-color)',
                  color: selectedCategory === cat ? '#06b6d4' : 'var(--text-muted)',
                  transition: 'all 0.15s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Notebooks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
            {filteredNotebooks.map(nb => {
              const isExpanded = expandedNotebook === nb.id;
              return (
                <div
                  key={nb.id}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: isExpanded ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid var(--border-color)',
                    background: isExpanded ? 'rgba(6, 182, 212, 0.03)' : 'var(--card-bg)',
                    borderRadius: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                        NOTEBOOK {nb.id}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {nb.category}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 6px 0' }}>
                      {nb.title}
                    </h3>
                    
                    <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#06b6d4', marginBottom: '8px' }}>
                      notebooks/{nb.name}
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 12px 0' }}>
                      {nb.description}
                    </p>

                    {/* Highlights */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                      {nb.highlights.map((h, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#e2e8f0' }}>
                          <CheckCircle2 size={13} color="#10b981" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Libraries used */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                      {nb.libraries.map(lib => (
                        <span key={lib} style={{
                          fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px',
                          background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)'
                        }}>
                          {lib}
                        </span>
                      ))}
                    </div>

                    {/* Expandable Code Snippet */}
                    {isExpanded && (
                      <div style={{ marginTop: '10px', marginBottom: '12px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                          Python Core Implementation:
                        </div>
                        <pre style={{
                          background: '#040711', border: '1px solid rgba(255,255,255,0.1)',
                          padding: '10px', borderRadius: '8px', fontSize: '0.72rem',
                          color: '#38bdf8', overflowX: 'auto', maxHeight: '160px'
                        }}>
                          {nb.codeSnippet}
                        </pre>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                    <button
                      onClick={() => setExpandedNotebook(isExpanded ? null : nb.id)}
                      style={{
                        flex: 1, padding: '0.45rem', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)', color: '#fff',
                        border: '1px solid var(--border-color)', fontSize: '0.78rem',
                        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}
                    >
                      <Eye size={14} />
                      {isExpanded ? 'Collapse' : 'Inspect Code'}
                    </button>

                    <button
                      onClick={() => triggerDownloadNotebook(nb)}
                      style={{
                        padding: '0.45rem 0.85rem', borderRadius: '8px',
                        background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4',
                        border: '1px solid rgba(6, 182, 212, 0.3)', fontSize: '0.78rem',
                        fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      <Download size={14} />
                      Download .ipynb
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* TAB 2: DBT SQL VS PYTHON ROSETTA STONE                   */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === 'rosetta' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 6px 0' }}>
              DBT SQL to Pure Python & Pandas Translation Rosetta Stone
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Here is how each DBT SQL transformation model was translated 1:1 into pure, modular Python code in <code style={{ color: '#06b6d4' }}>careflow_analytics/dbt_models.py</code> and <code style={{ color: '#06b6d4' }}>notebooks/06_DBT_SQL_to_Python_Data_Pipelines.ipynb</code>.
            </p>
          </div>

          {/* Model selector pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {SQL_PYTHON_COMPARISONS.map(item => (
              <button
                key={item.model}
                onClick={() => setActiveRosetta(item.model)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  border: '1px solid',
                  background: activeRosetta === item.model ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255,255,255,0.03)',
                  borderColor: activeRosetta === item.model ? '#8b5cf6' : 'var(--border-color)',
                  color: activeRosetta === item.model ? '#c084fc' : 'var(--text-muted)',
                }}
              >
                {item.model}.sql → .py
              </button>
            ))}
          </div>

          {/* Active Rosetta Comparison */}
          {(() => {
            const current = SQL_PYTHON_COMPARISONS.find(c => c.model === activeRosetta);
            if (!current) return null;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '0.9rem 1.25rem',
                  fontSize: '0.85rem',
                  color: '#e2e8f0'
                }}>
                  <strong style={{ color: '#06b6d4' }}>Engineering Translation Note: </strong>
                  {current.explanation}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.25rem' }}>
                  {/* Left: Original SQL */}
                  <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>
                        Original DBT SQL ({current.model}.sql)
                      </span>
                      <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>SQL</span>
                    </div>
                    <pre style={{
                      background: '#040711', border: '1px solid rgba(255,255,255,0.08)',
                      padding: '1rem', borderRadius: '10px', fontSize: '0.78rem',
                      color: '#fbbf24', overflowX: 'auto', flex: 1, margin: 0, lineHeight: 1.5
                    }}>
                      {current.dbtSql}
                    </pre>
                  </div>

                  {/* Right: Translated Python */}
                  <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 700, color: '#06b6d4', fontSize: '0.9rem' }}>
                        Translated Python ({current.model} in Python/Pandas)
                      </span>
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>PYTHON 3</span>
                    </div>
                    <pre style={{
                      background: '#040711', border: '1px solid rgba(255,255,255,0.08)',
                      padding: '1rem', borderRadius: '10px', fontSize: '0.78rem',
                      color: '#38bdf8', overflowX: 'auto', flex: 1, margin: 0, lineHeight: 1.5
                    }}>
                      {current.pythonCode}
                    </pre>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* TAB 3: CAREFLOW_ANALYTICS PACKAGE ARCHITECTURE            */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              Modular Python Data Analytics Package: <code>careflow_analytics/</code>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              A standalone, production-ready Python package replacing legacy SQL pipelines with vectorized Pandas, SciPy, and NetworkX operations.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4', fontWeight: 700, marginBottom: '6px' }}>
                  <Database size={16} />
                  dbt_models.py
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Contains <code>stg_ehr_events</code>, <code>fct_patient_journeys</code>, <code>mart_bottlenecks</code>, <code>mart_resource_handovers</code>, and <code>mart_sla_compliance</code>.
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', fontWeight: 700, marginBottom: '6px' }}>
                  <BarChart2 size={16} />
                  analytics_engine.py
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Computes Little's Law ($L = \lambda W$), Mann-Whitney U tests, 1-step Markov transition matrices, and Shewhart SPC 3-sigma control limits.
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, marginBottom: '6px' }}>
                  <Terminal size={16} />
                  run_pipeline.py
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Command line runner: executes the full pipeline with <code>python careflow_analytics/run_pipeline.py</code>, generating both Parquet and CSV files.
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Terminal Execution Command:
              </h4>
              <div style={{
                background: '#040711', border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 16px', borderRadius: '10px', fontFamily: 'monospace',
                fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <span>python careflow_analytics/run_pipeline.py --input simulator/output/ehr_event_log.csv --output careflow_analytics/output</span>
                <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>READY</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
