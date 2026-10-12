import React, { useState } from 'react';
import { Flame, Clock, Stethoscope, AlertTriangle, TrendingUp, BarChart2, Filter, Users, ArrowUpRight } from 'lucide-react';
import { HOURLY_METRICS, DOCTORS_DATA } from '../data/processData';

export default function BottleneckAnalytics() {
  const [selectedHour, setSelectedHour] = useState(HOURLY_METRICS[9]);
  const [chartMode, setChartMode] = useState('combined'); // 'combined', 'arrivals', 'wait'
  const [docSort, setDocSort] = useState('cases'); // 'cases', 'speed', 'satisfaction'

  const maxCases = Math.max(...DOCTORS_DATA.map(d => d.casesHandled));

  const sortedDoctors = [...DOCTORS_DATA].sort((a, b) => {
    if (docSort === 'cases') return b.casesHandled - a.casesHandled;
    if (docSort === 'speed') return parseInt(a.avgConsultTime) - parseInt(b.avgConsultTime);
    if (docSort === 'satisfaction') return parseInt(b.satisfaction) - parseInt(a.satisfaction);
    return 0;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
      
      {/* Chart 1: Hourly Arrival vs Radiology Wait Spike */}
      <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                Hourly Rush & Radiology Wait Spike
              </h3>
              <span className="badge badge-rose">Peak 8 - 11 AM</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Arrival volume vs X-Ray wait time. Note the critical morning queue accumulation.
            </p>
          </div>

          {/* Chart mode toggle */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(10, 16, 30, 0.6)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setChartMode('combined')}
              style={{
                padding: '4px 8px',
                borderRadius: '5px',
                border: 'none',
                background: chartMode === 'combined' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                color: chartMode === 'combined' ? '#22d3ee' : 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Dual View
            </button>
            <button
              onClick={() => setChartMode('arrivals')}
              style={{
                padding: '4px 8px',
                borderRadius: '5px',
                border: 'none',
                background: chartMode === 'arrivals' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                color: chartMode === 'arrivals' ? '#38bdf8' : 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Arrivals
            </button>
            <button
              onClick={() => setChartMode('wait')}
              style={{
                padding: '4px 8px',
                borderRadius: '5px',
                border: 'none',
                background: chartMode === 'wait' ? 'rgba(244, 63, 94, 0.25)' : 'transparent',
                color: chartMode === 'wait' ? '#fb7185' : 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Wait Times
            </button>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '5px',
          height: '190px',
          padding: '10px 0 25px 0',
          position: 'relative',
          borderBottom: '1px solid var(--border-color)'
        }}>
          {HOURLY_METRICS.map((item) => {
            const isRush = item.rush;
            const isSelected = selectedHour?.hour === item.hour;
            const arrivalsHeight = (item.arrivals / 102) * 100;
            const waitHeight = (item.xrayWait / 65) * 100;

            const primaryHeight = chartMode === 'wait' ? waitHeight : arrivalsHeight;

            return (
              <div
                key={item.hour}
                onClick={() => setSelectedHour(item)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                title={`${item.hour}: ${item.arrivals} arrivals, ${item.xrayWait}m X-ray wait`}
              >
                {/* Secondary wait indicator marker in combined mode */}
                {chartMode === 'combined' && (
                  <div style={{
                    position: 'absolute',
                    bottom: `${Math.min(waitHeight, 95)}%`,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isRush ? '#f43f5e' : '#f59e0b',
                    boxShadow: isRush ? '0 0 6px #f43f5e' : 'none',
                    zIndex: 2,
                    transition: 'bottom 0.4s ease'
                  }} />
                )}

                {/* Primary volume bar */}
                <div style={{
                  width: '100%',
                  height: `${primaryHeight}%`,
                  borderRadius: '4px 4px 1px 1px',
                  background: isRush 
                    ? 'linear-gradient(180deg, #f43f5e 0%, rgba(244, 63, 94, 0.4) 100%)' 
                    : isSelected 
                      ? '#38bdf8' 
                      : chartMode === 'wait'
                        ? 'linear-gradient(180deg, #f59e0b 0%, rgba(245, 158, 11, 0.25) 100%)'
                        : 'linear-gradient(180deg, #0ea5e9 0%, rgba(14, 165, 233, 0.25) 100%)',
                  transition: 'height 0.3s ease, background 0.2s ease',
                  border: isSelected ? '1px solid #fff' : 'none',
                  animation: `barGrow 0.6s ${item.hour.split(':')[0] * 0.025}s cubic-bezier(0.4,0,0.2,1) both`
                }} />

                {/* Hour label for selected key hours */}
                {['00:00', '06:00', '09:00', '12:00', '18:00', '22:00'].includes(item.hour) && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-20px',
                    fontSize: '0.65rem',
                    color: isRush ? '#fb7185' : 'var(--text-muted)',
                    fontWeight: isRush ? 700 : 400
                  }}>
                    {item.hour.split(':')[0]}h
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Hour Details */}
        {selectedHour && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: 'rgba(10, 16, 30, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Selected Slot: </span>
              <strong style={{ color: '#fff' }}>{selectedHour.hour}</strong>
              {selectedHour.rush && <span className="badge badge-rose" style={{ marginLeft: '6px', fontSize: '0.65rem' }}>Morning Rush Surge</span>}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span>Arrivals: <strong style={{ color: '#38bdf8' }}>{selectedHour.arrivals} pts</strong></span>
              <span>X-Ray Wait: <strong style={{ color: selectedHour.rush ? '#f43f5e' : '#fbbf24' }}>{selectedHour.xrayWait} min</strong></span>
              <span>Triage Wait: <strong style={{ color: '#34d399' }}>{selectedHour.triageWait} min</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Resource & Clinician Performance */}
      <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                Attending Physicians Distribution
              </h3>
              <span className="badge badge-cyan">5 ER Clinicians</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Workload balance and consult durations across ER doctor shifts.
            </p>
          </div>

          {/* Doctor sort toggle */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(10, 16, 30, 0.6)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setDocSort('cases')}
              style={{
                padding: '4px 8px',
                borderRadius: '5px',
                border: 'none',
                background: docSort === 'cases' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                color: docSort === 'cases' ? '#22d3ee' : 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cases
            </button>
            <button
              onClick={() => setDocSort('speed')}
              style={{
                padding: '4px 8px',
                borderRadius: '5px',
                border: 'none',
                background: docSort === 'speed' ? 'rgba(129, 140, 248, 0.25)' : 'transparent',
                color: docSort === 'speed' ? '#a5b4fc' : 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Speed
            </button>
            <button
              onClick={() => setDocSort('satisfaction')}
              style={{
                padding: '4px 8px',
                borderRadius: '5px',
                border: 'none',
                background: docSort === 'satisfaction' ? 'rgba(52, 211, 153, 0.25)' : 'transparent',
                color: docSort === 'satisfaction' ? '#34d399' : 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Rating
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
                  {doc.name.split(' ')[1][0]}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h5 style={{ fontWeight: 600, color: '#fff', margin: 0 }}>{doc.name}</h5>
                  <div style={{ marginTop: '4px' }}>
                    <div className="progress-track" style={{ width: '100%', maxWidth: '120px' }}>
                      <div className="progress-fill" style={{
                        width: `${(doc.casesHandled / maxCases) * 100}%`,
                        background: doc.casesHandled === maxCases
                          ? 'linear-gradient(90deg, #f43f5e, #f59e0b)'
                          : 'linear-gradient(90deg, #3b82f6, #06b6d4)'
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
                  <div style={{ fontWeight: 600, color: '#38bdf8' }}>{doc.avgConsultTime}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Admit Rate</div>
                  <div style={{ fontWeight: 600, color: '#fbbf24' }}>{doc.admitRate}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Satisfaction</div>
                  <div style={{ fontWeight: 600, color: '#34d399' }}>{doc.satisfaction}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
