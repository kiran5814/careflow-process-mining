import React, { useEffect, useState } from 'react';
import { 
  Users, Clock, AlertTriangle, Flame, ShieldAlert, TrendingUp, 
  DollarSign, Activity, Stethoscope, ChevronRight, CheckCircle2, 
  Layers, ArrowUpRight, ArrowDownRight, Info, Zap, X, Download,
  HeartPulse, ShieldCheck, HelpCircle, BarChart3, Sliders
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { SUMMARY_STATS, ADVANCED_KPIS, THIRTY_DAY_TRENDS } from '../data/processData';

// Micro SVG Sparkline with smooth curve and fill
function MetricSparkline({ values, color = '#06b6d4', height = 30 }) {
  if (!values || values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 84;
  const step = width / (values.length - 1);

  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0comma${height} Z`.replace('0comma', '0,');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace('#','')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* End point dot */}
      {points.length > 0 && (
        <circle 
          cx={parseFloat(points[points.length - 1].split(',')[0])} 
          cy={parseFloat(points[points.length - 1].split(',')[1])} 
          r="3" 
          fill={color} 
        />
      )}
    </svg>
  );
}

// Progress Ring for Conformance
function ProgressRing({ pct, size = 52, stroke = 5, color = '#10b981', bg = 'rgba(16,185,129,0.12)' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

export default function KpiMetrics() {
  const [mounted, setMounted] = useState(false);
  const [kpiCategory, setKpiCategory] = useState('executive'); 
  const [activeDrilldownKpi, setActiveDrilldownKpi] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => { 
    const t = setTimeout(() => setMounted(true), 60); 
    return () => clearTimeout(t); 
  }, []);

  // Category counts
  const categoryCounts = {
    executive: 5,
    flow: ADVANCED_KPIS.filter(k => k.category === 'flow').length + 2,
    quality: ADVANCED_KPIS.filter(k => k.category === 'quality').length + 1,
    financial: ADVANCED_KPIS.filter(k => k.category === 'financial').length,
    resource: ADVANCED_KPIS.filter(k => k.category === 'resource').length,
    all: ADVANCED_KPIS.length + 5
  };

  const categories = [
    { id: 'executive', label: 'Executive Core', count: categoryCounts.executive },
    { id: 'flow',      label: 'Flow & Velocity', count: categoryCounts.flow },
    { id: 'quality',   label: 'Clinical Governance', count: categoryCounts.quality },
    { id: 'financial', label: 'Economics & ROI', count: categoryCounts.financial },
    { id: 'resource',  label: 'Workforce & Parity', count: categoryCounts.resource },
    { id: 'all',       label: 'All Metrics', count: categoryCounts.all },
  ];

  // Core Metrics Sparkline values
  const sparkCases = [62, 78, 85, 91, 74, 88, 95, 83, 100, 92];
  const sparkWait  = [28, 35, 52, 65, 48, 60, 58, 44, 38, 50];
  const sparkRush  = [18, 42, 65, 60, 38, 25, 22, 30, 18, 20];

  const handleExportMetric = (kpi) => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Day,Metric_Value,Unit,SLA_Benchmark,Status\n" +
      THIRTY_DAY_TRENDS.map((t, idx) => `${t.date},${t.volume},Daily Intake,40 cases,Normal`).join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `CareFlow_KPI_${kpi.id || 'metric'}_30Day_Audit.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {/* Institutional Telemetry Ribbon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: 'rgba(11, 18, 33, 0.75)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        marginBottom: '1rem',
        fontSize: '0.78rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#10b981', boxShadow: '0 0 8px #10b981'
            }} />
            <strong style={{ color: '#fff', letterSpacing: '0.02em' }}>TELEMETRY STATUS: ACTIVE</strong>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            EHR Trace Cohort: <strong style={{ color: '#38bdf8' }}>1,000 Ingested Cases</strong>
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            Monotonic Compliance: <strong style={{ color: '#34d399' }}>100.0%</strong>
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            Loopback Rate: <strong style={{ color: '#fbbf24' }}>39.8% (Paperwork Rework)</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
            ISO-8601 UTC Synchronized
          </span>
          <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
            SLA Standard: ESI 1-5
          </span>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.15rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.2))',
            padding: '6px', borderRadius: '8px', color: '#22d3ee'
          }}>
            <BarChart3 size={16} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Process Performance Scorecard
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Click any metric card for forensic formula, SLA benchmarks & 30-day time series audit
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          background: 'rgba(10, 16, 30, 0.85)',
          padding: '3px',
          borderRadius: '9px',
          border: '1px solid var(--border-color)',
          gap: '3px',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {categories.map((c) => {
            const isActive = kpiCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setKpiCategory(c.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(99,102,241,0.25))' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{c.label}</span>
                <span style={{
                  fontSize: '0.62rem',
                  padding: '1px 5px',
                  borderRadius: '10px',
                  background: isActive ? '#06b6d4' : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#070b14' : 'var(--text-muted)',
                  fontWeight: 700
                }}>
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
      }}>

        {/* --- CORE / EXECUTIVE CARDS --- */}
        {(kpiCategory === 'executive' || kpiCategory === 'all' || kpiCategory === 'flow') && (
          /* Card 1: Total Cohort Volume */
          <div 
            className="glass-panel fade-slide-up"
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              borderTop: '3px solid #06b6d4',
              transition: 'all 0.2s ease',
              transform: hoveredCard === 'cases' ? 'translateY(-3px)' : 'none',
              boxShadow: hoveredCard === 'cases' ? '0 10px 25px rgba(6,182,212,0.18)' : undefined
            }}
            onMouseEnter={() => setHoveredCard('cases')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setActiveDrilldownKpi({
              id: 'cases',
              title: 'Total Monitored Patient Volume',
              value: '1,000 Cases',
              subtext: '6,347 Clean Clinical Events',
              status: 'Optimal',
              statusColor: '#10b981',
              formula: 'Distinct Count of Case_IDs passing 7 schema integrity assertions.',
              benchmark: '1,000 target cohort',
              detail: 'Complete patient cohort processed without data corruption, null values, or chronological reversals.',
              action: 'Data ingestion pipeline running at optimal second-precision monotonic integrity.'
            })}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Cohort Volume
                </span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                  Total Ingested Traces
                </div>
              </div>
              <div style={{ background: 'rgba(6,182,212,0.12)', padding: '8px', borderRadius: '8px', color: '#06b6d4' }}>
                <Users size={17} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.6rem 0 0.4rem' }}>
              <span className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                {SUMMARY_STATS.totalCases.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                ({SUMMARY_STATS.totalEvents.toLocaleString()} events)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                <ArrowUpRight size={13} /> <span>100% Monotonic Integrity</span>
              </div>
              <MetricSparkline values={sparkCases} color="#06b6d4" />
            </div>
          </div>
        )}

        {(kpiCategory === 'executive' || kpiCategory === 'all' || kpiCategory === 'flow') && (
          /* Card 2: Median ER Dwell Time */
          <div 
            className="glass-panel fade-slide-up"
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              borderTop: '3px solid #818cf8',
              transition: 'all 0.2s ease',
              transform: hoveredCard === 'stay' ? 'translateY(-3px)' : 'none',
              boxShadow: hoveredCard === 'stay' ? '0 10px 25px rgba(99,102,241,0.18)' : undefined
            }}
            onMouseEnter={() => setHoveredCard('stay')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setActiveDrilldownKpi({
              id: 'stay',
              title: 'Emergency Dwell Time (LOS)',
              value: SUMMARY_STATS.medianCycleTime,
              subtext: `P90 Tail: ${SUMMARY_STATS.p90CycleTime}`,
              status: 'Warning (P90 Tail)',
              statusColor: '#f59e0b',
              formula: 'Median duration from arrival check-in to discharge / admission timestamp.',
              benchmark: '< 3h 00m clinical target',
              detail: 'While standard non-loopback cases complete in 2h 45m, patients experiencing radiology form rework are delayed to over 5 hours.',
              action: 'Streamline paperwork verification at triage to eliminate the 48-minute loopback stay penalty.'
            })}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Throughput Velocity
                </span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                  Median Emergency Stay
                </div>
              </div>
              <div style={{ background: 'rgba(99,102,241,0.12)', padding: '8px', borderRadius: '8px', color: '#818cf8' }}>
                <Clock size={17} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.6rem 0 0.4rem' }}>
              <span className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#a5b4fc', letterSpacing: '-0.02em' }}>
                {SUMMARY_STATS.medianCycleTime}
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                p90: {SUMMARY_STATS.p90CycleTime}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600 }}>
                <ArrowUpRight size={13} /> <span>+48m Rework Delay</span>
              </div>
              <MetricSparkline values={sparkWait} color="#818cf8" />
            </div>
          </div>
        )}

        {(kpiCategory === 'executive' || kpiCategory === 'all' || kpiCategory === 'flow') && (
          /* Card 3: Radiology Loopback Rework Rate */
          <div 
            className="glass-panel fade-slide-up"
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              borderTop: '3px solid #f43f5e',
              background: 'linear-gradient(135deg, rgba(244,63,94,0.06) 0%, rgba(17,26,48,0.8) 100%)',
              transition: 'all 0.2s ease',
              transform: hoveredCard === 'loopback' ? 'translateY(-3px)' : 'none',
              boxShadow: hoveredCard === 'loopback' ? '0 10px 25px rgba(244,63,94,0.18)' : undefined
            }}
            onMouseEnter={() => setHoveredCard('loopback')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setActiveDrilldownKpi({
              id: 'loopback',
              title: 'Radiology Paperwork Loop-Back Rate',
              value: `${SUMMARY_STATS.loopbackRate}%`,
              subtext: `${SUMMARY_STATS.loopbackCases} Affected Patients`,
              status: 'Critical Bottleneck',
              statusColor: '#f43f5e',
              formula: '(Count of cases with X-Ray → Triage → X-Ray loop) / (Total Cases) × 100.',
              benchmark: '< 5.0% industry standard',
              detail: '39.8% of patients needing imaging are turned back to nursing triage because paper requisition forms omit clinical indication or provider signature.',
              action: 'Implement mandatory digital EHR checklist (CPOE) at Triage to eliminate 95% of form omissions.'
            })}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#fb7185', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Operational Waste
                </span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                  Radiology Re-Triage Rate
                </div>
              </div>
              <div style={{ background: 'rgba(244,63,94,0.15)', padding: '8px', borderRadius: '8px', color: '#f43f5e' }}>
                <AlertTriangle size={17} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.6rem 0 0.4rem' }}>
              <span className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#fb7185', letterSpacing: '-0.02em' }}>
                {SUMMARY_STATS.loopbackRate}%
              </span>
              <span style={{ fontSize: '0.74rem', color: '#fca5a5' }}>
                ({SUMMARY_STATS.loopbackCases} patients)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <span className="badge badge-rose" style={{ fontSize: '0.66rem' }}>
                -$142.4k Annual Cost
              </span>
              <div style={{ fontSize: '0.7rem', color: '#fb7185', fontWeight: 600 }}>
                Target: &lt; 5%
              </div>
            </div>
          </div>
        )}

        {(kpiCategory === 'executive' || kpiCategory === 'all' || kpiCategory === 'quality') && (
          /* Card 4: Protocol Conformance Fitness */
          <div 
            className="glass-panel fade-slide-up"
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              borderTop: '3px solid #10b981',
              transition: 'all 0.2s ease',
              transform: hoveredCard === 'conformance' ? 'translateY(-3px)' : 'none',
              boxShadow: hoveredCard === 'conformance' ? '0 10px 25px rgba(16,185,129,0.18)' : undefined
            }}
            onMouseEnter={() => setHoveredCard('conformance')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setActiveDrilldownKpi({
              id: 'conformance',
              title: 'Clinical Protocol Conformance',
              value: `${SUMMARY_STATS.conformanceScore}%`,
              subtext: 'Token Replay Fitness',
              status: 'High Adherence',
              statusColor: '#10b981',
              formula: 'Token Replay Fitness algorithm evaluating trace alignment with clinical clinical guidelines.',
              benchmark: '≥ 90.0% accreditation threshold',
              detail: '94.9% of event traces adhere to discoverable clinical pathways. 51 cases bypassed triage directly to consultation.',
              action: 'Enforce EHR hard-stop requiring explicit trauma exemption code for direct physician consults.'
            })}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Clinical Governance
                </span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                  Protocol Conformance
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.2rem 0' }}>
                  <span className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', letterSpacing: '-0.02em' }}>
                    {SUMMARY_STATS.conformanceScore}%
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.71rem', color: '#f43f5e' }}>
                  <ShieldAlert size={12} /> <span>5.1% triage bypass exceptions</span>
                </div>
              </div>

              <div style={{ flexShrink: 0, position: 'relative', marginLeft: '0.75rem' }}>
                <ProgressRing pct={mounted ? SUMMARY_STATS.conformanceScore : 0} color="#10b981" bg="rgba(16,185,129,0.15)" />
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, color: '#34d399'
                }}>
                  {SUMMARY_STATS.conformanceScore}%
                </div>
              </div>
            </div>
          </div>
        )}

        {(kpiCategory === 'executive' || kpiCategory === 'all' || kpiCategory === 'flow') && (
          /* Card 5: Morning Rush Wait Spike */
          <div 
            className="glass-panel fade-slide-up"
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              borderTop: '3px solid #f59e0b',
              transition: 'all 0.2s ease',
              transform: hoveredCard === 'rush' ? 'translateY(-3px)' : 'none',
              boxShadow: hoveredCard === 'rush' ? '0 10px 25px rgba(245,158,11,0.18)' : undefined
            }}
            onMouseEnter={() => setHoveredCard('rush')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setActiveDrilldownKpi({
              id: 'rush',
              title: 'Morning Rush Queue Latency (08:00 - 11:00 AM)',
              value: SUMMARY_STATS.morningRushWaitRadiology,
              subtext: `Baseline: ${SUMMARY_STATS.regularWaitRadiology}`,
              status: 'Surge Capacity Strain',
              statusColor: '#f59e0b',
              formula: 'Mean queue dwell time for radiology during 08:00 to 11:00 AM rush hours.',
              benchmark: '16 min off-peak baseline',
              detail: 'Arrival rates surge to 102 patients/hour while technician staffing remains flat at single operator.',
              action: 'Reallocate 1 technician from afternoon to 08:00-11:00 AM shift to eliminate the 54m bottleneck.'
            })}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Capacity Strain
                </span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                  Morning Radiology Surge
                </div>
              </div>
              <div style={{ background: 'rgba(245,158,11,0.12)', padding: '8px', borderRadius: '8px', color: '#f59e0b' }}>
                <Flame size={17} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.6rem 0 0.4rem' }}>
              <span className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '-0.02em' }}>
                {SUMMARY_STATS.morningRushWaitRadiology}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                vs {SUMMARY_STATS.regularWaitRadiology} norm
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600 }}>
                <ArrowUpRight size={13} /> <span>+237% Queue Spike</span>
              </div>
              <MetricSparkline values={sparkRush} color="#f59e0b" />
            </div>
          </div>
        )}

        {/* --- DYNAMIC ADVANCED CATEGORY CARDS --- */}
        {ADVANCED_KPIS
          .filter(k => kpiCategory === 'all' || kpiCategory === k.category)
          .map((kpi) => {
            const isDanger = kpi.status === 'danger';
            const isWarning = kpi.status === 'warning';
            const isSuccess = kpi.status === 'success';
            const accentColor = isDanger ? '#f43f5e' : isWarning ? '#fbbf24' : isSuccess ? '#34d399' : '#38bdf8';
            const categoryLabel = 
              kpi.category === 'flow' ? 'Throughput Flow' :
              kpi.category === 'quality' ? 'Clinical Governance' :
              kpi.category === 'financial' ? 'Financial Economics' : 'Resource Productivity';

            return (
              <div
                key={kpi.id}
                className="glass-panel fade-slide-up"
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  borderTop: `3px solid ${accentColor}`,
                  transition: 'all 0.2s ease',
                  transform: hoveredCard === kpi.id ? 'translateY(-3px)' : 'none',
                  boxShadow: hoveredCard === kpi.id ? `0 10px 25px ${accentColor}28` : undefined
                }}
                onMouseEnter={() => setHoveredCard(kpi.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setActiveDrilldownKpi({
                  id: kpi.id,
                  title: kpi.title,
                  value: kpi.value,
                  subtext: kpi.subtext,
                  status: kpi.badge,
                  statusColor: accentColor,
                  formula: kpi.formula,
                  benchmark: kpi.benchmark,
                  detail: kpi.detail,
                  action: kpi.impact,
                  sparkline: kpi.sparkline
                })}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {categoryLabel}
                    </span>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                      {kpi.title}
                    </div>
                  </div>
                  <div style={{
                    background: `${accentColor}18`,
                    padding: '8px',
                    borderRadius: '8px',
                    color: accentColor
                  }}>
                    {kpi.category === 'financial' ? <DollarSign size={17} /> :
                     kpi.category === 'quality' ? <ShieldCheck size={17} /> :
                     kpi.category === 'resource' ? <Stethoscope size={17} /> : <Zap size={17} />}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.6rem 0 0.4rem' }}>
                  <span className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: accentColor, letterSpacing: '-0.02em' }}>
                    {kpi.value}
                  </span>
                  <span className={`badge ${isDanger ? 'badge-rose' : isWarning ? 'badge-amber' : 'badge-cyan'}`} style={{ fontSize: '0.65rem' }}>
                    {kpi.badge}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.71rem', color: kpi.trendPositive ? '#34d399' : '#fb7185', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {kpi.trendPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    <span>{kpi.trend}</span>
                  </div>
                  <MetricSparkline values={kpi.sparkline} color={accentColor} />
                </div>
              </div>
            );
          })}
      </div>

      {/* ============================================================== */}
      {/* ENTERPRISE KPI DEEP-DIVE AUDIT DRAWER / MODAL */}
      {/* ============================================================== */}
      {activeDrilldownKpi && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 11, 20, 0.78)',
          backdropFilter: 'blur(10px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '680px',
            width: '100%',
            background: 'rgba(13, 20, 36, 0.98)',
            border: `1px solid ${activeDrilldownKpi.statusColor || '#06b6d4'}`,
            borderRadius: '16px',
            boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 30px ${activeDrilldownKpi.statusColor || '#06b6d4'}25`,
            overflow: 'hidden',
            animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(17, 26, 48, 0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  padding: '8px', borderRadius: '10px',
                  background: `${activeDrilldownKpi.statusColor || '#06b6d4'}20`,
                  color: activeDrilldownKpi.statusColor || '#06b6d4'
                }}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                    {activeDrilldownKpi.title}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Enterprise KPI Forensic Audit & Clinical Lineage
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveDrilldownKpi(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '75vh', overflowY: 'auto' }}>
              
              {/* Highlight Metric Hero */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                background: 'rgba(10, 16, 30, 0.65)',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Active Measured Score
                  </div>
                  <div className="font-mono" style={{ fontSize: '2.4rem', fontWeight: 800, color: activeDrilldownKpi.statusColor || '#fff' }}>
                    {activeDrilldownKpi.value}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {activeDrilldownKpi.subtext}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge" style={{
                    background: `${activeDrilldownKpi.statusColor || '#06b6d4'}22`,
                    color: activeDrilldownKpi.statusColor || '#06b6d4',
                    border: `1px solid ${activeDrilldownKpi.statusColor || '#06b6d4'}50`,
                    fontSize: '0.75rem',
                    padding: '4px 10px'
                  }}>
                    {activeDrilldownKpi.status}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Benchmark SLA: <strong style={{ color: '#fff' }}>{activeDrilldownKpi.benchmark || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              {/* 30-Day Trend Chart */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>
                    30-Day Historical Trend & Variance
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#10b981' }}>
                    Normalized UTC Rolling Window
                  </span>
                </div>
                <div style={{ height: '140px', width: '100%', background: 'rgba(7, 11, 20, 0.5)', borderRadius: '10px', padding: '10px 10px 0 0' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={THIRTY_DAY_TRENDS}>
                      <defs>
                        <linearGradient id="modalGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={activeDrilldownKpi.statusColor || '#06b6d4'} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={activeDrilldownKpi.statusColor || '#06b6d4'} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#0d1424', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="volume" 
                        name="Cohort Trend"
                        stroke={activeDrilldownKpi.statusColor || '#06b6d4'} 
                        fill="url(#modalGradient)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mathematical Formula & Data Lineage */}
              <div style={{
                background: 'rgba(10, 16, 30, 0.65)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '12px 14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, marginBottom: '4px' }}>
                  <Info size={14} />
                  <span>MATHEMATICAL FORMULATION & DATA LINEAGE</span>
                </div>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: '#cbd5e1', background: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: '6px' }}>
                  {activeDrilldownKpi.formula || 'Calculated via continuous stochastic token replay across 1,000 cases.'}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  {activeDrilldownKpi.detail}
                </div>
              </div>

              {/* Root Cause & Clinical Action */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '10px',
                padding: '12px 14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#34d399', fontWeight: 700, marginBottom: '4px' }}>
                  <CheckCircle2 size={14} />
                  <span>PRESCRIBED REMEDIATION / CLINICAL ACTION</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>
                  {activeDrilldownKpi.action || 'Deploy electronic order entry (CPOE) validation at triage to eliminate paperwork re-work and reduce queue dwell time.'}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(10, 16, 30, 0.7)'
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Audited against 6,347 clinical log events
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleExportMetric(activeDrilldownKpi)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '7px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={14} /> Export Metric (CSV)
                </button>
                <button
                  onClick={() => setActiveDrilldownKpi(null)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '7px',
                    background: '#06b6d4',
                    border: 'none',
                    color: '#070b14',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close Audit View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
