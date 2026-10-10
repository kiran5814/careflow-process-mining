import React, { useState } from 'react';
import { Sliders, Zap, CheckCircle2, TrendingDown, DollarSign, Clock, Sparkles } from 'lucide-react';

export default function WhatIfSimulation() {
  const [loopbackRate, setLoopbackRate] = useState(10); // Default simulated: 10% (down from 40%)
  const [radiologyTechStaffing, setRadiologyTechStaffing] = useState(2); // Additional morning techs

  // Dynamic calculations based on slider values
  const currentBaselineWaitMin = 222; // 3h 42m
  const baselineLoopbackRate = 40;

  // Reduction in minutes per case
  const loopbackReduction = baselineLoopbackRate - loopbackRate;
  const staffingReduction = (radiologyTechStaffing - 1) * 18; // 18m saved per tech in rush
  const totalSavedMinutes = Math.round(loopbackReduction * 1.5 + staffingReduction);

  const simulatedWaitMin = Math.max(120, currentBaselineWaitMin - totalSavedMinutes);
  const simulatedHours = Math.floor(simulatedWaitMin / 60);
  const simulatedMins = simulatedWaitMin % 60;

  // Patient waiting hours saved per 1000 cases
  const patientHoursSaved = Math.round((totalSavedMinutes * 1000) / 60);
  const annualSavingsUSD = Math.round((patientHoursSaved * 4 * 12 * 75) / 1000); // in thousands

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
              What-If Process Optimization Sandbox
            </h3>
            <span className="badge badge-cyan">
              <Sparkles size={12} /> Predictive Simulation
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Model operational process interventions and see real-time impact on hospital wait times and cost.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Controls Column */}
        <div style={{
          background: 'rgba(10, 16, 30, 0.6)',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            Intervention Parameters
          </h4>

          {/* Slider 1: Fix missing paperwork form */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                Radiology Loop-Back Rate (Paperwork Missing)
              </label>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24' }}>
                {loopbackRate}% <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>(baseline: 40%)</span>
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              value={loopbackRate}
              onChange={(e) => setLoopbackRate(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#f59e0b',
                cursor: 'pointer'
              }}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Simulates deploying digital triage requisition forms that prevent paperwork bounce-backs.
            </p>
          </div>

          {/* Slider 2: Additional morning techs */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                Morning Radiology Tech Capacity (8 - 11 AM)
              </label>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8' }}>
                +{radiologyTechStaffing - 1} Staff <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>(total {radiologyTechStaffing})</span>
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              value={radiologyTechStaffing}
              onChange={(e) => setRadiologyTechStaffing(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#0ea5e9',
                cursor: 'pointer'
              }}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Deploys additional radiology technicians during the critical 8-11 AM morning rush window.
            </p>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            color: '#34d399'
          }}>
            ✓ Optimal target configuration: 5% loopback & +1 morning technician
          </div>
        </div>

        {/* Results Simulation Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          {/* Result 1: Projected Stay */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(17, 26, 48, 0.7))',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                Projected Median Stay
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0.4rem 0' }}>
                {simulatedHours}h {simulatedMins}m
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#34d399' }}>
              <TrendingDown size={14} />
              <span>Reduced by {totalSavedMinutes} min / case</span>
            </div>
          </div>

          {/* Result 2: Patient Waiting Hours Saved */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(17, 26, 48, 0.7))',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>
                Waiting Hours Saved
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0.4rem 0' }}>
                {patientHoursSaved.toLocaleString()} hrs
              </h2>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Per 1,000 emergency patient visits
            </div>
          </div>

          {/* Result 3: Projected Annual Value */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(17, 26, 48, 0.7))',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gridColumn: 'span 2'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase' }}>
                Estimated Operational Capacity & Efficiency Value
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#a5b4fc', margin: '0.4rem 0' }}>
                ~${annualSavingsUSD.toLocaleString()}k / year
              </h2>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              Eliminating repeated triage assessments and radiology queues yields ~280 extra patient slots per quarter.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
