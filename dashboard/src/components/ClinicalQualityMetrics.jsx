import React, { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  RadialBarChart, RadialBar, PieChart, Pie
} from 'recharts';
import { Heart, Award, TrendingUp, TrendingDown, Star, AlertCircle, CheckCircle2 } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────
const HCAHPS_SCORES = [
  { domain: 'Communication with Doctors', score: 87.2, national: 82.4, delta: +4.8 },
  { domain: 'Communication with Nurses', score: 84.6, national: 80.1, delta: +4.5 },
  { domain: 'Responsiveness of Staff', score: 76.3, national: 74.8, delta: +1.5 },
  { domain: 'Pain Management', score: 71.8, national: 73.2, delta: -1.4 },
  { domain: 'Communication about Medicines', score: 68.4, national: 66.9, delta: +1.5 },
  { domain: 'Discharge Information', score: 89.1, national: 87.3, delta: +1.8 },
  { domain: 'Care Transitions', score: 63.2, national: 65.4, delta: -2.2 },
  { domain: 'Overall Hospital Rating (9–10)', score: 74.8, national: 72.1, delta: +2.7 },
];

const MORTALITY_TREND = [
  { month: 'May', observed: 2.1, expected: 2.4, smr: 0.875 },
  { month: 'Jun', observed: 1.8, expected: 2.3, smr: 0.782 },
  { month: 'Jul', observed: 2.4, expected: 2.5, smr: 0.960 },
  { month: 'Aug', observed: 1.9, expected: 2.2, smr: 0.863 },
  { month: 'Sep', observed: 2.2, expected: 2.4, smr: 0.916 },
  { month: 'Oct', observed: 1.6, expected: 2.1, smr: 0.761 },
];

const QUALITY_INDICATORS = [
  { indicator: 'Door-to-Balloon Time < 90 min', rate: 94.2, target: 90, status: 'PASS' },
  { indicator: 'Sepsis Bundle Compliance', rate: 87.6, target: 85, status: 'PASS' },
  { indicator: 'Stroke tPA Administration < 3h', rate: 91.4, target: 88, status: 'PASS' },
  { indicator: 'Fall Rate per 1,000 Patient-Days', rate: 2.1, target: 2.5, status: 'PASS', lower_better: true },
  { indicator: 'CLABSI Rate per 1,000 Line-Days', rate: 0.8, target: 1.0, status: 'PASS', lower_better: true },
  { indicator: 'Pressure Injury Rate', rate: 1.4, target: 1.0, status: 'FAIL', lower_better: true },
  { indicator: 'Medication Reconciliation at Discharge', rate: 96.8, target: 95, status: 'PASS' },
  { indicator: 'Unplanned Readmission < 30 Days', rate: 14.2, target: 15, status: 'PASS', lower_better: true },
];

