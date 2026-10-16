import React, { useState, useEffect, useRef } from 'react';
import {
  Activity, AlertTriangle, CheckCircle2, Clock, UserPlus,
  Stethoscope, FlaskConical, Scan, HeartPulse, LogOut,
  Zap, RefreshCw, Filter, Pause, Play, ClipboardList as ClipboardCheck
} from 'lucide-react';

const ACTIVITY_TEMPLATES = [
  { type: 'arrival',     icon: UserPlus,     color: '#06b6d4',  label: 'Patient Arrival',         bg: 'rgba(6,182,212,0.1)',   badge: 'Arrival',   badgeClass: 'badge-cyan'    },
  { type: 'triage',      icon: ClipboardCheck, color: '#a5b4fc', label: 'Triage Assessment',       bg: 'rgba(99,102,241,0.1)',  badge: 'Triage',    badgeClass: 'badge-purple'  },
  { type: 'xray',        icon: Scan,          color: '#f59e0b',  label: 'Radiology Ordered',       bg: 'rgba(245,158,11,0.1)', badge: 'Radiology', badgeClass: 'badge-amber'   },
  { type: 'lab',         icon: FlaskConical,  color: '#818cf8',  label: 'Lab Test Ordered',        bg: 'rgba(129,140,248,0.1)', badge: 'Lab',       badgeClass: 'badge-purple'  },
  { type: 'consult',     icon: Stethoscope,   color: '#38bdf8',  label: 'Doctor Consultation',     bg: 'rgba(56,189,248,0.1)', badge: 'Consult',   badgeClass: 'badge-cyan'    },
  { type: 'treatment',   icon: HeartPulse,    color: '#10b981',  label: 'Treatment Initiated',     bg: 'rgba(16,185,129,0.1)', badge: 'Treatment', badgeClass: 'badge-emerald' },
  { type: 'discharge',   icon: LogOut,        color: '#34d399',  label: 'Patient Discharged',      bg: 'rgba(52,211,153,0.1)', badge: 'Discharge', badgeClass: 'badge-emerald' },
  { type: 'loopback',    icon: AlertTriangle, color: '#f43f5e',  label: 'Loopback: Missing Form',  bg: 'rgba(244,63,94,0.12)', badge: 'ALERT',     badgeClass: 'badge-rose'    },
  { type: 'loopback',    icon: AlertTriangle, color: '#f59e0b',  label: 'Re-triage Required',      bg: 'rgba(245,158,11,0.12)', badge: 'REWORK',   badgeClass: 'badge-amber'   },
  { type: 'admission',   icon: HeartPulse,    color: '#c084fc',  label: 'Inpatient Admission',     bg: 'rgba(192,132,252,0.1)', badge: 'Admit',    badgeClass: 'badge-purple'  },
];

const DOCTORS = ['Dr. Patel', 'Dr. Nguyen', 'Dr. Martinez', 'Dr. Kim', 'Dr. Singh', 'Dr. Adams'];
const SEVERITIES = ['Critical', 'Moderate', 'Minor', 'Stable'];
const SEV_COLORS = { Critical: '#f43f5e', Moderate: '#f59e0b', Minor: '#06b6d4', Stable: '#10b981' };

