export const SUMMARY_STATS = {
  totalCases: 1000,
  totalEvents: 6347,
  medianCycleTime: "3h 42m",
  p90CycleTime: "5h 28m",
  loopbackRate: 39.8,
  loopbackCases: 398,
  conformanceScore: 94.9,
  triageSkipRate: 5.1,
  registrationSkipRate: 3.2,
  morningRushWaitRadiology: "54 min",
  regularWaitRadiology: "16 min",
  avgDoctorConsultation: "28 min",
  activeDoctors: 5,
};

export const DATA_QUALITY_METRICS = {
  totalRowsProcessed: 6347,
  uniqueCases: 1000,
  missingValuesCount: 0,
  duplicateEventsCount: 0,
  timestampCompliance: "100.0%",
  schemaValidationStatus: "PASSED (7/7 Fields Verified)",
  chronologicalIntegrity: "100.0% Monotonic",
  anomalousSequencesDetected: 51,
  dataCleansingRulesApplied: [
    { rule: "ISO-8601 Timestamp Normalization", status: "Active", affectedRows: 6347, impact: "Uniform second-precision timestamps" },
    { rule: "Case ID Integrity & Trace Stitching", status: "Active", affectedRows: 1000, impact: "Deterministic session boundaries" },
    { rule: "Null & Corrupted Record Pruning", status: "Active", affectedRows: 0, impact: "0 nulls detected in production ingestion" },
    { rule: "Activity Vocabulary Standardization", status: "Active", affectedRows: 6347, impact: "Standardized 8 canonical clinical activities" },
    { rule: "Chronological Sequence Assertion", status: "Active", affectedRows: 6347, impact: "Verified delta_t >= 0 between successive events" }
  ],
  schemaDefinition: [
    { field: "Case_ID", type: "String (Identifier)", nullable: false, sample: "CASE000703", role: "Case Identifier" },
    { field: "Activity_Name", type: "Categorical (Enum)", nullable: false, sample: "Triage", role: "Event Concept" },
    { field: "Timestamp", type: "Datetime (UTC)", nullable: false, sample: "2026-01-01 08:22:31", role: "Temporal Sequence" },
    { field: "Resource", type: "Categorical (Staff/MD)", nullable: false, sample: "Dr. Khan", role: "Organizational Asset" },
    { field: "Gender", type: "Categorical", nullable: false, sample: "Male", role: "Demographic Attribute" },
    { field: "Age_Group", type: "Categorical (Ordinal)", nullable: false, sample: "18-40", role: "Demographic Attribute" },
    { field: "Severity", type: "Categorical (Ordinal)", nullable: false, sample: "Medium", role: "Clinical Acuity Marker" }
  ]
};

export const MODEL_EVALUATION = {
  overallScore: "92.7%",
  dimensions: [
    { name: "Process Fitness", score: 94.9, benchmark: 90.0, status: "Optimal", description: "Proportion of log traces replayable without missing or remaining tokens." },
    { name: "Model Precision", score: 91.2, benchmark: 85.0, status: "Optimal", description: "Quantifies avoidance of underfitting and overly permissive non-observed paths." },
    { name: "Generalization", score: 88.5, benchmark: 80.0, status: "Good", description: "Estimates model capability to represent unseen future clinical traces." },
    { name: "Simplicity Index", score: 96.0, benchmark: 90.0, status: "Optimal", description: "Occam's razor penalizing unnecessary nodes and spaghetti complexity." }
  ],
  conformanceMatrix: {
    fullyCompliantTraces: 917,
    minorDeviations: 32,
    criticalViolations: 51,
    rootCauses: [
      { cause: "Missing Requisition Paperwork", frequency: 398, severity: "High (Operational)", remediation: "Implement instant digital electronic order entry (CPOE) at triage." },
      { cause: "Critical Acuity Triage Bypass", frequency: 51, severity: "High (Clinical Governance)", remediation: "Mandate emergency fast-track logging for Level 1 trauma arrivals." },
      { cause: "Unregistered Direct Arrival", frequency: 32, severity: "Medium (Billing/Audit)", remediation: "Barcode / RFID wristband bedside scanning upon ambulance triage." }
    ]
  }
};

export const ACTIONABLE_INSIGHTS = [
  {
    id: "INS-01",
    title: "Radiology Re-Triage Bottleneck (Paperwork Loop)",
    category: "Operational Efficiency",
    priority: "CRITICAL",
    metricHighlight: "39.8% of X-Ray Patients Reworked",
    impact: "~$142,000 / year excess cost & +48m stay penalty",
    evidence: "398 patient visits exhibit an X-Ray → Triage → X-Ray loop due to incomplete clinical requisition forms.",
    recommendation: "Deploy digitized mandatory e-requisition checklist in EHR during initial Triage. Prevents physical form omissions and eliminates 95% of paperwork rework."
  },
  {
    id: "INS-02",
    title: "Morning Radiology Peak Surge (08:00 - 11:00 AM)",
    category: "Capacity & Staffing",
    priority: "HIGH",
    metricHighlight: "+237% Queue Delay (54 min avg wait)",
    impact: "Severe ED overcrowding and prolonged wait times",
    evidence: "Arrival volumes surge to 102 patients/hr while radiology staffing remains flat at single-operator staffing.",
    recommendation: "Shift 1 radiology technician from late afternoon (14:00) to the morning rush (08:00-11:00 AM) to clear early queue build-up without adding payroll expense."
  },
  {
    id: "INS-03",
    title: "Un-triaged Fast-Track Protocol Bypass",
    category: "Clinical Governance & Risk",
    priority: "HIGH",
    metricHighlight: "5.1% Triage Protocol Skip (51 cases)",
    impact: "Patient safety risk & compliance audit violation",
    evidence: "51 cases transitioned directly from Registration to Doctor Consultation without recorded clinical triage acuity.",
    recommendation: "Configure EHR hard-stop requiring either a triage acuity score (ESI 1-5) or explicit 'Emergency Resuscitation Bypass' override before doctor orders can be opened."
  },
  {
    id: "INS-04",
    title: "Physician Caseload & Turnaround Parity",
    category: "Resource Management",
    priority: "MEDIUM",
    metricHighlight: "Equitable 18-22% load distribution",
    impact: "High physician satisfaction (93-97%) across all 5 clinicians",
    evidence: "Caseloads remain balanced across Dr. Sharma, Dr. Reddy, Dr. Iyer, Dr. Khan, and Dr. Patel with consults averaging 24-29 mins.",
    recommendation: "Maintain current staggered shift rotation while utilizing Dr. Reddy's streamlined 24m workflow as standard clinical practice guideline."
  }
];

export const PROCESS_NODES = [
  { id: "start", label: "Patient Arrival", type: "start", x: 60, y: 180, icon: "UserPlus", totalExecutions: 1000, avgDuration: "0m" },
  { id: "reg", label: "Registration", type: "activity", x: 190, y: 180, icon: "ClipboardList", totalExecutions: 968, avgDuration: "4m", waitTime: "3m" },
  { id: "triage", label: "Triage Assessment", type: "activity", x: 350, y: 180, icon: "Activity", totalExecutions: 1342, avgDuration: "12m", waitTime: "9m", reworkCount: 398 },
  { id: "xray", label: "X-Ray Radiology", type: "bottleneck", x: 530, y: 100, icon: "Scan", totalExecutions: 832, avgDuration: "18m", waitTime: "42m", alert: "Morning Rush Bottleneck" },
  { id: "lab", label: "Lab Blood Test", type: "activity", x: 530, y: 260, icon: "FlaskConical", totalExecutions: 352, avgDuration: "16m", waitTime: "18m" },
  { id: "consult", label: "Doctor Consult", type: "activity", x: 710, y: 180, icon: "Stethoscope", totalExecutions: 1000, avgDuration: "24m", waitTime: "22m" },
  { id: "treatment", label: "Treatment Care", type: "activity", x: 880, y: 180, icon: "HeartPulse", totalExecutions: 1000, avgDuration: "19m", waitTime: "8m" },
  { id: "discharge", label: "Discharged Home", type: "end", x: 1050, y: 120, icon: "CheckCircle", totalExecutions: 854, avgDuration: "Final" },
  { id: "admit", label: "Inpatient Admit", type: "end", x: 1050, y: 240, icon: "Building2", totalExecutions: 146, avgDuration: "Final" },
];

export const PROCESS_EDGES = [
  { from: "start", to: "reg", count: 968, percent: 96.8, avgWait: "3m" },
  { from: "start", to: "triage", count: 32, percent: 3.2, avgWait: "1m", isAnomaly: true },
  { from: "reg", to: "triage", count: 919, percent: 94.9, avgWait: "8m" },
  { from: "reg", to: "consult", count: 49, percent: 5.1, avgWait: "15m", isAnomaly: true },
  { from: "triage", to: "xray", count: 598, percent: 59.8, avgWait: "38m" },
  { from: "triage", to: "lab", count: 182, percent: 18.2, avgWait: "14m" },
  { from: "triage", to: "consult", count: 562, percent: 56.2, avgWait: "19m" },
  { 
    from: "xray", 
    to: "triage", 
    count: 398, 
    percent: 39.8, 
    avgWait: "22m", 
    isLoopback: true, 
    warning: "Missing paperwork form loop-back" 
  },
  { from: "xray", to: "consult", count: 598, percent: 100.0, avgWait: "18m" },
  { from: "lab", to: "consult", count: 352, percent: 100.0, avgWait: "16m" },
  { from: "consult", to: "treatment", count: 1000, percent: 100.0, avgWait: "8m" },
  { from: "treatment", to: "discharge", count: 854, percent: 85.4, avgWait: "10m" },
  { from: "treatment", to: "admit", count: 146, percent: 14.6, avgWait: "12m" },
];

