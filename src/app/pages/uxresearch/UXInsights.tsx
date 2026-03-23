import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CLUSTERS = [
  {
    id: 'monitoring', label: 'Operational Monitoring', color: '#1565C0',
    notes: [
      { text: 'No unified dashboard across all zones', rotate: -1.5, shade: '#DBEAFE' },
      { text: 'SCADA data lags by 2–5 minutes during peak load', rotate: 1, shade: '#BFDBFE' },
      { text: 'Operators maintain personal tracking spreadsheets', rotate: -2, shade: '#93C5FD' },
      { text: 'KPI targets not visible in real-time on any screen', rotate: 1.5, shade: '#DBEAFE' },
      { text: 'Power factor data requires manual export', rotate: -1, shade: '#BFDBFE' },
    ],
  },
  {
    id: 'alerts', label: 'Alert Detection', color: '#C62828',
    notes: [
      { text: 'Alert fatigue is severely impacting response quality', rotate: 1, shade: '#FEE2E2' },
      { text: '40% of alerts are dismissed without full review', rotate: -2, shade: '#FECACA' },
      { text: 'No smart severity ranking on incoming alerts', rotate: 1.5, shade: '#FCA5A5' },
      { text: 'False positive rate estimated at 35–40%', rotate: -1, shade: '#FEE2E2' },
      { text: 'Alert context (location, device) is missing from notifications', rotate: 2, shade: '#FECACA' },
    ],
  },
  {
    id: 'infrastructure', label: 'Infrastructure Visibility', color: '#7B1FA2',
    notes: [
      { text: 'No single map view of all grid assets', rotate: -1, shade: '#F3E8FF' },
      { text: 'Asset health status is not visible in real-time', rotate: 2, shade: '#E9D5FF' },
      { text: 'Maintenance history requires ERP lookup', rotate: -1.5, shade: '#DDD6FE' },
      { text: 'Field engineers lack access to substation diagrams on mobile', rotate: 1, shade: '#F3E8FF' },
    ],
  },
  {
    id: 'data', label: 'Data Fragmentation', color: '#E65100',
    notes: [
      { text: 'AT&C loss data differs across 3 systems', rotate: -2, shade: '#FFEDD5' },
      { text: 'Revenue reconciliation is manual and weekly', rotate: 1.5, shade: '#FED7AA' },
      { text: 'No single source of truth for billing data', rotate: -1, shade: '#FDBA74' },
      { text: 'Data from field teams is entered into paper first', rotate: 2, shade: '#FFEDD5' },
      { text: 'Historical data retrieval averages 15–25 minutes', rotate: -1.5, shade: '#FED7AA' },
    ],
  },
  {
    id: 'forecasting', label: 'Forecasting Needs', color: '#2E7D32',
    notes: [
      { text: 'Load forecasts are reactive, not predictive', rotate: 1, shade: '#DCFCE7' },
      { text: 'No automated demand spike alerts 30 min ahead', rotate: -2, shade: '#BBF7D0' },
      { text: 'Forecast models are maintained in Excel', rotate: 1.5, shade: '#86EFAC' },
      { text: 'No integration between SCADA data and forecast tools', rotate: -1, shade: '#DCFCE7' },
      { text: 'Weather data is checked manually on a separate browser', rotate: 2, shade: '#BBF7D0' },
    ],
  },
];

export function UXInsights() {
  const { settings } = useTheme();
  const ff       = `var(--md-font-family, ${settings.fontFamily})`;
  const isDark   = settings.darkMode;
  const pageBg   = isDark ? '#111111' : '#f0f4fc';
  const cardBg   = isDark ? '#1e1e1e' : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain  = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted = isDark ? '#78909c' : '#546e7a';
  const sec = settings.secondaryColor;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
          <Lightbulb size={16} style={{ color: sec }} />
        </div>
        <div className="flex-1">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>Insights & Opportunity Areas</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>5 affinity clusters synthesised from 14 interviews · 42 survey responses · 6 observations</p>
        </div>
        <span className="px-2.5 py-1 rounded-full" style={{ background: `${sec}10`, border: `1px solid ${sec}20`, fontSize: '0.65rem', color: sec, fontWeight: 600 }}>
          8 Affinity Clusters
        </span>
      </div>

      {/* Scrollable board */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          {CLUSTERS.map((cluster, ci) => (
            <motion.div key={cluster.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.07 }}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: isDark ? '#1e1e1e' : `${cluster.color}06`, border: `1px solid ${cluster.color}25` }}>

              {/* Cluster header */}
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cluster.color }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: cluster.color }}>{cluster.label}</span>
                <span className="ml-auto px-1.5 py-0.5 rounded-full"
                  style={{ fontSize: '0.625rem', fontWeight: 700, background: `${cluster.color}15`, color: cluster.color }}>
                  {cluster.notes.length} insights
                </span>
              </div>

              {/* Sticky notes */}
              <div className="flex flex-col gap-2">
                {cluster.notes.map((note, ni) => (
                  <motion.div key={ni}
                    initial={{ opacity: 0, y: 6, rotate: 0 }}
                    animate={{ opacity: 1, y: 0, rotate: note.rotate }}
                    transition={{ delay: 0.1 + ci * 0.05 + ni * 0.05 }}
                    whileHover={{ rotate: 0, scale: 1.02, zIndex: 10 }}
                    className="rounded-xl p-2.5"
                    style={{
                      background: isDark ? `${cluster.color}12` : note.shade,
                      border: `1px solid ${cluster.color}20`,
                      boxShadow: `2px 3px 8px rgba(0,0,0,${isDark ? 0.25 : 0.08})`,
                      transformOrigin: 'center center',
                    }}>
                    <p style={{ fontSize: '0.65rem', color: isDark ? textMain : '#1a1a2e', lineHeight: 1.5 }}>
                      {note.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Opportunity summary card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl p-4 flex flex-col gap-3 col-span-2"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2">
              <Lightbulb size={13} style={{ color: sec }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>Opportunity Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { opp: 'Unified Control Room View', impact: 'High', desc: 'A single consolidated dashboard combining real-time SCADA, alerts, assets, and load data eliminates tool-switching entirely.' },
                { opp: 'Smart Alert Triage Engine', impact: 'High', desc: 'ML-based alert severity ranking and false-positive suppression to reduce alert fatigue and improve response quality.' },
                { opp: 'Mobile Field Companion', impact: 'High', desc: 'Offline-capable mobile app for field engineers with work orders, equipment history, and real-time communication.' },
                { opp: 'Predictive Load Analytics', impact: 'Medium', desc: 'Integrate weather and historical SCADA data for 30-minute ahead demand forecasts with proactive alerts.' },
              ].map((o, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: `${sec}06`, border: `1px solid ${sec}18` }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span style={{ fontSize: '0.67rem', fontWeight: 700, color: textMain }}>{o.opp}</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ fontSize: '0.625rem', fontWeight: 700, background: o.impact === 'High' ? '#C6282815' : '#E6510015', color: o.impact === 'High' ? '#C62828' : '#E65100' }}>
                      {o.impact}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.625rem', color: textMuted, lineHeight: 1.5 }}>{o.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}