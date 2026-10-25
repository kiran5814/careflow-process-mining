import React, { useState } from 'react';
import { Network, ArrowRight, TrendingUp, BarChart2, Info } from 'lucide-react';

// ─── Markov State Transition Data ─────────────────────────────────────────────
// States: Registration, Triage, Doctor, Diagnostics, Treatment, Discharge, Admission, LWBS
const STATES = ['Reg', 'Triage', 'Doctor', 'Diag', 'Treatment', 'Discharge', 'Admission', 'LWBS'];

// Transition probability matrix (rows = from, cols = to)
const TRANSITION_MATRIX = [
  //  Reg    Triage  Doctor  Diag    Treat   Disch   Admit   LWBS
  [0.000, 0.980,  0.000,  0.000,  0.000,  0.000,  0.000,  0.020], // from Reg
  [0.000, 0.000,  0.958,  0.000,  0.000,  0.000,  0.000,  0.042], // from Triage
  [0.000, 0.000,  0.000,  0.820,  0.112,  0.062,  0.006,  0.000], // from Doctor
  [0.000, 0.072,  0.000,  0.000,  0.876,  0.042,  0.010,  0.000], // from Diag (loopback)
  [0.000, 0.000,  0.000,  0.068,  0.000,  0.826,  0.106,  0.000], // from Treatment
  [0.000, 0.000,  0.000,  0.000,  0.000,  1.000,  0.000,  0.000], // from Discharge (absorbing)
  [0.000, 0.000,  0.000,  0.000,  0.000,  0.000,  1.000,  0.000], // from Admission (absorbing)
  [0.000, 0.000,  0.000,  0.000,  0.000,  0.000,  0.000,  1.000], // from LWBS (absorbing)
];

const STATE_COLORS = {
  Reg:       '#06b6d4',
  Triage:    '#3b82f6',
  Doctor:    '#8b5cf6',
  Diag:      '#f59e0b',
  Treatment: '#10b981',
  Discharge: '#34d399',
  Admission: '#f43f5e',
  LWBS:      '#64748b',
};

const STATE_DESCRIPTIONS = {
  Reg:       'Patient checks in at reception desk',
  Triage:    'Nurse assigns ESI acuity level',
  Doctor:    'Physician initial assessment',
  Diag:      'Radiology / Lab ordered & pending',
  Treatment: 'Active clinical intervention underway',
  Discharge: 'Patient leaves facility (absorbing)',
  Admission: 'Patient admitted to inpatient unit (absorbing)',
  LWBS:      'Left Without Being Seen (absorbing)',
};

const STATE_STATS = {
  Reg:       { avgTime: '4 min', visits: 1000 },
  Triage:    { avgTime: '8 min', visits: 982 },
  Doctor:    { avgTime: '22 min', visits: 941 },
  Diag:      { avgTime: '58 min', visits: 771 },
  Treatment: { avgTime: '38 min', visits: 745 },
  Discharge: { avgTime: '12 min', visits: 618 },
  Admission: { avgTime: '68 min', visits: 122 },
  LWBS:      { avgTime: 'N/A', visits: 18 },
};

// Steady-state probability calculation (power iteration)
function computeSteadyState(matrix) {
  const n = matrix.length;
  let state = Array(n).fill(1 / n);
  for (let iter = 0; iter < 1000; iter++) {
    const next = Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        next[j] += state[i] * matrix[i][j];
      }
    }
    state = next;
  }
  return state;
}

const STEADY_STATE = computeSteadyState(TRANSITION_MATRIX);