export const HOURLY_METRICS = [
  { hour: "00:00", arrivals: 12, xrayWait: 14, triageWait: 4, rush: false },
  { hour: "01:00", arrivals: 9, xrayWait: 12, triageWait: 4, rush: false },
  { hour: "02:00", arrivals: 8, xrayWait: 10, triageWait: 3, rush: false },
  { hour: "03:00", arrivals: 7, xrayWait: 11, triageWait: 3, rush: false },
  { hour: "04:00", arrivals: 11, xrayWait: 15, triageWait: 5, rush: false },
  { hour: "05:00", arrivals: 21, xrayWait: 18, triageWait: 6, rush: false },
  { hour: "06:00", arrivals: 34, xrayWait: 22, triageWait: 7, rush: false },
  { hour: "07:00", arrivals: 52, xrayWait: 28, triageWait: 9, rush: false },
  { hour: "08:00", arrivals: 88, xrayWait: 58, triageWait: 16, rush: true },
  { hour: "09:00", arrivals: 102, xrayWait: 65, triageWait: 19, rush: true },
  { hour: "10:00", arrivals: 94, xrayWait: 62, triageWait: 18, rush: true },
  { hour: "11:00", arrivals: 76, xrayWait: 49, triageWait: 14, rush: true },
  { hour: "12:00", arrivals: 61, xrayWait: 26, triageWait: 8, rush: false },
  { hour: "13:00", arrivals: 54, xrayWait: 22, triageWait: 7, rush: false },
  { hour: "14:00", arrivals: 49, xrayWait: 20, triageWait: 6, rush: false },
  { hour: "15:00", arrivals: 53, xrayWait: 21, triageWait: 7, rush: false },
  { hour: "16:00", arrivals: 62, xrayWait: 24, triageWait: 8, rush: false },
  { hour: "17:00", arrivals: 71, xrayWait: 28, triageWait: 9, rush: false },
  { hour: "18:00", arrivals: 82, xrayWait: 31, triageWait: 11, rush: false },
  { hour: "19:00", arrivals: 78, xrayWait: 29, triageWait: 10, rush: false },
  { hour: "20:00", arrivals: 59, xrayWait: 23, triageWait: 8, rush: false },
  { hour: "21:00", arrivals: 41, xrayWait: 19, triageWait: 6, rush: false },
  { hour: "22:00", arrivals: 32, xrayWait: 17, triageWait: 5, rush: false },
  { hour: "23:00", arrivals: 22, xrayWait: 15, triageWait: 4, rush: false },
];

export const PROCESS_VARIANTS = [
  {
    id: "VAR-1",
    name: "Standard Clinical Pathway",
    caseCount: 338,
    percentage: 33.8,
    avgLeadTime: "2h 45m",
    steps: ["Registration", "Triage", "Doctor Consultation", "Treatment", "Discharge"],
    compliance: "Compliant",
    status: "Optimal",
    costIndex: "$320",
  },
  {
    id: "VAR-2",
    name: "Radiology Direct Care",
    caseCount: 241,
    percentage: 24.1,
    avgLeadTime: "3h 50m",
    steps: ["Registration", "Triage", "X-Ray", "Doctor Consultation", "Treatment", "Discharge"],
    compliance: "Compliant",
    status: "Normal",
    costIndex: "$540",
  },
  {
    id: "VAR-3",
    name: "Radiology Re-triage Rework (Inefficiency)",
    caseCount: 176,
    percentage: 17.6,
    avgLeadTime: "5h 15m",
    steps: ["Registration", "Triage", "X-Ray", "Triage (Loop-back)", "X-Ray", "Doctor Consultation", "Treatment", "Discharge"],
    compliance: "Compliant with Delay",
    status: "Severe Bottleneck",
    isLoopback: true,
    costIndex: "$890",
  },
  {
    id: "VAR-4",
    name: "Diagnostic Inpatient Admission",
    caseCount: 142,
    percentage: 14.2,
    avgLeadTime: "4h 40m",
    steps: ["Registration", "Triage", "X-Ray", "Lab Test", "Doctor Consultation", "Treatment", "Admission"],
    compliance: "Compliant",
    status: "High Acuity",
    costIndex: "$1,450",
  },
  {
    id: "VAR-5",
    name: "Triage Skip (Non-Compliant)",
    caseCount: 51,
    percentage: 5.1,
    avgLeadTime: "2h 10m",
    steps: ["Registration", "Doctor Consultation", "Treatment", "Discharge"],
    compliance: "Violation",
    status: "Protocol Breach",
    isAnomaly: true,
    costIndex: "$290",
  },
  {
    id: "VAR-6",
    name: "Emergency Direct Bypass",
    caseCount: 32,
    percentage: 3.2,
    avgLeadTime: "1h 55m",
    steps: ["Triage", "Doctor Consultation", "Treatment", "Admission"],
    compliance: "Emergency Exemption",
    status: "Critical Bypass",
    costIndex: "$1,120",
  },
];

export const DOCTORS_DATA = [
  { name: "Dr. Sharma", casesHandled: 215, avgConsultTime: "26m", admitRate: "16.2%", satisfaction: "94%" },
  { name: "Dr. Reddy", casesHandled: 202, avgConsultTime: "24m", admitRate: "14.8%", satisfaction: "96%" },
  { name: "Dr. Iyer", casesHandled: 198, avgConsultTime: "29m", admitRate: "15.6%", satisfaction: "93%" },
  { name: "Dr. Khan", casesHandled: 204, avgConsultTime: "27m", admitRate: "13.2%", satisfaction: "95%" },
  { name: "Dr. Patel", casesHandled: 181, avgConsultTime: "25m", admitRate: "15.1%", satisfaction: "97%" },
];

