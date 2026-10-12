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
  {
    id: "door_to_doc",
    category: "flow",
    title: "Door-to-Doctor (D2D)",
    value: "41 min",
    subtext: "Target: < 30 min",
    status: "warning",
    badge: "28.4% SLA Breaches",
    trend: "+8m vs baseline",
    trendPositive: false,
    detail: "Median duration from ED arrival registration to first licensed provider examination.",
    sparkline: [32, 36, 48, 56, 52, 44, 41, 38, 43, 41]
  },
  {
    id: "bed_utilization",
    category: "flow",
    title: "ED Bed Occupancy Index",
    value: "84.6%",
    subtext: "Capacity: 38 Acute Beds",
    status: "warning",
    badge: "Peak 97% at 10 AM",
    trend: "High Congestion",
    trendPositive: false,
    detail: "Active acute bed occupancy proportion, signaling emergency department boarding pressure.",
    sparkline: [62, 68, 85, 96, 97, 88, 82, 80, 84, 85]
  },
  {
    id: "economic_waste",
    category: "financial",
    title: "Annual Rework Waste",
    value: "$142,400",
    subtext: "$358 per loopback patient",
    status: "danger",
    badge: "398 Reworked Cases",
    trend: "Eliminable via CPOE",
    trendPositive: false,
    detail: "Excess direct operational costs from repetitive nursing triage and delayed discharge bed time.",
    sparkline: [120, 125, 134, 138, 142, 140, 142, 141, 143, 142]
  },
  {
    id: "avg_cost_case",
    category: "financial",
    title: "Avg Cost per Patient Case",
    value: "$612",
    subtext: "Compliant: $480 | Rework: $890",
    status: "info",
    badge: "+85% Cost Spike",
    trend: "High Variance",
    trendPositive: false,
    detail: "Mean total operational encounter cost across diagnostic testing, physician hours, and facility overhead.",
    sparkline: [580, 595, 620, 640, 615, 608, 610, 615, 614, 612]
  },
  {
    id: "sepsis_conformance",
    category: "quality",
    title: "Clinical Bundle Adherence",
    value: "98.2%",
    subtext: "National benchmark: 95.0%",
    status: "success",
    badge: "Top Decile Safety",
    trend: "+3.2% vs benchmark",
    trendPositive: true,
    detail: "Compliance with mandated acute care resuscitation protocols within initial 60 minutes.",
    sparkline: [95, 96, 97, 98, 97, 98, 99, 98, 98, 98]
  },
  {
    id: "staffing_efficiency",
    category: "quality",
    title: "Physician Consult Parity",
    value: "95.2%",
    subtext: "24–29m range across 5 MDs",
    status: "success",
    badge: "Equitable Load",
    trend: "Balanced Caseloads",
    trendPositive: true,
    detail: "Distribution coefficient across 5 emergency department attending physicians.",
    sparkline: [92, 93, 94, 95, 95, 96, 95, 94, 95, 95]
  }
];
