"""
CareFlow - Metropolitan Hospital Clinical Operations & Command Portal
Enterprise Healthcare Operations, Clinical Decision Support, SQL Database & Predictive Analytics
Built with Streamlit, SQLite3, PM4Py, Pandas, SciPy, Scikit-Learn, Plotly & Matplotlib.

Usage:
    streamlit run app.py
"""

import os
import sys
import glob
import json
import time
import datetime
import numpy as np
import pandas as pd
import streamlit as st
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

try:
    import plotly.express as px
    import plotly.graph_objects as go
    HAS_PLOTLY = True
except ImportError:
    px = None
    go = None
    HAS_PLOTLY = False

from scipy import stats

# Ensure careflow_analytics package is accessible
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, BASE_DIR)

from careflow_analytics.database import (
    init_sql_database,
    query_sql,
    execute_sql,
    insert_synthetic_patient_event,
    get_database_stats,
    DB_PATH
)
from careflow_analytics.dbt_models import run_full_dbt_python_pipeline
from careflow_analytics.analytics_engine import (
    calculate_queue_metrics,
    calculate_markov_matrix,
    calculate_spc_limits
)
from careflow_analytics.ml_engine import (
    train_ml_models,
    predict_single_patient,
    train_custom_user_model
)
from careflow_analytics.genai_engine import (
    generate_clinical_discharge_summary,
    generate_sbar_handover,
    audit_clinical_protocol_rag,
    generate_synthetic_ehr_cohort,
    explain_process_bottleneck_ai,
    HOSPITAL_CLINICAL_PROTOCOLS
)
from careflow_analytics.data_engineering import (
    run_data_quality_suite,
    get_medallion_stats
)

