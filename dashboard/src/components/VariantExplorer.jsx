import React, { useState } from 'react';
import { Activity, ArrowRight, AlertTriangle, ShieldAlert, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { PROCESS_VARIANTS } from '../data/processData';

export default function VariantExplorer() {
  const [filterType, setFilterType] = useState('all'); // 'all', 'bottleneck', 'anomaly'

  const filtered = PROCESS_VARIANTS.filter(v => {
    if (filterType === 'bottleneck') return v.isLoopback;
    if (filterType === 'anomaly') return v.isAnomaly;
    return true;
  });

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
              Process Trace Variants Explorer
            </h3>
            <span className="badge badge-purple">{PROCESS_VARIANTS.length} Pathways Identified</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Comparing distinct clinical pathways through the hospital ER. 75.5% of cases follow the top 3 pathways.
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setFilterType('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: filterType === 'all' ? '1px solid #06b6d4' : '1px solid var(--border-color)',
              background: filterType === 'all' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(17, 26, 48, 0.6)',
              color: filterType === 'all' ? '#22d3ee' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            All Variants
          </button>
          <button
            onClick={() => setFilterType('bottleneck')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: filterType === 'bottleneck' ? '1px solid #f59e0b' : '1px solid var(--border-color)',
              background: filterType === 'bottleneck' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(17, 26, 48, 0.6)',
              color: filterType === 'bottleneck' ? '#fbbf24' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Loopback / Rework
          </button>
          <button
            onClick={() => setFilterType('anomaly')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: filterType === 'anomaly' ? '1px solid #f43f5e' : '1px solid var(--border-color)',
              background: filterType === 'anomaly' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(17, 26, 48, 0.6)',
              color: filterType === 'anomaly' ? '#fb7185' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Protocol Breaches
          </button>
        </div>
      </div>

      {/* Variant Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((variant) => {
          const isWarning = variant.isLoopback;
          const isDanger = variant.isAnomaly;

          return (
            <div
              key={variant.id}
              style={{
                borderRadius: '12px',
                background: isWarning 
                  ? 'rgba(245, 158, 11, 0.05)' 
                  : isDanger 
                    ? 'rgba(244, 63, 94, 0.05)' 
                    : 'rgba(17, 26, 48, 0.6)',
                border: isWarning 
                  ? '1px solid rgba(245, 158, 11, 0.35)' 
                  : isDanger 
                    ? '1px solid rgba(244, 63, 94, 0.35)' 
                    : '1px solid var(--border-color)',
                padding: '1.2rem',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Variant Top Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    color: '#fff'
                  }}>
                    {variant.id}
                  </span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                    {variant.name}
                  </h4>
                  {isWarning && (
                    <span className="badge badge-amber">
                      <AlertTriangle size={12} /> Paperwork Loopback
                    </span>
                  )}
                  {isDanger && (
                    <span className="badge badge-rose">
                      <ShieldAlert size={12} /> Protocol Violation
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Case Volume</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                      {variant.caseCount} <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>({variant.percentage}%)</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Duration</div>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: isWarning ? '#fbbf24' : '#34d399'
                    }}>
                      {variant.avgLeadTime}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Sequence Visualizer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '6px',
                background: 'rgba(7, 11, 20, 0.6)',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(148, 163, 184, 0.08)'
              }}>
                {variant.steps.map((step, idx) => {
                  const isLast = idx === variant.steps.length - 1;
                  const isLoopbackStep = step.includes('Loop-back') || step.includes('Repeated');

                  return (
                    <React.Fragment key={idx}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: isLoopbackStep 
                          ? 'rgba(245, 158, 11, 0.25)' 
                          : 'rgba(30, 41, 59, 0.8)',
                        color: isLoopbackStep 
                          ? '#fbbf24' 
                          : '#e2e8f0',
                        border: isLoopbackStep 
                          ? '1px solid rgba(245, 158, 11, 0.5)' 
                          : '1px solid rgba(148, 163, 184, 0.15)'
                      }}>
                        {step}
                      </span>
                      {!isLast && (
                        <ArrowRight size={13} color="var(--text-muted)" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
