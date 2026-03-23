import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ComposedChart, Area, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft, TrendingUp, TrendingDown, Brain, Zap, Cloud,
  Thermometer, Droplets, Wind, Calendar, Target, RefreshCw,
  CheckCircle, AlertTriangle, Download, Activity, Sun,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme, getDensitySpacing } from '../context/ThemeContext';

type Horizon = 'Day' | 'Week' | 'Month';

// ── Day-ahead data (today 17 Mar, 24h) ───────────────────────────────────────
const DAY_DATA = [
  { t: '00', actual: 284, forecast: 288, upper: 302, lower: 274 },
  { t: '01', actual: 268, forecast: 271, upper: 285, lower: 257 },
  { t: '02', actual: 258, forecast: 260, upper: 273, lower: 247 },
  { t: '03', actual: 252, forecast: 255, upper: 268, lower: 242 },
  { t: '04', actual: 254, forecast: 257, upper: 270, lower: 244 },
  { t: '05', actual: 261, forecast: 265, upper: 278, lower: 252 },
  { t: '06', actual: 288, forecast: 290, upper: 305, lower: 275 },
  { t: '07', actual: 324, forecast: 320, upper: 337, lower: 303 },
  { t: '08', actual: 378, forecast: 375, upper: 394, lower: 356 },
  { t: '09', actual: 412, forecast: 408, upper: 428, lower: 388 },
  { t: '10', actual: 438, forecast: 440, upper: 462, lower: 418 },
  { t: '11', actual: 456, forecast: 452, upper: 474, lower: 430 },
  { t: '12', actual: 468, forecast: 464, upper: 487, lower: 441 },
  { t: '13', actual: 475, forecast: 471, upper: 494, lower: 448 },
  { t: '14', actual: 480, forecast: 478, upper: 501, lower: 455 },
  { t: '15', actual: 487, forecast: 485, upper: 508, lower: 462 },
  { t: '16', actual: null, forecast: 512, upper: 538, lower: 486 },
  { t: '17', actual: null, forecast: 538, upper: 566, lower: 510 },
  { t: '18', actual: null, forecast: 562, upper: 592, lower: 532 },
  { t: '19', actual: null, forecast: 584, upper: 615, lower: 553 },
  { t: '20', actual: null, forecast: 608, upper: 640, lower: 576 },
  { t: '21', actual: null, forecast: 618, upper: 650, lower: 586 },
  { t: '22', actual: null, forecast: 596, upper: 628, lower: 564 },
  { t: '23', actual: null, forecast: 554, upper: 583, lower: 525 },
];

const WEEK_DATA = [
  { day: 'Today 17', peak: 618, valley: 252, avg: 468, prev: 604, type: 'Weekday' },
  { day: 'Wed 18',   peak: 624, valley: 258, avg: 474, prev: 610, type: 'Weekday' },
  { day: 'Thu 19',   peak: 632, valley: 261, avg: 482, prev: 618, type: 'Weekday' },
  { day: 'Fri 20',   peak: 641, valley: 264, avg: 490, prev: 626, type: 'Weekday' },
  { day: 'Sat 21',   peak: 548, valley: 234, avg: 428, prev: 538, type: 'Weekend' },
  { day: 'Sun 22',   peak: 524, valley: 218, avg: 412, prev: 516, type: 'Weekend' },
  { day: 'Mon 23',   peak: 636, valley: 258, avg: 484, prev: 622, type: 'Weekday' },
];

const MONTH_DATA = [
  { wk: 'W1 Mar',  peak: 598, valley: 241, avg: 458 },
  { wk: 'W2 Mar',  peak: 612, valley: 248, avg: 468 },
  { wk: 'W3 Mar',  peak: 632, valley: 254, avg: 481 },
  { wk: 'W4 Mar',  peak: 648, valley: 260, avg: 492 },
  { wk: 'W1 Apr',  peak: 668, valley: 268, avg: 504 },
  { wk: 'W2 Apr',  peak: 684, valley: 274, avg: 518 },
];

