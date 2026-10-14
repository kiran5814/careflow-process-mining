import React, { useState } from 'react';
import { 
  Brain, GitBranch, CheckCircle2, Calculator, 
  Download, Activity, ShieldCheck, ShieldAlert, Sparkles, 
  Layers, Users, Building2, Target, Cpu, ArrowRight 
} from 'lucide-react';

// ==========================================
// 1. ISHIKAWA (FISHBONE) ROOT CAUSE DATA
// ==========================================
const FISHBONE_CATEGORIES = [
  {
    id: 'process',
    name: 'Process & Workflow',
    shortName: 'Process',
    color: '#06b6d4',
    icon: Activity,
    causes: [
      {
        id: 'c1',
        title: 'Missing Physician Order Countersignature',
        prevalence: '39.8% of X-Ray cases (398 pts)',
        delayImpact: '+38 min dwell delay',
        costImpact: '$84,000 / year excess waste',
        detail: 'Paper requisition forms lack mandatory clinical indication checkboxes and attending doctor signature before radiology transport, forcing nursing re-triage.',
        capaRef: 'CAPA-2026-001',
        severity: 'Critical'
      },
      {
        id: 'c2',
        title: 'Sequential Order Batching',
        prevalence: '21.5% of cohort (215 pts)',
        delayImpact: '+18 min triage queue delay',
        costImpact: '$22,500 / year',
        detail: 'Triage staff accumulate physical imaging orders into batches rather than transmitting orders continuously as patients arrive.',
        capaRef: 'CAPA-2026-001',
        severity: 'Medium'
      },
      {
        id: 'c3',
        title: 'Secondary Repeat Triage Re-Entry Loop',
        prevalence: '39.8% of X-Ray cases (398 pts)',
        delayImpact: '+24 min repeat nursing assessment',
        costImpact: '$35,900 / year',
        detail: 'Rejected paper requisition forms require full nursing re-assessment and chart re-opening rather than a fast-tracked amendment protocol.',
        capaRef: 'CAPA-2026-001',
        severity: 'High'
      }
    ]
  },
  {
    id: 'people',
    name: 'People & Staffing',
    shortName: 'People',
    color: '#f59e0b',
    icon: Users,
    causes: [
      {
        id: 'c4',
        title: 'Single-Tech Radiology Staffing in Morning Rush',
        prevalence: 'Surge hours 08:00 - 11:00 AM (420 pts)',
        delayImpact: '+54 min avg imaging wait (+237%)',
        costImpact: '$48,000 / year',
        detail: 'Only 1 radiologic technologist is rostered during the peak 102 pt/hr morning intake, while 2 techs are assigned to the low-volume afternoon lull.',
        capaRef: 'CAPA-2026-002',
        severity: 'Critical'
      },
      {
        id: 'c5',
        title: 'Shift Changeover Telemetry Void (07:00-08:00)',
        prevalence: 'Daily morning shift change (180 pts)',
        delayImpact: '+22 min handover delay',
        costImpact: '$18,000 / year',
        detail: 'No structured asynchronous EHR bedside handoff tool exists between night and day shift nursing teams, delaying active intake triage.',
        capaRef: 'CAPA-2026-002',
        severity: 'Medium'
      },
      {
        id: 'c6',
        title: 'Attending Physician Sign-Off Queue',
        prevalence: '31.0% of cases (310 pts)',
        delayImpact: '+15 min physician sign-off wait',
        costImpact: '$14,000 / year',
        detail: 'Residents must await senior attending countersignature before ordering contrast diagnostic series without emergency fast-track privileges.',
        capaRef: 'CAPA-2026-003',
        severity: 'Medium'
      }
    ]
  },
  {
    id: 'tech',
    name: 'Technology & EHR',
    shortName: 'Technology',
    color: '#8b5cf6',
    icon: Cpu,
    causes: [
      {
        id: 'c7',
        title: 'Paper Slip Disconnect from EHR Intake',
        prevalence: '39.8% of cases (398 pts)',
        delayImpact: '+48 min total rework delay',
        costImpact: '$142,400 / year total',
        detail: 'Legacy radiology imaging system (PACS) operates independently from the EHR triage intake module, forcing manual carbon-copy paper slips.',
        capaRef: 'CAPA-2026-001',
        severity: 'Critical'
      },
      {
        id: 'c8',
        title: 'Absence of CPOE Field Validation Hard-Stops',
        prevalence: '100% of paper orders',
        delayImpact: '+35 min rectification lag',
        costImpact: '$31,000 / year',
        detail: 'EHR intake does not block submission of diagnostic imaging orders when required clinical criteria or physician IDs are blank.',
        capaRef: 'CAPA-2026-001',
        severity: 'High'
      },
      {
        id: 'c9',
        title: 'Missing Mobile Barcode Bedside Scanning',
        prevalence: '52.0% of non-ambulatory pts',
        delayImpact: '+12 min chart verification',
        costImpact: '$16,200 / year',
        detail: 'Lack of mobile handheld RFID/barcode scanners at ED bedside forces nurses to walk to central nurse desks to update chart statuses.',
        capaRef: 'CAPA-2026-005',
        severity: 'Medium'
      }
    ]
  },
  {
    id: 'policy',
    name: 'Policy & Governance',
    shortName: 'Policy',
    color: '#f43f5e',
    icon: ShieldAlert,
    causes: [
      {
        id: 'c10',
        title: 'Physical Wet-Signature Mandate on X-Ray Orders',
        prevalence: '39.8% of orders (398 pts)',
        delayImpact: '+32 min physical transport dwell',
        costImpact: '$41,000 / year',
        detail: 'Hospital bylaws historically mandated physical ink doctor signatures for portable and standard radiographs rather than authenticated 2FA electronic signatures.',
        capaRef: 'CAPA-2026-001',
        severity: 'High'
      },
      {
        id: 'c11',
        title: 'Undefined Trauma Fast-Track Triage Override',
        prevalence: '5.1% of cohort (51 pts)',
        delayImpact: '+45 min medico-legal risk',
        costImpact: '$55,000 liability exposure',
        detail: '51 critical acuity patients bypassed triage acuity assignment straight to consult without required Emergency Fast-Track documentation.',
        capaRef: 'CAPA-2026-003',
        severity: 'Critical'
      },
      {
        id: 'c12',
        title: 'No Automated SLA Breach Escalation Alerts',
        prevalence: '24.0% of delayed pts (240 pts)',
        delayImpact: '+20 min prolonged queue dwelling',
        costImpact: '$19,500 / year',
        detail: 'Department lacks automated paging triggers when a patient remains queued outside radiology for over 30 minutes without active imaging scan.',
        capaRef: 'CAPA-2026-002',
        severity: 'Medium'
      }
    ]
  },
  {
    id: 'environment',
    name: 'Environment & Facilities',
    shortName: 'Environment',
    color: '#10b981',
    icon: Building2,
    causes: [
      {
        id: 'c13',
        title: 'Inpatient Bed Turnover Lag (EVS Turnaround)',
        prevalence: '28.0% of admissions (280 pts)',
        delayImpact: '+75 min acute ED boarding dwell',
        costImpact: '$92,000 / year bed day loss',
        detail: 'Average inpatient bed turnaround is 4h 12m, leaving acute admitted patients boarding in ED treatment bays and causing ambulance diversions.',
        capaRef: 'CAPA-2026-004',
        severity: 'Critical'
      },
      {
        id: 'c14',
        title: 'ED Triage to Radiology Physical Transit Bottleneck',
        prevalence: '61.0% of imaging pts (610 pts)',
        delayImpact: '+14 min transit & portering wait',
        costImpact: '$12,800 / year',
        detail: 'Radiology suite is located down an elevator wing away from ED Zone A, causing transit delays when dedicated patient transport staff are occupied.',
        capaRef: 'CAPA-2026-002',
        severity: 'Low'
      },
      {
        id: 'c15',
        title: 'Acute Bay Saturation Above 90% Threshold',
        prevalence: 'Surge hours 09:00 - 13:00',
        delayImpact: '+28 min hallway holding dwell',
        costImpact: '$34,000 / year',
        detail: 'ED bays reach 92% capacity during morning peaks, forcing non-ambulatory patients to hold in observation corridors.',
        capaRef: 'CAPA-2026-004',
        severity: 'High'
      }
    ]
  },
  {
    id: 'measurement',
    name: 'Measurement & Metrics',
    shortName: 'Measurement',
    color: '#38bdf8',
    icon: Target,
    causes: [
      {
        id: 'c16',
        title: 'Non-Standardized ESI Acuity Recalibration',
        prevalence: '9.5% of cases (95 pts)',
        delayImpact: '+15 min acuity misclassification',
        costImpact: '$11,000 / year',
        detail: 'Triage acuity scoring exhibits variance across triage nurses, causing intermediate acuity patients to wait alongside low-acuity walk-ins.',
        capaRef: 'CAPA-2026-003',
        severity: 'Medium'
      },
      {
        id: 'c17',
        title: 'EHR Timestamp Drift Between PACS and ED Logs',
        prevalence: '100% of event records (6,347 events)',
        delayImpact: '+10 min telemetry audit overhead',
        costImpact: '$8,500 / year',
        detail: 'PACS imaging timestamps previously drifted by 3 to 7 seconds from ED telemetry, requiring dbt ELT staging models for reconciliation.',
        capaRef: 'CAPA-2026-005',
        severity: 'Low'
      },
      {
        id: 'c18',
        title: 'Absence of Real-Time Queue Depth Dashboards at Triage',
        prevalence: '45.0% of shifts',
        delayImpact: '+25 min blind queue dispatching',
        costImpact: '$21,000 / year',
        detail: 'Triage nurses cannot view live radiology queue depth, routing patients to imaging even when the queue exceeds 10 patients.',
        capaRef: 'CAPA-2026-002',
        severity: 'High'
      }
    ]
  }
];

