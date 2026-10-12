import React, { useState } from 'react';
import { 
  Building2, Activity, AlertTriangle, ShieldCheck, Clock, Users, 
  Stethoscope, Bed, HeartPulse, Siren, Radio, CheckCircle2, 
  FileCheck, ArrowUpRight, ArrowDownRight, Sparkles, Filter, 
  RefreshCw, Download, Zap, Eye, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ReferenceLine, Cell 
} from 'recharts';
import { 
  HOSPITAL_OPERATIONAL_STATS, HOSPITAL_WARDS, CMS_QUALITY_MEASURES, 
  CLINICAL_ESI_PROTOCOLS, ACTIVE_EMERGENCY_INCIDENTS 
} from '../data/processData';

export default function HospitalCommandCenter() {
  const [activeWardCategory, setActiveWardCategory] = useState('ALL');
  const [selectedWard, setSelectedWard] = useState(HOSPITAL_WARDS[0]);
  const [selectedEsi, setSelectedEsi] = useState(CLINICAL_ESI_PROTOCOLS[0]);
  const [activeSubTab, setActiveSubTab] = useState('census'); // 'census', 'cms', 'esi', 'incidents'
  const [evsCleanedUnits, setEvsCleanedUnits] = useState({});

  // Trigger EVS Bed cleaning action
  const handleTriggerClean = (wardId) => {
    setEvsCleanedUnits(prev => ({
      ...prev,
      [wardId]: (prev[wardId] || 0) + 1
    }));
  };

  const filteredWards = activeWardCategory === 'ALL'
    ? HOSPITAL_WARDS
    : HOSPITAL_WARDS.filter(w => w.category.toLowerCase().includes(activeWardCategory.toLowerCase()));

  // Chart data for ward occupancy
  const wardChartData = HOSPITAL_WARDS.map(w => ({
    name: w.name.split('—')[0].replace('Unit', '').replace('Department', '').trim(),
    occupancy: w.occupancyRate,
    total: w.totalBeds,
    occupied: w.occupiedBeds,
    isCritical: w.occupancyRate >= 90,
    isWarning: w.occupancyRate >= 85 && w.occupancyRate < 90
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      
      {/* 1. Hospital Enterprise Operational Status Banner */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(13,20,36,0.95) 0%, rgba(20,30,55,0.85) 100%)',
        border: '1px solid rgba(6,182,212,0.3)',
        borderRadius: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(14,165,233,0.4)'
          }}>
            <Building2 size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                {HOSPITAL_OPERATIONAL_STATS.facilityName}
              </h2>
              <span className="badge badge-amber" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                Surge Level 2: Advisory
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {HOSPITAL_OPERATIONAL_STATS.serviceLine} • Joint Commission ID: #8841-A
            </div>
          </div>
        </div>

        {/* Global Facility Counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Facility Census</div>
            <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
              {HOSPITAL_OPERATIONAL_STATS.overallBedCensus.occupiedBeds} / {HOSPITAL_OPERATIONAL_STATS.overallBedCensus.totalBeds}
              <span style={{ fontSize: '0.75rem', color: '#fbbf24', marginLeft: '5px' }}>({HOSPITAL_OPERATIONAL_STATS.overallBedCensus.occupancyRate})</span>
            </div>
          </div>

          <div style={{ width: '1px', height: '32px', background: 'var(--border-color)' }} />

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ambulance Status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 700, color: '#34d399' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              {HOSPITAL_OPERATIONAL_STATS.ambulanceStatus.condition}
            </div>
          </div>

          <div style={{ width: '1px', height: '32px', background: 'var(--border-color)' }} />

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ED Boarding Dwell</div>
            <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fb7185' }}>
              {HOSPITAL_OPERATIONAL_STATS.edCapacity.avgBoardingTime}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tab Switcher for Hospital Modules */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{
          display: 'flex',
          background: 'rgba(10, 16, 30, 0.85)',
          padding: '3px',
          borderRadius: '9px',
          border: '1px solid var(--border-color)',
          gap: '3px'
        }}>
          {[
            { id: 'census',    label: 'Ward & Bed Capacity Hub', icon: Bed },
            { id: 'cms',       label: 'CMS & Joint Commission Quality', icon: ShieldCheck },
            { id: 'esi',       label: 'ESI 1-5 Clinical Protocols', icon: HeartPulse },
            { id: 'incidents', label: 'Emergency Incident Dispatch', icon: Siren }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(99,102,241,0.25))' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontSize: '0.76rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} color={isActive ? '#22d3ee' : 'var(--text-muted)'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeSubTab === 'census' && (
          <div style={{ display: 'flex', gap: '3px', background: 'rgba(7, 11, 20, 0.7)', padding: '2px', borderRadius: '7px', border: '1px solid var(--border-color)' }}>
            {[
              { id: 'ALL', label: 'All Units' },
              { id: 'Emergency', label: 'Emergency' },
              { id: 'Critical', label: 'ICU / CCU' },
              { id: 'Inpatient', label: 'Med-Surg' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveWardCategory(f.id)}
                style={{
                  padding: '3px 9px',
                  borderRadius: '5px',
                  border: 'none',
                  background: activeWardCategory === f.id ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                  color: activeWardCategory === f.id ? '#22d3ee' : 'var(--text-muted)',
                  fontSize: '0.71rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 3. VIEW A: WARD & BED CAPACITY MATRIX + OCCUPANCY CHART */}
      {/* ============================================================== */}
      {activeSubTab === 'census' && (
        <>
          {/* Chart: Unit Occupancy Bar Breakdown */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  Real-Time Unit Bed Occupancy & Saturation Trajectory
                </h3>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  Active hospital beds occupied vs licensed capacity across emergency, critical care, and inpatient wards.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#0284c7' }} /> Normal (&lt;85%)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#f59e0b' }} /> High Census (85-89%)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fb7185' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#f43f5e' }} /> Critical Saturation (&ge;90%)
                </span>
              </div>
            </div>

            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wardChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} angle={-15} textAnchor="end" />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
                  <Tooltip 
                    contentStyle={{ background: '#0d1424', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                    formatter={(val, name, entry) => [`${val}% Occupancy (${entry.payload.occupied}/${entry.payload.total} beds)`, 'Unit Status']}
                  />
                  <ReferenceLine y={85} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: '85% Advisory', fill: '#f59e0b', fontSize: 10 }} />
                  <ReferenceLine y={90} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '90% Saturation', fill: '#f43f5e', fontSize: 10 }} />
                  <Bar dataKey="occupancy" radius={[4, 4, 0, 0]}>
                    {wardChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isCritical ? '#f43f5e' : entry.isWarning ? '#f59e0b' : '#0284c7'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grid of Hospital Wards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1rem'
          }}>
            {filteredWards.map(ward => {
              const isCritical = ward.occupancyRate >= 90;
              const isWarning = ward.occupancyRate >= 85 && ward.occupancyRate < 90;
              const accentColor = isCritical ? '#f43f5e' : isWarning ? '#fbbf24' : '#38bdf8';
              const cleanedCount = evsCleanedUnits[ward.id] || 0;

              return (
                <div
                  key={ward.id}
                  className="glass-panel"
                  style={{
                    padding: '1.25rem',
                    borderTop: `3px solid ${accentColor}`,
                    background: 'rgba(13, 20, 36, 0.75)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.85rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                          {ward.category}
                        </span>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff', margin: '2px 0' }}>
                          {ward.name}
                        </h4>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          {ward.type}
                        </div>
                      </div>

                      <span className={`badge ${isCritical ? 'badge-rose' : isWarning ? 'badge-amber' : 'badge-cyan'}`} style={{ fontSize: '0.66rem' }}>
                        {ward.status}
                      </span>
                    </div>

                    {/* Occupancy Bar */}
                    <div style={{ marginTop: '0.65rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Bed Census:</span>
                        <strong className="font-mono" style={{ color: '#fff' }}>
                          {ward.occupiedBeds} / {ward.totalBeds} ({ward.occupancyRate}%)
                        </strong>
                      </div>
                      <div className="progress-track" style={{ height: '7px' }}>
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${ward.occupancyRate}%`,
                            background: isCritical ? '#f43f5e' : isWarning ? '#f59e0b' : '#0284c7'
                          }} 
                        />
                      </div>
                    </div>

                    {/* Operational Details */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px',
                      background: 'rgba(7, 11, 20, 0.5)', padding: '8px 10px', borderRadius: '8px',
                      marginTop: '0.75rem', fontSize: '0.71rem'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Nurse Ratio:</span>
                        <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{ward.staffRatio}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Charge RN:</span>
                        <div style={{ color: '#e2e8f0', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {ward.leadNurse}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>ED Boarding:</span>
                        <div style={{ color: ward.boardingCount > 0 ? '#fb7185' : '#34d399', fontWeight: 700 }}>
                          {ward.boardingCount} Patients holding
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>EVS Cleaning:</span>
                        <div style={{ color: '#fbbf24', fontWeight: 600 }}>
                          {ward.evsCleaning + cleanedCount} beds turnaround
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)', fontSize: '0.72rem'
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Inbound: <strong style={{ color: '#38bdf8' }}>+{ward.pendingArrivals} expected</strong>
                    </span>

                    <button
                      onClick={() => handleTriggerClean(ward.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-color)',
                        color: '#fff',
                        fontSize: '0.71rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <RefreshCw size={11} /> Clean Bed (EVS)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* 4. VIEW B: CMS & THE JOINT COMMISSION REGULATORY MEASURES */}
      {/* ============================================================== */}
      {activeSubTab === 'cms' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                  CMS & The Joint Commission National Quality Measures
                </h3>
                <span className="badge badge-emerald">Audit-Ready 96.4% Score</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Mandatory hospital accreditation benchmarks governing capitated reimbursement, sepsis safety, and acute throughput.
              </div>
            </div>

            <button
              onClick={() => {
                const csv = "Measure_Code,Measure_Name,Benchmark,Hospital_Actual,Status\n" +
                  CMS_QUALITY_MEASURES.map(m => `${m.code},"${m.name}",${m.benchmark},${m.actual},${m.status}`).join("\n");
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Hospital_CMS_Joint_Commission_Audit_${new Date().toISOString().slice(0,10)}.csv`;
                a.click();
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <Download size={13} /> Export CMS Audit Report (CSV)
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {CMS_QUALITY_MEASURES.map(measure => {
              const isOpt = measure.status === 'Optimal';
              return (
                <div
                  key={measure.id}
                  style={{
                    background: 'rgba(10, 16, 30, 0.65)',
                    border: `1px solid ${isOpt ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                    borderRadius: '10px',
                    padding: '1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-purple font-mono" style={{ fontSize: '0.7rem' }}>{measure.code}</span>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                          {measure.name}
                        </h4>
                      </div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        Accreditation Authority: {measure.regulatoryBody}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', textAlign: 'right' }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Benchmark Target</div>
                        <div className="font-mono" style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>{measure.benchmark}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Actual Hospital Score</div>
                        <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: isOpt ? '#34d399' : '#fbbf24' }}>
                          {measure.actual}
                        </div>
                      </div>
                      <span className={`badge ${isOpt ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                        {measure.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    <strong>Clinical & Financial Impact:</strong> {measure.impact}
                  </div>

                  {/* Components Checklist */}
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '6px',
                    background: 'rgba(7, 11, 20, 0.4)', padding: '6px 10px', borderRadius: '6px'
                  }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Mandatory Core Protocols:
                    </span>
                    {measure.components.map(comp => (
                      <span key={comp} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontSize: '0.69rem', background: 'rgba(255,255,255,0.06)',
                        padding: '2px 8px', borderRadius: '4px', color: '#e2e8f0'
                      }}>
                        <CheckCircle2 size={11} color="#10b981" /> {comp}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. VIEW C: CLINICAL ESI 1-5 TRIAGE DECISION SUPPORT */}
      {/* ============================================================== */}
      {activeSubTab === 'esi' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                Emergency Severity Index (ESI 1-5) Clinical Decision Support
              </h3>
              <span className="badge badge-cyan">AHA & ENA Validated</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Standardized five-level emergency department triage algorithm prioritizing care based on acuity and required diagnostic resources.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {CLINICAL_ESI_PROTOCOLS.map(esi => {
              const isSelected = selectedEsi.level === esi.level;
              const color = 
                esi.level === 1 ? '#f43f5e' :
                esi.level === 2 ? '#f59e0b' :
                esi.level === 3 ? '#06b6d4' :
                esi.level === 4 ? '#3b82f6' : '#10b981';

              return (
                <div
                  key={esi.level}
                  onClick={() => setSelectedEsi(esi)}
                  style={{
                    background: isSelected ? 'rgba(13, 20, 36, 0.95)' : 'rgba(10, 16, 30, 0.6)',
                    border: `1px solid ${isSelected ? color : 'var(--border-color)'}`,
                    borderRadius: '12px',
                    padding: '1.2rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? `0 8px 24px ${color}20` : 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="badge font-mono" style={{ background: `${color}22`, color, border: `1px solid ${color}40`, fontSize: '0.74rem' }}>
                        LEVEL {esi.level}
                      </span>
                      <span style={{ fontSize: '0.72rem', color, fontWeight: 700 }}>
                        {esi.responseTime}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff', margin: '4px 0' }}>
                      {esi.title.split(':')[1]?.trim() || esi.title}
                    </h4>

                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '6px 0' }}>
                      <strong>Examples:</strong> {esi.examples}
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(7, 11, 20, 0.5)',
                    padding: '8px 10px',
                    borderRadius: '7px',
                    fontSize: '0.7rem',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    <div style={{ color: '#cbd5e1' }}>
                      <strong>Staffing:</strong> {esi.staffingMandate}
                    </div>
                    <div style={{ color: color, fontWeight: 600, marginTop: '3px' }}>
                      Cohort Distribution: {esi.cohortPercent}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep Selected Pathway Callout */}
          {selectedEsi && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1.15rem 1.25rem',
              borderRadius: '12px',
              background: 'rgba(10, 16, 30, 0.8)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="#06b6d4" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>
                  Normative Clinical EHR Pathway for {selectedEsi.title}
                </span>
              </div>
              <div className="font-mono" style={{ fontSize: '0.78rem', color: '#38bdf8', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px' }}>
                {selectedEsi.pathway}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. VIEW D: EMERGENCY DISPATCH & RAPID RESPONSE FEED */}
      {/* ============================================================== */}
      {activeSubTab === 'incidents' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                  Hospital Emergency Dispatch & Critical Code Feed
                </h3>
                <span className="badge badge-rose">Real-Time Hospital Telemetry</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Active code activations, trauma resuscitation teams, and rapid response team interventions.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ACTIVE_EMERGENCY_INCIDENTS.map(inc => {
              const isStemi = inc.code.includes('STEMI');
              const isTrauma = inc.code.includes('TRAUMA');
              const isSepsis = inc.code.includes('SEPSIS');
              const color = isStemi ? '#f43f5e' : isTrauma ? '#f59e0b' : isSepsis ? '#8b5cf6' : '#06b6d4';

              return (
                <div
                  key={inc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    background: 'rgba(10, 16, 30, 0.65)',
                    border: `1px solid ${color}35`,
                    borderLeft: `4px solid ${color}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      padding: '8px', borderRadius: '8px',
                      background: `${color}20`, color
                    }}>
                      <Siren size={18} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 800, color }}>
                          {inc.code}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{inc.time} UTC</span>
                        <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>{inc.id}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#e2e8f0', marginTop: '2px' }}>
                        <strong>Location:</strong> {inc.location} • Patient: <span className="font-mono" style={{ color: '#38bdf8' }}>{inc.patientId}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Lead Physician</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>{inc.leadMD}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Intervention Status</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399' }}>{inc.status}</div>
                    </div>
                    <div style={{
                      padding: '4px 10px', borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)', fontSize: '0.72rem',
                      fontFamily: 'monospace', color: '#f8fafc'
                    }}>
                      {inc.elapsedMin}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
