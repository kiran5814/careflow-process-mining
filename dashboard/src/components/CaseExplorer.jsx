import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, ShieldAlert, ArrowRight, UserCheck, Eye, Download } from 'lucide-react';
import { SAMPLE_CASES } from '../data/processData';

export default function CaseExplorer({ onSelectCase, cohortFilters }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'loopback', 'anomaly', 'high'

  const filteredCases = SAMPLE_CASES.filter((c) => {
    // Search match
    const matchesSearch = c.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // Sub-tab match
    if (activeFilter === 'loopback' && !c.isLoopback) return false;
    if (activeFilter === 'anomaly' && !c.hasAnomaly) return false;
    if (activeFilter === 'high' && c.severity !== 'High') return false;

    // Cohort Filters
    if (cohortFilters) {
      if (cohortFilters.severity !== 'ALL' && c.severity !== cohortFilters.severity) return false;
      if (cohortFilters.ageGroup !== 'ALL' && c.ageGroup !== cohortFilters.ageGroup) return false;
      if (cohortFilters.gender !== 'ALL' && c.gender !== cohortFilters.gender) return false;
    }

    return true;
  });

  const handleExportCsv = () => {
    const headers = ["Case_ID", "Gender", "Age_Group", "Severity", "Doctor", "Lead_Time", "Loopback_Rework", "Anomaly", "Outcome"];
    const rows = filteredCases.map(c => [
      c.caseId, c.gender, c.ageGroup, c.severity, c.doctor, c.leadTime, c.isLoopback ? "Yes" : "No", c.hasAnomaly ? "Yes" : "No", c.outcome
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CareFlow_Filtered_Cases_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      {/* Header & Controls */}
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
              Patient Case & Event Log Trace Inspector
            </h3>
            <span className="badge badge-cyan">{filteredCases.length} Matching Traces</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Examine individual patient traces, bottleneck encounters, and audit compliance markers.
          </p>
        </div>

        {/* Search, Filter & CSV Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px' }} />
            <input
              type="text"
              placeholder="Search Case ID or Doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(10, 16, 30, 0.7)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '7px 10px 7px 32px',
                color: '#fff',
                fontSize: '0.8rem',
                outline: 'none',
                width: '210px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: activeFilter === 'all' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                color: activeFilter === 'all' ? '#22d3ee' : 'var(--text-secondary)'
              }}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('loopback')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: activeFilter === 'loopback' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                color: activeFilter === 'loopback' ? '#fbbf24' : 'var(--text-secondary)'
              }}
            >
              Rework Loop
            </button>
            <button
              onClick={() => setActiveFilter('anomaly')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: activeFilter === 'anomaly' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                color: activeFilter === 'anomaly' ? '#fb7185' : 'var(--text-secondary)'
              }}
            >
              Anomalies
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px' }}>Case ID</th>
              <th style={{ padding: '10px 12px' }}>Patient Profile</th>
              <th style={{ padding: '10px 12px' }}>Acuity</th>
              <th style={{ padding: '10px 12px' }}>Doctor</th>
              <th style={{ padding: '10px 12px' }}>Total Stay</th>
              <th style={{ padding: '10px 12px' }}>Process Flag</th>
              <th style={{ padding: '10px 12px' }}>Outcome</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((c) => (
              <tr 
                key={c.caseId}
                style={{
                  borderBottom: '1px solid rgba(148, 163, 184, 0.07)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                  {c.caseId}
                </td>
                <td style={{ padding: '12px', color: '#cbd5e1' }}>
                  {c.gender}, {c.ageGroup}
                </td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${c.severity === 'High' ? 'rose' : c.severity === 'Medium' ? 'amber' : 'emerald'}`}>
                    {c.severity}
                  </span>
                </td>
                <td style={{ padding: '12px', color: '#fff', fontWeight: 500 }}>
                  {c.doctor}
                </td>
                <td style={{ padding: '12px', fontWeight: 600, color: c.isLoopback ? '#fbbf24' : '#fff' }}>
                  {c.leadTime}
                </td>
                <td style={{ padding: '12px' }}>
                  {c.isLoopback && (
                    <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                      <AlertTriangle size={11} /> 40% Loopback
                    </span>
                  )}
                  {c.hasAnomaly && (
                    <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                      <ShieldAlert size={11} /> Triage Skip
                    </span>
                  )}
                  {!c.isLoopback && !c.hasAnomaly && (
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Standard</span>
                  )}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    color: c.outcome === 'Admission' ? '#f59e0b' : '#10b981',
                    fontWeight: 600
                  }}>
                    {c.outcome}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button
                    onClick={() => onSelectCase(c)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      color: '#22d3ee',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Eye size={13} />
                    <span>Inspect</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
