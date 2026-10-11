"""
Step 5: Bottleneck calculations (transition times + loop-back rate).
Outputs: ../output/transition_times.csv, ../output/loopback_summary.csv
"""
import pandas as pd

df = pd.read_csv("../data/event_log.csv", parse_dates=["timestamp"]).sort_values(["case_id", "timestamp"])

df["next_activity"] = df.groupby("case_id")["activity_name"].shift(-1)
df["next_time"] = df.groupby("case_id")["timestamp"].shift(-1)
df["minutes"] = (df["next_time"] - df["timestamp"]).dt.total_seconds() / 60

tt = (df.dropna(subset=["next_activity"])
        .groupby(["activity_name", "next_activity"])["minutes"]
        .agg(transitions="count", avg_minutes="mean").round(1)
        .reset_index().sort_values("avg_minutes", ascending=False))
tt.to_csv("../output/transition_times.csv", index=False)
print("Slowest transitions:\n", tt.head(8).to_string(index=False))

# Loop-back: Triage directly after X-Ray
df["prev_activity"] = df.groupby("case_id")["activity_name"].shift(1)
looped = df[(df.activity_name == "Triage") & (df.prev_activity == "X-Ray")]["case_id"].nunique()
total = df["case_id"].nunique()
pct = round(100 * looped / total, 1)
pd.DataFrame([{"patients_looped_back": looped, "total_patients": total, "loopback_pct": pct}]) \
  .to_csv("../output/loopback_summary.csv", index=False)
print(f"\nLoop-back to Triage after X-Ray: {looped}/{total} patients = {pct}%")

# Total length of stay per patient
los = df.groupby("case_id")["timestamp"].agg(["min", "max"])
los["los_minutes"] = (los["max"] - los["min"]).dt.total_seconds() / 60
print(f"Average length of stay: {los.los_minutes.mean():.0f} min")

# Per-patient summary (same as dbt model case_summary) -> use in PowerBI
cs = df.groupby("case_id").agg(doctor=("doctor", "first"), age_group=("age_group", "first"),
                               arrival_time=("timestamp", "min"), departure_time=("timestamp", "max"))
cs["los_minutes"] = ((cs.departure_time - cs.arrival_time).dt.total_seconds() / 60).round(0)
cs["looped_back"] = cs.index.isin(df[(df.activity_name == "Triage") & (df.prev_activity == "X-Ray")]["case_id"]).astype(int)
cs.reset_index().to_csv("../output/case_summary.csv", index=False)
print("Looped-back patients stay on average",
      round(cs[cs.looped_back == 1].los_minutes.mean()), "min vs",
      round(cs[cs.looped_back == 0].los_minutes.mean()), "min for the rest")
