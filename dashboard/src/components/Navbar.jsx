import React, { useState } from 'react';
import { 
  Activity, GitBranch, Database, RefreshCw, 
  Layers, ShieldCheck, Flame, Users, Sliders, FileText, 
  Brain, Presentation, PieChart, Radio, Grid3x3, Sun, Moon, 
  Search, Bell, ChevronDown
} from 'lucide-react';

const TABS = [
  { id: 'map',        label: 'Process Map',       icon: Layers,      group: 'Analysis' },
  { id: 'analytics',  label: 'Visual Analytics',  icon: PieChart,    group: 'Analysis' },
  { id: 'heatmap',    label: 'Volume Heatmap',    icon: Grid3x3,     group: 'Analysis' },
  { id: 'bottlenecks',label: 'Bottlenecks',       icon: Flame,       group: 'Analysis' },
  { id: 'variants',   label: 'Variants',          icon: Activity,    group: 'Analysis' },
  { id: 'cases',      label: 'Cases',             icon: Users,       group: 'Clinical' },
  { id: 'live',       label: 'Live Feed',         icon: Radio,       group: 'Clinical', live: true },
  { id: 'compliance', label: 'Compliance',        icon: ShieldCheck, group: 'Clinical' },
  { id: 'simulation', label: 'What-If ROI',       icon: Sliders,     group: 'Intelligence' },
  { id: 'rca',        label: 'Root Cause',        icon: Brain,       group: 'Intelligence' },
  { id: 'data',       label: 'Data Quality',      icon: Database,    group: 'Intelligence' },
  { id: 'report',     label: 'Report',            icon: FileText,    group: 'Output' },
  { id: 'deck',       label: 'Presentation',      icon: Presentation,group: 'Output' },
];

export default function Navbar({ activeTab, setActiveTab, onRefresh, darkMode, setDarkMode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, type: 'alert',   msg: 'Loopback rate exceeded 40% threshold',   time: '2m ago',  color: '#f43f5e' },
    { id: 2, type: 'warning', msg: 'Morning rush: Radiology queue at 62 min', time: '8m ago',  color: '#f59e0b' },
    { id: 3, type: 'info',    msg: 'Data sync complete — 1,000 cases loaded', time: '15m ago', color: '#06b6d4' },
    { id: 4, type: 'success', msg: 'Compliance report generated',             time: '1h ago',  color: '#10b981' },
  ];

  const filteredTabs = searchQuery
    ? TABS.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : TABS;

  return (
    <header style={{
      background: 'rgba(7, 11, 20, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Top Bar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.7rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        borderBottom: '1px solid var(--border-color)',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0,
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 18px rgba(6, 182, 212, 0.4)'
          }}>
            <Activity size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>CareFlow</h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>v2.0</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EHR Process Mining Intelligence</p>
          </div>
        </div>

        {/* Status Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
            padding: '3px 9px', borderRadius: '7px', fontSize: '0.72rem', color: '#a5b4fc'
          }}>
            <GitBranch size={12} color="#818cf8" /> dev-Riddi
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
            padding: '3px 9px', borderRadius: '7px', fontSize: '0.72rem', color: '#34d399'
          }}>
            <span className="live-dot" />
            1,000 cases
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)',
            padding: '3px 9px', borderRadius: '7px', fontSize: '0.72rem', color: '#22d3ee'
          }}>
            6,347 events
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setSearchOpen(s => !s)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 10px', borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)',
              fontSize: '0.75rem', cursor: 'pointer'
            }}>
              <Search size={14} /> Quick nav
            </button>
            {searchOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '110%',
                background: '#0d1424', border: '1px solid var(--border-color)',
                borderRadius: '10px', padding: '6px', minWidth: 200, zIndex: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}>
                <input
                  autoFocus
                  placeholder="Search tabs…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '7px 10px', borderRadius: '6px',
                    border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)',
                    color: '#fff', fontSize: '0.8rem', outline: 'none'
                  }}
                />
                {filteredTabs.map(t => (
                  <button key={t.id} onClick={() => { setActiveTab(t.id); setSearchOpen(false); setSearchQuery(''); }} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                    padding: '7px 10px', borderRadius: '6px', border: 'none',
                    background: 'transparent', color: activeTab === t.id ? '#22d3ee' : 'var(--text-secondary)',
                    fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left'
                  }}>
                    <t.icon size={13} /> {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setNotifOpen(n => !n)} style={{
              position: 'relative', padding: '6px 8px', borderRadius: '8px',
              border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.04)',
              color: 'var(--text-muted)', cursor: 'pointer'
            }}>
              <Bell size={16} />
              <span style={{
                position: 'absolute', top: 3, right: 3, width: 7, height: 7,
                borderRadius: '50%', background: '#f43f5e',
                border: '1.5px solid #070b14'
              }} />
            </button>
            {notifOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '110%',
                background: '#0d1424', border: '1px solid var(--border-color)',
                borderRadius: '12px', padding: '8px', minWidth: 280, zIndex: 200,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', padding: '4px 8px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Notifications
                </div>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '8px 10px', borderRadius: '8px', marginBottom: '4px',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: n.color, marginTop: 5, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#f8fafc' }}>{n.msg}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dark/Light Toggle */}
          <button onClick={() => setDarkMode && setDarkMode(d => !d)} style={{
            padding: '6px 8px', borderRadius: '8px',
            border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.04)',
            color: 'var(--text-secondary)', cursor: 'pointer'
          }}>
            {darkMode !== false ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Sync */}
          <button onClick={onRefresh} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
            color: '#fff', border: 'none', borderRadius: '9px',
            padding: '7px 13px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(6,182,212,0.35)'
          }}>
            <RefreshCw size={13} /> Sync
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        overflowX: 'auto',
      }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '9px 12px', border: 'none', cursor: 'pointer',
                fontSize: '0.77rem', fontWeight: isActive ? 700 : 500,
                background: 'transparent', whiteSpace: 'nowrap',
                color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid #06b6d4' : '2px solid transparent',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              <Icon size={13} color={isActive ? '#38bdf8' : '#64748b'} />
              {tab.label}
              {tab.live && (
                <span style={{
                  width: 5, height: 5, borderRadius: '50%', background: '#10b981',
                  position: 'absolute', top: 7, right: 4
                }} />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