let globalId = 1;
function generateEvent() {
  const tmpl = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
  const sev = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  const doc = DOCTORS[Math.floor(Math.random() * DOCTORS.length)];
  const caseId = `CF-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const room = `ER-${Math.floor(Math.random() * 20) + 1}`;
  return {
    id: globalId++,
    ...tmpl,
    severity: sev,
    doctor: doc,
    caseId,
    room,
    timestamp: new Date(),
    duration: `${Math.floor(Math.random() * 55) + 5}m`,
  };
}

const MAX_EVENTS = 40;

export default function LiveActivityFeed() {
  const [events, setEvents] = useState(() => Array.from({ length: 12 }, () => generateEvent()));
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState('all');
  const [speed, setSpeed] = useState(2200); // ms between events
  const feedRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setEvents(prev => {
        const next = [generateEvent(), ...prev];
        return next.slice(0, MAX_EVENTS);
      });
    }, speed);
    return () => clearInterval(interval);
  }, [paused, speed]);

  // Auto-scroll to top on new events
  useEffect(() => {
    if (feedRef.current && !paused) {
      feedRef.current.scrollTop = 0;
    }
  }, [events.length]);

  const filtered = filter === 'all'
    ? events
    : filter === 'alerts'
    ? events.filter(e => e.type === 'loopback')
    : events.filter(e => e.type === filter);

  const alertCount = events.filter(e => e.type === 'loopback').length;

  const filterBtns = [
    { key: 'all',       label: 'All Events' },
    { key: 'alerts',    label: `⚠ Alerts (${alertCount})` },
    { key: 'arrival',   label: 'Arrivals' },
    { key: 'discharge', label: 'Discharges' },
    { key: 'xray',      label: 'Radiology' },
    { key: 'consult',   label: 'Consults' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
              <Activity size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Live ER Activity Feed
                <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                  <span className="live-dot" style={{ width: 6, height: 6 }} />
                  LIVE
                </span>
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Real-time EHR event stream simulation • {events.length} events captured
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Speed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <Zap size={13} />
            <span>Speed:</span>
            {[{ label: 'Slow', v: 4000 }, { label: 'Normal', v: 2200 }, { label: 'Fast', v: 900 }].map(s => (
              <button key={s.v} onClick={() => setSpeed(s.v)} style={{
                padding: '3px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: speed === s.v ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.05)',
                color: speed === s.v ? '#22d3ee' : 'var(--text-muted)',
                fontSize: '0.73rem', fontWeight: 600
              }}>{s.label}</button>
            ))}
          </div>

          <button onClick={() => setPaused(p => !p)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '8px',
            border: paused ? '1px solid #10b981' : '1px solid var(--border-color)',
            background: paused ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
            color: paused ? '#34d399' : 'var(--text-secondary)',
            fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer'
          }}>
            {paused ? <Play size={13} /> : <Pause size={13} />}
            {paused ? 'Resume' : 'Pause'}
          </button>

          <button onClick={() => setEvents(Array.from({ length: 12 }, () => generateEvent()))} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer'
          }}>
            <RefreshCw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {filterBtns.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
            border: filter === f.key ? '1px solid #06b6d4' : '1px solid var(--border-color)',
            background: filter === f.key ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)',
            color: filter === f.key ? '#22d3ee' : 'var(--text-secondary)',
            transition: 'all 0.15s ease'
          }}>{f.label}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
          Showing {filtered.length} events
        </span>
      </div>

      {/* Feed List */}
      <div ref={feedRef} style={{ maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filtered.map((ev, idx) => {
          const Icon = ev.icon;
          const isNew = idx === 0;
          return (
            <div key={ev.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 14px', borderRadius: '10px',
              background: isNew ? 'rgba(6,182,212,0.06)' : 'rgba(17,26,48,0.5)',
              border: ev.type === 'loopback' ? '1px solid rgba(244,63,94,0.35)' : '1px solid var(--border-color)',
              transition: 'all 0.3s ease',
              animation: isNew ? 'slideInFeed 0.35s ease' : undefined,
              opacity: idx > 25 ? 0.5 : 1,
            }}>
              {/* Icon */}
              <div style={{ padding: '7px', borderRadius: '8px', background: ev.bg, color: ev.color, flexShrink: 0 }}>
                <Icon size={15} />
              </div>

              {/* Main Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>{ev.label}</span>
                  <span className={`badge ${ev.badgeClass}`} style={{ fontSize: '0.65rem' }}>{ev.badge}</span>
                  {ev.type === 'loopback' && (
                    <span style={{ fontSize: '0.7rem', color: '#f43f5e', fontWeight: 600 }}>← Inefficiency Detected</span>
                  )}
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span>Case: <strong style={{ color: '#94a3b8' }}>{ev.caseId}</strong></span>
                  <span>Room: <strong style={{ color: '#94a3b8' }}>{ev.room}</strong></span>
                  <span>{ev.doctor}</span>
                  <span style={{ color: SEV_COLORS[ev.severity] }}>● {ev.severity}</span>
                </div>
              </div>

              {/* Time */}
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {ev.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />
                  {ev.duration}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Bar */}
      <div style={{
        marginTop: '1rem', padding: '10px 14px', borderRadius: '10px',
        background: 'rgba(10,16,30,0.6)', border: '1px solid var(--border-color)',
        display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.78rem'
      }}>
        {[
          { label: 'Total Events', value: events.length, color: '#06b6d4' },
          { label: 'Active Alerts', value: alertCount, color: '#f43f5e' },
          { label: 'Discharges', value: events.filter(e => e.type === 'discharge').length, color: '#10b981' },
          { label: 'Arrivals', value: events.filter(e => e.type === 'arrival').length, color: '#38bdf8' },
          { label: 'Loopbacks', value: events.filter(e => e.type === 'loopback').length, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>{s.label}:</span>
            <span style={{ fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
