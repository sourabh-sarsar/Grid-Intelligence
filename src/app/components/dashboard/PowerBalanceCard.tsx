import { useTheme } from '../../context/ThemeContext';
import { getPrimaryBg, getSecondaryBg, primarySolid, secondarySolid, getDensitySpacing } from '../../context/ThemeContext';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';

const DATA_12H = [
  { time: '12:00', supply: 4580, load: 4720 },
  { time: '13:00', supply: 4680, load: 4800 },
  { time: '14:00', supply: 4850, load: 4920 },
  { time: '15:00', supply: 4760, load: 4840 },
  { time: '16:00', supply: 4650, load: 4580 },
  { time: '17:00', supply: 4900, load: 5020 },
  { time: '18:00', supply: 5100, load: 5240 },
  { time: '19:00', supply: 5020, load: 5180 },
  { time: '20:00', supply: 4820, load: 4960 },
  { time: '21:00', supply: 4460, load: 4380 },
  { time: '22:00', supply: 3980, load: 3840 },
  { time: '23:00', supply: 3620, load: 3500 },
];

const DATA_24H = [
  { time: '00:00', supply: 2850, load: 2620 },
  { time: '02:00', supply: 2720, load: 2480 },
  { time: '04:00', supply: 2680, load: 2340 },
  { time: '06:00', supply: 3100, load: 2980 },
  { time: '08:00', supply: 3640, load: 3810 },
  { time: '10:00', supply: 4120, load: 4350 },
  { time: '12:00', supply: 4580, load: 4720 },
  { time: '14:00', supply: 4850, load: 4920 },
  { time: '16:00', supply: 4650, load: 4580 },
  { time: '18:00', supply: 5100, load: 5240 },
  { time: '20:00', supply: 4820, load: 4960 },
  { time: '22:00', supply: 3980, load: 3840 },
];

const DATA_7D = [
  { time: 'Mon', supply: 4280, load: 4120 },
  { time: 'Tue', supply: 4420, load: 4380 },
  { time: 'Wed', supply: 4360, load: 4410 },
  { time: 'Thu', supply: 4510, load: 4460 },
  { time: 'Fri', supply: 4680, load: 4720 },
  { time: 'Sat', supply: 3840, load: 3780 },
  { time: 'Sun', supply: 3620, load: 3560 },
];

const RANGE_DATA: Record<string, typeof DATA_24H> = {
  '12H': DATA_12H,
  '24H': DATA_24H,
  '7D':  DATA_7D,
};

