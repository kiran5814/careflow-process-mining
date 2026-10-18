import React, { useState } from 'react';
import { Activity, Clock, AlertTriangle, ArrowRight, Layers, HelpCircle } from 'lucide-react';

const ACUITY_QUANTILES = [
  {
    acuity: 'ESI 1: Resuscitation',
    code: 'ESI-1',
    volume: 51,
    pct: '5.1%',
    p10: 22,
    p25: 35,
    median: 48,
    p75: 95,
    p90: 175,
    max: 240,
    outliers: [195, 215, 240],
    color: '#f43f5e',
    desc: 'Immediate life-threat. Rapid physician evaluation, but prolonged ICU bed boarding delay.'
  },
  {
    acuity: 'ESI 2: Emergent',
    code: 'ESI-2',
    volume: 220,
    pct: '22.0%',
    p10: 110,
    p25: 165,
    median: 215,
    p75: 290,
    p90: 380,
    max: 480,
    outliers: [410, 445, 480],
    color: '#f97316',
    desc: 'High clinical acuity. Extensive diagnostic panel, frequent CT and STAT cardiac biomarkers.'
  },
  {
    acuity: 'ESI 3: Urgent (Core Bottleneck)',
    code: 'ESI-3',
    volume: 460,
    pct: '46.0%',
    p10: 140,
    p25: 220,
    median: 295,
    p75: 395,
    p90: 490,
    max: 620,
    outliers: [515, 540, 585, 620],
    color: '#eab308',
    alert: true,
    desc: 'Largest cohort. 39.8% paper re-triage loop occurs almost exclusively in ESI-3 X-Ray visits.'
  },
  {
    acuity: 'ESI 4: Less Urgent',
    code: 'ESI-4',
    volume: 210,
    pct: '21.0%',
    p10: 60,
    p25: 95,
    median: 142,
    p75: 195,
    p90: 255,
    max: 330,
    outliers: [280, 310, 330],
    color: '#06b6d4',
    desc: 'Moderate localized symptoms. Single workup (plain film or basic labs); predictable throughput.'
  },
  {
    acuity: 'ESI 5: Non-Urgent',
    code: 'ESI-5',
    volume: 59,
    pct: '5.9%',
    p10: 30,
    p25: 45,
    median: 68,
    p75: 95,
    p90: 135,
    max: 180,
    outliers: [155, 180],
    color: '#10b981',
    desc: 'Minor ailments. Fast-track nurse practitioner care; rarely requires diagnostic imaging.'
  }
];

