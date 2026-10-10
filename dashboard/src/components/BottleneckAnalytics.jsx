import React, { useState } from 'react';
import { Flame, Clock, Stethoscope, AlertTriangle, TrendingUp, BarChart2 } from 'lucide-react';
import { HOURLY_METRICS, DOCTORS_DATA } from '../data/processData';

export default function BottleneckAnalytics() {
  const [selectedHour, setSelectedHour] = useState(HOURLY_METRICS[9]); // 09:00 AM (Peak Rush)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
      {/* Chart 1: Hourly Arrival vs Radiology Wait Spike */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                Hourly Rush & Radiology Wait Spike
              </h3>
              <span className="badge badge-rose">Peak 8 - 11 AM</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Arrival volume vs X-Ray wait time. Note the critical morning queue accumulation.
            </p>
          </div>
          <Flame size={20} color="#f43f5e" />
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
            const heightPercent = (item.arrivals / 102) * 100;
            const waitHeightPercent = (item.xrayWait / 65) * 100;

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
                {/* Secondary wait indicator marker */}
                <div style={{
                  position: 'absolute',
                  bottom: `${Math.min(waitHeightPercent, 95)}%`,
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isRush ? '#f43f5e' : '#f59e0b',
                  boxShadow: isRush ? '0 0 6px #f43f5e' : 'none',
                  zIndex: 2
                }} />

                {/* Primary volume bar */}
                <div style={{
                  width: '100%',
                  height: `${heightPercent}%`,
                  borderRadius: '4px 4px 1px 1px',
                  background: isRush 
                    ? 'linear-gradient(180deg, #f43f5e 0%, rgba(244, 63, 94, 0.4) 100%)' 
                    : isSelected 
                      ? '#38bdf8' 
                      : 'linear-gradient(180deg, #0ea5e9 0%, rgba(14, 165, 233, 0.25) 100%)',
                  transition: 'all 0.2s ease',
                  border: isSelected ? '1px solid #fff' : 'none'
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
            fontSize: '0.8rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Selected Slot: </span>
              <strong style={{ color: '#fff' }}>{selectedHour.hour}</strong>
              {selectedHour.rush && <span className="badge badge-rose" style={{ marginLeft: '6px', fontSize: '0.65rem' }}>Morning Rush</span>}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span>Arrivals: <strong style={{ color: '#38bdf8' }}>{selectedHour.arrivals}</strong></span>
              <span>X-Ray Wait: <strong style={{ color: selectedHour.rush ? '#f43f5e' : '#fbbf24' }}>{selectedHour.xrayWait} min</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Resource & Clinician Performance */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                Attending Physicians Distribution
              </h3>
              <span className="badge badge-cyan">5 ER Physicians</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Workload balance and consult durations across ER doctor shifts.
            </p>
          </div>
          <Stethoscope size={20} color="#06b6d4" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {DOCTORS_DATA.map((doc) => (
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
                fontSize: '0.82rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#a5b4fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem'
                }}>
                  {doc.name.split(' ')[1][0]}
                </div>
                <div>
                  <h5 style={{ fontWeight: 600, color: '#fff', margin: 0 }}>{doc.name}</h5>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {doc.casesHandled} cases handled ({Math.round(doc.casesHandled / 10)}% load)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', textAlign: 'right' }}>
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
