import React, { useState } from 'react';
import { 
  Flame, Clock, Stethoscope, AlertTriangle, TrendingUp, BarChart2, 
  Filter, Users, ArrowUpRight, Zap, CheckCircle2, ShieldAlert, Sparkles 
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ReferenceLine, BarChart 
} from 'recharts';
import { HOURLY_METRICS, DOCTORS_DATA } from '../data/processData';

// Custom Tooltip for Hourly Congestion
function CustomHourlyTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(11, 18, 33, 0.95)',
        border: `1px solid ${data.rush ? '#f43f5e' : '#06b6d4'}`,
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        color: '#fff',
        fontSize: '0.75rem',
        minWidth: '190px'
      }}>
        <div style={{ fontWeight: 800, color: data.rush ? '#fb7185' : '#38bdf8', marginBottom: '6px' }}>
          Hour: {data.hour} {data.rush && '⚠️ PEAK SURGE'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Patient Arrivals:</span>
          <strong style={{ color: '#fff' }}>{data.arrivals} patients/hr</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span style={{ color: 'var(--text-secondary)' }}>X-Ray Queue Delay:</span>
          <strong style={{ color: data.rush ? '#fb7185' : '#fbbf24' }}>{data.xrayWait} min</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Triage Wait:</span>
          <strong style={{ color: '#34d399' }}>{data.triageWait} min</strong>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px', marginTop: '4px', fontSize: '0.69rem', color: data.rush ? '#fca5a5' : 'var(--text-muted)' }}>
          {data.rush ? 'Single-technician capacity deficit' : 'Off-peak normal operation'}
        </div>
      </div>
    );
  }
  return null;
}

