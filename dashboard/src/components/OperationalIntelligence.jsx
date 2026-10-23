import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, Cell, RadialBarChart, RadialBar,
  PieChart, Pie, LineChart, Line
} from 'recharts';
import { TrendingDown, DollarSign, Users, Clock, Target, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────
const DEPT_EFFICIENCY = [
  { dept: 'Radiology', utilisation: 62, throughput: 58, idle: 38, satisfaction: 3.1, cost: 142400 },
  { dept: 'Triage Nursing', utilisation: 84, throughput: 91, idle: 16, satisfaction: 4.2, cost: 88600 },
  { dept: 'ED Physicians', utilisation: 88, throughput: 89, idle: 12, satisfaction: 4.5, cost: 312000 },
  { dept: 'Pathology Lab', utilisation: 71, throughput: 74, idle: 29, satisfaction: 3.8, cost: 76400 },
  { dept: 'Bed Management', utilisation: 79, throughput: 69, idle: 21, satisfaction: 3.4, cost: 54000 },
  { dept: 'Registration', utilisation: 91, throughput: 94, idle: 9, satisfaction: 4.1, cost: 36200 },
];

const COST_BREAKDOWN = [
  { category: 'Paperwork Re-Triage OT', cost: 58400, recapturable: 55400, color: '#f43f5e' },
  { category: 'Radiology Overtime', cost: 38600, recapturable: 32000, color: '#fb923c' },
  { category: 'Specialist Delay Fees', cost: 24800, recapturable: 18000, color: '#eab308' },
  { category: 'Bed Boarding Penalty', cost: 12800, recapturable: 9200, color: '#8b5cf6' },
  { category: 'Admin Redundancy', cost: 7800, recapturable: 6400, color: '#06b6d4' },
];

const MONTHLY_ROI = [
  { month: 'Jan', waste: 11800, saved: 0, baseline: 11800 },
  { month: 'Feb', waste: 10900, saved: 900, baseline: 11800 },
  { month: 'Mar', waste: 10200, saved: 1600, baseline: 11800 },
  { month: 'Apr', waste: 9600, saved: 2200, baseline: 11800 },
  { month: 'May', waste: 8800, saved: 3000, baseline: 11800 },
  { month: 'Jun', waste: 7900, saved: 3900, baseline: 11800 },
  { month: 'Jul', waste: 7100, saved: 4700, baseline: 11800 },
  { month: 'Aug', waste: 6400, saved: 5400, baseline: 11800 },
  { month: 'Sep', waste: 5800, saved: 6000, baseline: 11800 },
  { month: 'Oct', waste: 5100, saved: 6700, baseline: 11800 },
  { month: 'Nov (proj)', waste: 4500, saved: 7300, baseline: 11800 },
  { month: 'Dec (proj)', waste: 3900, saved: 7900, baseline: 11800 },
];

const STAFF_EFFICIENCY = [
  { name: 'Dr. Sharma', role: 'Attending', cases: 214, avgMin: 22, compliance: 96.2, efficiency: 92 },
  { name: 'Dr. Reddy', role: 'Attending', cases: 208, avgMin: 25, compliance: 95.1, efficiency: 88 },
  { name: 'Dr. Patel', role: 'Chair', cases: 217, avgMin: 19, compliance: 97.4, efficiency: 96 },
  { name: 'Dr. Khan', role: 'Resident', cases: 189, avgMin: 34, compliance: 93.8, efficiency: 74 },
  { name: 'Dr. Joshi', role: 'Fellow', cases: 172, avgMin: 38, compliance: 91.5, efficiency: 68 },
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
          <strong>{typeof p.value === 'number' && p.value > 1000 ? `$${p.value.toLocaleString()}` : p.value}
            {p.unit || ''}</strong>
        </div>
      ))}
    </div>
  );
};