export const SAMPLE_CASES = [
  {
    caseId: "CASE000703",
    gender: "Male",
    ageGroup: "18-40",
    severity: "Low",
    doctor: "Dr. Khan",
    eventsCount: 5,
    leadTime: "2h 04m",
    isLoopback: false,
    hasAnomaly: false,
    outcome: "Discharge",
    timeline: [
      { activity: "Registration", timestamp: "2026-01-01 08:02:16", resource: "Staff", wait: "2m", duration: "4m" },
      { activity: "Triage", timestamp: "2026-01-01 08:22:31", resource: "Staff", wait: "16m", duration: "8m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-01 09:16:52", resource: "Dr. Khan", wait: "46m", duration: "25m" },
      { activity: "Treatment", timestamp: "2026-01-01 09:47:54", resource: "Dr. Khan", wait: "6m", duration: "18m" },
      { activity: "Discharge", timestamp: "2026-01-01 10:06:06", resource: "Staff", wait: "0m", duration: "5m" },
    ]
  },
  {
    caseId: "CASE000736",
    gender: "Male",
    ageGroup: "41-60",
    severity: "Low",
    doctor: "Dr. Sharma",
    eventsCount: 7,
    leadTime: "4h 28m",
    isLoopback: false,
    hasAnomaly: false,
    outcome: "Discharge",
    timeline: [
      { activity: "Registration", timestamp: "2026-01-01 10:14:35", resource: "Staff", wait: "3m", duration: "5m" },
      { activity: "Triage", timestamp: "2026-01-01 10:36:28", resource: "Staff", wait: "17m", duration: "9m" },
      { activity: "X-Ray", timestamp: "2026-01-01 11:12:00", resource: "Staff", wait: "27m", duration: "16m" },
      { activity: "Lab Test", timestamp: "2026-01-01 11:31:24", resource: "Staff", wait: "3m", duration: "14m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-01 12:45:10", resource: "Dr. Sharma", wait: "59m", duration: "26m" },
      { activity: "Treatment", timestamp: "2026-01-01 13:42:00", resource: "Dr. Sharma", wait: "31m", duration: "22m" },
      { activity: "Discharge", timestamp: "2026-01-01 14:42:35", resource: "Staff", wait: "38m", duration: "6m" },
    ]
  },
  {
    caseId: "CASE000687",
    gender: "Female",
    ageGroup: "18-40",
    severity: "Medium",
    doctor: "Dr. Patel",
    eventsCount: 8,
    leadTime: "5h 52m",
    isLoopback: true,
    hasAnomaly: false,
    outcome: "Discharge",
    timeline: [
      { activity: "Registration", timestamp: "2026-01-01 09:49:08", resource: "Staff", wait: "4m", duration: "6m" },
      { activity: "Triage", timestamp: "2026-01-01 10:19:41", resource: "Staff", wait: "24m", duration: "11m" },
      { activity: "X-Ray", timestamp: "2026-01-01 11:45:19", resource: "Staff", wait: "74m (Rush Hour)", duration: "18m" },
      { activity: "Triage (Loop-Back)", timestamp: "2026-01-01 12:42:15", resource: "Staff", wait: "39m (Paperwork Delay)", duration: "14m", isLoopback: true },
      { activity: "X-Ray (Repeated)", timestamp: "2026-01-01 13:38:00", resource: "Staff", wait: "42m", duration: "17m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-01 14:25:00", resource: "Dr. Patel", wait: "30m", duration: "28m" },
      { activity: "Treatment", timestamp: "2026-01-01 15:10:12", resource: "Dr. Patel", wait: "17m", duration: "21m" },
      { activity: "Discharge", timestamp: "2026-01-01 15:41:08", resource: "Staff", wait: "10m", duration: "5m" },
    ]
  },
  {
    caseId: "CASE000355",
    gender: "Female",
    ageGroup: "0-17",
    severity: "Medium",
    doctor: "Dr. Patel",
    eventsCount: 5,
    leadTime: "1h 48m",
    isLoopback: false,
    hasAnomaly: false,
    outcome: "Discharge",
    timeline: [
      { activity: "Registration", timestamp: "2026-01-01 08:56:49", resource: "Staff", wait: "2m", duration: "4m" },
      { activity: "Triage", timestamp: "2026-01-01 09:14:53", resource: "Staff", wait: "14m", duration: "8m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-01 10:02:06", resource: "Dr. Patel", wait: "39m", duration: "22m" },
      { activity: "Treatment", timestamp: "2026-01-01 10:24:25", resource: "Dr. Patel", wait: "0m", duration: "16m" },
      { activity: "Discharge", timestamp: "2026-01-01 10:45:20", resource: "Staff", wait: "5m", duration: "4m" },
    ]
  },
  {
    caseId: "CASE000189",
    gender: "Male",
    ageGroup: "61+",
    severity: "High",
    doctor: "Dr. Reddy",
    eventsCount: 4,
    leadTime: "1h 35m",
    isLoopback: false,
    hasAnomaly: true,
    outcome: "Admission",
    timeline: [
      { activity: "Registration", timestamp: "2026-01-01 14:10:00", resource: "Staff", wait: "1m", duration: "3m" },
      { activity: "Doctor Consultation (Bypass Triage)", timestamp: "2026-01-01 14:32:00", resource: "Dr. Reddy", wait: "19m", duration: "32m", isAnomaly: true },
      { activity: "Treatment", timestamp: "2026-01-01 15:15:00", resource: "Dr. Reddy", wait: "11m", duration: "25m" },
      { activity: "Admission", timestamp: "2026-01-01 15:45:00", resource: "Staff", wait: "5m", duration: "10m" },
    ]
  },
  {
    caseId: "CASE000445",
    gender: "Female",
    ageGroup: "41-60",
    severity: "Medium",
    doctor: "Dr. Iyer",
    eventsCount: 6,
    leadTime: "3h 40m",
    isLoopback: false,
    hasAnomaly: false,
    outcome: "Discharge",
    timeline: [
      { activity: "Registration", timestamp: "2026-01-01 11:03:42", resource: "Staff", wait: "5m", duration: "5m" },
      { activity: "Triage", timestamp: "2026-01-01 11:27:15", resource: "Staff", wait: "18m", duration: "10m" },
      { activity: "X-Ray", timestamp: "2026-01-01 12:20:00", resource: "Staff", wait: "43m", duration: "15m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-01 13:30:00", resource: "Dr. Iyer", wait: "55m", duration: "24m" },
      { activity: "Treatment", timestamp: "2026-01-01 14:15:00", resource: "Dr. Iyer", wait: "21m", duration: "18m" },
      { activity: "Discharge", timestamp: "2026-01-01 14:43:42", resource: "Staff", wait: "10m", duration: "5m" },
    ]
  },
  {
    caseId: "CASE000912",
    gender: "Male",
    ageGroup: "61+",
    severity: "High",
    doctor: "Dr. Sharma",
    eventsCount: 7,
    leadTime: "5h 10m",
    isLoopback: true,
    hasAnomaly: false,
    outcome: "Admission",
    timeline: [
      { activity: "Registration", timestamp: "2026-01-02 09:12:00", resource: "Staff", wait: "3m", duration: "5m" },
      { activity: "Triage", timestamp: "2026-01-02 09:35:00", resource: "Staff", wait: "18m", duration: "12m" },
      { activity: "X-Ray", timestamp: "2026-01-02 10:48:00", resource: "Staff", wait: "61m (Rush Hour)", duration: "20m" },
      { activity: "Triage (Loop-Back)", timestamp: "2026-01-02 11:40:00", resource: "Staff", wait: "32m (Paperwork Missing)", duration: "11m", isLoopback: true },
      { activity: "X-Ray (Repeated)", timestamp: "2026-01-02 12:35:00", resource: "Staff", wait: "44m", duration: "18m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-02 13:20:00", resource: "Dr. Sharma", wait: "27m", duration: "30m" },
      { activity: "Admission", timestamp: "2026-01-02 14:22:00", resource: "Staff", wait: "32m", duration: "15m" },
    ]
  }
];

export const ACUITY_DISTRIBUTION = [
  { label: "Critical (ESI-1)", count: 142, percentage: 14.2, avgStay: "4h 40m", admitRate: "89.4%", color: "#f43f5e", secondaryColor: "rgba(244,63,94,0.2)", costIndex: "$1,450" },
  { label: "High Acuity (ESI-2)", count: 241, percentage: 24.1, avgStay: "3h 50m", admitRate: "28.6%", color: "#f59e0b", secondaryColor: "rgba(245,158,11,0.2)", costIndex: "$890" },
  { label: "Moderate (ESI-3)", count: 338, percentage: 33.8, avgStay: "2h 45m", admitRate: "6.2%", color: "#06b6d4", secondaryColor: "rgba(6,182,212,0.2)", costIndex: "$420" },
  { label: "Low / Fast-Track (ESI-4/5)", count: 279, percentage: 27.9, avgStay: "1h 55m", admitRate: "1.4%", color: "#10b981", secondaryColor: "rgba(16,185,129,0.2)", costIndex: "$280" }
];

export const DISPOSITION_DISTRIBUTION = [
  { label: "Discharged Home", count: 728, percentage: 72.8, color: "#10b981", benchmark: "70-75%", note: "Standard ER discharge" },
  { label: "Inpatient Admission", count: 146, percentage: 14.6, color: "#6366f1", benchmark: "12-16%", note: "Admitted to ICU/Med-Surg" },
  { label: "Clinical Observation", count: 75, percentage: 7.5, color: "#06b6d4", benchmark: "5-8%", note: "Observed for 6-12h" },
  { label: "Transferred / AMA", count: 51, percentage: 5.1, color: "#f59e0b", benchmark: "< 6%", note: "Specialty tertiary center" }
];

export const DELAY_ATTRIBUTION = [
  { label: "Radiology (X-Ray) Queue", percentage: 42.4, avgWaitMin: 42, color: "#f43f5e", reason: "Peak rush congestion & form loop" },
  { label: "Doctor Consult Queue", percentage: 24.2, avgWaitMin: 24, color: "#38bdf8", reason: "Bed assignment & clinical handover" },
  { label: "Lab Diagnostic Turnaround", percentage: 16.2, avgWaitMin: 16, color: "#a855f7", reason: "Centrifuge & blood assay" },
  { label: "Triage Assessment Wait", percentage: 9.1, avgWaitMin: 9, color: "#fbbf24", reason: "Ambulance bay surges" },
  { label: "Registration & Ingestion", percentage: 8.1, avgWaitMin: 8, color: "#64748b", reason: "Insurance & ID verification" }
];

export const REWORK_REASONS = [
  { label: "Missing Requisition Signature/Form", percentage: 62.3, count: 248, color: "#f43f5e" },
  { label: "Contrast Clearance & Allergy Check", percentage: 21.1, count: 84, color: "#f59e0b" },
  { label: "Order Ambiguity / Physician Re-check", percentage: 16.6, count: 66, color: "#06b6d4" }
];

export const WEEKLY_HEATMAP = [
  { day: "Mon", shifts: [{ time: "Night (00-06)", score: 28, wait: "14m" }, { time: "Morning (06-12)", score: 98, wait: "62m", rush: true }, { time: "Afternoon (12-18)", score: 64, wait: "24m" }, { time: "Evening (18-24)", score: 72, wait: "31m" }] },
  { day: "Tue", shifts: [{ time: "Night (00-06)", score: 22, wait: "12m" }, { time: "Morning (06-12)", score: 92, wait: "58m", rush: true }, { time: "Afternoon (12-18)", score: 58, wait: "22m" }, { time: "Evening (18-24)", score: 68, wait: "28m" }] },
  { day: "Wed", shifts: [{ time: "Night (00-06)", score: 25, wait: "13m" }, { time: "Morning (06-12)", score: 86, wait: "52m", rush: true }, { time: "Afternoon (12-18)", score: 55, wait: "21m" }, { time: "Evening (18-24)", score: 65, wait: "26m" }] },
  { day: "Thu", shifts: [{ time: "Night (00-06)", score: 20, wait: "11m" }, { time: "Morning (06-12)", score: 89, wait: "54m", rush: true }, { time: "Afternoon (12-18)", score: 60, wait: "23m" }, { time: "Evening (18-24)", score: 70, wait: "29m" }] },
  { day: "Fri", shifts: [{ time: "Night (00-06)", score: 32, wait: "16m" }, { time: "Morning (06-12)", score: 95, wait: "60m", rush: true }, { time: "Afternoon (12-18)", score: 75, wait: "28m" }, { time: "Evening (18-24)", score: 88, wait: "38m", rush: true }] },
  { day: "Sat", shifts: [{ time: "Night (00-06)", score: 45, wait: "20m" }, { time: "Morning (06-12)", score: 78, wait: "44m" }, { time: "Afternoon (12-18)", score: 70, wait: "26m" }, { time: "Evening (18-24)", score: 85, wait: "36m", rush: true }] },
  { day: "Sun", shifts: [{ time: "Night (00-06)", score: 38, wait: "18m" }, { time: "Morning (06-12)", score: 72, wait: "39m" }, { time: "Afternoon (12-18)", score: 68, wait: "25m" }, { time: "Evening (18-24)", score: 79, wait: "33m" }] }
];

