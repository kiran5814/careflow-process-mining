import React, { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, Cell, ReferenceLine, ComposedChart
} from 'recharts';
import { TrendingUp, Brain, Zap, AlertTriangle, Clock } from 'lucide-react';

// ─── Synthetic ML Prediction Data ───────────────────────────────────────────
const FORECAST_DATA = [
  { day: 'Oct 24', actual: 42, predicted: 44, upper: 52, lower: 36 },
  { day: 'Oct 25', actual: 38, predicted: 37, upper: 44, lower: 30 },
  { day: 'Oct 26', actual: 55, predicted: 58, upper: 68, lower: 48 },
  { day: 'Oct 27', actual: 61, predicted: 60, upper: 71, lower: 49 },
  { day: 'Oct 28', actual: 48, predicted: 47, upper: 56, lower: 38 },
  { day: 'Oct 29', actual: 52, predicted: 53, upper: 62, lower: 44 },
  { day: 'Oct 30', actual: 39, predicted: 41, upper: 50, lower: 32 },
  { day: 'Oct 31', actual: null, predicted: 68, upper: 80, lower: 56 },
  { day: 'Nov 01', actual: null, predicted: 72, upper: 85, lower: 59 },
  { day: 'Nov 02', actual: null, predicted: 88, upper: 103, lower: 73 },
  { day: 'Nov 03', actual: null, predicted: 91, upper: 107, lower: 75 },
  { day: 'Nov 04', actual: null, predicted: 65, upper: 77, lower: 53 },
];

const READMISSION_RISK = [
  { group: 'ESI-1 + CHF', risk: 42, count: 18, color: '#f43f5e' },
  { group: 'ESI-2 Cardiac', risk: 31, count: 45, color: '#fb923c' },
  { group: 'ESI-3 + Diabetes', risk: 24, count: 120, color: '#eab308' },
  { group: 'ESI-3 Standard', risk: 14, count: 340, color: '#06b6d4' },
  { group: 'ESI-4 Minor', risk: 7, count: 210, color: '#10b981' },
  { group: 'ESI-5 Non-urgent', risk: 3, count: 59, color: '#8b5cf6' },
];

const LOS_FEATURES = [
  { feature: 'Morning Surge Hour', importance: 82, direction: 'positive' },
  { feature: 'Radiology Ordered', importance: 78, direction: 'positive' },
  { feature: 'Paper Requisition', importance: 73, direction: 'positive' },
  { feature: 'ESI Acuity Level', importance: 94, direction: 'positive' },
  { feature: 'Age > 65', importance: 61, direction: 'positive' },
  { feature: 'Comorbidity Count', importance: 58, direction: 'positive' },
  { feature: 'Fast-Track Protocol', importance: 52, direction: 'negative' },
  { feature: 'CPOE Digital Order', importance: 48, direction: 'negative' },
  { feature: 'Weekend Admission', importance: 44, direction: 'positive' },
  { feature: 'Nurse-Patient Ratio', importance: 38, direction: 'negative' },
].sort((a, b) => b.importance - a.importance);

const ANOMALY_EVENTS = [
  { time: 'Oct 26 09:14', metric: 'Radiology Wait Time', value: '94 min', threshold: '45 min', severity: 'CRITICAL', score: 3.8 },
  { time: 'Oct 27 14:32', metric: 'LWBS Rate', value: '8.2%', threshold: '3%', severity: 'HIGH', score: 2.9 },
  { time: 'Oct 28 07:55', metric: 'Triage-to-Doc Time', value: '68 min', threshold: '30 min', severity: 'HIGH', score: 2.6 },
  { time: 'Oct 29 11:20', metric: 'Shift Loopback Rate', value: '54%', threshold: '30%', severity: 'MEDIUM', score: 2.1 },
  { time: 'Oct 30 16:45', metric: 'Bed Occupancy', value: '97%', threshold: '85%', severity: 'MEDIUM', score: 1.8 },
];

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(11,18,33,0.97)', border: '1px solid #06b6d4',
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

