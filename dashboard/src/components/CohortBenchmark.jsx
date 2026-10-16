import React, { useState } from 'react';
import { 
  GitCompare, Download, CheckCircle2, Split 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { COHORT_BENCHMARKS } from '../data/processData';

export default function CohortBenchmark() {
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState(COHORT_BENCHMARKS[0].id);

  const activeBenchmark = COHORT_BENCHMARKS.find(b => b.id === selectedBenchmarkId) || COHORT_BENCHMARKS[0];
  const { stats, stageBreakdown } = activeBenchmark;

  const handleExportCsv = () => {
    const headers = ["Stage", `${activeBenchmark.cohortAName} (Min)`, `${activeBenchmark.cohortBName} (Min)`, "Delta"];
    const rows = stageBreakdown.map(s => [
      `"${s.stage}"`,
      s.timeA,
      s.timeB,
      `"${s.delta}"`
    ]);
    const summaryRows = [
      ["---", "---", "---", "---"],
      ["Median Stay", `"${stats.medianDurationA}"`, `"${stats.medianDurationB}"`, `"${stats.durationDelta}"`],
      ["P90 Stay", `"${stats.p90DurationA}"`, `"${stats.p90DurationB}"`, "---"],
      ["Rework Loop Rate", `"${stats.loopbackRateA}"`, `"${stats.loopbackRateB}"`, `"${stats.loopbackDelta}"`],
      ["Process Conformance", `"${stats.conformanceA}"`, `"${stats.conformanceB}"`, `"${stats.conformanceDelta}"`],
      ["Direct Encounter Cost", `"${stats.costPerCaseA}"`, `"${stats.costPerCaseB}"`, `"${stats.costDelta}"`],
      ["Patient CSAT", `"${stats.csatScoreA}"`, `"${stats.csatScoreB}"`, `"${stats.csatDelta}"`]
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [
      headers.join(','),
      ...rows.map(r => r.join(',')),
      ...summaryRows.map(r => r.join(','))
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CareFlow_Cohort_Benchmark_${activeBenchmark.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '380px', height: '100%',
          background: 'radial-gradient(ellipse at top right, rgba(99,102,241,0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(6,182,212,0.25))',
                border: '1px solid rgba(99,102,241,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc'
              }}>
                <Split size={20} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                Cohort A/B Comparative Process Mining & Pathway Benchmarking
              </h2>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                Statistical Discovery
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '820px', lineHeight: 1.5, margin: 0 }}>
              Side-by-side comparative discovery benchmarking clinical pathways, cycle time divergences, 
              operational waste, and conformance variance between patient cohorts.
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
            <Download size={14} /> Export Benchmark (CSV)
          </button>
        </div>

        {/* Benchmark Scenario Selector Tabs */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem',
          borderTop: '1px solid var(--border-color)', paddingTop: '1rem', overflowX: 'auto'
        }}>
          {COHORT_BENCHMARKS.map((b) => {
            const isSelected = selectedBenchmarkId === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBenchmarkId(b.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 14px', borderRadius: '8px',
                  border: isSelected ? '1px solid #6366f1' : '1px solid var(--border-color)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                <GitCompare size={14} color={isSelected ? '#a5b4fc' : 'currentColor'} />
                {b.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cohort Comparison Card Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f43f5e' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                Cohort A: {activeBenchmark.cohortAName} ({stats.volumeA} cases)
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>vs</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#06b6d4' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                Cohort B: {activeBenchmark.cohortBName} ({stats.volumeB} cases)
              </span>
            </div>
          </div>

          <div style={{
            fontSize: '0.72rem', padding: '3px 10px', borderRadius: '6px',
            background: 'rgba(16,185,129,0.15)', color: '#34d399', fontWeight: 700
          }}>
            {stats.pValue} (Statistically Significant)
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.75rem 0 0 0', lineHeight: 1.4 }}>
          <strong>Hypothesis Tested: </strong>{activeBenchmark.hypothesis}
        </p>
      </div>

      {/* Side-by-Side Metric Delta Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        
        {/* Metric 1: Median Stay */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Median Lead Time</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#f43f5e' }}>A: {stats.medianDurationA}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 6px' }}>|</span>
              <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>B: {stats.medianDurationB}</span>
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fb7185', marginTop: '4px' }}>
            {stats.durationDelta}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>P90: {stats.p90DurationA} vs {stats.p90DurationB}</span>
        </div>

        {/* Metric 2: Loopback Rate */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Rework Loopback Rate</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#f43f5e' }}>A: {stats.loopbackRateA}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 6px' }}>|</span>
              <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>B: {stats.loopbackRateB}</span>
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {stats.loopbackDelta}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Radiology paperwork loops</span>
        </div>

        {/* Metric 3: Cost per Encounter */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Direct Cost / Patient</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#f43f5e' }}>A: {stats.costPerCaseA}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 6px' }}>|</span>
              <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>B: {stats.costPerCaseB}</span>
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            {stats.costDelta}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Operational resource consumption</span>
        </div>

        {/* Metric 4: Conformance Score */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Process Conformance</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#f43f5e' }}>A: {stats.conformanceA}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 6px' }}>|</span>
              <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>B: {stats.conformanceB}</span>
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {stats.conformanceDelta}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CSAT: {stats.csatScoreA} vs {stats.csatScoreB}</span>
        </div>

      </div>

      {/* Stage-by-Stage Transition Latency Waterfall Chart */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Stage-by-Stage Clinical Latency Breakdown (Minutes)
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Compares exact dwell and transit times across each step of the care journey
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', background: '#f43f5e', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>{activeBenchmark.cohortAName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', background: '#06b6d4', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>{activeBenchmark.cohortBName}</span>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="stage" stroke="#64748b" fontSize={11} angle={-15} textAnchor="end" height={40} />
              <YAxis stroke="#64748b" fontSize={11} unit="m" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(10, 16, 30, 0.95)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px', fontSize: '0.75rem'
                }}
              />
              <Bar dataKey="timeA" name={activeBenchmark.cohortAName} fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="timeB" name={activeBenchmark.cohortBName} fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clinical Remediation Directive */}
      <div className="glass-panel glow-accent" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid #10b981' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <CheckCircle2 size={16} color="#10b981" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399', margin: 0, textTransform: 'uppercase' }}>
            Empirical Process Remediation Directive
          </h4>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
          {activeBenchmark.remediation}
        </p>
      </div>

    </div>
  );
}
