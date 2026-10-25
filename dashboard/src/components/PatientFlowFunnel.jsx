import React, { useState } from 'react';
import {
  ResponsiveContainer, FunnelChart, Funnel, LabelList,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { GitBranch, ArrowDown, AlertTriangle, TrendingUp, Filter } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────
const FUNNEL_DATA = [
  { name: 'Arrived at ED', value: 1000, fill: '#06b6d4', pct: '100%' },
  { name: 'Triaged (ESI Assigned)', value: 982, fill: '#3b82f6', pct: '98.2%' },
  { name: 'Physician Assessment', value: 941, fill: '#8b5cf6', pct: '94.1%' },
  { name: 'Diagnostic Ordered', value: 817, fill: '#a855f7', pct: '81.7%' },
  { name: 'Diagnosis Confirmed', value: 756, fill: '#ec4899', pct: '75.6%' },
  { name: 'Treatment Initiated', value: 731, fill: '#f43f5e', pct: '73.1%' },
  { name: 'Discharged / Admitted', value: 718, fill: '#10b981', pct: '71.8%' },
];

const DROPOUT_REASONS = [
  { reason: 'Left Without Being Seen (LWBS)', count: 18, color: '#f43f5e', pct: 63 },
  { reason: 'Left Against Medical Advice (AMA)', count: 8, color: '#fb923c', pct: 28 },
  { reason: 'Transferred to Another Facility', count: 2, color: '#eab308', pct: 7 },
  { reason: 'Deceased Before Discharge', count: 2, color: '#64748b', pct: 2 },
];

const DISPOSITION_TREND = [
  { month: 'May', discharge: 412, admit: 198, transfer: 18, ama: 12 },
  { month: 'Jun', discharge: 398, admit: 211, transfer: 22, ama: 9 },
  { month: 'Jul', discharge: 445, admit: 224, transfer: 15, ama: 16 },
  { month: 'Aug', discharge: 423, admit: 208, transfer: 20, ama: 11 },
  { month: 'Sep', discharge: 461, admit: 232, transfer: 18, ama: 8 },
  { month: 'Oct', discharge: 488, admit: 241, transfer: 16, ama: 12 },
];

const PATHWAY_CONV = [
  { step: 'Arrival→Triage', rate: 98.2, time: '4 min', target: 99, delta: -0.8 },
  { step: 'Triage→Doctor', rate: 95.8, time: '32 min', target: 98, delta: -2.2 },
  { step: 'Doctor→Diagnostics', rate: 86.8, time: '12 min', target: 92, delta: -5.2 },
  { step: 'Diagnostics→Result', rate: 92.6, time: '58 min', target: 95, delta: -2.4 },
  { step: 'Result→Treatment', rate: 96.7, time: '18 min', target: 97, delta: -0.3 },
  { step: 'Treatment→Discharge', rate: 98.2, time: '42 min', target: 98, delta: +0.2 },
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

export default function PatientFlowFunnel() {
  const [section, setSection] = useState('funnel');

  const tabs = [
    { id: 'funnel', label: '🔽 Flow Funnel' },
    { id: 'dropout', label: '🚪 Dropout Analysis' },
    { id: 'disposition', label: '📋 Disposition Trend' },
    { id: 'conversion', label: '🔄 Step Conversion' },
  ];

  const totalDropout = 1000 - 718;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', padding: 9,
              borderRadius: 11, boxShadow: '0 0 18px rgba(6,182,212,0.45)' }}>
              <GitBranch size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Patient Flow Funnel & Conversion Analytics
              </h2>
              <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0 }}>
                End-to-end patient journey · Step dropout rates · Disposition trends · Conversion efficiency
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3, background: 'rgba(7,11,20,0.75)',
            padding: 3, borderRadius: 8, border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setSection(t.id)} style={{
                padding: '5px 11px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: section === t.id ? 'rgba(6,182,212,0.3)' : 'transparent',
                color: section === t.id ? '#22d3ee' : 'var(--text-muted)',
                fontSize: '0.72rem', fontWeight: section === t.id ? 700 : 500,
              }}>{t.label}</button>
            ))}
          </div>
        </div>
        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '0.75rem' }}>
          {[
            { l: 'Total Arrivals', v: '1,000', c: '#06b6d4' },
            { l: 'Completed Pathway', v: '718 (71.8%)', c: '#10b981' },
            { l: 'Dropout Volume', v: `${totalDropout} patients`, c: '#f43f5e' },
            { l: 'LWBS Rate', v: '1.8%', c: '#f59e0b' },
            { l: 'Admission Rate', v: '24.1%', c: '#8b5cf6' },
          ].map(k => (
            <div key={k.l} style={{ background: 'rgba(7,11,20,0.7)', padding: '0.75rem 1rem',
              borderRadius: 10, border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 3 }}>{k.l}</div>
              <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: k.c }}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Funnel ───────────────────────────────────────────────────────── */}
      {section === 'funnel' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              ED Patient Journey Funnel — 1,000 Case Cohort (7 Stages)
            </h3>
            <span className="badge badge-cyan">28.2% Dropout</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {FUNNEL_DATA.map((stage, i) => {
              const prev = i > 0 ? FUNNEL_DATA[i-1].value : stage.value;
              const loss = prev - stage.value;
              const lossRate = ((loss / prev) * 100).toFixed(1);
              return (
                <div key={stage.name}>
                  {i > 0 && loss > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, paddingLeft: `${(i * 3)}%` }}>
                      <ArrowDown size={12} color="#f43f5e" />
                      <span style={{ fontSize: '0.67rem', color: '#f43f5e' }}>
                        -{loss} patients dropped ({lossRate}%)
                      </span>
                    </div>
                  )}
                  <div style={{ position: 'relative', marginLeft: `${(i * 3)}%`, marginRight: `${(i * 3)}%` }}>
                    <div style={{
                      background: stage.fill + '22', border: `1px solid ${stage.fill}60`,
                      borderLeft: `4px solid ${stage.fill}`, borderRadius: 8,
                      padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 22, height: 22, borderRadius: '50%', background: stage.fill,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.65rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{i+1}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>{stage.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 6, width: 120 }}>
                          <div style={{ width: stage.pct, height: '100%', borderRadius: 6, background: stage.fill }} />
                        </div>
                        <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: stage.fill, minWidth: 50, textAlign: 'right' }}>
                          {stage.value}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 45 }}>{stage.pct}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Dropout ───────────────────────────────────────────────────────── */}
      {section === 'dropout' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Patient Dropout Classification — Root Cause Attribution
            </h3>
            <span className="badge badge-rose">282 Total Dropouts</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {DROPOUT_REASONS.map(d => (
                <div key={d.reason} style={{ background: `${d.color}12`, border: `1px solid ${d.color}40`,
                  borderRadius: 10, padding: '1rem', borderLeft: `4px solid ${d.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>{d.reason}</span>
                    <span className="font-mono" style={{ color: d.color, fontWeight: 800 }}>{d.count}</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 8 }}>
                    <div style={{ width: `${d.pct}%`, height: '100%', borderRadius: 6, background: d.color }} />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>{d.pct}% of all dropouts</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
                borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fb7185', marginBottom: 8 }}>
                  ⚠️ LWBS Risk Factors (Logistic Regression)
                </div>
                {[
                  ['Wait time > 60 min', 'OR = 4.2'],
                  ['ESI-4 or ESI-5 acuity', 'OR = 3.1'],
                  ['Evening shift (18:00–22:00)', 'OR = 2.6'],
                  ['Solo/unaccompanied patient', 'OR = 1.9'],
                ].map(([f, v]) => (
                  <div key={f} style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.76rem', color: '#e2e8f0', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>{f}</span>
                    <span className="font-mono" style={{ color: '#fbbf24' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', marginBottom: 8 }}>
                  ✅ Interventions to Reduce LWBS
                </div>
                {[
                  'Bedside triage for ESI 3–5 patients',
                  'Hourly wait time updates via patient board',
                  'Fast-track nurse practitioner stream',
                  'Real-time queue management system',
                ].map(item => (
                  <div key={item} style={{ fontSize: '0.75rem', color: '#e2e8f0', padding: '3px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 6 }}>
                    <span style={{ color: '#34d399' }}>→</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Disposition ───────────────────────────────────────────────────── */}
      {section === 'disposition' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Monthly Disposition Breakdown — Discharge vs Admit vs Transfer Trends
            </h3>
            <span className="badge badge-cyan">6 Months</span>
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISPOSITION_TREND} margin={{ top: 10, right: 20, left: -5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                <Bar dataKey="discharge" name="Discharged" fill="#10b981" radius={[4,4,0,0]} stackId="a" />
                <Bar dataKey="admit" name="Admitted" fill="#8b5cf6" radius={[0,0,0,0]} stackId="a" />
                <Bar dataKey="transfer" name="Transferred" fill="#f59e0b" radius={[0,0,0,0]} stackId="a" />
                <Bar dataKey="ama" name="AMA / LWBS" fill="#f43f5e" radius={[4,4,0,0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Conversion ────────────────────────────────────────────────────── */}
      {section === 'conversion' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Inter-Step Conversion Rates & Process Latency
            </h3>
            <span className="badge badge-amber">vs Target Benchmark</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {PATHWAY_CONV.map(s => {
              const ok = s.delta >= 0;
              return (
                <div key={s.step} style={{ background: 'rgba(7,11,20,0.75)', border: '1px solid var(--border-color)',
                  borderRadius: 10, padding: '0.85rem 1rem',
                  display: 'grid', gridTemplateColumns: '200px 1fr 90px 90px 80px', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>{s.step}</span>
                  <div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 10 }}>
                      <div style={{ width: `${s.rate}%`, height: '100%', borderRadius: 6,
                        background: s.rate >= 95 ? '#10b981' : s.rate >= 88 ? '#f59e0b' : '#f43f5e' }} />
                    </div>
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', textAlign: 'center' }}>
                    {s.rate}%
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    ⏱ {s.time}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 800,
                      color: ok ? '#34d399' : '#f43f5e' }}>
                      {ok ? '+' : ''}{s.delta}%
                    </span>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>vs target</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