const SAFETY_EVENTS = [
  { category: 'Near Miss (Caught)', count: 24, color: '#10b981', severity: 'LOW' },
  { category: 'Minor Adverse Events', count: 11, color: '#f59e0b', severity: 'MEDIUM' },
  { category: 'Sentinel Events', count: 1, color: '#f43f5e', severity: 'CRITICAL' },
  { category: 'Medication Errors (Intercepted)', count: 18, color: '#06b6d4', severity: 'LOW' },
];

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(11,18,33,0.97)', border: '1px solid #334155',
      borderRadius: 10, padding: '10px 14px', fontSize: '0.74rem', color: '#fff', minWidth: 180 }}>
      <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, margin: '2px 0' }}>
          <span style={{ color: p.color || '#94a3b8' }}>{p.name}:</span>
          <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function ClinicalQualityMetrics() {
  const [section, setSection] = useState('hcahps');

  const tabs = [
    { id: 'hcahps', label: '⭐ HCAHPS Scores' },
    { id: 'mortality', label: '📉 Mortality & SMR' },
    { id: 'quality', label: '✅ Quality Indicators' },
    { id: 'safety', label: '🛡️ Patient Safety' },
  ];

  const overallHcahps = (HCAHPS_SCORES.reduce((a, c) => a + c.score, 0) / HCAHPS_SCORES.length).toFixed(1);
  const avgSmr = (MORTALITY_TREND.reduce((a, c) => a + c.smr, 0) / MORTALITY_TREND.length).toFixed(3);
  const passCount = QUALITY_INDICATORS.filter(q => q.status === 'PASS').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'linear-gradient(135deg,#ec4899,#f43f5e)', padding: 9,
              borderRadius: 11, boxShadow: '0 0 18px rgba(236,72,153,0.4)' }}>
              <Heart size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Clinical Quality & Patient Safety Metrics
              </h2>
              <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0 }}>
                HCAHPS scores · Standardised Mortality Ratio · Joint Commission quality indicators · Safety event classification
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3, background: 'rgba(7,11,20,0.75)',
            padding: 3, borderRadius: 8, border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setSection(t.id)} style={{
                padding: '5px 11px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: section === t.id ? 'rgba(236,72,153,0.3)' : 'transparent',
                color: section === t.id ? '#f9a8d4' : 'var(--text-muted)',
                fontSize: '0.72rem', fontWeight: section === t.id ? 700 : 500,
              }}>{t.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(175px,1fr))', gap: '0.75rem' }}>
          {[
            { l: 'Overall HCAHPS Score', v: `${overallHcahps}%`, c: '#ec4899' },
            { l: 'Avg Standardised Mortality Ratio', v: avgSmr, c: '#10b981' },
            { l: 'Quality Indicators Passed', v: `${passCount}/${QUALITY_INDICATORS.length}`, c: '#06b6d4' },
            { l: 'Sentinel Events (MTD)', v: '1', c: '#f43f5e' },
          ].map(k => (
            <div key={k.l} style={{ background: 'rgba(7,11,20,0.7)', padding: '0.75rem 1rem',
              borderRadius: 10, border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 3 }}>{k.l}</div>
              <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: k.c }}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HCAHPS ───────────────────────────────────────────────────────── */}
      {section === 'hcahps' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              HCAHPS Patient Experience Survey — vs National Benchmark
            </h3>
            <span className="badge badge-cyan">CMS Publicly Reported</span>
          </div>
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HCAHPS_SCORES} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={10} domain={[60, 100]} unit="%" />
                <YAxis type="category" dataKey="domain" stroke="#64748b" fontSize={10} width={220} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                <Bar dataKey="score" name="Our Hospital %" fill="#ec4899" radius={[0,5,5,0]} />
                <Bar dataKey="national" name="National Avg %" fill="#475569" radius={[0,5,5,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '0.65rem', marginTop: '1rem' }}>
            {HCAHPS_SCORES.map(h => (
              <div key={h.domain} style={{ background: 'rgba(7,11,20,0.7)', padding: '0.65rem 0.85rem',
                borderRadius: 8, border: '1px solid var(--border-color)',
                borderLeft: `3px solid ${h.delta >= 0 ? '#10b981' : '#f43f5e'}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#e2e8f0', flex: 1 }}>{h.domain}</span>
                <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>{h.score}%</span>
                <span style={{ fontSize: '0.72rem', color: h.delta >= 0 ? '#34d399' : '#f43f5e', minWidth: 40, textAlign: 'right' }}>
                  {h.delta > 0 ? '+' : ''}{h.delta}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mortality ─────────────────────────────────────────────────────── */}
      {section === 'mortality' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Observed vs Expected Mortality + Standardised Mortality Ratio (SMR)
            </h3>
            <span className="badge badge-cyan">SMR &lt; 1 = Better than Expected</span>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MORTALITY_TREND} margin={{ top: 10, right: 30, left: -5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis yAxisId="pct" stroke="#64748b" fontSize={10} unit="%" />
                <YAxis yAxisId="smr" orientation="right" stroke="#8b5cf6" fontSize={10} domain={[0.6, 1.2]} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                <Line yAxisId="pct" dataKey="observed" name="Observed Mortality %" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line yAxisId="pct" dataKey="expected" name="Expected Mortality %" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line yAxisId="smr" dataKey="smr" name="SMR (right axis)" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: '0.76rem', color: '#86efac' }}>
            ✅ <strong>6-Month Average SMR = {avgSmr}</strong> — Consistently below 1.0 indicates better-than-expected mortality performance.
            Oct SMR of 0.761 is the best result in the 6-month observation window.
          </div>
        </div>
      )}

      {/* ── Quality Indicators ────────────────────────────────────────────── */}
      {section === 'quality' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Joint Commission & CMS Quality Indicator Scorecard
            </h3>
            <span className="badge badge-cyan">{passCount}/{QUALITY_INDICATORS.length} Passing</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {QUALITY_INDICATORS.map(q => {
              const pass = q.status === 'PASS';
              const pct = q.lower_better
                ? Math.min(100, (q.target / q.rate) * 100)
                : Math.min(100, (q.rate / q.target) * 100);
              return (
                <div key={q.indicator} style={{ background: 'rgba(7,11,20,0.75)', border: '1px solid var(--border-color)',
                  borderRadius: 10, padding: '0.85rem 1rem', display: 'grid',
                  gridTemplateColumns: '1fr 80px 80px 70px', gap: '1rem', alignItems: 'center',
                  borderLeft: `4px solid ${pass ? '#10b981' : '#f43f5e'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {pass ? <CheckCircle2 size={14} color="#10b981" /> : <AlertCircle size={14} color="#f43f5e" />}
                    <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>{q.indicator}</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 800,
                    color: pass ? '#34d399' : '#f43f5e', textAlign: 'center' }}>
                    {q.rate}{q.lower_better ? '' : '%'}
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Target: {q.target}{q.lower_better ? '' : '%'}
                  </div>
                  <span style={{ background: pass ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                    border: `1px solid ${pass ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}`,
                    color: pass ? '#34d399' : '#fb7185', borderRadius: 6,
                    padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700, textAlign: 'center' }}>
                    {q.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Patient Safety ────────────────────────────────────────────────── */}
      {section === 'safety' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Patient Safety Event Classification & Severity Matrix
            </h3>
            <span className="badge badge-amber">Monthly Report</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SAFETY_EVENTS.map(e => (
                <div key={e.category} style={{ background: `${e.color}12`, border: `1px solid ${e.color}40`,
                  borderRadius: 10, padding: '1rem', borderLeft: `4px solid ${e.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>{e.category}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: e.color }}>{e.count}</span>
                      <span style={{ background: `${e.color}20`, border: `1px solid ${e.color}50`,
                        color: e.color, borderRadius: 6, padding: '1px 7px', fontSize: '0.65rem', fontWeight: 700 }}>
                        {e.severity}
                      </span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 6 }}>
                    <div style={{ width: `${Math.min(100, e.count * 3)}%`, height: '100%', borderRadius: 6, background: e.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)',
                borderRadius: 12, padding: '1.25rem', flex: 1 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#22d3ee', marginBottom: 12 }}>
                  📊 Swiss Cheese Model — Failure Layers
                </div>
                {[
                  ['Layer 1: Organizational influences', '14%'],
                  ['Layer 2: Unsafe supervision', '22%'],
                  ['Layer 3: Preconditions', '31%'],
                  ['Layer 4: Unsafe acts (sharp end)', '33%'],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.75rem', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    color: '#e2e8f0' }}>
                    <span>{l}</span>
                    <span className="font-mono" style={{ color: '#38bdf8' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
                borderRadius: 12, padding: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fb7185', marginBottom: 8 }}>
                  🔴 Open Sentinel Event — RCA Required
                </div>
                <div style={{ fontSize: '0.75rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                  <strong>Event:</strong> Medication administration error (wrong dose)<br />
                  <strong>Initiated:</strong> Oct 19, 2026<br />
                  <strong>RCA Lead:</strong> Quality & Patient Safety Committee<br />
                  <strong>Status:</strong> <span style={{ color: '#f59e0b' }}>Ongoing Investigation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