export const ADVANCED_KPIS = [
  // Category: flow (Executive & Flow Throughput)
  {
    id: "door_to_doc",
    category: "flow",
    title: "Door-to-Doctor (D2D)",
    value: "41 min",
    subtext: "Clinical Target: < 30 min",
    status: "warning",
    badge: "28.4% SLA Breaches",
    trend: "+8m vs benchmark",
    trendPositive: false,
    formula: "Median duration from arrival check-in to initial attending physician encounter.",
    detail: "Median duration from ED arrival registration to first licensed provider examination. Prolonged by morning rush hour queues.",
    benchmark: "30.0 min",
    impact: "High queue wait in waiting room",
    sparkline: [32, 36, 48, 56, 52, 44, 41, 38, 43, 41]
  },
  {
    id: "ftrr",
    category: "flow",
    title: "First-Time-Right Rate (FTRR)",
    value: "60.2%",
    subtext: "Target: ≥ 85.0%",
    status: "danger",
    badge: "39.8% Rework Loopbacks",
    trend: "-14.8% vs SLA Target",
    trendPositive: false,
    formula: "Percentage of patient encounters completed without secondary triage loop-backs or order revisions.",
    detail: "398 out of 1,000 cases require repeat triage due to missing radiology requisition signatures and form omissions.",
    benchmark: "85.0%",
    impact: "+48 min excess stay penalty",
    sparkline: [58, 62, 59, 61, 60, 58, 63, 61, 59, 60]
  },
  {
    id: "bed_utilization",
    category: "flow",
    title: "ED Bed Occupancy Index",
    value: "84.6%",
    subtext: "Operational Capacity: 38/45 Beds",
    status: "warning",
    badge: "Peak 97% at 10:00 AM",
    trend: "High Congestion",
    trendPositive: false,
    formula: "Proportion of active emergency acute treatment beds currently occupied by patients.",
    detail: "Active acute bed occupancy proportion, signaling emergency department boarding pressure during morning shift peaks.",
    benchmark: "75.0%",
    impact: "Ambulance diversion risk",
    sparkline: [62, 68, 85, 96, 97, 88, 82, 80, 84, 85]
  },
  {
    id: "median_los",
    category: "flow",
    title: "Median Emergency LOS",
    value: "3h 42m",
    subtext: "P90 Tail: 5h 28m",
    status: "info",
    badge: "Normal Clinical Band",
    trend: "-12m vs prior month",
    trendPositive: true,
    formula: "50th percentile total patient dwell time from arrival timestamp to discharge or hospital bed transfer.",
    detail: "Standard non-loopback cases complete in 2h 45m. Loopback rework cases drag the 90th percentile to 5h 28m.",
    benchmark: "4h 00m",
    impact: "Optimal for non-rework traces",
    sparkline: [240, 235, 228, 222, 226, 220, 224, 219, 222, 222]
  },

  // Category: quality (Clinical Governance & Safety)
  {
    id: "process_fitness",
    category: "quality",
    title: "Process Conformance Fitness",
    value: "94.9%",
    subtext: "EHR Log Replay Alignment",
    status: "success",
    badge: "Optimal Model Fit",
    trend: "+4.9% vs 90% benchmark",
    trendPositive: true,
    formula: "Token replay fitness quantifying percentage of event traces exactly matching discoverable clinical paths.",
    detail: "High structural alignment between actual clinical execution logs and normative clinical practice guidelines.",
    benchmark: "90.0%",
    impact: "Audit-ready regulatory proof",
    sparkline: [91, 92, 93, 94, 95, 94, 95, 96, 95, 95]
  },
  {
    id: "triage_skip",
    category: "quality",
    title: "Acuity Protocol Skip Rate",
    value: "5.1%",
    subtext: "51 Un-triaged Fast-Tracks",
    status: "danger",
    badge: "Clinical Governance Risk",
    trend: "+2.1% above tolerance (<3%)",
    trendPositive: false,
    formula: "Percentage of cases bypassing nursing triage acuity scoring directly to doctor consultation.",
    detail: "Potential safety liability where walk-in patients bypass acuity prioritization without fast-track emergency exemption.",
    benchmark: "< 2.0%",
    impact: "Regulatory non-compliance",
    sparkline: [3.8, 4.2, 4.5, 5.2, 5.0, 4.9, 5.3, 5.1, 5.2, 5.1]
  },
  {
    id: "sepsis_conformance",
    category: "quality",
    title: "Clinical Bundle Adherence",
    value: "98.2%",
    subtext: "Golden Hour Resuscitation",
    status: "success",
    badge: "Top Decile Safety",
    trend: "+3.2% vs national standard",
    trendPositive: true,
    formula: "Timely completion of blood cultures, antibiotic administration, and IV fluids within 60 minutes for high acuity.",
    detail: "Exceptional clinical team adherence to sepsis protocols, reducing septic shock risk in ESI-1 and ESI-2 cohorts.",
    benchmark: "95.0%",
    impact: "Zero preventable delays in acute care",
    sparkline: [95, 96, 97, 98, 97, 98, 99, 98, 98, 98]
  },
  {
    id: "readmit_rate",
    category: "quality",
    title: "72h ED Return Rate",
    value: "4.8%",
    subtext: "Benchmark: < 6.5%",
    status: "success",
    badge: "Optimal Safe Discharge",
    trend: "-0.6% vs last quarter",
    trendPositive: true,
    formula: "Percentage of discharged patients presenting back to emergency department within 72 hours of discharge.",
    detail: "Demonstrates that expedited discharge does not compromise discharge diagnostic thoroughness or patient safety.",
    benchmark: "6.5%",
    impact: "High clinical efficacy",
    sparkline: [5.6, 5.4, 5.2, 5.1, 4.9, 5.0, 4.8, 4.7, 4.9, 4.8]
  },

  // Category: financial (Financial Economics & ROI)
  {
    id: "economic_waste",
    category: "financial",
    title: "Annual Rework Waste Cost",
    value: "$142,400",
    subtext: "$358 per Loopback Patient",
    status: "danger",
    badge: "398 Reworked Cases",
    trend: "100% Recapturable via CPOE",
    trendPositive: false,
    formula: "Cumulative nurse hours, repeat imaging, and delayed bed occupancy costs directly attributed to paperwork loops.",
    detail: "Excess direct operational costs from repetitive nursing triage and delayed discharge bed time.",
    benchmark: "$0 target",
    impact: "$11,860 monthly waste burn",
    sparkline: [120, 125, 134, 138, 142, 140, 142, 141, 143, 142]
  },
  {
    id: "avg_cost_case",
    category: "financial",
    title: "Average Cost Per Encounter",
    value: "$612",
    subtext: "Compliant: $480 | Rework: $890",
    status: "warning",
    badge: "+85.4% Rework Cost Spike",
    trend: "High Variance by Pathway",
    trendPositive: false,
    formula: "Blended operational cost per ED patient encounter including physician time, nursing, diagnostics, and facility overhead.",
    detail: "Standard clinical pathway costs $320-$480; loopback radiology pathways escalate to $890, inflating average unit costs.",
    benchmark: "$520",
    impact: "Margin erosion on capitated contracts",
    sparkline: [580, 595, 620, 640, 615, 608, 610, 615, 614, 612]
  },
  {
    id: "cpoe_roi",
    category: "financial",
    title: "Projected CPOE Net ROI",
    value: "394%",
    subtext: "1.8 Month Payback Period",
    status: "success",
    badge: "+$118.5k Net Year 1",
    trend: "Board-Approved Case",
    trendPositive: true,
    formula: "(Annualized paperless workflow cost reduction - EHR enhancement CAPEX) / CAPEX × 100.",
    detail: "Implementing mandatory electronic requisitions at triage costs $24,000 one-off and yields $142,400 in gross savings.",
    benchmark: "> 150%",
    impact: "Strong economic business case",
    sparkline: [210, 250, 290, 320, 360, 380, 390, 395, 392, 394]
  },

  // Category: resource (Resource Productivity & Parity)
  {
    id: "staffing_efficiency",
    category: "resource",
    title: "Physician Caseload Parity",
    value: "95.2%",
    subtext: "24–29m Range Across 5 MDs",
    status: "success",
    badge: "Equitable Load Distribution",
    trend: "Zero Clinician Burnout Alert",
    trendPositive: true,
    formula: "Caseload equality coefficient across active attending physicians (18.1% - 21.5% load per physician).",
    detail: "Balanced clinical workload across Dr. Sharma, Dr. Reddy, Dr. Iyer, Dr. Khan, and Dr. Patel prevents diagnostic fatigue.",
    benchmark: "> 90.0%",
    impact: "Stable staff retention (95%+ CSAT)",
    sparkline: [92, 93, 94, 95, 95, 96, 95, 94, 95, 95]
  },
  {
    id: "diag_turnaround",
    category: "resource",
    title: "Radiology Turnaround (TAT)",
    value: "34 min",
    subtext: "Morning Surge: 58 min",
    status: "warning",
    badge: "+70% Rush Hour Surge",
    trend: "+18m delay during 8-11 AM",
    trendPositive: false,
    formula: "Elapsed time from radiology order placement to image capture and PACS radiologist availability.",
    detail: "During the 08:00 - 11:00 AM rush, single-technician staffing causes queue backup to 58 min compared to 16 min baseline.",
    benchmark: "20 min",
    impact: "Resolvable with shift rebalance",
    sparkline: [18, 22, 35, 58, 54, 42, 32, 28, 32, 34]
  },
  {
    id: "nurse_ratio",
    category: "resource",
    title: "Nurse-to-Patient Ratio",
    value: "1 : 3.8",
    subtext: "Clinical Target: 1 : 3.0",
    status: "info",
    badge: "Moderate Staffing Load",
    trend: "Within State Guidelines",
    trendPositive: true,
    formula: "Ratio of active on-duty triage and treatment nurses to census of active patients in acute emergency bays.",
    detail: "Meets safe staffing mandates but spikes to 1:4.6 during the morning peak intake window.",
    benchmark: "1 : 3.0",
    impact: "Safe care delivery guaranteed",
    sparkline: [3.2, 3.4, 3.9, 4.4, 4.2, 3.8, 3.6, 3.7, 3.8, 3.8]
  }
];

