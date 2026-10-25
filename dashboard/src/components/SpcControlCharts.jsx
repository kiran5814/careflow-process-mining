import React, { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Cell, ReferenceLine, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';

// ─── SPC Data Generator ──────────────────────────────────────────────────────
function spcSeries(mean, sigma, n = 28) {
  return Array.from({ length: n }, (_, i) => {
    const day = `Oct ${(i + 1).toString().padStart(2, '0')}`;
    const noise = (Math.random() - 0.5) * sigma * 2;
    const spike = (i === 14 || i === 22) ? sigma * 2.5 : 0; // intentional outliers
    const val = parseFloat((mean + noise + spike).toFixed(1));
    return { day, value: val, mean, ucl: mean + 3 * sigma, lcl: Math.max(0, mean - 3 * sigma) };
  });
}

const LOS_SPC = spcSeries(218, 32, 28);
const WAIT_SPC = spcSeries(38, 9, 28);
const COMPLIANCE_SPC = spcSeries(92.4, 3.2, 28);
const LOOPBACK_SPC = spcSeries(29.6, 6.8, 28);

const CUSUM_DATA = Array.from({ length: 20 }, (_, i) => {
  const dev = (Math.random() - 0.4) * 8;
  return {
    pt: i + 1,
    cusum: parseFloat((i < 10 ? dev * 0.3 : dev + (i - 10) * 1.2).toFixed(2)),
    target: 0,
    ucl: 12,
    lcl: -12,
  };
});

const METRICS = [
  { id: 'los', label: 'Length of Stay (min)', data: LOS_SPC, mean: 218, sigma: 32, unit: 'min', color: '#06b6d4' },
  { id: 'wait', label: 'Wait Time (min)', data: WAIT_SPC, mean: 38, sigma: 9, unit: 'min', color: '#8b5cf6' },
  { id: 'compliance', label: 'SLA Compliance (%)', data: COMPLIANCE_SPC, mean: 92.4, sigma: 3.2, unit: '%', color: '#10b981' },
  { id: 'loopback', label: 'Loopback Rate (%)', data: LOOPBACK_SPC, mean: 29.6, sigma: 6.8, unit: '%', color: '#f59e0b' },
];

const NELSON_RULES = [
  { rule: 'Rule 1', desc: 'Single point beyond 3σ control limit', violations: 2, status: 'VIOLATION' },
  { rule: 'Rule 2', desc: '9 consecutive points on same side of center', violations: 0, status: 'OK' },
  { rule: 'Rule 3', desc: '6 consecutive points trending up or down', violations: 1, status: 'VIOLATION' },
  { rule: 'Rule 4', desc: '14 consecutive points alternating up-down', violations: 0, status: 'OK' },
  { rule: 'Rule 5', desc: '2 of 3 points beyond 2σ', violations: 1, status: 'WARNING' },
  { rule: 'Rule 6', desc: '4 of 5 points beyond 1σ', violations: 0, status: 'OK' },
];

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(11,18,33,0.97)', border: '1px solid #334155',
      borderRadius: 10, padding: '10px 14px', fontSize: '0.74rem', color: '#fff', minWidth: 190 }}>
      <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, margin: '2px 0' }}>
          <span style={{ color: p.color || '#94a3b8' }}>{p.name}:</span>
          <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function SpcControlCharts() {
  const [selectedMetric, setSelectedMetric] = useState('los');
  const [section, setSection] = useState('xbar');

  const metric = METRICS.find(m => m.id === selectedMetric);
  const violations = metric.data.filter(d => d.value > d.ucl || d.value < d.lcl);

  const tabs = [
    { id: 'xbar', label: '📊 X-bar Control Chart' },
    { id: 'cusum', label: '🔺 CUSUM Chart' },
    { id: 'nelson', label: '📋 Nelson Rules' },
    { id: 'capability', label: '🎯 Process Capability' },
  ];

  const capabilityCp = (metric.ucl ? ((metric.mean + 3 * metric.sigma) - (metric.mean - 3 * metric.sigma)) / (6 * metric.sigma) : 1.0).toFixed(3);
  const cpk = 1.02;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'linear-gradient(135deg,#f59e0b,#10b981)', padding: 9,
              borderRadius: 11, boxShadow: '0 0 18px rgba(245,158,11,0.4)' }}>
              <Activity size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Statistical Process Control (SPC) — Clinical Outlier Detection
              </h2>
              <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0 }}>
                X-bar control charts · CUSUM detection · Nelson rules testing · Process capability (Cp, Cpk)
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3, background: 'rgba(7,11,20,0.75)',
            padding: 3, borderRadius: 8, border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setSection(t.id)} style={{
                padding: '5px 11px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: section === t.id ? 'rgba(245,158,11,0.3)' : 'transparent',
                color: section === t.id ? '#fbbf24' : 'var(--text-muted)',
                fontSize: '0.72rem', fontWeight: section === t.id ? 700 : 500,
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Metric selector & KPIs */}
        <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          {METRICS.map(m => (
            <button key={m.id} onClick={() => setSelectedMetric(m.id)} style={{
              padding: '5px 12px', borderRadius: 7, border: `1px solid ${selectedMetric === m.id ? m.color : 'var(--border-color)'}`,
              background: selectedMetric === m.id ? `${m.color}20` : 'rgba(7,11,20,0.7)',
              color: selectedMetric === m.id ? m.color : 'var(--text-muted)',
              fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer'
            }}>{m.label}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: '0.65rem' }}>
          {[
            { l: 'Center Line (CL)', v: `${metric.mean}${metric.unit}`, c: metric.color },
            { l: 'UCL (μ + 3σ)', v: `${(metric.mean + 3 * metric.sigma).toFixed(1)}${metric.unit}`, c: '#f43f5e' },
            { l: 'LCL (μ - 3σ)', v: `${Math.max(0, metric.mean - 3 * metric.sigma).toFixed(1)}${metric.unit}`, c: '#10b981' },
            { l: 'Violations (28 days)', v: `${violations.length}`, c: violations.length > 0 ? '#f59e0b' : '#10b981' },
          ].map(k => (
            <div key={k.l} style={{ background: 'rgba(7,11,20,0.7)', padding: '0.65rem 0.85rem',
              borderRadius: 9, border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: 2 }}>{k.l}</div>
              <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: k.c }}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── X-bar Chart ───────────────────────────────────────────────────── */}
      {section === 'xbar' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Shewhart X-bar Control Chart — {metric.label}
            </h3>
            <span className="badge badge-amber">{violations.length} Violations</span>
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metric.data} margin={{ top: 10, right: 20, left: -5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={9} interval={3} />
                <YAxis stroke="#64748b" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                <ReferenceLine y={metric.mean} stroke={metric.color} strokeDasharray="6 3"
                  label={{ value: `CL=${metric.mean}`, fill: metric.color, fontSize: 9, position: 'insideTopLeft' }} />
                <ReferenceLine y={metric.mean + 3 * metric.sigma} stroke="#f43f5e" strokeDasharray="4 4"
                  label={{ value: 'UCL', fill: '#f43f5e', fontSize: 9, position: 'insideTopRight' }} />
                <ReferenceLine y={Math.max(0, metric.mean - 3 * metric.sigma)} stroke="#10b981" strokeDasharray="4 4"
                  label={{ value: 'LCL', fill: '#10b981', fontSize: 9, position: 'insideBottomRight' }} />
                <Line dataKey="value" name={metric.label} stroke={metric.color} strokeWidth={2.5}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    const isViolation = payload.value > payload.ucl || payload.value < payload.lcl;
                    return <circle key={props.key} cx={cx} cy={cy} r={isViolation ? 6 : 3}
                      fill={isViolation ? '#f43f5e' : metric.color}
                      stroke={isViolation ? '#fff' : 'none'} strokeWidth={isViolation ? 1.5 : 0} />;
                  }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {violations.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(244,63,94,0.08)',
              border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, fontSize: '0.76rem', color: '#fca5a5' }}>
              ⚠️ <strong>{violations.length} out-of-control points detected</strong> (red circles on chart). These points exceed
              the 3σ upper control limit and require investigation before applying process improvements.
            </div>
          )}
        </div>
      )}

      {/* ── CUSUM Chart ───────────────────────────────────────────────────── */}
      {section === 'cusum' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              CUSUM (Cumulative Sum) Control Chart — Shift Detection
            </h3>
            <span className="badge badge-rose">Process Drift Detected</span>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CUSUM_DATA} margin={{ top: 10, right: 20, left: -5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
                <XAxis dataKey="pt" stroke="#64748b" fontSize={10} label={{ value: 'Observation', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip content={<DarkTooltip />} />
                <ReferenceLine y={12} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'UCL (+12)', fill: '#f43f5e', fontSize: 9 }} />
                <ReferenceLine y={-12} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'LCL (-12)', fill: '#10b981', fontSize: 9 }} />
                <ReferenceLine y={0} stroke="#64748b" />
                <Line dataKey="cusum" name="CUSUM Statistic" stroke="#8b5cf6" strokeWidth={2.5}
                  dot={{ r: 3, fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, fontSize: '0.76rem', color: '#c4b5fd' }}>
            📈 <strong>CUSUM Interpretation:</strong> Upward drift beginning at observation #11 indicates a sustained process mean shift.
            CUSUM is more sensitive to small, gradual shifts than standard Shewhart charts — ideal for detecting workflow degradation.
          </div>
        </div>
      )}

      {/* ── Nelson Rules ──────────────────────────────────────────────────── */}
      {section === 'nelson' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Nelson Rules Violation Assessment — {metric.label}
            </h3>
            <span className="badge badge-amber">2 Violations Active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {NELSON_RULES.map(r => (
              <div key={r.rule} style={{ background: 'rgba(7,11,20,0.75)', border: '1px solid var(--border-color)',
                borderRadius: 10, padding: '0.85rem 1rem', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
                borderLeft: `4px solid ${r.status === 'VIOLATION' ? '#f43f5e' : r.status === 'WARNING' ? '#f59e0b' : '#10b981'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {r.status === 'VIOLATION' ? <AlertTriangle size={16} color="#f43f5e" /> :
                   r.status === 'WARNING' ? <AlertTriangle size={16} color="#f59e0b" /> :
                   <CheckCircle2 size={16} color="#10b981" />}
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{r.rule}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Violations</div>
                    <div className="font-mono" style={{ fontWeight: 800,
                      color: r.violations > 0 ? '#f43f5e' : '#10b981' }}>{r.violations}</div>
                  </div>
                  <span style={{
                    background: r.status === 'VIOLATION' ? 'rgba(244,63,94,0.18)' : r.status === 'WARNING' ? 'rgba(245,158,11,0.18)' : 'rgba(16,185,129,0.18)',
                    border: `1px solid ${r.status === 'VIOLATION' ? 'rgba(244,63,94,0.4)' : r.status === 'WARNING' ? 'rgba(245,158,11,0.4)' : 'rgba(16,185,129,0.4)'}`,
                    color: r.status === 'VIOLATION' ? '#fb7185' : r.status === 'WARNING' ? '#fbbf24' : '#34d399',
                    borderRadius: 6, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700
                  }}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Process Capability ────────────────────────────────────────────── */}
      {section === 'capability' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Process Capability Analysis — Cp, Cpk, Sigma Level
            </h3>
            <span className="badge badge-cyan">Six Sigma Framework</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Process Mean (μ)', value: `${metric.mean}${metric.unit}`, color: metric.color, desc: 'Central tendency of the process' },
                { label: 'Process Std Dev (σ)', value: `${metric.sigma}${metric.unit}`, color: '#8b5cf6', desc: 'Variation within the process' },
                { label: 'Cp (Potential Capability)', value: capabilityCp, color: '#06b6d4', desc: 'Cp ≥ 1.33 = Capable process' },
                { label: 'Cpk (Process Capability)', value: cpk.toFixed(2), color: '#10b981', desc: 'Accounts for process centering' },
                { label: 'Sigma Level', value: '3.1σ', color: '#f59e0b', desc: 'Target: 4σ for healthcare' },
                { label: 'Defect Rate (DPMO)', value: '966', color: '#f43f5e', desc: 'Defects per million opportunities' },
              ].map(k => (
                <div key={k.label} style={{ background: 'rgba(7,11,20,0.7)', padding: '0.75rem 1rem',
                  borderRadius: 10, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0' }}>{k.label}</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{k.desc}</div>
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 12, padding: '1.25rem', flex: 1 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24', marginBottom: 10 }}>
                  📊 Capability Interpretation
                </div>
                {[
                  ['Cp = 1.0 (current)', '± 3σ within spec — Barely capable'],
                  ['Target: Cp ≥ 1.33', '± 4σ — Adequate for healthcare'],
                  ['World Class: Cp ≥ 1.67', '± 5σ — Excellent quality'],
                  ['Six Sigma: Cp = 2.0', '± 6σ — 3.4 DPMO'],
                ].map(([level, desc]) => (
                  <div key={level} style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.73rem', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    color: '#e2e8f0' }}>
                    <span style={{ fontWeight: 600 }}>{level}</span>
                    <span style={{ color: 'var(--text-muted)', textAlign: 'right', maxWidth: 200 }}>{desc}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, padding: '0.65rem', background: 'rgba(245,158,11,0.1)',
                  borderRadius: 8, fontSize: '0.73rem', color: '#fde68a' }}>
                  🎯 <strong>Recommendation:</strong> Implement CPOE standardisation to reduce σ from {metric.sigma} to ~{Math.round(metric.sigma * 0.65)},
                  which would bring Cpk above the 1.33 healthcare benchmark.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