export default function BottleneckAnalytics() {
  const [chartMode, setChartMode] = useState('combined'); // 'combined', 'arrivals', 'wait'
  const [docSort, setDocSort] = useState('cases'); // 'cases', 'speed', 'satisfaction'
  const [staffingMode, setStaffingMode] = useState('current'); // 'current', 'optimized'

  const maxCases = Math.max(...DOCTORS_DATA.map(d => d.casesHandled));

  const sortedDoctors = [...DOCTORS_DATA].sort((a, b) => {
    if (docSort === 'cases') return b.casesHandled - a.casesHandled;
    if (docSort === 'speed') return parseInt(a.avgConsultTime) - parseInt(b.avgConsultTime);
    if (docSort === 'satisfaction') return parseInt(b.satisfaction) - parseInt(a.satisfaction);
    return 0;
  });

  // Recharts data for hourly metrics with optional staffing simulation
  const hourlyData = HOURLY_METRICS.map(h => {
    const isMorning = parseInt(h.hour.split(':')[0]) >= 8 && parseInt(h.hour.split(':')[0]) <= 11;
    return {
      ...h,
      // If optimized staffing is toggled, reduce wait from 54-65m down to 21-26m
      displayWait: staffingMode === 'optimized' && isMorning ? Math.round(h.xrayWait * 0.42) : h.xrayWait,
      slaThreshold: 30
    };
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
      
      {/* Chart 1: Hourly Arrival vs Radiology Wait Spike (Recharts Engine) */}
      <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.15rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                Hourly Surge & Radiology Congestion Curve
              </h3>
              <span className="badge badge-rose">Peak 08:00 - 11:00 AM</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Dual-axis Recharts telemetry comparing arrival volume vs X-Ray diagnostic queue delay.
            </p>
          </div>

          {/* Controls: Shift Simulation & View */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStaffingMode(staffingMode === 'current' ? 'optimized' : 'current')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '6px',
                border: staffingMode === 'optimized' ? '1px solid #10b981' : '1px solid var(--border-color)',
                background: staffingMode === 'optimized' ? 'rgba(16,185,129,0.2)' : 'rgba(10,16,30,0.6)',
                color: staffingMode === 'optimized' ? '#34d399' : 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={12} />
              {staffingMode === 'optimized' ? 'Simulated Staggered Shift (Active)' : 'Simulate Shift Rebalance'}
            </button>

            <div style={{ display: 'flex', gap: '2px', background: 'rgba(10, 16, 30, 0.6)', padding: '2px', borderRadius: '7px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setChartMode('combined')}
                style={{
                  padding: '3px 8px', borderRadius: '5px', border: 'none',
                  background: chartMode === 'combined' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                  color: chartMode === 'combined' ? '#22d3ee' : 'var(--text-secondary)',
                  fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Dual
              </button>
              <button
                onClick={() => setChartMode('arrivals')}
                style={{
                  padding: '3px 8px', borderRadius: '5px', border: 'none',
                  background: chartMode === 'arrivals' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                  color: chartMode === 'arrivals' ? '#38bdf8' : 'var(--text-secondary)',
                  fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Arrivals
              </button>
              <button
                onClick={() => setChartMode('wait')}
                style={{
                  padding: '3px 8px', borderRadius: '5px', border: 'none',
                  background: chartMode === 'wait' ? 'rgba(244, 63, 94, 0.25)' : 'transparent',
                  color: chartMode === 'wait' ? '#fb7185' : 'var(--text-secondary)',
                  fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Wait
              </button>
            </div>
          </div>
        </div>

        {/* Recharts ComposedChart */}
        <div style={{ width: '100%', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={hourlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} />
              
              <YAxis yAxisId="left" stroke="#38bdf8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 120]} />
              <YAxis yAxisId="right" orientation="right" stroke="#fb7185" fontSize={10} tickLine={false} axisLine={false} unit="m" domain={[0, 80]} />
              
              <Tooltip content={<CustomHourlyTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              
              <ReferenceLine yAxisId="right" y={30} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: '30m SLA', fill: '#f59e0b', fontSize: 10 }} />

              {(chartMode === 'combined' || chartMode === 'arrivals') && (
                <Bar yAxisId="left" dataKey="arrivals" name="Patient Arrivals/Hr" fill="#0284c7" radius={[3, 3, 0, 0]} opacity={0.85} />
              )}

              {(chartMode === 'combined' || chartMode === 'wait') && (
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="displayWait" 
                  name={staffingMode === 'optimized' ? 'Optimized X-Ray Wait (min)' : 'Actual X-Ray Queue Wait (min)'} 
                  stroke={staffingMode === 'optimized' ? '#10b981' : '#f43f5e'} 
                  strokeWidth={3} 
                  dot={{ r: 3, fill: staffingMode === 'optimized' ? '#10b981' : '#f43f5e' }}
                  activeDot={{ r: 6 }} 
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Context Strip */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          background: staffingMode === 'optimized' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(10, 16, 30, 0.6)',
          border: `1px solid ${staffingMode === 'optimized' ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-color)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Status: </span>
            {staffingMode === 'optimized' ? (
              <strong style={{ color: '#34d399' }}>Shift Staggered: 2 Technicians on duty 08-11 AM (Queue dropped by 58%)</strong>
            ) : (
              <strong style={{ color: '#fb7185' }}>Single-Technician Bottleneck: 54m peak wait (+237% delay)</strong>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span>Peak Hour: <strong style={{ color: '#38bdf8' }}>09:00 AM (102 arrivals)</strong></span>
            <span>Excess Waiting: <strong style={{ color: '#f59e0b' }}>+48 min</strong></span>
          </div>
        </div>
      </div>

      {/* Chart 2: Resource & Clinician Performance */}
      <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.15rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                Attending Physicians Distribution & Speed
              </h3>
              <span className="badge badge-cyan">5 ER Clinicians</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Caseload balance, consult duration, and admission parity across physician shifts.
            </p>
          </div>

          {/* Doctor sort toggle */}
          <div style={{ display: 'flex', gap: '3px', background: 'rgba(10, 16, 30, 0.6)', padding: '2px', borderRadius: '7px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setDocSort('cases')}
              style={{
                padding: '4px 8px', borderRadius: '5px', border: 'none',
                background: docSort === 'cases' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                color: docSort === 'cases' ? '#22d3ee' : 'var(--text-secondary)',
                fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Cases
            </button>
            <button
              onClick={() => setDocSort('speed')}
              style={{
                padding: '4px 8px', borderRadius: '5px', border: 'none',
                background: docSort === 'speed' ? 'rgba(129, 140, 248, 0.25)' : 'transparent',
                color: docSort === 'speed' ? '#a5b4fc' : 'var(--text-secondary)',
                fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Speed
            </button>
            <button
              onClick={() => setDocSort('satisfaction')}
              style={{
                padding: '4px 8px', borderRadius: '5px', border: 'none',
                background: docSort === 'satisfaction' ? 'rgba(52, 211, 153, 0.25)' : 'transparent',
                color: docSort === 'satisfaction' ? '#34d399' : 'var(--text-secondary)',
                fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              CSAT Rating
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedDoctors.map((doc) => (
            <div
              key={doc.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(17, 26, 48, 0.5)',
                border: '1px solid var(--border-color)',
                fontSize: '0.82rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(6,182,212,0.2))',
                  color: '#a5b4fc', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0
                }}>
                  {doc.name.split(' ')[1]?.[0] || doc.name[0] || 'D'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h5 style={{ fontWeight: 700, color: '#fff', margin: 0 }}>{doc.name}</h5>
                  <div style={{ marginTop: '4px' }}>
                    <div className="progress-track" style={{ width: '100%', maxWidth: '120px' }}>
                      <div className="progress-fill" style={{
                        width: `${(doc.casesHandled / maxCases) * 100}%`,
                        background: 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {doc.casesHandled} cases ({((doc.casesHandled/1000)*100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', textAlign: 'right', flexShrink: 0 }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Avg Consult</div>
                  <div className="font-mono" style={{ fontWeight: 700, color: '#38bdf8' }}>{doc.avgConsultTime}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Admit Rate</div>
                  <div className="font-mono" style={{ fontWeight: 700, color: '#fbbf24' }}>{doc.admitRate}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Satisfaction</div>
                  <div className="font-mono" style={{ fontWeight: 700, color: '#34d399' }}>{doc.satisfaction}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
