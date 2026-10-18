import React, { useState, useMemo } from 'react';
import { Grid3x3, Flame, Clock, Users, AlertCircle, ArrowUpRight } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Generate deterministic clinical surge telemetry for 168 hours
function generateHourlyData() {
  const data = [];
  DAYS.forEach((day, dayIdx) => {
    HOURS.forEach(hour => {
      // Deterministic patterns:
      // Morning rush: 8-11 AM, especially Mon, Tue, Fri
      const isMorningRush = hour >= 8 && hour <= 11;
      const isEveningSurge = hour >= 18 && hour <= 21;
      const isNight = hour >= 1 && hour <= 5;
      const isWeekend = dayIdx >= 5;

      let volume = 25;
      let waitMin = 18;
      let bottleneck = 'Nominal Operations';
      let alert = false;

      if (isMorningRush) {
        volume = isWeekend ? 65 : (day === 'Mon' ? 98 : (day === 'Fri' ? 92 : 84));
        waitMin = isWeekend ? 42 : (day === 'Mon' ? 58 : 52);
        bottleneck = 'Radiology Staffing Deficit (Single Tech)';
        alert = true;
      } else if (isEveningSurge) {
        volume = isWeekend ? 88 : 74;
        waitMin = isWeekend ? 50 : 38;
        bottleneck = 'Triage & Bed Admission Queue';
        alert = isWeekend;
      } else if (isNight) {
        volume = isWeekend ? 32 : 14;
        waitMin = 10;
        bottleneck = 'Off-Peak Low Latency';
      } else {
        volume = isWeekend ? 55 : 44;
        waitMin = 22;
        bottleneck = 'Standard Clinical Intake';
      }

      data.push({
        id: `${day}-${hour}`,
        day,
        dayIdx,
        hour,
        hourLabel: `${hour.toString().padStart(2, '0')}:00`,
        volume,
        waitMin,
        bottleneck,
        alert,
        intensity: Math.min(100, Math.round((volume / 100) * 100))
      });
    });
  });
  return data;
}

const HEATMAP_DATA = generateHourlyData();

