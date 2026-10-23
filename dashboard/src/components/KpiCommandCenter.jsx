import React, { useState, useEffect } from 'react';
import { Activity, Wifi, AlertCircle, CheckCircle2, TrendingUp, Clock, Users, Zap } from 'lucide-react';

// ─── Live Simulation Data ─────────────────────────────────────────────────────
const DEPARTMENTS = ['Triage', 'Radiology', 'Lab', 'Observation', 'ICU', 'Discharge'];

function generateLiveEvent() {
  const events = [
    { type: 'admission', msg: 'New ESI-3 patient admitted via ambulance', dept: 'Triage', color: '#f59e0b', icon: '🚑' },
    { type: 'critical', msg: 'ESI-1 cardiac arrest — code blue activated', dept: 'ICU', color: '#f43f5e', icon: '🆘' },
    { type: 'discharge', msg: 'Patient discharged — bed now available', dept: 'Discharge', color: '#10b981', icon: '✅' },
    { type: 'delay', msg: 'Radiology queue backed up — +38 min estimated wait', dept: 'Radiology', color: '#fb923c', icon: '⏳' },
    { type: 'order', msg: 'CPOE lab order completed — result pending', dept: 'Lab', color: '#06b6d4', icon: '🧪' },
    { type: 'handover', msg: 'Nursing shift handover — 14:00 rotation complete', dept: 'Triage', color: '#8b5cf6', icon: '👥' },
    { type: 'alert', msg: 'SLA breach — patient waiting > 45 min for consult', dept: 'Observation', color: '#f43f5e', icon: '⚡' },
    { type: 'admission', msg: 'ESI-2 chest pain patient — stat ECG ordered', dept: 'Triage', color: '#fb923c', icon: '💓' },
    { type: 'discharge', msg: 'ESI-4 minor laceration discharged successfully', dept: 'Discharge', color: '#10b981', icon: '🏥' },
    { type: 'order', msg: 'CT scan completed — radiologist reviewing', dept: 'Radiology', color: '#06b6d4', icon: '📷' },
  ];
  return { ...events[Math.floor(Math.random() * events.length)], time: new Date().toLocaleTimeString(), id: Date.now() };
}

const METRIC_STREAMS = [
  { id: 'occupancy', label: 'Bed Occupancy', unit: '%', baseVal: 78, range: 12, color: '#06b6d4', target: 85, targetLabel: 'Surge threshold' },
  { id: 'wait', label: 'Avg Wait Time', unit: ' min', baseVal: 34, range: 18, color: '#f59e0b', target: 45, targetLabel: 'SLA limit' },
  { id: 'throughput', label: 'Pts/Hour', unit: '', baseVal: 6, range: 3, color: '#10b981', target: null },
  { id: 'compliance', label: 'SLA Compliance', unit: '%', baseVal: 91, range: 7, color: '#8b5cf6', target: 90, targetLabel: 'CMS minimum' },
];

