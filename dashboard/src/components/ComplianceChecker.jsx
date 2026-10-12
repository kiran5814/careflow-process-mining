import React, { useState } from 'react';
import {
  ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, XCircle,
  Filter, ChevronDown, ChevronRight, Info, BarChart3, Download
} from 'lucide-react';

const VIOLATIONS = [
  {
    id: 'V001',
    rule: 'Triage Before Consultation',
    type: 'Skip Violation',
    severity: 'Critical',
    count: 19,
    pct: 1.9,
    cases: ['CF-1024', 'CF-1037', 'CF-1089', 'CF-1143', 'CF-1201'],
    description: 'Patient bypassed nursing triage and directly entered physician consultation without clinical justification documented.',
    recommendation: 'Enforce mandatory triage entry in EHR system before consultation scheduling. Auto-block booking without triage timestamp.',
    impact: 'High risk of missed deterioration; JCAHO non-compliance',
    category: 'process',
    trend: [12, 14, 18, 17, 19, 19, 22],
    status: 'open',
  },
  {
    id: 'V002',
    rule: 'No Re-entry After Discharge',
    type: 'Re-admission Loop',
    severity: 'High',
    count: 34,
    pct: 3.4,
    cases: ['CF-2011', 'CF-2073', 'CF-2145', 'CF-2208'],
    description: 'Patient was marked discharged but re-entered the active case flow within 4 hours without formal readmission procedure.',
    recommendation: 'Create a 4-hour re-admission grace window in EHR. Require physician sign-off for same-day readmissions.',
    impact: 'Insurance billing complications; false discharge metrics',
    category: 'compliance',
    trend: [20, 24, 28, 31, 33, 34, 34],
    status: 'open',
  },
  {
    id: 'V003',
    rule: 'Radiology Before Doctor Order',
    type: 'Sequence Violation',
    severity: 'Moderate',
    count: 27,
    pct: 2.7,
    cases: ['CF-3012', 'CF-3084', 'CF-3167', 'CF-3219'],
    description: 'Radiology examination recorded before a physician consultation or official order was logged in the EHR.',
    recommendation: 'Link radiology module to require active physician order ID before allowing test request submission.',
    impact: 'Unauthorized scan costs; liability exposure',
    category: 'process',
    trend: [18, 22, 25, 25, 26, 27, 29],
    status: 'in_review',
  },
  {
    id: 'V004',
    rule: 'Lab Results Documented Within 90 min',
    type: 'SLA Breach',
    severity: 'Moderate',
    count: 89,
    pct: 8.9,
    cases: ['CF-4001', 'CF-4055', 'CF-4099', 'CF-4201', 'CF-4333'],
    description: 'Lab test results were not entered into the EHR within the 90-minute SLA window, causing consultation delays.',
    recommendation: 'Implement automated lab interface with real-time LIMS integration to push results automatically.',
    impact: 'Extended ED length-of-stay; patient dissatisfaction',
    category: 'sla',
    trend: [60, 70, 78, 85, 88, 89, 92],
    status: 'open',
  },
  {
    id: 'V005',
    rule: 'Consent Documented Before Treatment',
    type: 'Documentation Gap',
    severity: 'Critical',
    count: 8,
    pct: 0.8,
    cases: ['CF-5012', 'CF-5033', 'CF-5071'],
    description: 'Treatment event logged without a corresponding informed consent form documented in the patient record.',
    recommendation: 'Require e-consent signature capture via patient portal or bedside tablet before any treatment can be logged.',
    impact: 'Medico-legal liability; patient rights violation',
    category: 'compliance',
    trend: [3, 4, 6, 7, 7, 8, 9],
    status: 'escalated',
  },
  {
    id: 'V006',
    rule: 'Mandatory Vitals at Triage',
    type: 'Data Completeness',
    severity: 'Low',
    count: 112,
    pct: 11.2,
    cases: ['CF-6001', 'CF-6044', 'CF-6088', 'CF-6132'],
    description: 'Triage records missing one or more mandatory vital signs fields (BP, SpO2, HR, RR, Temperature).',
    recommendation: 'Set mandatory field validation on the triage form to prevent save without all vitals populated.',
    impact: 'Incomplete clinical picture; data quality degradation',
    category: 'data',
    trend: [80, 90, 100, 105, 108, 112, 116],
    status: 'in_review',
  },
];

const SEV_CONFIG = {
  Critical:  { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  badge: 'badge-rose'   },
  High:      { color: '#f97316', bg: 'rgba(249,115,22,0.12)', badge: 'badge-amber'  },
  Moderate:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', badge: 'badge-amber'  },
  Low:       { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  badge: 'badge-cyan'   },
};

const STATUS_CONFIG = {
  open:       { label: 'Open',       color: '#f43f5e' },
  in_review:  { label: 'In Review',  color: '#f59e0b' },
  escalated:  { label: 'Escalated',  color: '#c084fc' },
  resolved:   { label: 'Resolved',   color: '#10b981' },
};

