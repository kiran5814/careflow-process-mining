import React, { useState, useEffect } from 'react';
import {
  Sliders, TrendingDown, DollarSign, Clock, Users, Zap,
  CheckCircle2, AlertTriangle, RotateCcw, Play, BarChart3, ArrowRight, Target
} from 'lucide-react';

const BASELINE = {
  loopbackRate: 39.8,
  medianStay: 218,     // minutes
  morningRushWait: 54, // minutes
  triageSkip: 5.1,
  labDelay: 8.9,
  staffCount: 12,
  annualCost: 2400000, // USD
  patientsPerDay: 120,
};

function AnimatedNumber({ target, duration = 1200, decimals = 0, prefix = '', suffix = '' }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = 0;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target]);
  return <>{prefix}{current.toFixed(decimals)}{suffix}</>;
}

function RoiBar({ label, before, after, color, unit = '' }) {
  const pct = Math.max(0, Math.min(100, (before - after) / before * 100));
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.78rem' }}>
          <span style={{ color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>
            {before}{unit} <span style={{ color: 'var(--text-muted)', fontFamily: 'sans-serif' }}>→</span>
          </span>
          <span style={{ color: color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{after.toFixed(1)}{unit}</span>
          <span className="badge badge-emerald" style={{ fontSize: '0.64rem' }}>
            -{pct.toFixed(0)}%
          </span>
        </div>
      </div>
      <div style={{ position: 'relative', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
        {/* Baseline bar */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, background: 'rgba(244,63,94,0.2)', borderRadius: '999px' }} />
        {/* Improved bar */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${(after / before) * 100}%`,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          borderRadius: '999px',
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)'
        }} />
      </div>
    </div>
  );
}

export default function WhatIfSimulation() {
  const [params, setParams] = useState({
    digitalForms: 0,         // 0–100% adoption
    extraRadiologyStaff: 0,  // 0–5 extra techs
    triageQueueAlerts: false,
    labIntegration: 0,       // 0–100% LIMS integration
    flexStaffing: 0,         // 0–100% flex schedule coverage
  });
  const [simulated, setSimulated] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const computeResult = (p) => {
    const loopReduction = p.digitalForms * 0.9; // each 1% adoption = 0.9% loopback reduction
    const newLoopback = Math.max(2, BASELINE.loopbackRate - loopReduction * 0.4);

    const rushReduction = p.extraRadiologyStaff * 7 + p.flexStaffing * 0.12;
    const newRushWait = Math.max(18, BASELINE.morningRushWait - rushReduction);

    const labReduction = p.labIntegration * 0.15;
    const newLabDelay = Math.max(1.5, BASELINE.labDelay - labReduction);

    const triageImprovement = p.triageQueueAlerts ? 2.8 : 0;
    const newTriageSkip = Math.max(0.5, BASELINE.triageSkip - triageImprovement);

    // Stay time is a combo
    const stayReduction = (BASELINE.loopbackRate - newLoopback) * 1.2 + (BASELINE.morningRushWait - newRushWait) * 0.6;
    const newMedianStay = Math.max(95, BASELINE.medianStay - stayReduction);

    // Cost savings model
    const loopbackSavings = (BASELINE.loopbackRate - newLoopback) / 100 * 1000 * 320; // $320/loopback event
    const staySavings = (BASELINE.medianStay - newMedianStay) / 60 * BASELINE.patientsPerDay * 365 * 18; // $18/hr ER bed
    const staffCost = p.extraRadiologyStaff * 65000; // $65k/tech/year
    const netAnnualSavings = loopbackSavings + staySavings - staffCost;

    const throughputGain = (BASELINE.medianStay - newMedianStay) / BASELINE.medianStay * BASELINE.patientsPerDay;

    return {
      newLoopback: +newLoopback.toFixed(1),
      newRushWait: +newRushWait.toFixed(1),
      newLabDelay: +newLabDelay.toFixed(1),
      newTriageSkip: +newTriageSkip.toFixed(1),
      newMedianStay: +newMedianStay.toFixed(0),
      netAnnualSavings: Math.round(netAnnualSavings),
      throughputGain: +throughputGain.toFixed(1),
      loopbackSavings: Math.round(loopbackSavings),
      staySavings: Math.round(staySavings),
      staffCost,
    };
  };

  const handleRun = () => {
    setRunning(true);
    setSimulated(false);
    setTimeout(() => {
      setResult(computeResult(params));
      setSimulated(true);
      setRunning(false);
    }, 1400);
  };

  const handleReset = () => {
    setParams({ digitalForms: 0, extraRadiologyStaff: 0, triageQueueAlerts: false, labIntegration: 0, flexStaffing: 0 });
    setSimulated(false);
    setResult(null);
  };

  const sliders = [
    {
      key: 'digitalForms',
      label: 'Digital Radiology Form Adoption',
      description: 'Replaces paper requisition forms → reduces loopback rework',
      min: 0, max: 100, step: 5, unit: '%',
      color: '#06b6d4', impact: 'Reduces loopback rate'
    },
    {
      key: 'extraRadiologyStaff',
      label: 'Additional Radiology Technicians',
      description: 'Each tech reduces morning rush queue by ~7 minutes',
      min: 0, max: 5, step: 1, unit: ' techs',
      color: '#f59e0b', impact: 'Reduces rush wait time'
    },
    {
      key: 'labIntegration',
      label: 'LIMS Auto-Push Integration',
      description: 'Lab results automatically pushed to EHR → eliminates manual entry delay',
      min: 0, max: 100, step: 10, unit: '%',
      color: '#818cf8', impact: 'Reduces lab SLA breaches'
    },
    {
      key: 'flexStaffing',
      label: 'Flexible Staffing Coverage',
      description: 'Dynamic shift scheduling based on hourly demand prediction',
      min: 0, max: 100, step: 10, unit: '%',
      color: '#10b981', impact: 'Reduces peak wait times'
    },
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
            <Sliders size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>What-If ROI Optimizer</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Simulate operational interventions and model annual savings impact
            </p>
          </div>
        </div>
        <button onClick={handleReset} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '7px 14px', borderRadius: '8px',
          border: '1px solid var(--border-color)', background: 'transparent',
          color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer'
        }}>
          <RotateCcw size={13} /> Reset All
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* LEFT: Controls */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Intervention Parameters
          </div>

          {sliders.map(s => (
            <div key={s.key} style={{ marginBottom: '1.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>{s.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.description}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800, color: s.color }}>
                    {params[s.key]}{s.unit}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={s.min} max={s.max} step={s.step}
                value={params[s.key]}
                onChange={e => setParams(prev => ({ ...prev, [s.key]: +e.target.value }))}
                style={{
                  width: '100%', accentColor: s.color, cursor: 'pointer', height: '4px',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#475569', marginTop: '3px' }}>
                <span>{s.min}{s.unit}</span>
                <span style={{ color: s.color, fontSize: '0.68rem' }}>{s.impact}</span>
                <span>{s.max}{s.unit}</span>
              </div>
            </div>
          ))}

          {/* Toggle: Triage Queue Alerts */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: '10px',
            background: params.triageQueueAlerts ? 'rgba(16,185,129,0.1)' : 'rgba(17,26,48,0.6)',
            border: `1px solid ${params.triageQueueAlerts ? 'rgba(16,185,129,0.3)' : 'var(--border-color)'}`,
            marginBottom: '1.5rem', cursor: 'pointer'
          }} onClick={() => setParams(prev => ({ ...prev, triageQueueAlerts: !prev.triageQueueAlerts }))}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>Real-time Triage Queue Alerts</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Auto-notify staff when queue exceeds threshold</div>
            </div>
            <div style={{
              width: 40, height: 22, borderRadius: 999,
              background: params.triageQueueAlerts ? '#10b981' : '#334155',
              position: 'relative', transition: 'background 0.2s'
            }}>
              <div style={{
                position: 'absolute', top: 3, left: params.triageQueueAlerts ? 21 : 3,
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
              }} />
            </div>
          </div>

          {/* Run Button */}
          <button onClick={handleRun} disabled={running} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px', borderRadius: '10px', border: 'none', cursor: running ? 'not-allowed' : 'pointer',
            background: running ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontSize: '0.9rem', fontWeight: 700,
            boxShadow: running ? 'none' : '0 4px 20px rgba(99,102,241,0.4)',
            transition: 'all 0.2s ease'
          }}>
            {running ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Running Simulation…
              </>
            ) : (
              <>
                <Play size={16} /> Run ROI Simulation
              </>
            )}
          </button>
        </div>

        {/* RIGHT: Results */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Projected Outcomes
          </div>

          {!simulated && !running && (
            <div style={{
              height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', fontSize: '0.82rem', gap: '1rem',
              border: '1px dashed var(--border-color)', borderRadius: '12px', padding: '3rem 1.5rem',
              textAlign: 'center'
            }}>
              <Sliders size={40} opacity={0.3} />
              <div>
                <div style={{ fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Adjust parameters and run simulation</div>
                <div>Results will appear here with projected KPI improvements and annual ROI</div>
              </div>
            </div>
          )}

          {running && (
            <div style={{
              height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '3rem', gap: '1rem'
            }}>
              <div style={{ width: 48, height: 48, border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600 }}>Running Monte Carlo simulation…</div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>Projecting across 1,000 case variants</div>
            </div>
          )}

          {simulated && result && (
            <div>
              {/* Big ROI number */}
              <div style={{
                padding: '1.25rem', borderRadius: '12px',
                background: result.netAnnualSavings > 0 ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.1))' : 'rgba(244,63,94,0.1)',
                border: `1px solid ${result.netAnnualSavings > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`,
                marginBottom: '1.25rem', textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  Projected Annual Net Savings
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: result.netAnnualSavings > 0 ? '#34d399' : '#fb7185', fontFamily: 'var(--font-mono)' }}>
                  <AnimatedNumber target={result.netAnnualSavings} prefix="$" duration={1500} />
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  +<AnimatedNumber target={result.throughputGain} decimals={1} duration={1200} /> additional patients/day throughput
                </div>
              </div>

              {/* KPI Bars */}
              <div style={{ marginBottom: '1.25rem' }}>
                <RoiBar label="Loopback Rate" before={BASELINE.loopbackRate} after={result.newLoopback} color="#10b981" unit="%" />
                <RoiBar label="Morning Rush Wait" before={BASELINE.morningRushWait} after={result.newRushWait} color="#06b6d4" unit="m" />
                <RoiBar label="Median ER Stay" before={BASELINE.medianStay} after={result.newMedianStay} color="#a5b4fc" unit="m" />
                <RoiBar label="Lab SLA Breaches" before={BASELINE.labDelay} after={result.newLabDelay} color="#818cf8" unit="%" />
                <RoiBar label="Triage Skip Rate" before={BASELINE.triageSkip} after={result.newTriageSkip} color="#34d399" unit="%" />
              </div>

              {/* Cost Breakdown */}
              <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(10,16,30,0.7)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Cost Model Breakdown
                </div>
                {[
                  { label: 'Loopback Elimination Savings', val: result.loopbackSavings, color: '#10b981' },
                  { label: 'Bed Time Efficiency Savings', val: result.staySavings, color: '#06b6d4' },
                  { label: 'Additional Staff Cost', val: -result.staffCost, color: '#f43f5e' },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{c.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: c.color }}>
                      {c.val >= 0 ? '+' : ''}${c.val.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
