import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  ArrowLeft, Zap, AlertTriangle, Shield, Activity, TrendingUp,
  BarChart2, FlaskConical, Play, RefreshCw, Download, CheckCircle,
  Clock, Calendar, ChevronRight, FileText, Settings2, Eye,
  Flame, Cpu,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';

type StudyStatus = 'Completed' | 'Running' | 'Scheduled' | 'In Review' | 'Failed';

interface Study {
  id: string;
  title: string;
  type: string;
  status: StudyStatus;
  date: string;
  duration: string;
  analyst: string;
  violations: number;
  progress?: number;
  desc: string;
  Icon: React.ElementType;
  color: string;
}

const STUDIES: Study[] = [
  {
    id: 'S-001', title: 'Power Flow Analysis', type: 'Load Flow', status: 'Completed',
    date: '12 Mar 2026', duration: '4 min 32s', analyst: 'Eng. R. Sharma', violations: 0, progress: 100,
    desc: 'Full network power flow study covering all 33/11 kV buses. All voltages within ±5% tolerance. Total losses 14.2 MW (2.9%).',
    Icon: Zap, color: '#1565C0',
  },
  {
    id: 'S-002', title: 'Short Circuit Analysis', type: 'Fault Study', status: 'Running',
    date: '17 Mar 2026', duration: '~8 min', analyst: 'Eng. P. Verma', violations: 0, progress: 67,
    desc: 'Three-phase and single-line-to-ground fault current analysis for all 33 kV buses. Checking breaker interrupt ratings.',
    Icon: AlertTriangle, color: '#EF5350',
  },
  {
    id: 'S-003', title: 'N-1 Contingency Study', type: 'Contingency', status: 'Completed',
    date: '10 Mar 2026', duration: '12 min 08s', analyst: 'Eng. A. Gupta', violations: 2, progress: 100,
    desc: 'Single contingency analysis for all critical feeders and transformers. 2 overload violations found in Zone E post-contingency.',
    Icon: Shield, color: '#FF9800',
  },
  {
    id: 'S-004', title: 'Harmonic Distortion Study', type: 'Power Quality', status: 'Scheduled',
    date: '20 Mar 2026', duration: '—', analyst: 'Eng. S. Mishra', violations: 0,
    desc: 'Total harmonic distortion (THD) analysis for all 11 kV buses. IEEE 519 compliance check. APFC units and VFD loads included.',
    Icon: Activity, color: '#7B1FA2',
  },
  {
    id: 'S-005', title: 'Voltage Stability Analysis', type: 'Stability', status: 'Completed',
    date: '05 Mar 2026', duration: '6 min 15s', analyst: 'Eng. R. Sharma', violations: 0, progress: 100,
    desc: 'PV and QV curve analysis for all load buses. Voltage stability margin of 28% confirmed. Zone D most sensitive.',
    Icon: TrendingUp, color: '#00838F',
  },
  {
    id: 'S-006', title: 'Load Forecast Model Run', type: 'Forecasting', status: 'Completed',
    date: '01 Mar 2026', duration: '2 min 44s', analyst: 'Eng. N. Saxena', violations: 0, progress: 100,
    desc: 'LSTM model re-trained with 365-day historical data. Achieved 97.9% accuracy. Seasonal adjustments applied for summer.',
    Icon: BarChart2, color: '#2E7D32',
  },
  {
    id: 'S-007', title: 'Arc Flash Hazard Study', type: 'Safety', status: 'In Review',
    date: '14 Mar 2026', duration: '9 min 21s', analyst: 'Eng. V. Singh', violations: 4, progress: 100,
    desc: 'IEEE 1584-2018 arc flash energy calculations for all MV switchgear. 4 panels require PPE category upgrade. Report under review.',
    Icon: Flame, color: '#D84315',
  },
];

const STATUS_CFG: Record<StudyStatus, { color: string; bg: string }> = {
  Completed:  { color: '#4CAF50', bg: '#4CAF5015' },
  Running:    { color: '#1565C0', bg: '#1565C015' },
  Scheduled:  { color: '#78909c', bg: '#78909c15' },
  'In Review':{ color: '#FF9800', bg: '#FF980015' },
  Failed:     { color: '#EF5350', bg: '#EF535015' },
};

