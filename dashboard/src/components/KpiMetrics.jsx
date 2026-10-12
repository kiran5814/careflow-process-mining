import React, { useEffect, useState } from 'react';
import { 
  Users, Clock, AlertTriangle, Flame, ShieldAlert, TrendingUp, 
  DollarSign, Activity, Stethoscope, ChevronRight, CheckCircle2, 
  Layers, ArrowUpRight, ArrowDownRight, Info, Zap
} from 'lucide-react';
import { SUMMARY_STATS, ADVANCED_KPIS } from '../data/processData';

function Sparkline({ values, color = '#06b6d4', height = 32 }) {
  const max = Math.max(...values);
  return (
    <svg width="72" height={height} viewBox={`0 0 72 ${height}`} style={{ overflow: 'visible' }}>
      {values.map((v, i) => {
        const barH = (v / max) * height;
        return (
          <rect key={i} x={i * 8} y={height - barH} width={6} height={barH} rx={2}
            fill={color} opacity={0.25 + (v / max) * 0.75}
            style={{ animation: `barGrow 0.7s ${i * 0.05}s cubic-bezier(0.4,0,0.2,1) both` }}
          />
        );
      })}
    </svg>
  );
}

function ProgressRing({ pct, size = 52, stroke = 5, color = '#06b6d4', bg = 'rgba(6,182,212,0.1)' }) {
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
  const [kpiCategory, setKpiCategory] = useState('executive'); // 'executive', 'flow', 'quality', 'financial', 'all'
  const [selectedKpi, setSelectedKpi] = useState(null);

  useEffect(() => { 
    const t = setTimeout(() => setMounted(true), 80); 
    return () => clearTimeout(t); 
  }, []);

  const sparkCases = [62, 78, 85, 91, 74, 88, 95, 83, 100, 92];
  const sparkWait  = [28, 35, 52, 65, 48, 60, 58, 44, 38, 50];
  const sparkRush  = [18, 42, 65, 60, 38, 25, 22, 30, 18, 20];
  const pct = SUMMARY_STATS.conformanceScore;

  const iconBox = (bg, color) => ({
    background: bg, padding: '10px', borderRadius: '12px', color, flexShrink: 0
  });

  const cardBase = (delay) => ({
    padding: '1.35rem', animationDelay: `${delay}s`, cursor: 'pointer', transition: 'all 0.2s ease'
  });

  const categories = [
    { id: 'executive', label: 'Executive Core' },
    { id: 'flow', label: 'Flow & Throughput' },
    { id: 'quality', label: 'Quality & Safety' },
    { id: 'financial', label: 'Financial & ROI' },
    { id: 'all', label: 'All 11 Metrics' },
  ];

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {/* Category Pills & Quick Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            KPI Command Center
          </span>
          <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Live EHR Telemetry</span>
        </div>

        <div style={{
          display: 'flex',
          background: 'rgba(17, 26, 48, 0.7)',
          padding: '3px',
          borderRadius: '9px',
          border: '1px solid var(--border-color)',
          gap: '3px',
          overflowX: 'auto'
        }}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => { setKpiCategory(c.id); setSelectedKpi(null); }}
              style={{
                padding: '5px 11px',
                borderRadius: '6px',
                border: 'none',
                background: kpiCategory === c.id ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                color: kpiCategory === c.id ? '#22d3ee' : 'var(--text-secondary)',
                fontWeight: kpiCategory === c.id ? 700 : 500,
                fontSize: '0.74rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1rem',
      }}>

        {/* --- CORE / EXECUTIVE CARDS --- */}
        {(kpiCategory === 'executive' || kpiCategory === 'all' || kpiCategory === 'flow') && (
          /* Card 1 – Total Cases */
          <div 
            className="glass-panel fade-slide-up" 
            style={{
              ...cardBase(0),
              border: selectedKpi === 'cases' ? '1px solid #06b6d4' : undefined,
              boxShadow: selectedKpi === 'cases' ? '0 0 15px rgba(6,182,212,0.2)' : undefined
            }}
            onClick={() => setSelectedKpi(selectedKpi === 'cases' ? null : 'cases')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total Cohort Cases
              </span>
              <div className="metric-icon" style={iconBox('rgba(6,182,212,0.12)', '#06b6d4')}>
                <Users size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', margin: '0.55rem 0 0.35rem' }}>
              <h2 className="shimmer-text" style={{ fontSize: '1.9rem', fontWeight: 800 }}>
                {SUMMARY_STATS.totalCases.toLocaleString()}
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ({SUMMARY_STATS.totalEvents.toLocaleString()} events)
              </span>
            </div>
            <Sparkline values={sparkCases} color="#06b6d4" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.73rem', color: '#10b981', marginTop: '0.5rem' }}>
              <TrendingUp size={13} /> <span>100% Monotonic Integrity • 0 Nulls</span>
            </div>
          </div>
        )}

        {(kpiCategory === 'executive' || kpiCategory === 'all' || kpiCategory === 'flow') && (
          /* Card 2 – Median ER Stay */
          <div 
            className="glass-panel fade-slide-up" 
            style={{
              ...cardBase(0.06),
              border: selectedKpi === 'stay' ? '1px solid #818cf8' : undefined,
              boxShadow: selectedKpi === 'stay' ? '0 0 15px rgba(99,102,241,0.2)' : undefined
            }}
            onClick={() => setSelectedKpi(selectedKpi === 'stay' ? null : 'stay')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Median ER Stay
              </span>
              <div className="metric-icon" style={iconBox('rgba(99,102,241,0.12)', '#818cf8')}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', margin: '0.55rem 0 0.35rem' }}>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#a5b4fc' }}>
                {SUMMARY_STATS.medianCycleTime}
              </h2>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>p90: {SUMMARY_STATS.p90CycleTime}</span>
            </div>
            <Sparkline values={sparkWait} color="#818cf8" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.73rem', color: '#f59e0b', marginTop: '0.5rem' }}>
              <TrendingUp size={13} /> <span>+48m delay from radiology loopback</span>
            </div>
          </div>
        )}

        {(kpiCategory === 'executive' || kpiCategory === 'all' || kpiCategory === 'quality') && (
          /* Card 3 – Loopback */
          <div 
            className="glass-panel glow-warning fade-slide-up" 
            style={{
              ...cardBase(0.12),
              background: 'linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(17,26,48,0.82) 100%)',
              border: selectedKpi === 'loopback' ? '1px solid #f59e0b' : undefined
            }}
            onClick={() => setSelectedKpi(selectedKpi === 'loopback' ? null : 'loopback')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Radiology Loop-Back
              </span>
              <div className="metric-icon" style={iconBox('rgba(245,158,11,0.18)', '#f59e0b')}>
                <AlertTriangle size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', margin: '0.55rem 0 0.65rem' }}>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fbbf24' }}>
                {SUMMARY_STATS.loopbackRate}%
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#fcd34d' }}>({SUMMARY_STATS.loopbackCases} patients)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.71rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
              <span>Paperwork Re-triage</span><span>{SUMMARY_STATS.loopbackRate}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{
                width: mounted ? `${SUMMARY_STATS.loopbackRate}%` : '0%',
                background: 'linear-gradient(90deg, #f59e0b, #f43f5e)'
              }} />
            </div>
            <div style={{ fontSize: '0.73rem', color: '#fbbf24', marginTop: '0.55rem' }}>
              ⚠️ Missing form causes repeat triage
            </div>
          </div>
        )}

        {(kpiCategory === 'executive' || kpiCategory === 'all' || kpiCategory === 'flow') && (
          /* Card 4 – Morning Rush */
          <div 
            className="glass-panel fade-slide-up" 
            style={{
              ...cardBase(0.18),
              border: selectedKpi === 'rush' ? '1px solid #f43f5e' : undefined
            }}
            onClick={() => setSelectedKpi(selectedKpi === 'rush' ? null : 'rush')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Radiology Rush Wait
              </span>
              <div className="metric-icon" style={iconBox('rgba(244,63,94,0.12)', '#fb7185')}>
                <Flame size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', margin: '0.55rem 0 0.35rem' }}>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fb7185' }}>
                {SUMMARY_STATS.morningRushWaitRadiology}
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>vs {SUMMARY_STATS.regularWaitRadiology} norm</span>
            </div>
            <Sparkline values={sparkRush} color="#f43f5e" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.73rem', color: '#f43f5e', marginTop: '0.5rem' }}>
              <TrendingUp size={13} /> <span>+237% wait spike during 8–11 AM</span>
            </div>
          </div>
        )}

        {(kpiCategory === 'executive' || kpiCategory === 'all' || kpiCategory === 'quality') && (
          /* Card 5 – Conformance */
          <div 
            className="glass-panel fade-slide-up" 
            style={{
              ...cardBase(0.24),
              border: selectedKpi === 'conformance' ? '1px solid #10b981' : undefined
            }}
            onClick={() => setSelectedKpi(selectedKpi === 'conformance' ? null : 'conformance')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Protocol Conformance
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', margin: '0.55rem 0 0.35rem' }}>
                  <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#34d399' }}>
                    {pct}%
                  </h2>
                  <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>5.1% skip triage</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.73rem', color: '#94a3b8' }}>
                  <ShieldAlert size={13} /> <span>51 un-triaged fast-track bypasses</span>
                </div>
              </div>
              <div style={{ flexShrink: 0, position: 'relative', marginLeft: '0.75rem' }}>
                <ProgressRing pct={mounted ? pct : 0} color="#10b981" bg="rgba(16,185,129,0.12)" />
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#34d399'
                }}>
                  {pct}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ADVANCED CATEGORY CARDS --- */}
        {ADVANCED_KPIS
          .filter(k => kpiCategory === 'all' || kpiCategory === k.category)
          .map((kpi, idx) => {
            const isWarning = kpi.status === 'warning';
            const isDanger = kpi.status === 'danger';
            const isSuccess = kpi.status === 'success';
            const color = isDanger ? '#f43f5e' : isWarning ? '#fbbf24' : isSuccess ? '#34d399' : '#38bdf8';
            const bgIcon = isDanger ? 'rgba(244,63,94,0.15)' : isWarning ? 'rgba(245,158,11,0.15)' : isSuccess ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.15)';

            return (
              <div
                key={kpi.id}
                className="glass-panel fade-slide-up"
                style={{
                  ...cardBase(0.1 + idx * 0.05),
                  border: selectedKpi === kpi.id ? `1px solid ${color}` : undefined
                }}
                onClick={() => setSelectedKpi(selectedKpi === kpi.id ? null : kpi.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {kpi.title}
                  </span>
                  <div className="metric-icon" style={iconBox(bgIcon, color)}>
                    {kpi.category === 'financial' ? <DollarSign size={18} /> : kpi.category === 'quality' ? <CheckCircle2 size={18} /> : <Zap size={18} />}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', margin: '0.55rem 0 0.35rem' }}>
                  <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color }}>
                    {kpi.value}
                  </h2>
                  <span className={`badge ${isDanger ? 'badge-rose' : isWarning ? 'badge-amber' : 'badge-cyan'}`} style={{ fontSize: '0.68rem' }}>
                    {kpi.badge}
                  </span>
                </div>

                <Sparkline values={kpi.sparkline} color={color} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.73rem', marginTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{kpi.subtext}</span>
                  <span style={{ color, fontWeight: 600 }}>{kpi.trend}</span>
                </div>
              </div>
            );
          })
        }

      </div>

      {/* Selected KPI Expanded Detail Callout */}
      {selectedKpi && (
        <div className="glass-panel fade-slide-up" style={{
          marginTop: '1rem',
          padding: '1rem 1.25rem',
          background: 'rgba(10, 16, 30, 0.75)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info size={18} color="#06b6d4" />
            <div style={{ fontSize: '0.82rem' }}>
              <span style={{ color: '#fff', fontWeight: 700 }}>Clinical & Economic Context: </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {selectedKpi === 'cases' && 'Analysis conducted across 1,000 continuous patient encounters over 90 days with 100% monotonic timestamp integrity.'}
                {selectedKpi === 'stay' && 'Target ED Length of Stay is under 3 hours. Radiology paperwork rework and morning surges extend stay by up to 2 hours.'}
                {selectedKpi === 'loopback' && '398 cases required returning to triage because physical radiology requisition forms lacked required clinical indications.'}
                {selectedKpi === 'rush' && 'Morning shift surge between 08:00 and 11:00 AM drives queue times from 16 mins baseline up to 54-65 mins.'}
                {selectedKpi === 'conformance' && '51 patients bypassed initial nursing triage. While 32 were appropriate trauma resuscitation bypasses, 19 represent compliance documentation gaps.'}
                {ADVANCED_KPIS.find(k => k.id === selectedKpi)?.detail}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSelectedKpi(null)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