export default function OperationalIntelligence() {
  const [section, setSection] = useState('dept');
  const [sortKey, setSortKey] = useState('efficiency');

  const totalWaste = COST_BREAKDOWN.reduce((a, c) => a + c.cost, 0);
  const totalRecapturable = COST_BREAKDOWN.reduce((a, c) => a + c.recapturable, 0);

  const sortedStaff = useMemo(() =>
    [...STAFF_EFFICIENCY].sort((a, b) => b[sortKey] - a[sortKey]),
    [sortKey]
  );

  const tabs = [
    { id: 'dept', label: '🏥 Department KPIs' },
    { id: 'cost', label: '💰 Cost Analytics' },
    { id: 'roi', label: '📈 ROI Tracker' },
    { id: 'staff', label: '👥 Staff Performance' },
  ];

  const topKpis = [
    { label: 'Total Annual Waste', value: `$${(totalWaste/1000).toFixed(0)}K`, delta: '-12%', dir: 'down', good: true, color: '#f43f5e' },
    { label: 'Recapturable Revenue', value: `$${(totalRecapturable/1000).toFixed(0)}K`, delta: '+8.4%', dir: 'up', good: true, color: '#10b981' },
    { label: 'Avg Department Util.', value: `${Math.round(DEPT_EFFICIENCY.reduce((a,c)=>a+c.utilisation,0)/DEPT_EFFICIENCY.length)}%`, delta: '+3.1%', dir: 'up', good: true, color: '#06b6d4' },
    { label: 'CPOE ROI (Year 1)', value: '+394%', delta: '$118K net', dir: 'up', good: true, color: '#8b5cf6' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)', padding: 9,
              borderRadius: 11, boxShadow: '0 0 18px rgba(16,185,129,0.4)' }}>
              <DollarSign size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Operational Intelligence & Cost Analytics
              </h2>
              <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0 }}>
                Department KPI benchmarking · Waste attribution · ROI tracking · Staff efficiency scoring
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3, background: 'rgba(7,11,20,0.75)',
            padding: 3, borderRadius: 8, border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setSection(t.id)} style={{
                padding: '5px 11px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: section === t.id ? 'rgba(16,185,129,0.3)' : 'transparent',
                color: section === t.id ? '#34d399' : 'var(--text-muted)',
                fontSize: '0.72rem', fontWeight: section === t.id ? 700 : 500,
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Top KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '0.75rem' }}>
          {topKpis.map(k => (
            <div key={k.label} style={{ background: 'rgba(7,11,20,0.7)', padding: '0.85rem 1rem',
              borderRadius: 10, border: `1px solid ${k.color}30` }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{k.label}</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>{k.value}</div>
              <div style={{ fontSize: '0.72rem', color: k.good ? '#34d399' : '#f43f5e', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                {k.dir === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {k.delta}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Department KPIs ───────────────────────────────────────────────── */}
      {section === 'dept' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Department Utilisation, Throughput & Satisfaction Matrix
            </h3>
            <span className="badge badge-cyan">6 Departments</span>
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPT_EFFICIENCY} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                <XAxis dataKey="dept" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="%" />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                <Bar dataKey="utilisation" name="Utilisation %" fill="#06b6d4" radius={[4,4,0,0]} />
                <Bar dataKey="throughput" name="Throughput %" fill="#10b981" radius={[4,4,0,0]} />
                <Bar dataKey="idle" name="Idle Time %" fill="#f43f5e" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.75rem', marginTop: '1rem' }}>
            {DEPT_EFFICIENCY.map(d => (
              <div key={d.dept} style={{ background: 'rgba(7,11,20,0.7)', padding: '0.85rem', borderRadius: 10,
                border: `1px solid ${d.utilisation < 70 ? '#f43f5e40' : '#33415540'}`,
                borderLeft: `4px solid ${d.utilisation < 70 ? '#f43f5e' : d.utilisation >= 85 ? '#10b981' : '#f59e0b'}` }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{d.dept}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.74rem' }}>
                  <span style={{ color: '#06b6d4' }}>{d.utilisation}% util</span>
                  <span style={{ color: '#fbbf24' }}>★ {d.satisfaction}/5</span>
                  <span style={{ color: '#f43f5e' }}>${(d.cost/1000).toFixed(0)}K cost</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Cost Analytics ────────────────────────────────────────────────── */}
      {section === 'cost' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Annual Waste Attribution & Recapturable Revenue Analysis
              </h3>
              <p style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Quantified operational losses vs digitalization-recapturable amount per category.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Total Waste / Recapturable</div>
              <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                <span style={{ color: '#f43f5e' }}>${(totalWaste/1000).toFixed(0)}K</span>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}> / </span>
                <span style={{ color: '#10b981' }}>${(totalRecapturable/1000).toFixed(0)}K</span>
              </div>
            </div>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COST_BREAKDOWN} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                <XAxis dataKey="category" stroke="#64748b" fontSize={9.5} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                <Bar dataKey="cost" name="Total Cost ($)" fill="#f43f5e" radius={[4,4,0,0]} />
                <Bar dataKey="recapturable" name="Recapturable ($)" fill="#10b981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
            {COST_BREAKDOWN.map(c => (
              <div key={c.category} style={{ background: 'rgba(7,11,20,0.7)', padding: '0.75rem 1rem',
                borderRadius: 10, border: '1px solid var(--border-color)', borderLeft: `4px solid ${c.color}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>{c.category}</div>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
                  <span style={{ color: '#f43f5e' }}>Cost: <strong>${c.cost.toLocaleString()}</strong></span>
                  <span style={{ color: '#10b981' }}>Recapturable: <strong>${c.recapturable.toLocaleString()}</strong></span>
                  <span style={{ color: '#fbbf24' }}>Recovery: <strong>{Math.round(c.recapturable/c.cost*100)}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ROI Tracker ───────────────────────────────────────────────────── */}
      {section === 'roi' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              12-Month CPOE Digitalization ROI Trajectory
            </h3>
            <span className="badge badge-amber">394% Net ROI</span>
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_ROI} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={9.5} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                <Line dataKey="baseline" name="Pre-CPOE Baseline" stroke="#64748b" strokeDasharray="6 3" strokeWidth={2} dot={false} />
                <Line dataKey="waste" name="Remaining Waste" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3, fill: '#f43f5e' }} />
                <Line dataKey="saved" name="Monthly Savings" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginTop: '1rem' }}>
            {[
              { label: 'CAPEX Investment', value: '$24,000', color: '#64748b' },
              { label: 'Year 1 Net Savings', value: '$118,400', color: '#10b981' },
              { label: 'Payback Period', value: '2.4 months', color: '#06b6d4' },
            ].map(k => (
              <div key={k.label} style={{ background: 'rgba(7,11,20,0.7)', padding: '1rem',
                borderRadius: 10, border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Staff Performance ─────────────────────────────────────────────── */}
      {section === 'staff' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Physician Efficiency Scorecard — Multidimensional KPI Ranking
              </h3>
              <span className="badge badge-cyan">5 Clinicians</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['efficiency', 'cases', 'compliance'].map(k => (
                <button key={k} onClick={() => setSortKey(k)} style={{
                  padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: sortKey === k ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.05)',
                  color: sortKey === k ? '#22d3ee' : 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600
                }}>Sort: {k.charAt(0).toUpperCase()+k.slice(1)}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sortedStaff.map((s, i) => (
              <div key={s.name} style={{ background: 'rgba(7,11,20,0.75)', border: '1px solid var(--border-color)',
                borderRadius: 10, padding: '1rem 1.25rem', display: 'grid',
                gridTemplateColumns: '180px 1fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#fff' }}>
                      #{i+1}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{s.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{s.role}</div>
                    </div>
                  </div>
                </div>
                {[
                  { label: 'Cases', value: s.cases, unit: '', color: '#38bdf8' },
                  { label: 'Avg Consult', value: `${s.avgMin}m`, unit: '', color: '#a78bfa' },
                  { label: 'Compliance', value: `${s.compliance}%`, unit: '', color: '#34d399' },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.label}</div>
                    <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: m.color }}>{m.value}</div>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                    Efficiency Score
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 20, position: 'relative' }}>
                    <div style={{
                      width: `${s.efficiency}%`, height: '100%', borderRadius: 6,
                      background: s.efficiency >= 90 ? 'linear-gradient(90deg,#10b981,#06b6d4)' :
                                  s.efficiency >= 75 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' :
                                  'linear-gradient(90deg,#f43f5e,#fb923c)',
                    }} />
                    <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                      fontSize: '0.65rem', fontWeight: 800, color: '#fff' }}>{s.efficiency}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