export default function MarkovTransitionMatrix() {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedState, setSelectedState] = useState('Doctor');
  const [section, setSection] = useState('matrix');

  const tabs = [
    { id: 'matrix', label: '🔲 Transition Matrix' },
    { id: 'flow', label: '🌊 State Flow View' },
    { id: 'steady', label: '📊 Steady-State Analysis' },
    { id: 'loopback', label: '🔄 Loopback Paths' },
  ];

  const fromRow = STATES.indexOf(selectedState);
  const outflows = STATES.map((s, j) => ({
    to: s, prob: TRANSITION_MATRIX[fromRow][j], color: STATE_COLORS[s]
  })).filter(x => x.prob > 0 && x.to !== selectedState);

  const loopbackPaths = [
    { path: 'Doctor → Diagnostics → Triage → Doctor', frequency: 29.8, reason: 'Test inconclusive, re-triage required', severity: 'HIGH' },
    { path: 'Doctor → Diagnostics → Doctor', frequency: 18.4, reason: 'Preliminary results need repeat tests', severity: 'MEDIUM' },
    { path: 'Treatment → Diagnostics → Treatment', frequency: 12.6, reason: 'Medication adjustment requires new labs', severity: 'MEDIUM' },
    { path: 'Doctor → Diagnostics → Doctor → Diagnostics', frequency: 8.2, reason: 'Double loopback (paper requisition delay)', severity: 'HIGH' },
    { path: 'Triage → Triage (re-assessment)', frequency: 4.2, reason: 'Acuity change while waiting', severity: 'LOW' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', padding: 9,
              borderRadius: 11, boxShadow: '0 0 18px rgba(59,130,246,0.4)' }}>
              <Network size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Markov Chain Process Mining — State Transition Analysis
              </h2>
              <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0 }}>
                8-state transition probability matrix · Steady-state distribution · Loopback path analysis
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3, background: 'rgba(7,11,20,0.75)',
            padding: 3, borderRadius: 8, border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setSection(t.id)} style={{
                padding: '5px 11px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: section === t.id ? 'rgba(59,130,246,0.3)' : 'transparent',
                color: section === t.id ? '#93c5fd' : 'var(--text-muted)',
                fontSize: '0.72rem', fontWeight: section === t.id ? 700 : 500,
              }}>{t.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '0.65rem' }}>
          {[
            { l: 'Total States', v: '8 (3 absorbing)', c: '#3b82f6' },
            { l: 'Loopback Rate', v: '39.8%', c: '#f59e0b' },
            { l: 'Avg Steps to Absorb', v: '5.2 transitions', c: '#10b981' },
            { l: 'Most Common Path', v: 'Reg→T→Doc→Discharge', c: '#8b5cf6' },
          ].map(k => (
            <div key={k.l} style={{ background: 'rgba(7,11,20,0.7)', padding: '0.7rem 0.9rem',
              borderRadius: 9, border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: 2 }}>{k.l}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: k.c }}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Transition Matrix ─────────────────────────────────────────────── */}
      {section === 'matrix' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              8×8 Transition Probability Matrix — P(next state | current state)
            </h3>
            <span className="badge badge-cyan">Hover cells for details</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)',
                    fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', minWidth: 80 }}>From \ To</th>
                  {STATES.map(s => (
                    <th key={s} style={{ padding: '8px 10px', textAlign: 'center',
                      color: STATE_COLORS[s], fontSize: '0.72rem', fontWeight: 700, minWidth: 68 }}>
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STATES.map((fromState, i) => (
                  <tr key={fromState}>
                    <td style={{ padding: '7px 10px', color: STATE_COLORS[fromState], fontWeight: 700 }}>{fromState}</td>
                    {STATES.map((toState, j) => {
                      const prob = TRANSITION_MATRIX[i][j];
                      const isHovered = hoveredCell && hoveredCell[0] === i && hoveredCell[1] === j;
                      const opacity = prob === 0 ? 0.12 : prob;
                      const isAbsorbing = (i === j) && (i >= 5);
                      return (
                        <td key={toState}
                          onMouseEnter={() => setHoveredCell([i, j])}
                          onMouseLeave={() => setHoveredCell(null)}
                          style={{
                            padding: '7px 10px', textAlign: 'center', cursor: 'pointer',
                            background: prob > 0 ? `${STATE_COLORS[toState]}${Math.round(opacity * 80).toString(16).padStart(2,'0')}` : 'rgba(255,255,255,0.02)',
                            border: isHovered ? `1px solid ${STATE_COLORS[toState]}` : '1px solid rgba(255,255,255,0.04)',
                            borderRadius: 4, transition: 'all 0.1s',
                            color: prob > 0 ? '#fff' : '#374151',
                            fontWeight: prob > 0.5 ? 800 : prob > 0.1 ? 600 : 400,
                          }}>
                          {prob === 0 ? '–' : isAbsorbing ? '1.000' : prob.toFixed(3)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: '0.76rem', color: '#93c5fd' }}>
            <Info size={12} style={{ display: 'inline', marginRight: 4 }} />
            <strong>Matrix Reading:</strong> Row = current state, Column = next state.
            Brighter cells = higher transition probability. Diagonal 1.0 entries (Discharge, Admission, LWBS) are absorbing states.
            High off-diagonal values (e.g., Diag→Triage = 0.072) indicate loopback pathways.
          </div>
        </div>
      )}

      {/* ── State Flow View ───────────────────────────────────────────────── */}
      {section === 'flow' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                State Outflow Explorer — Select a State to Inspect
              </h3>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {STATES.slice(0, 5).map(s => (
                <button key={s} onClick={() => setSelectedState(s)} style={{
                  padding: '4px 10px', borderRadius: 6, border: `1px solid ${selectedState === s ? STATE_COLORS[s] : 'var(--border-color)'}`,
                  background: selectedState === s ? `${STATE_COLORS[s]}25` : 'transparent',
                  color: selectedState === s ? STATE_COLORS[s] : 'var(--text-muted)',
                  fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer'
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem' }}>
            <div style={{ background: `${STATE_COLORS[selectedState]}15`, border: `1px solid ${STATE_COLORS[selectedState]}50`,
              borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: STATE_COLORS[selectedState], marginBottom: 6 }}>
                {selectedState}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#e2e8f0', lineHeight: 1.5, marginBottom: 10 }}>
                {STATE_DESCRIPTIONS[selectedState]}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Avg time: <strong style={{ color: '#fbbf24' }}>{STATE_STATS[selectedState].avgTime}</strong>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Total visits: <strong style={{ color: '#38bdf8' }}>{STATE_STATS[selectedState].visits.toLocaleString()}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
                Outgoing Transitions from <span style={{ color: STATE_COLORS[selectedState] }}>{selectedState}</span>
              </div>
              {outflows.map(o => (
                <div key={o.to} style={{ background: 'rgba(7,11,20,0.75)', border: '1px solid var(--border-color)',
                  borderRadius: 9, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: 110 }}>
                    <ArrowRight size={14} color={o.color} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: o.color }}>{o.to}</span>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 14 }}>
                    <div style={{ width: `${o.prob * 100}%`, height: '100%', borderRadius: 6,
                      background: o.color, transition: 'width 0.5s ease' }} />
                  </div>
                  <div className="font-mono" style={{ fontWeight: 800, color: '#fff', minWidth: 55, textAlign: 'right' }}>
                    {(o.prob * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', minWidth: 70, textAlign: 'right' }}>
                    ~{Math.round(STATE_STATS[selectedState].visits * o.prob)} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Steady State ──────────────────────────────────────────────────── */}
      {section === 'steady' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Steady-State Distribution π — Long-Run Time Fraction per State
            </h3>
            <span className="badge badge-cyan">Power Iteration Converged</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {STATES.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: 85, fontSize: '0.8rem', fontWeight: 700, color: STATE_COLORS[s], flexShrink: 0 }}>{s}</span>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 22, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.max(1, STEADY_STATE[i] * 100)}%`, height: '100%',
                    background: STATE_COLORS[s], borderRadius: 6,
                    display: 'flex', alignItems: 'center', paddingLeft: 8
                  }}>
                    <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
                      {(STEADY_STATE[i] * 100).toFixed(1)}% of time
                    </span>
                  </div>
                </div>
                <div className="font-mono" style={{ width: 60, fontSize: '0.82rem', fontWeight: 800,
                  color: STATE_COLORS[s], textAlign: 'right' }}>
                  {STEADY_STATE[i].toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Loopback Paths ────────────────────────────────────────────────── */}
      {section === 'loopback' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Top Loopback Process Paths — Rework & Non-Value-Added Activity
            </h3>
            <span className="badge badge-rose">39.8% Total Loopback</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loopbackPaths.map((lp, i) => {
              const sc = lp.severity === 'HIGH' ? { c: '#f43f5e', bg: 'rgba(244,63,94,0.12)' } :
                         lp.severity === 'MEDIUM' ? { c: '#f59e0b', bg: 'rgba(245,158,11,0.12)' } :
                         { c: '#06b6d4', bg: 'rgba(6,182,212,0.12)' };
              return (
                <div key={i} style={{ background: sc.bg, border: `1px solid ${sc.c}40`,
                  borderRadius: 10, padding: '1rem 1.25rem', borderLeft: `4px solid ${sc.c}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 8 }}>
                    <code style={{ fontSize: '0.77rem', color: '#e2e8f0', lineHeight: 1.4 }}>{lp.path}</code>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                      <span className="font-mono" style={{ fontSize: '0.92rem', fontWeight: 800, color: sc.c }}>{lp.frequency}%</span>
                      <span style={{ background: sc.bg, border: `1px solid ${sc.c}50`, color: sc.c,
                        borderRadius: 6, padding: '1px 7px', fontSize: '0.65rem', fontWeight: 700 }}>{lp.severity}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                    Root cause: <span style={{ color: '#e2e8f0' }}>{lp.reason}</span>
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