export default function AcuityBoxPlot() {
  const [selectedAcuity, setSelectedAcuity] = useState(ACUITY_QUANTILES[2]); // Default ESI-3
  const [viewUnit, setViewUnit] = useState('minutes'); // 'minutes', 'hours'

  // Coordinate scales: 0 to 650 minutes mapped across 700px SVG width
  const svgWidth = 720;
  const maxScale = 650;
  const scale = (val) => Math.round((val / maxScale) * svgWidth);

  const formatTime = (min) => {
    if (viewUnit === 'hours') {
      return `${(min / 60).toFixed(1)}h`;
    }
    return `${min}m`;
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
              Acuity Dwell-Time Quantile & Dispersion Visualizer
            </h3>
            <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={12} /> Box-and-Whisker P10-P90
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Statistical distribution of total emergency department dwell duration stratified by Emergency Severity Index (ESI 1-5).
          </p>
        </div>

        {/* Unit Toggle */}
        <div style={{ display: 'flex', background: 'rgba(7, 11, 20, 0.75)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setViewUnit('minutes')}
            style={{
              padding: '4px 10px',
              borderRadius: '5px',
              border: 'none',
              background: viewUnit === 'minutes' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: viewUnit === 'minutes' ? '#22d3ee' : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Minutes
          </button>
          <button
            onClick={() => setViewUnit('hours')}
            style={{
              padding: '4px 10px',
              borderRadius: '5px',
              border: 'none',
              background: viewUnit === 'hours' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: viewUnit === 'hours' ? '#22d3ee' : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Hours
          </button>
        </div>
      </div>

      {/* SVG Box-and-Whisker Graphic */}
      <div style={{
        background: 'rgba(7, 11, 20, 0.95)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        padding: '1.25rem',
        overflowX: 'auto'
      }}>
        {/* Scale Axis Markers */}
        <div style={{ marginLeft: '170px', position: 'relative', height: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '8px' }}>
          {[0, 100, 200, 300, 400, 500, 600].map(val => (
            <div
              key={val}
              style={{
                position: 'absolute',
                left: `${(val / maxScale) * 100}%`,
                fontSize: '0.66rem',
                color: 'var(--text-muted)',
                transform: 'translateX(-50%)'
              }}
            >
              {formatTime(val)}
            </div>
          ))}
        </div>

        {/* 5 Acuity Levels */}
        {ACUITY_QUANTILES.map((item, idx) => {
          const isSelected = selectedAcuity?.code === item.code;
          const boxLeft = scale(item.p25);
          const boxWidth = scale(item.p75) - boxLeft;
          const medianX = scale(item.median);
          const whiskerLeft = scale(item.p10);
          const whiskerRight = scale(item.p90);

          return (
            <div
              key={item.code}
              onClick={() => setSelectedAcuity(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 6px',
                borderRadius: '8px',
                background: isSelected ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: isSelected ? `1px solid ${item.color}50` : '1px solid transparent'
              }}
            >
              {/* Row Label */}
              <div style={{ width: '170px', flexShrink: 0, paddingRight: '12px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: item.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                  {item.code}
                  {item.alert && <span className="badge badge-amber" style={{ fontSize: '0.58rem', padding: '1px 4px' }}>Bottleneck</span>}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {item.volume} cases ({item.pct})
                </div>
              </div>

              {/* Graphic Plot Area */}
              <div style={{ flex: 1, position: 'relative', height: '36px', minWidth: '480px' }}>
                <svg width="100%" height="36" viewBox={`0 0 ${svgWidth} 36`} preserveAspectRatio="none">
                  {/* Grid background reference lines */}
                  {[100, 200, 300, 400, 500, 600].map(val => (
                    <line
                      key={val}
                      x1={scale(val)}
                      y1="0"
                      x2={scale(val)}
                      y2="36"
                      stroke="rgba(255,255,255,0.05)"
                      strokeDasharray="2 3"
                    />
                  ))}

                  {/* Whisker Line (P10 to P90) */}
                  <line
                    x1={whiskerLeft}
                    y1="18"
                    x2={whiskerRight}
                    y2="18"
                    stroke={item.color}
                    strokeWidth="2"
                    strokeOpacity="0.8"
                  />
                  {/* Whisker End Caps */}
                  <line x1={whiskerLeft} y1="11" x2={whiskerLeft} y2="25" stroke={item.color} strokeWidth="2" />
                  <line x1={whiskerRight} y1="11" x2={whiskerRight} y2="25" stroke={item.color} strokeWidth="2" />

                  {/* Interquartile Box (P25 to P75) */}
                  <rect
                    x={boxLeft}
                    y="6"
                    width={boxWidth}
                    height="24"
                    rx="4"
                    fill={`${item.color}35`}
                    stroke={item.color}
                    strokeWidth="1.8"
                    style={{
                      filter: isSelected ? `drop-shadow(0 0 6px ${item.color}80)` : 'none'
                    }}
                  />

                  {/* Median Line (P50) */}
                  <line
                    x1={medianX}
                    y1="4"
                    x2={medianX}
                    y2="32"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 4px #fff)' }}
                  />

                  {/* Outlier Dots (> P90) */}
                  {item.outliers.map((outlierVal, oIdx) => (
                    <circle
                      key={oIdx}
                      cx={scale(outlierVal)}
                      cy="18"
                      r="3.5"
                      fill="#f43f5e"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                  ))}
                </svg>
              </div>

              {/* Median Value Badge */}
              <div style={{ width: '90px', flexShrink: 0, textAlign: 'right', paddingLeft: '10px' }}>
                <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                  {formatTime(item.median)}
                </span>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Median Stay</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Acuity Details Callout */}
      {selectedAcuity && (
        <div style={{
          marginTop: '1.25rem',
          padding: '1.25rem',
          background: 'rgba(7, 11, 20, 0.85)',
          borderRadius: '12px',
          border: `1.5px solid ${selectedAcuity.color}40`,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: selectedAcuity.color, marginBottom: '2px' }}>
              {selectedAcuity.acuity}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
              {selectedAcuity.desc}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>25th Percentile</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a5b4fc' }}>{formatTime(selectedAcuity.p25)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Median (P50)</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{formatTime(selectedAcuity.median)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>75th Percentile</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a5b4fc' }}>{formatTime(selectedAcuity.p75)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>P90 Tail Risk</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fb7185' }}>{formatTime(selectedAcuity.p90)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