function MiniTrend({ values, color }) {
  const max = Math.max(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 60},${20 - (v / max) * 18}`).join(' ');
  return (
    <svg width="64" height="22" viewBox="0 0 64 22">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <circle cx={60} cy={20 - (values[values.length - 1] / max) * 18} r="2.5" fill={color} />
    </svg>
  );
}

export default function ComplianceChecker() {
  const [expanded, setExpanded] = useState(null);
  const [filterSev, setFilterSev] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const totalViolations = VIOLATIONS.reduce((sum, v) => sum + v.count, 0);
  const critical = VIOLATIONS.filter(v => v.severity === 'Critical').reduce((s, v) => s + v.count, 0);
  const conformanceScore = (((1000 - totalViolations) / 1000) * 100).toFixed(1);

  const filtered = VIOLATIONS.filter(v => {
    if (filterSev !== 'all' && v.severity !== filterSev) return false;
    if (filterCat !== 'all' && v.category !== filterCat) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Conformance Score',  value: `${conformanceScore}%`, color: '#10b981', sub: 'of 1,000 cases clean' },
          { label: 'Total Violations',   value: totalViolations,        color: '#f43f5e', sub: `${VIOLATIONS.length} rule types` },
          { label: 'Critical Incidents', value: critical,               color: '#f43f5e', sub: 'require immediate action' },
          { label: 'Open Issues',        value: VIOLATIONS.filter(v => v.status === 'open').length, color: '#f59e0b', sub: 'rules unresolved' },
          { label: 'SLA Breaches',       value: VIOLATIONS.filter(v => v.category === 'sla').reduce((s, v) => s + v.count, 0), color: '#818cf8', sub: 'response time violations' },
        ].map(s => (
          <div key={s.label} className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>{s.label}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(244,63,94,0.15)', color: '#f43f5e' }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                Protocol Compliance Checker
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Conformance violations against ER workflow protocol rules • Click a rule to expand details
              </p>
            </div>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
            fontSize: '0.78rem', cursor: 'pointer'
          }}>
            <Download size={13} /> Export Report
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['all', 'Critical', 'High', 'Moderate', 'Low'].map(s => (
              <button key={s} onClick={() => setFilterSev(s)} style={{
                padding: '4px 10px', borderRadius: '6px', fontSize: '0.73rem', fontWeight: 600, cursor: 'pointer',
                border: filterSev === s ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                background: filterSev === s ? 'rgba(6,182,212,0.15)' : 'transparent',
                color: filterSev === s ? '#22d3ee' : 'var(--text-muted)'
              }}>{s === 'all' ? 'All Severity' : s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['all', 'open', 'in_review', 'escalated'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '4px 10px', borderRadius: '6px', fontSize: '0.73rem', fontWeight: 600, cursor: 'pointer',
                border: filterStatus === s ? '1px solid rgba(139,92,246,0.5)' : '1px solid var(--border-color)',
                background: filterStatus === s ? 'rgba(139,92,246,0.15)' : 'transparent',
                color: filterStatus === s ? '#c084fc' : 'var(--text-muted)'
              }}>{STATUS_CONFIG[s]?.label || 'All Status'}</button>
            ))}
          </div>
        </div>

        {/* Violation Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(v => {
            const sev = SEV_CONFIG[v.severity];
            const isOpen = expanded === v.id;
            const status = STATUS_CONFIG[v.status];
            return (
              <div key={v.id}>
                <div
                  onClick={() => setExpanded(isOpen ? null : v.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '10px',
                    background: isOpen ? sev.bg : 'rgba(17,26,48,0.5)',
                    border: isOpen ? `1px solid ${sev.color}40` : '1px solid var(--border-color)',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  {/* Status icon */}
                  {v.severity === 'Critical'
                    ? <ShieldAlert size={18} color={sev.color} />
                    : <ShieldCheck size={18} color={sev.color} />
                  }

                  {/* Rule ID */}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#64748b', minWidth: '48px' }}>{v.id}</span>

                  {/* Rule name */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>{v.rule}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{v.type}</div>
                  </div>

                  {/* Trend */}
                  <MiniTrend values={v.trend} color={sev.color} />

                  {/* Count */}
                  <div style={{ textAlign: 'right', minWidth: '56px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: sev.color, fontFamily: 'var(--font-mono)' }}>{v.count}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{v.pct}% of cases</div>
                  </div>

                  {/* Badges */}
                  <span className={`badge ${sev.badge}`} style={{ fontSize: '0.65rem', minWidth: 56 }}>{v.severity}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: status.color, minWidth: 64 }}>● {status.label}</span>

                  {/* Chevron */}
                  <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                </div>

                {/* Expanded Detail */}
                {isOpen && (
                  <div style={{
                    padding: '1rem 1.25rem', marginTop: '2px',
                    background: 'rgba(10,16,30,0.85)',
                    border: `1px solid ${sev.color}25`,
                    borderRadius: '0 0 10px 10px',
                    borderTop: 'none'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.73rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                          Description
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{v.description}</p>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.73rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                          Recommendation
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#34d399', lineHeight: 1.6 }}>{v.recommendation}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                      <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
                        <span style={{ color: '#94a3b8' }}>Clinical Impact: </span>
                        <span style={{ color: '#fb7185', fontWeight: 600 }}>{v.impact}</span>
                      </div>
                      <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
                        <span style={{ color: '#94a3b8' }}>Affected Cases: </span>
                        <span style={{ color: '#22d3ee', fontFamily: 'var(--font-mono)', fontSize: '0.73rem' }}>
                          {v.cases.join(', ')}{v.count > v.cases.length ? ` + ${v.count - v.cases.length} more` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