export default function SurgeHeatmap24x7() {
  const [selectedShift, setSelectedShift] = useState('all'); // 'all', 'morning', 'evening', 'night'
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  // Helper to get cell color based on volume intensity
  const getCellColor = (item) => {
    if (item.volume >= 85) return 'rgba(244, 63, 94, 0.95)'; // Rose high surge
    if (item.volume >= 70) return 'rgba(249, 115, 22, 0.85)'; // Orange elevated
    if (item.volume >= 50) return 'rgba(234, 179, 8, 0.75)';  // Amber moderate
    if (item.volume >= 30) return 'rgba(6, 182, 212, 0.6)';   // Cyan nominal
    return 'rgba(30, 41, 59, 0.4)';                            // Deep slate low
  };

  const filteredData = useMemo(() => {
    if (selectedShift === 'morning') return HEATMAP_DATA.filter(d => d.hour >= 8 && d.hour <= 11);
    if (selectedShift === 'evening') return HEATMAP_DATA.filter(d => d.hour >= 18 && d.hour <= 21);
    if (selectedShift === 'night') return HEATMAP_DATA.filter(d => d.hour >= 1 && d.hour <= 5);
    return HEATMAP_DATA;
  }, [selectedShift]);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Header & Controls */}
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
              24/7 Emergency Department Surge & Congestion Heatmap Matrix
            </h3>
            <span className="badge badge-rose" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Flame size={12} /> 168-Hour Density Replay
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Hourly arrival velocity across all seven days of the week, pinpointing critical capacity saturation periods and queue delay accumulation.
          </p>
        </div>

        {/* Shift Presets */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(7, 11, 20, 0.75)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'all', label: 'All 24 Hours' },
            { id: 'morning', label: '🔥 Morning Rush (08:00 - 11:00)' },
            { id: 'evening', label: '⚡ Evening Peak (18:00 - 21:00)' },
            { id: 'night', label: '🌙 Night Low (01:00 - 05:00)' }
          ].map(shift => (
            <button
              key={shift.id}
              onClick={() => setSelectedShift(shift.id)}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                background: selectedShift === shift.id ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                color: selectedShift === shift.id ? '#22d3ee' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: selectedShift === shift.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {shift.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div style={{
        background: 'rgba(7, 11, 20, 0.95)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        padding: '1.25rem',
        overflowX: 'auto'
      }}>
        {/* Hour Header Numbers */}
        <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(24, 1fr)', gap: '4px', marginBottom: '6px' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>DAY</div>
          {HOURS.map(h => (
            <div
              key={h}
              style={{
                fontSize: '0.65rem',
                color: (h >= 8 && h <= 11) ? '#fb7185' : 'var(--text-muted)',
                fontWeight: (h >= 8 && h <= 11) ? 800 : 500,
                textAlign: 'center'
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* 7 Days Grid Rows */}
        {DAYS.map(day => (
          <div
            key={day}
            style={{
              display: 'grid',
              gridTemplateColumns: '50px repeat(24, 1fr)',
              gap: '4px',
              marginBottom: '4px',
              alignItems: 'center'
            }}
          >
            {/* Day Label */}
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f8fafc' }}>
              {day}
            </div>

            {/* 24 Hourly Cells */}
            {HOURS.map(hour => {
              const item = HEATMAP_DATA.find(d => d.day === day && d.hour === hour);
              const isHovered = hoveredCell?.id === item?.id;
              const isSelected = selectedCell?.id === item?.id;
              const isDimmed = selectedShift !== 'all' && (
                (selectedShift === 'morning' && (hour < 8 || hour > 11)) ||
                (selectedShift === 'evening' && (hour < 18 || hour > 21)) ||
                (selectedShift === 'night' && (hour < 1 || hour > 5))
              );

              return (
                <div
                  key={hour}
                  onMouseEnter={() => setHoveredCell(item)}
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={() => setSelectedCell(item)}
                  style={{
                    height: '24px',
                    borderRadius: '4px',
                    background: getCellColor(item),
                    opacity: isDimmed ? 0.15 : 1,
                    border: isHovered || isSelected ? '1.5px solid #fff' : '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                    zIndex: isHovered ? 10 : 1,
                    boxShadow: isHovered ? '0 0 12px rgba(255,255,255,0.6)' : 'none'
                  }}
                  title={`${day} ${item.hourLabel}: ${item.volume} patients, ${item.waitMin}m wait`}
                />
              );
            })}
          </div>
        ))}

        {/* Legend Temperature Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)'
        }}>
          <span>Density Scale:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Low (&lt;25)</span>
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'rgba(30, 41, 59, 0.5)' }} />
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'rgba(6, 182, 212, 0.6)' }} />
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'rgba(234, 179, 8, 0.75)' }} />
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'rgba(249, 115, 22, 0.85)' }} />
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'rgba(244, 63, 94, 0.95)' }} />
            <span>Critical (&gt;85 arrivals)</span>
          </div>
          <span style={{ color: '#fb7185', fontWeight: 700 }}>Peak Saturation: Mon 09:00 AM (98 arrivals, 58m wait)</span>
        </div>
      </div>

      {/* Hover / Selected Live Inspector */}
      {(hoveredCell || selectedCell) && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem 1.25rem',
          background: 'rgba(13, 20, 36, 0.95)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: getCellColor(hoveredCell || selectedCell),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              {(hoveredCell || selectedCell).hour}h
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
                {(hoveredCell || selectedCell).day} {(hoveredCell || selectedCell).hourLabel} - {(hoveredCell || selectedCell).hour + 1}:00
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Intake Volume: <strong style={{ color: '#fff' }}>{(hoveredCell || selectedCell).volume} patients</strong> • Avg Queue Latency: <strong style={{ color: '#fb7185' }}>{(hoveredCell || selectedCell).waitMin} mins</strong>
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.74rem',
            color: 'var(--text-secondary)',
            background: 'rgba(255,255,255,0.04)',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)'
          }}>
            <strong style={{ color: (hoveredCell || selectedCell).alert ? '#fb7185' : '#34d399' }}>
              {(hoveredCell || selectedCell).bottleneck}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}
