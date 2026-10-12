import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, AlertTriangle, ShieldAlert, ArrowRight, UserCheck, 
  Eye, Download, CheckSquare, Square, ArrowUpDown, ArrowUp, ArrowDown, 
  Copy, Check, FileSpreadsheet, RotateCcw, Clock, DollarSign, Activity,
  ChevronLeft, ChevronRight, Sparkles, Layers
} from 'lucide-react';
import { EXTENDED_CASES } from '../data/processData';

export default function CaseExplorer({ onSelectCase, cohortFilters }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'loopback', 'anomaly', 'compliant'
  const [outcomeFilter, setOutcomeFilter] = useState('ALL'); // 'ALL', 'Discharge', 'Admission'
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [selectedCaseIds, setSelectedCaseIds] = useState([]);
  const [sortField, setSortField] = useState('caseId');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [copiedId, setCopiedId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Unique doctors list
  const uniqueDoctors = useMemo(() => {
    return Array.from(new Set(EXTENDED_CASES.map(c => c.doctor)));
  }, []);

  // Filtered dataset
  const filteredCases = useMemo(() => {
    return EXTENDED_CASES.filter((c) => {
      // Search match
      const query = searchTerm.toLowerCase();
      const matchesSearch = 
        c.caseId.toLowerCase().includes(query) ||
        c.doctor.toLowerCase().includes(query) ||
        c.severity.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      // Status pill filter
      if (activeFilter === 'loopback' && !c.isLoopback) return false;
      if (activeFilter === 'anomaly' && !c.hasAnomaly) return false;
      if (activeFilter === 'compliant' && (c.isLoopback || c.hasAnomaly)) return false;

      // Outcome filter
      if (outcomeFilter !== 'ALL' && c.outcome !== outcomeFilter) return false;

      // Doctor filter
      if (doctorFilter !== 'ALL' && c.doctor !== doctorFilter) return false;

      // Cohort Filters passed from global FilterBar
      if (cohortFilters) {
        if (cohortFilters.severity !== 'ALL' && c.severity !== cohortFilters.severity) return false;
        if (cohortFilters.ageGroup !== 'ALL' && c.ageGroup !== cohortFilters.ageGroup) return false;
        if (cohortFilters.gender !== 'ALL' && c.gender !== cohortFilters.gender) return false;
      }

      return true;
    });
  }, [searchTerm, activeFilter, outcomeFilter, doctorFilter, cohortFilters]);

  // Sorted dataset
  const sortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'leadTime') {
        // Parse "2h 04m" to minutes
        const toMin = (str) => {
          const parts = str.match(/(\d+)h\s*(\d+)m/);
          return parts ? parseInt(parts[1]) * 60 + parseInt(parts[2]) : 0;
        };
        valA = toMin(valA);
        valB = toMin(valB);
      } else if (sortField === 'cost') {
        valA = parseInt(valA.replace(/[^0-9]/g, '')) || 0;
        valB = parseInt(valB.replace(/[^0-9]/g, '')) || 0;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCases, sortField, sortDirection]);

  // Paginated dataset
  const totalPages = Math.ceil(sortedCases.length / pageSize) || 1;
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCases.slice(start, start + pageSize);
  }, [sortedCases, currentPage, pageSize]);

  // Handle Sort Click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Selection toggle
  const toggleSelectAll = () => {
    if (selectedCaseIds.length === paginatedCases.length) {
      setSelectedCaseIds([]);
    } else {
      setSelectedCaseIds(paginatedCases.map(c => c.caseId));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedCaseIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Copy ID
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // CSV Export
  const handleExportCsv = () => {
    const targetCases = selectedCaseIds.length > 0 
      ? sortedCases.filter(c => selectedCaseIds.includes(c.caseId))
      : sortedCases;

    const headers = ["Case_ID", "Gender", "Age_Group", "Acuity_Severity", "Doctor", "Lead_Time", "Loopback_Rework", "Protocol_Anomaly", "Cost", "Outcome", "CSAT"];
    const rows = targetCases.map(c => [
      c.caseId, c.gender, c.ageGroup, c.severity, c.doctor, c.leadTime, 
      c.isLoopback ? "Yes" : "No", c.hasAnomaly ? "Yes" : "No", 
      c.cost || "$480", c.outcome, c.satisfaction || 95
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `CareFlow_Cases_${selectedCaseIds.length > 0 ? 'Selected' : 'Filtered'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Summary counts for filtered cohort
  const loopbackCount = filteredCases.filter(c => c.isLoopback).length;
  const anomalyCount = filteredCases.filter(c => c.hasAnomaly).length;
  const admitCount = filteredCases.filter(c => c.outcome === 'Admission').length;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      
      {/* 1. Header & Summary Stats Strip */}
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              Patient Case & Process Log Trace Inspector
            </h3>
            <span className="badge badge-cyan">{filteredCases.length} Matching Traces</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Enterprise event log auditor with multi-attribute filtering, column sorting & forensic replay.
          </p>
        </div>

        {/* Quick Cohort Summary Cards */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(10, 16, 30, 0.7)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Filtered Traces: </span>
            <strong style={{ color: '#fff' }}>{filteredCases.length}</strong>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem' }}>
            <span style={{ color: '#fbbf24' }}>Rework Loopbacks: </span>
            <strong style={{ color: '#f59e0b' }}>{loopbackCount} ({Math.round(loopbackCount / (filteredCases.length || 1) * 100)}%)</strong>
          </div>
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem' }}>
            <span style={{ color: '#fb7185' }}>Protocol Bypasses: </span>
            <strong style={{ color: '#f43f5e' }}>{anomalyCount}</strong>
          </div>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem' }}>
            <span style={{ color: '#a5b4fc' }}>Admit Rate: </span>
            <strong style={{ color: '#818cf8' }}>{Math.round(admitCount / (filteredCases.length || 1) * 100)}%</strong>
          </div>
        </div>
      </div>

      {/* 2. Search, Status Pills & Action Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        background: 'rgba(10, 16, 30, 0.65)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px' }} />
            <input
              type="text"
              placeholder="Search Case ID or Doctor..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                background: 'rgba(7, 11, 20, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '7px',
                padding: '6px 10px 6px 30px',
                color: '#fff',
                fontSize: '0.78rem',
                outline: 'none',
                width: '210px'
              }}
            />
          </div>

          {/* Status Filter Buttons */}
          <div style={{ display: 'flex', gap: '3px', background: 'rgba(7, 11, 20, 0.8)', padding: '2px', borderRadius: '7px', border: '1px solid var(--border-color)' }}>
            {[
              { id: 'all',       label: 'All Traces' },
              { id: 'compliant', label: 'Optimal Compliant' },
              { id: 'loopback',  label: 'Rework Loops' },
              { id: 'anomaly',    label: 'Protocol Bypasses' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { setActiveFilter(f.id); setCurrentPage(1); }}
                style={{
                  padding: '4px 9px',
                  borderRadius: '5px',
                  border: 'none',
                  background: activeFilter === f.id ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                  color: activeFilter === f.id ? '#22d3ee' : 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  fontWeight: activeFilter === f.id ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Doctor Filter Dropdown */}
          <select
            value={doctorFilter}
            onChange={(e) => { setDoctorFilter(e.target.value); setCurrentPage(1); }}
            style={{
              background: 'rgba(7, 11, 20, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '7px',
              padding: '5px 8px',
              color: 'var(--text-secondary)',
              fontSize: '0.74rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Attending MDs</option>
            {uniqueDoctors.map(doc => (
              <option key={doc} value={doc}>{doc}</option>
            ))}
          </select>

          {/* Outcome Filter Dropdown */}
          <select
            value={outcomeFilter}
            onChange={(e) => { setOutcomeFilter(e.target.value); setCurrentPage(1); }}
            style={{
              background: 'rgba(7, 11, 20, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '7px',
              padding: '5px 8px',
              color: 'var(--text-secondary)',
              fontSize: '0.74rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Dispositions</option>
            <option value="Discharge">Discharged Home</option>
            <option value="Admission">Inpatient Admission</option>
          </select>
        </div>

        {/* Action Controls: Bulk Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {selectedCaseIds.length > 0 && (
            <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 600 }}>
              {selectedCaseIds.length} Selected
            </span>
          )}

          <button
            onClick={handleExportCsv}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '7px',
              background: selectedCaseIds.length > 0 ? '#06b6d4' : 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-color)',
              color: selectedCaseIds.length > 0 ? '#070b14' : '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Download size={13} />
            <span>{selectedCaseIds.length > 0 ? `Export Selected (${selectedCaseIds.length})` : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* 3. High-End Data Table */}
      <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: 'rgba(7, 11, 20, 0.95)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              {/* Checkbox Col */}
              <th style={{ padding: '10px 14px', width: '40px' }}>
                <span onClick={toggleSelectAll} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {selectedCaseIds.length > 0 && selectedCaseIds.length === paginatedCases.length ? (
                    <CheckSquare size={16} color="#06b6d4" />
                  ) : (
                    <Square size={16} color="var(--text-muted)" />
                  )}
                </span>
              </th>

              {/* Case ID */}
              <th style={{ padding: '10px 14px', cursor: 'pointer' }} onClick={() => handleSort('caseId')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>CASE IDENTIFIER</span>
                  {sortField === 'caseId' ? (sortDirection === 'asc' ? <ArrowUp size={12} color="#06b6d4" /> : <ArrowDown size={12} color="#06b6d4" />) : <ArrowUpDown size={12} />}
                </div>
              </th>

              {/* Patient Demographics */}
              <th style={{ padding: '10px 14px' }}>PATIENT DEMO</th>

              {/* Severity / Acuity */}
              <th style={{ padding: '10px 14px', cursor: 'pointer' }} onClick={() => handleSort('severity')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>ACUITY (ESI)</span>
                  {sortField === 'severity' ? (sortDirection === 'asc' ? <ArrowUp size={12} color="#06b6d4" /> : <ArrowDown size={12} color="#06b6d4" />) : <ArrowUpDown size={12} />}
                </div>
              </th>

              {/* Attending Doctor */}
              <th style={{ padding: '10px 14px', cursor: 'pointer' }} onClick={() => handleSort('doctor')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>ATTENDING MD</span>
                  {sortField === 'doctor' ? (sortDirection === 'asc' ? <ArrowUp size={12} color="#06b6d4" /> : <ArrowDown size={12} color="#06b6d4" />) : <ArrowUpDown size={12} />}
                </div>
              </th>

              {/* Lead Time */}
              <th style={{ padding: '10px 14px', cursor: 'pointer' }} onClick={() => handleSort('leadTime')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>TOTAL STAY</span>
                  {sortField === 'leadTime' ? (sortDirection === 'asc' ? <ArrowUp size={12} color="#06b6d4" /> : <ArrowDown size={12} color="#06b6d4" />) : <ArrowUpDown size={12} />}
                </div>
              </th>

              {/* Conformance Status */}
              <th style={{ padding: '10px 14px' }}>PROCESS CONFORMANCE</th>

              {/* Operating Cost */}
              <th style={{ padding: '10px 14px', cursor: 'pointer' }} onClick={() => handleSort('cost')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>COST</span>
                  {sortField === 'cost' ? (sortDirection === 'asc' ? <ArrowUp size={12} color="#06b6d4" /> : <ArrowDown size={12} color="#06b6d4" />) : <ArrowUpDown size={12} />}
                </div>
              </th>

              {/* Disposition Outcome */}
              <th style={{ padding: '10px 14px', cursor: 'pointer' }} onClick={() => handleSort('outcome')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>DISPOSITION</span>
                  {sortField === 'outcome' ? (sortDirection === 'asc' ? <ArrowUp size={12} color="#06b6d4" /> : <ArrowDown size={12} color="#06b6d4" />) : <ArrowUpDown size={12} />}
                </div>
              </th>

              {/* Actions */}
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCases.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No patient cases match the active filter criteria. Try adjusting the search term or status filters.
                </td>
              </tr>
            ) : (
              paginatedCases.map((c) => {
                const isSelected = selectedCaseIds.includes(c.caseId);
                const isHigh = c.severity === 'High';
                const isMed = c.severity === 'Medium';

                return (
                  <tr
                    key={c.caseId}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(6, 182, 212, 0.08)' : 'rgba(13, 20, 36, 0.45)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: '10px 14px' }}>
                      <span onClick={() => toggleSelectOne(c.caseId)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        {isSelected ? <CheckSquare size={16} color="#06b6d4" /> : <Square size={16} color="var(--text-muted)" />}
                      </span>
                    </td>

                    {/* Case ID */}
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong className="font-mono" style={{ color: '#fff', fontSize: '0.82rem' }}>
                          {c.caseId}
                        </strong>
                        <button
                          onClick={() => handleCopyId(c.caseId)}
                          title="Copy Case ID"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedId === c.caseId ? '#10b981' : 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '2px'
                          }}
                        >
                          {copiedId === c.caseId ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>

                    {/* Demographics */}
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: '0.76rem' }}>
                      {c.gender} • <span style={{ color: '#cbd5e1' }}>Age {c.ageGroup}</span>
                    </td>

                    {/* Severity / Acuity */}
                    <td style={{ padding: '10px 14px' }}>
                      <span className={`badge ${isHigh ? 'badge-rose' : isMed ? 'badge-amber' : 'badge-cyan'}`} style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
                        {c.severity} {c.esiScore ? `(ESI-${c.esiScore})` : ''}
                      </span>
                    </td>

                    {/* Doctor */}
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '50%',
                          background: 'rgba(99,102,241,0.2)', color: '#a5b4fc',
                          fontSize: '0.62rem', fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {c.doctor.split(' ')[1]?.[0] || 'M'}
                        </div>
                        <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{c.doctor}</span>
                      </div>
                    </td>

                    {/* Lead Time */}
                    <td style={{ padding: '10px 14px' }}>
                      <span className="font-mono" style={{ color: c.isLoopback ? '#fb7185' : '#38bdf8', fontWeight: 700 }}>
                        {c.leadTime}
                      </span>
                    </td>

                    {/* Conformance Status */}
                    <td style={{ padding: '10px 14px' }}>
                      {c.hasAnomaly ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f43f5e', fontSize: '0.74rem' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f43f5e' }} />
                          <span>Protocol Anomaly (Skip)</span>
                        </div>
                      ) : c.isLoopback ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b', fontSize: '0.74rem' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b' }} />
                          <span>Rework Loop (Paperwork)</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontSize: '0.74rem' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
                          <span>Optimal Compliant Flow</span>
                        </div>
                      )}
                    </td>

                    {/* Cost */}
                    <td style={{ padding: '10px 14px' }}>
                      <span className="font-mono" style={{ color: c.isLoopback ? '#fbbf24' : '#94a3b8', fontWeight: 600 }}>
                        {c.cost || '$480'}
                      </span>
                    </td>

                    {/* Disposition */}
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 600,
                        background: c.outcome === 'Admission' ? 'rgba(99,102,241,0.18)' : 'rgba(16,185,129,0.15)',
                        color: c.outcome === 'Admission' ? '#a5b4fc' : '#34d399'
                      }}>
                        {c.outcome}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => onSelectCase(c)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: 'rgba(6, 182, 212, 0.15)',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          color: '#22d3ee',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Eye size={12} /> Inspect Trace
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination & Record Count Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '1rem',
        fontSize: '0.76rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>
            Showing <strong style={{ color: '#fff' }}>{sortedCases.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong style={{ color: '#fff' }}>{Math.min(currentPage * pageSize, sortedCases.length)}</strong> of{' '}
            <strong style={{ color: '#fff' }}>{sortedCases.length}</strong> matching records
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              style={{
                background: 'rgba(7, 11, 20, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '5px',
                padding: '2px 6px',
                color: '#fff',
                fontSize: '0.72rem',
                outline: 'none'
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* Pagination buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-color)',
              color: currentPage === 1 ? 'var(--text-muted)' : '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '3px 8px',
                borderRadius: '6px',
                border: 'none',
                background: currentPage === page ? '#06b6d4' : 'rgba(255,255,255,0.06)',
                color: currentPage === page ? '#070b14' : '#fff',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-color)',
              color: currentPage === totalPages ? 'var(--text-muted)' : '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
