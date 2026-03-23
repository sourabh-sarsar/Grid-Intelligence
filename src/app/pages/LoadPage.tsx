import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  ArrowLeft, Activity, Zap, TrendingUp, AlertTriangle,
  RefreshCw, Gauge, Download, GitBranch, BarChart2,
  Clock, Radio, ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';

type FeederStatus = 'Active' | 'Overloaded' | 'Critical' | 'Offline';

const LOAD_CURVE = [
  { h: '00', actual: 284, forecast: 288 },
  { h: '01', actual: 268, forecast: 271 },
  { h: '02', actual: 258, forecast: 260 },
  { h: '03', actual: 252, forecast: 255 },
  { h: '04', actual: 254, forecast: 257 },
  { h: '05', actual: 261, forecast: 265 },
  { h: '06', actual: 288, forecast: 290 },
  { h: '07', actual: 324, forecast: 320 },
  { h: '08', actual: 378, forecast: 375 },
  { h: '09', actual: 412, forecast: 408 },
  { h: '10', actual: 438, forecast: 440 },
  { h: '11', actual: 456, forecast: 452 },
  { h: '12', actual: 468, forecast: 464 },
  { h: '13', actual: 475, forecast: 471 },
  { h: '14', actual: 480, forecast: 478 },
  { h: '15', actual: 487, forecast: 485 },
  { h: '16', actual: null, forecast: 512 },
  { h: '17', actual: null, forecast: 538 },
  { h: '18', actual: null, forecast: 562 },
  { h: '19', actual: null, forecast: 584 },
  { h: '20', actual: null, forecast: 608 },
  { h: '21', actual: null, forecast: 618 },
  { h: '22', actual: null, forecast: 596 },
  { h: '23', actual: null, forecast: 554 },
];

const ZONES = [
  { zone: 'Zone B', load: 124.6, capacity: 140, consumers: 42800 },
  { zone: 'Zone A', load:  98.4, capacity: 110, consumers: 38600 },
  { zone: 'Zone D', load: 112.8, capacity: 130, consumers: 31400 },
  { zone: 'Zone C', load:  87.2, capacity: 100, consumers: 27200 },
  { zone: 'Zone E', load:  64.4, capacity:  85, consumers: 16000 },
];

const FEEDERS: Array<{
  id: string; name: string; zone: string; load: number; capacity: number;
  status: FeederStatus; voltage: number; pf: number; kvar: number;
}> = [
  { id: 'F-001', name: 'Sector 18 Commercial',   zone: 'Zone A', load: 18.4, capacity: 21.9, status: 'Active',     voltage: 11.02, pf: 0.88, kvar: 2.4 },
  { id: 'F-002', name: 'Sector 37 Residential',  zone: 'Zone A', load: 12.6, capacity: 16.0, status: 'Active',     voltage: 10.98, pf: 0.90, kvar: 1.4 },
  { id: 'F-003', name: 'Knowledge Park IT',       zone: 'Zone D', load: 22.8, capacity: 24.0, status: 'Overloaded', voltage: 10.84, pf: 0.86, kvar: 3.7 },
  { id: 'F-004', name: 'Sector 62 IT Park',       zone: 'Zone B', load: 19.4, capacity: 22.0, status: 'Active',     voltage: 10.94, pf: 0.87, kvar: 2.9 },
  { id: 'F-005', name: 'Greater Noida West',      zone: 'Zone D', load: 15.2, capacity: 20.7, status: 'Active',     voltage: 11.08, pf: 0.91, kvar: 1.5 },
  { id: 'F-006', name: 'Surajpur Industrial',     zone: 'Zone E', load: 24.6, capacity: 25.0, status: 'Critical',   voltage: 10.72, pf: 0.83, kvar: 4.9 },
  { id: 'F-007', name: 'Kasna Residential',       zone: 'Zone E', load: 11.8, capacity: 17.3, status: 'Active',     voltage: 11.04, pf: 0.92, kvar: 0.9 },
  { id: 'F-008', name: 'Aqua Line Metro',         zone: 'Zone C', load:  8.4, capacity: 10.0, status: 'Active',     voltage: 11.12, pf: 0.94, kvar: 0.5 },
  { id: 'F-009', name: 'Pari Chowk Commercial',   zone: 'Zone D', load: 16.2, capacity: 20.0, status: 'Active',     voltage: 10.96, pf: 0.88, kvar: 2.2 },
  { id: 'F-010', name: 'Delta Sector Industrial', zone: 'Zone E', load: 14.4, capacity: 18.6, status: 'Active',     voltage: 11.02, pf: 0.89, kvar: 1.8 },
  { id: 'F-011', name: 'Sector 50 Residential',   zone: 'Zone B', load: 16.8, capacity: 19.4, status: 'Active',     voltage: 10.92, pf: 0.90, kvar: 1.7 },
  { id: 'F-012', name: 'Noida Expressway',         zone: 'Zone C', load: 21.6, capacity: 25.0, status: 'Active',     voltage: 10.88, pf: 0.87, kvar: 2.8 },
];

