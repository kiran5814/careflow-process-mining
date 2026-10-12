import React, { useState, useEffect } from 'react';
import { 
  Scan, ClipboardList, Activity, Stethoscope, HeartPulse, 
  FlaskConical, CheckCircle, Building2, UserPlus, Info, 
  AlertTriangle, Clock, ArrowRight, Eye, RefreshCcw, Play, Pause, RotateCcw, FastForward 
} from 'lucide-react';
import { PROCESS_NODES, PROCESS_EDGES } from '../data/processData';

export default function ProcessMap() {
  const [selectedNode, setSelectedNode] = useState(PROCESS_NODES.find(n => n.id === 'xray'));
  const [metricMode, setMetricMode] = useState('frequency'); // 'frequency' or 'time'
  const [showLoopbackOnly, setShowLoopbackOnly] = useState(false);

  // Live Token Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const [simTick, setSimTick] = useState(0);

  useEffect(() => {
    let animId;
    if (isSimulating) {
      const interval = setInterval(() => {
        setSimTick((prev) => (prev + 1) % 100);
      }, 50 / simSpeed);
      return () => clearInterval(interval);
    }
  }, [isSimulating, simSpeed]);

  // Interpolated Token Coordinates
  const getSimTokenPos = (t, startX, startY, endX, endY) => {
    const frac = ((t) % 100) / 100;
    return {
      x: startX + (endX - startX) * frac,
      y: startY + (endY - startY) * frac
    };
  };

  // Loopback Arc Token Position (parametric curve)
  const getLoopbackTokenPos = (t) => {
    const frac = ((t) % 100) / 100;
    // Curve between (575, 80) up to control point (485, 10) down to (395, 145)
    const p0 = { x: 575, y: 80 };
    const p1 = { x: 485, y: -5 };
    const p2 = { x: 395, y: 145 };
    const x = Math.pow(1 - frac, 2) * p0.x + 2 * (1 - frac) * frac * p1.x + Math.pow(frac, 2) * p2.x;
    const y = Math.pow(1 - frac, 2) * p0.y + 2 * (1 - frac) * frac * p1.y + Math.pow(frac, 2) * p2.y;
    return { x, y };
  };

  const tok1 = getSimTokenPos(simTick, 60, 180, 190, 180);
  const tok2 = getSimTokenPos((simTick + 25) % 100, 190, 180, 350, 180);
  const tok3 = getSimTokenPos((simTick + 50) % 100, 350, 180, 530, 100);
  const tokLoop = getLoopbackTokenPos((simTick + 60) % 100);
  const tok4 = getSimTokenPos((simTick + 30) % 100, 530, 100, 710, 180);
  const tok5 = getSimTokenPos((simTick + 70) % 100, 710, 180, 880, 180);
  const tok6 = getSimTokenPos((simTick + 85) % 100, 880, 180, 1050, 120);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      {/* Header and Controls */}
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
              Directly-Follows Graph (DFG) Process Map & Token Simulator
            </h3>
            <span className="badge badge-cyan">Interactive Discovery</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            EHR transition topology derived from patient timestamps. Notice the major loopback between X-Ray and Triage.
          </p>
        </div>

        {/* View Mode & Simulation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Simulation Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(10, 16, 30, 0.85)',
            border: isSimulating ? '1px solid #10b981' : '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '4px 8px'
          }}>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                background: isSimulating ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)',
                color: isSimulating ? '#f87171' : '#34d399',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isSimulating ? <Pause size={13} /> : <Play size={13} />}
              <span>{isSimulating ? 'Pause Replay' : 'Play Simulation'}</span>
            </button>

            {isSimulating && (
              <div style={{ display: 'flex', gap: '3px' }}>
                {[1, 2, 4].map(s => (
                  <button
                    key={s}
                    onClick={() => setSimSpeed(s)}
                    style={{
                      padding: '3px 6px',
                      borderRadius: '4px',
                      border: 'none',
                      background: simSpeed === s ? '#06b6d4' : 'transparent',
                      color: simSpeed === s ? '#fff' : 'var(--text-muted)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Metric Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(10, 16, 30, 0.7)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setMetricMode('frequency')}
              style={{
                background: metricMode === 'frequency' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                color: metricMode === 'frequency' ? '#22d3ee' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Case Frequency
            </button>
            <button
              onClick={() => setMetricMode('time')}
              style={{
                background: metricMode === 'time' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                color: metricMode === 'time' ? '#a5b4fc' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Duration
            </button>
          </div>

          <button
            onClick={() => setShowLoopbackOnly(!showLoopbackOnly)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: showLoopbackOnly ? '1px solid #f59e0b' : '1px solid var(--border-color)',
              background: showLoopbackOnly ? 'rgba(245, 158, 11, 0.2)' : 'rgba(17, 26, 48, 0.6)',
              color: showLoopbackOnly ? '#fbbf24' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <AlertTriangle size={14} color={showLoopbackOnly ? '#fbbf24' : '#f59e0b'} />
            <span>Bottleneck Loop</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas with Token Replay */}
      <div style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at center, rgba(17, 26, 48, 0.5) 0%, rgba(7, 11, 20, 0.95) 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Subtle grid pattern background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none'
        }} />

        <svg viewBox="0 0 1180 360" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            {/* Arrowhead markers */}
            <marker id="arrow-cyan" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#06b6d4" />
            </marker>
            <marker id="arrow-amber" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
              <polygon points="0 0, 9 4.5, 0 9" fill="#f59e0b" />
            </marker>
            <marker id="arrow-rose" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#f43f5e" />
            </marker>
            <marker id="arrow-slate" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#64748b" />
            </marker>

            {/* Glowing filter */}
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Regular Flow Edges */}
          {/* Start -> Reg */}
          <path d="M 120 180 L 190 180" stroke="#06b6d4" strokeWidth="3" markerEnd="url(#arrow-cyan)" className="animated-flow-line" />
          
          {/* Reg -> Triage */}
          <path d="M 280 180 L 350 180" stroke="#06b6d4" strokeWidth="4" markerEnd="url(#arrow-cyan)" className="animated-flow-line" />

          {/* Anomaly: Reg -> Consult bypass (routed along bottom to avoid loopback collision) */}
          <path d="M 235 210 C 235 320, 710 320, 710 215" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5 5" markerEnd="url(#arrow-rose)" opacity={showLoopbackOnly ? 0.2 : 0.85} />
          <text x="475" y="332" fill="#fb7185" fontSize="10.5" fontWeight="600" textAnchor="middle">
            5.1% Triage Skip Anomaly (51 cases)
          </text>

          {/* Triage -> X-Ray */}
          <path d="M 440 160 C 470 140, 480 120, 530 115" fill="none" stroke="#38bdf8" strokeWidth="3.5" markerEnd="url(#arrow-cyan)" className="animated-flow-line" />
          
          {/* Triage -> Lab */}
          <path d="M 440 200 C 470 230, 480 250, 530 255" fill="none" stroke="#818cf8" strokeWidth="2.5" markerEnd="url(#arrow-cyan)" />

          {/* Triage -> Consult (direct) */}
          <path d="M 440 180 L 710 180" stroke="#06b6d4" strokeWidth="3" markerEnd="url(#arrow-cyan)" opacity={showLoopbackOnly ? 0.2 : 0.6} />

          {/* X-Ray -> Consult */}
          <path d="M 620 115 C 660 120, 680 150, 710 165" fill="none" stroke="#38bdf8" strokeWidth="3.5" markerEnd="url(#arrow-cyan)" />

          {/* Lab -> Consult */}
          <path d="M 620 255 C 660 240, 680 210, 710 195" fill="none" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arrow-cyan)" />

          {/* Consult -> Treatment */}
          <path d="M 800 180 L 880 180" stroke="#06b6d4" strokeWidth="4" markerEnd="url(#arrow-cyan)" className="animated-flow-line" />

          {/* Treatment -> Discharge */}
          <path d="M 970 165 C 1000 150, 1015 135, 1050 125" fill="none" stroke="#10b981" strokeWidth="3.5" markerEnd="url(#arrow-cyan)" />

          {/* Treatment -> Admit */}
          <path d="M 970 195 C 1000 210, 1015 225, 1050 235" fill="none" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow-amber)" />

          {/* ============================================================== */}
          {/* THE HIGHLIGHTED BOTTLENECK LOOP: X-RAY BACK TO TRIAGE           */}
          {/* ============================================================== */}
          <path 
            d="M 575 80 C 575 15, 395 15, 395 145" 
            fill="none" 
            stroke="#f59e0b" 
            strokeWidth={showLoopbackOnly ? "4.5" : "3.5"} 
            markerEnd="url(#arrow-amber)" 
            filter="url(#glow-amber)"
            className="warning-flow-line" 
          />
          
          {/* Warning Badge on Loopback */}
          <g transform="translate(485, 20)">
            <rect x="-85" y="-12" width="170" height="24" rx="12" fill="#1e1808" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="-68" cy="0" r="4" fill="#f59e0b" />
            <text x="-56" y="4" fill="#fbbf24" fontSize="11" fontWeight="700">
              REWORK LOOP: 39.8%
            </text>
          </g>
          <text x="485" y="44" fill="#fcd34d" fontSize="9.5" fontWeight="500" textAnchor="middle">
            (Missing Paperwork → Sent Back to Triage)
          </text>

          {/* Edge Label annotations based on Metric Mode */}
          {metricMode === 'frequency' ? (
            <>
              <text x="490" y="145" fill="#94a3b8" fontSize="10" textAnchor="middle">598 cases (60%)</text>
              <text x="490" y="275" fill="#94a3b8" fontSize="10" textAnchor="middle">352 cases (35%)</text>
              <text x="840" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">1,000 cases</text>
            </>
          ) : (
            <>
              <text x="490" y="145" fill="#f59e0b" fontSize="10" fontWeight="600" textAnchor="middle">Wait: 42m (Peak 65m)</text>
              <text x="490" y="275" fill="#94a3b8" fontSize="10" textAnchor="middle">Wait: 18m</text>
              <text x="840" y="172" fill="#94a3b8" fontSize="10" textAnchor="middle">Wait: 8m</text>
            </>
          )}

          {/* ============================================================== */}
          {/* SIMULATED IN-FLIGHT PATIENT TOKENS (WHEN ACTIVE)                */}
          {/* ============================================================== */}
          {isSimulating && (
            <g>
              {/* Token 1: Arrival to Reg */}
              <circle cx={tok1.x} cy={tok1.y} r="6" fill="#38bdf8" filter="url(#glow-cyan)" />
              {/* Token 2: Reg to Triage */}
              <circle cx={tok2.x} cy={tok2.y} r="6" fill="#38bdf8" filter="url(#glow-cyan)" />
              {/* Token 3: Triage to X-Ray */}
              <circle cx={tok3.x} cy={tok3.y} r="6" fill="#38bdf8" filter="url(#glow-cyan)" />
              {/* Token Loop: X-Ray back to Triage (Loopback) */}
              <circle cx={tokLoop.x} cy={tokLoop.y} r="7" fill="#f59e0b" filter="url(#glow-amber)">
                <animate attributeName="r" values="6;9;6" dur="0.8s" repeatCount="indefinite" />
              </circle>
              {/* Token 4: X-Ray to Consult */}
              <circle cx={tok4.x} cy={tok4.y} r="6" fill="#38bdf8" filter="url(#glow-cyan)" />
              {/* Token 5: Consult to Treatment */}
              <circle cx={tok5.x} cy={tok5.y} r="6" fill="#38bdf8" filter="url(#glow-cyan)" />
              {/* Token 6: Treatment to Discharge */}
              <circle cx={tok6.x} cy={tok6.y} r="6" fill="#10b981" filter="url(#glow-cyan)" />
            </g>
          )}

          {/* ============================================================== */}
          {/* NODES                                                          */}
          {/* ============================================================== */}
          {PROCESS_NODES.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isBottleneck = node.id === 'xray';
            const isTriage = node.id === 'triage';
            const width = node.type === 'start' || node.type === 'end' ? 80 : 90;
            const height = 54;
            const rx = 10;
            const x = node.x - width / 2;
            const y = node.y - height / 2;

            let borderColor = 'rgba(148, 163, 184, 0.25)';
            let bgColor = '#111a30';
            if (isBottleneck) {
              borderColor = '#f59e0b';
              bgColor = 'rgba(245, 158, 11, 0.15)';
            } else if (isTriage) {
              borderColor = '#06b6d4';
              bgColor = 'rgba(6, 182, 212, 0.15)';
            } else if (isSelected) {
              borderColor = '#38bdf8';
            }

            return (
              <g 
                key={node.id} 
                onClick={() => setSelectedNode(node)} 
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {/* Node Box */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx={rx}
                  fill={bgColor}
                  stroke={borderColor}
                  strokeWidth={isSelected ? 2.5 : (isBottleneck ? 2 : 1)}
                  filter={isBottleneck ? "url(#glow-amber)" : undefined}
                />

                {/* Node Name */}
                <text
                  x={node.x}
                  y={node.y - 6}
                  fill={isBottleneck ? "#fbbf24" : "#ffffff"}
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {node.label}
                </text>

                {/* Node Metric Line */}
                <text
                  x={node.x}
                  y={node.y + 11}
                  fill={isBottleneck ? "#fca5a5" : "#94a3b8"}
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {metricMode === 'frequency' 
                    ? `${node.totalExecutions}x` 
                    : `dur: ${node.avgDuration}`}
                </text>

                {/* Bottleneck Badge */}
                {isBottleneck && (
                  <g transform={`translate(${node.x + width/2 - 6}, ${y - 4})`}>
                    <circle r="7" fill="#ef4444" />
                    <text y="3" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">!</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hospital Clinical Node Inspector Drawer */}
      {selectedNode && (
        <div style={{
          marginTop: '1rem',
          padding: '1.25rem 1.5rem',
          borderRadius: '12px',
          background: 'rgba(10, 16, 30, 0.9)',
          border: `1px solid ${selectedNode.id === 'xray' ? '#f59e0b' : selectedNode.id === 'triage' ? '#06b6d4' : 'var(--border-color)'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '10px',
                borderRadius: '10px',
                background: selectedNode.id === 'xray' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                color: selectedNode.id === 'xray' ? '#f59e0b' : '#06b6d4'
              }}>
                <Info size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    Clinical Stage Inspector: {selectedNode.label}
                  </h4>
                  {selectedNode.alert && (
                    <span className="badge badge-rose">{selectedNode.alert}</span>
                  )}
                  {selectedNode.reworkCount && (
                    <span className="badge badge-amber">Paperwork Rework Loop ({selectedNode.reworkCount} cases)</span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Total Ingested Events: <strong style={{ color: '#fff' }}>{selectedNode.totalExecutions.toLocaleString()} executions</strong> • Mean Clinical Duration: <strong style={{ color: '#38bdf8' }}>{selectedNode.avgDuration}</strong>
                  {selectedNode.waitTime && <> • Mean Queue Wait: <strong style={{ color: selectedNode.id === 'xray' ? '#f43f5e' : '#fbbf24' }}>{selectedNode.waitTime}</strong></>}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                padding: '5px 12px',
                borderRadius: '7px',
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
            >
              Close Inspector
            </button>
          </div>

          {/* Hospital Operational Metadata Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '8px',
            background: 'rgba(7, 11, 20, 0.6)',
            padding: '10px 12px',
            borderRadius: '9px',
            fontSize: '0.74rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Clinical Staffing:</span>
              <div style={{ color: '#e2e8f0', fontWeight: 600 }}>
                {selectedNode.id === 'xray' && '1 Lead Radiologic Technologist (Staff Deficit in AM)'}
                {selectedNode.id === 'triage' && '2 Clinical Triage RNs (ESI Protocol Assessment)'}
                {selectedNode.id === 'consult' && '5 Attending Emergency Physicians on Rotation'}
                {selectedNode.id === 'reg' && 'Patient Intake Specialists & Bedside Registrar'}
                {selectedNode.id === 'lab' && 'Medical Laboratory Technicians (Automated Stat Chemistry)'}
                {selectedNode.id === 'treatment' && 'Bedside Acute Care RNs & Clinical Techs'}
                {selectedNode.id === 'discharge' && 'Discharge Navigation Nurse & Case Manager'}
                {selectedNode.id === 'admit' && 'Hospital Bed Access & Inpatient Transport Team'}
                {selectedNode.id === 'start' && 'EMS Paramedic Handover & Ambulance Bay Staff'}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>Hospital Resource / Equipment:</span>
              <div style={{ color: '#e2e8f0', fontWeight: 600 }}>
                {selectedNode.id === 'xray' && 'GE Discovery XR656 Digital Radiography Suite'}
                {selectedNode.id === 'triage' && 'Welch Allyn Connex Spot Vital Monitors (ESI 1-5)'}
                {selectedNode.id === 'consult' && 'Epic CPOE Clinical Workstation & Dictation Mic'}
                {selectedNode.id === 'reg' && 'RFID Patient Wristband & EHR Intake Portal'}
                {selectedNode.id === 'lab' && 'Roche Cobas 6000 Automated Analyzer'}
                {selectedNode.id === 'treatment' && 'Alaris Smart IV Pumps & Crash Cart Access'}
                {selectedNode.id === 'discharge' && 'Pharmacy Outpatient Dispenser & AVS Print'}
                {selectedNode.id === 'admit' && 'Tele-Tracking Hospital Bed Management System'}
                {selectedNode.id === 'start' && 'Ambulance Influx Bay & Walk-in Entrance'}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>SLA Quality Benchmark:</span>
              <div style={{ color: selectedNode.id === 'xray' ? '#f59e0b' : '#34d399', fontWeight: 700 }}>
                {selectedNode.id === 'xray' && 'Target < 20 min (Breached at 42m mean)'}
                {selectedNode.id === 'triage' && 'Target < 15 min Door-to-Triage (Optimal: 9m)'}
                {selectedNode.id === 'consult' && 'Door-to-Doctor < 30 min (Actual: 41m)'}
                {selectedNode.id === 'reg' && 'Registration < 5 min (Optimal: 3m)'}
                {selectedNode.id === 'lab' && 'Stat Lab Turnaround < 30 min (Optimal: 18m)'}
                {selectedNode.id === 'treatment' && 'Immediate Order Execution (Optimal)'}
                {selectedNode.id === 'discharge' && 'Discharge Handover < 15 min (Optimal: 10m)'}
                {selectedNode.id === 'admit' && 'ED Boarding < 4 hours (Warning: 4h 12m)'}
                {selectedNode.id === 'start' && 'Immediate EMS Triage Handover < 10m'}
              </div>
            </div>
          </div>

          {/* Root Cause Clinical Action */}
          {selectedNode.id === 'xray' && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={16} />
              <span>
                <strong>Clinical Remediation:</strong> 398 patient visits exhibit X-Ray → Triage loopback due to missing paper requisitions. Enforce digital CPOE electronic order entry checklist during initial nursing triage.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
