import React, { useState } from 'react';
import { 
  GitBranch, HelpCircle, AlertOctagon, TrendingUp, 
  Brain, Sliders, CheckCircle2, ChevronRight, Calculator 
} from 'lucide-react';

export default function RootCauseAnalysis() {
  const [calcAge, setCalcAge] = useState('41-60');
  const [calcAcuity, setCalcAcuity] = useState('High');
  const [calcHour, setCalcHour] = useState('09:00');
  const [calcXrayLoop, setCalcXrayLoop] = useState(true);

  // Calculate dynamic delay probability and expected stay
  const isMorning = ['08:00', '09:00', '10:00', '11:00'].includes(calcHour);
  let baseMinutes = 110;
  if (isMorning) baseMinutes += 65;
  if (calcXrayLoop) baseMinutes += 85;
  if (calcAcuity === 'High') baseMinutes += 40;
  if (calcAcuity === 'Medium') baseMinutes += 20;
  if (calcAge === '61+') baseMinutes += 30;

  const hours = Math.floor(baseMinutes / 60);
  const mins = baseMinutes % 60;
  const delayRiskScore = Math.min(98, Math.round((baseMinutes / 320) * 100));

  const featureImportances = [
    { feature: "Radiology Re-Triage Loopback", importance: 84, impact: "+85 min delay", category: "Process Inefficiency" },
    { feature: "Morning Arrival Rush (08:00 - 11:00 AM)", importance: 76, impact: "+65 min delay", category: "Temporal Surge" },
    { feature: "Clinical Severity (High / Trauma)", importance: 58, impact: "+40 min stay", category: "Patient Acuity" },
    { feature: "Age Group (61+ Geriatric Complexity)", importance: 42, impact: "+30 min stay", category: "Demographics" },
    { feature: "Attending Physician Assigned", importance: 12, impact: "± 5 min variation", category: "Resource" },
  ];

  const decisionRules = [
    {
      rule: "IF (X-Ray Rework Loop = TRUE) AND (Arrival = Morning Rush)",
      outcome: "Severe Bottleneck (> 5.5 Hours Stay)",
      confidence: "94.2%",
      prevalence: "17.6% of Cohort",
      status: "critical"
    },
    {
      rule: "IF (Clinical Severity = High) AND (Triage = Completed)",
      outcome: "Expedited Workup (Fast Track to Admission)",
      confidence: "91.8%",
      prevalence: "14.2% of Cohort",
      status: "optimal"
    },
    {
      rule: "IF (Registration = Bypassed) AND (Triage = Bypassed)",
      outcome: "Protocol Violation (High Medico-legal Risk)",
      confidence: "88.5%",
      prevalence: "3.2% of Cohort",
      status: "violation"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.75rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Root Cause Analysis (RCA) & Predictive Machine Learning
              </h3>
              <span className="badge badge-purple">
                <Brain size={12} /> ML Feature Diagnostics
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Machine learning explainability identifying the core root causes behind hospital delays and operational rework.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Column 1: Feature Importance Ranking */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Delay Determinants (Feature Importance)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {featureImportances.map((f, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>{f.feature}</span>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{f.impact}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${f.importance}%`,
                    height: '100%',
                    background: i === 0 
                      ? 'linear-gradient(90deg, #f59e0b, #ef4444)' 
                      : i === 1 
                        ? 'linear-gradient(90deg, #ec4899, #f43f5e)' 
                        : 'linear-gradient(90deg, #06b6d4, #6366f1)',
                    borderRadius: '999px'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>{f.category}</span>
                  <span>Importance Index: {f.importance}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Predictive Patient Stay Risk Calculator */}
        <div className="glass-panel glow-accent" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Calculator size={18} color="#06b6d4" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Predictive Patient Stay Estimator
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.8rem' }}>
            {/* Age selector */}
            <div>
              <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Patient Age Group:</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['0-17', '18-40', '41-60', '61+'].map(a => (
                  <button
                    key={a}
                    onClick={() => setCalcAge(a)}
                    style={{
                      flex: 1,
                      padding: '5px',
                      borderRadius: '6px',
                      border: calcAge === a ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                      background: calcAge === a ? 'rgba(6, 182, 212, 0.2)' : 'rgba(10, 16, 30, 0.5)',
                      color: calcAge === a ? '#22d3ee' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >{a}</button>
                ))}
              </div>
            </div>

            {/* Acuity selector */}
            <div>
              <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Clinical Severity:</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Low', 'Medium', 'High'].map(ac => (
                  <button
                    key={ac}
                    onClick={() => setCalcAcuity(ac)}
                    style={{
                      flex: 1,
                      padding: '5px',
                      borderRadius: '6px',
                      border: calcAcuity === ac ? '1px solid #6366f1' : '1px solid var(--border-color)',
                      background: calcAcuity === ac ? 'rgba(99, 102, 241, 0.2)' : 'rgba(10, 16, 30, 0.5)',
                      color: calcAcuity === ac ? '#a5b4fc' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >{ac}</button>
                ))}
              </div>
            </div>

            {/* Time slot selector */}
            <div>
              <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Arrival Time Slot:</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { label: '09:00 (Rush)', val: '09:00' },
                  { label: '14:00 (Normal)', val: '14:00' },
                  { label: '21:00 (Evening)', val: '21:00' }
                ].map(t => (
                  <button
                    key={t.val}
                    onClick={() => setCalcHour(t.val)}
                    style={{
                      flex: 1,
                      padding: '5px',
                      borderRadius: '6px',
                      border: calcHour === t.val ? '1px solid #f59e0b' : '1px solid var(--border-color)',
                      background: calcHour === t.val ? 'rgba(245, 158, 11, 0.2)' : 'rgba(10, 16, 30, 0.5)',
                      color: calcHour === t.val ? '#fbbf24' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >{t.label}</button>
                ))}
              </div>
            </div>

            {/* X-ray rework toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(10, 16, 30, 0.4)', borderRadius: '8px' }}>
              <span style={{ color: '#cbd5e1' }}>Simulate Radiology Form Bounce-back:</span>
              <button
                onClick={() => setCalcXrayLoop(!calcXrayLoop)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: calcXrayLoop ? '#f59e0b' : '#334155',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {calcXrayLoop ? 'YES (Loop)' : 'NO'}
              </button>
            </div>

            {/* Prediction Output Tile */}
            <div style={{
              marginTop: '0.5rem',
              padding: '1rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.15))',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}>Predicted Lead Time</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                  {hours}h {mins}m
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bottleneck Risk</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: delayRiskScore > 70 ? '#fb7185' : '#34d399' }}>
                  {delayRiskScore}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Rules Grid */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          Extracted Operational Decision Rules (Association Mining)
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {decisionRules.map((rule, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(10, 16, 30, 0.5)',
                border: rule.status === 'critical' ? '1px solid rgba(245, 158, 11, 0.4)' : rule.status === 'violation' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                padding: '1rem'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#38bdf8', marginBottom: '6px' }}>
                {rule.rule}
              </div>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                → {rule.outcome}
              </h5>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>Confidence: <strong style={{ color: '#fff' }}>{rule.confidence}</strong></span>
                <span>Support: <strong>{rule.prevalence}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