const INFLUENCING_FACTORS = [
  { factor: 'Temperature',     value: '28°C',      impact: '+4.2%',  up: true,  Icon: Thermometer, color: '#EF5350' },
  { factor: 'Humidity',        value: '62%',        impact: '+1.8%',  up: true,  Icon: Droplets,    color: '#1565C0' },
  { factor: 'Wind Speed',      value: '12 km/h',   impact: '−0.4%',  up: false, Icon: Wind,        color: '#00838F' },
  { factor: 'Cloud Cover',     value: '15%',        impact: '+2.1%',  up: true,  Icon: Cloud,       color: '#546e7a' },
  { factor: 'Day Type',        value: 'Weekday',    impact: '+12.6%', up: true,  Icon: Calendar,    color: '#7B1FA2' },
  { factor: 'Solar Irradiance',value: '680 W/m²',   impact: '−1.2%',  up: false, Icon: Sun,         color: '#FF9800' },
];

const MODEL_METRICS = [
  { label: 'Forecast Accuracy', val: '97.9%', sub: 'MAPE basis',    col: '#4CAF50', trend: '+0.3%' },
  { label: 'MAE',               val: '8.4 MW',sub: 'Mean abs error',col: '#1565C0', trend: '−0.6 MW' },
  { label: 'RMSE',              val: '11.2 MW',sub: 'Root mean sq', col: '#7B1FA2', trend: '−0.9 MW' },
  { label: 'Peak Accuracy',     val: '98.4%', sub: 'Max demand',    col: '#FF9800', trend: '+0.1%' },
];

const UPCOMING_EVENTS = [
  { date: '18 Mar', event: 'Holi Holiday',         impact: '−18% load',  col: '#4CAF50' },
  { date: '22 Mar', event: 'Summer onset',          impact: '+8% trend',  col: '#EF5350' },
  { date: '29 Mar', event: 'Industrial shutdown',   impact: '−12% peak',  col: '#FF9800' },
  { date: '01 Apr', event: 'FY changeover',         impact: 'High demand',col: '#7B1FA2' },
];

interface ForecastPageProps { onBack?: () => void; }