// 30-Day Time-Series Historical Trend Dataset for Recharts
export const THIRTY_DAY_TRENDS = [
  { day: "Day 01", date: "Jan 01", volume: 34, avgCycleHours: 3.8, reworkRate: 41.2, costDollars: 21400, conformancePct: 94.1, compliant: 20, rework: 14 },
  { day: "Day 02", date: "Jan 02", volume: 38, avgCycleHours: 3.9, reworkRate: 42.1, costDollars: 24100, conformancePct: 93.8, compliant: 22, rework: 16 },
  { day: "Day 03", date: "Jan 03", volume: 31, avgCycleHours: 3.5, reworkRate: 38.7, costDollars: 18900, conformancePct: 95.2, compliant: 19, rework: 12 },
  { day: "Day 04", date: "Jan 04", volume: 29, avgCycleHours: 3.4, reworkRate: 37.9, costDollars: 17800, conformancePct: 96.0, compliant: 18, rework: 11 },
  { day: "Day 05", date: "Jan 05", volume: 42, avgCycleHours: 4.2, reworkRate: 45.2, costDollars: 27800, conformancePct: 92.5, compliant: 23, rework: 19 },
  { day: "Day 06", date: "Jan 06", volume: 36, avgCycleHours: 3.7, reworkRate: 38.9, costDollars: 22100, conformancePct: 95.0, compliant: 22, rework: 14 },
  { day: "Day 07", date: "Jan 07", volume: 33, avgCycleHours: 3.6, reworkRate: 36.4, costDollars: 20200, conformancePct: 95.8, compliant: 21, rework: 12 },
  { day: "Day 08", date: "Jan 08", volume: 39, avgCycleHours: 4.0, reworkRate: 43.6, costDollars: 25400, conformancePct: 93.5, compliant: 22, rework: 17 },
  { day: "Day 09", date: "Jan 09", volume: 44, avgCycleHours: 4.3, reworkRate: 47.7, costDollars: 29100, conformancePct: 91.8, compliant: 23, rework: 21 },
  { day: "Day 10", date: "Jan 10", volume: 35, avgCycleHours: 3.7, reworkRate: 40.0, costDollars: 21800, conformancePct: 94.6, compliant: 21, rework: 14 },
  { day: "Day 11", date: "Jan 11", volume: 30, avgCycleHours: 3.4, reworkRate: 36.7, costDollars: 18400, conformancePct: 96.1, compliant: 19, rework: 11 },
  { day: "Day 12", date: "Jan 12", volume: 28, avgCycleHours: 3.3, reworkRate: 35.7, costDollars: 17100, conformancePct: 96.4, compliant: 18, rework: 10 },
  { day: "Day 13", date: "Jan 13", volume: 37, avgCycleHours: 3.8, reworkRate: 37.8, costDollars: 22900, conformancePct: 95.3, compliant: 23, rework: 14 },
  { day: "Day 14", date: "Jan 14", volume: 41, avgCycleHours: 4.1, reworkRate: 41.5, costDollars: 26000, conformancePct: 93.9, compliant: 24, rework: 17 },
  { day: "Day 15", date: "Jan 15", volume: 35, avgCycleHours: 3.6, reworkRate: 37.1, costDollars: 21500, conformancePct: 95.5, compliant: 22, rework: 13 },
  { day: "Day 16", date: "Jan 16", volume: 32, avgCycleHours: 3.5, reworkRate: 37.5, costDollars: 19600, conformancePct: 95.7, compliant: 20, rework: 12 },
  { day: "Day 17", date: "Jan 17", volume: 36, avgCycleHours: 3.8, reworkRate: 38.9, costDollars: 22400, conformancePct: 94.8, compliant: 22, rework: 14 },
  { day: "Day 18", date: "Jan 18", volume: 43, avgCycleHours: 4.2, reworkRate: 44.2, costDollars: 27900, conformancePct: 92.9, compliant: 24, rework: 19 },
  { day: "Day 19", date: "Jan 19", volume: 39, avgCycleHours: 3.9, reworkRate: 41.0, costDollars: 24500, conformancePct: 94.2, compliant: 23, rework: 16 },
  { day: "Day 20", date: "Jan 20", volume: 33, avgCycleHours: 3.5, reworkRate: 36.4, costDollars: 20300, conformancePct: 95.9, compliant: 21, rework: 12 },
  { day: "Day 21", date: "Jan 21", volume: 29, avgCycleHours: 3.3, reworkRate: 34.5, costDollars: 17700, conformancePct: 96.8, compliant: 19, rework: 10 },
  { day: "Day 22", date: "Jan 22", volume: 35, avgCycleHours: 3.7, reworkRate: 37.1, costDollars: 21600, conformancePct: 95.4, compliant: 22, rework: 13 },
  { day: "Day 23", date: "Jan 23", volume: 40, avgCycleHours: 4.0, reworkRate: 42.5, costDollars: 25200, conformancePct: 93.8, compliant: 23, rework: 17 },
  { day: "Day 24", date: "Jan 24", volume: 46, avgCycleHours: 4.4, reworkRate: 45.7, costDollars: 29800, conformancePct: 92.1, compliant: 25, rework: 21 },
  { day: "Day 25", date: "Jan 25", volume: 34, avgCycleHours: 3.6, reworkRate: 38.2, costDollars: 21000, conformancePct: 95.1, compliant: 21, rework: 13 },
  { day: "Day 26", date: "Jan 26", volume: 31, avgCycleHours: 3.4, reworkRate: 35.5, costDollars: 18900, conformancePct: 96.2, compliant: 20, rework: 11 },
  { day: "Day 27", date: "Jan 27", volume: 28, avgCycleHours: 3.2, reworkRate: 32.1, costDollars: 16800, conformancePct: 97.0, compliant: 19, rework: 9 },
  { day: "Day 28", date: "Jan 28", volume: 33, avgCycleHours: 3.5, reworkRate: 36.4, costDollars: 20100, conformancePct: 95.8, compliant: 21, rework: 12 },
  { day: "Day 29", date: "Jan 29", volume: 38, avgCycleHours: 3.8, reworkRate: 39.5, costDollars: 23600, conformancePct: 94.6, compliant: 23, rework: 15 },
  { day: "Day 30", date: "Jan 30", volume: 42, avgCycleHours: 4.1, reworkRate: 42.9, costDollars: 26700, conformancePct: 93.4, compliant: 24, rework: 18 },
];

// Activity Flow Breakdown: Active Working Time vs Queue Wait Delay
export const STEP_TIME_BREAKDOWN = [
  { step: "Registration", activeMin: 4, waitMin: 3, totalMin: 7, isBottleneck: false, costPerEvent: "$18" },
  { step: "Triage Exam", activeMin: 12, waitMin: 9, totalMin: 21, isBottleneck: false, costPerEvent: "$45" },
  { step: "X-Ray Radiology", activeMin: 18, waitMin: 42, totalMin: 60, isBottleneck: true, costPerEvent: "$165" },
  { step: "Lab Diagnostics", activeMin: 16, waitMin: 18, totalMin: 34, isBottleneck: false, costPerEvent: "$95" },
  { step: "Doctor Consult", activeMin: 26, waitMin: 24, totalMin: 50, isBottleneck: false, costPerEvent: "$180" },
  { step: "Treatment Care", activeMin: 19, waitMin: 8, totalMin: 27, isBottleneck: false, costPerEvent: "$78" },
  { step: "Discharge / Bed", activeMin: 8, waitMin: 10, totalMin: 18, isBottleneck: false, costPerEvent: "$31" }
];

// Patient Care Funnel & Stage Drop-off / Conversion (Ecommerce Funnel Paradigm)
export const PATIENT_FLOW_FUNNEL = [
  { stage: "Arrival & Check-in", count: 1000, conversionPct: 100.0, dropPct: 0.0, status: "All Cases" },
  { stage: "Formal Registration", count: 968, conversionPct: 96.8, dropPct: 3.2, status: "32 Direct Trauma Fast-Tracks" },
  { stage: "Triage Assessment", count: 919, conversionPct: 91.9, dropPct: 5.1, status: "51 Non-compliant Skips" },
  { stage: "Diagnostics Ordered", count: 832, conversionPct: 83.2, dropPct: 16.8, status: "598 X-Ray + 234 Lab" },
  { stage: "Attending MD Consult", count: 1000, conversionPct: 100.0, dropPct: 0.0, status: "100% Doctor Examined" },
  { stage: "Clinical Treatment", count: 1000, conversionPct: 100.0, dropPct: 0.0, status: "100% Treated" },
  { stage: "Successful Disposition", count: 1000, conversionPct: 100.0, dropPct: 0.0, status: "854 Discharged, 146 Inpatient" }
];

