import React, { useState } from 'react';
import { Grid3x3, Sun, Moon, Info, TrendingUp } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  if (i === 0) return '12am';
  if (i < 12) return `${i}am`;
  if (i === 12) return '12pm';
  return `${i - 12}pm`;
});

// Simulate realistic ER volume data
function generateHeatmapData() {
  const data = {};
  DAYS.forEach(day => {
    data[day] = {};
    HOURS.forEach((h, i) => {
      let base = 10;
      // Morning peak 7–11 AM
      if (i >= 7 && i <= 11) base = 60 + Math.random() * 40;
      // Lunch dip
      else if (i >= 12 && i <= 13) base = 30 + Math.random() * 20;
      // Evening peak 4–8 PM
      else if (i >= 16 && i <= 20) base = 50 + Math.random() * 35;
      // Night valley
      else if (i >= 23 || i <= 4) base = 5 + Math.random() * 8;
      // Normal
      else base = 25 + Math.random() * 20;

      // Weekend boost
      if (day === 'Sat' || day === 'Sun') base *= 1.2;
      // Monday spike
      if (day === 'Mon' && i >= 8 && i <= 10) base *= 1.35;

      data[day][h] = Math.round(base);
    });
  });
  return data;
}

const heatData = generateHeatmapData();

function getColor(val) {
  if (val < 15) return { bg: 'rgba(6,182,212,0.08)', text: 'rgba(6,182,212,0.5)' };
  if (val < 30) return { bg: 'rgba(6,182,212,0.2)', text: '#22d3ee' };
  if (val < 50) return { bg: 'rgba(245,158,11,0.25)', text: '#fbbf24' };
  if (val < 70) return { bg: 'rgba(244,63,94,0.3)', text: '#fb7185' };
  return { bg: 'rgba(239,68,68,0.5)', text: '#ff6b6b' };
}

function getTrend(day, mode = 'volume') {
  const vals = HOURS.map((h, i) => {
    const base = heatData[day][h];
    if (mode === 'wait') {
      if (i >= 8 && i <= 11) return Math.round(base * 0.9 + 10);
      return Math.round(base * 0.5 + 5);
    }
    return base;
  });
  const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  const peak = Math.max(...vals);
  const peakHour = HOURS[vals.indexOf(peak)];
  return { avg, peak, peakHour };
}

