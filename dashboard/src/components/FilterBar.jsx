import React from 'react';
import { Filter, RotateCcw, Users, Calendar, AlertCircle } from 'lucide-react';

export default function FilterBar({ filters, setFilters, totalFilteredCases, totalCases }) {
  const handleReset = () => {
    setFilters({
      severity: 'ALL',
      ageGroup: 'ALL',
      gender: 'ALL',
      timeSlot: 'ALL'
    });
  };

  const isFiltered = filters.severity !== 'ALL' || filters.ageGroup !== 'ALL' || filters.gender !== 'ALL' || filters.timeSlot !== 'ALL';

  return (
    <div style={{
      background: 'rgba(13, 20, 36, 0.75)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '0.85rem 1.25rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700 }}>
          <Filter size={15} />
          <span>COHORT FILTERS:</span>
        </div>

        {/* Severity filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Acuity:</span>
          {['ALL', 'Low', 'Medium', 'High'].map((sev) => {
            const active = filters.severity === sev;
            return (
              <button
                key={sev}
                onClick={() => setFilters({ ...filters, severity: sev })}
                style={{
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: active ? 700 : 500,
                  border: active ? '1px solid #06b6d4' : '1px solid rgba(148, 163, 184, 0.15)',
                  background: active ? 'rgba(6, 182, 212, 0.2)' : 'rgba(17, 26, 48, 0.5)',
                  color: active ? '#22d3ee' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {sev}
              </button>
            );
          })}
        </div>

        {/* Age Group filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Age:</span>
          {['ALL', '0-17', '18-40', '41-60', '61+'].map((age) => {
            const active = filters.ageGroup === age;
            return (
              <button
                key={age}
                onClick={() => setFilters({ ...filters, ageGroup: age })}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: active ? 700 : 500,
                  border: active ? '1px solid #6366f1' : '1px solid rgba(148, 163, 184, 0.15)',
                  background: active ? 'rgba(99, 102, 241, 0.2)' : 'rgba(17, 26, 48, 0.5)',
                  color: active ? '#a5b4fc' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {age}
              </button>
            );
          })}
        </div>

        {/* Gender filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gender:</span>
          {['ALL', 'Male', 'Female'].map((g) => {
            const active = filters.gender === g;
            return (
              <button
                key={g}
                onClick={() => setFilters({ ...filters, gender: g })}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: active ? 700 : 500,
                  border: active ? '1px solid #10b981' : '1px solid rgba(148, 163, 184, 0.15)',
                  background: active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(17, 26, 48, 0.5)',
                  color: active ? '#34d399' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter status & Reset button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Active Sample: <strong style={{ color: '#fff' }}>{totalFilteredCases}</strong> / {totalCases} cases
        </div>

        {isFiltered && (
          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#fb7185',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
