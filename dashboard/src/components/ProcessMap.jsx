import React, { useState } from 'react';
import { 
  Scan, ClipboardList, Activity, Stethoscope, HeartPulse, 
  FlaskConical, CheckCircle, Building2, UserPlus, Info, 
  AlertTriangle, Clock, ArrowRight, Eye, RefreshCcw 
} from 'lucide-react';
import { PROCESS_NODES, PROCESS_EDGES } from '../data/processData';

const ICON_MAP = {
  UserPlus: UserPlus,
  ClipboardList: ClipboardList,
  Activity: Activity,
  Scan: Scan,
  FlaskConical: FlaskConical,
  Stethoscope: Stethoscope,
  HeartPulse: HeartPulse,
  CheckCircle: CheckCircle,
  Building2: Building2,
};

export default function ProcessMap() {
  const [selectedNode, setSelectedNode] = useState(PROCESS_NODES.find(n => n.id === 'xray'));
  const [metricMode, setMetricMode] = useState('frequency'); // 'frequency' or 'time'
  const [showLoopbackOnly, setShowLoopbackOnly] = useState(false);

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
              Directly-Follows Graph (DFG) Process Map
            </h3>
            <span className="badge badge-cyan">Interactive Discovery</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            EHR transition topology derived from patient timestamps. Notice the major loopback between X-Ray and Triage.
          </p>
        </div>

        {/* View mode toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              Transition Duration
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
            <span>Highlight Bottleneck Loop</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
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
          {/* THE BIG HIGHLIGHTED BOTTLENECK LOOP: X-RAY BACK TO TRIAGE       */}
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
          
          {/* Animated Warning Badge on Loopback */}
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

      {/* Node Inspector Drawer */}
      {selectedNode && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          background: 'rgba(10, 16, 30, 0.8)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              padding: '10px',
              borderRadius: '10px',
              background: selectedNode.id === 'xray' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.2)',
              color: selectedNode.id === 'xray' ? '#f59e0b' : '#06b6d4'
            }}>
              <Info size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                  Stage Inspector: {selectedNode.label}
                </h4>
                {selectedNode.alert && (
                  <span className="badge badge-amber">{selectedNode.alert}</span>
                )}
                {selectedNode.reworkCount && (
                  <span className="badge badge-purple">Rework Target ({selectedNode.reworkCount} cases)</span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Activity throughput: <strong>{selectedNode.totalExecutions}</strong> executions • Mean Duration: <strong>{selectedNode.avgDuration}</strong>
                {selectedNode.waitTime && <> • Mean Wait Time: <strong>{selectedNode.waitTime}</strong></>}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {selectedNode.id === 'xray' && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: '#fbbf24'
              }}>
                <strong>Recommendation:</strong> Digitize radiology requisition forms at Triage to eliminate the 40% bounce rate.
              </div>
            )}
            <button
              onClick={() => setSelectedNode(null)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
