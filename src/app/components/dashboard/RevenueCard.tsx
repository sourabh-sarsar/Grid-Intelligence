import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, IndianRupee } from 'lucide-react';
import {
  Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Line, ComposedChart, Legend
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { getSecondaryBg, secondarySolid, getDensitySpacing } from '../../context/ThemeContext';

const dailyData = [
  { period: 'Mon', revenue: 42.8, projected: 44.0 },
  { period: 'Tue', revenue: 45.2, projected: 43.5 },
  { period: 'Wed', revenue: 38.9, projected: 42.0 },
  { period: 'Thu', revenue: 51.4, projected: 48.0 },
  { period: 'Fri', revenue: 48.7, projected: 49.0 },
  { period: 'Sat', revenue: 35.2, projected: 36.0 },
  { period: 'Sun', revenue: 31.8, projected: 33.0 },
];
const weeklyData = [
  { period: 'W1', revenue: 284, projected: 290 },
  { period: 'W2', revenue: 312, projected: 305 },
  { period: 'W3', revenue: 298, projected: 310 },
  { period: 'W4', revenue: 341, projected: 325 },
];
const monthlyData = [
  { period: 'Jan', revenue: 1240, projected: 1200 },
  { period: 'Feb', revenue: 1180, projected: 1220 },
  { period: 'Mar', revenue: 1356, projected: 1300 },
  { period: 'Apr', revenue: 1420, projected: 1380 },
  { period: 'May', revenue: 1510, projected: 1460 },
  { period: 'Jun', revenue: 1380, projected: 1420 },
];

export function RevenueCard() {
  const { settings } = useTheme();
  const ds = getDensitySpacing(settings.density);
  const [activeFilter, setActiveFilter] = useState('Daily');

  const currentData = activeFilter === 'Daily' ? dailyData : activeFilter === 'Weekly' ? weeklyData : monthlyData;
  const totalRevenue = currentData.reduce((s, d) => s + d.revenue, 0);
  const growth = 8.4;

  const cardBg = settings.darkMode ? '#1e1e1e' : '#fff';
  const textMain = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const textMuted = settings.darkMode ? '#78909c' : '#546e7a';
  const gridColor = settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const borderColor = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
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
      <div className="flex items-center justify-between gap-2 flex-wrap" style={{ marginBottom: ds.headerGap }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#FFF3E0' }}>
            <BarChart3 size={18} style={{ color: settings.secondaryColor }} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm leading-none truncate" style={{ color: textMain }}>Revenue Analytics</h3>
            <p className="text-xs opacity-60 mt-0.5 truncate" style={{ color: textMuted }}>Billing & Collections</p>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          {['Daily', 'Weekly', 'Monthly'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-2 py-1 rounded-xl font-medium transition-all"
              style={{
                fontSize: '0.68rem',
                background: activeFilter === f ? getSecondaryBg(settings) : (settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                color: activeFilter === f ? '#fff' : textMuted,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3" style={{ gap: ds.gap, marginBottom: ds.headerGap }}>
        <div className="rounded-xl px-2 py-2" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
          <p className="opacity-60 truncate" style={{ fontSize: '0.68rem', color: textMuted }}>Total Revenue</p>
          <div className="flex items-center gap-0.5 mt-0.5 flex-wrap">
            <IndianRupee size={13} style={{ color: textMain, flexShrink: 0 }} />
            <span className="font-bold leading-none" style={{ fontSize: '0.95rem', color: textMain }}>{totalRevenue.toFixed(1)}Cr</span>
          </div>
        </div>
        <div className="rounded-xl px-2 py-2" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
          <p className="opacity-60 truncate" style={{ fontSize: '0.68rem', color: textMuted }}>Growth</p>
          <div className="flex items-center gap-0.5 mt-0.5 flex-wrap">
            <TrendingUp size={12} style={{ color: '#4CAF50', flexShrink: 0 }} />
            <span className="font-bold leading-none" style={{ fontSize: '0.95rem', color: '#4CAF50' }}>+{growth}%</span>
          </div>
        </div>
        <div className="rounded-xl px-2 py-2" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
          <p className="opacity-60 truncate" style={{ fontSize: '0.68rem', color: textMuted }}>Projected</p>
          <div className="flex items-center gap-0.5 mt-0.5 flex-wrap">
            <IndianRupee size={13} style={{ color: settings.secondaryColor, flexShrink: 0 }} />
            <span className="font-bold leading-none" style={{ fontSize: '0.95rem', color: settings.secondaryColor }}>{(totalRevenue * 1.084).toFixed(1)}Cr</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0" style={{ minHeight: '140px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={140}>
          <ComposedChart data={currentData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rev_revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={secondarySolid(settings)} stopOpacity={0.9} />
                <stop offset="100%" stopColor={settings.secondaryGradientTo || settings.secondaryColor} stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 10, fill: textMuted, fontFamily: settings.fontFamily }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: textMuted, fontFamily: settings.fontFamily }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', background: settings.darkMode ? '#252525' : '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontFamily: settings.fontFamily, fontSize: '12px' }}
              formatter={(v: number, name: string) => [`₹${v} Cr`, name === 'revenue' ? 'Actual Revenue' : 'Projected Revenue']}
            />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: '10px', fontFamily: settings.fontFamily, color: textMuted }}
              formatter={(value: string) => value === 'revenue' ? 'Actual' : 'Projected'}
            />
            <Bar dataKey="revenue" fill="url(#rev_revGrad)" radius={[6, 6, 0, 0]} name="revenue" />
            <Line
              type="monotone"
              dataKey="projected"
              stroke={textMuted}
              strokeWidth={1.8}
              strokeDasharray="5 3"
              dot={{ r: 3, fill: textMuted, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
              name="projected"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}