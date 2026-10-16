import React, { useState } from 'react';
import { 
  ArrowRight, Download, Share2
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { 
  RESOURCE_HANDOVERS, HANDOVER_DEPARTMENTS 
} from '../data/processData';

export default function ResourceHandoverNetwork() {
  const [selectedDeptId, setSelectedDeptId] = useState('all');

  const filteredHandovers = selectedDeptId === 'all'
    ? RESOURCE_HANDOVERS
    : RESOURCE_HANDOVERS.filter(h => {
        const d = HANDOVER_DEPARTMENTS.find(dept => dept.id === selectedDeptId);
        if (!d) return true;
        return h.fromRole.includes(d.name.split(' ')[0]) || h.toRole.includes(d.name.split(' ')[0]);
      });

  const handleExportCsv = () => {
    const headers = ["From Role", "To Role", "From Department", "To Department", "Volume", "Avg Latency (Min)", "Surge Latency (Min)", "Friction Level", "Channel", "Root Cause", "Protocol Remediation"];
    const rows = RESOURCE_HANDOVERS.map(h => [
      `"${h.fromRole}"`,
      `"${h.toRole}"`,
      `"${h.fromDept}"`,
      `"${h.toDept}"`,
      h.volume,
      h.avgLatencyMin,
      h.surgeLatencyMin,
      `"${h.frictionLevel}"`,
      `"${h.handoffChannel}"`,
      `"${h.frictionRootCause}"`,
      `"${h.remediationProtocol}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CareFlow_Resource_Handover_Network_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = RESOURCE_HANDOVERS.map(h => ({
    name: `${h.fromRole.split(' ')[0]} → ${h.toRole.split(' ')[0]}`,
    normal: h.avgLatencyMin,
    surge: h.surgeLatencyMin,
    friction: h.frictionLevel
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '380px', height: '100%',
          background: 'radial-gradient(ellipse at top right, rgba(6,182,212,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(139,92,246,0.25))',
                border: '1px solid rgba(6,182,212,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee'
              }}>
                <Share2 size={20} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                Inter-Departmental Resource Handover & Social Network Mining
              </h2>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                Organizational Mining
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '820px', lineHeight: 1.5, margin: 0 }}>
              Analyzes handover-of-work communication channels, inter-departmental latencies, and clinical handover friction 
              between triage nurses, emergency physicians, radiologists, and inpatient ward teams.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 14px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)',
              color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Download size={14} /> Export Handover Register (CSV)
          </button>
        </div>
      </div>

      {/* Clinical Department Nodes Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        <button
          onClick={() => setSelectedDeptId('all')}
          style={{
            padding: '1.1rem', borderRadius: '12px', textAlign: 'left',
            background: selectedDeptId === 'all' ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-card)',
            border: selectedDeptId === 'all' ? '1px solid #06b6d4' : '1px solid var(--border-color)',
            cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Overview</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
            All 5 Departments
          </div>
          <span style={{ fontSize: '0.72rem', color: '#22d3ee' }}>5 Key Handover Channels</span>
        </button>

        {HANDOVER_DEPARTMENTS.map(d => {
          const isSelected = selectedDeptId === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDeptId(d.id)}
              style={{
                padding: '1.1rem', borderRadius: '12px', textAlign: 'left',
                background: isSelected ? `${d.color}25` : 'var(--bg-card)',
                border: isSelected ? `1px solid ${d.color}` : '1px solid var(--border-color)',
                cursor: 'pointer', transition: 'all 0.2s',
                borderTop: `3px solid ${d.color}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {d.staffCount} Staff Roster
                </span>
                <span style={{ fontSize: '0.7rem', color: d.color, fontWeight: 700 }}>Avg: {d.avgDelay}</span>
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
                {d.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>Out: {d.handoversOut}</span>
                <span>In: {d.handoversIn}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Handover Friction Matrix Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Care Team Handover-of-Work Channels & Bottleneck Analysis
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Identifies communication latency and information loss during inter-role patient transitions
            </span>
          </div>
          <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
            {filteredHandovers.length} Monitored Routes
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'rgba(10, 16, 30, 0.7)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Clinical Handover Route</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Volume</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Normal vs. Surge Latency</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Friction Level</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Information Channel</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Identified Root Bottleneck & Fix</th>
              </tr>
            </thead>
            <tbody>
              {filteredHandovers.map((h, i) => {
                const isCrit = h.frictionLevel === 'Critical';
                const isHigh = h.frictionLevel === 'High';
                const frictionColor = isCrit ? '#f43f5e' : isHigh ? '#f59e0b' : '#10b981';

                return (
                  <tr
                    key={i}
                    style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#fff' }}>
                        <span>{h.fromRole}</span>
                        <ArrowRight size={13} color="#38bdf8" />
                        <span>{h.toRole}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {h.fromDept} → {h.toDept}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                      <span style={{ fontWeight: 700, color: '#f8fafc' }}>{h.volume}</span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>cases</div>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontWeight: 700, color: '#38bdf8' }}>{h.avgLatencyMin}m</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>norm</span>
                        <span style={{ color: 'var(--text-muted)' }}>/</span>
                        <span style={{ fontWeight: 800, color: '#f43f5e' }}>{h.surgeLatencyMin}m</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>surge</span>
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                      <span style={{
                        fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px',
                        background: `${frictionColor}20`, color: frictionColor, fontWeight: 700
                      }}>
                        {h.frictionLevel}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                      <div style={{ color: '#cbd5e1' }}>{h.handoffChannel}</div>
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'top', maxWidth: '340px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#fda4af', marginBottom: '3px' }}>
                        <strong>Bottleneck: </strong>{h.frictionRootCause}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#34d399' }}>
                        <strong>Protocol: </strong>{h.remediationProtocol}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Normal vs Surge Latency Comparison Chart */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Normal vs. Peak Surge Handover Latency (Minutes)
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Handovers to Radiology and Inpatient Bed Placement double during morning emergency intake surges
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', background: '#06b6d4', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Normal Latency</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', background: '#f43f5e', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Surge Latency</span>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-10} textAnchor="end" height={35} />
              <YAxis stroke="#64748b" fontSize={11} unit="m" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(10, 16, 30, 0.95)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px', fontSize: '0.75rem'
                }}
              />
              <Bar dataKey="normal" fill="#06b6d4" name="Normal Latency" radius={[4, 4, 0, 0]} />
              <Bar dataKey="surge" fill="#f43f5e" name="Surge Latency" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