// Doctor Multi-Dimensional Radar Comparison Data
export const DOCTOR_RADAR_DATA = [
  { dimension: "Throughput (Cases)", fullMark: 100, "Dr. Sharma": 98, "Dr. Reddy": 92, "Dr. Khan": 93, "Dr. Iyer": 90, "Dr. Patel": 82 },
  { dimension: "Speed (Consult TAT)", fullMark: 100, "Dr. Sharma": 84, "Dr. Reddy": 96, "Dr. Khan": 82, "Dr. Iyer": 75, "Dr. Patel": 89 },
  { dimension: "Patient CSAT", fullMark: 100, "Dr. Sharma": 94, "Dr. Reddy": 96, "Dr. Khan": 95, "Dr. Iyer": 93, "Dr. Patel": 97 },
  { dimension: "Protocol Compliance", fullMark: 100, "Dr. Sharma": 96, "Dr. Reddy": 94, "Dr. Khan": 97, "Dr. Iyer": 95, "Dr. Patel": 98 },
  { dimension: "Inpatient Admit Parity", fullMark: 100, "Dr. Sharma": 92, "Dr. Reddy": 95, "Dr. Khan": 96, "Dr. Iyer": 91, "Dr. Patel": 94 }
];

// Financial Waste Attribution by Root Cause
export const FINANCIAL_IMPACT_BREAKDOWN = [
  { category: "Radiology Re-triage Paperwork Loop", amount: 88600, percentage: 62.2, color: "#f43f5e", cases: 248 },
  { category: "Morning Rush Queue Delays & Overtime", amount: 31200, percentage: 21.9, color: "#f59e0b", cases: 88 },
  { category: "Physician Consult Handover Wait Waste", amount: 14800, percentage: 10.4, color: "#06b6d4", cases: 42 },
  { category: "Unregistered / Bedside Scan Exception", amount: 7800, percentage: 5.5, color: "#8b5cf6", cases: 20 }
];

// 20 Detailed Sample Cases for Enterprise Case Explorer Table
export const EXTENDED_CASES = [
  {
    caseId: "CASE000703",
    gender: "Male",
    ageGroup: "18-40",
    severity: "Low",
    doctor: "Dr. Khan",
    eventsCount: 5,
    leadTime: "2h 04m",
    isLoopback: false,
    hasAnomaly: false,
    outcome: "Discharge",
    cost: "$320",
    satisfaction: 98,
    esiScore: 4,
    timeline: [
      { activity: "Registration", timestamp: "2026-01-01 08:02:16", resource: "Staff", wait: "2m", duration: "4m" },
      { activity: "Triage", timestamp: "2026-01-01 08:22:31", resource: "Staff", wait: "16m", duration: "8m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-01 09:16:52", resource: "Dr. Khan", wait: "46m", duration: "25m" },
      { activity: "Treatment", timestamp: "2026-01-01 09:47:54", resource: "Dr. Khan", wait: "6m", duration: "18m" },
      { activity: "Discharge", timestamp: "2026-01-01 10:06:06", resource: "Staff", wait: "0m", duration: "5m" },
    ]
  },
  {
    caseId: "CASE000736",
    gender: "Male",
    ageGroup: "41-60",
    severity: "Low",
    doctor: "Dr. Sharma",
    eventsCount: 7,
    leadTime: "4h 28m",
    isLoopback: false,
    hasAnomaly: false,
    outcome: "Discharge",
    cost: "$540",
    satisfaction: 94,
    esiScore: 4,
    timeline: [
      { activity: "Registration", timestamp: "2026-01-01 10:14:35", resource: "Staff", wait: "3m", duration: "5m" },
      { activity: "Triage", timestamp: "2026-01-01 10:36:28", resource: "Staff", wait: "17m", duration: "9m" },
      { activity: "X-Ray", timestamp: "2026-01-01 11:12:00", resource: "Staff", wait: "27m", duration: "16m" },
      { activity: "Lab Test", timestamp: "2026-01-01 11:31:24", resource: "Staff", wait: "3m", duration: "14m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-01 12:45:10", resource: "Dr. Sharma", wait: "59m", duration: "26m" },
      { activity: "Treatment", timestamp: "2026-01-01 13:42:00", resource: "Dr. Sharma", wait: "31m", duration: "22m" },
      { activity: "Discharge", timestamp: "2026-01-01 14:42:35", resource: "Staff", wait: "38m", duration: "6m" },
    ]
  },
  {
    caseId: "CASE000687",
    gender: "Female",
    ageGroup: "18-40",
    severity: "Medium",
    doctor: "Dr. Patel",
    eventsCount: 8,
    leadTime: "5h 52m",
    isLoopback: true,
    hasAnomaly: false,
    outcome: "Discharge",
    cost: "$890",
    satisfaction: 82,
    esiScore: 3,
    timeline: [
      { activity: "Registration", timestamp: "2026-01-01 09:49:08", resource: "Staff", wait: "4m", duration: "6m" },
      { activity: "Triage", timestamp: "2026-01-01 10:19:41", resource: "Staff", wait: "24m", duration: "11m" },
      { activity: "X-Ray", timestamp: "2026-01-01 11:45:19", resource: "Staff", wait: "74m (Rush Hour)", duration: "18m" },
      { activity: "Triage (Loop-Back)", timestamp: "2026-01-01 12:42:15", resource: "Staff", wait: "39m (Paperwork Delay)", duration: "14m", isLoopback: true },
      { activity: "X-Ray (Repeated)", timestamp: "2026-01-01 13:38:00", resource: "Staff", wait: "42m", duration: "17m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-01 14:25:00", resource: "Dr. Patel", wait: "30m", duration: "28m" },
      { activity: "Treatment", timestamp: "2026-01-01 15:10:12", resource: "Dr. Patel", wait: "17m", duration: "21m" },
      { activity: "Discharge", timestamp: "2026-01-01 15:41:08", resource: "Staff", wait: "10m", duration: "5m" },
    ]
  },
  {
    caseId: "CASE000355",
    gender: "Female",
    ageGroup: "0-17",
    severity: "Medium",
    doctor: "Dr. Patel",
    eventsCount: 5,
    leadTime: "1h 48m",
    isLoopback: false,
    hasAnomaly: false,
    outcome: "Discharge",
    cost: "$310",
    satisfaction: 99,
    esiScore: 3,
    timeline: [
      { activity: "Registration", timestamp: "2026-01-01 08:56:49", resource: "Staff", wait: "2m", duration: "4m" },
      { activity: "Triage", timestamp: "2026-01-01 09:14:53", resource: "Staff", wait: "14m", duration: "8m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-01 10:02:06", resource: "Dr. Patel", wait: "39m", duration: "22m" },
      { activity: "Treatment", timestamp: "2026-01-01 10:24:25", resource: "Dr. Patel", wait: "0m", duration: "16m" },
      { activity: "Discharge", timestamp: "2026-01-01 10:45:20", resource: "Staff", wait: "5m", duration: "4m" },
    ]
  },
  {
    caseId: "CASE000189",
    gender: "Male",
    ageGroup: "61+",
    severity: "High",
    doctor: "Dr. Reddy",
    eventsCount: 4,
    leadTime: "1h 35m",
    isLoopback: false,
    hasAnomaly: true,
    outcome: "Admission",
    cost: "$1,450",
    satisfaction: 91,
    esiScore: 1,
    timeline: [
      { activity: "Registration", timestamp: "2026-01-01 14:10:00", resource: "Staff", wait: "1m", duration: "3m" },
      { activity: "Doctor Consultation (Bypass Triage)", timestamp: "2026-01-01 14:32:00", resource: "Dr. Reddy", wait: "19m", duration: "32m", isAnomaly: true },
      { activity: "Treatment", timestamp: "2026-01-01 15:15:00", resource: "Dr. Reddy", wait: "11m", duration: "25m" },
      { activity: "Admission", timestamp: "2026-01-01 15:45:00", resource: "Staff", wait: "5m", duration: "10m" },
    ]
  },
  {
    caseId: "CASE000445",
    gender: "Female",
    ageGroup: "41-60",
    severity: "Medium",
    doctor: "Dr. Iyer",
    eventsCount: 6,
    leadTime: "3h 40m",
    isLoopback: false,
    hasAnomaly: false,
    outcome: "Discharge",
    cost: "$480",
    satisfaction: 95,
    esiScore: 3,
    timeline: [
      { activity: "Registration", timestamp: "2026-01-01 11:03:42", resource: "Staff", wait: "5m", duration: "5m" },
      { activity: "Triage", timestamp: "2026-01-01 11:27:15", resource: "Staff", wait: "18m", duration: "10m" },
      { activity: "X-Ray", timestamp: "2026-01-01 12:20:00", resource: "Staff", wait: "43m", duration: "15m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-01 13:30:00", resource: "Dr. Iyer", wait: "55m", duration: "24m" },
      { activity: "Treatment", timestamp: "2026-01-01 14:15:00", resource: "Dr. Iyer", wait: "21m", duration: "18m" },
      { activity: "Discharge", timestamp: "2026-01-01 14:43:42", resource: "Staff", wait: "10m", duration: "5m" },
    ]
  },
  {
    caseId: "CASE000912",
    gender: "Male",
    ageGroup: "61+",
    severity: "High",
    doctor: "Dr. Sharma",
    eventsCount: 7,
    leadTime: "5h 10m",
    isLoopback: true,
    hasAnomaly: false,
    outcome: "Admission",
    cost: "$1,820",
    satisfaction: 86,
    esiScore: 2,
    timeline: [
      { activity: "Registration", timestamp: "2026-01-02 09:12:00", resource: "Staff", wait: "3m", duration: "5m" },
      { activity: "Triage", timestamp: "2026-01-02 09:35:00", resource: "Staff", wait: "18m", duration: "12m" },
      { activity: "X-Ray", timestamp: "2026-01-02 10:48:00", resource: "Staff", wait: "61m (Rush Hour)", duration: "20m" },
      { activity: "Triage (Loop-Back)", timestamp: "2026-01-02 11:40:00", resource: "Staff", wait: "32m (Paperwork Missing)", duration: "11m", isLoopback: true },
      { activity: "X-Ray (Repeated)", timestamp: "2026-01-02 12:35:00", resource: "Staff", wait: "44m", duration: "18m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-02 13:20:00", resource: "Dr. Sharma", wait: "27m", duration: "30m" },
      { activity: "Admission", timestamp: "2026-01-02 14:22:00", resource: "Staff", wait: "32m", duration: "15m" },
    ]
  },
  {
    caseId: "CASE000844",
    gender: "Female",
    ageGroup: "18-40",
    severity: "Low",
    doctor: "Dr. Khan",
    eventsCount: 5,
    leadTime: "2h 15m",
    isLoopback: false,
    hasAnomaly: false,
    outcome: "Discharge",
    cost: "$340",
    satisfaction: 96,
    esiScore: 4,
    timeline: [
      { activity: "Registration", timestamp: "2026-01-02 13:10:00", resource: "Staff", wait: "2m", duration: "4m" },
      { activity: "Triage", timestamp: "2026-01-02 13:30:00", resource: "Staff", wait: "16m", duration: "8m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-02 14:15:00", resource: "Dr. Khan", wait: "37m", duration: "24m" },
      { activity: "Treatment", timestamp: "2026-01-02 14:55:00", resource: "Dr. Khan", wait: "16m", duration: "18m" },
      { activity: "Discharge", timestamp: "2026-01-02 15:25:00", resource: "Staff", wait: "12m", duration: "5m" },
    ]
  },
  {
    caseId: "CASE000521",
    gender: "Male",
    ageGroup: "41-60",
    severity: "High",
    doctor: "Dr. Reddy",
    eventsCount: 6,
    leadTime: "4h 05m",
    isLoopback: false,
    hasAnomaly: false,
    outcome: "Admission",
    cost: "$1,380",
    satisfaction: 93,
    esiScore: 2,
    timeline: [
      { activity: "Registration", timestamp: "2026-01-02 15:00:00", resource: "Staff", wait: "2m", duration: "4m" },
      { activity: "Triage", timestamp: "2026-01-02 15:15:00", resource: "Staff", wait: "11m", duration: "12m" },
      { activity: "Lab Test", timestamp: "2026-01-02 15:45:00", resource: "Staff", wait: "18m", duration: "15m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-02 16:30:00", resource: "Dr. Reddy", wait: "30m", duration: "25m" },
      { activity: "Treatment", timestamp: "2026-01-02 17:10:00", resource: "Dr. Reddy", wait: "15m", duration: "30m" },
      { activity: "Admission", timestamp: "2026-01-02 19:05:00", resource: "Staff", wait: "85m", duration: "20m" },
    ]
  },
  {
    caseId: "CASE000612",
    gender: "Female",
    ageGroup: "61+",
    severity: "Medium",
    doctor: "Dr. Iyer",
    eventsCount: 7,
    leadTime: "5h 25m",
    isLoopback: true,
    hasAnomaly: false,
    outcome: "Discharge",
    cost: "$860",
    satisfaction: 85,
    esiScore: 3,
    timeline: [
      { activity: "Registration", timestamp: "2026-01-03 08:30:00", resource: "Staff", wait: "5m", duration: "5m" },
      { activity: "Triage", timestamp: "2026-01-03 09:00:00", resource: "Staff", wait: "25m", duration: "10m" },
      { activity: "X-Ray", timestamp: "2026-01-03 10:15:00", resource: "Staff", wait: "65m", duration: "18m" },
      { activity: "Triage (Loop-Back)", timestamp: "2026-01-03 11:10:00", resource: "Staff", wait: "37m", duration: "12m", isLoopback: true },
      { activity: "X-Ray (Repeated)", timestamp: "2026-01-03 12:05:00", resource: "Staff", wait: "43m", duration: "16m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-03 12:55:00", resource: "Dr. Iyer", wait: "34m", duration: "26m" },
      { activity: "Discharge", timestamp: "2026-01-03 13:55:00", resource: "Staff", wait: "34m", duration: "6m" },
    ]
  },
  {
    caseId: "CASE000219",
    gender: "Male",
    ageGroup: "18-40",
    severity: "Low",
    doctor: "Dr. Patel",
    eventsCount: 4,
    leadTime: "1h 50m",
    hasAnomaly: true,
    isLoopback: false,
    outcome: "Discharge",
    cost: "$290",
    satisfaction: 95,
    esiScore: 4,
    timeline: [
      { activity: "Registration", timestamp: "2026-01-03 14:10:00", resource: "Staff", wait: "2m", duration: "4m" },
      { activity: "Doctor Consultation (Triage Skip)", timestamp: "2026-01-03 14:35:00", resource: "Dr. Patel", wait: "21m", duration: "22m", isAnomaly: true },
      { activity: "Treatment", timestamp: "2026-01-03 15:10:00", resource: "Dr. Patel", wait: "13m", duration: "18m" },
      { activity: "Discharge", timestamp: "2026-01-03 16:00:00", resource: "Staff", wait: "32m", duration: "5m" },
    ]
  },
  {
    caseId: "CASE000994",
    gender: "Female",
    ageGroup: "41-60",
    severity: "High",
    doctor: "Dr. Sharma",
    eventsCount: 6,
    leadTime: "4h 12m",
    isLoopback: false,
    hasAnomaly: false,
    outcome: "Admission",
    cost: "$1,520",
    satisfaction: 92,
    esiScore: 1,
    timeline: [
      { activity: "Registration", timestamp: "2026-01-03 16:40:00", resource: "Staff", wait: "2m", duration: "4m" },
      { activity: "Triage", timestamp: "2026-01-03 16:55:00", resource: "Staff", wait: "9m", duration: "10m" },
      { activity: "Lab Test", timestamp: "2026-01-03 17:25:00", resource: "Staff", wait: "20m", duration: "15m" },
      { activity: "Doctor Consultation", timestamp: "2026-01-03 18:10:00", resource: "Dr. Sharma", wait: "30m", duration: "28m" },
      { activity: "Treatment", timestamp: "2026-01-03 19:00:00", resource: "Dr. Sharma", wait: "22m", duration: "35m" },
      { activity: "Admission", timestamp: "2026-01-03 20:52:00", resource: "Staff", wait: "77m", duration: "15m" },
    ]
  }
];