// Power flow result data
const BUS_VOLTAGES = [
  { bus: 'Bus-01 (220kV)', pu: 1.022, kv: 224.84, status: 'Normal' },
  { bus: 'Bus-02 (33kV)',  pu: 0.984, kv: 32.47,  status: 'Normal' },
  { bus: 'Bus-03 (11kV)',  pu: 0.976, kv: 10.74,  status: 'Normal' },
  { bus: 'Bus-04 (11kV)',  pu: 0.963, kv: 10.59,  status: 'Warning' },
  { bus: 'Bus-05 (11kV)',  pu: 0.981, kv: 10.79,  status: 'Normal' },
  { bus: 'Bus-06 (33kV)',  pu: 0.991, kv: 32.70,  status: 'Normal' },
];

const BRANCH_LOADING = [
  { branch: 'F-006 Surajpur',     loading: 98.4, limit: 100 },
  { branch: 'F-003 Knowledge Pk', loading: 95.0, limit: 100 },
  { branch: 'F-012 Expressway',   loading: 86.4, limit: 100 },
  { branch: 'F-004 Sector 62',    loading: 88.2, limit: 100 },
  { branch: 'SS-012 Tx-A',        loading: 82.6, limit: 100 },
  { branch: 'F-001 Sector 18',    loading: 84.0, limit: 100 },
];

const STABILITY_RADAR = [
  { axis: 'Voltage Margin',   val: 88 },
  { axis: 'Frequency Margin', val: 92 },
  { axis: 'Transient Stab.',  val: 78 },
  { axis: 'Small-Signal',     val: 84 },
  { axis: 'N-1 Resilience',   val: 74 },
  { axis: 'Load Margin',      val: 81 },
];

interface StudiesPageProps { onBack?: () => void; }

