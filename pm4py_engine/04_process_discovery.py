"""
Step 4: Discover the 'As-Is' process map with PM4Py and save pictures.
Outputs: ../output/process_map_frequency.png, ../output/process_map_performance.png,
         ../output/variants.csv
"""
import pandas as pd
import pm4py

df = pd.read_csv("../data/event_log.csv", parse_dates=["timestamp"])
df = pm4py.format_dataframe(df, case_id="case_id", activity_key="activity_name", timestamp_key="timestamp")

# 1) Directly-Follows Graph (the "spaghetti diagram")
dfg, start_acts, end_acts = pm4py.discover_dfg(df)
pm4py.save_vis_dfg(dfg, start_acts, end_acts, "../output/process_map_frequency.png")

# 2) Same graph but showing average time on each arrow
perf_dfg, s, e = pm4py.discover_performance_dfg(df)
pm4py.save_vis_performance_dfg(perf_dfg, s, e, "../output/process_map_performance.png")

# 3) Variants = distinct paths patients took
variants = pm4py.get_variants(df)
rows = [{"path": " -> ".join(v), "patients": c} for v, c in variants.items()]
vdf = pd.DataFrame(rows).sort_values("patients", ascending=False)
vdf["pct"] = (100 * vdf["patients"] / vdf["patients"].sum()).round(1)
vdf.to_csv("../output/variants.csv", index=False)
print(vdf.head(8).to_string(index=False))

# 4) Optional: Petri net via inductive miner
net, im, fm = pm4py.discover_petri_net_inductive(df)
pm4py.save_vis_petri_net(net, im, fm, "../output/petri_net.png")
print("Saved process maps to ../output/")
