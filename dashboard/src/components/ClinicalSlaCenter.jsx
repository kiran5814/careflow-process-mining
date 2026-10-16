import React, { useState, useEffect } from 'react';
import { 
  Bell, Clock, CheckCircle2, Zap, Download, Send
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { 
  CLINICAL_SLA_SUMMARY, LIVE_SLA_PATIENTS, HOURLY_SLA_TREND 
} from '../data/processData';

export default function ClinicalSlaCenter() {
  const [patients] = useState(LIVE_SLA_PATIENTS);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [escalatedIds, setEscalatedIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);
  const [, setLiveSeconds] = useState(0);

  // Live countdown tick every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds(s => s + 1);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3600);
  };

  const handleEscalate = (patient) => {
    setEscalatedIds(prev => new Set(prev).add(patient.id));
    triggerToast(`🚨 Escalation Triggered for ${patient.id} (${patient.patientName}): ${patient.remediationAction}`);
  };

  const handleExportSlaCsv = () => {
    const headers = ["Case ID", "Patient Name", "Age", "Gender", "Acuity ESI", "SLA Measure", "Target (Min)", "Elapsed (Min)", "Remaining (Min)", "Status", "Location", "Assigned MD", "Escalation Action"];
    const rows = patients.map(p => [
      `"${p.id}"`,
      `"${p.patientName}"`,
      p.age,
      `"${p.gender}"`,
      `"${p.esi}"`,
      `"${p.slaType}"`,
      p.targetMinutes,
      p.elapsedMinutes,
      p.remainingMinutes,
      `"${p.status}"`,
      `"${p.location}"`,
      `"${p.assignedMD}"`,
      `"${p.remediationAction}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CareFlow_SLA_Escalation_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPatients = filterStatus === 'ALL'
    ? patients
    : patients.filter(p => {
        if (filterStatus === 'BREACH') return p.status === 'Critical Breach';
        if (filterStatus === 'IMMINENT') return p.status === 'Imminent (< 10m)';
        if (filterStatus === 'AT_RISK') return p.status === 'At Risk';
        if (filterStatus === 'ON_TRACK') return p.status === 'On Track';
        return true;
      });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          background: 'linear-gradient(135deg, rgba(244,63,94,0.95), rgba(185,28,28,0.95))',
          color: '#fff', padding: '12px 18px', borderRadius: '10px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600
        }}>
          <Bell size={18} />
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '350px', height: '100%',
          background: 'radial-gradient(ellipse at top right, rgba(244,63,94,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(244,63,94,0.25), rgba(245,158,11,0.25))',
                border: '1px solid rgba(244,63,94,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185'
              }}>
                <Clock size={20} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                Clinical SLA & Rapid-Response Escalation Command Center
              </h2>
              <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                <span className="live-dot" /> Live Breach Monitor
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '820px', lineHeight: 1.5, margin: 0 }}>
              Real-time surveillance of clinical pathway Service Level Agreements (SLAs) across 
              <strong> Door-to-Doctor</strong>, <strong> Door-to-ECG</strong>, <strong> STAT Radiology</strong>, and 
              <strong> Inpatient ED Boarding</strong> with automated rapid-response escalation workflows.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(10, 16, 30, 0.65)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '10px', padding: '8px 12px', textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.68rem', color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>Overall Compliance</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{CLINICAL_SLA_SUMMARY.overallComplianceRate}%</div>
            </div>

            <div style={{
              background: 'rgba(10, 16, 30, 0.65)', border: '1px solid rgba(244,63,94,0.3)',
              borderRadius: '10px', padding: '8px 12px', textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.68rem', color: '#fda4af', textTransform: 'uppercase', fontWeight: 700 }}>Active Breaches</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f43f5e' }}>{CLINICAL_SLA_SUMMARY.criticalBreaches} Patients</div>
            </div>

            <div style={{
              background: 'rgba(10, 16, 30, 0.65)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '10px', padding: '8px 12px', textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.68rem', color: '#fde68a', textTransform: 'uppercase', fontWeight: 700 }}>Imminent (&lt; 10m)</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>{CLINICAL_SLA_SUMMARY.imminentBreachCount} Patients</div>
            </div>

            <button
              onClick={handleExportSlaCsv}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 14px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)',
                color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Download size={14} /> Export Audit (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* SLA Core Measures Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1rem' }}>
        {CLINICAL_SLA_SUMMARY.slaMeasures.map((m) => {
          const isBreached = m.status === 'Breached';
          const isAtRisk = m.status === 'At-Risk';

          const statusColor = isBreached ? '#f43f5e' : isAtRisk ? '#f59e0b' : '#10b981';
          const statusBg = isBreached ? 'rgba(244,63,94,0.15)' : isAtRisk ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)';

          return (
            <div
              key={m.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderTop: `3px solid ${statusColor}`,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                    {m.id}
                  </span>
                  <span style={{
                    fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px',
                    background: statusBg, color: statusColor, fontWeight: 700
                  }}>
                    {m.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', margin: '0 0 6px 0' }}>
                  {m.name}
                </h4>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                  {m.description}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Target: <strong style={{ color: '#fff' }}>{m.target}</strong></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Current: <strong style={{ color: statusColor }}>{m.currentAvg}</strong></span>
                </div>

                {/* Compliance Progress Bar */}
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${m.compliancePct}%`, height: '100%',
                    background: statusColor, borderRadius: '999px'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>Compliance Adherence</span>
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>{m.compliancePct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Patient Countdown & Escalation Console */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Live Patient SLA Breach Countdown & Escalation Queue
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Active in-flight patients in risk of breaching CMS clinical throughput standards. Click action to page team.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Cases (6)' },
              { id: 'BREACH', label: 'Critical Breaches (2)', color: '#f43f5e' },
              { id: 'IMMINENT', label: 'Imminent < 10m (2)', color: '#f59e0b' },
              { id: 'AT_RISK', label: 'At Risk (1)', color: '#8b5cf6' },
              { id: 'ON_TRACK', label: 'On Track (1)', color: '#10b981' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                style={{
                  padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                  border: filterStatus === f.id ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                  background: filterStatus === f.id ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.03)',
                  color: filterStatus === f.id ? '#22d3ee' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'rgba(10, 16, 30, 0.7)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Patient & Case ID</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Acuity (ESI)</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>SLA Benchmark</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Elapsed / Target</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Countdown Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Location & MD</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Rapid Escalation Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(pt => {
                const isBreached = pt.status === 'Critical Breach';
                const isImminent = pt.status === 'Imminent (< 10m)';
                const isEscalated = escalatedIds.has(pt.id);

                const statusColor = isBreached ? '#f43f5e' : isImminent ? '#f59e0b' : pt.status === 'At Risk' ? '#8b5cf6' : '#10b981';

                return (
                  <tr
                    key={pt.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      background: isBreached ? 'rgba(244,63,94,0.04)' : isImminent ? 'rgba(245,158,11,0.03)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{pt.patientName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                        {pt.id} • {pt.age}yo {pt.gender}
                      </div>
                    </td>

                    <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                      <span style={{
                        fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px',
                        background: pt.esi.includes('ESI-1') ? 'rgba(244,63,94,0.25)' : pt.esi.includes('ESI-2') ? 'rgba(245,158,11,0.25)' : 'rgba(6,182,212,0.25)',
                        color: pt.esi.includes('ESI-1') ? '#fda4af' : pt.esi.includes('ESI-2') ? '#fde68a' : '#22d3ee',
                        fontWeight: 700
                      }}>
                        {pt.esi}
                      </span>
                    </td>

                    <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{pt.slaType}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target: {pt.targetMinutes}m</div>
                    </td>

                    <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>
                        {pt.elapsedMinutes}m / {pt.targetMinutes}m
                      </div>
                      <div style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', marginTop: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, (pt.elapsedMinutes / pt.targetMinutes) * 100)}%`,
                          height: '100%', background: statusColor
                        }} />
                      </div>
                    </td>

                    <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px',
                        background: `${statusColor}25`, color: statusColor, display: 'inline-flex', alignItems: 'center', gap: '5px'
                      }}>
                        {isBreached && <span className="live-dot" />}
                        {pt.remainingMinutes < 0 ? `Breached by +${Math.abs(pt.remainingMinutes)}m` : `${pt.remainingMinutes}m remaining`}
                      </span>
                    </td>

                    <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                      <div style={{ color: '#cbd5e1' }}>{pt.location}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MD: {pt.assignedMD}</div>
                    </td>

                    <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                      {isEscalated ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          color: '#34d399', fontSize: '0.75rem', fontWeight: 700
                        }}>
                          <CheckCircle2 size={14} /> Escalated & Paged
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEscalate(pt)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '6px 12px', borderRadius: '6px',
                            background: isBreached ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : 'rgba(255,255,255,0.06)',
                            border: isBreached ? 'none' : '1px solid var(--border-color)',
                            color: '#fff', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.2s', boxShadow: isBreached ? '0 0 10px rgba(244,63,94,0.4)' : 'none'
                          }}
                        >
                          <Send size={12} /> {pt.remediationAction}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hourly SLA Breach Trend & Volume Chart */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              24-Hour Patient Arrival Volume vs. SLA Breaches
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Notice breach spikes correlate directly with the 08:00 - 11:00 AM arrival surge (102 pt/hr)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', background: '#06b6d4', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Intake Volume (pt/hr)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', background: '#f43f5e', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>SLA Breaches</span>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={HOURLY_SLA_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(10, 16, 30, 0.95)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px', fontSize: '0.75rem'
                }}
              />
              <Bar yAxisId="left" dataKey="volume" fill="#06b6d4" radius={[4, 4, 0, 0]} opacity={0.65} name="Arrival Volume" />
              <Line yAxisId="right" type="monotone" dataKey="breaches" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} name="SLA Breaches" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
