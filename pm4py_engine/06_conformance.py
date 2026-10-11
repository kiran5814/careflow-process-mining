"""
Step 6: Conformance checking - compare actual paths vs. the ideal pathway.
Ideal: Registration -> Triage -> X-Ray -> Doctor Consultation -> Treatment -> Discharge
(Lab Test is allowed as an optional extra step.)
Outputs: ../output/conformance_per_case.csv (use this in PowerBI)
"""
import pandas as pd
import pm4py
from pm4py.objects.petri_net.utils.petri_utils import add_arc_from_to
from pm4py.objects.petri_net.obj import PetriNet, Marking

df = pd.read_csv("../data/event_log.csv", parse_dates=["timestamp"])
df = pm4py.format_dataframe(df, case_id="case_id", activity_key="activity_name", timestamp_key="timestamp")

# --- Build the ideal process as a Petri net (sequence with optional Lab Test) ---
net = PetriNet("ideal")
steps = ["Registration", "Triage", "X-Ray", "Doctor Consultation", "Treatment", "Discharge"]
places = [PetriNet.Place(f"p{i}") for i in range(len(steps) + 1)]
for p in places:
    net.places.add(p)
for i, name in enumerate(steps):
    t = PetriNet.Transition(name, name)
    net.transitions.add(t)
    add_arc_from_to(places[i], t, net)
    add_arc_from_to(t, places[i + 1], net)
    if name == "X-Ray":                       # optional Lab Test after X-Ray (loop on place)
        lab = PetriNet.Transition("Lab Test", "Lab Test")
        net.transitions.add(lab)
        add_arc_from_to(places[i + 1], lab, net)
        add_arc_from_to(lab, places[i + 1], net)
im, fm = Marking({places[0]: 1}), Marking({places[-1]: 1})

# --- Token-based replay: fitness per case ---
replayed = pm4py.conformance_diagnostics_token_based_replay(df, net, im, fm)
case_ids = df["case:concept:name"].drop_duplicates().tolist()
# NOTE: replay results follow the order of variants/traces; map using the trace order
traces = df.groupby("case:concept:name", sort=False)
out = []
for (cid, _), res in zip(traces, replayed):
    out.append({"case_id": cid,
                "fitness": round(res["trace_fitness"], 3),
                "is_compliant": bool(res["trace_is_fit"])})
res_df = pd.DataFrame(out)
res_df.to_csv("../output/conformance_per_case.csv", index=False)
print(f"Compliant patients: {res_df.is_compliant.mean()*100:.1f}%  |  non-compliant: {(~res_df.is_compliant).sum()}")
print("Average fitness:", round(res_df.fitness.mean(), 3))
