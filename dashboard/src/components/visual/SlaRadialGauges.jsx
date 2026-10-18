import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, TrendingUp, Info } from 'lucide-react';

const RADIAL_METRICS = [
  {
    id: 'first_pass',
    title: 'First-Pass Yield',
    value: 60.2,
    target: 85,
    unit: '%',
    status: 'CRITICAL',
    color: '#f43f5e',
    secondaryColor: '#fda4af',
    desc: 'Traces completing without paper requisition re-triage loop',
    benchmark: 'National High-Performance Benchmark: 85%',
    impact: '39.8% of X-Ray patients forced into loopback delay'
  },
  {
    id: 'sep1',
    title: 'CMS SEP-1 Sepsis Bundle',
    value: 84.6,
    target: 80,
    unit: '%',
    status: 'COMPLIANT',
    color: '#10b981',
    secondaryColor: '#6ee7b7',
    desc: '3-hour lactate, blood culture & broad-spectrum antibiotic SLA',
    benchmark: 'CMS Core Measure Compliance Threshold: 80%',
    impact: 'Zero financial penalties; optimal clinical bundle execution'
  },
  {
    id: 'door_to_doc',
    title: 'Door-to-Doctor Velocity',
    value: 91.4,
    target: 90,
    unit: '%',
    status: 'OPTIMAL',
    color: '#06b6d4',
    secondaryColor: '#67e8f9',
    desc: '< 30 min arrival to attending physician evaluation',
    benchmark: 'Emergency Nurses Association (ENA) Target: 90%',
    impact: 'Rapid initial diagnostic initiation prevents clinical decompensation'
  },
  {
    id: 'op18',
    title: 'CMS OP-18 ED Stay Length',
    value: 71.8,
    target: 80,
    unit: '%',
    status: 'AT RISK',
    color: '#f59e0b',
    secondaryColor: '#fcd34d',
    desc: 'Median ED dwell duration < 240 min for discharged patients',
    benchmark: 'Hospital Consumer Assessment Target: 80%',
    impact: 'Prolonged stays driven by morning radiology queue backlog'
  },
  {
    id: 'rad_tat',
    title: 'Radiology STAT Turnaround',
    value: 62.4,
    target: 80,
    unit: '%',
    status: 'CRITICAL',
    color: '#fb923c',
    secondaryColor: '#fdba74',
    desc: 'Imaging performed and preliminary report posted in < 45 min',
    benchmark: 'American College of Radiology Standard: 80%',
    impact: 'Morning surge (08:00-11:00 AM) creates 54 min avg wait'
  },
  {
    id: 'fitness',
    title: 'Token Replay Fitness',
    value: 94.9,
    target: 90,
    unit: '%',
    status: 'OPTIMAL',
    color: '#8b5cf6',
    secondaryColor: '#c4b5fd',
    desc: 'Petri net replay mathematical fitness score on 6,347 events',
    benchmark: 'IEEE Process Mining Benchmark: >90%',
    impact: 'High structural validity with 917 of 1,000 perfectly conforming traces'
  }
];