// ==========================================
// 2. 5-WHYS CLINICAL FORENSIC CASES
// ==========================================
const FIVE_WHYS_CASES = [
  {
    id: 'paperwork',
    title: 'The Radiology Paperwork Loop (39.8% Rework)',
    subtitle: 'Investigation into why 398 patients required duplicate triage assessments',
    impact: '+$142,400 / yr excess waste • +48 min dwell delay per patient',
    steps: [
      {
        level: 1,
        question: 'Why did 398 emergency patients return to Nursing Triage after reaching the Radiology imaging bay?',
        finding: 'The Radiology technologist rejected the paper requisition order and turned the patient back to the ED intake area.',
        evidence: 'EHR transition log confirms 398 instances of [Triage → X-Ray → Triage → X-Ray] sequence with mean loopback duration of 48.3 minutes.',
        dataPoint: '398 loopback cases (39.8% of X-Ray cohort)'
      },
      {
        level: 2,
        question: 'Why did the Radiology technologist reject the requisition order?',
        finding: 'The physical order slips lacked mandatory clinical indication checkboxes and the attending emergency physician countersignature.',
        evidence: 'Radiology rejection log audit indicates 92.4% (368/398) of rejected slips were flagged for "Incomplete Clinical Justification / Missing MD ID".',
        dataPoint: '92.4% documentation omission rate'
      },
      {
        level: 3,
        question: 'Why were the clinical indication checkboxes and physician signatures omitted?',
        finding: 'Triage nurses were manually filling out 3-part carbon-copy paper slips by hand during the morning rush while managing rapid intake queues.',
        evidence: 'Peak loopback origin correlates with triage intake surges >80 patients/hour where nurse form completion time dropped from 3.8m to 1.1m.',
        dataPoint: 'Intake surge speed: 1.1 min/form under pressure'
      },
      {
        level: 4,
        question: 'Why were triage nurses using manual carbon-copy paper forms instead of digital EHR ordering?',
        finding: 'The hospital’s legacy Radiology PACS software operated as an isolated silo without an electronic interface to the ED EHR triage intake module.',
        evidence: 'System architecture audit confirmed no HL7 ORM order message interface between EHR and Radiology department.',
        dataPoint: 'No HL7 ORM interface deployed'
      },
      {
        level: 5,
        isRootCause: true,
        question: 'Why did the system lack automated mandatory field validation and electronic order entry?',
        finding: 'ROOT CAUSE: The facility had not implemented Computerized Physician Order Entry (CPOE) with EHR hard-stops requiring mandatory field completion before dispatch.',
        evidence: 'Standard CPOE adoption benchmark in peer academic medical centers is 99.4%; Metropolitan AMC was operating at 0% digital order entry for ED radiology.',
        dataPoint: '0% CPOE adoption for initial ED triage orders'
      }
    ],
    remediation: {
      action: 'Deploy CPOE Mandatory Digital Requisitions with EHR Hard-Stop Validation',
      owner: 'Dr. Sarah Chen (Chief Medical Informatics Officer)',
      projectedSavings: '$142,400 / year',
      dwellReduction: '-48 minutes per reworked patient',
      tjcCompliance: 'Achieves Joint Commission Standard IM.02.02.01 (Complete Medical Record Documentation)'
    }
  },
  {
    id: 'morning',
    title: 'Morning Rush Radiology Congestion (+237% Delay)',
    subtitle: 'Investigation into why radiology wait times surge from 16 to 54 minutes between 08:00 and 11:00 AM',
    impact: 'Severe ED bay gridlock • 54 min peak wait time • 102 pt/hr intake surge',
    steps: [
      {
        level: 1,
        question: 'Why did radiology queue wait times surge from 16 min to 54 min (+237%) between 08:00 and 11:00 AM?',
        finding: 'Patient queue length outside Radiology Room 1 expanded to an average of 14.2 waiting patients simultaneously.',
        evidence: 'Hourly telemetry log records peak queue depth of 18 patients at 09:45 AM, compared to 2.1 patients at 15:00.',
        dataPoint: '14.2 patients in queue at morning peak'
      },
      {
        level: 2,
        question: 'Why did the queue swell to over 14 patients during those morning hours?',
        finding: 'Hourly emergency arrivals peaked at 102 patients/hour as ambulatory morning walk-ins compounded with clinic transfer arrivals.',
        evidence: 'Time-series volume analysis demonstrates an arrival peak of 102 pts/hr at 09:00 AM versus 42 pts/hr daily baseline average.',
        dataPoint: '102 patients/hr (2.4x baseline influx)'
      },
      {
        level: 3,
        question: 'Why was the Radiology Department unable to process the arrival influx?',
        finding: 'Only 1 radiologic technologist was on active duty in Radiology Room 1 during the peak 08:00 - 11:00 AM window.',
        evidence: 'Radiology technician shift schedule confirms 1 technician on duty between 07:00 and 12:00, with 2 technicians rostered from 13:00 to 19:00.',
        dataPoint: '1 technician processing 102 arriving patients/hr'
      },
      {
        level: 4,
        question: 'Why was only 1 technician rostered during the peak morning arrival window?',
        finding: 'The departmental staffing schedule was created using static 8-hour legacy shift blocks allocating heavier staffing to afternoon shifts.',
        evidence: 'Historical shift template designed 4 years ago assumed peak trauma arrived in late afternoon/evening, ignoring current ambulatory morning walk-in trends.',
        dataPoint: 'Static 4-year-old shift template'
      },
      {
        level: 5,
        isRootCause: true,
        question: 'Why had the staffing schedule not been aligned with empirical patient arrival telemetry?',
        finding: 'ROOT CAUSE: Staff scheduling operated in administrative isolation without integration to real-time EHR process mining and hourly arrival density models.',
        evidence: 'Shift scheduling software lacked an automated data bridge from EHR registration logs, preventing dynamic demand-based shift balancing.',
        dataPoint: 'Zero integration between staffing and EHR arrival logs'
      }
    ],
    remediation: {
      action: 'Implement Dynamic Staff Rebalancing: Shift 1 Technician from 14:00 Lull to 08:00-11:00 AM Rush',
      owner: 'Marcus Vance, RT (Director of Diagnostic Imaging Operations)',
      projectedSavings: 'Net 0 payroll cost • -38 min wait time reduction',
      dwellReduction: '-38 minutes wait time (from 54 min down to 16 min)',
      tjcCompliance: 'Eliminates emergency overcrowding violation CMS OP-18'
    }
  }
];

