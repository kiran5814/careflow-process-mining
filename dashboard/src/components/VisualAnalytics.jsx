import React, { useState } from 'react';
import { 
  BarChart2, TrendingUp, Clock, AlertTriangle, 
  Users, ShieldCheck, Stethoscope, DollarSign, Calendar, Filter, 
  Download, ArrowUpRight, ArrowDownRight, Layers, HelpCircle, CheckCircle2, 
  Flame, PieChart as PieIcon, Activity, Sparkles, Sliders, ChevronDown
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ReferenceLine, ComposedChart
} from 'recharts';
import { 
  ACUITY_DISTRIBUTION, DISPOSITION_DISTRIBUTION, DELAY_ATTRIBUTION, 
  REWORK_REASONS, DOCTORS_DATA, HOURLY_METRICS, SUMMARY_STATS,
  THIRTY_DAY_TRENDS, STEP_TIME_BREAKDOWN, PATIENT_FLOW_FUNNEL,
  DOCTOR_RADAR_DATA, FINANCIAL_IMPACT_BREAKDOWN
} from '../data/processData';

// Custom Recharts Dark Tooltip for Volume Trends
function CustomVolumeTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(11, 18, 33, 0.95)',
        border: '1px solid #06b6d4',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        color: '#fff',
        fontSize: '0.75rem',
        minWidth: '190px'
      }}>
        <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
          {data.date} (Rolling Window)
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Daily Patient Volume:</span>
          <strong style={{ color: '#fff' }}>{data.volume} patients</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Avg Dwell Time:</span>
          <strong style={{ color: '#a5b4fc' }}>{data.avgCycleHours} hrs</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Compliant Traces:</span>
          <strong style={{ color: '#34d399' }}>{data.compliant} ({Math.round(data.compliant / data.volume * 100)}%)</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Paperwork Rework:</span>
          <strong style={{ color: '#fb7185' }}>{data.rework} ({data.reworkRate}%)</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '4px', marginTop: '4px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Daily Operating Cost:</span>
          <strong style={{ color: '#fbbf24' }}>${data.costDollars.toLocaleString()}</strong>
        </div>
      </div>
    );
  }
  return null;
}

