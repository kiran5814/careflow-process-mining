import React from 'react';
import { 
  Activity, GitBranch, Database, Sparkles, RefreshCw, 
  Layers, ShieldCheck, Flame, Users, Sliders, FileText, CheckCircle 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onRefresh }) {
  const tabs = [
    { id: 'map', label: 'Process Map (DFG)', icon: Layers },
    { id: 'bottlenecks', label: 'Bottleneck Radar', icon: Flame },
    { id: 'variants', label: 'Clinical Variants', icon: Activity },
    { id: 'cases', label: 'Case Explorer', icon: Users },
    { id: 'simulation', label: 'What-If Optimizer', icon: Sliders },
    { id: 'data', label: 'Data Cleaning & Quality', icon: Database },
    { id: 'report', label: 'Executive Report & Docs', icon: FileText },
  ];

  return (
    <header style={{
      background: 'rgba(10, 16, 30, 0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 1.75rem'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand & System Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
            }}>
              <Activity size={22} color="#ffffff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                  CareFlow
                </h1>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>v1.0-alpha</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                EHR Process Mining & Operational Intelligence
              </p>
            </div>
          </div>

          <div style={{
            height: '24px',
            width: '1px',
            background: 'var(--border-color)',
            margin: '0 0.25rem'
          }} />

          {/* Branch badge & dataset info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#a5b4fc',
              fontWeight: 500
            }}>
              <GitBranch size={13} color="#818cf8" />
              <span>dev-Riddi</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#34d399',
              fontWeight: 500
            }}>
              <span className="live-dot" />
              <span>1,000 cases (6,347 events)</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          background: 'rgba(17, 26, 48, 0.85)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.25))' : 'transparent',
                  color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid #06b6d4' : '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={14} color={isActive ? '#38bdf8' : '#94a3b8'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Action Button */}
        <button
          onClick={onRefresh}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 14px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(6, 182, 212, 0.35)',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <RefreshCw size={14} />
          <span>Sync Logs</span>
        </button>
      </div>
    </header>
  );
}
