import React, { useState } from 'react';
import { Activity, ArrowRight, AlertTriangle, ShieldAlert, CheckCircle, Clock, DollarSign, PieChart as PieIcon, BarChart3, TrendingUp } from 'lucide-react';
import { PROCESS_VARIANTS } from '../data/processData';

// Mini SVG Donut for Variants
function VariantDonut({ variants, size = 180, strokeWidth = 24 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const colors = ['#06b6d4', '#3b82f6', '#f59e0b', '#8b5cf6', '#f43f5e', '#10b981'];

  let cumulative = 0;
  const slices = variants.map((v, i) => {
    const pct = v.percentage / 100;
    const strokeDasharray = `${pct * circumference} ${circumference}`;
    const strokeDashoffset = -cumulative * circumference;
    cumulative += pct;
    return { ...v, idx: i, color: colors[i % colors.length], strokeDasharray, strokeDashoffset };
  });

  const active = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        {slices.map((slice) => {
          const isHov = hoveredIdx === slice.idx;
          return (
            <circle
              key={slice.id}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={isHov ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                filter: isHov ? `drop-shadow(0 0 6px ${slice.color})` : 'none',
                opacity: hoveredIdx === null || isHov ? 1 : 0.5
              }}
              onMouseEnter={() => setHoveredIdx(slice.idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          );
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', textAlign: 'center'
      }}>
        {active ? (
          <>
            <span style={{ fontSize: '0.68rem', color: active.color, fontWeight: 700 }}>{active.id}</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{active.percentage}%</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{active.caseCount} cases</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>100%</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>6 Variants</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function VariantExplorer() {
  const [filterType, setFilterType] = useState('all'); // 'all', 'bottleneck', 'anomaly'

  const filtered = PROCESS_VARIANTS.filter(v => {
    if (filterType === 'bottleneck') return v.isLoopback;
    if (filterType === 'anomaly') return v.isAnomaly;
    return true;
  });

  const variantColors = ['#06b6d4', '#3b82f6', '#f59e0b', '#8b5cf6', '#f43f5e', '#10b981'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.75rem' }}>
      
      {/* Top Visual Benchmark & Donut Summary Card */}
      <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem' }}>
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
              <div style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.2))',
                padding: '8px',
                borderRadius: '10px',
                color: '#06b6d4'
              }}>
                <BarChart3 size={20} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Clinical Process Trace Variants & SLA Performance
              </h3>
              <span className="badge badge-purple">{PROCESS_VARIANTS.length} Pathways Identified</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Comparing distinct patient care trajectories against the hospital 3-hour length of stay benchmark. 75.5% of cases follow the top 3 pathways.
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
              All Variants (6)
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
              Loopback / Rework (1)
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
              Protocol Breaches (2)
            </button>
          </div>
        </div>

        {/* Dual Visual: Donut Distribution + Horizontal Lead Time Bars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          padding: '1.25rem',
          borderRadius: '12px',
          background: 'rgba(10, 16, 30, 0.5)',
          border: '1px solid var(--border-color)',
          alignItems: 'center'
        }}>
          {/* Left: Donut + Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <VariantDonut variants={PROCESS_VARIANTS} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Cohort Volume Share
              </span>
              {PROCESS_VARIANTS.map((v, idx) => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: variantColors[idx] }} />
                  <span style={{ color: '#fff', fontWeight: 600, width: '45px' }}>{v.id}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{v.percentage}%</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>({v.caseCount} pts)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Lead Time vs 3-Hour SLA Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Lead Time vs 3h Target SLA
              </span>
              <span style={{ color: '#06b6d4', fontWeight: 600 }}>Target: 180 min</span>
            </div>

            {PROCESS_VARIANTS.map((v, idx) => {
              // Convert lead time like "2h 45m" to minutes
              const parts = v.avgLeadTime.split(' ');
              const mins = parseInt(parts[0]) * 60 + parseInt(parts[1]);
              const pct = (mins / 360) * 100;
              const isOver = mins > 180;

              return (
                <div key={v.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: 500 }}>
                      <strong style={{ color: variantColors[idx] }}>{v.id}:</strong> {v.name.slice(0, 28)}...
                    </span>
                    <span style={{ fontWeight: 700, color: isOver ? '#f43f5e' : '#10b981' }}>
                      {v.avgLeadTime} {isOver && `(+${mins - 180}m)`}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(pct, 100)}%`,
                      height: '100%',
                      background: isOver 
                        ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' 
                        : 'linear-gradient(90deg, #10b981, #06b6d4)',
                      borderRadius: '999px',
                      transition: 'width 0.8s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Variant Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((variant, index) => {
          const isWarning = variant.isLoopback;
          const isDanger = variant.isAnomaly;
          const color = variantColors[PROCESS_VARIANTS.findIndex(v => v.id === variant.id) % variantColors.length];

          return (
            <div
              key={variant.id}
              className="fade-slide-up"
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
                padding: '1.25rem',
                transition: 'all 0.2s ease',
                animationDelay: `${index * 0.05}s`
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
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    background: `rgba(${color === '#f43f5e' ? '244,63,94' : '6,182,212'}, 0.15)`,
                    border: `1px solid ${color}`,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    color: color
                  }}>
                    {variant.id}
                  </span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Case Volume</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                      {variant.caseCount} <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>({variant.percentage}%)</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Est Cost</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>
                      {variant.costIndex}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Duration</div>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: isWarning ? '#fbbf24' : isDanger ? '#fb7185' : '#34d399'
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
                background: 'rgba(7, 11, 20, 0.65)',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(148, 163, 184, 0.08)'
              }}>
                {variant.steps.map((step, idx) => {
                  const isLast = idx === variant.steps.length - 1;
                  const isLoopbackStep = step.includes('Loop-back') || step.includes('Repeated');

                  return (
                    <React.Fragment key={idx}>
                      <span style={{
                        padding: '5px 11px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
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
