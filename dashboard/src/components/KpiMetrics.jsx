import React from 'react';
import { Users, Clock, AlertTriangle, Flame, ShieldAlert, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { SUMMARY_STATS } from '../data/processData';

export default function KpiMetrics({ onSelectMetric }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '1rem',
      marginBottom: '1.75rem'
    }}>
      {/* Metric 1: Total Cases */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Cohort Cases
          </span>
          <div style={{
            background: 'rgba(6, 182, 212, 0.15)',
            padding: '8px',
            borderRadius: '10px',
            color: '#06b6d4'
          }}>
            <Users size={18} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff' }}>
            {SUMMARY_STATS.totalCases.toLocaleString()}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ({SUMMARY_STATS.totalEvents.toLocaleString()} events)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#10b981' }}>
          <TrendingUp size={14} />
          <span>Full 90-day mock window loaded</span>
        </div>
      </div>

      {/* Metric 2: Median Lead Time */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Median ER Stay
          </span>
          <div style={{
            background: 'rgba(99, 102, 241, 0.15)',
            padding: '8px',
            borderRadius: '10px',
            color: '#818cf8'
          }}>
            <Clock size={18} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff' }}>
            {SUMMARY_STATS.medianCycleTime}
          </h2>
          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>p90: {SUMMARY_STATS.p90CycleTime}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#f59e0b' }}>
          <TrendingUp size={14} />
          <span>+48m longer due to radiology rework</span>
        </div>
      </div>

      {/* Metric 3: Loop-back Inefficiency (HIGHLIGHTED BOTTLENECK) */}
      <div className="glass-panel glow-warning" style={{
        padding: '1.25rem',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(17, 26, 48, 0.8) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>
            Radiology Loop-Back Rework
          </span>
          <div style={{
            background: 'rgba(245, 158, 11, 0.2)',
            padding: '8px',
            borderRadius: '10px',
            color: '#f59e0b'
          }}>
            <AlertTriangle size={18} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fbbf24' }}>
            {SUMMARY_STATS.loopbackRate}%
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#fcd34d' }}>
            ({SUMMARY_STATS.loopbackCases} patients)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#fbbf24' }}>
          <span>⚠️ Missing paperwork causes re-triage</span>
        </div>
      </div>

      {/* Metric 4: Morning Rush Spike */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Radiology Rush Wait (8-11 AM)
          </span>
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            padding: '8px',
            borderRadius: '10px',
            color: '#fb7185'
          }}>
            <Flame size={18} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fb7185' }}>
            {SUMMARY_STATS.morningRushWaitRadiology}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            vs {SUMMARY_STATS.regularWaitRadiology} norm
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#f43f5e' }}>
          <TrendingUp size={14} />
          <span>+237% wait spike during morning wave</span>
        </div>
      </div>

      {/* Metric 5: Protocol Conformance */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Protocol Conformance
          </span>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '8px',
            borderRadius: '10px',
            color: '#34d399'
          }}>
            <ShieldAlert size={18} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff' }}>
            {SUMMARY_STATS.conformanceScore}%
          </h2>
          <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
            5.1% skip triage
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#94a3b8' }}>
          <span>51 un-triaged fast-track exceptions</span>
        </div>
      </div>
    </div>
  );
}
