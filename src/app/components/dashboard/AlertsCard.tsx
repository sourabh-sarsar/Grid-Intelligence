import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, ArrowRight, MapPin, Clock, AlertTriangle, Info } from 'lucide-react';
import { useTheme, getPrimaryBg, getDensitySpacing } from '../../context/ThemeContext';

const alerts = [
  { id: 1, severity: 'critical', title: 'Transformer T-204 Fault', location: 'Sector 7, Zone B', time: '2 min ago', asset: 'T-204' },
  { id: 2, severity: 'critical', title: 'Voltage Fluctuation Detected', location: 'Feeder F-08, Zone A', time: '8 min ago', asset: 'F-08' },
  { id: 3, severity: 'warning', title: 'Feeder F-12 Overloaded', location: 'Industrial Area, Zone C', time: '15 min ago', asset: 'F-12' },
  { id: 4, severity: 'warning', title: 'Smart Meter Communication Loss', location: '24 meters, Sector 3', time: '28 min ago', asset: 'SM-3xx' },
  { id: 5, severity: 'info', title: 'Scheduled Maintenance Due', location: 'Substation SS-14', time: '1 hr ago', asset: 'SS-14' },
  { id: 6, severity: 'info', title: 'Load Forecast Updated', location: 'Zone A & B', time: '2 hr ago', asset: 'SYS' },
];

export function AlertsCard() {
  const { settings } = useTheme();
  const ds = getDensitySpacing(settings.density);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const cardBg = settings.darkMode ? '#1e1e1e' : '#fff';
  const textMain = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const textMuted = settings.darkMode ? '#78909c' : '#546e7a';
  const borderColor = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  const severityConfig = {
    critical: {
      color: '#F44336',
      bg: settings.darkMode ? 'rgba(244,67,54,0.15)' : '#FFEBEE',
      icon: AlertCircle, label: 'Critical',
    },
    warning: {
      color: '#FF9800',
      bg: settings.darkMode ? 'rgba(255,152,0,0.15)' : '#FFF3E0',
      icon: AlertTriangle, label: 'Warning',
    },
    info: {
      color: '#1565C0',
      bg: settings.darkMode ? 'rgba(21,101,192,0.18)' : '#E3F2FD',
      icon: Info, label: 'Info',
    },
  };

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);
  const critCount = alerts.filter(a => a.severity === 'critical').length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
      className="flex flex-col h-full"
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        boxShadow: settings.darkMode ? 'none' : `0 ${settings.cardShadow * 2}px ${settings.cardShadow * 10}px rgba(0,0,0,0.06)`,
        borderRadius: `${settings.cardBorderRadius}px`,
        fontFamily: settings.fontFamily,
        padding: ds.pad,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: ds.headerGap }}>
        <div className="flex items-center gap-2.5">
          <div
            className="rounded-xl flex items-center justify-center relative shrink-0"
            style={{ width: ds.iconBox, height: ds.iconBox, background: settings.darkMode ? 'rgba(244,67,54,0.15)' : '#FFEBEE' }}
          >
            <AlertCircle size={ds.iconSize} style={{ color: '#F44336' }} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center" style={{ fontSize: '9px' }}>{critCount}</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-none" style={{ color: textMain }}>System Alerts</h3>
            <p className="text-xs opacity-60 mt-0.5" style={{ color: textMuted }}>Real-time fault monitoring</p>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 flex-wrap" style={{ marginBottom: ds.headerGap }}>
        {(['all', 'critical', 'warning', 'info'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all"
            style={{
              background: filter === f
                ? (f === 'critical' ? '#F44336' : f === 'warning' ? '#FF9800' : f === 'info' ? settings.primaryColor : settings.primaryColor)
                : (settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
              color: filter === f ? '#fff' : textMuted,
            }}
          >
            {f === 'all' ? `All (${alerts.length})` : f === 'critical' ? `Critical (${alerts.filter(a => a.severity === 'critical').length})` : f === 'warning' ? `Warning (${alerts.filter(a => a.severity === 'warning').length})` : `Info (${alerts.filter(a => a.severity === 'info').length})`}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto flex flex-col pr-0.5" style={{ gap: ds.gap }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((alert, i) => {
            const s = severityConfig[alert.severity as keyof typeof severityConfig];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 3 }}
                className="flex gap-3 rounded-2xl cursor-pointer group transition-all"
                style={{
                  padding: ds.itemPad,
                  background: settings.darkMode ? 'rgba(255,255,255,0.03)' : `${s.color}08`,
                  border: `1px solid ${s.color}22`,
                }}
              >
                <div
                  className="rounded-xl flex items-center justify-center shrink-0"
                  style={{ width: ds.iconBox - 4, height: ds.iconBox - 4, background: s.bg }}
                >
                  <s.icon size={ds.iconSize - 4} style={{ color: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold leading-snug truncate" style={{ color: textMain }}>{alert.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={10} style={{ color: textMuted }} />
                    <span className="text-xs opacity-60 truncate" style={{ color: textMuted }}>{alert.location}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  <div className="flex items-center gap-1">
                    <Clock size={9} style={{ color: textMuted }} />
                    <span className="text-xs opacity-50" style={{ color: textMuted }}>{alert.time}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-3 w-full py-2.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-all"
        style={{ background: getPrimaryBg(settings), color: '#fff' }}
      >
        View All Alerts <ArrowRight size={14} />
      </motion.button>
    </motion.div>
  );
}