// ==========================================
// 3. CAPA REMEDIATION ACTION REGISTER
// ==========================================
const INITIAL_CAPAS = [
  {
    id: 'CAPA-2026-001',
    title: 'CPOE Mandatory Digital Requisitions & Validation Hard-Stop',
    targetCause: 'Paper Slip Disconnect & Missing Countersignatures (Causes c1, c7, c8, c10)',
    remediationPlan: 'Deploy Cerner/Epic electronic order entry with mandatory indication checkboxes and 2FA biometric physician sign-off. Enforce hard-stop preventing order submission with unverified fields.',
    owner: 'Dr. Sarah Chen, CMIO',
    department: 'Radiology & Emergency Nursing',
    targetDate: '2026-11-15',
    status: 'In Progress',
    progress: 85,
    annualSavings: '$142,400',
    timeReduction: '-48 min / case',
    complianceImpact: 'CMS OP-18 & Joint Commission IM.02.02.01'
  },
  {
    id: 'CAPA-2026-002',
    title: 'Dynamic Hourly Shift Rebalancing for Radiology Technologists',
    targetCause: 'Single-Tech Staffing during Morning Peak Surge (Causes c4, c12, c18)',
    remediationPlan: 'Rebalance radiology staffing schedule by shifting 1 FTE radiologic technician from the 14:00 lull to the 08:00-11:00 AM morning peak surge. Establish real-time queue depth dashboard at triage.',
    owner: 'Marcus Vance, RT (Radiology Ops)',
    department: 'Diagnostic Imaging',
    targetDate: '2026-10-30',
    status: 'Approved',
    progress: 45,
    annualSavings: '$48,000 (0 payroll cap)',
    timeReduction: '-38 min wait',
    complianceImpact: 'CMS OP-18 Emergency Throughput'
  },
  {
    id: 'CAPA-2026-003',
    title: 'Emergency Fast-Track Clinical Protocol Bypass Hard-Stop',
    targetCause: 'Undefined Trauma Fast-Track Triage Override (Causes c11, c16)',
    remediationPlan: 'Configure EHR gatekeeper requiring either a verified ESI Acuity Score (1-5) or an explicit authenticated "Code Delta / Trauma Resuscitation Bypass" override before consultation orders can be created.',
    owner: 'Rachel Adams, RN (ED Nurse Mgr)',
    department: 'Emergency Medicine',
    targetDate: '2026-11-05',
    status: 'Under Validation',
    progress: 90,
    annualSavings: '$55,000 risk avoidance',
    timeReduction: '100% Protocol Parity',
    complianceImpact: 'CMS Quality Measure SEP-1 & TJC LD.04.03.01'
  },
  {
    id: 'CAPA-2026-004',
    title: 'Environmental Services (EVS) Bed Turnover Telemetry Integration',
    targetCause: 'Inpatient Bed Turnover Lag & ED Boarding Crisis (Causes c13, c15)',
    remediationPlan: 'Equip EVS housekeeping supervisors with automated IoT bed vacancy alert pagers immediately upon patient discharge orders. Implement 45-minute terminal bed clean SLA.',
    owner: 'David Morales (VP Facilities)',
    department: 'Environmental Services',
    targetDate: '2026-12-01',
    status: 'Approved',
    progress: 30,
    annualSavings: '$92,000 bed capacity',
    timeReduction: '-52 min boarding',
    complianceImpact: 'CMS ED-2b Admit to Departure'
  },
  {
    id: 'CAPA-2026-005',
    title: 'Bedside Mobile RFID / Barcode Direct Patient Registration',
    targetCause: 'Unregistered Direct Arrivals & Timestamp Drifts (Causes c9, c17)',
    remediationPlan: 'Deploy 25 Zebra handheld RFID wristband scanners for acute bay admission nurses. Reconcile PACS DICOM timestamps with ED EHR telemetry via sub-second NTP synchronization.',
    owner: 'Elena Rostova (Patient Access Dir)',
    department: 'Health Informatics & Admissions',
    targetDate: '2026-10-20',
    status: 'Completed',
    progress: 100,
    annualSavings: '$24,700 billing recovery',
    timeReduction: '-12 min chart lag',
    complianceImpact: 'HIPAA & Joint Commission NPSG.01.01.01'
  }
];

// ==========================================
// 4. PREDICTIVE SHAP WATERFALL PRESETS
// ==========================================
const SHAP_PRESETS = [
  {
    id: 'loopback',
    name: 'Patient Alpha: Morning Rush + Paperwork Loopback',
    age: '61+',
    acuity: 'High',
    hour: '09:00',
    hasLoop: true,
    hasBoarding: true,
    description: 'Elderly patient arriving at 09:00 AM, high clinical acuity, experiences paper order bounce-back and inpatient bed boarding delay.'
  },
  {
    id: 'standard',
    name: 'Patient Beta: Afternoon Standard Flow (Compliant)',
    age: '41-60',
    acuity: 'Medium',
    hour: '14:00',
    hasLoop: false,
    hasBoarding: false,
    description: 'Adult patient arriving during afternoon nominal volume, compliant digital workflow, regular discharge without loopback.'
  },
  {
    id: 'trauma',
    name: 'Patient Gamma: Trauma Resuscitation Fast-Track',
    age: '18-40',
    acuity: 'High',
    hour: '21:00',
    hasLoop: false,
    hasBoarding: true,
    description: 'Young adult critical trauma patient arriving at night, expedited workup directly to intensive care admission.'
  },
  {
    id: 'night',
    name: 'Patient Delta: Low Acuity Night Ambulatory',
    age: '18-40',
    acuity: 'Low',
    hour: '21:00',
    hasLoop: false,
    hasBoarding: false,
    description: 'Minor injury ambulatory walk-in at 21:00 with rapid single-pass diagnostics and fast outpatient discharge.'
  }
];

