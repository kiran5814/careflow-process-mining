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
import CaseDetailModal from './components/CaseDetailModal';
import { Sparkles, Database, CheckCircle, Info, Award, FileText } from 'lucide-react';
import { SUMMARY_STATS, SAMPLE_CASES } from './data/processData';

export default function App() {
  const [activeTab, setActiveTab] = useState('map'); 
  const [selectedCase, setSelectedCase] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Global Cohort Filters
  const [filters, setFilters] = useState({
    severity: 'ALL',
    ageGroup: 'ALL',
    gender: 'ALL',
    timeSlot: 'ALL'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleRefresh = () => {
    showToast('Synchronized with CareFlow EHR Mock Logs (1,000 cases)');
  };

  // Compute filtered count
  const filteredSampleCount = SAMPLE_CASES.filter((c) => {
    if (filters.severity !== 'ALL' && c.severity !== filters.severity) return false;
    if (filters.ageGroup !== 'ALL' && c.ageGroup !== filters.ageGroup) return false;
    if (filters.gender !== 'ALL' && c.gender !== filters.gender) return false;
    return true;
  }).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onRefresh={handleRefresh}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.75rem', width: '100%', flex: 1 }}>
        {/* Banner with internship & branch metadata */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
          padding: '0.85rem 1.25rem',
          background: 'rgba(17, 26, 48, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              display: 'inline-flex',
              padding: '6px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.25))',
              color: '#06b6d4'
            }}>
              <Award size={18} />
            </span>
            <div>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                Healthcare Data Analytics & Process Mining Workflow
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                EHR Log Ingestion → Automated Data Cleansing → DFG Process Discovery → Conformance & Operational ROI
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>Branch: <strong style={{ color: '#a5b4fc' }}>dev-Riddi</strong></span>
            <span>Dataset: <strong style={{ color: '#38bdf8' }}>1,000 cases / 6,347 events</strong></span>
          </div>
        </div>

        {/* Global Cohort Filter Bar */}
        <FilterBar 
          filters={filters} 
          setFilters={setFilters} 
          totalFilteredCases={filteredSampleCount} 
          totalCases={SAMPLE_CASES.length} 
        />

        {/* Global KPI Summary */}
        <KpiMetrics />

        {/* Content based on Active Tab */}
        {activeTab === 'map' && (
          <>
            <ProcessMap />
            <BottleneckAnalytics />
          </>
        )}

        {activeTab === 'bottlenecks' && (
          <>
            <BottleneckAnalytics />
            <WhatIfSimulation />
          </>
        )}

        {activeTab === 'variants' && (
          <VariantExplorer />
        )}

        {activeTab === 'cases' && (
          <CaseExplorer 
            onSelectCase={(c) => setSelectedCase(c)} 
            cohortFilters={filters} 
          />
        )}

        {activeTab === 'simulation' && (
          <WhatIfSimulation />
        )}

        {activeTab === 'data' && (
          <DataPipelineQuality 
            onReloadData={() => showToast('Data cleansing pipeline re-executed successfully!')} 
          />
        )}

        {activeTab === 'report' && (
          <ExecutiveReport />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.25rem 1.75rem',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        background: 'rgba(7, 11, 20, 0.95)'
      }}>
        CareFlow Healthcare Process Mining Intelligence • Data Analytics Internship Deliverable • Branch <code>dev-Riddi</code> • Emergency Room Operational Optimization
      </footer>

      {/* Case Timeline Detail Modal Drawer */}
      <CaseDetailModal 
        patientCase={selectedCase} 
        onClose={() => setSelectedCase(null)} 
      />

      {/* Toast notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(13, 20, 36, 0.95)',
          border: '1px solid #06b6d4',
          borderRadius: '10px',
          padding: '10px 16px',
          color: '#fff',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          zIndex: 200
        }}>
          <CheckCircle size={16} color="#06b6d4" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
