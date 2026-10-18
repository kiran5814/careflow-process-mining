import React, { useState } from 'react';
import { Layers, Activity, AlertCircle, ArrowRight, Zap, Filter, CheckCircle2 } from 'lucide-react';

export default function PathwaySankey() {
  const [activeCohort, setActiveCohort] = useState('all'); // 'all', 'loopback', 'fast_track', 'admit'
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredFlow, setHoveredFlow] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  // Stage column definitions with responsive SVG coordinate mapping
  const COL_X = [50, 280, 520, 780];

  const NODES = [
    // Column 0: Intake & Triage
    { id: 'arrival', label: 'ED Arrival & Intake', col: 0, y: 70, height: 160, volume: 1000, pct: '100%', color: '#38bdf8', category: 'Intake' },
    { id: 'triage_std', label: 'Clinical Nurse Triage', col: 0, y: 250, height: 140, volume: 949, pct: '94.9%', color: '#06b6d4', category: 'Intake' },
    { id: 'triage_bypass', label: 'Emergency Protocol Bypass', col: 0, y: 410, height: 40, volume: 51, pct: '5.1%', color: '#f43f5e', category: 'Intake', alert: true },

    // Column 1: Medical Consultation & Diagnostics
    { id: 'doctor_consult', label: 'Physician Consultation', col: 1, y: 70, height: 150, volume: 968, pct: '96.8%', color: '#818cf8', category: 'Clinical' },
    { id: 'stat_labs', label: 'STAT Pathology Labs', col: 1, y: 240, height: 110, volume: 742, pct: '74.2%', color: '#a78bfa', category: 'Diagnostics' },
    { id: 'radiology_xray', label: 'Radiology / X-Ray', col: 1, y: 370, height: 90, volume: 580, pct: '58.0%', color: '#fb923c', category: 'Diagnostics', alert: true },

    // Column 2: Process Pathway & Loopback Verification
    { id: 'clean_path', label: 'First-Pass Direct Flow', col: 2, y: 90, height: 150, volume: 602, pct: '60.2%', color: '#10b981', category: 'Operational' },
    { id: 'rework_loop', label: 'Re-Triage Paperwork Loop', col: 2, y: 270, height: 140, volume: 398, pct: '39.8%', color: '#f43f5e', category: 'Operational', penalty: '+64m Dwell', alert: true },

    // Column 3: Clinical Disposition & Hospital Admission
    { id: 'discharge_home', label: 'Outpatient Discharge', col: 3, y: 70, height: 140, volume: 610, pct: '61.0%', color: '#34d399', category: 'Disposition' },
    { id: 'inpatient_admit', label: 'Inpatient Ward Admission', col: 3, y: 230, height: 90, volume: 280, pct: '28.0%', color: '#38bdf8', category: 'Disposition' },
    { id: 'icu_transfer', label: 'Critical Care / ICU', col: 3, y: 340, height: 45, volume: 85, pct: '8.5%', color: '#f59e0b', category: 'Disposition' },
    { id: 'lwbs', label: 'Left Without Being Seen', col: 3, y: 405, height: 25, volume: 25, pct: '2.5%', color: '#ef4444', category: 'Disposition', alert: true }
  ];

  // Flow links between nodes (source -> target) with volume, bezier heights, and duration
  const FLOWS = [
    { id: 'f1', from: 'arrival', to: 'triage_std', volume: 949, sy: 90, ty: 270, h: 42, color: '#06b6d4', duration: '6m avg', cohort: 'all' },
    { id: 'f2', from: 'arrival', to: 'triage_bypass', volume: 51, sy: 190, ty: 420, h: 10, color: '#f43f5e', duration: '2m fast', cohort: 'fast_track', alert: true },
    { id: 'f3', from: 'triage_std', to: 'doctor_consult', volume: 917, sy: 280, ty: 100, h: 38, color: '#818cf8', duration: '22m wait', cohort: 'all' },
    { id: 'f4', from: 'triage_bypass', to: 'doctor_consult', volume: 51, sy: 420, ty: 180, h: 10, color: '#f43f5e', duration: '4m stat', cohort: 'fast_track' },
    { id: 'f5', from: 'doctor_consult', to: 'stat_labs', volume: 742, sy: 130, ty: 260, h: 28, color: '#a78bfa', duration: '35m turn', cohort: 'all' },
    { id: 'f6', from: 'doctor_consult', to: 'radiology_xray', volume: 580, sy: 170, ty: 390, h: 24, color: '#fb923c', duration: '54m rush', cohort: 'loopback', alert: true },
    { id: 'f7', from: 'radiology_xray', to: 'rework_loop', volume: 398, sy: 400, ty: 300, h: 22, color: '#f43f5e', duration: '+64m lag', cohort: 'loopback', alert: true },
    { id: 'f8', from: 'radiology_xray', to: 'clean_path', volume: 182, sy: 380, ty: 190, h: 12, color: '#10b981', duration: '18m norm', cohort: 'all' },
    { id: 'f9', from: 'stat_labs', to: 'clean_path', volume: 420, sy: 270, ty: 120, h: 20, color: '#10b981', duration: '26m norm', cohort: 'all' },
    { id: 'f10', from: 'rework_loop', to: 'clean_path', volume: 398, sy: 310, ty: 160, h: 22, color: '#f43f5e', duration: 'Resolved', cohort: 'loopback' },
    { id: 'f11', from: 'clean_path', to: 'discharge_home', volume: 610, sy: 120, ty: 100, h: 32, color: '#34d399', duration: '24m admin', cohort: 'all' },
    { id: 'f12', from: 'clean_path', to: 'inpatient_admit', volume: 280, sy: 160, ty: 250, h: 18, color: '#38bdf8', duration: '68m bed', cohort: 'admit' },
    { id: 'f13', from: 'clean_path', to: 'icu_transfer', volume: 85, sy: 200, ty: 350, h: 9, color: '#f59e0b', duration: '32m stat', cohort: 'admit' },
    { id: 'f14', from: 'triage_std', to: 'lwbs', volume: 25, sy: 360, ty: 415, h: 6, color: '#ef4444', duration: '95m queue', cohort: 'all', alert: true }
  ];

  // Helper to generate smooth cubic bezier ribbon path
  const makeRibbonPath = (flow) => {
    const fromNode = NODES.find(n => n.id === flow.from);
    const toNode = NODES.find(n => n.id === flow.to);
    if (!fromNode || !toNode) return '';

    const x0 = COL_X[fromNode.col] + 130;
    const y0 = flow.sy;
    const x1 = COL_X[toNode.col];
    const y1 = flow.ty;
    const h = Math.max(flow.h, 6);

    const cp1x = x0 + (x1 - x0) * 0.5;
    const cp2x = x1 - (x1 - x0) * 0.5;

    // Top bezier curve, vertical line down, bottom reverse bezier, close
    return `M ${x0} ${y0} C ${cp1x} ${y0}, ${cp2x} ${y1}, ${x1} ${y1} L ${x1} ${y1 + h} C ${cp2x} ${y1 + h}, ${cp1x} ${y0 + h}, ${x0} ${y0 + h} Z`;
  };

  const filteredFlows = FLOWS.filter(f => {
    if (activeCohort === 'loopback') return f.cohort === 'loopback' || f.from === 'rework_loop' || f.to === 'rework_loop';
    if (activeCohort === 'fast_track') return f.cohort === 'fast_track' || f.from === 'triage_bypass';
    if (activeCohort === 'admit') return f.cohort === 'admit' || f.to === 'inpatient_admit' || f.to === 'icu_transfer';
    return true;
  });

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Header and Controls */}
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
              Interactive Patient Pathway Sankey Flow Stream
            </h3>
            <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={12} /> Real-Time Trace Replay
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Vectorized multi-stage flow dynamics mapping patient transition volumes, queue dwell friction, and loopback re-triage cycles.
          </p>
        </div>

        {/* Cohort Flow Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(7, 11, 20, 0.75)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'all', label: 'All 1,000 Cases' },
            { id: 'loopback', label: '⚠️ Loopback Cohort (398)' },
            { id: 'fast_track', label: '⚡ Bypass Cohort (51)' },
            { id: 'admit', label: '🏥 Admissions (365)' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveCohort(btn.id)}
              style={{
                padding: '5px 11px',
                borderRadius: '6px',
                border: 'none',
                background: activeCohort === btn.id ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                color: activeCohort === btn.id ? '#22d3ee' : 'var(--text-muted)',
                fontSize: '0.73rem',
                fontWeight: activeCohort === btn.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sankey SVG Visual Area */}
      <div style={{
        background: 'rgba(7, 11, 20, 0.95)',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        padding: '1rem',
        position: 'relative',
        overflowX: 'auto'
      }}>
        {/* Column Stage Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          marginBottom: '1rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <div>Stage 1: Arrival & Triage</div>
          <div style={{ paddingLeft: '1rem' }}>Stage 2: Diagnostics & Workup</div>
          <div style={{ paddingLeft: '1rem' }}>Stage 3: Verification & Loops</div>
          <div style={{ paddingLeft: '1rem' }}>Stage 4: Disposition Outcome</div>
        </div>

        <svg width="960" height="470" viewBox="0 0 960 470" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            {FLOWS.map(flow => (
              <linearGradient key={`grad-${flow.id}`} id={`grad-${flow.id}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={flow.color} stopOpacity={hoveredFlow?.id === flow.id ? 0.75 : 0.45} />
                <stop offset="100%" stopColor={flow.color} stopOpacity={hoveredFlow?.id === flow.id ? 0.9 : 0.6} />
              </linearGradient>
            ))}
          </defs>

          {/* Render Flow Ribbons */}
          {filteredFlows.map(flow => {
            const path = makeRibbonPath(flow);
            const isHovered = hoveredFlow?.id === flow.id;
            return (
              <g key={flow.id} style={{ cursor: 'pointer' }}>
                <path
                  d={path}
                  fill={`url(#grad-${flow.id})`}
                  stroke={isHovered ? '#fff' : flow.color}
                  strokeWidth={isHovered ? 1.5 : 0.5}
                  strokeOpacity={isHovered ? 0.9 : 0.3}
                  onMouseEnter={() => setHoveredFlow(flow)}
                  onMouseLeave={() => setHoveredFlow(null)}
                  onClick={() => setSelectedElement({ type: 'flow', data: flow })}
                  style={{
                    transition: 'all 0.2s ease',
                    filter: isHovered ? `drop-shadow(0 0 8px ${flow.color})` : 'none'
                  }}
                />
              </g>
            );
          })}

          {/* Render Node Rectangles */}
          {NODES.map(node => {
            const isHovered = hoveredNode?.id === node.id;
            const x = COL_X[node.col];
            const y = node.y;
            const width = 130;
            const height = node.height;

            return (
              <g
                key={node.id}
                transform={`translate(${x}, ${y})`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedElement({ type: 'node', data: node })}
                style={{ cursor: 'pointer' }}
              >
                {/* Node Box */}
                <rect
                  x="0"
                  y="0"
                  width={width}
                  height={height}
                  rx="8"
                  fill="rgba(13, 20, 36, 0.95)"
                  stroke={isHovered ? '#fff' : node.color}
                  strokeWidth={isHovered ? 2 : 1.2}
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 10px ${node.color})` : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />

                {/* Left Accent Color Strip */}
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height={height}
                  rx="2"
                  fill={node.color}
                />

                {/* Text Labels inside node */}
                <text
                  x="12"
                  y="20"
                  fill="#f8fafc"
                  fontSize="11"
                  fontWeight="700"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.label.length > 17 ? node.label.slice(0, 16) + '…' : node.label}
                </text>

                <text
                  x="12"
                  y="36"
                  fill={node.color}
                  fontSize="12"
                  fontWeight="800"
                  className="font-mono"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.volume} cases
                </text>

                <text
                  x="12"
                  y="50"
                  fill="var(--text-muted)"
                  fontSize="9.5"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.pct} of cohort
                </text>

                {node.alert && (
                  <g transform={`translate(${width - 20}, 8)`}>
                    <circle cx="6" cy="6" r="6" fill="#f43f5e" />
                    <text x="6" y="9.5" fill="#fff" fontSize="8" fontWeight="800" textAnchor="middle">!</text>
                  </g>
                )}

                {node.penalty && (
                  <rect
                    x="10"
                    y={height - 22}
                    width={width - 20}
                    height="16"
                    rx="4"
                    fill="rgba(244, 63, 94, 0.2)"
                    stroke="rgba(244, 63, 94, 0.4)"
                  />
                )}
                {node.penalty && (
                  <text
                    x={width / 2}
                    y={height - 11}
                    fill="#fb7185"
                    fontSize="8.5"
                    fontWeight="700"
                    textAnchor="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.penalty}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Live Hover Tooltip Overlay */}
        {hoveredFlow && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(11, 18, 33, 0.95)',
            border: `1.5px solid ${hoveredFlow.color}`,
            borderRadius: '10px',
            padding: '8px 14px',
            fontSize: '0.74rem',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontWeight: 800, color: hoveredFlow.color }}>
                {hoveredFlow.from.replace('_', ' ').toUpperCase()} ➔ {hoveredFlow.to.replace('_', ' ').toUpperCase()}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Volume: <strong>{hoveredFlow.volume} patients</strong> • Dwell Metric: <strong>{hoveredFlow.duration}</strong>
              </div>
            </div>
            {hoveredFlow.alert && (
              <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>Active Friction</span>
            )}
          </div>
        )}
      </div>

      {/* Selected Node Details Drawer */}
      {selectedElement && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem 1.25rem',
          background: 'rgba(13, 20, 36, 0.85)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '12px', height: '12px', borderRadius: '50%',
              background: selectedElement.data.color || '#38bdf8',
              boxShadow: `0 0 10px ${selectedElement.data.color}`
            }} />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fff' }}>
                {selectedElement.type === 'node' ? selectedElement.data.label : `${selectedElement.data.from} to ${selectedElement.data.to}`}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {selectedElement.type === 'node' ? `Category: ${selectedElement.data.category} • Total Volume: ${selectedElement.data.volume} cases (${selectedElement.data.pct})` : `Volume: ${selectedElement.data.volume} cases • Duration: ${selectedElement.data.duration}`}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedElement(null)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            Close Inspector
          </button>
        </div>
      )}
    </div>
  );
}