// Custom Tooltip for Wait Times
function CustomStepTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(11, 18, 33, 0.95)',
        border: '1px solid rgba(148, 163, 184, 0.25)',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        color: '#fff',
        fontSize: '0.75rem',
        minWidth: '180px'
      }}>
        <div style={{ fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
          {data.step}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span style={{ color: '#22d3ee' }}>Active Clinical Time:</span>
          <strong>{data.activeMin} min</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span style={{ color: '#fb7185' }}>Queue Waiting Delay:</span>
          <strong>{data.waitMin} min</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Total Dwell Duration:</span>
          <strong style={{ color: '#a5b4fc' }}>{data.totalMin} min</strong>
        </div>
        {data.isBottleneck && (
          <div style={{ color: '#fb7185', fontWeight: 700, marginTop: '4px', fontSize: '0.7rem' }}>
            ⚠️ Identified Core Bottleneck
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function VisualAnalytics() {
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'volume', 'delays', 'funnel', 'doctors', 'acuity'
  const [timeFilter, setTimeFilter] = useState('30d'); // '24h', '7d', '30d'
  const [trendMetric, setTrendMetric] = useState('volume'); // 'volume', 'cost', 'conformance'
  const [selectedDoctor, setSelectedDoctor] = useState('All');
  const [pieMode, setPieMode] = useState('acuity'); // 'acuity', 'disposition'

  // Export CSV handler
  const handleExportData = () => {
    let csvHeader = "Date,Volume,AvgCycleHours,ReworkRate,OperatingCost\n";
    let rows = THIRTY_DAY_TRENDS.map(t => `${t.date},${t.volume},${t.avgCycleHours},${t.reworkRate}%,$${t.costDollars}`).join("\n");
    const blob = new Blob([csvHeader + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareFlow_Visual_Analytics_${activeView}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      
      {/* ============================================================== */}
      {/* 1. TOP ANALYTICS COMMAND CONTROLS & TIME RANGE FILTER */}
      {/* ============================================================== */}
      <div className="glass-panel" style={{
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
            padding: '8px', borderRadius: '10px', color: '#fff',
            boxShadow: '0 0 16px rgba(6,182,212,0.4)'
          }}>
            <BarChart2 size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
              Advanced Visual Process Mining Intelligence
            </h2>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
              Interactive Recharts telemetry: Multi-cohort flow, capacity bottlenecks & financial attribution
            </div>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            background: 'rgba(7, 11, 20, 0.75)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            gap: '2px'
          }}>
            {[
              { id: 'overview', label: 'Overview Hub' },
              { id: 'volume',   label: '30D Volume & Cycle' },
              { id: 'delays',   label: 'Delays & Waterfall' },
              { id: 'funnel',   label: 'Patient Care Funnel' },
              { id: 'doctors',  label: 'Doctor Radar' },
              { id: 'acuity',   label: 'Acuity / Outcomes' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeView === tab.id ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                  color: activeView === tab.id ? '#22d3ee' : 'var(--text-secondary)',
                  fontSize: '0.74rem',
                  fontWeight: activeView === tab.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Timeframe Selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(7, 11, 20, 0.75)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            gap: '2px'
          }}>
            {[
              { id: '24h', label: '24H' },
              { id: '7d',  label: '7D' },
              { id: '30d', label: '30D' }
            ].map(tf => (
              <button
                key={tf.id}
                onClick={() => setTimeFilter(tf.id)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '5px',
                  border: 'none',
                  background: timeFilter === tf.id ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  color: timeFilter === tf.id ? '#a5b4fc' : 'var(--text-muted)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Download size={13} /> Export Data
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN SECTION: 30-DAY PATIENT VOLUME & CYCLE TIME DUAL TREND */}
      {/* ============================================================== */}
      {(activeView === 'overview' || activeView === 'volume') && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                  30-Day Cohort Volume, Lead Time & Conformance Trajectory
                </h3>
                <span className="badge badge-cyan">Recharts Area Engine</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Dual-axis correlation of patient intake volume vs average total clinical stay duration (hours).
              </p>
            </div>

            {/* Metric Mode Toggle */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(7, 11, 20, 0.7)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setTrendMetric('volume')}
                style={{
                  padding: '4px 10px', borderRadius: '5px', border: 'none',
                  background: trendMetric === 'volume' ? 'rgba(6,182,212,0.25)' : 'transparent',
                  color: trendMetric === 'volume' ? '#22d3ee' : 'var(--text-muted)',
                  fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Volume & Stay (hrs)
              </button>
              <button
                onClick={() => setTrendMetric('cost')}
                style={{
                  padding: '4px 10px', borderRadius: '5px', border: 'none',
                  background: trendMetric === 'cost' ? 'rgba(245,158,11,0.25)' : 'transparent',
                  color: trendMetric === 'cost' ? '#fbbf24' : 'var(--text-muted)',
                  fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Operating Cost ($)
              </button>
              <button
                onClick={() => setTrendMetric('conformance')}
                style={{
                  padding: '4px 10px', borderRadius: '5px', border: 'none',
                  background: trendMetric === 'conformance' ? 'rgba(16,185,129,0.25)' : 'transparent',
                  color: trendMetric === 'conformance' ? '#34d399' : 'var(--text-muted)',
                  fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Conformance Fitness (%)
              </button>
            </div>
          </div>

          {/* Recharts Area / Line Chart */}
          <div style={{ width: '100%', height: '320px', minHeight: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={THIRTY_DAY_TRENDS} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                
                {trendMetric === 'volume' && (
                  <>
                    <YAxis yAxisId="left" stroke="#06b6d4" fontSize={11} tickLine={false} axisLine={false} domain={[20, 50]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#818cf8" fontSize={11} tickLine={false} axisLine={false} domain={[2.5, 5.0]} unit="h" />
                    <Tooltip content={<CustomVolumeTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area yAxisId="left" type="monotone" dataKey="volume" name="Daily Patient Volume" stroke="#06b6d4" fill="url(#volGrad)" strokeWidth={2.5} />
                    <Line yAxisId="right" type="monotone" dataKey="avgCycleHours" name="Avg Cycle Stay (Hours)" stroke="#818cf8" strokeWidth={3} dot={{ r: 3, fill: '#818cf8' }} activeDot={{ r: 6 }} />
                  </>
                )}

                {trendMetric === 'cost' && (
                  <>
                    <YAxis yAxisId="left" stroke="#f59e0b" fontSize={11} tickLine={false} axisLine={false} unit="$" />
                    <YAxis yAxisId="right" orientation="right" stroke="#fb7185" fontSize={11} tickLine={false} axisLine={false} unit="%" domain={[25, 55]} />
                    <Tooltip content={<CustomVolumeTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area yAxisId="left" type="monotone" dataKey="costDollars" name="Daily Cost ($)" stroke="#f59e0b" fill="url(#costGrad)" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="reworkRate" name="Loopback Rework Rate (%)" stroke="#fb7185" strokeWidth={2.5} dot={{ r: 3 }} />
                  </>
                )}

                {trendMetric === 'conformance' && (
                  <>
                    <YAxis yAxisId="left" stroke="#10b981" fontSize={11} tickLine={false} axisLine={false} domain={[88, 100]} unit="%" />
                    <Tooltip content={<CustomVolumeTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="conformancePct" name="Token Replay Conformance (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#10b981' }} />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
            marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', fontSize: '0.76rem', color: 'var(--text-muted)'
          }}>
            <span>Correlation: Patient volume spikes on Mon/Fri directly coincide with +45 min stay dilation.</span>
            <span style={{ color: '#06b6d4', fontWeight: 600 }}>R² Correlation Coefficient = 0.82 (High Congestion Sensitivity)</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. ROW 2: ACTIVITY TIME WATERFALL & PATIENT FLOW FUNNEL */}
      {/* ============================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
        
        {/* Chart A: Active Execution Time vs Queue Wait Delay (Recharts BarChart) */}
        {(activeView === 'overview' || activeView === 'delays') && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    Activity Execution Time vs Queue Wait Delay
                  </h3>
                  <span className="badge badge-rose">Wait Time Forensic</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Separating value-add medical care from non-value-add waiting room dwell time.
                </p>
              </div>
            </div>

            <div style={{ width: '100%', height: '270px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={STEP_TIME_BREAKDOWN} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                  <XAxis dataKey="step" stroke="#64748b" fontSize={10} tickLine={false} angle={-20} textAnchor="end" />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} unit="m" />
                  <Tooltip content={<CustomStepTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="activeMin" name="Active Clinical Care (min)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="waitMin" name="Queue Wait Delay (min)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              marginTop: '0.75rem',
              fontSize: '0.74rem',
              color: '#fca5a5'
            }}>
              🚨 <strong>Radiology queue (42m)</strong> and <strong>Doctor Consult wait (24m)</strong> represent <strong>66.6%</strong> of all idle waiting waste across the clinical pathway.
            </div>
          </div>
        )}

        {/* Chart B: Patient Journey Stage Funnel (Ecommerce Waterfall paradigm) */}
        {(activeView === 'overview' || activeView === 'funnel') && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    Patient Care Conversion & Drop-off Funnel
                  </h3>
                  <span className="badge badge-purple">Ecommerce Paradigm</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Clinical stage progression modeled as an operational checkout funnel.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PATIENT_FLOW_FUNNEL.map((f, idx) => {
                const widthPct = f.conversionPct;
                const barColor = 
                  idx === 0 ? '#38bdf8' :
                  idx === 1 ? '#06b6d4' :
                  idx === 2 ? (f.dropPct > 3 ? '#f59e0b' : '#14b8a6') :
                  idx === 3 ? '#818cf8' :
                  idx === 4 ? '#a855f7' :
                  idx === 5 ? '#3b82f6' : '#10b981';

                return (
                  <div key={f.stage} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem' }}>
                      <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{f.stage}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <strong style={{ color: '#fff' }}>{f.count.toLocaleString()} cases</strong>
                        <span style={{ color: 'var(--text-muted)' }}>({f.conversionPct}%)</span>
                      </div>
                    </div>
                    
                    <div style={{
                      height: '18px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${widthPct}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${barColor}90, ${barColor})`,
                        borderRadius: '4px',
                        transition: 'width 0.8s ease'
                      }} />
                    </div>

                    <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{f.status}</span>
                      {f.dropPct > 0 && <span style={{ color: '#fb7185' }}>-{f.dropPct}% bypass/variance</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 4. ROW 3: DOCTOR PERFORMANCE RADAR & ACUITY/DISPOSITION DONUTS */}
      {/* ============================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
        
        {/* Doctor Multi-Dimensional Radar Comparison */}
        {(activeView === 'overview' || activeView === 'doctors') && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    Physician Practice Parity & Radar Evaluation
                  </h3>
                  <span className="badge badge-cyan">5 Attending MDs</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Multi-axial evaluation of consult velocity, patient satisfaction, and conformance adherence.
                </p>
              </div>

              {/* Doctor Selector */}
              <div style={{ display: 'flex', gap: '3px', background: 'rgba(7, 11, 20, 0.7)', padding: '2px', borderRadius: '7px', border: '1px solid var(--border-color)' }}>
                {['All', 'Dr. Sharma', 'Dr. Reddy', 'Dr. Khan', 'Dr. Patel'].map(doc => (
                  <button
                    key={doc}
                    onClick={() => setSelectedDoctor(doc)}
                    style={{
                      padding: '3px 7px',
                      borderRadius: '5px',
                      border: 'none',
                      background: selectedDoctor === doc ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                      color: selectedDoctor === doc ? '#a5b4fc' : 'var(--text-muted)',
                      fontSize: '0.69rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {doc.replace('Dr. ', '')}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="75%" data={DOCTOR_RADAR_DATA}>
                  <PolarGrid stroke="rgba(148, 163, 184, 0.15)" />
                  <PolarAngleAxis dataKey="dimension" stroke="#94a3b8" fontSize={10} />
                  <PolarRadiusAxis stroke="rgba(148, 163, 184, 0.2)" fontSize={9} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#0d1424', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  
                  {(selectedDoctor === 'All' || selectedDoctor === 'Dr. Sharma') && (
                    <Radar name="Dr. Sharma" dataKey="Dr. Sharma" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} />
                  )}
                  {(selectedDoctor === 'All' || selectedDoctor === 'Dr. Reddy') && (
                    <Radar name="Dr. Reddy" dataKey="Dr. Reddy" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                  )}
                  {(selectedDoctor === 'All' || selectedDoctor === 'Dr. Khan') && (
                    <Radar name="Dr. Khan" dataKey="Dr. Khan" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
                  )}
                  {(selectedDoctor === 'All' || selectedDoctor === 'Dr. Patel') && (
                    <Radar name="Dr. Patel" dataKey="Dr. Patel" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                  )}
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <span>High Clinical Balance: 95.2% Gini Parity across attending clinicians.</span>
              <strong style={{ color: '#10b981' }}>Top CSAT: Dr. Patel (97%)</strong>
            </div>
          </div>
        )}

        {/* Acuity / Outcomes Pie / Donut Breakdown */}
        {(activeView === 'overview' || activeView === 'acuity') && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    {pieMode === 'acuity' ? 'Clinical Acuity Distribution (ESI 1-5)' : 'Final Disposition & Discharge Outcomes'}
                  </h3>
                  <span className="badge badge-indigo">Cohort Breakdown</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Stratification by patient triage triage severity and eventual bed allocation.
                </p>
              </div>

              {/* Mode Toggle */}
              <div style={{ display: 'flex', gap: '3px', background: 'rgba(7, 11, 20, 0.7)', padding: '2px', borderRadius: '7px', border: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => setPieMode('acuity')}
                  style={{
                    padding: '3px 8px', borderRadius: '5px', border: 'none',
                    background: pieMode === 'acuity' ? 'rgba(6,182,212,0.25)' : 'transparent',
                    color: pieMode === 'acuity' ? '#22d3ee' : 'var(--text-muted)',
                    fontSize: '0.71rem', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Acuity (ESI)
                </button>
                <button
                  onClick={() => setPieMode('disposition')}
                  style={{
                    padding: '3px 8px', borderRadius: '5px', border: 'none',
                    background: pieMode === 'disposition' ? 'rgba(99,102,241,0.25)' : 'transparent',
                    color: pieMode === 'disposition' ? '#a5b4fc' : 'var(--text-muted)',
                    fontSize: '0.71rem', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Dispositions
                </button>
              </div>
            </div>

            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ background: '#0d1424', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                    formatter={(val, name, entry) => [`${val} cases (${entry.payload.percentage}%)`, name]}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} 
                  />
                  {pieMode === 'acuity' ? (
                    <Pie
                      data={ACUITY_DISTRIBUTION}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="46%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {ACUITY_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(7,11,20,0.8)" strokeWidth={2} />
                      ))}
                    </Pie>
                  ) : (
                    <Pie
                      data={DISPOSITION_DISTRIBUTION}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="46%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {DISPOSITION_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(7,11,20,0.8)" strokeWidth={2} />
                      ))}
                    </Pie>
                  )}
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              {(pieMode === 'acuity' ? ACUITY_DISTRIBUTION : DISPOSITION_DISTRIBUTION).map(item => (
                <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.65rem', color: item.color, fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>
                    {item.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 5. ROW 4: FINANCIAL WASTE ATTRIBUTION & CPOE ROI CALCULATOR */}
      {/* ============================================================== */}
      {(activeView === 'overview' || activeView === 'volume') && (
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(13,20,36,0.95) 0%, rgba(17,26,48,0.7) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                  Annual Financial Waste & CPOE Digitalization ROI Breakdown
                </h3>
                <span className="badge badge-amber">$142,400 Recapturable</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Quantified direct operational losses attributed to paper requisition re-triage loops, rush overtime, and consult delays.
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Net Year 1 ROI</div>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
                +$118,400 Net
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981' }}>394% Return on $24,000 CAPEX</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {FINANCIAL_IMPACT_BREAKDOWN.map(item => (
              <div key={item.category} style={{
                background: 'rgba(10, 16, 30, 0.65)',
                border: `1px solid ${item.color}35`,
                borderRadius: '10px',
                padding: '1rem',
                borderLeft: `4px solid ${item.color}`
              }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                  {item.category}
                </div>
                <div className="font-mono" style={{ fontSize: '1.45rem', fontWeight: 800, color: item.color }}>
                  ${item.amount.toLocaleString()}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>{item.percentage}% of Total Waste</span>
                  <span>{item.cases} Affected Cases</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
