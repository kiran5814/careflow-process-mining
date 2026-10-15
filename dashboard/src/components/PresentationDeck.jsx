import React, { useState } from 'react';
import { 
  Presentation, ChevronLeft, ChevronRight, CheckCircle2, 
  Award, TrendingUp, AlertTriangle, ShieldCheck, Flame, BookOpen 
} from 'lucide-react';
import { SUMMARY_STATS } from '../data/processData';

export default function PresentationDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);

  const slides = [
    {
      id: 1,
      tag: "Project Overview",
      title: "CareFlow — Healthcare Process Mining & EHR Operational Intelligence",
      subtitle: "Data Analytics Internship Project Review & Demonstration",
      presenter: "Internship Track: Data Analytics & Process Mining • Branch: dev-Riddi",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            padding: '1.25rem',
            borderRadius: '12px'
          }}>
            <h4 style={{ color: '#38bdf8', fontSize: '1.1rem', marginBottom: '8px' }}>Executive Objective</h4>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Deliver practical exposure to modern <strong>Data Analytics and Process Mining workflows</strong> by ingesting hospital Electronic Health Records (EHR), discovering actual patient clinical journeys, detecting hidden operational bottlenecks, evaluating IEEE discovery models, and modeling ROI interventions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cohort Volume</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>1,000 Cases</div>
              <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>6,347 Chronological Events</span>
            </div>
            <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Median Stay</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a5b4fc' }}>3h 42m</div>
              <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>P90: 5h 28m</span>
            </div>
            <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Model Fitness</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>94.9%</div>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>IEEE Standard Compliant</span>
            </div>
          </div>
        </div>
      ),
      notes: "Introduce the project background: Real hospital emergency rooms suffer from hidden rework loops. Explain that this project covers the complete lifecycle: collection, cleaning, discovery, evaluation, and interactive executive reporting."
    },
    {
      id: 2,
      tag: "Data Ingestion & Cleaning",
      title: "Data Pipeline, Validation & Quality Assurance",
      subtitle: "Adhering to strict data cleaning and schema validation standards",
      presenter: "ETL & Data Engineering Methodology",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
            Before running process discovery, raw EHR logs were subjected to automated data cleaning rules to guarantee 100% data fidelity:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '10px' }}>
              <h5 style={{ color: '#34d399', fontWeight: 700, marginBottom: '6px' }}>✓ Zero Missing / Null Values</h5>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>100% density across all 7 essential fields (Case ID, Activity, Timestamp, Resource, Gender, Age Group, Severity).</p>
            </div>
            <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '1rem', borderRadius: '10px' }}>
              <h5 style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>✓ Chronological Monotonicity</h5>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Verified delta_t &ge; 0 for all sequential events in every patient encounter.</p>
            </div>
            <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '1rem', borderRadius: '10px' }}>
              <h5 style={{ color: '#a5b4fc', fontWeight: 700, marginBottom: '6px' }}>✓ Case Trace Stitching</h5>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Deterministic grouping by Case_ID creating 1,000 distinct clinical traces.</p>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem', borderRadius: '10px' }}>
              <h5 style={{ color: '#fbbf24', fontWeight: 700, marginBottom: '6px' }}>✓ Dimensional Warehouse Models</h5>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Implemented staging and marts models in dbt (stg_ehr_events, fct_patient_journeys, mart_bottlenecks).</p>
            </div>
          </div>
        </div>
      ),
      notes: "Highlight the quality assurance aspect: mention how real data often has timestamps out of order or nulls, and how our automated pipeline guarantees data hygiene."
    },
    {
      id: 3,
      tag: "Process Discovery",
      title: "Directly-Follows Graph (DFG) & Discovered Bottlenecks",
      subtitle: "Uncovering the hidden 39.8% radiology rework loop",
      presenter: "Process Mining Discovery & Variant Analysis",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(17, 26, 48, 0.8))',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '1.25rem',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertTriangle size={20} color="#f59e0b" />
              <h4 style={{ color: '#fbbf24', fontSize: '1.1rem', margin: 0 }}>Core Finding: Radiology Re-Triage Loopback</h4>
            </div>
            <p style={{ color: '#fde68a', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Process discovery revealed that <strong>39.8% of patients receiving an X-Ray (398 cases)</strong> are bounced back to Triage due to missing paperwork requisition forms. This rework adds <strong>+48 minutes</strong> to each affected patient's stay.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top Clinical Trace (Optimal)</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0' }}>
                Reg → Triage → Consult → Treatment → Discharge
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>33.8% of cases (Avg stay: 2h 45m)</span>
            </div>
            <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rework Trace (Inefficiency)</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', margin: '4px 0' }}>
                Reg → Triage → X-Ray → Triage [LOOP] → X-Ray → Consult...
              </div>
              <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>17.6% of cases (Avg stay: 5h 15m)</span>
            </div>
          </div>
        </div>
      ),
      notes: "Walk through the process map: point out the animated orange loopback on the dashboard. Explain that hospital executives were unaware of this paperwork issue until process mining made it visible."
    },
    {
      id: 4,
      tag: "Operational Analytics",
      title: "Temporal Rush Heatmap & What-If Optimization ROI",
      subtitle: "08:00 - 11:00 AM Morning queue accumulation & predictive modeling",
      presenter: "Temporal Bottleneck Analytics & Simulation",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Flame size={18} color="#f43f5e" />
                <h4 style={{ color: '#fb7185', margin: 0, fontSize: '1rem' }}>Morning Peak Wave (08:00 - 11:00 AM)</h4>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Arrival volume peaks at 102 patients/hour while single-technician staffing causes radiology waiting times to spike from 16 mins to <strong>54 minutes (+237%)</strong>.
              </p>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <TrendingUp size={18} color="#10b981" />
                <h4 style={{ color: '#34d399', margin: 0, fontSize: '1rem' }}>What-If Simulation ROI</h4>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Modeling a digital requisition form reduces the rework loop from 40% to 5%, saving <strong>1,050 patient waiting hours</strong> per 1,000 cases and yielding <strong>~$142,000/year</strong> in hospital operational value.
              </p>
            </div>
          </div>
        </div>
      ),
      notes: "Demonstrate the What-If simulation slider: explain how this bridges academic data analytics with actionable hospital management decisions."
    },
    {
      id: 5,
      tag: "Model Evaluation",
      title: "IEEE Process Mining Standards Evaluation",
      subtitle: "Quantitative validation across the 4 canonical process dimensions",
      presenter: "Conformance Checking & Algorithmic Benchmarks",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>
            The process discovery model was evaluated following the international IEEE Process Mining Task Force benchmark metrics:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Fitness</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>94.9%</div>
              <span style={{ fontSize: '0.68rem', color: '#10b981' }}>Goal: &ge; 90%</span>
            </div>
            <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Precision</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>91.2%</div>
              <span style={{ fontSize: '0.68rem', color: '#10b981' }}>Goal: &ge; 85%</span>
            </div>
            <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Generalization</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a5b4fc' }}>88.5%</div>
              <span style={{ fontSize: '0.68rem', color: '#10b981' }}>Goal: &ge; 80%</span>
            </div>
            <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Simplicity</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc' }}>96.0%</div>
              <span style={{ fontSize: '0.68rem', color: '#10b981' }}>Goal: &ge; 90%</span>
            </div>
          </div>
        </div>
      ),
      notes: "Explain IEEE 4-dimensions: Fitness checks if replay works, Precision ensures the model isn't overly permissive, Generalization tests future unseen cases, Simplicity guarantees Occam's razor."
    },
    {
      id: 6,
      tag: "Conclusions & Deliverables",
      title: "Summary of Deliverables & Project Completion",
      subtitle: "Complete internship requirements fulfilled according to industry standards",
      presenter: "Final Review • Branch: dev-Riddi",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'rgba(10, 16, 30, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: '6px' }}>Project Artifacts Submitted</h5>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li>Source Code (React + Vite Web App & Python Engine)</li>
                <li>Comprehensive Project Report (docs/PROJECT_REPORT.md)</li>
                <li>Data Engineering Workflow (docs/DATA_ANALYTICS_WORKFLOW.md)</li>
                <li>Dimensional Data Models (dbt_project/)</li>
                <li>Validated EHR Dataset (1,000 cases, 6,347 events)</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '1rem', borderRadius: '10px' }}>
              <h5 style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>Actionable Recommendations</h5>
              <ol style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                <li>Digitize radiology triage requisition forms (eliminates 40% bounce).</li>
                <li>Stagger 1 technician shift to 08:00 - 11:00 AM rush window.</li>
                <li>Configure EHR hard-stop requiring triage acuity score.</li>
              </ol>
            </div>
          </div>
        </div>
      ),
      notes: "Conclude by thanking the mentor and opening the floor for Q&A and final project demonstration."
    }
  ];

  const slide = slides[currentSlide];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      {/* Slide Canvas */}
      <div className="glass-panel" style={{
        minHeight: '440px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.12) 0%, rgba(10, 16, 30, 0.95) 70%)',
        border: '1px solid var(--border-highlight)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative'
      }}>
        {/* Top Tag & Slide Number */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              {slide.tag}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              Slide {currentSlide + 1} / {slides.length}
            </span>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            {slide.title}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            {slide.subtitle}
          </p>

          {/* Slide Body */}
          {slide.content}
        </div>

        {/* Slide Footer */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <span>{slide.presenter}</span>
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              color: showSpeakerNotes ? '#38bdf8' : 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <BookOpen size={13} />
            <span>{showSpeakerNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes'}</span>
          </button>
        </div>
      </div>

      {/* Speaker Notes Box (Collapsible) */}
      {showSpeakerNotes && (
        <div style={{
          background: 'rgba(10, 16, 30, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          fontSize: '0.82rem',
          color: '#e2e8f0'
        }}>
          <strong style={{ color: '#38bdf8' }}>Speaker Notes for Slide {currentSlide + 1}: </strong>
          <span>{slide.notes}</span>
        </div>
      )}

      {/* Navigation Controls Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(17, 26, 48, 0.7)',
        padding: '0.75rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)'
      }}>
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: currentSlide === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: currentSlide === 0 ? 'var(--text-muted)' : '#fff',
            padding: '7px 14px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <ChevronLeft size={16} />
          <span>Previous Slide</span>
        </button>

        {/* Slide Indicator Dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: currentSlide === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                border: 'none',
                background: currentSlide === idx ? '#06b6d4' : 'rgba(148, 163, 184, 0.25)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: currentSlide === slides.length - 1 ? 'transparent' : 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
            border: 'none',
            color: currentSlide === slides.length - 1 ? 'var(--text-muted)' : '#fff',
            padding: '7px 16px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          <span>Next Slide</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
