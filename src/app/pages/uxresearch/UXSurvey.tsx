import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart2, PieChart as PieChartIcon, AlertTriangle, TrendingDown,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const TOOLS_DATA = [
  { name: 'SCADA (Legacy)', value: 38, color: '#1565C0' },
  { name: 'Excel / Sheets', value: 34, color: '#E65100' },
  { name: 'ERP / SAP',      value: 22, color: '#7B1FA2' },
  { name: 'WhatsApp',       value: 28, color: '#2E7D32' },
  { name: 'Paper Logbook',  value: 19, color: '#00838F' },
  { name: 'Email',          value: 25, color: '#C62828' },
];

const METRICS_DATA = [
  { name: 'Load Profile', value: 42, full: 42 },
  { name: 'Fault Status', value: 40, full: 42 },
  { name: 'Revenue',      value: 35, full: 42 },
  { name: 'AT&C Loss',    value: 38, full: 42 },
  { name: 'Power Factor', value: 30, full: 42 },
  { name: 'Alerts',       value: 41, full: 42 },
];

const PAIN_PIE = [
  { name: 'Alert Fatigue',       value: 31, color: '#C62828' },
  { name: 'Data Silos',          value: 26, color: '#E65100' },
  { name: 'Slow Reporting',      value: 22, color: '#7B1FA2' },
  { name: 'No Mobile Access',    value: 13, color: '#1565C0' },
  { name: 'Poor Visualisation',  value: 8,  color: '#2E7D32' },
];

const INSIGHT_CARDS = [
  { pct: '81%', text: 'of operators check alerts at least once every 15 minutes', severity: '#C62828' },
  { pct: '74%', text: 'say they have missed an alert because it was buried in the list', severity: '#E65100' },
  { pct: '67%', text: 'still use Excel or paper for at least one critical daily task', severity: '#E65100' },
  { pct: '62%', text: 'say data inconsistency across systems is their top frustration', severity: '#7B1FA2' },
  { pct: '55%', text: 'have never used the built-in reporting module of their current tool', severity: '#1565C0' },
  { pct: '48%', text: 'say they would benefit from predictive alerts sent 30 min in advance', severity: '#2E7D32' },
];

export function UXSurvey() {
  const { settings } = useTheme();
  const ff       = `var(--md-font-family, ${settings.fontFamily})`;
  const isDark   = settings.darkMode;
  const pageBg   = isDark ? '#111111' : '#f0f4fc';
  const cardBg   = isDark ? '#1e1e1e' : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain  = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted = isDark ? '#78909c' : '#546e7a';
  const surface   = isDark ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08`;
  const tooltipBg = isDark ? '#252525' : '#fff';
  const pri = settings.primaryColor;
  const sec = settings.secondaryColor;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
          <BarChart2 size={16} style={{ color: sec }} />
        </div>
        <div className="flex-1">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>Survey Insights</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>42 responses · Jan 27–31, 2026 · 18 questions</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Charts row */}
        <div className="grid grid-cols-3 gap-3">

          {/* Tools used bar chart */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="col-span-2 rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                <BarChart2 size={12} style={{ color: pri }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>Tools Currently Used (multiple choice, n=42)</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={TOOLS_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: tooltipBg, border: `1px solid ${border}`, borderRadius: 10, fontSize: '0.7rem', fontFamily: ff }}
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={32}>
                  {TOOLS_DATA.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pain points pie */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
                <PieChartIcon size={12} style={{ color: sec }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>Top Pain Points</span>
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={PAIN_PIE} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={2}>
                  {PAIN_PIE.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: tooltipBg, border: `1px solid ${border}`, borderRadius: 10, fontSize: '0.7rem', fontFamily: ff }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1">
              {PAIN_PIE.map(p => (
                <div key={p.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                  <span style={{ fontSize: '0.625rem', color: textMuted, flex: 1 }}>{p.name}</span>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, color: p.color }}>{p.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Metrics monitored daily */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>Metrics Monitored Daily — out of 42 respondents</div>
          <div className="grid grid-cols-3 gap-3">
            {METRICS_DATA.map(m => (
              <div key={m.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '0.65rem', color: textMuted }}>{m.name}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: pri }}>{m.value}/{m.full}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: surface }}>
                  <motion.div className="h-full rounded-full" style={{ background: pri }}
                    initial={{ width: 0 }} animate={{ width: `${(m.value / m.full) * 100}%` }} transition={{ delay: 0.3, duration: 0.5 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Insight cards grid */}
        <div className="grid grid-cols-3 gap-3">
          {INSIGHT_CARDS.map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.04 }}
              className="rounded-2xl p-3 flex items-start gap-3 group"
              style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="shrink-0 mt-0.5 relative" style={{ minWidth: 48 }}>
                {/* Percentage — fades out on hover */}
                <span
                  className="block transition-opacity duration-200 group-hover:opacity-0"
                  style={{ fontSize: '1.5rem', fontWeight: 800, color: c.severity, lineHeight: 1 }}>
                  {c.pct}
                </span>
                {/* Raw respondent count — fades in on hover */}
                <span
                  className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ fontSize: '1.5rem', fontWeight: 800, color: c.severity, lineHeight: 1 }}>
                  {Math.round(parseFloat(c.pct) / 100 * 42)}
                </span>
                <span
                  className="block opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ fontSize: '0.5rem', color: c.severity, fontWeight: 700, marginTop: 2, whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>
                  of 42
                </span>
              </div>
              <p style={{ fontSize: '0.65rem', color: textMuted, lineHeight: 1.6 }}>{c.text}</p>
            </motion.div>
          ))}
        </div>
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}