export default function RootCauseAnalysis() {
  const [activeTab, setActiveTab] = useState('fishbone'); // 'fishbone', 'shap', 'fivewhys', 'capa', 'ml'
  
  // Fishbone State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inspectedCause, setInspectedCause] = useState(FISHBONE_CATEGORIES[0].causes[0]);
  const [fishboneViewMode, setFishboneViewMode] = useState('diagram'); // 'diagram' or 'cards'

  // 5-Whys State
  const [selectedWhyTopic, setSelectedWhyTopic] = useState('paperwork');

  // CAPA State
  const [capasList, setCapasList] = useState(INITIAL_CAPAS);
  const [capaFilter, setCapaFilter] = useState('ALL');

  // SHAP / Custom Patient Simulator State
  const [selectedPresetId, setSelectedPresetId] = useState('loopback');
  const [calcAge, setCalcAge] = useState('61+');
  const [calcAcuity, setCalcAcuity] = useState('High');
  const [calcHour, setCalcHour] = useState('09:00');
  const [calcXrayLoop, setCalcXrayLoop] = useState(true);
  const [calcBoarding, setCalcBoarding] = useState(true);

  // Apply preset to simulator
  const applyPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setCalcAge(preset.age);
    setCalcAcuity(preset.acuity);
    setCalcHour(preset.hour);
    setCalcXrayLoop(preset.hasLoop);
    setCalcBoarding(preset.hasBoarding);
  };

  // Compute SHAP components
  const baseMinutes = 110; // E[Y] Baseline expected clinical dwell
  const loopbackImpact = calcXrayLoop ? 85 : 0;
  const isMorning = ['08:00', '09:00', '10:00', '11:00'].includes(calcHour);
  const isNight = ['20:00', '21:00', '22:00', '23:00'].includes(calcHour);
  const timeImpact = isMorning ? 65 : isNight ? -25 : -15;
  const acuityImpact = calcAcuity === 'High' ? 40 : calcAcuity === 'Medium' ? 18 : -12;
  const ageImpact = calcAge === '61+' ? 32 : calcAge === '41-60' ? 14 : calcAge === '0-17' ? -10 : 0;
  const boardingImpact = calcBoarding ? 48 : 0;
  const physicianVariation = -4; // Empirical doctor efficiency mean delta

  const predictedStayMinutes = Math.max(45, baseMinutes + loopbackImpact + timeImpact + acuityImpact + ageImpact + boardingImpact + physicianVariation);
  const predictedHours = Math.floor(predictedStayMinutes / 60);
  const predictedMins = predictedStayMinutes % 60;
  const delayRiskPercentage = Math.min(99, Math.round((predictedStayMinutes / 340) * 100));

  // SHAP Waterfall steps array
  let runningTotal = baseMinutes;
  const shapSteps = [
    {
      feature: 'Base Expected Stay E[Y]',
      type: 'base',
      val: baseMinutes,
      start: 0,
      end: baseMinutes,
      color: '#06b6d4',
      badge: 'Benchmark',
      desc: 'Average compliant hospital intake-to-discharge trajectory'
    },
    {
      feature: 'Radiology Paperwork Loop',
      type: loopbackImpact >= 0 ? 'pos' : 'neg',
      val: loopbackImpact,
      start: runningTotal,
      end: (runningTotal += loopbackImpact),
      color: loopbackImpact > 0 ? '#f43f5e' : '#10b981',
      badge: loopbackImpact > 0 ? '+85m Penalty' : '0m Compliant',
      desc: calcXrayLoop ? 'Incomplete paper requisition caused repeat nursing triage' : 'Direct single-pass digital CPOE order'
    },
    {
      feature: 'Arrival Window Congestion',
      type: timeImpact >= 0 ? 'pos' : 'neg',
      val: timeImpact,
      start: runningTotal,
      end: (runningTotal += timeImpact),
      color: timeImpact > 0 ? '#f59e0b' : '#10b981',
      badge: timeImpact > 0 ? `+${timeImpact}m Surge` : `${timeImpact}m Low Volume`,
      desc: isMorning ? 'Arrival during 08:00-11:00 AM peak (102 pt/hr vs 1 tech)' : isNight ? 'Evening low-congestion intake' : 'Afternoon nominal intake'
    },
    {
      feature: 'Clinical Acuity Tier (ESI)',
      type: acuityImpact >= 0 ? 'pos' : 'neg',
      val: acuityImpact,
      start: runningTotal,
      end: (runningTotal += acuityImpact),
      color: acuityImpact > 0 ? '#ec4899' : '#10b981',
      badge: acuityImpact > 0 ? `+${acuityImpact}m Workup` : `${acuityImpact}m Simple`,
      desc: `Acuity ${calcAcuity} requires corresponding diagnostic complexity`
    },
    {
      feature: 'Age Group Demographics',
      type: ageImpact >= 0 ? 'pos' : 'neg',
      val: ageImpact,
      start: runningTotal,
      end: (runningTotal += ageImpact),
      color: ageImpact > 0 ? '#8b5cf6' : '#10b981',
      badge: ageImpact > 0 ? `+${ageImpact}m Geriatric` : `${ageImpact}m Young`,
      desc: calcAge === '61+' ? 'Multiple comorbidities and mobility assistance requirements' : 'Nominal ambulatory patient workup'
    },
    {
      feature: 'Inpatient Bed Turnover (EVS)',
      type: boardingImpact > 0 ? 'pos' : 'neg',
      val: boardingImpact,
      start: runningTotal,
      end: (runningTotal += boardingImpact),
      color: boardingImpact > 0 ? '#f43f5e' : '#10b981',
      badge: boardingImpact > 0 ? '+48m Boarding' : 'No Boarding',
      desc: calcBoarding ? 'Admitted patient dwells in acute ED bay awaiting EVS cleaning' : 'Direct outpatient discharge or immediate ward transfer'
    },
    {
      feature: 'Physician Workload Efficiency',
      type: 'neg',
      val: physicianVariation,
      start: runningTotal,
      end: (runningTotal += physicianVariation),
      color: '#10b981',
      badge: '-4m Parity',
      desc: 'Care team turnaround velocity across attending emergency physicians'
    }
  ];

  // Update CAPA status
  const updateCapaStatus = (id, newStatus) => {
    setCapasList(prev => prev.map(c => {
      if (c.id === id) {
        let newProgress = c.progress;
        if (newStatus === 'Completed') newProgress = 100;
        else if (newStatus === 'Under Validation') newProgress = 90;
        else if (newStatus === 'In Progress') newProgress = 65;
        else if (newStatus === 'Approved') newProgress = 35;
        return { ...c, status: newStatus, progress: newProgress };
      }
      return c;
    }));
  };

  // Export CAPA to CSV
  const handleExportCapaCsv = () => {
    const headers = ["CAPA ID", "Title", "Target Cause", "Remediation Plan", "Owner", "Department", "Target Date", "Status", "Progress", "Annual Savings", "Time Reduction", "Compliance Standard"];
    const rows = capasList.map(c => [
      `"${c.id}"`,
      `"${c.title}"`,
      `"${c.targetCause}"`,
      `"${c.remediationPlan.replace(/"/g, '""')}"`,
      `"${c.owner}"`,
      `"${c.department}"`,
      `"${c.targetDate}"`,
      `"${c.status}"`,
      `"${c.progress}%"`,
      `"${c.annualSavings}"`,
      `"${c.timeReduction}"`,
      `"${c.complianceImpact}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CareFlow_CAPA_Governance_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCapas = capaFilter === 'ALL' 
    ? capasList 
    : capasList.filter(c => c.status === capaFilter);

  // Model diagnostics stats
  const mlModelMetrics = {
    modelType: "Gradient Boosted Decision Trees (XGBoost Classifier)",
    crossVal: "5-Fold Stratified K-Fold Cross Validation",
    aucRoc: 0.942,
    f1Score: 0.918,
    precision: 0.935,
    recall: 0.902,
    accuracy: 92.4,
    confusionMatrix: {
      tp: 428, // Correctly predicted severe delay
      fp: 32,  // Predicted delay, but had normal flow
      fn: 46,  // Predicted normal, but delayed
      tn: 494  // Correctly predicted compliant flow
    }
  };

  const decisionRules = [
    {
      rule: "IF (X-Ray Re-Triage Loopback = TRUE) AND (Arrival Window = 08:00 - 11:00 AM)",
      outcome: "Critical Process Bottleneck (> 5.5 Hours Dwell)",
      confidence: "94.2%",
      support: "17.6% of cohort",
      lift: "3.4x higher delay risk",
      status: "critical"
    },
    {
      rule: "IF (Arrival Acuity = High) AND (EVS Bed Turnover > 4 Hours)",
      outcome: "Severe Acute Inpatient ED Boarding Crisis",
      confidence: "91.8%",
      support: "14.2% of cohort",
      lift: "2.9x bed blocking rate",
      status: "critical"
    },
    {
      rule: "IF (Triage Acuity = Bypassed) AND (Arrival = Emergency Walk-In)",
      outcome: "Severe Protocol Violation (High Medico-legal & Joint Commission Risk)",
      confidence: "88.5%",
      support: "5.1% of cohort",
      lift: "8.1x compliance audit flag",
      status: "violation"
    },
    {
      rule: "IF (Digital CPOE = Enabled) AND (Arrival = Nominal 13:00 - 19:00)",
      outcome: "Optimal Throughput (< 2.2 Hours Total Lead Time)",
      confidence: "96.4%",
      support: "42.5% of cohort",
      lift: "4.1x compliance attainment",
      status: "optimal"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      
      {/* ======================================================== */}
      {/* 1. EXECUTIVE HEADER BANNER & FORENSIC TELEMETRY CHIPS   */}
      {/* ======================================================== */}
      <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '380px', height: '100%',
          background: 'radial-gradient(ellipse at top right, rgba(6,182,212,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(139,92,246,0.3))',
                border: '1px solid rgba(6,182,212,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee'
              }}>
                <Brain size={20} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                Root Cause Analysis (RCA) & Forensic Explainable AI
              </h2>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                <Sparkles size={11} /> Joint Commission & TJC Ready
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                <Cpu size={11} /> XGBoost ML Explainability
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '820px', lineHeight: 1.5 }}>
              Institutional-grade clinical process forensics identifying systemic operational root causes behind the 
              <strong style={{ color: '#fbbf24' }}> 39.8% Radiology Paperwork Loop</strong>, 
              <strong style={{ color: '#fb7185' }}> +237% Morning Queue Surges</strong>, and 
              <strong style={{ color: '#a5b4fc' }}> Inpatient ED Boarding Delays</strong>.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(10, 16, 30, 0.65)', border: '1px solid rgba(244,63,94,0.3)',
              borderRadius: '10px', padding: '8px 12px', textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.68rem', color: '#fda4af', textTransform: 'uppercase', fontWeight: 700 }}>Paperwork Waste</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f43f5e' }}>$142,400/yr</div>
            </div>

            <div style={{
              background: 'rgba(10, 16, 30, 0.65)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '10px', padding: '8px 12px', textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.68rem', color: '#fde68a', textTransform: 'uppercase', fontWeight: 700 }}>Morning Surge</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b' }}>+237% Delay</div>
            </div>

            <div style={{
              background: 'rgba(10, 16, 30, 0.65)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '10px', padding: '8px 12px', textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.68rem', color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>ML Diagnostic AUC</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>0.942 ROC</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem',
          borderTop: '1px solid var(--border-color)', paddingTop: '1rem', overflowX: 'auto'
        }}>
          {[
            { id: 'fishbone', label: 'Ishikawa (Fishbone) Diagram', icon: Layers, badge: '6 Dimensions' },
            { id: 'shap', label: 'SHAP Explainable AI Waterfall', icon: Activity, badge: 'Predictive XAI' },
            { id: 'fivewhys', label: '5-Whys Clinical Forensic Tree', icon: GitBranch, badge: 'Six Sigma' },
            { id: 'capa', label: 'CAPA Remediation Action Tracker', icon: ShieldCheck, badge: `${capasList.length} Actions` },
            { id: 'ml', label: 'Model Diagnostics & Decision Rules', icon: Brain, badge: '92.4% Acc' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 14px', borderRadius: '8px',
                  border: isActive ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                  background: isActive ? 'linear-gradient(135deg, rgba(6,182,212,0.22), rgba(99,102,241,0.25))' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 14px rgba(6,182,212,0.2)' : 'none'
                }}
              >
                <Icon size={14} color={isActive ? '#22d3ee' : 'currentColor'} />
                {tab.label}
                <span style={{
                  fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px',
                  background: isActive ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#e0f2fe' : 'var(--text-muted)'
                }}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ISHIKAWA (FISHBONE) CAUSE & EFFECT DIAGRAM         */}
      {/* ======================================================== */}
      {activeTab === 'fishbone' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Controls Bar */}
          <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter by Dimension:</span>
              <button
                onClick={() => setSelectedCategory('all')}
                style={{
                  padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                  border: selectedCategory === 'all' ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                  background: selectedCategory === 'all' ? 'rgba(6,182,212,0.2)' : 'transparent',
                  color: selectedCategory === 'all' ? '#22d3ee' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                All 6 Dimensions
              </button>
              {FISHBONE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                    border: selectedCategory === cat.id ? `1px solid ${cat.color}` : '1px solid var(--border-color)',
                    background: selectedCategory === cat.id ? `${cat.color}25` : 'transparent',
                    color: selectedCategory === cat.id ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {cat.shortName}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Layout:</span>
              <button
                onClick={() => setFishboneViewMode('diagram')}
                style={{
                  padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem',
                  background: fishboneViewMode === 'diagram' ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.04)',
                  border: fishboneViewMode === 'diagram' ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                  color: fishboneViewMode === 'diagram' ? '#22d3ee' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Graphic Diagram
              </button>
              <button
                onClick={() => setFishboneViewMode('cards')}
                style={{
                  padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem',
                  background: fishboneViewMode === 'cards' ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.04)',
                  border: fishboneViewMode === 'cards' ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                  color: fishboneViewMode === 'cards' ? '#22d3ee' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Structured Matrix
              </button>
            </div>
          </div>

          {/* Graphical SVG Fishbone Diagram */}
          {fishboneViewMode === 'diagram' && (
            <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
              <div style={{ minWidth: '940px' }}>
                <svg viewBox="0 0 1020 480" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  <defs>
                    <linearGradient id="spineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="70%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                    <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#b91c1c" />
                    </linearGradient>
                    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Horizontal Central Spine */}
                  <line x1="50" y1="240" x2="840" y2="240" stroke="url(#spineGrad)" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Spine Arrowhead pointing to head */}
                  <polygon points="840,232 858,240 840,248" fill="#f43f5e" />

                  {/* ===================== TOP RIBS (Process, People, Tech) ===================== */}
                  {/* Rib 1: Process & Workflow */}
                  <line x1="280" y1="240" x2="160" y2="70" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="4 2" />
                  <rect x="90" y="38" width="150" height="28" rx="6" fill="#0d1f36" stroke="#06b6d4" strokeWidth="1.5" />
                  <text x="165" y="56" fill="#22d3ee" fontSize="11" fontWeight="700" textAnchor="middle">1. PROCESS & WORKFLOW</text>

                  {/* Sub-branches for Process */}
                  {[
                    { cause: FISHBONE_CATEGORIES[0].causes[0], y: 120, x: 220, lx: 100 },
                    { cause: FISHBONE_CATEGORIES[0].causes[1], y: 155, x: 245, lx: 120 },
                    { cause: FISHBONE_CATEGORIES[0].causes[2], y: 190, x: 265, lx: 140 }
                  ].map((item, idx) => (
                    <g key={idx} style={{ cursor: 'pointer' }} onClick={() => setInspectedCause(item.cause)}>
                      <line x1={item.x} y1={item.y} x2={item.lx} y2={item.y} stroke="rgba(6,182,212,0.6)" strokeWidth="1.5" />
                      <circle cx={item.x} cy={item.y} r="4" fill="#06b6d4" />
                      <rect 
                        x={item.lx - 12} y={item.y - 12} width="140" height="22" rx="4" 
                        fill={inspectedCause?.id === item.cause.id ? 'rgba(6,182,212,0.35)' : 'rgba(13,20,36,0.9)'}
                        stroke={inspectedCause?.id === item.cause.id ? '#22d3ee' : 'rgba(6,182,212,0.3)'}
                        strokeWidth="1"
                      />
                      <text x={item.lx} y={item.y + 3} fill="#f1f5f9" fontSize="9.5" fontWeight="600">
                        {item.cause.title.length > 20 ? item.cause.title.substring(0, 19) + '…' : item.cause.title}
                      </text>
                    </g>
                  ))}

                  {/* Rib 2: People & Staffing */}
                  <line x1="530" y1="240" x2="410" y2="70" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 2" />
                  <rect x="340" y="38" width="150" height="28" rx="6" fill="#261b0c" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="415" y="56" fill="#fbbf24" fontSize="11" fontWeight="700" textAnchor="middle">2. PEOPLE & STAFFING</text>

                  {/* Sub-branches for People */}
                  {[
                    { cause: FISHBONE_CATEGORIES[1].causes[0], y: 120, x: 470, lx: 350 },
                    { cause: FISHBONE_CATEGORIES[1].causes[1], y: 155, x: 495, lx: 370 },
                    { cause: FISHBONE_CATEGORIES[1].causes[2], y: 190, x: 515, lx: 390 }
                  ].map((item, idx) => (
                    <g key={idx} style={{ cursor: 'pointer' }} onClick={() => setInspectedCause(item.cause)}>
                      <line x1={item.x} y1={item.y} x2={item.lx} y2={item.y} stroke="rgba(245,158,11,0.6)" strokeWidth="1.5" />
                      <circle cx={item.x} cy={item.y} r="4" fill="#f59e0b" />
                      <rect 
                        x={item.lx - 12} y={item.y - 12} width="140" height="22" rx="4" 
                        fill={inspectedCause?.id === item.cause.id ? 'rgba(245,158,11,0.35)' : 'rgba(13,20,36,0.9)'}
                        stroke={inspectedCause?.id === item.cause.id ? '#fbbf24' : 'rgba(245,158,11,0.3)'}
                        strokeWidth="1"
                      />
                      <text x={item.lx} y={item.y + 3} fill="#f1f5f9" fontSize="9.5" fontWeight="600">
                        {item.cause.title.length > 20 ? item.cause.title.substring(0, 19) + '…' : item.cause.title}
                      </text>
                    </g>
                  ))}

                  {/* Rib 3: Technology & EHR */}
                  <line x1="770" y1="240" x2="650" y2="70" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="4 2" />
                  <rect x="580" y="38" width="150" height="28" rx="6" fill="#1e1436" stroke="#8b5cf6" strokeWidth="1.5" />
                  <text x="655" y="56" fill="#c084fc" fontSize="11" fontWeight="700" textAnchor="middle">3. TECHNOLOGY & EHR</text>

                  {/* Sub-branches for Tech */}
                  {[
                    { cause: FISHBONE_CATEGORIES[2].causes[0], y: 120, x: 710, lx: 590 },
                    { cause: FISHBONE_CATEGORIES[2].causes[1], y: 155, x: 735, lx: 610 },
                    { cause: FISHBONE_CATEGORIES[2].causes[2], y: 190, x: 755, lx: 630 }
                  ].map((item, idx) => (
                    <g key={idx} style={{ cursor: 'pointer' }} onClick={() => setInspectedCause(item.cause)}>
                      <line x1={item.x} y1={item.y} x2={item.lx} y2={item.y} stroke="rgba(139,92,246,0.6)" strokeWidth="1.5" />
                      <circle cx={item.x} cy={item.y} r="4" fill="#8b5cf6" />
                      <rect 
                        x={item.lx - 12} y={item.y - 12} width="140" height="22" rx="4" 
                        fill={inspectedCause?.id === item.cause.id ? 'rgba(139,92,246,0.35)' : 'rgba(13,20,36,0.9)'}
                        stroke={inspectedCause?.id === item.cause.id ? '#c084fc' : 'rgba(139,92,246,0.3)'}
                        strokeWidth="1"
                      />
                      <text x={item.lx} y={item.y + 3} fill="#f1f5f9" fontSize="9.5" fontWeight="600">
                        {item.cause.title.length > 20 ? item.cause.title.substring(0, 19) + '…' : item.cause.title}
                      </text>
                    </g>
                  ))}

                  {/* ===================== BOTTOM RIBS (Policy, Environment, Measurement) ===================== */}
                  {/* Rib 4: Policy & Governance */}
                  <line x1="280" y1="240" x2="160" y2="410" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 2" />
                  <rect x="90" y="415" width="150" height="28" rx="6" fill="#2d121c" stroke="#f43f5e" strokeWidth="1.5" />
                  <text x="165" y="433" fill="#fb7185" fontSize="11" fontWeight="700" textAnchor="middle">4. POLICY & GOVERNANCE</text>

                  {/* Sub-branches for Policy */}
                  {[
                    { cause: FISHBONE_CATEGORIES[3].causes[0], y: 285, x: 245, lx: 120 },
                    { cause: FISHBONE_CATEGORIES[3].causes[1], y: 325, x: 220, lx: 100 },
                    { cause: FISHBONE_CATEGORIES[3].causes[2], y: 365, x: 195, lx: 80 }
                  ].map((item, idx) => (
                    <g key={idx} style={{ cursor: 'pointer' }} onClick={() => setInspectedCause(item.cause)}>
                      <line x1={item.x} y1={item.y} x2={item.lx} y2={item.y} stroke="rgba(244,63,94,0.6)" strokeWidth="1.5" />
                      <circle cx={item.x} cy={item.y} r="4" fill="#f43f5e" />
                      <rect 
                        x={item.lx - 12} y={item.y - 12} width="140" height="22" rx="4" 
                        fill={inspectedCause?.id === item.cause.id ? 'rgba(244,63,94,0.35)' : 'rgba(13,20,36,0.9)'}
                        stroke={inspectedCause?.id === item.cause.id ? '#fb7185' : 'rgba(244,63,94,0.3)'}
                        strokeWidth="1"
                      />
                      <text x={item.lx} y={item.y + 3} fill="#f1f5f9" fontSize="9.5" fontWeight="600">
                        {item.cause.title.length > 20 ? item.cause.title.substring(0, 19) + '…' : item.cause.title}
                      </text>
                    </g>
                  ))}

                  {/* Rib 5: Environment & Facilities */}
                  <line x1="530" y1="240" x2="410" y2="410" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
                  <rect x="340" y="415" width="150" height="28" rx="6" fill="#0d261e" stroke="#10b981" strokeWidth="1.5" />
                  <text x="415" y="433" fill="#34d399" fontSize="11" fontWeight="700" textAnchor="middle">5. ENVIRONMENT & BEDS</text>

                  {/* Sub-branches for Environment */}
                  {[
                    { cause: FISHBONE_CATEGORIES[4].causes[0], y: 285, x: 495, lx: 370 },
                    { cause: FISHBONE_CATEGORIES[4].causes[1], y: 325, x: 470, lx: 350 },
                    { cause: FISHBONE_CATEGORIES[4].causes[2], y: 365, x: 445, lx: 330 }
                  ].map((item, idx) => (
                    <g key={idx} style={{ cursor: 'pointer' }} onClick={() => setInspectedCause(item.cause)}>
                      <line x1={item.x} y1={item.y} x2={item.lx} y2={item.y} stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" />
                      <circle cx={item.x} cy={item.y} r="4" fill="#10b981" />
                      <rect 
                        x={item.lx - 12} y={item.y - 12} width="140" height="22" rx="4" 
                        fill={inspectedCause?.id === item.cause.id ? 'rgba(16,185,129,0.35)' : 'rgba(13,20,36,0.9)'}
                        stroke={inspectedCause?.id === item.cause.id ? '#34d399' : 'rgba(16,185,129,0.3)'}
                        strokeWidth="1"
                      />
                      <text x={item.lx} y={item.y + 3} fill="#f1f5f9" fontSize="9.5" fontWeight="600">
                        {item.cause.title.length > 20 ? item.cause.title.substring(0, 19) + '…' : item.cause.title}
                      </text>
                    </g>
                  ))}

                  {/* Rib 6: Measurement & Protocols */}
                  <line x1="770" y1="240" x2="650" y2="410" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 2" />
                  <rect x="580" y="415" width="150" height="28" rx="6" fill="#0d2438" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="655" y="433" fill="#38bdf8" fontSize="11" fontWeight="700" textAnchor="middle">6. MEASUREMENT & DATA</text>

                  {/* Sub-branches for Measurement */}
                  {[
                    { cause: FISHBONE_CATEGORIES[5].causes[0], y: 285, x: 735, lx: 610 },
                    { cause: FISHBONE_CATEGORIES[5].causes[1], y: 325, x: 710, lx: 590 },
                    { cause: FISHBONE_CATEGORIES[5].causes[2], y: 365, x: 685, lx: 570 }
                  ].map((item, idx) => (
                    <g key={idx} style={{ cursor: 'pointer' }} onClick={() => setInspectedCause(item.cause)}>
                      <line x1={item.x} y1={item.y} x2={item.lx} y2={item.y} stroke="rgba(56,189,248,0.6)" strokeWidth="1.5" />
                      <circle cx={item.x} cy={item.y} r="4" fill="#38bdf8" />
                      <rect 
                        x={item.lx - 12} y={item.y - 12} width="140" height="22" rx="4" 
                        fill={inspectedCause?.id === item.cause.id ? 'rgba(56,189,248,0.35)' : 'rgba(13,20,36,0.9)'}
                        stroke={inspectedCause?.id === item.cause.id ? '#38bdf8' : 'rgba(56,189,248,0.3)'}
                        strokeWidth="1"
                      />
                      <text x={item.lx} y={item.y + 3} fill="#f1f5f9" fontSize="9.5" fontWeight="600">
                        {item.cause.title.length > 20 ? item.cause.title.substring(0, 19) + '…' : item.cause.title}
                      </text>
                    </g>
                  ))}

                  {/* ===================== FISH HEAD (PRIMARY PROBLEM) ===================== */}
                  <g filter="url(#glowEffect)">
                    <rect x="858" y="185" width="150" height="110" rx="12" fill="url(#headGrad)" stroke="#fca5a5" strokeWidth="2" />
                    <text x="933" y="210" fill="#fff" fontSize="10.5" fontWeight="800" textAnchor="middle">PRIMARY PROBLEM</text>
                    <text x="933" y="230" fill="#fef2f2" fontSize="11" fontWeight="700" textAnchor="middle">Radiology Loopback</text>
                    <text x="933" y="246" fill="#fef2f2" fontSize="11" fontWeight="700" textAnchor="middle">& ED Boarding Crisis</text>
                    <line x1="875" y1="258" x2="990" y2="258" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <text x="933" y="274" fill="#fee2e2" fontSize="9" fontWeight="600" textAnchor="middle">39.8% Rework • $142K/yr</text>
                    <text x="933" y="288" fill="#fee2e2" fontSize="8.5" textAnchor="middle">+48m Waste per Case</text>
                  </g>
                </svg>
              </div>
            </div>
          )}

          {/* Structured Matrix View */}
          {fishboneViewMode === 'cards' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1rem' }}>
              {FISHBONE_CATEGORIES
                .filter(cat => selectedCategory === 'all' || selectedCategory === cat.id)
                .map(cat => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.id} className="glass-panel" style={{ padding: '1.25rem', borderTop: `3px solid ${cat.color}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
                        <Icon size={16} color={cat.color} />
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>{cat.name}</h4>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {cat.causes.map(cause => (
                          <div
                            key={cause.id}
                            onClick={() => setInspectedCause(cause)}
                            style={{
                              padding: '0.75rem',
                              borderRadius: '8px',
                              background: inspectedCause?.id === cause.id ? `${cat.color}20` : 'rgba(255,255,255,0.02)',
                              border: inspectedCause?.id === cause.id ? `1px solid ${cat.color}` : '1px solid var(--border-color)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>{cause.title}</span>
                              <span style={{
                                fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px',
                                background: cause.severity === 'Critical' ? 'rgba(244,63,94,0.2)' : 'rgba(245,158,11,0.2)',
                                color: cause.severity === 'Critical' ? '#fb7185' : '#fbbf24',
                                fontWeight: 700
                              }}>
                                {cause.severity}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              <span>{cause.prevalence}</span>
                              <span style={{ color: cat.color, fontWeight: 700 }}>{cause.delayImpact}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Inspected Root Cause Detail Card */}
          {inspectedCause && (
            <div className="glass-panel glow-accent" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid #06b6d4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>Forensic Cause Inspector</span>
                    <span style={{
                      fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px',
                      background: inspectedCause.severity === 'Critical' ? 'rgba(244,63,94,0.25)' : 'rgba(245,158,11,0.25)',
                      color: inspectedCause.severity === 'Critical' ? '#fda4af' : '#fde68a',
                      fontWeight: 700
                    }}>
                      {inspectedCause.severity} Severity
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {inspectedCause.id}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    {inspectedCause.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Penalty</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f43f5e' }}>{inspectedCause.delayImpact}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Economic Loss</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>{inspectedCause.costImpact}</div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('capa');
                      setCapaFilter('ALL');
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '8px',
                      background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                      color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    View {inspectedCause.capaRef} <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.85rem 0' }}>
                {inspectedCause.detail}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <span>Cohort Prevalence: <strong style={{ color: '#f8fafc' }}>{inspectedCause.prevalence}</strong></span>
                <span>Governance Protocol: <strong style={{ color: '#22d3ee' }}>The Joint Commission Standard IM.02.02.01</strong></span>
                <span>Remediation Target: <strong style={{ color: '#34d399' }}>Eliminates {inspectedCause.delayImpact} in {inspectedCause.capaRef}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SHAP EXPLAINABLE AI WATERFALL & PATIENT SIMULATOR */}
      {/* ======================================================== */}
      {activeTab === 'shap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Preset Clinical Cohort Selector */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                  Select Clinical Cohort Scenario for SHAP Attribution:
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Visualizes Shapley marginal contributions decomposing the difference between expected stay E[Y] and individual outcome f(x).
                </p>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                E[Y] Baseline = 110 min
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              {SHAP_PRESETS.map(p => {
                const isSelected = selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      padding: '0.85rem', borderRadius: '10px', textAlign: 'left',
                      background: isSelected ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                      cursor: 'pointer', transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? '#22d3ee' : '#f8fafc', marginBottom: '4px' }}>
                      {p.name.split(':')[0]}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                      {p.name.split(':')[1]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            
            {/* SHAP Waterfall Chart Column */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    SHAP Factor Contribution Waterfall
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Marginal minutes added / subtracted from base dwell</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}>Model Output f(x)</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                    {predictedHours}h {predictedMins}m
                  </div>
                </div>
              </div>

              {/* Waterfall Visualization Stack */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {shapSteps.map((step, idx) => {
                  const maxDuration = 350;
                  const leftPct = (Math.min(step.start, step.end) / maxDuration) * 100;
                  const widthPct = Math.max(2, (Math.abs(step.val) / maxDuration) * 100);

                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                        <span style={{ fontWeight: 600, color: '#f8fafc' }}>{step.feature}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px',
                            background: `${step.color}20`, color: step.color
                          }}>
                            {step.badge}
                          </span>
                        </div>
                      </div>

                      {/* Bar track */}
                      <div style={{
                        position: 'relative', width: '100%', height: '14px',
                        background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                          height: '100%',
                          background: step.color,
                          borderRadius: '3px',
                          boxShadow: `0 0 8px ${step.color}50`
                        }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        <span>{step.desc}</span>
                        <span>Cumulative: {step.end} min</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Model Confidence Footer */}
              <div style={{
                marginTop: '1.25rem', padding: '0.85rem', borderRadius: '8px',
                background: 'rgba(10,16,30,0.6)', border: '1px solid var(--border-color)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  XGBoost 95% Confidence Interval: <strong style={{ color: '#fff' }}>[{Math.max(40, predictedStayMinutes - 18)}m – {predictedStayMinutes + 22}m]</strong>
                </span>
                <span style={{ color: delayRiskPercentage > 70 ? '#fb7185' : '#34d399', fontWeight: 700 }}>
                  {delayRiskPercentage > 70 ? 'High Delay Risk' : 'Optimal Velocity'}
                </span>
              </div>
            </div>

            {/* Interactive Custom Patient Stay Simulator Column */}
            <div className="glass-panel glow-accent" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Calculator size={18} color="#06b6d4" />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Interactive Patient Trajectory Simulator
                </h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Tweak patient attributes in real-time to watch the SHAP decomposition and bottleneck risk recalculate.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8rem' }}>
                
                {/* Age selector */}
                <div>
                  <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', fontWeight: 600 }}>
                    Patient Age Group:
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['0-17', '18-40', '41-60', '61+'].map(a => (
                      <button
                        key={a}
                        onClick={() => { setCalcAge(a); setSelectedPresetId('custom'); }}
                        style={{
                          flex: 1, padding: '7px', borderRadius: '6px',
                          border: calcAge === a ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                          background: calcAge === a ? 'rgba(6, 182, 212, 0.25)' : 'rgba(10, 16, 30, 0.5)',
                          color: calcAge === a ? '#22d3ee' : 'var(--text-secondary)',
                          fontSize: '0.78rem', fontWeight: calcAge === a ? 700 : 500, cursor: 'pointer'
                        }}
                      >{a}</button>
                    ))}
                  </div>
                </div>

                {/* Acuity selector */}
                <div>
                  <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', fontWeight: 600 }}>
                    Emergency Severity Index (ESI):
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['Low', 'Medium', 'High'].map(ac => (
                      <button
                        key={ac}
                        onClick={() => { setCalcAcuity(ac); setSelectedPresetId('custom'); }}
                        style={{
                          flex: 1, padding: '7px', borderRadius: '6px',
                          border: calcAcuity === ac ? '1px solid #8b5cf6' : '1px solid var(--border-color)',
                          background: calcAcuity === ac ? 'rgba(139, 92, 246, 0.25)' : 'rgba(10, 16, 30, 0.5)',
                          color: calcAcuity === ac ? '#c084fc' : 'var(--text-secondary)',
                          fontSize: '0.78rem', fontWeight: calcAcuity === ac ? 700 : 500, cursor: 'pointer'
                        }}
                      >{ac}</button>
                    ))}
                  </div>
                </div>

                {/* Arrival time slot */}
                <div>
                  <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', fontWeight: 600 }}>
                    Arrival Time Slot:
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[
                      { label: '09:00 (Rush)', val: '09:00' },
                      { label: '14:00 (Nominal)', val: '14:00' },
                      { label: '21:00 (Evening)', val: '21:00' }
                    ].map(t => (
                      <button
                        key={t.val}
                        onClick={() => { setCalcHour(t.val); setSelectedPresetId('custom'); }}
                        style={{
                          flex: 1, padding: '7px', borderRadius: '6px',
                          border: calcHour === t.val ? '1px solid #f59e0b' : '1px solid var(--border-color)',
                          background: calcHour === t.val ? 'rgba(245, 158, 11, 0.25)' : 'rgba(10, 16, 30, 0.5)',
                          color: calcHour === t.val ? '#fbbf24' : 'var(--text-secondary)',
                          fontSize: '0.75rem', fontWeight: calcHour === t.val ? 700 : 500, cursor: 'pointer'
                        }}
                      >{t.label}</button>
                    ))}
                  </div>
                </div>

                {/* Paperwork Loopback toggle */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: 'rgba(10, 16, 30, 0.5)', borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div>
                    <span style={{ color: '#f8fafc', fontWeight: 600, display: 'block' }}>Simulate Radiology Form Bounce-Back:</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Missing requisition signatures trigger repeat triage</span>
                  </div>
                  <button
                    onClick={() => { setCalcXrayLoop(!calcXrayLoop); setSelectedPresetId('custom'); }}
                    style={{
                      padding: '5px 12px', borderRadius: '6px', border: 'none',
                      background: calcXrayLoop ? '#f43f5e' : '#10b981',
                      color: '#fff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer'
                    }}
                  >
                    {calcXrayLoop ? 'YES (+85m)' : 'NO (Compliant)'}
                  </button>
                </div>

                {/* Inpatient Bed Boarding toggle */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: 'rgba(10, 16, 30, 0.5)', borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div>
                    <span style={{ color: '#f8fafc', fontWeight: 600, display: 'block' }}>Inpatient Bed Boarding Wait:</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Waiting for EVS cleaning of inpatient bed</span>
                  </div>
                  <button
                    onClick={() => { setCalcBoarding(!calcBoarding); setSelectedPresetId('custom'); }}
                    style={{
                      padding: '5px 12px', borderRadius: '6px', border: 'none',
                      background: calcBoarding ? '#f59e0b' : '#334155',
                      color: '#fff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer'
                    }}
                  >
                    {calcBoarding ? 'YES (+48m)' : 'NO'}
                  </button>
                </div>

                {/* Prediction Result Summary Card */}
                <div style={{
                  marginTop: '0.75rem', padding: '1.25rem', borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(99, 102, 241, 0.2))',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}>
                      Predicted Lead Time
                    </span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>
                      {predictedHours}h {predictedMins}m
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      vs 1h 50m compliant baseline
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bottleneck Probability</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: delayRiskPercentage > 70 ? '#fb7185' : '#34d399' }}>
                      {delayRiskPercentage}%
                    </div>
                    <span style={{ fontSize: '0.72rem', color: delayRiskPercentage > 70 ? '#fda4af' : '#6ee7b7' }}>
                      {delayRiskPercentage > 70 ? 'High Delay Risk' : 'Acceptable Flow'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: 5-WHYS CLINICAL FORENSIC DRILLDOWN TREE           */}
      {/* ======================================================== */}
      {activeTab === 'fivewhys' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Topic Switcher */}
          <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Clinical Dilemma:</span>
              {FIVE_WHYS_CASES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedWhyTopic(c.id)}
                  style={{
                    padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700,
                    border: selectedWhyTopic === c.id ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                    background: selectedWhyTopic === c.id ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.03)',
                    color: selectedWhyTopic === c.id ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {c.title}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
              {FIVE_WHYS_CASES.find(c => c.id === selectedWhyTopic)?.impact}
            </div>
          </div>

          {/* Stepper Timeline */}
          {(() => {
            const activeCase = FIVE_WHYS_CASES.find(c => c.id === selectedWhyTopic) || FIVE_WHYS_CASES[0];
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Overview Header */}
                <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>
                        {activeCase.title}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {activeCase.subtitle}
                      </p>
                    </div>
                    <span className="badge badge-rose" style={{ fontSize: '0.72rem' }}>
                      Root Cause Verified in EHR Log
                    </span>
                  </div>
                </div>

                {/* 5 Vertical Levels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {activeCase.steps.map((step) => (
                    <div
                      key={step.level}
                      className="glass-panel"
                      style={{
                        padding: '1.25rem 1.5rem',
                        borderLeft: step.isRootCause ? '4px solid #f43f5e' : '4px solid #06b6d4',
                        background: step.isRootCause ? 'rgba(244,63,94,0.08)' : 'var(--bg-card)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            width: '26px', height: '26px', borderRadius: '50%',
                            background: step.isRootCause ? '#f43f5e' : '#06b6d4',
                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 800
                          }}>
                            {step.level}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: step.isRootCause ? '#fb7185' : '#38bdf8', textTransform: 'uppercase' }}>
                            {step.isRootCause ? 'Level 5: Root Cause Identified' : `Level ${step.level} Inquiry`}
                          </span>
                        </div>

                        <span style={{
                          fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px',
                          background: 'rgba(255,255,255,0.05)', color: '#f8fafc', fontWeight: 600
                        }}>
                          {step.dataPoint}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 6px 0' }}>
                        {step.question}
                      </h4>

                      <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                        <strong style={{ color: step.isRootCause ? '#fda4af' : '#22d3ee' }}>Finding: </strong>
                        {step.finding}
                      </p>

                      <div style={{
                        padding: '8px 12px', borderRadius: '6px',
                        background: 'rgba(10,16,30,0.5)', border: '1px solid var(--border-color)',
                        fontSize: '0.75rem', color: 'var(--text-muted)'
                      }}>
                        <strong style={{ color: 'var(--text-secondary)' }}>EHR Telemetry Evidence: </strong>
                        {step.evidence}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Remediation Summary Box */}
                <div className="glass-panel glow-accent" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <CheckCircle2 size={16} color="#10b981" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
                          Prescribed Clinical Remediation Action
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                        {activeCase.remediation.action}
                      </h4>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('capa');
                        setCapaFilter('ALL');
                      }}
                      style={{
                        padding: '8px 14px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                        border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      Track in CAPA Register
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.78rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Clinical Owner</span>
                      <strong style={{ color: '#f8fafc' }}>{activeCase.remediation.owner}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Projected Savings</span>
                      <strong style={{ color: '#fbbf24' }}>{activeCase.remediation.projectedSavings}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Throughput Improvement</span>
                      <strong style={{ color: '#34d399' }}>{activeCase.remediation.dwellReduction}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Regulatory Standard</span>
                      <strong style={{ color: '#38bdf8' }}>{activeCase.remediation.tjcCompliance}</strong>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: CAPA REMEDIATION ACTION TRACKER                   */}
      {/* ======================================================== */}
      {activeTab === 'capa' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header & Filter Bar */}
          <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Hospital Quality Governance & CAPA Register
                </h3>
                <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                  ISO 9001 / TJC Compliant
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                Formal Corrective and Preventive Actions addressing root causes identified in process mining telemetry.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {['ALL', 'Approved', 'In Progress', 'Under Validation', 'Completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setCapaFilter(status)}
                    style={{
                      padding: '5px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600,
                      border: capaFilter === status ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                      background: capaFilter === status ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.03)',
                      color: capaFilter === status ? '#22d3ee' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button
                onClick={handleExportCapaCsv}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)',
                  color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
          </div>

          {/* CAPA Table Card */}
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(10, 16, 30, 0.7)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>CAPA ID</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Remediation Action & Problem</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Owner & Dept</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Projected Impact</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Progress</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status Workflow</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCapas.map(capa => {
                    const statusColors = {
                      'Approved': { bg: 'rgba(56,189,248,0.15)', text: '#38bdf8', border: 'rgba(56,189,248,0.3)' },
                      'In Progress': { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
                      'Under Validation': { bg: 'rgba(139,92,246,0.15)', text: '#c084fc', border: 'rgba(139,92,246,0.3)' },
                      'Completed': { bg: 'rgba(16,185,129,0.15)', text: '#34d399', border: 'rgba(16,185,129,0.3)' }
                    };
                    const sc = statusColors[capa.status] || statusColors['Approved'];

                    return (
                      <tr
                        key={capa.id}
                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>{capa.id}</span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Due: {capa.targetDate}</div>
                        </td>

                        <td style={{ padding: '14px 16px', verticalAlign: 'top', maxWidth: '380px' }}>
                          <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{capa.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '6px' }}>
                            {capa.remediationPlan}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            Target: <span style={{ color: '#cbd5e1' }}>{capa.targetCause}</span>
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{capa.owner}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{capa.department}</div>
                        </td>

                        <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#fbbf24' }}>{capa.annualSavings}</div>
                          <div style={{ fontSize: '0.72rem', color: '#34d399' }}>{capa.timeReduction}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{capa.complianceImpact}</div>
                        </td>

                        <td style={{ padding: '14px 16px', verticalAlign: 'top', minWidth: '120px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Completed</span>
                            <span style={{ fontWeight: 700, color: '#fff' }}>{capa.progress}%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${capa.progress}%`, height: '100%',
                              background: capa.progress === 100 ? '#10b981' : capa.progress >= 70 ? '#06b6d4' : '#f59e0b',
                              borderRadius: '999px'
                            }} />
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                          <select
                            value={capa.status}
                            onChange={(e) => updateCapaStatus(capa.id, e.target.value)}
                            style={{
                              padding: '5px 8px', borderRadius: '6px',
                              background: sc.bg, border: `1px solid ${sc.border}`,
                              color: sc.text, fontSize: '0.72rem', fontWeight: 700,
                              cursor: 'pointer', outline: 'none'
                            }}
                          >
                            <option value="Approved" style={{ background: '#0d1424', color: '#38bdf8' }}>Approved</option>
                            <option value="In Progress" style={{ background: '#0d1424', color: '#fbbf24' }}>In Progress</option>
                            <option value="Under Validation" style={{ background: '#0d1424', color: '#c084fc' }}>Under Validation</option>
                            <option value="Completed" style={{ background: '#0d1424', color: '#34d399' }}>Completed</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CAPA Financial & Quality Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Aggregate Annual Cost Remediation
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
                $362,100 / year
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                Projected gross operational savings across 5 identified clinical bottleneck CAPAs.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Total Dwell Time Recovered
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#06b6d4', margin: '4px 0' }}>
                -138 min / patient
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                Summed reduction in non-clinical waiting and repeat paperwork loops.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Implementation Governance Index
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6', margin: '4px 0' }}>
                70.0% Complete
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                Average weighted progress across all hospital active remediation workstreams.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: ML MODEL DIAGNOSTICS & DECISION RULES             */}
      {/* ======================================================== */}
      {activeTab === 'ml' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Model Performance Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>ROC-AUC Score</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#06b6d4' }}>{mlModelMetrics.aucRoc}</div>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Discriminative power</span>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>F1-Score</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981' }}>{mlModelMetrics.f1Score}</div>
              <span style={{ fontSize: '0.7rem', color: '#34d399' }}>Harmonic precision-recall</span>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Precision</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#8b5cf6' }}>{mlModelMetrics.precision}</div>
              <span style={{ fontSize: '0.7rem', color: '#c084fc' }}>Low false-positive rate</span>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Recall (Sensitivity)</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f59e0b' }}>{mlModelMetrics.recall}</div>
              <span style={{ fontSize: '0.7rem', color: '#fbbf24' }}>Identifies 90.2% delays</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            
            {/* Confusion Matrix Card */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                  Delay Classifier Confusion Matrix (1,000 Cases)
                </h4>
                <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>92.4% Accuracy</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '6px', fontSize: '0.75rem', textAlign: 'center' }}>
                <div />
                <div style={{ fontWeight: 700, color: '#38bdf8', padding: '4px' }}>Predicted Delay</div>
                <div style={{ fontWeight: 700, color: '#34d399', padding: '4px' }}>Predicted Normal</div>

                <div style={{ fontWeight: 700, color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Actual Delay
                </div>
                <div style={{
                  padding: '16px 8px', borderRadius: '8px',
                  background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)'
                }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#22d3ee' }}>{mlModelMetrics.confusionMatrix.tp}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>True Positive (TP)</div>
                </div>
                <div style={{
                  padding: '16px 8px', borderRadius: '8px',
                  background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)'
                }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fb7185' }}>{mlModelMetrics.confusionMatrix.fn}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>False Negative (FN)</div>
                </div>

                <div style={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Actual Normal
                </div>
                <div style={{
                  padding: '16px 8px', borderRadius: '8px',
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)'
                }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fbbf24' }}>{mlModelMetrics.confusionMatrix.fp}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>False Positive (FP)</div>
                </div>
                <div style={{
                  padding: '16px 8px', borderRadius: '8px',
                  background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)'
                }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>{mlModelMetrics.confusionMatrix.tn}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>True Negative (TN)</div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Evaluated on 1,000 stratified EHR clinical patient traces across 5 attending physicians and 7 units.
              </div>
            </div>

            {/* Feature Importance Card */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                Global Feature Importance Ranking (Gini Impurity)
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { feature: "Radiology Re-Triage Loopback", importance: 84, impact: "+85 min delay", category: "Process Inefficiency", color: '#f43f5e' },
                  { feature: "Morning Arrival Surge (08-11 AM)", importance: 76, impact: "+65 min delay", category: "Temporal Influx", color: '#f59e0b' },
                  { feature: "Clinical Acuity (High / Trauma)", importance: 58, impact: "+40 min stay", category: "Patient Acuity", color: '#8b5cf6' },
                  { feature: "Inpatient Bed Boarding Wait", importance: 48, impact: "+48 min dwell", category: "Ward Saturation", color: '#06b6d4' },
                  { feature: "Age Group (61+ Geriatric Complexity)", importance: 42, impact: "+30 min stay", category: "Demographics", color: '#10b981' },
                  { feature: "Attending Physician Assigned", importance: 12, impact: "± 5 min variation", category: "Resource Parity", color: '#94a3b8' }
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ fontWeight: 600, color: '#f8fafc' }}>{f.feature}</span>
                      <span style={{ fontWeight: 700, color: f.color }}>{f.impact}</span>
                    </div>
                    <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${f.importance}%`, height: '100%', background: f.color, borderRadius: '999px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      <span>{f.category}</span>
                      <span>Importance: {f.importance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Association Decision Rules Grid */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              Extracted Clinical Decision Rules (Association Mining)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {decisionRules.map((rule, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(10, 16, 30, 0.5)',
                    border: rule.status === 'critical' ? '1px solid rgba(245, 158, 11, 0.4)' : rule.status === 'violation' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '10px',
                    padding: '1.15rem'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#38bdf8', marginBottom: '6px' }}>
                    {rule.rule}
                  </div>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                    → {rule.outcome}
                  </h5>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    <span>Confidence: <strong style={{ color: '#fff' }}>{rule.confidence}</strong></span>
                    <span>Support: <strong>{rule.support}</strong></span>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '0.7rem', color: '#fbbf24' }}>
                    Lift: {rule.lift}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