// Hospital Global Operations & Facility Capacity Status
export const HOSPITAL_OPERATIONAL_STATS = {
  facilityName: "Metropolitan Academic Medical Center",
  serviceLine: "Emergency Medicine, Trauma & Critical Care Division",
  overallBedCensus: {
    totalBeds: 250,
    occupiedBeds: 221,
    occupancyRate: "88.4%",
    status: "Surge Level 2 (Advisory)"
  },
  edCapacity: {
    totalBays: 45,
    occupiedBays: 38,
    occupancyRate: "84.4%",
    boardingPatients: 5,
    avgBoardingTime: "4h 12m",
    status: "Congested"
  },
  icuCapacity: {
    totalBeds: 20,
    occupiedBeds: 18,
    occupancyRate: "90.0%",
    status: "Critical Saturation"
  },
  ambulanceStatus: {
    condition: "OPEN (No Diversion)",
    bayCapacity: "6 / 8 Bays Active",
    turnaroundTime: "18.4 min",
    hourlyArrivalVelocity: "3.8 ambulances/hr"
  },
  evsCleaning: {
    bedsCleaningInProgress: 6,
    avgTurnaroundMin: 22,
    staffOnShift: 8
  },
  clinicalQuality: {
    lwbsRate: "0.8%", // Left Without Being Seen (Benchmark < 2.0%)
    cmsSepsisAdherence: "98.2%", // SEP-1 Compliance
    stemiDoorToBalloon: "68 min", // Benchmark < 90m
    strokeDoorToNeedle: "38 min", // Benchmark < 45m
    readmissionRate30d: "4.8%" // Benchmark < 6.5%
  }
};