function RadialGaugeItem({ item, isSelected, onSelect }) {
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (item.value / 100) * circumference;
  const targetOffset = circumference - (item.target / 100) * circumference;

  const getStatusBadge = (status) => {
    if (status === 'OPTIMAL' || status === 'COMPLIANT') {
      return { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.35)', color: '#34d399', text: 'Compliant' };
    }
    if (status === 'AT RISK') {
      return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)', color: '#fbbf24', text: 'At Risk' };
    }
    return { bg: 'rgba(244, 63, 94, 0.15)', border: 'rgba(244, 63, 94, 0.35)', color: '#fb7185', text: 'Failing Target' };
  };

  const badge = getStatusBadge(item.status);

  return (
    <div
      onClick={() => onSelect(item)}
      style={{
        background: isSelected 
          ? `linear-gradient(135deg, rgba(17, 26, 48, 0.95), rgba(${item.color === '#f43f5e' ? '244,63,94' : '6,182,212'}, 0.15))`
          : 'rgba(11, 18, 33, 0.75)',
        border: isSelected ? `1.5px solid ${item.color}` : '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '1.25rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isSelected ? `0 10px 30px ${item.color}30` : '0 4px 16px rgba(0,0,0,0.25)',
      }}
    >
      {/* Target Marker Pill */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '0.65rem',
        padding: '2px 7px',
        borderRadius: '6px',
        background: badge.bg,
        border: `1px solid ${badge.border}`,
        color: badge.color,
        fontWeight: 700
      }}>
        {badge.text}
      </div>

      {/* Title */}
      <h4 style={{
        fontSize: '0.84rem',
        fontWeight: 700,
        color: '#f8fafc',
        marginBottom: '0.75rem',
        paddingRight: '45px',
        textAlign: 'left',
        width: '100%'
      }}>
        {item.title}
      </h4>

      {/* Circular SVG Gauge */}
      <div style={{ position: 'relative', width: '108px', height: '108px', margin: '0.5rem 0' }}>
        <svg width="108" height="108" viewBox="0 0 108 108" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track */}
          <circle
            cx="54"
            cy="54"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Target Reference Dashed Ring */}
          <circle
            cx="54"
            cy="54"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={strokeWidth - 4}
            strokeDasharray="2 4"
          />
          {/* Animated Value Ring */}
          <circle
            cx="54"
            cy="54"
            r={radius}
            fill="transparent"
            stroke={item.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 6px ${item.color}80)`
            }}
          />
        </svg>

        {/* Center Value */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {item.value}
            <span style={{ fontSize: '0.75rem', color: item.color, marginLeft: '1px' }}>{item.unit}</span>
          </span>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '3px' }}>
            Goal: {item.target}%
          </span>
        </div>
      </div>

      {/* Description Snippet */}
      <p style={{
        fontSize: '0.7rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.35,
        marginTop: '0.5rem',
        minHeight: '36px'
      }}>
        {item.desc}
      </p>

      {/* Delta indicator */}
      <div style={{
        marginTop: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.68rem',
        fontWeight: 600,
        color: item.value >= item.target ? '#34d399' : '#fb7185'
      }}>
        {item.value >= item.target ? (
          <>
            <TrendingUp size={12} />
            <span>+{(item.value - item.target).toFixed(1)}% vs target</span>
          </>
        ) : (
          <>
            <AlertTriangle size={12} />
            <span>{(item.value - item.target).toFixed(1)}% below target</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function SlaRadialGauges() {
  const [selectedMetric, setSelectedMetric] = useState(RADIAL_METRICS[0]);

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
              Executive Clinical SLA & Performance Radial Matrix
            </h3>
            <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} /> CMS & Joint Commission Standards
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Real-time compliance monitoring across core clinical hospital throughput, diagnostic velocity, and mathematical process fitness.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.74rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ color: 'var(--text-muted)' }}>Target Achieved (4/6)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#f43f5e' }} />
            <span style={{ color: 'var(--text-muted)' }}>Action Required (2/6)</span>
          </div>
        </div>
      </div>

      {/* Grid of 6 Radial Gauges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        {RADIAL_METRICS.map(item => (
          <RadialGaugeItem
            key={item.id}
            item={item}
            isSelected={selectedMetric?.id === item.id}
            onSelect={setSelectedMetric}
          />
        ))}
      </div>

      {/* Interactive Selected Deep-Dive Card */}
      {selectedMetric && (
        <div style={{
          background: 'rgba(7, 11, 20, 0.75)',
          border: `1px solid ${selectedMetric.color}40`,
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: `${selectedMetric.color}20`,
              border: `1.5px solid ${selectedMetric.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selectedMetric.color
            }}>
              {selectedMetric.value >= selectedMetric.target ? <CheckCircle size={22} /> : <AlertTriangle size={22} />}
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>
                {selectedMetric.title}: <span style={{ color: selectedMetric.color }}>{selectedMetric.value}{selectedMetric.unit}</span> (Target: {selectedMetric.target}%)
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                {selectedMetric.benchmark}
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            maxWidth: '450px'
          }}>
            <strong style={{ color: '#fff' }}>Clinical Impact: </strong>
            {selectedMetric.impact}
          </div>
        </div>
      )}
    </div>
  );
}