export function ForecastPage({ onBack }: ForecastPageProps) {
  const { settings } = useTheme();
  const ff      = `var(--md-font-family, ${settings.fontFamily})`;
  const isDark  = settings.darkMode;
  const pageBg  = isDark ? '#111111' : '#f0f4fc';
  const cardBg  = isDark ? '#1e1e1e' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain= isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted = isDark ? '#78909c' : '#546e7a';
  const surface = isDark ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08`;
  const gridC   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const ttBg    = isDark ? '#252525' : '#fff';
  const pri = settings.primaryColor;
  const sec = settings.secondaryColor;

  const [horizon, setHorizon] = useState<Horizon>('Day');
  const [retraining, setRetraining] = useState(false);

  const todayPeak = 618;
  const todayValley = 252;
  const todayAvg = 468;

  function handleRetrain() {
    setRetraining(true);
    setTimeout(() => {
      setRetraining(false);
      toast.success('Model retrained', { description: 'Forecasting model updated with latest 30-day data' });
    }, 2200);
  }

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const items = payload.filter((p: any) => p.value !== null && p.dataKey !== 'upper' && p.dataKey !== 'lower');
    if (!items.length) return null;
    return (
      <div style={{ background: ttBg, border: `1px solid ${border}`, borderRadius: 12, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontFamily: ff }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMain, marginBottom: 6 }}>{label}{horizon === 'Day' ? ':00' : ''}</div>
        {items.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2" style={{ fontSize: '0.68rem', color: textMuted, marginBottom: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.stroke ?? p.fill, display: 'inline-block' }} />
            <span>{p.name}:</span>
            <span style={{ fontWeight: 700, color: textMain }}>{p.value} MW</span>
          </div>
        ))}
      </div>
    );
  };

  const chartData = horizon === 'Day' ? DAY_DATA : horizon === 'Week' ? WEEK_DATA : MONTH_DATA;
  const xKey     = horizon === 'Day' ? 't' : horizon === 'Week' ? 'day' : 'wk';

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}>
        {onBack && (
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={onBack}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: surface, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(21,101,192,0.15)'}` }}>
            <ArrowLeft size={15} style={{ color: pri }} />
          </motion.button>
        )}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
          <Brain size={16} style={{ color: pri }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>AI Demand Forecasting</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>ML-powered short & long-term load prediction · LSTM model v3.2</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(['Day', 'Week', 'Month'] as Horizon[]).map(h => (
            <button key={h} onClick={() => setHorizon(h)}
              className="px-2.5 py-1 rounded-xl transition-all"
              style={{ fontSize: '0.68rem', fontWeight: 600, fontFamily: ff,
                background: horizon === h ? pri : surface,
                color: horizon === h ? '#fff' : textMuted,
                border: `1px solid ${horizon === h ? 'transparent' : border}` }}>{h}</button>
          ))}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRetrain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: `${sec}15`, color: sec, border: `1px solid ${sec}30`, fontSize: '0.68rem', fontWeight: 600, fontFamily: ff }}>
            <motion.span animate={retraining ? { rotate: 360 } : { rotate: 0 }}
              transition={retraining ? { repeat: Infinity, duration: 0.8, ease: 'linear' } : {}}>
              <RefreshCw size={12} />
            </motion.span>
            {retraining ? 'Retraining…' : 'Retrain'}
          </motion.button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel */}
        <div className="flex flex-col gap-3 p-3 overflow-y-auto shrink-0" style={{ width: 280, borderRight: `1px solid ${border}` }}>
          {/* Today's KPIs */}
          <div className="rounded-2xl p-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontFamily: ff }}>Today's Forecast</div>
            {[
              { label: 'Predicted Peak',   val: `${todayPeak} MW`,   sub: 'at ~21:00',    col: sec },
              { label: 'Predicted Valley', val: `${todayValley} MW`, sub: 'at ~03:00',    col: '#7B1FA2' },
              { label: 'Avg Demand',       val: `${todayAvg} MW`,    sub: '24h mean',     col: pri },
              { label: 'Energy (MU)',       val: '11.23 MU',          sub: 'Today total',  col: '#4CAF50' },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-2 py-2" style={{ borderBottom: `1px solid ${border}` }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: m.col }} />
                <span style={{ fontSize: '0.68rem', color: textMuted, fontFamily: ff, flex: 1 }}>{m.label}</span>
                <div className="text-right">
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textMain, fontFamily: ff }}>{m.val}</div>
                  <div style={{ fontSize: '0.58rem', color: textMuted, fontFamily: ff }}>{m.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Model metrics */}
          <div className="rounded-2xl p-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontFamily: ff }}>Model Performance</div>
            {MODEL_METRICS.map(m => (
              <div key={m.label} className="flex items-center gap-2 py-2" style={{ borderBottom: `1px solid ${border}` }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: textMuted, fontFamily: ff }}>{m.label}</div>
                  <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{m.sub}</div>
                </div>
                <div className="ml-auto text-right">
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: m.col, fontFamily: ff }}>{m.val}</div>
                  <div style={{ fontSize: '0.625rem', color: '#4CAF50', fontFamily: ff }}>{m.trend}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-1.5 mt-2 pt-2">
              <CheckCircle size={11} style={{ color: '#4CAF50' }} />
              <span style={{ fontSize: '0.625rem', color: '#4CAF50', fontFamily: ff }}>Last trained: 16 Mar 2026 · 30-day window</span>
            </div>
          </div>

          {/* Weather / influencing factors */}
          <div className="rounded-2xl p-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontFamily: ff }}>Influencing Factors</div>
            {INFLUENCING_FACTORS.map(f => (
              <div key={f.factor} className="flex items-center gap-2 py-1.5" style={{ borderBottom: `1px solid ${border}` }}>
                <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${f.color}18` }}>
                  <f.Icon size={10} style={{ color: f.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.65rem', color: textMain, fontFamily: ff, fontWeight: 600 }}>{f.factor}</div>
                  <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{f.value}</div>
                </div>
                <span className="px-1.5 py-0.5 rounded-full"
                  style={{ fontSize: '0.625rem', fontWeight: 700, background: f.up ? '#EF535018' : '#4CAF5018', color: f.up ? '#EF5350' : '#4CAF50', fontFamily: ff }}>
                  {f.impact}
                </span>
              </div>
            ))}
          </div>

          {/* Upcoming events */}
          <div className="rounded-2xl p-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontFamily: ff }}>Upcoming Events</div>
            {UPCOMING_EVENTS.map(e => (
              <div key={e.date} className="flex items-center gap-2 py-1.5" style={{ borderBottom: `1px solid ${border}` }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: e.col }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, color: textMain, fontFamily: ff }}>{e.event}</div>
                  <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{e.date}</div>
                </div>
                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: e.col, fontFamily: ff }}>{e.impact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Main forecast chart */}
          <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                  <Target size={13} style={{ color: pri }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: textMain, fontFamily: ff }}>
                    {horizon === 'Day' ? 'Day-Ahead Load Forecast' : horizon === 'Week' ? '7-Day Peak Demand Outlook' : '6-Week Demand Outlook'}
                  </div>
                  <div style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>
                    {horizon === 'Day' ? 'Actual (00–15h) · Forecast + 95% CI (16–23h) · MW' : 'Peak / Valley / Average demand · MW'}
                  </div>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => toast.success('Forecast exported', { description: `${horizon}-ahead forecast downloaded` })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0"
                style={{ background: surface, border: `1px solid ${border}`, fontSize: '0.68rem', color: textMuted, fontFamily: ff }}>
                <Download size={12} /> Export
              </motion.button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={horizon} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {horizon === 'Day' ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <ComposedChart data={DAY_DATA} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="fc_aGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={pri} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={pri} stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="fc_uGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={sec} stopOpacity={0.14} />
                          <stop offset="100%" stopColor={sec} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridC} vertical={false} />
                      <XAxis dataKey="t" tick={{ fontSize: 9, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} interval={2} />
                      <YAxis tick={{ fontSize: 9, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} domain={[180, 700]} />
                      <Tooltip content={<Tip />} />
                      <Area type="monotone" dataKey="upper" fill="url(#fc_uGrad)" stroke="none" legendType="none" connectNulls />
                      <Area type="monotone" dataKey="actual" fill="url(#fc_aGrad)" stroke={pri} strokeWidth={2} dot={false} name="Actual" connectNulls={false} />
                      <Line type="monotone" dataKey="forecast" stroke={sec} strokeWidth={2} strokeDasharray="6 3" dot={false} name="Forecast" connectNulls />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="fc_peakGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={sec} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={sec} stopOpacity={0.5} />
                        </linearGradient>
                        <linearGradient id="fc_avgGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={pri} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={pri} stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridC} vertical={false} />
                      <XAxis dataKey={xKey} tick={{ fontSize: 9, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} domain={[0, 750]} />
                      <Tooltip content={<Tip />} />
                      <Bar dataKey="peak" name="Peak" fill="url(#fc_peakGrad)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      <Bar dataKey="avg"  name="Avg"  fill="url(#fc_avgGrad)"  radius={[4, 4, 0, 0]} maxBarSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Weekly pattern + Seasonal trend */}
          <div className="grid grid-cols-2 gap-4">
            {/* Weekly demand pattern */}
            <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
                  <Activity size={13} style={{ color: sec }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>7-Day Peak Breakdown</span>
              </div>
              <div className="flex flex-col gap-2">
                {WEEK_DATA.map(d => {
                  const isWeekend = d.type === 'Weekend';
                  const pct = (d.peak / 700) * 100;
                  const col = isWeekend ? '#7B1FA2' : pri;
                  return (
                    <div key={d.day}>
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded-full"
                            style={{ fontSize: '0.56rem', fontWeight: 700, background: `${col}15`, color: col, fontFamily: ff }}>
                            {d.type === 'Weekend' ? 'WE' : 'WD'}
                          </span>
                          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: textMain, fontFamily: ff }}>{d.day}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '0.65rem', color: textMuted, fontFamily: ff }}>Avg {d.avg}</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: textMain, fontFamily: ff }}>{d.peak} MW</span>
                        </div>
                      </div>
                      <div className="rounded-full overflow-hidden" style={{ height: 5, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{ height: '100%', background: col, borderRadius: 999 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seasonal / growth trend */}
            <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                  <TrendingUp size={13} style={{ color: pri }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Growth Trend Projection</span>
              </div>
              <ResponsiveContainer width="100%" height={170}>
                <ComposedChart data={MONTH_DATA} margin={{ top: 4, right: 8, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fc_trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={pri} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={pri} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridC} vertical={false} />
                  <XAxis dataKey="wk" tick={{ fontSize: 8, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} domain={[200, 720]} />
                  <Tooltip content={<Tip />} />
                  <Area type="monotone" dataKey="peak" name="Peak" fill="url(#fc_trendGrad)" stroke={pri} strokeWidth={2} dot={{ r: 3, fill: pri }} />
                  <Line type="monotone" dataKey="avg" name="Avg" stroke={sec} strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: `1px solid ${border}` }}>
                <span style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>Projected summer peak</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#EF5350', fontFamily: ff }}>~720 MW by Apr 2026</span>
              </div>
            </div>
          </div>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  );
}