import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, ChevronRight, LayoutDashboard, Users, Network, Cpu, Activity, BarChart3, TrendingUp, FlaskConical, AlertCircle, FileText, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const IA_TREE = [
  {
    id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#1565C0',
    children: ['Live Grid Status', 'AT&C KPIs', 'Revenue Snapshot', 'Active Alerts Summary', 'Load vs Forecast'],
  },
  {
    id: 'consumers', label: 'Consumers', icon: Users, color: '#E65100',
    children: ['Consumer List', 'Category Breakdown', 'Billing Status', 'New Connections', 'Complaints'],
  },
  {
    id: 'grid-explorer', label: 'Grid Explorer', icon: Network, color: '#7B1FA2',
    children: ['Zone Map', 'Feeder View', 'Substation Detail', 'Real-time Topology'],
  },
  {
    id: 'assets', label: 'Assets', icon: Cpu, color: '#2E7D32',
    children: ['Asset Register', 'Transformers', 'Feeders', 'Smart Meters', 'Maintenance Log'],
  },
  {
    id: 'load', label: 'Load Monitor', icon: Activity, color: '#00838F',
    children: ['Zone Load Chart', 'Feeder Loading', 'Power Factor', 'Voltage Profile'],
  },
  {
    id: 'revenue', label: 'Revenue', icon: BarChart3, color: '#C62828',
    children: ['Collection Efficiency', 'Category Revenue', 'Defaulters List', 'AT&C Loss Trend'],
  },
  {
    id: 'forecast', label: 'Forecasting', icon: TrendingUp, color: '#1565C0',
    children: ['Demand Forecast', 'Peak Prediction', 'Zone-wise Forecast', 'Model Settings'],
  },
  {
    id: 'studies', label: 'Studies', icon: FlaskConical, color: '#7B1FA2',
    children: ['Power Flow Analysis', 'Fault Level Study', 'Harmonic Analysis', 'Load Flow Reports'],
  },
  {
    id: 'alerts', label: 'Alerts & Faults', icon: AlertCircle, color: '#C62828',
    children: ['Active Alerts', 'Fault History', 'Incident Log', 'Escalation Rules'],
  },
  {
    id: 'reports', label: 'Reports', icon: FileText, color: '#E65100',
    children: ['Revenue Reports', 'Load Analysis', 'Consumer MIS', 'Energy Audit', 'Scheduled Reports'],
  },
  {
    id: 'settings', label: 'Settings', icon: Settings, color: '#546e7a',
    children: ['Theme & Display', 'User Management', 'Notification Rules', 'Data Sources', 'API Config'],
  },
];

export function UXIA() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { settings } = useTheme();
  const ff       = `var(--md-font-family, ${settings.fontFamily})`;
  const isDark   = settings.darkMode;
  const pageBg   = isDark ? '#111111' : '#f0f4fc';
  const cardBg   = isDark ? '#1e1e1e' : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain  = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted = isDark ? '#78909c' : '#546e7a';
  const surface   = isDark ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08`;
  const sec = settings.secondaryColor;
  const pri = settings.primaryColor;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
          <Share2 size={16} style={{ color: sec }} />
        </div>
        <div className="flex-1">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>Information Architecture</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>
            Grid Intelligence Platform · Navigation structure · Level 2 expanded
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full" style={{ background: surface, fontSize: '0.65rem', color: textMuted }}>
          {IA_TREE.length} top-level · {IA_TREE.reduce((a, n) => a + n.children.length, 0)} sub-pages
        </span>
      </div>

      <div className="flex-1 overflow-auto p-5">
        {/* Root node */}
        <div className="flex flex-col items-center gap-0">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="px-6 py-2.5 rounded-2xl flex items-center gap-2"
            style={{ background: `${pri}18`, border: `2px solid ${pri}40` }}>
            <LayoutDashboard size={14} style={{ color: pri }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: pri }}>Grid Intelligence Platform</span>
          </motion.div>

          {/* Vertical stem from root */}
          <div className="w-px h-6" style={{ background: border }} />

          {/* Horizontal connector bar */}
          <div className="relative" style={{ width: '100%' }}>
            <div className="h-px w-full" style={{ background: border }} />
          </div>

          {/* L1 nodes */}
          <div className="w-full overflow-x-auto">
            <div className="flex gap-2 pt-0" style={{ minWidth: IA_TREE.length * 120 }}>
              {IA_TREE.map((node, i) => (
                <motion.div key={node.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex flex-col items-center gap-0 flex-1"
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}>

                  {/* vertical stem to L1 */}
                  <div className="w-px h-5" style={{ background: border }} />

                  {/* L1 card */}
                  <motion.div
                    animate={{ y: hoveredId === node.id ? -2 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-full rounded-xl p-2 flex flex-col items-center gap-1 cursor-pointer"
                    style={{
                      background: hoveredId === node.id ? `${node.color}15` : `${node.color}08`,
                      border: `1px solid ${node.color}${hoveredId === node.id ? '40' : '25'}`,
                    }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${node.color}18` }}>
                      <node.icon size={13} style={{ color: node.color }} />
                    </div>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, color: node.color, textAlign: 'center', lineHeight: 1.2 }}>{node.label}</span>
                  </motion.div>

                  {/* vertical stem to children */}
                  <div className="w-px h-3" style={{ background: border }} />

                  {/* L2 children */}
                  <div className="w-full flex flex-col gap-1">
                    {node.children.map((child, j) => (
                      <motion.div key={child}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.03 + j * 0.04 }}
                        className="rounded-lg px-1.5 py-1 flex items-center gap-1"
                        style={{ background: surface, border: `1px solid ${border}` }}>
                        <ChevronRight size={8} style={{ color: node.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.625rem', color: textMuted, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {child}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 rounded-2xl p-3 flex items-center gap-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted }}>LEGEND</span>
          {[
            { color: pri, label: 'Root Application Shell' },
            { color: '#666', label: 'Level 1 — Primary Navigation' },
            { color: '#999', label: 'Level 2 — Sub-pages & Features' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-8 h-px" style={{ background: l.color }} />
              <span style={{ fontSize: '0.625rem', color: textMuted }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}