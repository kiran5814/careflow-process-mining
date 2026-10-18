import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import { Sliders, Sparkles, TrendingDown, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function DelayWaterfall() {
  const [simulateCPOE, setSimulateCPOE] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);

  // Baseline vs Simulated Data
  const WATERFALL_DATA = [
    {
      name: 'Nominal Ideal',
      category: 'baseline',
      base: 0,
      delta: 184,
      total: 184,
      isTotal: true,
      color: '#38bdf8',
      desc: 'Optimal clinical care pathway with zero queuing or administrative friction',
      action: 'Target gold standard'
    },
    {
      name: 'Triage Queue',
      category: 'delay',
      base: 184,
      delta: 14,
      total: 198,
      isTotal: false,
      color: '#06b6d4',
      desc: 'Shift-change nurse handoff and bed check-in queuing delay',
      action: 'Bedside intake kiosks'
    },
    {
      name: 'STAT Labs Wait',
      category: 'delay',
      base: 198,
      delta: 38,
      total: 236,
      isTotal: false,
      color: '#a78bfa',
      desc: 'Pneumatic tube transit and centrifuge lab verification for Troponin & CBC',
      action: 'Point-of-care i-STAT analyzers'
    },
    {
      name: 'Radiology Rush',
      category: 'bottleneck',
      base: 236,
      delta: simulateCPOE ? 16 : 46,
      total: simulateCPOE ? 252 : 282,
      isTotal: false,
      color: simulateCPOE ? '#34d399' : '#fb923c',
      desc: simulateCPOE 
        ? 'Simulated: Shift rebalancing clears morning queue in 16 min' 
        : '08:00 - 11:00 AM surge: +237% wait due to single radiology technician staffing',
      action: 'Shift 1 technician to morning shift',
      alert: !simulateCPOE
    },
    {
      name: 'Paper Re-Triage',
      category: 'bottleneck',
      base: simulateCPOE ? 252 : 282,
      delta: simulateCPOE ? 4 : 64,
      total: simulateCPOE ? 256 : 346,
      isTotal: false,
      color: simulateCPOE ? '#34d399' : '#f43f5e',
      desc: simulateCPOE 
        ? 'Simulated: CPOE mandatory digital orders eliminate physical form rejection' 
        : 'CRITICAL: Incomplete paper order forms returned from X-Ray to Triage for physician signature',
      action: 'Mandatory CPOE electronic orders',
      alert: !simulateCPOE
    },
    {
      name: 'Specialist Lag',
      category: 'delay',
      base: simulateCPOE ? 256 : 346,
      delta: 52,
      total: simulateCPOE ? 308 : 398,
      isTotal: false,
      color: '#eab308',
      desc: 'Cardiology, Orthopedic and Surgery on-call physician paging turnaround',
      action: 'VoIP priority paging protocol'
    },
    {
      name: 'Bed Placement',
      category: 'delay',
      base: simulateCPOE ? 308 : 398,
      delta: 20,
      total: simulateCPOE ? 328 : 418,
      isTotal: false,
      color: '#ec4899',
      desc: 'Inpatient ward cleaning, environmental turnover, and nurse handover',
      action: 'Automated bed tracking sensors'
    },
    {
      name: 'Final Dwell Time',
      category: 'total',
      base: 0,
      delta: simulateCPOE ? 328 : 418,
      total: simulateCPOE ? 328 : 418,
      isTotal: true,
      color: simulateCPOE ? '#10b981' : '#ef4444',
      desc: simulateCPOE
        ? 'Optimized average stay: 5h 28m (-90 min total delay reduction!)'
        : 'Observed average stay: 6h 58m (+234 min delay burden above nominal)',
      action: 'Summary outcome'
    }
  ];

  // Custom waterfall tooltip
  const CustomWaterfallTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(11, 18, 33, 0.96)',
          border: `1.5px solid ${data.color}`,
          borderRadius: '10px',
          padding: '10px 14px',
          color: '#fff',
          fontSize: '0.75rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          minWidth: '220px'
        }}>
          <div style={{ fontWeight: 800, color: data.color, marginBottom: '4px' }}>
            {data.name} ({data.isTotal ? 'Total Duration' : `+${data.delta} min Delay`})
          </div>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '6px', lineHeight: 1.35 }}>
            {data.desc}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Cumulative Journey:</span>
            <strong style={{ color: '#fff' }}>{data.total} min ({Math.round(data.total / 60 * 10) / 10} hrs)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Remediation:</span>
            <strong style={{ color: '#38bdf8' }}>{data.action}</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
              Clinical Dwell-Time Accumulation Waterfall
            </h3>
            <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> Delay Decomposition
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Step-by-step diagnostic breakdown showing how an ideal 184 min patient trajectory expands to 418 min through administrative loops and shift queues.
          </p>
        </div>

        {/* What-If Simulation Toggle */}
        <button
          onClick={() => setSimulateCPOE(s => !s)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: simulateCPOE ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'rgba(255, 255, 255, 0.08)',
            border: simulateCPOE ? 'none' : '1px solid var(--border-color)',
            color: '#fff',
            borderRadius: '9px',
            padding: '8px 14px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: simulateCPOE ? '0 0 18px rgba(16, 185, 129, 0.4)' : 'none',
            transition: 'all 0.25s ease'
          }}
        >
          <Sparkles size={14} />
          {simulateCPOE ? '✓ CPOE Intervention Active (-90 min)' : '⚡ Simulate CPOE Digitalization'}
        </button>
      </div>

      {/* KPI Comparison Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ background: 'rgba(7, 11, 20, 0.75)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ideal Nominal Baseline</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>184 min (3.1h)</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Standard clinical treatment plan</div>
        </div>

        <div style={{ background: 'rgba(7, 11, 20, 0.75)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Average Stay</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>418 min (7.0h)</div>
          <div style={{ fontSize: '0.68rem', color: '#fb7185' }}>+234 min excess delay burden</div>
        </div>

        <div style={{ background: 'rgba(7, 11, 20, 0.75)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Optimized Potential (CPOE)</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>328 min (5.5h)</div>
          <div style={{ fontSize: '0.68rem', color: '#34d399' }}>Recaptures 90 min per patient</div>
        </div>

        <div style={{ background: 'rgba(7, 11, 20, 0.75)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Annual Recoverable Waste</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>$142,400</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Overtime & redundant triage hours</div>
        </div>
      </div>

      {/* Recharts Waterfall Chart */}
      <div style={{ width: '100%', height: '340px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={WATERFALL_DATA} margin={{ top: 20, right: 20, left: 0, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={10.5} tickLine={false} interval={0} angle={-15} textAnchor="end" />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} unit="m" domain={[0, 460]} />
            <Tooltip content={<CustomWaterfallTooltip />} />
            
            {/* Base transparent bar to float the delta */}
            <Bar dataKey="base" stackId="a" fill="transparent" />
            
            {/* Colored Delta Bar */}
            <Bar dataKey="delta" stackId="a" radius={[6, 6, 0, 0]} onClick={(data) => setSelectedStep(data)}>
              {WATERFALL_DATA.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  style={{
                    filter: selectedStep?.name === entry.name ? `drop-shadow(0 0 10px ${entry.color})` : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Bar>
            
            <ReferenceLine y={184} stroke="#38bdf8" strokeDasharray="4 4" label={{ value: 'Nominal Goal (184m)', fill: '#38bdf8', fontSize: 10, position: 'top' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Step Explanation */}
      {selectedStep && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem 1.25rem',
          background: 'rgba(7, 11, 20, 0.85)',
          borderRadius: '10px',
          border: `1.5px solid ${selectedStep.color}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: selectedStep.color }}>
              {selectedStep.name}: {selectedStep.isTotal ? `${selectedStep.total} min Total` : `+${selectedStep.delta} min Added Delay`}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {selectedStep.desc}
            </div>
          </div>
          <button
            onClick={() => setSelectedStep(null)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#fff',
              fontSize: '0.72rem',
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