export default function PredictiveAnalytics() {
  const [section, setSection] = useState('forecast');

  const modelKpis = [
    { label: 'LOS Prediction MAE', value: '18.4 min', color: '#06b6d4', Icon: Clock },
    { label: 'Volume Forecast MAPE', value: '6.2%', color: '#10b981', Icon: TrendingUp },
    { label: 'Readmission AUC-ROC', value: '0.847', color: '#8b5cf6', Icon: Brain },
    { label: 'Anomaly Precision', value: '91.3%', color: '#f59e0b', Icon: Zap },
  ];

  const tabs = [
    { id: 'forecast', label: '📈 Volume Forecast' },
    { id: 'readmission', label: '🔁 Readmission Risk' },
    { id: 'importance', label: '🧠 Feature Importance' },
    { id: 'anomaly', label: '⚡ Anomaly Detection' },
  ];

  const severityStyle = (s) => {
    if (s === 'CRITICAL') return { bg: 'rgba(244,63,94,0.18)', border: 'rgba(244,63,94,0.4)', color: '#fb7185' };
    if (s === 'HIGH') return { bg: 'rgba(249,115,22,0.18)', border: 'rgba(249,115,22,0.4)', color: '#fb923c' };
    return { bg: 'rgba(234,179,8,0.18)', border: 'rgba(234,179,8,0.4)', color: '#facc15' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>

      {/* ── Header Panel ─────────────────────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', padding: 9,
              borderRadius: 11, boxShadow: '0 0 18px rgba(139,92,246,0.45)' }}>
              <Brain size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                ML Predictive Analytics Engine
              </h2>
              <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0 }}>
                ARIMA / XGBoost / Isolation Forest · Time-series · Risk stratification · SHAP explanations
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3, background: 'rgba(7,11,20,0.75)',
            padding: 3, borderRadius: 8, border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setSection(t.id)} style={{
                padding: '5px 11px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: section === t.id ? 'rgba(139,92,246,0.3)' : 'transparent',
                color: section === t.id ? '#c084fc' : 'var(--text-muted)',
                fontSize: '0.72rem', fontWeight: section === t.id ? 700 : 500,
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Model KPI Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(175px,1fr))', gap: '0.75rem' }}>
          {modelKpis.map(({ label, value, color, Icon }) => (
            <div key={label} style={{ background: 'rgba(7,11,20,0.7)', padding: '0.85rem 1rem',
              borderRadius: 10, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: `${color}20`, padding: 8, borderRadius: 8, color }}>
                <Icon size={16} />
              </div>
              <div>
                <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{value}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Volume Forecast ───────────────────────────────────────────────── */}
      {section === 'forecast' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                7-Day ED Volume Forecast — ARIMA + XGBoost Ensemble
              </h3>
              <span className="badge badge-cyan">Next 4 Days Predicted</span>
            </div>
            <p style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', margin: 0 }}>
              Shaded confidence bands show 90% prediction interval. Historical actuals vs model prediction overlay.
            </p>
          </div>
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={FORECAST_DATA} margin={{ top: 10, right: 20, left: -5, bottom: 0 }}>
                <defs>
                  <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} unit=" pts" />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                <Area dataKey="upper" name="Upper 90% CI" stroke="none" fill="url(#predGrad)" legendType="none" />
                <Area dataKey="lower" name="Lower 90% CI" stroke="none" fill="#070b14" legendType="none" />
                <Line dataKey="predicted" name="Predicted Volume" stroke="#8b5cf6" strokeWidth={2.5}
                  strokeDasharray="6 3" dot={{ r: 3, fill: '#8b5cf6' }} />
                <Line dataKey="actual" name="Actual Volume" stroke="#06b6d4" strokeWidth={3}
                  dot={{ r: 4, fill: '#06b6d4' }} connectNulls={false} />
                <ReferenceLine x="Oct 30" stroke="rgba(255,255,255,0.25)" strokeDasharray="5 5"
                  label={{ value: 'Today', fill: '#94a3b8', fontSize: 10, position: 'insideTopLeft' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, fontSize: '0.76rem', color: '#c4b5fd' }}>
            🧠 <strong>ML Insight:</strong> Nov 2–3 weekend surge predicted at 88–91 patients/day (+43% above weekday baseline, σ=2.4).
            Recommendation: Pre-schedule additional radiology tech on Saturday morning shift.
          </div>
        </div>
      )}

      {/* ── Readmission Risk ──────────────────────────────────────────────── */}
      {section === 'readmission' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                30-Day Readmission Risk Stratification — Logistic Regression + Random Forest
              </h3>
              <span className="badge badge-rose">Patient Safety</span>
            </div>
            <p style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', margin: 0 }}>
              Predicted probability by patient cohort. Groups above CMS 20% threshold flagged for proactive discharge care planning.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={READMISSION_RISK} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={10} unit="%" domain={[0, 55]} />
                  <YAxis type="category" dataKey="group" stroke="#64748b" fontSize={10} width={130} />
                  <Tooltip content={<DarkTooltip />} />
                  <ReferenceLine x={20} stroke="#f59e0b" strokeDasharray="4 4"
                    label={{ value: 'CMS 20%', fill: '#f59e0b', fontSize: 10 }} />
                  <Bar dataKey="risk" name="Readmission Risk %" radius={[0, 6, 6, 0]}>
                    {READMISSION_RISK.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', justifyContent: 'center' }}>
              {READMISSION_RISK.map(r => (
                <div key={r.group} style={{ background: `${r.color}12`, border: `1px solid ${r.color}40`,
                  borderRadius: 10, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{r.group}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{r.count} patients</div>
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: r.color }}>{r.risk}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Feature Importance ────────────────────────────────────────────── */}
      {section === 'importance' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                XGBoost SHAP Feature Importance — Length-of-Stay Prediction Model
              </h3>
              <span className="badge badge-purple">Explainable AI</span>
            </div>
            <p style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', margin: 0 }}>
              SHAP values quantify each clinical variable's directional contribution to prolonged ED stays.
              Red = increases LOS, Green = reduces LOS.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {LOS_FEATURES.map((f) => (
              <div key={f.feature} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 185, fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 500, textAlign: 'right', flexShrink: 0 }}>
                  {f.feature}
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 26, overflow: 'hidden' }}>
                  <div style={{
                    width: `${f.importance}%`, height: '100%', borderRadius: 6,
                    background: f.direction === 'positive' ? 'linear-gradient(90deg,#f43f5e90,#fb923c)' : 'linear-gradient(90deg,#10b98190,#06b6d4)',
                    display: 'flex', alignItems: 'center', paddingLeft: 10, gap: 6
                  }}>
                    <span style={{ fontSize: '0.67rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
                      {f.direction === 'positive' ? '▲ +LOS' : '▼ -LOS'} (SHAP {f.importance})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, fontSize: '0.76rem', color: '#c4b5fd' }}>
            🔍 <strong>Actionable:</strong> "ESI Acuity Level" (94) and "Morning Surge" (82) are the top LOS drivers.
            "Paper Requisition" (73) is the top controllable factor — addressable via CPOE implementation.
          </div>
        </div>
      )}

      {/* ── Anomaly Detection ─────────────────────────────────────────────── */}
      {section === 'anomaly' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Statistical Anomaly Detection — Isolation Forest (Threshold: Z-score ≥ 1.8σ)
              </h3>
              <span className="badge badge-amber">Auto-Alert</span>
            </div>
            <p style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', margin: 0 }}>
              Real-time multivariate outlier detection across 14 operational KPI streams. Auto-escalation on score ≥ 2.5σ.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ANOMALY_EVENTS.map((ev, i) => {
              const sc = severityStyle(ev.severity);
              const borderColor = ev.severity === 'CRITICAL' ? '#f43f5e' : ev.severity === 'HIGH' ? '#fb923c' : '#eab308';
              return (
                <div key={i} style={{ background: 'rgba(7,11,20,0.75)', border: '1px solid var(--border-color)',
                  borderLeft: `4px solid ${borderColor}`, borderRadius: 10, padding: '0.85rem 1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <AlertTriangle size={18} color={borderColor} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{ev.metric}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ev.time}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {[['Observed', ev.value, '#f43f5e'], ['Threshold', ev.threshold, '#34d399'], ['σ Score', `${ev.score}σ`, '#fbbf24']].map(([lbl, val, col]) => (
                      <div key={lbl} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{lbl}</div>
                        <div className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 800, color: col }}>{val}</div>
                      </div>
                    ))}
                    <span style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color,
                      borderRadius: 6, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700 }}>
                      {ev.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
            {[
              { label: 'Events This Week', value: '5', color: '#f59e0b' },
              { label: 'Auto-Escalated', value: '2', color: '#f43f5e' },
              { label: 'Resolved', value: '3', color: '#10b981' },
            ].map(k => (
              <div key={k.label} style={{ background: 'rgba(7,11,20,0.7)', padding: '0.75rem 1rem',
                borderRadius: 10, border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
