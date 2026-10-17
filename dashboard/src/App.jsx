import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import KpiMetrics from './components/KpiMetrics';
import ProcessMap from './components/ProcessMap';
import BottleneckAnalytics from './components/BottleneckAnalytics';
import VariantExplorer from './components/VariantExplorer';
import CaseExplorer from './components/CaseExplorer';
import WhatIfSimulation from './components/WhatIfSimulation';
import DataPipelineQuality from './components/DataPipelineQuality';
import ExecutiveReport from './components/ExecutiveReport';
import RootCauseAnalysis from './components/RootCauseAnalysis';
import PresentationDeck from './components/PresentationDeck';
import CaseDetailModal from './components/CaseDetailModal';
import LiveActivityFeed from './components/LiveActivityFeed';
import PatientHeatmap from './components/PatientHeatmap';
import ComplianceChecker from './components/ComplianceChecker';
import VisualAnalytics from './components/VisualAnalytics';
import HospitalCommandCenter from './components/HospitalCommandCenter';
import ClinicalSlaCenter from './components/ClinicalSlaCenter';
import CohortBenchmark from './components/CohortBenchmark';
import ResourceHandoverNetwork from './components/ResourceHandoverNetwork';
import { CheckCircle, Award } from 'lucide-react';
import { SAMPLE_CASES, EXTENDED_CASES } from './data/processData';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedCase, setSelectedCase] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const [filters, setFilters] = useState({
    severity: 'ALL',
    ageGroup: 'ALL',
    gender: 'ALL',
    timeSlot: 'ALL'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleRefresh = () => {
    showToast('Synchronized with CareFlow EHR Telemetry Engine (1,000 cases / 6,347 events)');
  };

  const caseList = EXTENDED_CASES || SAMPLE_CASES;
  const filteredSampleCount = caseList.filter((c) => {
    if (filters.severity !== 'ALL' && c.severity !== filters.severity) return false;
    if (filters.ageGroup !== 'ALL' && c.ageGroup !== filters.ageGroup) return false;
    if (filters.gender !== 'ALL' && c.gender !== filters.gender) return false;
    return true;
  }).length;

  // Show KPI bar only on core analytics pages, not utility ones
  const showKpi = ['map', 'hospital', 'bottlenecks', 'variants', 'analytics'].includes(activeTab);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={handleRefresh}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem', width: '100%', flex: 1 }}>
        {/* Hospital Facility Info Banner */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem',
          padding: '0.85rem 1.25rem',
          background: 'rgba(17, 26, 48, 0.5)',
          border: '1px solid var(--border-color)', borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              display: 'inline-flex', padding: '6px', borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.25))',
              color: '#06b6d4'
            }}>
              <Award size={18} />
            </span>
            <div>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                Metropolitan Academic Medical Center — Clinical Process Mining & Hospital Intelligence
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Emergency Care • Trauma Resuscitation • EHR Protocol Mining • Joint Commission & CMS Compliance
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>Facility Status: <strong style={{ color: '#34d399' }}>Surge Level 2 (Open)</strong></span>
            <span>Branch: <strong style={{ color: '#a5b4fc' }}>dev-Riddi</strong></span>
            <span>EHR Cohort: <strong style={{ color: '#38bdf8' }}>1,000 cases / 6,347 events</strong></span>
          </div>
        </div>

        {/* Filter Bar - show on clinical/analysis pages */}
        {['map', 'hospital', 'sla', 'cohort', 'handover', 'bottlenecks', 'variants', 'cases', 'analytics', 'heatmap', 'live'].includes(activeTab) && (
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            totalFilteredCases={filteredSampleCount}
            totalCases={caseList.length}
          />
        )}

        {/* KPI Summary - shown on main analysis views */}
        {showKpi && <KpiMetrics />}

        {/* ======================== TAB CONTENT ======================== */}

        {activeTab === 'map' && (
          <>
            <ProcessMap />
            <BottleneckAnalytics />
          </>
        )}

        {activeTab === 'hospital' && <HospitalCommandCenter />}

        {activeTab === 'sla' && <ClinicalSlaCenter />}

        {activeTab === 'cohort' && <CohortBenchmark />}

        {activeTab === 'handover' && <ResourceHandoverNetwork />}

        {activeTab === 'analytics' && <VisualAnalytics />}

        {activeTab === 'heatmap' && <PatientHeatmap />}

        {activeTab === 'bottlenecks' && (
          <>
            <BottleneckAnalytics />
            <WhatIfSimulation />
          </>
        )}

        {activeTab === 'variants' && <VariantExplorer />}

        {activeTab === 'cases' && (
          <CaseExplorer
            onSelectCase={(c) => setSelectedCase(c)}
            cohortFilters={filters}
          />
        )}

        {activeTab === 'live' && <LiveActivityFeed />}

        {activeTab === 'compliance' && <ComplianceChecker />}

        {activeTab === 'simulation' && <WhatIfSimulation />}

        {activeTab === 'rca' && <RootCauseAnalysis />}

        {activeTab === 'data' && (
          <DataPipelineQuality
            onReloadData={() => showToast('Data cleansing pipeline re-executed successfully!')}
          />
        )}

        {activeTab === 'report' && <ExecutiveReport />}

        {activeTab === 'deck' && <PresentationDeck />}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1rem 1.75rem',
        textAlign: 'center',
        fontSize: '0.76rem',
        color: 'var(--text-muted)',
        background: 'rgba(7, 11, 20, 0.95)'
      }}>
        CareFlow v2.0 • Healthcare Process Mining Intelligence • Branch <code>dev-Riddi</code> • Emergency Room Operational Optimization • Data Analytics Internship Deliverable
      </footer>

      {/* Case Detail Modal */}
      <CaseDetailModal
        patientCase={selectedCase}
        onClose={() => setSelectedCase(null)}
      />

      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: 'rgba(13, 20, 36, 0.95)',
          border: '1px solid #06b6d4', borderRadius: '10px',
          padding: '10px 16px', color: '#fff', fontSize: '0.82rem',
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 200,
          animation: 'slideInFeed 0.3s ease'
        }}>
          <CheckCircle size={16} color="#06b6d4" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