export function StudiesPage({ onBack }: StudiesPageProps) {
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

  const [selectedId, setSelectedId] = useState('S-001');
  const [running, setRunning] = useState<string | null>(null);

  const study = STUDIES.find(s => s.id === selectedId) ?? STUDIES[0];
  const statusCfg = STATUS_CFG[study.status];

  function handleRunStudy(s: Study) {
    if (s.status === 'Running') return;
    setRunning(s.id);
    setTimeout(() => {
      setRunning(null);
      toast.success(`${s.title} started`, { description: 'Study queued for execution. Results in ~5 minutes.' });
    }, 1800);
  }

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: ttBg, border: `1px solid ${border}`, borderRadius: 10, padding: '8px 12px', fontFamily: ff }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: textMain, marginBottom: 4 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ fontSize: '0.65rem', color: textMuted }}>{p.name}: <b style={{ color: textMain }}>{p.value}%</b></div>
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
          <FlaskConical size={16} style={{ color: pri }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>Studies & Simulations</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>Power system analysis, load flow & engineering simulations</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: '#1565C015', fontSize: '0.65rem', fontWeight: 700, color: '#1565C0' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#1565C0', display: 'inline-block' }} />
            1 Running
          </span>
          <span className="px-2.5 py-1 rounded-full" style={{ background: surface, fontSize: '0.65rem', color: textMuted }}>
            {STUDIES.length} total studies
          </span>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left: Study list */}
        <div className="flex flex-col shrink-0 overflow-hidden" style={{ width: 300, borderRight: `1px solid ${border}` }}>
          <div className="flex flex-col gap-1 p-2 overflow-y-auto flex-1">
            {STUDIES.map((s, idx) => {
              const cfg = STATUS_CFG[s.status];
              const isSel = s.id === selectedId;
              return (
                <motion.button key={s.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedId(s.id)}
                  className="w-full text-left rounded-2xl p-3"
                  style={{ background: isSel ? `${pri}10` : 'transparent', border: `1px solid ${isSel ? `${pri}30` : 'transparent'}` }}
                  whileHover={{ background: surface }}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}18` }}>
                      <s.Icon size={14} style={{ color: s.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMain, fontFamily: ff }}>{s.title}</div>
                      <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{s.type} · {s.date}</div>
                      {s.status === 'Running' && (
                        <div className="mt-1.5">
                          <div className="flex items-center justify-between mb-0.5">
                            <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>Progress</span>
                            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: pri, fontFamily: ff }}>{s.progress}%</span>
                          </div>
                          <div className="rounded-full overflow-hidden" style={{ height: 3, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${s.progress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                              style={{ height: '100%', background: pri, borderRadius: 999 }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="px-1.5 py-0.5 rounded-full"
                        style={{ fontSize: '0.625rem', fontWeight: 700, background: cfg.bg, color: cfg.color, fontFamily: ff }}>{s.status}</span>
                      {s.violations > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: '0.625rem', fontWeight: 700, background: '#EF535015', color: '#EF5350', fontFamily: ff }}>
                          {s.violations} ⚠
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
          {/* New study button */}
          <div className="p-3 shrink-0" style={{ borderTop: `1px solid ${border}` }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => toast.info('New study', { description: 'Study wizard will open in a future release.' })}
              className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
              style={{ background: `${pri}15`, border: `1px solid ${pri}30`, color: pri, fontSize: '0.72rem', fontWeight: 700, fontFamily: ff }}>
              <Play size={13} /> New Simulation
            </motion.button>
          </div>
        </div>

        {/* Right: Study detail */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div key={study.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">

              {/* Study header card */}
              <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${study.color}18` }}>
                    <study.Icon size={22} style={{ color: study.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: textMain, fontFamily: ff }}>{study.title}</h3>
                      <span className="px-2 py-0.5 rounded-full"
                        style={{ fontSize: '0.625rem', fontWeight: 700, background: statusCfg.bg, color: statusCfg.color, fontFamily: ff }}>{study.status}</span>
                      {study.violations > 0 && (
                        <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '0.625rem', fontWeight: 700, background: '#EF535015', color: '#EF5350', fontFamily: ff }}>
                          {study.violations} violations found
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.72rem', color: textMuted, fontFamily: ff, marginTop: 4, lineHeight: 1.6 }}>{study.desc}</p>
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      {[
                        { Icon: Calendar, label: study.date },
                        { Icon: Clock,    label: study.duration },
                        { Icon: Cpu,      label: study.analyst },
                        { Icon: FileText, label: study.type },
                      ].map(m => (
                        <div key={m.label} className="flex items-center gap-1.5">
                          <m.Icon size={12} style={{ color: textMuted }} />
                          <span style={{ fontSize: '0.65rem', color: textMuted, fontFamily: ff }}>{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {study.status === 'Completed' && (
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => toast.success('Report downloaded', { description: `${study.title} PDF report saved` })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                        style={{ background: surface, border: `1px solid ${border}`, color: textMuted, fontSize: '0.68rem', fontWeight: 600, fontFamily: ff }}>
                        <Download size={12} /> Report
                      </motion.button>
                    )}
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      disabled={running === study.id || study.status === 'Running'}
                      onClick={() => handleRunStudy(study)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                      style={{ background: `${pri}15`, border: `1px solid ${pri}30`, color: pri, fontSize: '0.68rem', fontWeight: 700, fontFamily: ff,
                        opacity: study.status === 'Running' ? 0.6 : 1 }}>
                      {running === study.id
                        ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} style={{ display: 'flex' }}><RefreshCw size={12} /></motion.span>
                        : <Play size={12} />
                      }
                      {study.status === 'Running' ? 'Running…' : 'Re-run'}
                    </motion.button>
                  </div>
                </div>

                {/* Running progress bar */}
                {study.status === 'Running' && (
                  <div className="mt-3 rounded-xl p-3" style={{ background: `${pri}08`, border: `1px solid ${pri}20` }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ fontSize: '0.65rem', color: textMuted, fontFamily: ff }}>Solving power flow equations…</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: pri, fontFamily: ff }}>{study.progress}%</span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 6, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${study.progress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', background: pri, borderRadius: 999 }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Results — show for completed studies */}
              {study.status === 'Completed' && study.id === 'S-001' && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Bus voltages */}
                  <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                        <Zap size={13} style={{ color: pri }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Bus Voltage Profile</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {BUS_VOLTAGES.map(b => {
                        const col = b.status === 'Warning' ? '#FF9800' : '#4CAF50';
                        const pct = (b.pu / 1.1) * 100;
                        return (
                          <div key={b.bus}>
                            <div className="flex items-center justify-between mb-0.5">
                              <span style={{ fontSize: '0.65rem', color: textMain, fontFamily: ff }}>{b.bus}</span>
                              <div className="flex items-center gap-2">
                                <span style={{ fontSize: '0.65rem', color: textMuted, fontFamily: ff }}>{b.kv} kV</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: col, fontFamily: ff }}>{b.pu.toFixed(3)} pu</span>
                              </div>
                            </div>
                            <div className="rounded-full overflow-hidden" style={{ height: 4, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: col, borderRadius: 999 }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-2.5" style={{ borderTop: `1px solid ${border}` }}>
                      <CheckCircle size={12} style={{ color: '#4CAF50' }} />
                      <span style={{ fontSize: '0.63rem', color: '#4CAF50', fontFamily: ff }}>All buses within ±5% tolerance</span>
                    </div>
                  </div>

                  {/* Branch loading */}
                  <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
                        <BarChart2 size={13} style={{ color: sec }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Branch Loading (%)</span>
                    </div>
                    <ResponsiveContainer width="100%" height={170}>
                      <BarChart data={BRANCH_LOADING} layout="vertical" margin={{ top: 0, right: 24, left: 4, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridC} horizontal={false} />
                        <XAxis type="number" domain={[0, 110]} tick={{ fontSize: 8, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="branch" tick={{ fontSize: 8, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} width={90} />
                        <Tooltip content={<Tip />} />
                        <Bar dataKey="loading" name="Loading %" radius={[0, 4, 4, 0]} maxBarSize={12}
                          fill={sec}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Stability radar for S-005 */}
              {study.status === 'Completed' && study.id === 'S-005' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#00838F18' }}>
                        <TrendingUp size={13} style={{ color: '#00838F' }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Stability Indices</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={STABILITY_RADAR} cx="50%" cy="50%" outerRadius={70}>
                        <PolarGrid stroke={gridC} />
                        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9, fill: textMuted, fontFamily: ff }} />
                        <Radar name="Index" dataKey="val" stroke="#00838F" fill="#00838F" fillOpacity={0.2} />
                        <Tooltip content={<Tip />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: cardBg, border: `1px solid ${border}` }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff, marginBottom: 4 }}>Key Findings</div>
                    {[
                      { txt: 'System stable under N-1 conditions',           ok: true },
                      { txt: 'Voltage margin: 28% above collapse point',     ok: true },
                      { txt: 'Zone D most voltage-sensitive bus cluster',    ok: null },
                      { txt: 'Reactive power reserve adequate',               ok: true },
                      { txt: 'Recommend capacitor bank at Bus-04 (11 kV)',   ok: null },
                    ].map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span style={{ marginTop: 1 }}>
                          {f.ok === true
                            ? <CheckCircle size={12} style={{ color: '#4CAF50' }} />
                            : <ChevronRight size={12} style={{ color: '#FF9800' }} />}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: textMuted, fontFamily: ff }}>{f.txt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generic summary for other completed studies */}
              {study.status === 'Completed' && study.id !== 'S-001' && study.id !== 'S-005' && (
                <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff, marginBottom: 12 }}>Study Summary</div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Cases Solved',  val: study.id === 'S-003' ? '47' : study.id === 'S-006' ? '365' : '12', col: pri },
                      { label: 'Violations',    val: study.violations.toString(), col: study.violations > 0 ? '#EF5350' : '#4CAF50' },
                      { label: 'Convergence',   val: '100%', col: '#4CAF50' },
                    ].map(m => (
                      <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: surface, border: `1px solid ${border}` }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: m.col, fontFamily: ff }}>{m.val}</div>
                        <div style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={13} style={{ color: '#4CAF50' }} />
                    <span style={{ fontSize: '0.7rem', color: '#4CAF50', fontFamily: ff }}>Study completed successfully. Full report available for download.</span>
                  </div>
                </div>
              )}

              {/* Scheduled placeholder */}
              {study.status === 'Scheduled' && (
                <div className="rounded-2xl p-6 flex flex-col items-center gap-3" style={{ background: cardBg, border: `1px dashed ${border}` }}>
                  <Calendar size={36} style={{ color: textMuted, opacity: 0.4 }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Scheduled: {study.date}</div>
                  <div style={{ fontSize: '0.7rem', color: textMuted, fontFamily: ff }}>This study is queued for future execution.</div>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleRunStudy(study)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl"
                    style={{ background: `${pri}15`, border: `1px solid ${pri}30`, color: pri, fontSize: '0.72rem', fontWeight: 700, fontFamily: ff }}>
                    <Play size={13} /> Run Now
                  </motion.button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  );
}