import React from 'react';
import { X, Clock, Calendar, User, ShieldAlert, AlertTriangle, ArrowDown, Stethoscope, CheckCircle2 } from 'lucide-react';

export default function CaseDetailModal({ patientCase, onClose }) {
  if (!patientCase) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(3, 7, 18, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'rgba(13, 20, 36, 0.95)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Patient Trace: {patientCase.caseId}
              </h3>
              {patientCase.isLoopback && (
                <span className="badge badge-amber">Paperwork Loopback</span>
              )}
              {patientCase.hasAnomaly && (
                <span className="badge badge-rose">Triage Bypass</span>
              )}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Complete chronological audit trail extracted from EHR timestamps.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Patient Profile Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          background: 'rgba(10, 16, 30, 0.5)',
          borderBottom: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          fontSize: '0.8rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Demographics:</span>
            <div style={{ fontWeight: 600, color: '#fff' }}>{patientCase.gender}, {patientCase.ageGroup}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Acuity:</span>
            <div>
              <span className={`badge badge-${patientCase.severity === 'High' ? 'rose' : patientCase.severity === 'Medium' ? 'amber' : 'emerald'}`}>
                {patientCase.severity}
              </span>
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Attending:</span>
            <div style={{ fontWeight: 600, color: '#38bdf8' }}>{patientCase.doctor}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Total Stay:</span>
            <div style={{ fontWeight: 700, color: patientCase.isLoopback ? '#fbbf24' : '#34d399' }}>
              {patientCase.leadTime}
            </div>
          </div>
        </div>

        {/* Timeline sequence */}
        <div style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Event Execution Flow ({patientCase.timeline.length} Steps)
          </h4>

          <div style={{ position: 'relative', paddingLeft: '1.75rem' }}>
            {/* Vertical timeline rule */}
            <div style={{
              position: 'absolute',
              left: '7px',
              top: '8px',
              bottom: '8px',
              width: '2px',
              background: 'rgba(148, 163, 184, 0.2)'
            }} />

            {patientCase.timeline.map((step, idx) => {
              const isLoop = step.isLoopback;
              const isAnomaly = step.isAnomaly;

              return (
                <div key={idx} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-1.75rem',
                    top: '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: isLoop ? '#f59e0b' : isAnomaly ? '#f43f5e' : '#06b6d4',
                    border: '3px solid #0d1424',
                    boxShadow: isLoop ? '0 0 8px #f59e0b' : undefined
                  }} />

                  <div style={{
                    background: isLoop 
                      ? 'rgba(245, 158, 11, 0.12)' 
                      : isAnomaly 
                        ? 'rgba(244, 63, 94, 0.12)' 
                        : 'rgba(17, 26, 48, 0.6)',
                    border: isLoop 
                      ? '1px solid rgba(245, 158, 11, 0.4)' 
                      : isAnomaly 
                        ? '1px solid rgba(244, 63, 94, 0.4)' 
                        : '1px solid var(--border-color)',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: isLoop ? '#fbbf24' : isAnomaly ? '#fb7185' : '#fff'
                      }}>
                        {step.activity}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {step.timestamp}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span>Resource: <strong style={{ color: '#cbd5e1' }}>{step.resource}</strong></span>
                      <span>Waiting: <strong style={{ color: step.wait.includes('Rush') || step.wait.includes('Delay') ? '#fbbf24' : '#cbd5e1' }}>{step.wait}</strong></span>
                      <span>Duration: <strong style={{ color: '#cbd5e1' }}>{step.duration}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'rgba(10, 16, 30, 0.5)'
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
