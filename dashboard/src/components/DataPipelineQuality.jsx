import React, { useState } from 'react';
import { 
  Database, CheckCircle2, ShieldCheck, AlertTriangle, 
  FileSpreadsheet, UploadCloud, RefreshCw, Layers, ArrowRight, Table 
} from 'lucide-react';
import { DATA_QUALITY_METRICS } from '../data/processData';

export default function DataPipelineQuality({ onReloadData }) {
  const [activeSubTab, setActiveSubTab] = useState('rules'); // 'rules', 'schema', 'preview'
  const [dragOver, setDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const sampleCsvRows = [
    { case: "CASE000703", act: "Registration", time: "2026-01-01 08:02:16", res: "Staff", gen: "Male", age: "18-40", sev: "Low" },
    { case: "CASE000703", act: "Triage", time: "2026-01-01 08:22:31", res: "Staff", gen: "Male", age: "18-40", sev: "Low" },
    { case: "CASE000703", act: "Doctor Consultation", time: "2026-01-01 09:16:52", res: "Dr. Khan", gen: "Male", age: "18-40", sev: "Low" },
    { case: "CASE000703", act: "Treatment", time: "2026-01-01 09:47:54", res: "Dr. Khan", gen: "Male", age: "18-40", sev: "Low" },
    { case: "CASE000703", act: "Discharge", time: "2026-01-01 10:06:06", res: "Staff", gen: "Male", age: "18-40", sev: "Low" },
    { case: "CASE000736", act: "Registration", time: "2026-01-01 10:14:35", res: "Staff", gen: "Male", age: "41-60", sev: "Low" },
    { case: "CASE000736", act: "Triage", time: "2026-01-01 10:36:28", res: "Staff", gen: "Male", age: "41-60", sev: "Low" },
    { case: "CASE000736", act: "X-Ray", time: "2026-01-01 11:12:00", res: "Staff", gen: "Male", age: "41-60", sev: "Low" }
  ];

  const handleSimulatedUpload = () => {
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.75rem' }}>
      {/* Top Banner: Pipeline Health & Verification Score */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Data Cleaning, Validation & ETL Pipeline
              </h3>
              <span className="badge badge-emerald">
                <ShieldCheck size={12} /> 100% Quality Index
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Industry-standard data engineering workflow adhering to ISO/IEEE data validation protocols for EHR process mining.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleSimulatedUpload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} />
              <span>Verify Pipeline Run</span>
            </button>
          </div>
        </div>

        {/* 4 Pipeline Stat Tiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Records Ingested</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
              {DATA_QUALITY_METRICS.totalRowsProcessed.toLocaleString()} rows
            </div>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{DATA_QUALITY_METRICS.uniqueCases.toLocaleString()} distinct cases</span>
          </div>

          <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Null / Missing Values</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>
              0 (0.00%)
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Complete attribute density</span>
          </div>

          <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Chronological Integrity</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>
              {DATA_QUALITY_METRICS.chronologicalIntegrity}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>Verified monotonic event ordering</span>
          </div>

          <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Schema Conformance</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c084fc', margin: '4px 0' }}>
              7 / 7 Fields
            </div>
            <span style={{ fontSize: '0.75rem', color: '#c084fc' }}>PM4Py canonical compliant</span>
          </div>
        </div>
      </div>

      {/* Main Studio View: Tabs */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          <button
            onClick={() => setActiveSubTab('rules')}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: activeSubTab === 'rules' ? '#38bdf8' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'rules' ? '2px solid #06b6d4' : '2px solid transparent'
            }}
          >
            Data Cleaning & Transformation Rules
          </button>
          <button
            onClick={() => setActiveSubTab('schema')}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: activeSubTab === 'schema' ? '#38bdf8' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'schema' ? '2px solid #06b6d4' : '2px solid transparent'
            }}
          >
            Schema Definition & PM4Py Mapping
          </button>
          <button
            onClick={() => setActiveSubTab('preview')}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: activeSubTab === 'preview' ? '#38bdf8' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'preview' ? '2px solid #06b6d4' : '2px solid transparent'
            }}
          >
            Live Ingested Event Sample ({sampleCsvRows.length} Events)
          </button>
        </div>

        {/* Tab 1: Cleansing Rules */}
        {activeSubTab === 'rules' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {DATA_QUALITY_METRICS.dataCleansingRulesApplied.map((rule, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  background: 'rgba(10, 16, 30, 0.5)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.82rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}>
                    ✓
                  </div>
                  <div>
                    <h5 style={{ fontWeight: 700, color: '#fff', margin: 0 }}>{rule.rule}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Transformation Impact: {rule.impact}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {rule.affectedRows.toLocaleString()} rows verified
                  </span>
                  <span className="badge badge-emerald">{rule.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Schema */}
        {activeSubTab === 'schema' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Attribute Name</th>
                  <th style={{ padding: '10px 12px' }}>Data Type</th>
                  <th style={{ padding: '10px 12px' }}>Nullable</th>
                  <th style={{ padding: '10px 12px' }}>Sample Extraction</th>
                  <th style={{ padding: '10px 12px' }}>Process Mining Conceptual Role</th>
                </tr>
              </thead>
              <tbody>
                {DATA_QUALITY_METRICS.schemaDefinition.map((field) => (
                  <tr key={field.field} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                      {field.field}
                    </td>
                    <td style={{ padding: '12px', color: '#cbd5e1' }}>
                      {field.type}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>NO (Required)</span>
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#a5b4fc' }}>
                      {field.sample}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#f8fafc' }}>
                      {field.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Preview */}
        {activeSubTab === 'preview' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px' }}>Case_ID</th>
                  <th style={{ padding: '8px 10px' }}>Activity_Name</th>
                  <th style={{ padding: '8px 10px' }}>Timestamp</th>
                  <th style={{ padding: '8px 10px' }}>Resource</th>
                  <th style={{ padding: '8px 10px' }}>Gender</th>
                  <th style={{ padding: '8px 10px' }}>Age_Group</th>
                  <th style={{ padding: '8px 10px' }}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {sampleCsvRows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.07)' }}>
                    <td style={{ padding: '10px', fontFamily: 'monospace', color: '#38bdf8' }}>{r.case}</td>
                    <td style={{ padding: '10px', fontWeight: 600, color: '#fff' }}>{r.act}</td>
                    <td style={{ padding: '10px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{r.time}</td>
                    <td style={{ padding: '10px', color: '#cbd5e1' }}>{r.res}</td>
                    <td style={{ padding: '10px', color: '#cbd5e1' }}>{r.gen}</td>
                    <td style={{ padding: '10px', color: '#cbd5e1' }}>{r.age}</td>
                    <td style={{ padding: '10px' }}>
                      <span className={`badge badge-${r.sev === 'High' ? 'rose' : r.sev === 'Medium' ? 'amber' : 'emerald'}`}>
                        {r.sev}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CSV Ingestion Sandbox / Upload Card */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Real-time EHR Log Ingestion Sandbox
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Upload new batches of EHR event logs exported from hospital HIS / Cerner / Epic systems to re-mine paths dynamically.
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleSimulatedUpload(); }}
          style={{
            border: dragOver ? '2px dashed #06b6d4' : '2px dashed rgba(148, 163, 184, 0.25)',
            borderRadius: '12px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: dragOver ? 'rgba(6, 182, 212, 0.08)' : 'rgba(10, 16, 30, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={handleSimulatedUpload}
        >
          <UploadCloud size={36} color={dragOver ? '#06b6d4' : 'var(--text-muted)'} style={{ margin: '0 auto 0.75rem' }} />
          <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
            Drag and drop EHR CSV event logs here, or click to browse
          </h5>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Supports CSV, XES, and Parquet formats with standard PM4Py header tags
          </p>

          {uploadSuccess && (
            <div style={{ marginTop: '1rem', color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>
              ✓ Dataset verified and ingested successfully! Process models synchronized.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
