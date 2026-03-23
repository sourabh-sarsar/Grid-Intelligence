import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Clock } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { getPrimaryBg, primarySolid, getDensitySpacing } from '../../context/ThemeContext';

const forecastData24h = [
  { time: '00:00', actual: 2620, forecast: 2650, upper: 2800, lower: 2500 },
  { time: '02:00', actual: 2480, forecast: 2510, upper: 2660, lower: 2360 },
  { time: '04:00', actual: 2340, forecast: 2370, upper: 2520, lower: 2220 },
  { time: '06:00', actual: 2980, forecast: 3010, upper: 3160, lower: 2860 },
  { time: '08:00', actual: 3810, forecast: 3840, upper: 3990, lower: 3690 },
  { time: '10:00', actual: 4350, forecast: 4380, upper: 4530, lower: 4230 },
  { time: '12:00', actual: 4720, forecast: 4750, upper: 4900, lower: 4600 },
  { time: '14:00', actual: null, forecast: 4920, upper: 5100, lower: 4740 },
  { time: '16:00', actual: null, forecast: 4650, upper: 4820, lower: 4480 },
  { time: '18:00', actual: null, forecast: 5240, upper: 5440, lower: 5040 },
  { time: '20:00', actual: null, forecast: 4960, upper: 5160, lower: 4760 },
  { time: '22:00', actual: null, forecast: 3840, upper: 4040, lower: 3640 },
];

const forecastData7d = [
  { time: 'Mon', actual: 4720, forecast: 4750, upper: 5000, lower: 4500 },
  { time: 'Tue', actual: 4580, forecast: 4600, upper: 4850, lower: 4350 },
  { time: 'Wed', actual: 4920, forecast: 4950, upper: 5200, lower: 4700 },
  { time: 'Thu', actual: null, forecast: 5100, upper: 5400, lower: 4800 },
  { time: 'Fri', actual: null, forecast: 5280, upper: 5580, lower: 4980 },
  { time: 'Sat', actual: null, forecast: 4640, upper: 4940, lower: 4340 },
  { time: 'Sun', actual: null, forecast: 4200, upper: 4500, lower: 3900 },
];

export function ForecastCard() {
  const { settings } = useTheme();
  const ds = getDensitySpacing(settings.density);
  const [range, setRange] = useState<'24H' | '7D'>('24H');

  const data = range === '24H' ? forecastData24h : forecastData7d;

  // Derive current load from the last non-null actual reading
  const latestActual = [...data].reverse().find(d => d.actual !== null);
  const currentLoad = latestActual?.actual ?? 0;
  // The time label where actual ends and forecast begins
  const nowLabel = latestActual?.time ?? '';

  const peakForecast = Math.max(...data.map(d => d.forecast));

  const cardBg = settings.darkMode ? '#1e1e1e' : '#fff';
  const textMain = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const textMuted = settings.darkMode ? '#78909c' : '#546e7a';
  const gridColor = settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const borderColor = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.35 }}
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
      <div className="flex items-center justify-between" style={{ marginBottom: ds.headerGap }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${settings.primaryColor}18` }}>
            <TrendingUp size={18} style={{ color: settings.primaryColor }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-none" style={{ color: textMain }}>Load Forecast</h3>
            <p className="text-xs opacity-60 mt-0.5" style={{ color: textMuted }}>AI-powered prediction</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {(['24H', '7D'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3 py-1 rounded-xl text-xs font-medium transition-all"
              style={{
                background: range === r ? getPrimaryBg(settings) : (settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                color: range === r ? '#fff' : textMuted,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex" style={{ gap: ds.gap, marginBottom: ds.headerGap }}>
        <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2 text-xs" style={{ color: textMuted, background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
          <Clock size={12} />
          <span>Current: <strong style={{ color: textMain }}>{currentLoad} MW</strong></span>
        </div>
        <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2 text-xs" style={{ color: textMuted, background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
          <TrendingUp size={12} style={{ color: '#F44336' }} />
          <span>Peak Forecast: <strong style={{ color: '#F44336' }}>{peakForecast} MW</strong></span>
        </div>
        <div className="flex-1 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
          <span className="w-8 h-1 rounded opacity-40" style={{ background: settings.primaryColor }} />
          <span style={{ color: textMuted }}>Confidence band</span>
        </div>
      </div>

      <div className="flex-1 min-h-0" style={{ minHeight: '140px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={140}>
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <defs>
              {/* Gradient for the confidence band fill (upper bound → lower bound region) */}
              <linearGradient id="fc_bandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={primarySolid(settings)} stopOpacity={settings.darkMode ? 0.20 : 0.12} />
                <stop offset="100%" stopColor={primarySolid(settings)} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: textMuted, fontFamily: settings.fontFamily }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 10, fill: textMuted, fontFamily: settings.fontFamily }}
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
              contentStyle={{ borderRadius: '12px', border: 'none', background: settings.darkMode ? '#252525' : '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontFamily: settings.fontFamily, fontSize: '12px' }}
              formatter={(v: number | null, name: string) => {
                if (v === null || v === undefined) return ['-', name];
                const label = name === 'actual' ? 'Actual' : name === 'forecast' ? 'Forecast' : name === 'upper' ? 'Upper Band' : 'Lower Band';
                return [`${v} MW`, label];
              }}
            />
            {/*
              Confidence band technique:
              1. 'upper' fills from upper-bound line DOWN to chart baseline (light gradient)
              2. 'lower' fills from lower-bound line DOWN to chart baseline with solid cardBg
                 → this "erases" the gradient below the lower bound, leaving only the band
                 between upper and lower visually filled.
              3. 'actual' and 'forecast' lines are drawn on top with no fill.
            */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke={`${settings.primaryColor}50`}
              strokeWidth={1}
              strokeDasharray="4 4"
              fill="url(#fc_bandGrad)"
              name="upper"
              legendType="none"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke={`${settings.primaryColor}50`}
              strokeWidth={1}
              strokeDasharray="4 4"
              fill={cardBg}
              name="lower"
              legendType="none"
              dot={false}
            />
            {/* "Now" vertical divider — last time point with real data */}
            {nowLabel && (
              <ReferenceLine
                x={nowLabel}
                stroke={textMuted}
                strokeDasharray="4 3"
                strokeWidth={1}
                label={{ value: 'Now', position: 'insideTopRight', fontSize: 9, fill: textMuted, dy: -4 }}
              />
            )}
            {/* Actual readings — solid line, no fill */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke={settings.primaryColor}
              strokeWidth={2.5}
              fill="none"
              dot={false}
              activeDot={{ r: 4 }}
              name="actual"
              connectNulls={false}
            />
            {/* Forecast — dashed line, no fill */}
            <Area
              type="monotone"
              dataKey="forecast"
              stroke={settings.primaryColor}
              strokeWidth={1.8}
              strokeDasharray="6 3"
              fill="none"
              dot={false}
              activeDot={{ r: 4 }}
              name="forecast"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}