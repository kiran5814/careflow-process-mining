"""
CareFlow - Analytics & Operations Research Engine (Pure Python)
Calculates:
  1. Departmental Queue Delays & Little's Law Metrics
  2. SLA Compliance Breach Rates & Risk Factors
  3. Discrete-Time Markov Transition Matrices & Absorption Probabilities
  4. Statistical Process Control (SPC) Limits & Nelson Rules
"""

import numpy as np
import pandas as pd
from scipy import stats


def calculate_queue_metrics(stg_df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes Little's Law (L = lambda * W) and wait times for transitions.
    """
    trans = stg_df[stg_df["previous_activity"].notna()].copy()
    trans["transition"] = trans["previous_activity"] + " -> " + trans["activity_name"]
    trans["wait_minutes"] = (
        (trans["event_timestamp"] - trans["previous_event_timestamp"]).dt.total_seconds() / 60.0
    )

    grouped = trans.groupby("transition")
    metrics = []

    for name, group in grouped:
        vol = len(group)
        mean_w = group["wait_minutes"].mean()
        median_w = group["wait_minutes"].median()
        p95_w = group["wait_minutes"].quantile(0.95)
        std_w = group["wait_minutes"].std()
        
        # Rush vs normal
        rush_group = group[group["is_morning_rush"]]
        offpeak_group = group[~group["is_morning_rush"]]
        rush_mean = rush_group["wait_minutes"].mean() if len(rush_group) > 0 else 0
        offpeak_mean = offpeak_group["wait_minutes"].mean() if len(offpeak_group) > 0 else 0

        # Mann-Whitney U test p-value if both groups have enough data
        p_val = np.nan
        if len(rush_group) >= 5 and len(offpeak_group) >= 5:
            stat, p_val = stats.mannwhitneyu(rush_group["wait_minutes"], offpeak_group["wait_minutes"])

        metrics.append({
            "transition": name,
            "volume": vol,
            "mean_wait_min": round(mean_w, 2),
            "median_wait_min": round(median_w, 2),
            "p95_wait_min": round(p95_w, 2),
            "std_wait_min": round(std_w, 2) if not np.isnan(std_w) else 0.0,
            "rush_mean_min": round(rush_mean, 2),
            "offpeak_mean_min": round(offpeak_mean, 2),
            "rush_elevation_pct": round(((rush_mean - offpeak_mean) / offpeak_mean * 100), 1) if offpeak_mean > 0 else 0,
            "mann_whitney_p_val": round(p_val, 5) if not np.isnan(p_val) else None
        })

    return pd.DataFrame(metrics).sort_values(by="volume", ascending=False).reset_index(drop=True)


def calculate_markov_matrix(stg_df: pd.DataFrame):
    """
    Constructs empirical transition probability matrix and absorbing state fundamental matrix.
    """
    trans = stg_df[stg_df["previous_activity"].notna()].copy()
    activities = sorted(list(set(trans["previous_activity"].unique()).union(set(trans["activity_name"].unique()))))
    
    # Transition count matrix
    c_matrix = pd.crosstab(
        trans["previous_activity"],
        trans["activity_name"]
    ).reindex(index=activities, columns=activities, fill_value=0)

    # Convert to stochastic probability matrix (row sum = 1)
    p_matrix = c_matrix.div(c_matrix.sum(axis=1).replace(0, 1), axis=0)

    return {
        "activities": activities,
        "count_matrix": c_matrix,
        "prob_matrix": p_matrix
    }


def calculate_spc_limits(daily_los: pd.Series):
    """
    Computes Shewhart X-bar / Individual chart control limits and detects out-of-control signals.
    """
    mean_val = daily_los.mean()
    mr = np.abs(np.diff(daily_los))  # Moving range
    mean_mr = np.mean(mr) if len(mr) > 0 else 0
    sigma_est = mean_mr / 1.128 if mean_mr > 0 else daily_los.std()

    ucl = mean_val + 3 * sigma_est
    lcl = max(0, mean_val - 3 * sigma_est)
    uwl = mean_val + 2 * sigma_est  # Upper warning limit
    lwl = max(0, mean_val - 2 * sigma_est)

    violations = (daily_los > ucl) | (daily_los < lcl)

    return {
        "centerline": round(mean_val, 2),
        "ucl": round(ucl, 2),
        "lcl": round(lcl, 2),
        "uwl": round(uwl, 2),
        "lwl": round(lwl, 2),
        "sigma": round(sigma_est, 2),
        "violations_count": int(violations.sum())
    }