const STATUS_CFG: Record<FeederStatus, { color: string; label: string }> = {
  Active:     { color: '#4CAF50', label: 'Normal' },
  Overloaded: { color: '#FF9800', label: 'Overloaded' },
  Critical:   { color: '#EF5350', label: 'Critical' },
  Offline:    { color: '#78909c', label: 'Offline' },
};

interface LoadPageProps { onBack?: () => void; }

export function LoadPage({ onBack }: LoadPageProps) {
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

  const [selectedId, setSelectedId] = useState('F-001');
  const [refreshing, setRefreshing] = useState(false);
  const [liveLoad, setLiveLoad] = useState(487.4);
  const [filterStatus, setFilterStatus] = useState<'All' | FeederStatus>('All');

  const feeder = FEEDERS.find(f => f.id === selectedId) ?? FEEDERS[0];
  const feederPct = (feeder.load / feeder.capacity) * 100;
  const feederCfg = STATUS_CFG[feeder.status];
  const filteredFeeders = filterStatus === 'All' ? FEEDERS : FEEDERS.filter(f => f.status === filterStatus);
  const criticalCount = FEEDERS.filter(f => f.status === 'Critical' || f.status === 'Overloaded').length;

  useEffect(() => {
    const t = setInterval(() => {
      setLiveLoad(p => Math.round((p + (Math.random() - 0.42) * 2.4) * 10) / 10);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('SCADA data refreshed', { description: 'All feeder readings updated in real-time' });
    }, 1500);
  }

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: ttBg, border: `1px solid ${border}`, borderRadius: 12, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontFamily: ff }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMain, marginBottom: 6 }}>{label}:00</div>
        {payload.filter((p: any) => p.value !== null).map((p: any) => (
          <div key={p.name} className="flex items-center gap-2" style={{ fontSize: '0.68rem', color: textMuted, marginBottom: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.stroke, display: 'inline-block' }} />
            <span>{p.name}:</span>
            <span style={{ fontWeight: 700, color: textMain }}>{p.value} MW</span>
          </div>
        ))}
      </div>
    );
  };

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
          <Activity size={16} style={{ color: pri }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>Load Monitoring</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>Real-time demand analysis · SCADA live · 17 Mar 2026</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: '#FFEBEE', fontSize: '0.65rem', fontWeight: 700, color: '#C62828' }}>
              <AlertTriangle size={10} /> {criticalCount} Overloaded
            </span>
          )}
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: `${pri}12`, fontSize: '0.65rem', fontWeight: 700, color: pri }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: pri, display: 'inline-block' }} />
            {liveLoad} MW Live
          </span>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: surface, border: `1px solid ${border}`, fontSize: '0.68rem', color: textMuted, fontFamily: ff }}>
            <motion.span animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={refreshing ? { repeat: Infinity, duration: 0.8, ease: 'linear' } : {}}>
              <RefreshCw size={12} />
            </motion.span>
            Refresh
          </motion.button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left panel */}
        <div className="flex flex-col shrink-0 overflow-hidden" style={{ width: 300, borderRight: `1px solid ${border}` }}>
          {/* KPI chips */}
          <div className="grid grid-cols-2 gap-2 p-3 shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            {[
              { label: 'System Load', val: `${liveLoad} MW`, sub: 'Live SCADA',  color: pri,     Icon: Activity },
              { label: 'Today Peak',  val: '487 MW',         sub: 'at 15:00',    color: sec,     Icon: TrendingUp },
              { label: 'Load Factor', val: '79.4%',          sub: 'Daily avg',   color: '#4CAF50',Icon: Gauge },
              { label: 'System PF',   val: '0.874',          sub: 'Lagging',     color: '#7B1FA2',Icon: Radio },
            ].map(k => (
              <div key={k.label} className="rounded-xl p-2.5" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: `${k.color}18` }}>
                    <k.Icon size={10} style={{ color: k.color }} />
                  </div>
                  <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{k.label}</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: textMain, fontFamily: ff }}>{k.val}</div>
                <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 px-3 py-2 shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            {(['All', 'Critical', 'Overloaded', 'Active'] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className="flex-1 py-1 rounded-lg transition-all"
                style={{ fontSize: '0.625rem', fontWeight: 600, fontFamily: ff,
                  background: filterStatus === s ? pri : surface, color: filterStatus === s ? '#fff' : textMuted }}>
                {s}
              </button>
            ))}
          </div>

          {/* Feeder list */}
          <div className="flex-1 overflow-y-auto">
            {filteredFeeders.map(f => {
              const pct = (f.load / f.capacity) * 100;
              const cfg = STATUS_CFG[f.status];
              const isSel = f.id === selectedId;
              return (
                <motion.button key={f.id} onClick={() => setSelectedId(f.id)}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2.5"
                  style={{ background: isSel ? `${pri}10` : 'transparent',
                    borderBottom: `1px solid ${border}`, borderLeft: `3px solid ${isSel ? pri : 'transparent'}` }}
                  whileHover={{ background: surface }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${cfg.color}18` }}>
                    <GitBranch size={11} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: textMain, fontFamily: ff,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 3, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                        <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: cfg.color, borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, color: cfg.color, fontFamily: ff, flexShrink: 0 }}>{pct.toFixed(0)}%</span>
                    </div>
                    <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{f.zone} · {f.load}/{f.capacity} MW</div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ fontSize: '0.625rem', fontWeight: 700, background: `${cfg.color}15`, color: cfg.color }}>{cfg.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

          {/* 24h Load Curve */}
          <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                  <BarChart2 size={13} style={{ color: pri }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: textMain, fontFamily: ff }}>24-Hour Load Curve</div>
                  <div style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>Actual (00–15h) · Forecast (16–23h) · MW</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {[{ color: pri, label: 'Actual' }, { color: sec, dash: true, label: 'Forecast' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-6 h-0.5" style={{ background: l.color, borderTop: l.dash ? `2px dashed ${l.color}` : undefined }} />
                    <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{l.label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#EF5350' }} />
                  <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>Now: {liveLoad} MW</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <ComposedChart data={LOAD_CURVE} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="lc_actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={pri} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={pri} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridC} vertical={false} />
                <XAxis dataKey="h" tick={{ fontSize: 9, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} interval={2} />
                <YAxis tick={{ fontSize: 9, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} domain={[180, 700]} />
                <Tooltip content={<Tip />} />
                <ReferenceLine x="15" stroke="#EF5350" strokeWidth={1.5} strokeDasharray="4 2"
                  label={{ value: 'Now', fill: '#EF5350', fontSize: 9, fontFamily: ff, position: 'top' }} />
                <ReferenceLine y={550} stroke="#FF980050" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="actual" fill="url(#lc_actualGrad)" stroke={pri} strokeWidth={2} dot={false} name="Actual" connectNulls={false} />
                <Line type="monotone" dataKey="forecast" stroke={sec} strokeWidth={2} strokeDasharray="6 3" dot={false} name="Forecast" connectNulls />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Zone Load + Feeder Detail */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
                  <Zap size={13} style={{ color: sec }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Zone Load Distribution</span>
              </div>
              <div className="flex flex-col gap-3">
                {ZONES.map(z => {
                  const pct = (z.load / z.capacity) * 100;
                  const col = pct > 90 ? '#EF5350' : pct > 85 ? '#FF9800' : '#4CAF50';
                  return (
                    <div key={z.zone}>
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: textMain, fontFamily: ff }}>{z.zone}</span>
                        <div className="flex items-center gap-1.5">
                          <span style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>{z.load}/{z.capacity} MW</span>
                          <span className="px-1.5 py-0.5 rounded-full"
                            style={{ fontSize: '0.625rem', fontWeight: 700, background: `${col}18`, color: col }}>{pct.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="rounded-full overflow-hidden" style={{ height: 6, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{ height: '100%', background: col, borderRadius: 999 }} />
                      </div>
                      <div style={{ fontSize: '0.625rem', color: textMuted, marginTop: 2, fontFamily: ff }}>{z.consumers.toLocaleString('en-IN')} consumers</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feeder Detail */}
            <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${feederCfg.color}18` }}>
                  <GitBranch size={13} style={{ color: feederCfg.color }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Feeder Detail</span>
                <span className="ml-auto px-2 py-0.5 rounded-full"
                  style={{ fontSize: '0.625rem', fontWeight: 700, background: `${feederCfg.color}15`, color: feederCfg.color }}>{feederCfg.label}</span>
              </div>
              <div className="mb-3">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, fontFamily: ff }}>{feeder.name}</div>
                <div style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>{feeder.id} · {feeder.zone}</div>
              </div>
              <div className="rounded-xl p-3 mb-3" style={{ background: surface, border: `1px solid ${border}` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>Loading</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: feederCfg.color, fontFamily: ff }}>{feederPct.toFixed(1)}%</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 10, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                  <motion.div key={feeder.id} initial={{ width: 0 }} animate={{ width: `${Math.min(feederPct, 100)}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    style={{ height: '100%', background: feederCfg.color, borderRadius: 999 }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span style={{ fontSize: '0.625rem', color: textMuted }}>0 MW</span>
                  <span style={{ fontSize: '0.625rem', color: textMuted }}>{feeder.capacity} MW</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Active Load',  val: `${feeder.load} MW`,        col: feederCfg.color },
                  { label: 'Capacity',     val: `${feeder.capacity} MW`,    col: textMuted },
                  { label: 'Voltage',      val: `${feeder.voltage} kV`,     col: feeder.voltage < 10.8 ? '#FF9800' : '#4CAF50' },
                  { label: 'Power Factor', val: feeder.pf.toFixed(3),       col: feeder.pf < 0.85 ? '#FF9800' : '#4CAF50' },
                  { label: 'Reactive',     val: `${feeder.kvar} MVAR`,      col: textMuted },
                  { label: 'Headroom',     val: `${(feeder.capacity - feeder.load).toFixed(1)} MW`, col: '#4CAF50' },
                ].map(m => (
                  <div key={m.label} className="rounded-xl p-2" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: `1px solid ${border}` }}>
                    <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{m.label}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: m.col, fontFamily: ff }}>{m.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Voltage Profile */}
          <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                <Gauge size={13} style={{ color: pri }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Feeder Voltage Profile</span>
              <span className="ml-auto" style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>Nominal 11 kV · Tolerance ±6% (10.34–11.66 kV)</span>
            </div>
            <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
              {FEEDERS.map(f => {
                const dev = ((f.voltage - 11) / 11) * 100;
                const col = Math.abs(dev) > 4 ? '#EF5350' : Math.abs(dev) > 2 ? '#FF9800' : '#4CAF50';
                const isSel = f.id === selectedId;
                return (
                  <motion.button key={f.id} whileHover={{ scale: 1.04, y: -1 }} onClick={() => setSelectedId(f.id)}
                    className="rounded-xl p-2.5 text-left"
                    style={{ background: isSel ? `${pri}12` : surface, border: `1px solid ${isSel ? `${pri}40` : border}` }}>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted, fontFamily: ff }}>{f.id}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: col, fontFamily: ff }}>{f.voltage} kV</div>
                    <div style={{ fontSize: '0.625rem', color: col, fontFamily: ff }}>{dev >= 0 ? '+' : ''}{dev.toFixed(1)}%</div>
                  </motion.button>
                );
              })}
            </div>
          </div>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  );
}