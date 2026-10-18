import React, { useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import { Users, Award, Clock, Activity, CheckCircle } from 'lucide-react';

const DOCTORS = [
  { name: 'Dr. Sharma', avgTimeMin: 22, volume: 214, compliance: 96.2, loopbackShare: 18, color: '#06b6d4', role: 'Attending Physician', specialty: 'Emergency Medicine' },
  { name: 'Dr. Reddy', avgTimeMin: 25, volume: 208, compliance: 95.1, loopbackShare: 19, color: '#10b981', role: 'Attending Physician', specialty: 'Trauma Surgery' },
  { name: 'Dr. Khan', avgTimeMin: 34, volume: 189, compliance: 93.8, loopbackShare: 24, color: '#8b5cf6', role: 'Senior Resident', specialty: 'Internal Medicine' },
  { name: 'Dr. Patel', avgTimeMin: 19, volume: 217, compliance: 97.4, loopbackShare: 11, color: '#ec4899', role: 'Department Chair', specialty: 'Emergency Medicine' },
  { name: 'Dr. Joshi', avgTimeMin: 38, volume: 172, compliance: 91.5, loopbackShare: 28, color: '#f59e0b', role: 'Clinical Fellow', specialty: 'Cardiology' }
];

export default function DoctorScatter() {
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0]);

  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(11, 18, 33, 0.96)',
          border: `1.5px solid ${data.color}`,
          borderRadius: '10px',
          padding: '10px 14px',
          color: '#fff',
          fontSize: '0.75rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          minWidth: '200px'
        }}>
          <div style={{ fontWeight: 800, color: data.color, marginBottom: '2px' }}>
            {data.name} ({data.role})
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.68rem', marginBottom: '6px' }}>
            {data.specialty}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Avg Consult Duration:</span>
              <strong style={{ color: '#fff' }}>{data.avgTimeMin} min</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Caseload:</span>
              <strong style={{ color: '#fff' }}>{data.volume} cases</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Protocol Compliance:</span>
              <strong style={{ color: '#34d399' }}>{data.compliance}%</strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
              Physician Efficiency & Caseload Scatter Quadrants
            </h3>
            <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Award size={12} /> Clinical Velocity Matrix
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Correlation of physician consultation duration vs total managed patient cohort, benchmarked against departmental median thresholds.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.74rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#06b6d4' }} />
            <span style={{ color: 'var(--text-muted)' }}>Attending</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6' }} />
            <span style={{ color: 'var(--text-muted)' }}>Resident</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ color: 'var(--text-muted)' }}>Fellow</span>
          </div>
        </div>
      </div>

      {/* Recharts Scatter Chart */}
      <div style={{ width: '100%', height: '320px', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              type="number"
              dataKey="avgTimeMin"
              name="Consultation Time"
              unit="m"
              domain={[15, 45]}
              stroke="#64748b"
              fontSize={11}
              label={{ value: 'Avg Consultation Duration (Minutes)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="volume"
              name="Patient Volume"
              domain={[160, 230]}
              stroke="#64748b"
              fontSize={11}
              label={{ value: 'Cohort Volume (Cases)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
            />
            <ZAxis type="number" dataKey="compliance" range={[180, 500]} />
            <Tooltip content={<CustomScatterTooltip />} />
            
            {/* Median Reference Dividers */}
            <ReferenceLine x={28} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
            <ReferenceLine y={200} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />

            <Scatter name="Physicians" data={DOCTORS} onClick={(point) => setSelectedDoctor(point)}>
              {DOCTORS.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={selectedDoctor?.name === entry.name ? 2.5 : 1}
                  style={{
                    filter: selectedDoctor?.name === entry.name ? `drop-shadow(0 0 10px ${entry.color})` : 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant Watermark Labels */}
        <div style={{ position: 'absolute', top: '25px', left: '70px', fontSize: '0.68rem', color: 'rgba(52, 211, 153, 0.5)', fontWeight: 700, pointerEvents: 'none' }}>
          ⭐ High Volume • Fast Turnaround
        </div>
        <div style={{ position: 'absolute', top: '25px', right: '40px', fontSize: '0.68rem', color: 'rgba(56, 189, 248, 0.5)', fontWeight: 700, pointerEvents: 'none' }}>
          🔬 High Volume • Thorough Workup
        </div>
        <div style={{ position: 'absolute', bottom: '45px', left: '70px', fontSize: '0.68rem', color: 'rgba(148, 163, 184, 0.4)', fontWeight: 700, pointerEvents: 'none' }}>
          ⚡ Moderate Volume • Fast
        </div>
        <div style={{ position: 'absolute', bottom: '45px', right: '40px', fontSize: '0.68rem', color: 'rgba(244, 63, 94, 0.5)', fontWeight: 700, pointerEvents: 'none' }}>
          ⚠️ High Duration • Lower Volume
        </div>
      </div>

      {/* Doctor Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        marginTop: '1.25rem'
      }}>
        {DOCTORS.map(doc => {
          const isSelected = selectedDoctor?.name === doc.name;
          return (
            <div
              key={doc.name}
              onClick={() => setSelectedDoctor(doc)}
              style={{
                background: isSelected ? 'rgba(255,255,255,0.06)' : 'rgba(7, 11, 20, 0.65)',
                border: isSelected ? `1.5px solid ${doc.color}` : '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: doc.color }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>{doc.name}</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{doc.role}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginTop: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Avg: {doc.avgTimeMin}m</span>
                <span style={{ color: doc.color, fontWeight: 700 }}>{doc.volume} cases</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