export default function KpiCommandCenter() {
  const [events, setEvents] = useState(() => Array.from({ length: 8 }, generateLiveEvent));
  const [metrics, setMetrics] = useState(() =>
    METRIC_STREAMS.map(m => ({
      ...m, current: m.baseVal,
      history: Array.from({ length: 20 }, () => m.baseVal + Math.round((Math.random() - 0.5) * m.range))
    }))
  );
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [section, setSection] = useState('live');

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setTick(t => t + 1);
      setEvents(prev => {
        const next = [generateLiveEvent(), ...prev.slice(0, 14)];
        return next;
      });
      setMetrics(prev => prev.map(m => {
        const next = m.current + Math.round((Math.random() - 0.45) * (m.range / 3));
        const clamped = Math.min(Math.max(next, m.baseVal - m.range), m.baseVal + m.range);
        return { ...m, current: clamped, history: [...m.history.slice(1), clamped] };
      }));
    }, 2500);
    return () => clearInterval(timer);
  }, [paused]);

  const tabs = [
    { id: 'live', label: '🔴 Live Event Stream' },
    { id: 'sparklines', label: '📡 KPI Signal Monitor' },
    { id: 'census', label: '🏥 Real-Time Census' },
  ];

  const deptCensus = DEPARTMENTS.map(d => ({
    name: d,
    occupied: Math.round(4 + Math.random() * 14),
    total: d === 'ICU' ? 12 : d === 'Radiology' ? 6 : 18,
    wait: Math.round(8 + Math.random() * 40),
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'linear-gradient(135deg,#f43f5e,#f59e0b)', padding: 9,
              borderRadius: 11, boxShadow: '0 0 18px rgba(244,63,94,0.4)', position: 'relative' }}>
              <Activity size={20} color="#fff" />
              <span style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%',
                background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Real-Time KPI Command Center
              </h2>
              <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0 }}>
                Live event telemetry · 2.5s refresh · Signal monitoring · Department census
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setPaused(p => !p)} style={{
              padding: '5px 14px', borderRadius: 7, border: '1px solid var(--border-color)',
              background: paused ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)',
              color: paused ? '#34d399' : '#fb7185', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer'
            }}>{paused ? '▶ Resume' : '⏸ Pause'}</button>
            <div style={{ display: 'flex', gap: 3, background: 'rgba(7,11,20,0.75)',
              padding: 3, borderRadius: 8, border: '1px solid var(--border-color)' }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setSection(t.id)} style={{
                  padding: '5px 11px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: section === t.id ? 'rgba(244,63,94,0.3)' : 'transparent',
                  color: section === t.id ? '#fb7185' : 'var(--text-muted)',
                  fontSize: '0.72rem', fontWeight: section === t.id ? 700 : 500,
                }}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>
        {/* Pulse KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '0.65rem' }}>
          {metrics.map(m => {
            const over = m.target && m.id !== 'compliance' ? m.current > m.target : m.target && m.current < m.target;
            return (
              <div key={m.id} style={{ background: 'rgba(7,11,20,0.7)', padding: '0.8rem 1rem',
                borderRadius: 10, border: `1px solid ${over ? '#f43f5e40' : m.color + '30'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.label}</span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%',
                    background: over ? '#f43f5e' : '#10b981',
                    boxShadow: `0 0 6px ${over ? '#f43f5e' : '#10b981'}`,
                    animation: 'pulse 1.5s infinite' }} />
                </div>
                <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800,
                  color: over ? '#f43f5e' : m.color }}>{m.current}{m.unit}</div>
                {m.target && <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {m.targetLabel}: {m.target}{m.unit}
                </div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Live Event Stream ─────────────────────────────────────────────── */}
      {section === 'live' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Live Clinical Event Telemetry Stream
              </h3>
              <span className="badge badge-rose">LIVE</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Tick #{tick} · Refresh: 2.5s
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 460, overflowY: 'auto' }}>
            {events.map((ev, i) => (
              <div key={ev.id} style={{
                background: 'rgba(7,11,20,0.75)', border: `1px solid ${i === 0 ? ev.color + '60' : 'var(--border-color)'}`,
                borderLeft: `4px solid ${ev.color}`, borderRadius: 8, padding: '0.7rem 1rem',
                display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
                opacity: 1 - i * 0.04, transition: 'opacity 0.3s ease'
              }}>
                <span style={{ fontSize: '1.1rem' }}>{ev.icon}</span>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: i === 0 ? 700 : 500, color: i === 0 ? '#f8fafc' : '#cbd5e1' }}>
                    {ev.msg}
                  </div>
                  <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Dept: <span style={{ color: ev.color }}>{ev.dept}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace', flexShrink: 0 }}>
                  {ev.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── KPI Sparkline Monitor ─────────────────────────────────────────── */}
      {section === 'sparklines' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              KPI Signal Monitor — Mini Sparklines (Last 20 Samples)
            </h3>
            <span className="badge badge-rose">LIVE</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem' }}>
            {metrics.map(m => {
              const minV = Math.min(...m.history);
              const maxV = Math.max(...m.history);
              const h = 60;
              const w = 240;
              const pts = m.history.map((v, i) => {
                const x = (i / (m.history.length - 1)) * w;
                const y = h - ((v - minV) / (maxV - minV + 1)) * h;
                return `${x},${y}`;
              }).join(' ');
              const over = m.target && m.id !== 'compliance' ? m.current > m.target : m.target && m.current < m.target;
              return (
                <div key={m.id} style={{ background: 'rgba(7,11,20,0.7)', borderRadius: 12,
                  border: `1px solid ${over ? '#f43f5e40' : m.color + '30'}`, padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0' }}>{m.label}</span>
                    <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 800,
                      color: over ? '#f43f5e' : m.color }}>{m.current}{m.unit}</span>
                  </div>
                  <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
                    <defs>
                      <linearGradient id={`sg-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={m.color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={m.color} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg-${m.id})`} />
                    <polyline points={pts} fill="none" stroke={m.color} strokeWidth="2" strokeLinejoin="round" />
                    {m.target && (
                      <line x1="0" y1={h - ((m.target - minV) / (maxV - minV + 1)) * h}
                        x2={w} y2={h - ((m.target - minV) / (maxV - minV + 1)) * h}
                        stroke="#f43f5e" strokeDasharray="4 4" strokeWidth="1.5" />
                    )}
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>min: {minV}{m.unit}</span>
                    {m.target && <span style={{ color: '#f43f5e' }}>target: {m.target}{m.unit}</span>}
                    <span>max: {maxV}{m.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Census Board ──────────────────────────────────────────────────── */}
      {section === 'census' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Real-Time Department Census Board
            </h3>
            <span className="badge badge-cyan">6 Units</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
            {deptCensus.map(d => {
              const pct = Math.round((d.occupied / d.total) * 100);
              const statusColor = pct > 90 ? '#f43f5e' : pct > 75 ? '#f59e0b' : '#10b981';
              return (
                <div key={d.name} style={{ background: 'rgba(7,11,20,0.75)', border: `1px solid ${statusColor}40`,
                  borderRadius: 12, padding: '1.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>{d.name}</span>
                    <span className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: statusColor }}>{pct}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 8, height: 12, marginBottom: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: 8,
                      background: pct > 90 ? 'linear-gradient(90deg,#f43f5e,#fb923c)' :
                                  pct > 75 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' :
                                  'linear-gradient(90deg,#10b981,#06b6d4)',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: '#fff' }}>{d.occupied}</strong> / {d.total} beds
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Wait: <strong style={{ color: '#fbbf24' }}>{d.wait}m</strong>
                    </span>
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
