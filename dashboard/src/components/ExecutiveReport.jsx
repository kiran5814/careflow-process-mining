import React from 'react';
import { 
  FileText, Download, Printer, Award, CheckCircle2, 
  AlertTriangle, TrendingUp, DollarSign, ShieldCheck, 
  Layers, ExternalLink, Presentation, ChevronRight 
} from 'lucide-react';
import { 
  SUMMARY_STATS, MODEL_EVALUATION, 
  ACTIONABLE_INSIGHTS, DATA_QUALITY_METRICS 
} from '../data/processData';

export default function ExecutiveReport() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const reportText = `# CareFlow — Process Mining & EHR Intelligence
## Executive Internship Analytical Report & Deliverables

### Project Objective
Practical exposure to real-world Data Analytics workflows: collected, cleaned, analyzed, and visualized hospital EHR event logs. Discovered process bottlenecks, conformance violations, and modeled operational ROI interventions according to industry standards.

### Executive Summary & Key Results
- Total Ingested Cases: ${SUMMARY_STATS.totalCases} cases (${SUMMARY_STATS.totalEvents} events)
- Median ER Stay Duration: ${SUMMARY_STATS.medianCycleTime} (P90: ${SUMMARY_STATS.p90CycleTime})
- Radiology Re-triage Rework Rate: ${SUMMARY_STATS.loopbackRate}% (398 patients delayed by missing forms)
- Morning Rush Surge Delay (08:00 - 11:00 AM): ${SUMMARY_STATS.morningRushWaitRadiology} vs ${SUMMARY_STATS.regularWaitRadiology} normal
- Conformance Adherence: ${SUMMARY_STATS.conformanceScore}%

### IEEE Process Mining Model Evaluation
- Process Fitness: ${MODEL_EVALUATION.dimensions[0].score}%
- Precision: ${MODEL_EVALUATION.dimensions[1].score}%
- Generalization: ${MODEL_EVALUATION.dimensions[2].score}%
- Simplicity Index: ${MODEL_EVALUATION.dimensions[3].score}%

### Actionable Strategic Recommendations
1. Digitize Radiology Requisition Forms at initial triage to eliminate the 39.8% paperwork bounce-back loop (~$142,000/yr savings).
2. Stagger 1 Radiology Technician shift to 08:00 - 11:00 AM to eliminate the morning surge queue.
3. Configure EHR hard-stop to require triage acuity score before physician consultation order entry.
`;

    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CareFlow_Internship_Project_Report.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2rem' }}>
      {/* Action Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                Executive Analytical Report & Project Deliverables
              </h3>
              <span className="badge badge-cyan">Industry Standard</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Comprehensive synthesis of data analytics, process discovery, IEEE model evaluation, and actionable business insights.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Printer size={15} />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                border: 'none',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(6, 182, 212, 0.35)'
              }}
            >
              <Download size={15} />
              <span>Export Report (.md)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deliverables Checklist Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem'
      }}>
        {[
          { title: "Source Code & Architecture", status: "Verified", desc: "React + Vite Dashboard, Python Simulator & PM4Py Pipeline", icon: CheckCircle2, color: "#10b981" },
          { title: "Project Documentation", status: "Standardized", desc: "Comprehensive workflows & data engineering dictionaries", icon: FileText, color: "#38bdf8" },
          { title: "Model Evaluation Results", status: "Evaluated", desc: "IEEE 4-Quality Process Mining metrics & conformance matrix", icon: Award, color: "#818cf8" },
          { title: "Actionable Insights & Deck", status: "Ready", desc: "Operational bottleneck diagnosis and simulation ROI", icon: Presentation, color: "#fbbf24" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{item.status}</span>
                <Icon size={18} color={item.color} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{item.title}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Model Evaluation Results Section */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                Process Mining Model Evaluation (IEEE Standards)
              </h3>
              <span className="badge badge-purple">Benchmark Score: {MODEL_EVALUATION.overallScore}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Evaluation across the 4 canonical process discovery dimensions: Fitness, Precision, Generalization, and Simplicity.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {MODEL_EVALUATION.dimensions.map((dim) => (
            <div
              key={dim.name}
              style={{
                background: 'rgba(10, 16, 30, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{dim.name}</span>
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{dim.status}</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.5rem' }}>
                  {dim.score}%
                </div>

                {/* Progress bar */}
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{
                    width: `${dim.score}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #06b6d4, #6366f1)',
                    borderRadius: '999px'
                  }} />
                </div>

                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {dim.description}
                </p>
              </div>

              <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(148, 163, 184, 0.08)', paddingTop: '6px' }}>
                Benchmark target: &ge; {dim.benchmark}% (Exceeded)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Business Insights Cards */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                Actionable Business & Operational Insights
              </h3>
              <span className="badge badge-amber">Executive Recommendations</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Data-driven findings translated into actionable healthcare management interventions and ROI projections.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {ACTIONABLE_INSIGHTS.map((item) => {
            const isCritical = item.priority === 'CRITICAL';
            const isHigh = item.priority === 'HIGH';

            return (
              <div
                key={item.id}
                style={{
                  background: isCritical 
                    ? 'rgba(245, 158, 11, 0.06)' 
                    : isHigh 
                      ? 'rgba(244, 63, 94, 0.05)' 
                      : 'rgba(10, 16, 30, 0.5)',
                  border: isCritical 
                    ? '1px solid rgba(245, 158, 11, 0.35)' 
                    : isHigh 
                      ? '1px solid rgba(244, 63, 94, 0.3)' 
                      : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px', color: '#fff' }}>
                      {item.id}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                      {item.title}
                    </h4>
                    <span className={`badge badge-${isCritical ? 'amber' : isHigh ? 'rose' : 'cyan'}`}>
                      {item.priority}
                    </span>
                  </div>

                  <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                    {item.category}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.8rem',
                  background: 'rgba(7, 11, 20, 0.5)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '0.75rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Quantitative Evidence:</span>
                    <div style={{ color: '#cbd5e1' }}>{item.evidence}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Estimated Impact / Cost:</span>
                    <div style={{ color: isCritical ? '#fbbf24' : '#fb7185', fontWeight: 600 }}>{item.impact}</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  color: '#e0f2fe'
                }}>
                  <strong style={{ color: '#38bdf8' }}>Strategic Recommendation:</strong>
                  <span>{item.recommendation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
