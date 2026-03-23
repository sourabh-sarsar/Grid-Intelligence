import React from 'react';
import { motion } from 'motion/react';
import { Activity, Zap, TrendingDown, Gauge } from 'lucide-react';
import { useTheme, getDensitySpacing } from '../../context/ThemeContext';

interface MicroWidgetProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  status: 'good' | 'warn' | 'bad' | 'info' | 'purple';
  trend?: string;
  delay?: number;
}

export function MicroWidget({ icon: Icon, label, value, unit, status, trend, delay = 0 }: MicroWidgetProps) {
  const { settings } = useTheme();
  const ds = getDensitySpacing(settings.density);
  const statusColors = {
    good: { color: '#2E7D32', bg: '#E8F5E9', ring: '#4CAF50' },
    warn: { color: '#E65100', bg: '#FFF3E0', ring: '#FF9800' },
    bad: { color: '#C62828', bg: '#FFEBEE', ring: '#F44336' },
    info: { color: settings.primaryColor, bg: `${settings.primaryColor}14`, ring: settings.primaryColor },
    purple: { color: '#6A1B9A', bg: '#F3E5F5', ring: '#AB47BC' },
  };
  const s = statusColors[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="rounded-2xl flex flex-col relative overflow-hidden h-full"
      style={{
        padding: ds.pad,
        gap: ds.gap,
        background: settings.darkMode ? '#1e1e1e' : '#fff',
        border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: settings.darkMode ? 'none' : `0 ${settings.cardShadow * 2}px ${settings.cardShadow * 8}px rgba(0,0,0,0.06)`,
        borderRadius: `${settings.cardBorderRadius}px`,
        fontFamily: settings.fontFamily,
      }}
    >
      <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full opacity-10" style={{ background: s.color }} />
      <div className="flex items-center justify-between">
        <div
          className="rounded-xl flex items-center justify-center shrink-0"
          style={{ width: ds.iconBox, height: ds.iconBox, background: s.bg }}
        >
          <Icon size={ds.iconSize - 2} style={{ color: s.color }} />
        </div>
        {trend && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="flex items-end gap-1">
          <span className="font-bold" style={{ fontSize: '22px', color: settings.darkMode ? '#e0e0e0' : '#1a1a2e', lineHeight: 1 }}>{value}</span>
          <span className="text-xs opacity-60 mb-0.5" style={{ color: settings.darkMode ? '#aaa' : '#546e7a' }}>{unit}</span>
        </div>
        <p className="text-xs opacity-60 mt-1" style={{ color: settings.darkMode ? '#aaa' : '#546e7a' }}>{label}</p>
      </div>
      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: status === 'good' ? '85%' : status === 'warn' ? '72%' : status === 'bad' ? '95%' : '60%' }}
          transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: s.ring }}
        />
      </div>
    </motion.div>
  );
}

export function MicroWidgetsRow() {
  return (
    <>
      <MicroWidget icon={Activity} label="Grid Health" value="97.4" unit="%" status="good" trend="↑ Healthy" delay={0.1} />
      <MicroWidget icon={Zap} label="Grid Frequency" value="49.98" unit="Hz" status="good" trend="Stable" delay={0.15} />
      <MicroWidget icon={Gauge} label="Power Factor" value="0.92" unit="pf" status="warn" trend="↓ Low" delay={0.2} />
      <MicroWidget icon={TrendingDown} label="Energy Losses" value="4.2" unit="%" status="warn" trend="↑ High" delay={0.25} />
    </>
  );
}