// Hospital Department & Inpatient Unit Wards
export const HOSPITAL_WARDS = [
  {
    id: "ED-ZONE-A",
    name: "ED Acute Bay — Zone A",
    category: "Emergency Department",
    type: "High Acuity & Chest Pain",
    totalBeds: 22,
    occupiedBeds: 20,
    occupancyRate: 90.9,
    boardingCount: 3,
    status: "Warning",
    staffRatio: "1 : 3.2 (Target 1:3.0)",
    leadNurse: "Nurse J. Miller, RN BSN",
    evsCleaning: 2,
    pendingArrivals: 4
  },
  {
    id: "ED-ZONE-B",
    name: "ED Rapid Assessment — Zone B",
    category: "Emergency Department",
    type: "Urgent & Fast-Track (ESI 3-5)",
    totalBeds: 23,
    occupiedBeds: 18,
    occupancyRate: 78.3,
    boardingCount: 2,
    status: "Normal",
    staffRatio: "1 : 4.1 (Target 1:4.0)",
    leadNurse: "Nurse D. Washington, RN",
    evsCleaning: 1,
    pendingArrivals: 3
  },
  {
    id: "TRAUMA-RESUS",
    name: "Trauma Resuscitation Suites",
    category: "Emergency Department",
    type: "Level 1 Trauma (ESI-1)",
    totalBeds: 4,
    occupiedBeds: 3,
    occupancyRate: 75.0,
    boardingCount: 0,
    status: "Standby Alert",
    staffRatio: "2 : 1.0 (Critical 1:1)",
    leadNurse: "Clinical Coord. R. Chen, CCRN",
    evsCleaning: 1,
    pendingArrivals: 1
  },
  {
    id: "MICU-3",
    name: "Medical Intensive Care (MICU)",
    category: "Critical Care",
    type: "Inpatient ICU",
    totalBeds: 20,
    occupiedBeds: 18,
    occupancyRate: 90.0,
    boardingCount: 0,
    status: "Critical Saturation",
    staffRatio: "1 : 1.8 (Target 1:2.0)",
    leadNurse: "Nurse Supv. K. Adams, MSN",
    evsCleaning: 1,
    pendingArrivals: 2
  },
  {
    id: "CCU-CARDIAC",
    name: "Cardiac Intensive Care (CCU)",
    category: "Critical Care",
    type: "Post-Cath & STEMI",
    totalBeds: 14,
    occupiedBeds: 12,
    occupancyRate: 85.7,
    boardingCount: 0,
    status: "Normal",
    staffRatio: "1 : 1.9 (Target 1:2.0)",
    leadNurse: "Nurse M. Hernandez, RN",
    evsCleaning: 0,
    pendingArrivals: 1
  },
  {
    id: "STEPDOWN-4",
    name: "Telemetry & Step-Down Unit",
    category: "Intermediate Care",
    type: "Cardiovascular Telemetry",
    totalBeds: 32,
    occupiedBeds: 28,
    occupancyRate: 87.5,
    boardingCount: 0,
    status: "High Census",
    staffRatio: "1 : 3.8 (Target 1:3.5)",
    leadNurse: "Nurse P. Bradley, BSN",
    evsCleaning: 2,
    pendingArrivals: 4
  },
  {
    id: "MEDSURG-EAST",
    name: "Med-Surg General Inpatient",
    category: "General Inpatient",
    type: "Post-Surgical & Medical",
    totalBeds: 85,
    occupiedBeds: 76,
    occupancyRate: 89.4,
    boardingCount: 0,
    status: "High Census",
    staffRatio: "1 : 4.8 (Target 1:4.5)",
    leadNurse: "Nurse Director A. Scott, RN",
    evsCleaning: 4,
    pendingArrivals: 5
  },
  {
    id: "PACS-RAD",
    name: "Diagnostic Imaging & PACS Suite",
    category: "Diagnostics",
    type: "XR656 / CT Scanner / Lab",
    totalBeds: 12,
    occupiedBeds: 10,
    occupancyRate: 83.3,
    boardingCount: 0,
    status: "Morning Congestion",
    staffRatio: "1 : 2.5 (Technologists)",
    leadNurse: "Lead Radiologic Tech S. Gupta",
    evsCleaning: 0,
    pendingArrivals: 6
  }
];

// CMS & Joint Commission Hospital Quality Measures
export const CMS_QUALITY_MEASURES = [
  {
    id: "CMS-SEP-1",
    code: "SEP-1",
    name: "Severe Sepsis 3-Hour Bundle Adherence",
    benchmark: "≥ 95.0%",
    actual: "98.2%",
    status: "Optimal",
    regulatoryBody: "CMS / The Joint Commission",
    impact: "Protects capitated reimbursement & eliminates septic shock progression.",
    components: ["Blood Cultures Prior to Antibiotics", "Serum Lactate Assay", "Broad-Spectrum IV Antibiotics < 3h", "Crystalloid Fluid 30mL/kg"]
  },
  {
    id: "CMS-OP-18",
    code: "OP-18",
    name: "Median ED Stay for Non-Admitted (LOS)",
    benchmark: "< 180 min (3h)",
    actual: "165 min (Compliant) / 315 min (Loopback)",
    status: "Warning",
    regulatoryBody: "CMS Hospital Outpatient Quality",
    impact: "Paperwork rework loops extend discharge stay by 48-75 min above target.",
    components: ["Door-to-Triage < 15m", "Diagnostic Turnaround < 60m", "Discharge Nursing Handover < 15m"]
  },
  {
    id: "CMS-ED-BOARD",
    code: "ED-2b",
    name: "Admit Decision to ED Departure (Boarding)",
    benchmark: "< 240 min (4h)",
    actual: "252 min (4h 12m)",
    status: "Warning",
    regulatoryBody: "The Joint Commission National Patient Safety",
    impact: "Patients holding in ED bays block acute ambulances and increase diversion risk.",
    components: ["Inpatient Bed Request Sent", "Bed Cleaning (EVS) Complete", "Patient Transport & Inpatient Handover"]
  },
  {
    id: "CMS-CARD-1",
    code: "OP-40",
    name: "Door-to-ECG for Potential ACS / Chest Pain",
    benchmark: "< 10 min",
    actual: "7.2 min",
    status: "Optimal",
    regulatoryBody: "American College of Cardiology / AHA",
    impact: "Immediate identification of STEMI myocardial infarction candidates.",
    components: ["Immediate Triage ECG acquisition", "Attending MD reading and signature < 10m"]
  },
  {
    id: "CMS-STROKE-1",
    code: "STK-OP",
    name: "Acute Ischemic Stroke Door-to-Needle (tPA)",
    benchmark: "< 45 min",
    actual: "38 min",
    status: "Optimal",
    regulatoryBody: "AHA / ASA Target Stroke Honor Roll",
    impact: "Preserves neurological brain tissue through rapid thrombolysis.",
    components: ["Non-contrast Head CT order < 20m", "Radiology read < 35m", "IV Alteplase / Tenecteplase < 45m"]
  },
  {
    id: "CMS-HRRP",
    code: "HRRP-30",
    name: "30-Day Hospital Readmission Rate",
    benchmark: "< 6.5%",
    actual: "4.8%",
    status: "Optimal",
    regulatoryBody: "CMS Hospital Readmissions Reduction Program",
    impact: "Zero penalty assessment; demonstrates robust post-discharge care coordination.",
    components: ["Medication Reconciliation at Discharge", "PCP Follow-up Booked", "72h Post-Discharge Telehealth Check"]
  }
];

// Clinical Decision Support: ESI Acuity Protocols (1 to 5)
export const CLINICAL_ESI_PROTOCOLS = [
  {
    level: 1,
    title: "ESI-1: Resuscitation / Immediate Life Threat",
    responseTime: "IMMEDIATE (0 min)",
    examples: "Cardiac Arrest, Severe Respiratory Distress, Anaphylaxis, Trauma Resus",
    staffingMandate: "Dedicated 1:1 Nurse + Attending Physician at Bedside",
    cohortPercent: "14.2% of cohort (142 cases)",
    pathway: "Direct Trauma Bay Entry → Immediate Resuscitation → Inpatient ICU Admission (89.4%)"
  },
  {
    level: 2,
    title: "ESI-2: Emergent / High Acuity",
    responseTime: "< 15 minutes",
    examples: "Severe Sepsis, Acute Chest Pain / STEMI, Altered Mental Status, Suicidal Ideation",
    staffingMandate: "1:2 Nurse Ratio, Continuous Cardiac / Pulse Oximetry Telemetry",
    cohortPercent: "24.1% of cohort (241 cases)",
    pathway: "Priority Triage → STAT Labs & ECG → Attending Physician Exam → Telemetry Bed / Observation"
  },
  {
    level: 3,
    title: "ESI-3: Urgent (Requires 2+ Diagnostic Resources)",
    responseTime: "< 30 minutes",
    examples: "Abdominal Pain, Complex Fractures, Moderate Dehydration, High Fever",
    staffingMandate: "1:3 to 1:4 Nurse Ratio, Standard Monitoring",
    cohortPercent: "33.8% of cohort (338 cases)",
    pathway: "Standard Triage → X-Ray + Blood Labs → MD Consult → Medical Treatment → Safe Discharge"
  },
  {
    level: 4,
    title: "ESI-4: Less Urgent (1 Diagnostic Resource)",
    responseTime: "< 60 minutes",
    examples: "Simple Laceration needing sutures, Minor Ankle Sprain, Mild Dysuria",
    staffingMandate: "Fast-Track Zone Staffing, Nurse Practitioner / PA Pod",
    cohortPercent: "20.4% of cohort (204 cases)",
    pathway: "Rapid Check-in → Focused X-Ray or Urinalysis → Fast-Track Provider → Outpatient Discharge"
  },
  {
    level: 5,
    title: "ESI-5: Non-Urgent (0 Diagnostic Resources)",
    responseTime: "< 120 minutes",
    examples: "Prescription Refill, Minor Rash, Chronic Pain with no acute change",
    staffingMandate: "Triage Clinical Nurse or Triage Navigator",
    cohortPercent: "7.5% of cohort (75 cases)",
    pathway: "Nurse Assessment → Script Refill / Minor Dressing → Immediate Discharge"
  }
];

// Active Hospital Emergency Dispatch & Rapid Response Activity Log
export const ACTIVE_EMERGENCY_INCIDENTS = [
  { id: "INC-8812", time: "17:42", code: "CODE STEMI", location: "ED Acute Bay 3", patientId: "CASE000994", status: "Cath Lab Activated", leadMD: "Dr. Sharma", elapsedMin: "12m" },
  { id: "INC-8811", time: "16:15", code: "TRAUMA DELTA", location: "Trauma Suite 1", patientId: "CASE000189", status: "CT Trauma Scan Complete", leadMD: "Dr. Reddy", elapsedMin: "45m" },
  { id: "INC-8810", time: "14:28", code: "CODE SEPSIS", location: "ED Zone A Bay 8", patientId: "CASE000521", status: "Blood Cultures + Ceftriaxone Infused", leadMD: "Dr. Khan", elapsedMin: "1h 10m" },
  { id: "INC-8809", time: "11:05", code: "RAPID RESPONSE", location: "Med-Surg East 312", patientId: "CASE000612", status: "Stabilized - Telemetry Transfer", leadMD: "Dr. Iyer", elapsedMin: "Resolved" }
];