export default function PatientHeatmap() {
  const [mode, setMode] = useState('volume'); // 'volume' | 'wait'
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // Generate "wait time" variant
  const effectiveData = (day, h, i) => {
    const base = heatData[day][h];
    if (mode === 'wait') {
      // Morning peak hours have higher wait
      if (i >= 8 && i <= 11) return Math.round(base * 0.9 + 10);
      return Math.round(base * 0.5 + 5);
    }
    return base;
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
              <Grid3x3 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                Patient Volume Heatmap
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Weekly ER arrivals by hour — identify surge patterns and staffing gaps
              </p>
            </div>
          </div>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', background: 'rgba(17,26,48,0.7)', padding: '3px', borderRadius: '9px', border: '1px solid var(--border-color)', gap: '3px' }}>
          {[{ id: 'volume', label: '# Patients', icon: TrendingUp }, { id: 'wait', label: 'Avg Wait (min)', icon: Moon }].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.78rem',
              background: mode === m.id ? 'rgba(99,102,241,0.3)' : 'transparent',
              color: mode === m.id ? '#a5b4fc' : 'var(--text-secondary)',
              fontWeight: mode === m.id ? 700 : 500
            }}>
              <m.icon size={13} /> {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 900 }}>
          {/* Hour labels */}
          <div style={{ display: 'grid', gridTemplateColumns: '56px repeat(24, 1fr)', gap: '3px', marginBottom: '3px' }}>
            <div />
            {HOURS.map((h, i) => (
              <div key={h} style={{
                fontSize: '0.6rem', color: i === 0 || i % 3 === 0 ? 'var(--text-secondary)' : 'transparent',
                textAlign: 'center', fontFamily: 'var(--font-mono)', padding: '2px 0'
              }}>{h}</div>
            ))}
          </div>

          {/* Day rows */}
          {DAYS.map(day => (
            <div key={day} style={{ display: 'grid', gridTemplateColumns: '56px repeat(24, 1fr)', gap: '3px', marginBottom: '3px' }}>
              <div
                onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px',
                  fontSize: '0.74rem', fontWeight: 700, color: selectedDay === day ? '#22d3ee' : 'var(--text-secondary)',
                  cursor: 'pointer', borderRadius: '4px',
                  background: selectedDay === day ? 'rgba(6,182,212,0.1)' : 'transparent',
                  transition: 'all 0.15s'
                }}
              >{day}</div>
              {HOURS.map((h, i) => {
                const val = effectiveData(day, h, i);
                const { bg, text } = getColor(val);
                const isHovered = hoveredCell?.day === day && hoveredCell?.hour === h;
                return (
                  <div
                    key={h}
                    onMouseEnter={() => setHoveredCell({ day, hour: h, val, i })}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={`${day} ${h}: ${val} ${mode === 'volume' ? 'patients' : 'min wait'}`}
                    style={{
                      height: '26px', borderRadius: '4px',
                      background: isHovered ? 'rgba(255,255,255,0.15)' : bg,
                      border: isHovered ? `1px solid ${text}` : '1px solid transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.55rem', fontWeight: 700, color: isHovered ? '#fff' : (val > 30 ? text : 'transparent'),
                      cursor: 'default', transition: 'all 0.12s ease',
                      transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                      zIndex: isHovered ? 10 : 1, position: 'relative'
                    }}
                  >
                    {isHovered ? val : (val > 50 ? val : '')}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip / Hover Info */}
      {hoveredCell && (
        <div style={{
          marginTop: '0.75rem', padding: '8px 14px', borderRadius: '8px',
          background: 'rgba(10,16,30,0.85)', border: '1px solid rgba(6,182,212,0.3)',
          display: 'inline-flex', gap: '12px', fontSize: '0.78rem', color: '#f8fafc'
        }}>
          <span><strong>{hoveredCell.day}</strong> at <strong>{hoveredCell.hour}</strong></span>
          <span style={{ color: getColor(hoveredCell.val).text }}>
            {hoveredCell.val} {mode === 'volume' ? 'patients/hr' : 'min avg wait'}
          </span>
          {hoveredCell.i >= 8 && hoveredCell.i <= 11 && (
            <span style={{ color: '#f59e0b' }}>⚠ Morning Rush Window</span>
          )}
        </div>
      )}

      {/* Selected Day breakdown */}
      {selectedDay && (() => {
        const { avg, peak, peakHour } = getTrend(selectedDay, mode);
        const isWait = mode === 'wait';
        return (
          <div className="glass-panel" style={{
            marginTop: '1rem', padding: '1rem 1.25rem',
            background: 'rgba(10,16,30,0.7)', border: '1px solid rgba(99,102,241,0.3)'
          }}>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Selected Day: </span>
                <strong style={{ color: '#a5b4fc' }}>{selectedDay}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>{isWait ? 'Avg Hourly Wait: ' : 'Avg Hourly Volume: '}</span>
                <strong style={{ color: '#22d3ee' }}>{avg} {isWait ? 'min' : ''}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>{isWait ? 'Peak Wait Time: ' : 'Peak Volume: '}</span>
                <strong style={{ color: '#f43f5e' }}>{peak} {isWait ? 'min wait' : 'patients'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Peak Hour: </span>
                <strong style={{ color: '#fbbf24' }}>{peakHour}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Staffing Recommendation: </span>
                <strong style={{ color: '#10b981' }}>+{Math.ceil(peak / (isWait ? 20 : 15))} extra staff at {peakHour}</strong>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        <Info size={12} />
        <span>Intensity:</span>
        {[
          { label: 'Low', bg: 'rgba(6,182,212,0.2)' },
          { label: 'Moderate', bg: 'rgba(245,158,11,0.35)' },
          { label: 'High', bg: 'rgba(244,63,94,0.4)' },
          { label: 'Critical', bg: 'rgba(239,68,68,0.6)' },
        ].map(l => (
          <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: l.bg, display: 'inline-block' }} />
            {l.label}
          </span>
        ))}
        <span style={{ marginLeft: 'auto' }}>Click a day label to see breakdown</span>
      </div>
    </div>
  );
}