export function PowerBalanceCard() {
  const { settings } = useTheme();
  const ds = getDensitySpacing(settings.density);
  const [activeRange, setActiveRange] = useState('24H');

  const cardBg = settings.darkMode ? '#1e1e1e' : '#fff';
  const textMain = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const textMuted = settings.darkMode ? '#78909c' : '#546e7a';
  const gridColor = settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const borderColor = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const tooltipBg = settings.darkMode ? '#252525' : '#fff';
  const tooltipBorder = settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  // Derive stats from the last data point of the active range
  const activeData = RANGE_DATA[activeRange];
  const latest = activeData[activeData.length - 1];
  const currentSupply = latest.supply;
  const currentLoad = latest.load;
  const balance = currentSupply - currentLoad;
  const isDeficit = balance < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
      className="flex flex-col h-full"
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        boxShadow: settings.darkMode ? 'none' : `0 ${settings.cardShadow * 2}px ${settings.cardShadow * 10}px rgba(0,0,0,0.06)`,
        borderRadius: `${settings.cardBorderRadius}px`,
        fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
        padding: ds.pad,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: ds.headerGap }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${settings.primaryColor}18` }}>
            <Zap size={16} style={{ color: settings.primaryColor }} />
          </div>
          <div>
            <h3 className="font-semibold leading-none" style={{ fontSize: '0.8rem', color: textMain }}>Power Balance</h3>
            <p className="opacity-60 mt-0.5" style={{ fontSize: '0.68rem', color: textMuted }}>Supply vs Load — MW</p>
          </div>
        </div>
        <div className="flex gap-1">
          {['12H', '24H', '7D'].map(r => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className="px-2.5 py-1 rounded-xl font-medium transition-all"
              style={{
                fontSize: '0.7rem',
                background: activeRange === r ? getPrimaryBg(settings) : (settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                color: activeRange === r ? '#fff' : textMuted,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-3" style={{ gap: ds.gap, marginBottom: ds.headerGap }}>
        <div className="rounded-2xl p-2.5" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08` }}>
          <p className="opacity-60 mb-1" style={{ fontSize: '0.65rem', color: textMuted }}>Supply</p>
          <div className="flex items-center gap-1">
            <TrendingUp size={11} style={{ color: settings.primaryColor }} />
            <span className="font-bold" style={{ fontSize: '1rem', color: settings.primaryColor }}>{currentSupply.toLocaleString()}</span>
          </div>
          <span className="opacity-50" style={{ fontSize: '0.65rem', color: textMuted }}>MW</span>
        </div>
        <div className="rounded-2xl p-2.5" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.04)' : `${settings.secondaryColor}0a` }}>
          <p className="opacity-60 mb-1" style={{ fontSize: '0.65rem', color: textMuted }}>Load</p>
          <div className="flex items-center gap-1">
            <TrendingUp size={11} style={{ color: settings.secondaryColor }} />
            <span className="font-bold" style={{ fontSize: '1rem', color: settings.secondaryColor }}>{currentLoad.toLocaleString()}</span>
          </div>
          <span className="opacity-50" style={{ fontSize: '0.65rem', color: textMuted }}>MW</span>
        </div>
        <div className="rounded-2xl p-2.5" style={{
          background: isDeficit
            ? (settings.darkMode ? 'rgba(244,67,54,0.1)' : '#FFEBEE')
            : (settings.darkMode ? 'rgba(76,175,80,0.1)' : '#E8F5E9'),
        }}>
          <p className="opacity-60 mb-1" style={{ fontSize: '0.65rem', color: isDeficit ? '#F44336' : '#4CAF50' }}>Balance</p>
          <div className="flex items-center gap-1">
            {isDeficit
              ? <TrendingDown size={11} style={{ color: '#F44336' }} />
              : <TrendingUp size={11} style={{ color: '#4CAF50' }} />
            }
            <span className="font-bold" style={{ fontSize: '1rem', color: isDeficit ? '#F44336' : '#4CAF50' }}>{Math.abs(balance).toLocaleString()}</span>
          </div>
          <span className="font-medium" style={{ fontSize: '0.65rem', color: isDeficit ? '#F44336' : '#4CAF50' }}>{isDeficit ? '⚠ Deficit' : '✓ Surplus'}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0" style={{ minHeight: '140px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={140}>
          <AreaChart data={activeData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="pb_supplyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={primarySolid(settings)}   stopOpacity={settings.darkMode ? 0.30 : 0.22} />
                <stop offset="95%" stopColor={primarySolid(settings)}   stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pb_loadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={secondarySolid(settings)} stopOpacity={settings.darkMode ? 0.20 : 0.13} />
                <stop offset="95%" stopColor={secondarySolid(settings)} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: textMuted, fontFamily: `var(--md-font-family)` }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: textMuted, fontFamily: `var(--md-font-family)` }}
              axisLine={false}
              tickLine={false}
              domain={[
                (d: number) => Math.floor(d / 500) * 500,
                (d: number) => Math.ceil(d / 500) * 500,
              ]}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
              tickCount={5}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: `1px solid ${tooltipBorder}`,
                background: tooltipBg,
                boxShadow: settings.darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)',
                fontFamily: `var(--md-font-family)`,
                fontSize: '11px',
                color: textMain,
              }}
              labelStyle={{ color: textMuted, fontSize: '10px' }}
              formatter={(v: number, name: string) => [`${v.toLocaleString()} MW`, name === 'supply' ? 'Supply' : 'Load']}
            />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: '10px', fontFamily: `var(--md-font-family)`, color: textMuted }}
            />
            {/* Load rendered first (behind), Supply rendered on top so its line stays visible */}
            <Area
              type="monotone"
              dataKey="load"
              stroke={settings.secondaryColor}
              strokeWidth={2}
              fill="url(#pb_loadGrad)"
              name="load"
              dot={false}
              activeDot={{ r: 3, fill: settings.secondaryColor }}
            />
            <Area
              type="monotone"
              dataKey="supply"
              stroke={settings.primaryColor}
              strokeWidth={2}
              fill="url(#pb_supplyGrad)"
              name="supply"
              dot={false}
              activeDot={{ r: 3, fill: settings.primaryColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}