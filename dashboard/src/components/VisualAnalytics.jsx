import React, { useState } from 'react';
import { 
  PieChart as PieIcon, BarChart2, TrendingUp, Clock, AlertTriangle, 
  Users, ShieldCheck, Stethoscope, DollarSign, Calendar, Filter, 
  Download, ArrowUpRight, ArrowDownRight, Layers, HelpCircle, CheckCircle2, Flame
} from 'lucide-react';
import { 
  ACUITY_DISTRIBUTION, DISPOSITION_DISTRIBUTION, DELAY_ATTRIBUTION, 
  REWORK_REASONS, WEEKLY_HEATMAP, DOCTORS_DATA, HOURLY_METRICS, SUMMARY_STATS 
} from '../data/processData';

// Helper to compute SVG Donut arcs
function DonutChart({ data, size = 260, strokeWidth = 36, centerTitle, centerValue, centerSub, onSliceClick }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;
  const slices = data.map((item, idx) => {
    const pct = item.percentage / 100;
    const strokeDasharray = `${pct * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeAngle * circumference;
    cumulativeAngle += pct;
    return { ...item, idx, strokeDasharray, strokeDashoffset };
  });

  const activeItem = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        {slices.map((slice) => {
          const isHovered = hoveredIdx === slice.idx;
          return (
            <circle
              key={slice.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              strokeLinecap="butt"
              style={{
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                filter: isHovered ? `drop-shadow(0 0 8px ${slice.color})` : 'none',
                opacity: hoveredIdx === null || isHovered ? 1 : 0.45
              }}
              onMouseEnter={() => setHoveredIdx(slice.idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onSliceClick && onSliceClick(slice)}
            />
          );
        })}
      </svg>

      {/* Center Label Display */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        pointerEvents: 'none',
        padding: '0 20px'
      }}>
        {activeItem ? (
          <>
            <span style={{ fontSize: '0.72rem', color: activeItem.color, fontWeight: 700, textTransform: 'uppercase' }}>
              {activeItem.label}
            </span>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', margin: '2px 0' }}>
              {activeItem.percentage}%
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {activeItem.count ? `${activeItem.count} cases` : activeItem.reason || activeItem.note || ''}
            </span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              {centerTitle || 'Total Cohort'}
            </span>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', margin: '2px 0' }}>
              {centerValue || '1,000'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              {centerSub || 'Hover slice for detail'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default function VisualAnalytics({ onDrilldownCase }) {
  const [activeSubView, setActiveSubView] = useState('acuity'); // 'acuity', 'delay', 'weekly', 'doctors'
  const [selectedAcuity, setSelectedAcuity] = useState(null);
  const [selectedDelayCategory, setSelectedDelayCategory] = useState(null);

  const subViews = [
    { id: 'acuity', label: 'Patient Acuity & Outcomes', icon: PieIcon },
    { id: 'delay', label: 'Delay & Bottleneck Attribution', icon: Clock },
    { id: 'weekly', label: 'Weekly Congestion Heatmap', icon: Calendar },
    { id: 'doctors', label: 'Physician Efficiency Matrix', icon: Stethoscope },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      {/* Top Banner & Subview Navigation */}
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
                <PieIcon size={20} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                Clinical Analytics & Interactive Visualizations
              </h2>
              <span className="badge badge-cyan">Visual Intelligence</span>
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Multi-dimensional data distributions: clinical severity, disposition outcomes, wait time attribution, and shift heatmaps.
            </p>
          </div>

          {/* Quick Sub-tab selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(10, 16, 30, 0.75)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            gap: '4px',
            flexWrap: 'wrap'
          }}>
            {subViews.map((sv) => {
              const Icon = sv.icon;
              const isActive = activeSubView === sv.id;
              return (
                <button
                  key={sv.id}
                  onClick={() => setActiveSubView(sv.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: '7px',
                    border: 'none',
                    background: isActive ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={14} />
                  <span>{sv.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Operational Ticker */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          background: 'rgba(10, 16, 30, 0.5)',
          border: '1px solid var(--border-color)',
          fontSize: '0.78rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Top Bottleneck: </span>
            <strong style={{ color: '#f43f5e' }}>Radiology Queue (42.4%)</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Peak Surge: </span>
            <strong style={{ color: '#fbbf24' }}>Mon & Fri 08–11 AM</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Paperwork Rework: </span>
            <strong style={{ color: '#f43f5e' }}>398 Loopback Traces</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Target LOS Benchmark: </span>
            <strong style={{ color: '#10b981' }}>&lt; 3h 00m (33.8% met)</strong>
          </div>
        </div>
      </div>

      {/* SUBVIEW 1: PATIENT ACUITY & DISPOSITION OUTCOMES */}
      {activeSubView === 'acuity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
            
            {/* Donut Chart 1: Patient Acuity Breakdown */}
            <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    Emergency Severity Index (ESI) Acuity
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Patient volume share categorized by clinical urgency triage level.
                  </p>
                </div>
                <span className="badge badge-cyan">4 Tiers</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem' }}>
                <DonutChart 
                  data={ACUITY_DISTRIBUTION} 
                  centerTitle="Total Acuity" 
                  centerValue="1,000" 
                  centerSub="Patient Cases"
                  onSliceClick={(slice) => setSelectedAcuity(slice)}
                />

                {/* Legend & Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, minWidth: '180px' }}>
                  {ACUITY_DISTRIBUTION.map((item) => (
                    <div 
                      key={item.label}
                      onClick={() => setSelectedAcuity(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: selectedAcuity?.label === item.label ? 'rgba(255,255,255,0.08)' : 'rgba(10,16,30,0.4)',
                        border: selectedAcuity?.label === item.label ? `1px solid ${item.color}` : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                        <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500 }}>{item.label}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: item.color }}>{item.percentage}%</span>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.count} cases</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Acuity Drilldown Card */}
              {selectedAcuity && (
                <div style={{
                  marginTop: '1.25rem',
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(17, 26, 48, 0.7)',
                  border: `1px solid ${selectedAcuity.color}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  fontSize: '0.8rem'
                }}>
                  <div>
                    <span style={{ color: selectedAcuity.color, fontWeight: 700 }}>{selectedAcuity.label} Insights:</span>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: '6px' }}>Avg ER Stay: <strong>{selectedAcuity.avgStay}</strong></span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span>Admit Rate: <strong style={{ color: '#fbbf24' }}>{selectedAcuity.admitRate}</strong></span>
                    <span>Cost Index: <strong style={{ color: '#38bdf8' }}>{selectedAcuity.costIndex}</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Donut Chart 2: Clinical Disposition / Outcomes */}
            <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    Hospital Disposition & Outcomes
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    End destination for ER encounters: Routine discharge, Inpatient, Observation.
                  </p>
                </div>
                <span className="badge badge-purple">4 Pathways</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem' }}>
                <DonutChart 
                  data={DISPOSITION_DISTRIBUTION} 
                  centerTitle="Outcomes" 
                  centerValue="100%" 
                  centerSub="Disposition Rate"
                />

                {/* Legend & Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, minWidth: '180px' }}>
                  {DISPOSITION_DISTRIBUTION.map((item) => (
                    <div 
                      key={item.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: 'rgba(10,16,30,0.4)',
                        fontSize: '0.78rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                        <div>
                          <div style={{ color: '#fff', fontWeight: 500 }}>{item.label}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.note}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: item.color }}>{item.percentage}%</span>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.count} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Acuity vs Stay & Cost Comparative Table */}
          <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem', animationDelay: '0.15s' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              Acuity Cohort Benchmark Matrix
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '8px 12px' }}>Clinical Acuity Tier</th>
                    <th style={{ padding: '8px 12px' }}>Patient Volume</th>
                    <th style={{ padding: '8px 12px' }}>Cohort Share</th>
                    <th style={{ padding: '8px 12px' }}>Median Lead Time</th>
                    <th style={{ padding: '8px 12px' }}>Admit Rate</th>
                    <th style={{ padding: '8px 12px' }}>Est Encounter Cost</th>
                    <th style={{ padding: '8px 12px' }}>Rework Vulnerability</th>
                  </tr>
                </thead>
                <tbody>
                  {ACUITY_DISTRIBUTION.map((tier) => (
                    <tr key={tier.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: tier.color }}>
                        {tier.label}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#fff' }}>{tier.count}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{tier.percentage}%</td>
                      <td style={{ padding: '10px 12px', color: '#38bdf8', fontWeight: 600 }}>{tier.avgStay}</td>
                      <td style={{ padding: '10px 12px', color: '#fbbf24' }}>{tier.admitRate}</td>
                      <td style={{ padding: '10px 12px', color: '#34d399', fontWeight: 600 }}>{tier.costIndex}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={`badge ${tier.percentage > 20 ? 'badge-rose' : 'badge-cyan'}`}>
                          {tier.percentage > 20 ? 'High Rework Risk' : 'Standard Flow'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: DELAY & BOTTLENECK ATTRIBUTION */}
      {activeSubView === 'delay' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
            
            {/* Donut Chart 3: ED Wait Time Breakdown */}
            <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    Total Patient Wait Time Breakdown
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Share of idle queue time across hospital process stages.
                  </p>
                </div>
                <span className="badge badge-rose">Bottlenecks</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem' }}>
                <DonutChart 
                  data={DELAY_ATTRIBUTION} 
                  centerTitle="Total Wait" 
                  centerValue="99 min" 
                  centerSub="Avg Queue Time"
                  onSliceClick={(s) => setSelectedDelayCategory(s)}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, minWidth: '180px' }}>
                  {DELAY_ATTRIBUTION.map((item) => (
                    <div 
                      key={item.label}
                      onClick={() => setSelectedDelayCategory(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: selectedDelayCategory?.label === item.label ? 'rgba(255,255,255,0.08)' : 'rgba(10,16,30,0.4)',
                        border: selectedDelayCategory?.label === item.label ? `1px solid ${item.color}` : '1px solid transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                        <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500 }}>{item.label}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: item.color }}>{item.percentage}%</span>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.avgWaitMin}m avg</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDelayCategory && (
                <div style={{
                  marginTop: '1.25rem',
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(17, 26, 48, 0.7)',
                  border: `1px solid ${selectedDelayCategory.color}`,
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}>
                  <strong style={{ color: selectedDelayCategory.color }}>{selectedDelayCategory.label} Root Driver:</strong> {selectedDelayCategory.reason}.
                  Target mitigation: Digital requisition forms and dynamic morning technician reassignment.
                </div>
              )}
            </div>

            {/* Donut Chart 4: Rework & Re-Triage Causes */}
            <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    Paperwork Rework Causes (Loop-Back)
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Why 398 patients were sent backward from Radiology back to Triage.
                  </p>
                </div>
                <span className="badge badge-warning">398 Cases</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem' }}>
                <DonutChart 
                  data={REWORK_REASONS} 
                  centerTitle="Rework Loop" 
                  centerValue="39.8%" 
                  centerSub="Of X-Ray Patients"
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minWidth: '180px' }}>
                  {REWORK_REASONS.map((item) => (
                    <div 
                      key={item.label}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(10,16,30,0.5)',
                        borderLeft: `3px solid ${item.color}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{item.label}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: item.color }}>{item.percentage}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <span>Affected Patients</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{item.count} patients</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Comparative Process Stage Wait Bars */}
          <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem', animationDelay: '0.15s' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
              Clinical Stage Wait Duration vs 15-Minute Target Benchmark
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {DELAY_ATTRIBUTION.map((d) => {
                const pct = (d.avgWaitMin / 50) * 100;
                const isOverTarget = d.avgWaitMin > 15;
                return (
                  <div key={d.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: '#f8fafc' }}>{d.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: isOverTarget ? '#f43f5e' : '#10b981', fontWeight: 700 }}>
                          {d.avgWaitMin} min
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          ({isOverTarget ? `+${d.avgWaitMin - 15}m over benchmark` : 'Within SLA'})
                        </span>
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(pct, 100)}%`,
                        height: '100%',
                        background: isOverTarget ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' : 'linear-gradient(90deg, #10b981, #06b6d4)',
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
      )}

      {/* SUBVIEW 3: WEEKLY HEATMAP */}
      {activeSubView === 'weekly' && (
        <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                  Weekly Emergency Department Congestion Heatmap
                </h3>
                <span className="badge badge-rose">Surge Radar</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Heat score (0 to 100) mapping arrival volume density & queue backlog across days of the week and operational shifts.
              </p>
            </div>

            {/* Heatmap Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Low (&lt;30)</span>
              <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'rgba(6, 182, 212, 0.25)', border: '1px solid rgba(6, 182, 212, 0.4)' }} />
              <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'rgba(245, 158, 11, 0.35)', border: '1px solid rgba(245, 158, 11, 0.5)' }} />
              <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'rgba(244, 63, 94, 0.75)', border: '1px solid rgba(244, 63, 94, 0.9)' }} />
              <span>Critical (80+)</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowX: 'auto' }}>
            {WEEKLY_HEATMAP.map((d) => (
              <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '45px', fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>
                  {d.day}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', flex: 1 }}>
                  {d.shifts.map((s) => {
                    const isSevere = s.score >= 80;
                    const isMod = s.score >= 50 && s.score < 80;
                    const bg = isSevere 
                      ? 'rgba(244, 63, 94, 0.65)' 
                      : isMod 
                        ? 'rgba(245, 158, 11, 0.35)' 
                        : 'rgba(6, 182, 212, 0.2)';
                    const border = isSevere 
                      ? '1px solid rgba(244, 63, 94, 0.8)' 
                      : isMod 
                        ? '1px solid rgba(245, 158, 11, 0.5)' 
                        : '1px solid rgba(6, 182, 212, 0.35)';

                    return (
                      <div
                        key={s.time}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '8px',
                          background: bg,
                          border: border,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', color: '#e2e8f0', fontWeight: 600 }}>{s.time.split(' ')[0]}</span>
                          {s.rush && <Flame size={13} color="#f43f5e" />}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{s.score}</span>
                          <span style={{ fontSize: '0.72rem', color: isSevere ? '#fecdd3' : '#cbd5e1' }}>Wait: {s.wait}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.85rem 1.25rem', borderRadius: '8px', background: 'rgba(10, 16, 30, 0.5)', border: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            💡 <strong>Staffing Scheduling Recommendation:</strong> Morning shifts on Mondays (98) and Fridays (95) represent maximum systemic saturation. Recommend activating dual-operator radiology coverage from 07:30 to 11:30 AM on high-risk weekdays.
          </div>
        </div>
      )}

      {/* SUBVIEW 4: PHYSICIAN EFFICIENCY & QUALITY */}
      {activeSubView === 'doctors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel fade-slide-up" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                  Attending Clinician Performance & Workload Equity
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Detailed comparative analytics across consult velocity, admission rates, and patient satisfaction.
                </p>
              </div>
              <span className="badge badge-cyan">5 Attending MDs</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {DOCTORS_DATA.map((doc) => {
                const isTopSatisfied = doc.satisfaction === '97%';
                const isFastest = doc.avgConsultTime === '24m';

                return (
                  <div
                    key={doc.name}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      background: 'rgba(17, 26, 48, 0.6)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(99,102,241,0.3))',
                          color: '#38bdf8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          {doc.name.split(' ')[1][0]}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{doc.name}</h4>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Emergency Medicine</span>
                        </div>
                      </div>
                      {isTopSatisfied && <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Top Rated</span>}
                      {isFastest && <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Fastest</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', marginTop: '4px' }}>
                      <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(10,16,30,0.5)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Cases Handled</span>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8' }}>{doc.casesHandled}</div>
                      </div>
                      <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(10,16,30,0.5)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Avg Consult</span>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#a5b4fc' }}>{doc.avgConsultTime}</div>
                      </div>
                      <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(10,16,30,0.5)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Admit Rate</span>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fbbf24' }}>{doc.admitRate}</div>
                      </div>
                      <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(10,16,30,0.5)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Satisfaction</span>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34d399' }}>{doc.satisfaction}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                        <span>Cohort Workload Share</span>
                        <span>{((doc.casesHandled / 1000) * 100).toFixed(1)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${(doc.casesHandled / 215) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #818cf8)' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