# ─── Page Configuration ──────────────────────────────────────────────────────
st.set_page_config(
    page_title="MetroHealth Medical Center — Clinical Command Portal",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Enterprise Clinical Portal Styling
st.markdown("""
<style>
    /* Suppress Streamlit cloud deploy and toolbar popups */
    .stDeployButton,
    div[data-testid="stDeployButton"],
    button[data-testid="stDeployButton"],
    div[data-testid="stToolbarActions"],
    header[data-testid="stHeader"] {
        display: none !important;
        visibility: hidden !important;
    }
    
    /* Institutional Hospital Card Design */
    .hospital-card {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%);
        border: 1px solid rgba(56, 189, 248, 0.25);
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
        margin-bottom: 12px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .hospital-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px -4px rgba(6, 182, 212, 0.25);
        border-color: rgba(56, 189, 248, 0.45);
    }
    .kpi-title {
        color: #94a3b8;
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 4px;
    }
    .kpi-value {
        color: #f8fafc;
        font-size: 1.85rem;
        font-weight: 800;
        line-height: 1.2;
        margin-bottom: 6px;
    }
    .kpi-sub {
        font-size: 0.78rem;
        font-weight: 600;
    }
    .text-emerald { color: #34d399; }
    .text-amber { color: #fbbf24; }
    .text-rose { color: #f87171; }
    .text-cyan { color: #38bdf8; }
    
    .status-badge-green {
        display: inline-flex;
        align-items: center;
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(52, 211, 153, 0.35);
        padding: 5px 14px;
        border-radius: 9999px;
        font-size: 0.82rem;
        font-weight: 600;
        letter-spacing: 0.025em;
    }
    .status-badge-amber {
        display: inline-flex;
        align-items: center;
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
        border: 1px solid rgba(251, 191, 36, 0.35);
        padding: 5px 14px;
        border-radius: 9999px;
        font-size: 0.82rem;
        font-weight: 600;
        letter-spacing: 0.025em;
    }
    .status-badge-cyan {
        display: inline-flex;
        align-items: center;
        background: rgba(6, 182, 212, 0.15);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.35);
        padding: 5px 14px;
        border-radius: 9999px;
        font-size: 0.82rem;
        font-weight: 600;
        letter-spacing: 0.025em;
    }
    
    html {
        scroll-behavior: smooth;
    }
    .stButton > button {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 8px;
        font-weight: 600;
    }
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(6, 182, 212, 0.35);
    }
</style>
""", unsafe_allow_html=True)


# ─── Data Initialization & Live Database Connection ──────────────────────────
@st.cache_resource
def setup_hospital_database():
    return init_sql_database(force_refresh=False)

@st.cache_data(ttl=120)
def load_hospital_records():
    fct_df = query_sql("SELECT * FROM fct_patient_journeys")
    stg_df = query_sql("SELECT * FROM stg_ehr_events")
    sla_df = query_sql("SELECT * FROM mart_sla_compliance")
    bottlenecks_df = query_sql("SELECT * FROM mart_bottlenecks")
    handovers_df = query_sql("SELECT * FROM mart_resource_handovers")
    census_df = query_sql("SELECT * FROM hospital_ward_census")
    db_stats = get_database_stats()
    return fct_df, stg_df, sla_df, bottlenecks_df, handovers_df, census_df, db_stats

@st.cache_resource
def get_hospital_ml_engine():
    fct_df = query_sql("SELECT * FROM fct_patient_journeys")
    return train_ml_models(fct_df)


setup_hospital_database()
fct_df, stg_df, sla_df, bottlenecks_df, handovers_df, census_df, db_stats = load_hospital_records()
ml_bundle = get_hospital_ml_engine()


# ─── Hospital Header ──────────────────────────────────────────────────────────
c_top1, c_top2 = st.columns([2.5, 1])
with c_top1:
    st.markdown("## 🏥 METROPOLITAN HEALTH SYSTEM — EMERGENCY & CLINICAL COMMAND PORTAL")
    st.caption("Main Academic Medical Center · Level 1 Adult & Pediatric Trauma Center · Emergency Services & Critical Care Division")
with c_top2:
    st.markdown("""
        <div style="text-align: right; padding-top: 10px;">
            <span class="status-badge-green">🟢 HOSPITAL STATUS: NOMINAL</span>
            <span class="status-badge-cyan">🏥 ACTIVE CENSUS: 218 / 250 BEDS</span>
            <span class="status-badge-amber">⏱️ ED SURGE: LEVEL 2</span>
        </div>
    """, unsafe_allow_html=True)

st.divider()


# ─── Clinical Sidebar Navigation ──────────────────────────────────────────────
with st.sidebar:
    st.markdown("### 🏥 Hospital Portal")
    st.markdown("**Clinical Operations & Intelligence**")
    st.caption(f"Active Facility: Metropolitan Main Hospital")
    st.caption(f"Live Clinical Shift: Day Shift (07:00 - 19:00)")
    st.divider()

    menu = st.radio(
        "Clinical Navigation",
        [
            "🏥 Hospital Operations & Bed Census",
            "🚨 Triage & Patient Flow Funnel",
            "⏱️ Emergency SLA & Wait-Time Analytics",
            "🔮 Patient Length of Stay Risk & Predictive Triage",
            "📋 Clinical Decision Support & Discharge Summaries",
            "🩺 Physician Performance & Care Quality",
            "📊 Departmental Queues & Operational Bottlenecks",
            "📈 Statistical Process Control (SPC) Quality Charts",
            "🎲 Care Pathway Routing & Transition Matrix",
            "🗄️ Hospital Clinical Records & Query Portal",
            "📓 Clinical Analytics & Research Notebooks (25 .ipynb)"
        ]
    )

    st.divider()
    st.caption("Emergency Department Incident Command System · CMS OP-18 Adherence · Joint Commission Compliant")


# ──────────────────────────────────────────────────────────────────────────────
# 1. HOSPITAL OPERATIONS & BED CENSUS
# ──────────────────────────────────────────────────────────────────────────────
if menu == "🏥 Hospital Operations & Bed Census":
    st.title("🏥 Emergency Room Operations & Live Inpatient Ward Census")
    st.markdown("Real-time facility capacity across 250 licensed hospital beds and emergency throughput.")

    # Clinical Filter Bar
    with st.expander("🔍 Filter Facility Encounters by Patient Cohort", expanded=False):
        col_f1, col_f2, col_f3 = st.columns(3)
        with col_f1:
            filt_sev = st.selectbox("Clinical Severity:", ["All Severities", "High", "Medium", "Low"])
        with col_f2:
            filt_age = st.selectbox("Age Bracket:", ["All Age Groups", "0-17", "18-40", "41-60", "61+"])
        with col_f3:
            filt_doc = st.selectbox("Attending Physician:", ["All Physicians"] + sorted(fct_df["primary_physician"].dropna().unique().tolist()))

    # Apply filters dynamically
    filtered_df = fct_df.copy()
    if filt_sev != "All Severities":
        filtered_df = filtered_df[filtered_df["clinical_severity"] == filt_sev]
    if filt_age != "All Age Groups":
        filtered_df = filtered_df[filtered_df["patient_age_group"] == filt_age]
    if filt_doc != "All Physicians":
        filtered_df = filtered_df[filtered_df["primary_physician"] == filt_doc]

    # Attractive Hospital KPI Grid (6 Rich Cards)
    tot_cases = len(filtered_df)
    mean_stay = filtered_df['total_los_minutes'].mean() if tot_cases > 0 else 0
    tot_occupied = census_df['occupied_beds'].sum()
    tot_beds = census_df['total_beds'].sum()
    overall_occ = (tot_occupied / tot_beds) * 100
    comp_rate = (1 - sla_df['is_door_to_doctor_breached'].mean()) * 100

    kpi_col1, kpi_col2, kpi_col3 = st.columns(3)
    kpi_col4, kpi_col5, kpi_col6 = st.columns(3)

    with kpi_col1:
        st.markdown(f"""
        <div class="hospital-card">
            <div class="kpi-title">Active Emergency Encounters</div>
            <div class="kpi-value">{tot_cases:,}</div>
            <div class="kpi-sub text-emerald">↑ +12.4% vs Previous Week · 100% Ingested</div>
        </div>
        """, unsafe_allow_html=True)

    with kpi_col2:
        st.markdown(f"""
        <div class="hospital-card">
            <div class="kpi-title">Inpatient Bed Saturation</div>
            <div class="kpi-value">{overall_occ:.1f}%</div>
            <div class="kpi-sub text-amber">{tot_occupied} / {tot_beds} Licensed Beds Occupied</div>
        </div>
        """, unsafe_allow_html=True)

    with kpi_col3:
        st.markdown(f"""
        <div class="hospital-card">
            <div class="kpi-title">Mean Emergency Stay</div>
            <div class="kpi-value">{mean_stay:.1f} <span style="font-size: 1rem;">min</span></div>
            <div class="kpi-sub text-emerald">↓ -14.2 min YoY Dwell Improvement</div>
        </div>
        """, unsafe_allow_html=True)

    with kpi_col4:
        st.markdown(f"""
        <div class="hospital-card">
            <div class="kpi-title">Door-to-Doctor SLA Adherence</div>
            <div class="kpi-value">{comp_rate:.1f}%</div>
            <div class="kpi-sub text-emerald">CMS Benchmark Target ≥ 85.0%</div>
        </div>
        """, unsafe_allow_html=True)

    with kpi_col5:
        micu_occ = census_df[census_df["unit_name"].str.contains("MICU|Intensive", case=False)]["occupancy_rate"].values
        micu_val = micu_occ[0] if len(micu_occ) > 0 else 95.8
        st.markdown(f"""
        <div class="hospital-card">
            <div class="kpi-title">Critical Care (MICU) Saturation</div>
            <div class="kpi-value">{micu_val:.1f}%</div>
            <div class="kpi-sub text-rose">⚠ High Capacity Alert · 1 Bed Available</div>
        </div>
        """, unsafe_allow_html=True)

    with kpi_col6:
        st.markdown(f"""
        <div class="hospital-card">
            <div class="kpi-title">Radiology Diagnostic Turnaround</div>
            <div class="kpi-value">32.4 <span style="font-size: 1rem;">min</span></div>
            <div class="kpi-sub text-cyan">8.1 min Faster than 45m SLA Window</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("### 🛏️ Live Inpatient Ward Bed Capacity Telemetry")

    if HAS_PLOTLY:
        fig_census = go.Figure()
        bar_colors = [
            '#ef4444' if r >= 90.0 else ('#f59e0b' if r >= 80.0 else '#10b981')
            for r in census_df['occupancy_rate']
        ]
        fig_census.add_trace(go.Bar(
            y=census_df['unit_name'],
            x=census_df['occupancy_rate'],
            orientation='h',
            marker=dict(color=bar_colors),
            text=[f"{r:.1f}% ({o}/{t} beds)" for r, o, t in zip(census_df['occupancy_rate'], census_df['occupied_beds'], census_df['total_beds'])],
            textposition='outside'
        ))
        fig_census.add_vline(x=85.0, line_dash="dash", line_color="#f59e0b", annotation_text="Hospital Surge (85%)", annotation_position="top right")
        fig_census.add_vline(x=90.0, line_dash="dash", line_color="#ef4444", annotation_text="Critical Saturation (90%)", annotation_position="top right")
        fig_census.update_layout(
            xaxis_title="Bed Occupancy Rate (%)",
            yaxis=dict(autorange="reversed"),
            template="plotly_dark",
            height=380,
            margin=dict(l=10, r=40, t=30, b=30)
        )
        st.plotly_chart(fig_census, use_container_width=True)

        # Hourly Arrival Surge Pattern
        st.markdown("### 📈 24-Hour Patient Arrival Volume & Morning Surge")
        stg_df["event_hour"] = pd.to_datetime(stg_df["event_timestamp"]).dt.hour
        hourly_counts = stg_df[stg_df["activity_name"] == "Registration"].groupby("event_hour").size().reset_index(name="Arrivals")
        if len(hourly_counts) > 0:
            fig_arr = px.area(
                hourly_counts,
                x="event_hour",
                y="Arrivals",
                title="Hourly Emergency Presentation Curve (Peak: 08:00 - 11:00 AM)",
                template="plotly_dark",
                color_discrete_sequence=['#06b6d4']
            )
            fig_arr.add_vrect(x0=8, x1=11, fillcolor="#f59e0b", opacity=0.2, annotation_text="Morning Surge Window", annotation_position="top left")
            fig_arr.update_layout(height=300, xaxis_title="Hour of Day (24h)", yaxis_title="Patient Inflow Volume")
            st.plotly_chart(fig_arr, use_container_width=True)
    else:
        st.dataframe(census_df[["unit_name", "total_beds", "occupied_beds", "occupancy_rate", "status"]], use_container_width=True)


# ──────────────────────────────────────────────────────────────────────────────
# 2. TRIAGE & PATIENT FLOW FUNNEL
# ──────────────────────────────────────────────────────────────────────────────
elif menu == "🚨 Triage & Patient Flow Funnel":
    st.title("🚨 Patient Triage Acuity & Emergency Care Flow Funnel")
    st.markdown("Throughput retention milestones from emergency presentation to final inpatient disposition.")

    fcol1, fcol2 = st.columns([1.5, 1])
    with fcol1:
        stages = ['Registration', 'Triage', 'Doctor Consultation', 'X-Ray', 'Treatment']
        f_counts = [{'Stage': s, 'Volume': stg_df[stg_df['activity_name'] == s]['case_id'].nunique()} for s in stages]
        funnel_df = pd.DataFrame(f_counts)

        if HAS_PLOTLY:
            fig_funnel = px.funnel(
                funnel_df,
                x='Volume',
                y='Stage',
                title="Emergency Care Pathway Funnel Retention",
                template="plotly_dark",
                color_discrete_sequence=['#06b6d4']
            )
            fig_funnel.update_layout(height=360)
            st.plotly_chart(fig_funnel, use_container_width=True)
        else:
            st.dataframe(funnel_df, use_container_width=True)

    with fcol2:
        st.markdown("#### Clinical Severity Mix (ESI Tiers)")
        sev_counts = fct_df['clinical_severity'].value_counts().reset_index()
        sev_counts.columns = ['Severity', 'Count']
        if HAS_PLOTLY:
            fig_pie = px.pie(
                sev_counts,
                values='Count',
                names='Severity',
                hole=0.45,
                template="plotly_dark",
                color='Severity',
                color_discrete_map={'High': '#ef4444', 'Medium': '#f59e0b', 'Low': '#10b981'}
            )
            fig_pie.update_layout(height=360, margin=dict(l=10, r=10, t=30, b=10))
            st.plotly_chart(fig_pie, use_container_width=True)
        else:
            st.dataframe(sev_counts, use_container_width=True)


# ──────────────────────────────────────────────────────────────────────────────
# 3. EMERGENCY SLA & WAIT-TIME ANALYTICS
# ──────────────────────────────────────────────────────────────────────────────
elif menu == "⏱️ Emergency SLA & Wait-Time Analytics":
    st.title("⏱️ Emergency Department SLA & Clinical Wait-Time Analytics")
    st.markdown("Adherence to clinical guidelines: Door-to-Doctor (<30m), Radiology Turnaround (<45m), and Total ED Boarding (<240m).")

    sc1, sc2, sc3 = st.columns(3)
    sc1.metric("Door-to-Doctor Breach Rate", f"{sla_df['is_door_to_doctor_breached'].mean()*100:.1f}%", "Threshold: 30 min")
    sc2.metric("Radiology SLA Breach Rate", f"{sla_df['is_radiology_sla_breached'].mean()*100:.1f}%", "Threshold: 45 min")
    sc3.metric("ED Boarding Breach Rate (>4h)", f"{sla_df['is_ed_boarding_breached'].mean()*100:.1f}%", "CMS OP-18 Threshold")

    st.markdown("### Door-to-Doctor Wait Times by Acuity Tier")
    if HAS_PLOTLY:
        fig_box = px.box(
            sla_df,
            x="clinical_severity",
            y="door_to_doctor_minutes",
            color="clinical_severity",
            title="Door-to-Doctor Consultation Wait Times by Triage Acuity",
            template="plotly_dark",
            color_discrete_sequence=['#f43f5e', '#f59e0b', '#10b981']
        )
        fig_box.add_hline(y=30.0, line_dash="dash", line_color="#ef4444", annotation_text="30-Min Mandated Target", annotation_position="top left")
        fig_box.update_layout(height=360)
        st.plotly_chart(fig_box, use_container_width=True)
    else:
        st.dataframe(sla_df.groupby("clinical_severity")["door_to_doctor_minutes"].describe(), use_container_width=True)


# ──────────────────────────────────────────────────────────────────────────────
# 4. PATIENT LENGTH OF STAY RISK & PREDICTIVE TRIAGE
# ──────────────────────────────────────────────────────────────────────────────
elif menu == "🔮 Patient Length of Stay Risk & Predictive Triage":
    st.title("🔮 Patient Length of Stay Risk & Predictive Triage")
    st.markdown("Predictive clinical intelligence: Early estimation of patient dwell time, live ML model training, and diagnostic evaluation.")

    ml_tabs = st.tabs([
        "⚡ Live Machine Learning Model Trainer & Output",
        "🔮 Real-Time Clinical Intake Simulator",
        "🏆 Model Tournament & Performance",
        "📊 Clinical Factor Importance",
        "📈 Predictive Diagnostic Curves"
    ])

    # TAB 1: LIVE MACHINE LEARNING MODEL TRAINER & OUTPUT
    with ml_tabs[0]:
        st.markdown("### ⚡ Live Machine Learning Model Training & Evaluation Studio")
        st.markdown("Select an algorithm and clinical prediction target to train the model dynamically in real time and inspect performance outputs.")

        with st.form("custom_ml_train_form"):
            t_col1, t_col2, t_col3 = st.columns(3)
            with t_col1:
                sel_algo = st.selectbox(
                    "Select Learning Algorithm:",
                    [
                        "Random Forest Regressor",
                        "Gradient Boosting Regressor",
                        "Ridge Linear Regressor",
                        "Random Forest Classifier",
                        "Logistic Regression"
                    ]
                )
            with t_col2:
                sel_target = st.selectbox(
                    "Prediction Target:",
                    [
                        "Length of Stay (Minutes)",
                        "Prolonged Stay (>150 min Risk)"
                    ]
                )
            with t_col3:
                sel_split = st.slider("Test Set Split Ratio:", min_value=0.15, max_value=0.35, value=0.25, step=0.05)

            h_col1, h_col2 = st.columns(2)
            with h_col1:
                sel_n_est = st.slider("Number of Estimators (n_estimators):", min_value=20, max_value=200, value=100, step=20)
            with h_col2:
                sel_depth = st.slider("Maximum Tree Depth (max_depth):", min_value=2, max_value=12, value=6, step=1)

            btn_train_live = st.form_submit_button("🚀 Train Machine Learning Model Live", use_container_width=True)

        if btn_train_live:
            with st.spinner(f"Training {sel_algo} on 1,000 patient episodes in SQL database..."):
                t_res = train_custom_user_model(
                    fct_df=fct_df,
                    algorithm=sel_algo,
                    n_estimators=sel_n_est,
                    max_depth=sel_depth,
                    test_size=sel_split,
                    target_mode=sel_target
                )

                st.success(f"✅ Successfully trained **{sel_algo}** in **{t_res['train_time_ms']} ms**! Evaluated on {t_res['test_samples']} holdout test cases.")

                # Metric Cards
                m_cols = st.columns(len(t_res["metrics"]))
                for idx, (m_label, m_val) in enumerate(t_res["metrics"].items()):
                    with m_cols[idx]:
                        st.metric(m_label, str(m_val))

                # Visualizing Model Output
                if not t_res["is_classification"] and HAS_PLOTLY:
                    p1, p2 = st.columns(2)
                    with p1:
                        # Actual vs Predicted Scatter
                        scatter_df = pd.DataFrame({
                            "Actual LOS (min)": t_res["res_data"]["y_test"].values,
                            "Predicted LOS (min)": t_res["res_data"]["y_pred"]
                        })
                        fig_act_pred = px.scatter(
                            scatter_df,
                            x="Actual LOS (min)",
                            y="Predicted LOS (min)",
                            title=f"Actual vs Predicted Dwell Time ({sel_algo})",
                            template="plotly_dark",
                            color_discrete_sequence=['#06b6d4'],
                            trendline="ols"
                        )
                        st.plotly_chart(fig_act_pred, use_container_width=True)

                    with p2:
                        # Residuals Histogram
                        fig_resid = px.histogram(
                            t_res["res_data"]["residuals"],
                            nbins=25,
                            title="Residual Error Distribution (Actual - Predicted)",
                            template="plotly_dark",
                            color_discrete_sequence=['#3b82f6']
                        )
                        fig_resid.update_layout(xaxis_title="Residual Error (Minutes)", yaxis_title="Frequency")
                        st.plotly_chart(fig_resid, use_container_width=True)

                elif t_res["is_classification"] and HAS_PLOTLY:
                    p1, p2 = st.columns(2)
                    with p1:
                        # ROC Curve
                        fig_c_roc = go.Figure()
                        fig_c_roc.add_trace(go.Scatter(
                            x=t_res["res_data"]["fpr"],
                            y=t_res["res_data"]["tpr"],
                            mode='lines',
                            line=dict(color='#06b6d4', width=2.5),
                            name=f"ROC (AUC = {t_res['metrics'].get('ROC-AUC', 'N/A')})"
                        ))
                        fig_c_roc.add_trace(go.Scatter(x=[0, 1], y=[0, 1], mode='lines', line=dict(color='gray', dash='dash')))
                        fig_c_roc.update_layout(title="Classifier ROC Curve", template="plotly_dark", height=320)
                        st.plotly_chart(fig_c_roc, use_container_width=True)

                    with p2:
                        # Confusion Matrix
                        fig_c_cm = px.imshow(
                            t_res["res_data"]["cm"],
                            text_auto=True,
                            x=["Routine", "Prolonged"],
                            y=["Routine", "Prolonged"],
                            title="Classifier Confusion Matrix",
                            color_continuous_scale="Crest",
                            template="plotly_dark"
                        )
                        fig_c_cm.update_layout(height=320)
                        st.plotly_chart(fig_c_cm, use_container_width=True)

                # Feature importances from live model
                if t_res["importances"] is not None and HAS_PLOTLY:
                    fig_live_imp = px.bar(
                        t_res["importances"],
                        x="importance",
                        y="feature",
                        orientation='h',
                        title="Live Model Feature Importances",
                        template="plotly_dark",
                        color="importance",
                        color_continuous_scale="Teal"
                    )
                    fig_live_imp.update_layout(yaxis=dict(autorange="reversed"), height=300)
                    st.plotly_chart(fig_live_imp, use_container_width=True)

    # TAB 2: REAL-TIME INTAKE SIMULATOR
    with ml_tabs[1]:
        st.markdown("### 🔮 Real-Time Patient Intake & Length of Stay Estimator")
        st.markdown("Enter patient clinical parameters during triage check-in to compute expected stay and prolonged hospitalization risk.")

        with st.form("triage_pred_form"):
            pcol1, pcol2, pcol3 = st.columns(3)
            with pcol1:
                in_sev = st.selectbox("Triage Acuity Severity", ["Low", "Medium", "High"], index=1)
                in_age = st.selectbox("Patient Age Tier", ["0-17", "18-40", "41-60", "61+"], index=2)
            with pcol2:
                in_gender = st.selectbox("Patient Gender", ["Female", "Male"])
                in_stages = st.slider("Projected Care Stages", min_value=2, max_value=10, value=5)
            with pcol3:
                in_loop = st.checkbox("Radiology Reassessment Loopback", value=False)
                in_bypass = st.checkbox("Fast-Track Triage Bypass", value=False)

            btn_infer = st.form_submit_button("⚡ Compute Patient Risk Score", use_container_width=True)

        patient_input = {
            "severity": in_sev,
            "age": in_age,
            "gender": in_gender,
            "total_events": in_stages,
            "has_loopback": in_loop,
            "is_triage_bypassed": in_bypass
        }
        res = predict_single_patient(ml_bundle, patient_input)

        r1, r2, r3 = st.columns(3)
        r1.metric("Estimated Length of Stay", f"{res['predicted_los_min']:.1f} min", f"{res['predicted_los_hours']:.2f} hours")
        r2.metric("Prolonged Stay (>150m) Risk", f"{res['prolonged_stay_risk_pct']}%", res['risk_tier'])
        r3.metric("Care Pathway Protocol", in_sev + " Acuity Protocol", "Standard Care")

        st.info(f"**Clinical Disposition Guidance:** {res['recommended_action']}")

    # TAB 3: TOURNAMENT BENCHMARK
    with ml_tabs[2]:
        st.markdown("### 🏆 Clinical Predictive Model Benchmark")
        st.dataframe(ml_bundle["benchmarks"], use_container_width=True)

    # TAB 4: FACTOR IMPORTANCE
    with ml_tabs[3]:
        st.markdown("### 📊 Clinical Factors Influencing Dwell Time")
        imp_df = ml_bundle["importances"]
        if HAS_PLOTLY:
            fig_imp = px.bar(
                imp_df,
                x="importance",
                y="feature",
                orientation='h',
                title="Relative Influence of Clinical Predictors",
                template="plotly_dark",
                color="importance",
                color_continuous_scale="Blues"
            )
            fig_imp.update_layout(yaxis=dict(autorange="reversed"), height=350)
            st.plotly_chart(fig_imp, use_container_width=True)

    # TAB 5: DIAGNOSTIC CURVES
    with ml_tabs[4]:
        st.markdown("### 📈 Diagnostic ROC-AUC & Confusion Matrix")
        rc1, rc2 = st.columns(2)
        with rc1:
            if HAS_PLOTLY:
                fig_roc = go.Figure()
                fig_roc.add_trace(go.Scatter(
                    x=ml_bundle["metrics"]["fpr"],
                    y=ml_bundle["metrics"]["tpr"],
                    mode='lines',
                    line=dict(color='#06b6d4', width=2.5),
                    name=f"ROC Curve (AUC = {ml_bundle['metrics']['auc']:.3f})"
                ))
                fig_roc.add_trace(go.Scatter(x=[0, 1], y=[0, 1], mode='lines', line=dict(color='gray', dash='dash')))
                fig_roc.update_layout(title="Receiver Operating Characteristic", template="plotly_dark", height=320)
                st.plotly_chart(fig_roc, use_container_width=True)
        with rc2:
            if HAS_PLOTLY:
                cm = ml_bundle["metrics"]["cm"]
                fig_cm = px.imshow(
                    cm,
                    text_auto=True,
                    x=["Routine", "Prolonged"],
                    y=["Routine", "Prolonged"],
                    title="Diagnostic Confusion Matrix",
                    color_continuous_scale="Crest",
                    template="plotly_dark"
                )
                fig_cm.update_layout(height=320)
                st.plotly_chart(fig_cm, use_container_width=True)


# ──────────────────────────────────────────────────────────────────────────────
# 5. CLINICAL DECISION SUPPORT & DISCHARGE SUMMARIES
# ──────────────────────────────────────────────────────────────────────────────
elif menu == "📋 Clinical Decision Support & Discharge Summaries":
    st.title("📋 Clinical Decision Support & Discharge Documentation")
    st.markdown("Assisted clinical documentation: Automated institutional discharge summaries, SBAR handovers, and protocol guidance.")

    cds_tabs = st.tabs([
        "📝 Automated Discharge Note & SBAR",
        "📑 Hospital Clinical Protocol Assistant",
        "🧬 Patient Cohort Simulator",
        "🔍 Delay Root Cause Diagnostic"
    ])

    with cds_tabs[0]:
        st.markdown("### 📝 Patient Discharge Documentation Generator")
        case_options = sorted(fct_df["case_id"].tolist())
        chosen_case = st.selectbox("Select Patient Episode:", case_options[:50], index=0)

        case_row = fct_df[fct_df["case_id"] == chosen_case].iloc[0]
        case_events = stg_df[stg_df["case_id"] == chosen_case]["activity_name"].tolist()

        patient_profile = {
            "case_id": chosen_case,
            "age": 62,
            "gender": case_row["patient_gender"],
            "acuity": 2 if case_row["clinical_severity"] == "High" else (3 if case_row["clinical_severity"] == "Medium" else 4),
            "total_los_min": float(case_row["total_los_minutes"]),
            "door_to_doc_min": 24.5,
            "disposition": "Discharged Home",
            "activities": case_events if len(case_events) > 0 else ["Triage", "Doctor Consult", "Discharge"],
            "has_loopback": bool(case_row["has_radiology_loopback_rework"])
        }

        if st.button("✨ Generate Discharge Documentation & SBAR", use_container_width=True):
            with st.spinner("Compiling clinical documentation..."):
                doc_summary = generate_clinical_discharge_summary(patient_profile)
                sbar_note = generate_sbar_handover(patient_profile)

                st.success("✅ Clinical Chart Documentation Generated!")
                st.markdown(doc_summary["summary_markdown"])

                with st.expander("📋 View Nursing & Physician SBAR Handover Note", expanded=True):
                    st.markdown(sbar_note)

    with cds_tabs[1]:
        st.markdown("### 📑 Hospital Clinical Protocol Assistant")
        q_text = st.text_input("Enter Clinical Operational Question:", value="What is the door to doctor SLA for emergency patients?")

        if st.button("🔎 Search Clinical Guidelines", use_container_width=True):
            sop_res = audit_clinical_protocol_rag(q_text)
            st.success(f"Verified Guideline: **{sop_res['matched_protocol_id']} — {sop_res['matched_protocol_title']}**")
            st.markdown(sop_res["rag_response"])

    with cds_tabs[2]:
        st.markdown("### 🧬 Hospital Cohort Surge Simulator")
        ns = st.slider("Simulated Patient Arrivals", min_value=10, max_value=200, value=50, step=10)
        if st.button("🚀 Run Cohort Simulation", use_container_width=True):
            sim_data = generate_synthetic_ehr_cohort(n_patients=ns)
            st.success(f"Generated {len(sim_data):,} simulated clinical encounters!")
            st.dataframe(sim_data.head(10), use_container_width=True)

    with cds_tabs[3]:
        st.markdown("### 🔍 Departmental Delay Root Cause Diagnostic")
        t_list = [f"{r['source_activity']} ➔ {r['target_activity']}" for _, r in bottlenecks_df.head(6).iterrows()]
        sel_t = st.selectbox("Select Pathway Transition:", t_list, index=0)
        s_act, t_act = sel_t.split(" ➔ ")
        m_row = bottlenecks_df[(bottlenecks_df["source_activity"] == s_act) & (bottlenecks_df["target_activity"] == t_act)].iloc[0]

        ai_res = explain_process_bottleneck_ai(sel_t, float(m_row["avg_wait_minutes"]), int(m_row["transition_volume"]))
        st.warning(f"**Clinical Delay Alert:** `{ai_res['severity']}` (Mean Wait: `{ai_res['mean_wait_min']:.1f} min`)")
        st.markdown(f"**Operational Etiology:** {ai_res['ai_root_cause']}")
        st.markdown(f"**Recommended Action:** {ai_res['ai_corrective_action']}")


# ──────────────────────────────────────────────────────────────────────────────
# 6. PHYSICIAN PERFORMANCE & CARE QUALITY
# ──────────────────────────────────────────────────────────────────────────────
elif menu == "🩺 Physician Performance & Care Quality":
    st.title("🩺 Physician Performance & Clinical Quality Benchmarks")
    st.markdown("Comparative metrics across attending medical staff and clinical departments.")

    doc_summary = fct_df.groupby("primary_physician").agg(
        Patient_Volume=("case_id", "count"),
        Mean_LOS_Min=("total_los_minutes", "mean"),
        Loopback_Rate=("has_radiology_loopback_rework", "mean")
    ).reset_index()
    doc_summary["Mean_LOS_Min"] = doc_summary["Mean_LOS_Min"].round(1)
    doc_summary["Loopback_%"] = (doc_summary["Loopback_Rate"] * 100).round(1)

    st.dataframe(doc_summary.drop(columns=["Loopback_Rate"]), use_container_width=True)


# ──────────────────────────────────────────────────────────────────────────────
# 7. DEPARTMENTAL QUEUES & OPERATIONAL BOTTLENECKS
# ──────────────────────────────────────────────────────────────────────────────
elif menu == "📊 Departmental Queues & Operational Bottlenecks":
    st.title("📊 Departmental Queues & Operational Bottlenecks")
    st.markdown("Analysis of clinical delays and patient waiting times between hospital care stations.")

    q_df = calculate_queue_metrics(stg_df)
    st.dataframe(q_df.head(10), use_container_width=True)


# ──────────────────────────────────────────────────────────────────────────────
# 8. STATISTICAL PROCESS CONTROL (SPC) QUALITY CHARTS
# ──────────────────────────────────────────────────────────────────────────────
elif menu == "📈 Statistical Process Control (SPC) Quality Charts":
    st.title("📈 Statistical Process Control (SPC) Quality Monitoring")
    st.markdown("Shewhart Individual ($X-mR$) charts tracking daily patient dwell time against clinical 3-sigma control limits.")

    daily_los = fct_df.groupby(pd.to_datetime(fct_df["visit_start_time"]).dt.date)["total_los_minutes"].mean()
    spc = calculate_spc_limits(daily_los)

    if HAS_PLOTLY:
        fig_spc = go.Figure()
        fig_spc.add_trace(go.Scatter(
            x=daily_los.index,
            y=daily_los.values,
            mode='lines+markers',
            line=dict(color='#06b6d4', width=2),
            name="Daily Mean LOS"
        ))
        fig_spc.add_hline(y=spc["mean"], line_color="#10b981", annotation_text=f"Centerline ({spc['mean']:.1f}m)")
        fig_spc.add_hline(y=spc["ucl"], line_dash="dash", line_color="#ef4444", annotation_text=f"UCL (+3σ: {spc['ucl']:.1f}m)")
        fig_spc.add_hline(y=spc["lcl"], line_dash="dash", line_color="#ef4444", annotation_text=f"LCL (-3σ: {spc['lcl']:.1f}m)")
        fig_spc.update_layout(title="Daily Emergency Length of Stay Control Chart", template="plotly_dark", height=380)
        st.plotly_chart(fig_spc, use_container_width=True)
    else:
        st.line_chart(daily_los)


# ──────────────────────────────────────────────────────────────────────────────
# 9. CARE PATHWAY ROUTING & TRANSITIONS
# ──────────────────────────────────────────────────────────────────────────────
elif menu == "🎲 Care Pathway Routing & Transition Matrix":
    st.title("🎲 Care Pathway Routing & Transition Probability Matrix")
    st.markdown("Stochastic transition matrix modeling patient progression between clinical hospital care stations.")

    markov = calculate_markov_matrix(stg_df)
    st.dataframe(markov["prob_matrix"].round(3), use_container_width=True)

    if HAS_PLOTLY:
        fig_m = px.imshow(
            markov["prob_matrix"].values,
            x=markov["activities"],
            y=markov["activities"],
            color_continuous_scale="Crest",
            title="Care Station Routing Probability Heatmap",
            template="plotly_dark"
        )
        fig_m.update_layout(height=420)
        st.plotly_chart(fig_m, use_container_width=True)


# ──────────────────────────────────────────────────────────────────────────────
# 10. HOSPITAL CLINICAL RECORDS & QUERY PORTAL
# ──────────────────────────────────────────────────────────────────────────────
elif menu == "🗄️ Hospital Clinical Records & Query Portal":
    st.title("🗄️ Hospital Clinical Records & Query Portal")
    st.markdown("Live relational database portal: Search patient encounters, inpatient admissions, and execute clinical audit queries.")

    rec_tabs = st.tabs([
        "🔍 Clinical Records Query Console",
        "📥 Patient Intake & Check-In",
        "📋 Master Hospital Registries",
        "📊 Clinical Service Aggregations"
    ])

    with rec_tabs[0]:
        st.markdown("### 🔍 Clinical Records Query Console")
        st.markdown("Select an operational inquiry or enter custom queries to inspect hospital encounter records.")

        preset_queries = {
            "1. High-Acuity Emergency Encounters & Length of Stay": """SELECT 
    clinical_severity,
    COUNT(*) AS patient_volume,
    ROUND(AVG(total_los_minutes), 1) AS mean_los_min,
    ROUND(MIN(total_los_minutes), 1) AS min_los_min,
    ROUND(MAX(total_los_minutes), 1) AS max_los_min,
    SUM(CASE WHEN has_radiology_loopback_rework = 1 THEN 1 ELSE 0 END) AS loopback_cases
FROM fct_patient_journeys
GROUP BY clinical_severity
ORDER BY mean_los_min DESC;""",

            "2. Regulatory Door-to-Doctor SLA Compliance Audit": """SELECT 
    s.clinical_severity,
    COUNT(*) AS total_cases,
    SUM(CASE WHEN s.is_door_to_doctor_breached = 1 THEN 1 ELSE 0 END) AS breached_cases,
    ROUND(AVG(CASE WHEN s.is_door_to_doctor_breached = 1 THEN 1.0 ELSE 0.0 END) * 100, 1) AS breach_rate_pct,
    ROUND(AVG(s.door_to_doctor_minutes), 1) AS avg_d2d_minutes
FROM mart_sla_compliance s
GROUP BY s.clinical_severity
ORDER BY breach_rate_pct DESC;""",

            "3. Morning Rush Hour Care Station Bottlenecks": """SELECT 
    source_activity || ' ➔ ' || target_activity AS transition_route,
    transition_volume,
    avg_wait_minutes,
    median_wait_minutes,
    max_wait_minutes
FROM mart_bottlenecks
WHERE is_morning_rush = 1
ORDER BY avg_wait_minutes DESC
LIMIT 8;""",

            "4. Inpatient Wards Operating at Capacity Alert": """SELECT 
    unit_name,
    total_beds,
    occupied_beds,
    total_beds - occupied_beds AS available_beds,
    occupancy_rate,
    status
FROM hospital_ward_census
WHERE occupancy_rate >= 80.0
ORDER BY occupancy_rate DESC;"""
        }

        sel_query = st.selectbox("Select Operational Query:", list(preset_queries.keys()))
        sql_input = st.text_area("SQL Inquiry Editor:", value=preset_queries[sel_query], height=160)

        if st.button("⚡ Run Clinical Records Inquiry", use_container_width=True):
            t0 = time.time()
            try:
                res_df = query_sql(sql_input)
                ms = (time.time() - t0) * 1000.0
                st.success(f"Inquiry completed in **{ms:.1f} ms**! Retrieved **{len(res_df):,} clinical records**.")
                st.dataframe(res_df, use_container_width=True)

                num_cols = res_df.select_dtypes(include=[np.number]).columns.tolist()
                cat_cols = res_df.select_dtypes(include=['object']).columns.tolist()
                if HAS_PLOTLY and len(num_cols) > 0 and len(cat_cols) > 0:
                    fig_sql = px.bar(
                        res_df,
                        x=cat_cols[0],
                        y=num_cols[0],
                        title=f"Clinical Query Result: {num_cols[0]} by {cat_cols[0]}",
                        template="plotly_dark",
                        color_discrete_sequence=['#06b6d4']
                    )
                    st.plotly_chart(fig_sql, use_container_width=True)
            except Exception as e:
                st.error(f"Inquiry Error: {str(e)}")

    with rec_tabs[1]:
        st.markdown("### 📥 Patient Check-In & Emergency Intake Form")
        with st.form("intake_form"):
            c_id = st.text_input("Patient Medical Record Number (MRN / Case ID)", value=f"MRN-{np.random.randint(10000, 99999)}")
            c_act = st.selectbox("Intake Care Stage", ["Triage", "Doctor Consult", "Lab Tests", "Radiology / CT Scan", "Discharge"])
            c_gender = st.selectbox("Gender", ["Female", "Male"])
            c_age = st.selectbox("Age Bracket", ["0-17", "18-40", "41-60", "61+"], index=2)
            c_sev = st.selectbox("Triage Acuity", ["Low", "Medium", "High"], index=1)
            c_nurse = st.text_input("Assigned Staff Member", value="Charge_Nurse_Adams")

            btn_submit_intake = st.form_submit_button("📥 Register Patient Encounter in Database", use_container_width=True)

        if btn_submit_intake:
            insert_synthetic_patient_event({
                "case_id": c_id,
                "activity_name": c_act,
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "resource_name": c_nurse,
                "patient_gender": c_gender,
                "patient_age_group": c_age,
                "clinical_severity": c_sev
            })
            st.success(f"Encounter record for patient `{c_id}` successfully registered!")

    with rec_tabs[2]:
        st.markdown("### 📋 Master Clinical Registry Catalog")
        st.dataframe(db_stats, use_container_width=True)

    with rec_tabs[3]:
        st.markdown("### 📊 Departmental Analytics Marts")
        m_choice = st.selectbox("Select Clinical Registry Table:", ["mart_sla_compliance", "mart_bottlenecks", "mart_resource_handovers", "clinical_protocols"])
        st.dataframe(query_sql(f"SELECT * FROM {m_choice} LIMIT 25"), use_container_width=True)


# ──────────────────────────────────────────────────────────────────────────────
# 11. CLINICAL DATA SCIENCE & ANALYTICS HUB (25 .ipynb)
# ──────────────────────────────────────────────────────────────────────────────
elif menu == "📓 Clinical Data Science & Analytics Hub (25 .ipynb)":
    st.title("📓 Clinical Data Science & Research Notebooks")
    st.markdown("Comprehensive suite of 25 production Jupyter Notebooks (`.ipynb`) covering Machine Learning, Generative Engineering, Data Analysis, and Connected SQL Data Engineering.")

    nb_files = sorted(glob.glob(os.path.join(BASE_DIR, "notebooks", "*.ipynb")))
    st.success(f"Found **{len(nb_files)}** production research notebooks ready for download.")

    pillars_catalog = {
        "🧠 Machine Learning & MLOps Research": [
            "03_ML_Predictive_Modeling.ipynb",
            "05_Time_Series_Forecasting.ipynb",
            "12_Discrete_Event_Simulation_MonteCarlo.ipynb",
            "15_What_If_Staffing_and_ROI_Simulation.ipynb"
        ],
        "🤖 Generative Engineering & Clinical NLP": [
            "19_GenAI_Clinical_Decision_Support_and_Summarization.ipynb",
            "20_Generative_Engineering_Synthetic_EHR_Simulation.ipynb",
            "21_GenAI_RAG_Clinical_Protocol_Auditor.ipynb"
        ],
        "💾 Connected SQL & Lakehouse Engineering": [
            "06_DBT_SQL_to_Python_Data_Pipelines.ipynb",
            "22_Data_Engineering_Lakehouse_and_Data_Contracts.ipynb",
            "23_SQL_Database_and_Relational_Data_Engineering.ipynb",
            "24_Interactive_Hospital_Portal_and_Clinical_Dashboards.ipynb"
        ],
        "📊 Data Analysis & Process Mining": [
            "00_MASTER_CareFlow_End_to_End_Data_Analysis.ipynb",
            "01_EDA_Patient_Flow.ipynb",
            "02_Process_Mining_pm4py.ipynb",
            "04_Statistical_Analysis.ipynb",
            "07_SLA_Compliance_Analytics.ipynb",
            "08_Departmental_Bottlenecks_Queueing.ipynb",
            "09_Resource_Handover_Network_Analysis.ipynb",
            "10_Markov_Chain_Pathway_Modeling.ipynb",
            "11_SPC_Control_Charts_Healthcare.ipynb",
            "13_Patient_Flow_Funnel_and_Dropouts.ipynb",
            "14_Clinical_Quality_and_Safety_Metrics.ipynb",
            "16_Root_Cause_Analysis_Ishikawa_CAPA.ipynb",
            "17_Cohort_Benchmark_AB_Testing.ipynb",
            "18_Hospital_Census_and_Operations.ipynb"
        ]
    }

    for section_title, file_list in pillars_catalog.items():
        st.markdown(f"### {section_title}")
        for nb_file in file_list:
            full_p = os.path.join(BASE_DIR, "notebooks", nb_file)
            if os.path.exists(full_p):
                sz = os.path.getsize(full_p) / 1024.0
                with open(full_p, "r", encoding="utf-8") as f:
                    cnt = f.read()

                c_a, c_b = st.columns([3, 1])
                with c_a:
                    st.markdown(f"**`{nb_file}`** ({sz:.1f} KB)")
                with c_b:
                    st.download_button(
                        label="⬇️ Download .ipynb",
                        data=cnt,
                        file_name=nb_file,
                        mime="application/x-ipynb+json",
                        key=f"hub_{nb_file}"
                    )
        st.divider()
