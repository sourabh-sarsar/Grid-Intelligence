import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft, FileText, Download, Calendar, Clock, CheckCircle,
  IndianRupee, Activity, Users, Cpu, TrendingDown, Zap,
  RefreshCw, Send, Eye, Filter, Settings2, Mail,
  BarChart2, BookOpen, Shield, AlertTriangle, Play,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme, getSecondaryBg } from '../context/ThemeContext';

interface ReportType {
  id: string;
  title: string;
  desc: string;
  Icon: React.ElementType;
  color: string;
  sections: string[];
  formats: string[];
}

const REPORT_TYPES: ReportType[] = [
  {
    id: 'revenue', title: 'Revenue & Collections',
    desc: 'Billing, collections, outstanding dues, AT&C losses and category-wise revenue breakdown',
    Icon: IndianRupee, color: '#E65100',
    sections: ['Billing Summary', 'Collection Efficiency', 'Category Breakup', 'Zone Revenue', 'Top Defaulters', 'AT&C Loss'],
    formats: ['PDF', 'Excel', 'CSV'],
  },
  {
    id: 'load', title: 'Load Analysis',
    desc: 'Daily/monthly load curves, peak demand analysis, feeder-wise loading and power factor profile',
    Icon: Activity, color: '#1565C0',
    sections: ['Load Curve', 'Peak Demand', 'Zone Load', 'Feeder Loading', 'Power Factor', 'Voltage Profile'],
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'consumer', title: 'Consumer Insights',
    desc: 'Consumer statistics, category distribution, new connections, disconnections and complaints',
    Icon: Users, color: '#00838F',
    sections: ['Consumer Count', 'Category Distribution', 'New Connections', 'Disconnections', 'Complaints', 'Meter Status'],
    formats: ['PDF', 'Excel', 'CSV'],
  },
  {
    id: 'asset', title: 'Asset Inventory',
    desc: 'Grid asset register, maintenance history, fault history, age profile and replacement plan',
    Icon: Cpu, color: '#7B1FA2',
    sections: ['Asset Count', 'Type Breakup', 'Fault History', 'Maintenance Log', 'Age Profile', 'Replacement Plan'],
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'atc', title: 'AT&C Loss Report',
    desc: 'Aggregate Technical & Commercial loss analysis, energy audit, theft detection and loss reduction trends',
    Icon: TrendingDown, color: '#C62828',
    sections: ['Energy Input', 'Energy Billed', 'AT&C Loss', 'Zone Losses', 'Theft Detection', 'Loss Trend'],
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'energy', title: 'Energy Audit',
    desc: 'Complete energy balance — generation, transmission, distribution losses and unaccounted energy',
    Icon: Zap, color: '#2E7D32',
    sections: ['Energy Balance', 'Source Mix', 'T&D Losses', 'Unaccounted Energy', 'DT-wise Loss', 'Audit Summary'],
    formats: ['PDF', 'Excel', 'CSV'],
  },
];

const SCHEDULED_REPORTS = [
  { id: 'SCH-001', report: 'Daily Load Summary',    freq: 'Daily at 06:00',     next: '18 Mar 2026, 06:00', dest: 'Email + Portal', status: 'Active' },
  { id: 'SCH-002', report: 'Monthly Revenue',         freq: '1st of every month', next: '01 Apr 2026, 08:00', dest: 'Email',           status: 'Active' },
  { id: 'SCH-003', report: 'Weekly AT&C Loss',        freq: 'Every Monday',       next: '23 Mar 2026, 07:00', dest: 'Portal',          status: 'Active' },
  { id: 'SCH-004', report: 'Consumer MIS',            freq: 'Monthly (last day)', next: '31 Mar 2026, 23:00', dest: 'Email',           status: 'Active' },
  { id: 'SCH-005', report: 'Quarterly Energy Audit',  freq: 'Quarterly',          next: '01 Jul 2026',        dest: 'Email + Portal', status: 'Paused' },
];

const RECENT_DOWNLOADS = [
  { id: 'RPT-0091', title: 'Revenue Summary — Mar 2026',    type: 'revenue', format: 'PDF',   size: '2.4 MB', by: 'Eng. R. Sharma', ago: '2h ago',      Icon: IndianRupee, color: '#E65100' },
  { id: 'RPT-0090', title: 'Load Analysis — Feb 2026',      type: 'load',    format: 'Excel', size: '1.8 MB', by: 'Eng. A. Gupta',  ago: 'Yesterday',   Icon: Activity,    color: '#1565C0' },
  { id: 'RPT-0089', title: 'Consumer MIS — Q3 FY 25-26',    type: 'consumer',format: 'PDF',   size: '3.1 MB', by: 'Eng. P. Verma',  ago: '2 days ago',  Icon: Users,       color: '#00838F' },
  { id: 'RPT-0088', title: 'AT&C Loss — Feb 2026',          type: 'atc',     format: 'PDF',   size: '1.2 MB', by: 'Eng. R. Sharma', ago: '3 days ago',  Icon: TrendingDown,color: '#C62828' },
  { id: 'RPT-0087', title: 'Asset Inventory — Q3 FY 25-26', type: 'asset',   format: 'Excel', size: '4.7 MB', by: 'Eng. V. Singh',  ago: '5 days ago',  Icon: Cpu,         color: '#7B1FA2' },
  { id: 'RPT-0086', title: 'Energy Audit — Feb 2026',       type: 'energy',  format: 'PDF',   size: '2.9 MB', by: 'Eng. N. Saxena', ago: '7 days ago',  Icon: Zap,         color: '#2E7D32' },
];

const MONTHLY_REPORTS_CHART = [
  { month: 'Oct', count: 28 },
  { month: 'Nov', count: 32 },
  { month: 'Dec', count: 26 },
  { month: 'Jan', count: 35 },
  { month: 'Feb', count: 41 },
  { month: 'Mar', count: 18 },
];

type RangePreset = 'Today' | 'This Month' | 'Last Month' | 'This Quarter' | 'This FY' | 'Custom';

interface ReportsPageProps { onBack?: () => void; }

export function ReportsPage({ onBack }: ReportsPageProps) {
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

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [range, setRange] = useState<RangePreset>('This Month');
  const [format, setFormat] = useState<string[]>(['PDF']);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [email, setEmail] = useState('');
  const [sendEmail, setSendEmail] = useState(false);

  const reportType = REPORT_TYPES.find(r => r.id === selectedType);

  function handleSelectType(id: string) {
    const rt = REPORT_TYPES.find(r => r.id === id)!;
    setSelectedType(id);
    setSelectedSections(rt.sections);
    setFormat([rt.formats[0]]);
  }

  function handleGenerate() {
    if (!selectedType) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success('Report generated', {
        description: `${reportType?.title} (${range}) exported as ${format.join(' + ')}${sendEmail ? ' and sent via email' : ''}`,
      });
    }, 2000);
  }

  function toggleSection(s: string) {
    setSelectedSections(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  }

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: ttBg, border: `1px solid ${border}`, borderRadius: 10, padding: '8px 12px', fontFamily: ff }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: textMain }}>{label}</div>
        <div style={{ fontSize: '0.65rem', color: textMuted }}>Reports: <b style={{ color: pri }}>{payload[0].value}</b></div>
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
          <FileText size={16} style={{ color: pri }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>Reports & Data Exports</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>Generate, schedule and download DISCOM operational reports</p>
        </div>
        <span className="px-2.5 py-1 rounded-full" style={{ background: surface, fontSize: '0.65rem', color: textMuted }}>
          {RECENT_DOWNLOADS.length} recent · {SCHEDULED_REPORTS.filter(r => r.status === 'Active').length} scheduled
        </span>
      </div>

      {/* Body: two panels */}
      <div className="flex flex-1 min-h-0">

        {/* Left: Catalog + Form */}
        <div className="flex flex-col overflow-y-auto p-4 gap-4" style={{ width: '100%' }}>

          {/* Report type grid */}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, fontFamily: ff }}>Select Report Type</div>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_TYPES.map(rt => {
                const isSel = selectedType === rt.id;
                return (
                  <motion.button key={rt.id} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectType(rt.id)}
                    className="text-left rounded-2xl p-3"
                    style={{ background: isSel ? `${rt.color}12` : cardBg,
                      border: `1px solid ${isSel ? rt.color + '40' : border}` }}>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center mb-2"
                      style={{ background: `${rt.color}18` }}>
                      <rt.Icon size={14} style={{ color: rt.color }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isSel ? rt.color : textMain, fontFamily: ff }}>{rt.title}</div>
                    <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff, marginTop: 2, lineHeight: 1.4 }}>{rt.desc.substring(0, 60)}…</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Configuration form */}
          <AnimatePresence>
            {reportType && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${reportType.color}18` }}>
                    <reportType.Icon size={12} style={{ color: reportType.color }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Configure Report</span>
                </div>

                {/* Date range */}
                <div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, fontFamily: ff }}>Date Range</div>
                  <div className="flex flex-wrap gap-1">
                    {(['Today', 'This Month', 'Last Month', 'This Quarter', 'This FY'] as RangePreset[]).map(r => (
                      <button key={r} onClick={() => setRange(r)}
                        className="px-2.5 py-1 rounded-xl transition-all"
                        style={{ fontSize: '0.63rem', fontWeight: 600, fontFamily: ff,
                          background: range === r ? getSecondaryBg(settings) : surface,
                          color: range === r ? '#fff' : textMuted,
                          border: `1px solid ${range === r ? 'transparent' : border}` }}>{r}</button>
                    ))}
                  </div>
                </div>

                {/* Format */}
                <div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, fontFamily: ff }}>Format</div>
                  <div className="flex gap-1">
                    {reportType.formats.map(f => {
                      const isSel = format.includes(f);
                      return (
                        <button key={f}
                          onClick={() => setFormat(prev =>
                            prev.includes(f)
                              ? prev.length > 1 ? prev.filter(x => x !== f) : prev
                              : [...prev, f]
                          )}
                          className="px-3 py-1 rounded-xl transition-all flex items-center gap-1"
                          style={{ fontSize: '0.65rem', fontWeight: 600, fontFamily: ff,
                            background: isSel ? `${pri}15` : surface,
                            color: isSel ? pri : textMuted,
                            border: `1px solid ${isSel ? `${pri}30` : border}` }}>
                          {isSel && <CheckCircle size={9} />}
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sections */}
                <div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6, fontFamily: ff }}>Include Sections</div>
                  <div className="flex flex-wrap gap-1.5">
                    {reportType.sections.map(s => {
                      const isSel = selectedSections.includes(s);
                      return (
                        <button key={s} onClick={() => toggleSection(s)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all"
                          style={{ fontSize: '0.6rem', fontWeight: 600, fontFamily: ff,
                            background: isSel ? `${reportType.color}15` : surface,
                            color: isSel ? reportType.color : textMuted,
                            border: `1px solid ${isSel ? `${reportType.color}30` : border}` }}>
                          {isSel && <CheckCircle size={9} />}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email option */}
                <div className="flex items-center gap-2">
                  <button onClick={() => setSendEmail(p => !p)}
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: sendEmail ? pri : surface, border: `1px solid ${sendEmail ? pri : border}` }}>
                    {sendEmail && <CheckCircle size={11} style={{ color: '#fff' }} />}
                  </button>
                  <span style={{ fontSize: '0.65rem', color: textMuted, fontFamily: ff }}>Also send via email</span>
                  {sendEmail && (
                    <input value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="recipient@discom.in"
                      className="flex-1 bg-transparent outline-none"
                      style={{ fontSize: '0.65rem', color: textMain, fontFamily: ff,
                        borderBottom: `1px solid ${border}`, paddingBottom: 2 }} />
                  )}
                </div>

                {/* Generate button */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  disabled={generating || selectedSections.length === 0 || format.length === 0}
                  onClick={handleGenerate}
                  className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
                  style={{ background: generating ? `${sec}60` : getSecondaryBg(settings),
                    color: '#fff', fontSize: '0.75rem', fontWeight: 700, fontFamily: ff,
                    opacity: selectedSections.length === 0 ? 0.5 : 1 }}>
                  {generating
                    ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} style={{ display: 'flex' }}><RefreshCw size={14} /></motion.span> Generating…</>
                    : <><Play size={14} /> Generate Report</>
                  }
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Bottom row: Scheduled + Recent ── */}
          <div className="grid grid-cols-2 gap-4">

            {/* Scheduled Reports */}
            <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
                  <Calendar size={13} style={{ color: sec }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Scheduled Reports</span>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => toast.info('Schedule manager', { description: 'Report scheduler will open in a future release.' })}
                  className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
                  style={{ background: surface, border: `1px solid ${border}`, fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>
                  <Settings2 size={11} /> Manage
                </motion.button>
              </div>
              <div className="flex flex-col gap-1.5">
                {SCHEDULED_REPORTS.map((s, idx) => (
                  <motion.div key={s.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{ background: surface, border: `1px solid ${border}` }}>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}15` }}>
                      <Clock size={12} style={{ color: pri }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: textMain, fontFamily: ff }}>{s.report}</div>
                      <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{s.freq} · Next: {s.next}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{s.dest}</span>
                      <span className="px-1.5 py-0.5 rounded-full"
                        style={{ fontSize: '0.625rem', fontWeight: 700,
                          background: s.status === 'Active' ? '#4CAF5015' : '#78909c15',
                          color: s.status === 'Active' ? '#4CAF50' : '#78909c', fontFamily: ff }}>
                        {s.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recently Generated */}
            <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                  <Download size={13} style={{ color: pri }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Recently Generated</span>
              </div>

              {/* Table header */}
              <div className="flex items-center gap-2 px-2 pb-1.5" style={{ borderBottom: `1px solid ${border}` }}>
                {['Report', 'Type', 'Size', 'By', 'When', ''].map((h, i) => (
                  <span key={i} style={{
                    fontSize: '0.625rem', fontWeight: 700, color: textMuted, fontFamily: ff,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    flex: i === 0 ? 3 : i === 5 ? '0 0 52px' : 1,
                  }}>{h}</span>
                ))}
              </div>

              <div className="flex flex-col">
                {RECENT_DOWNLOADS.map((r, idx) => (
                  <motion.div key={r.id}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                    className="flex items-center gap-2 px-2 py-2 rounded-xl"
                    style={{ borderBottom: idx < RECENT_DOWNLOADS.length - 1 ? `1px solid ${border}` : 'none' }}
                    whileHover={{ background: surface }}>
                    <div className="flex items-center gap-2" style={{ flex: 3, minWidth: 0 }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${r.color}15` }}>
                        <r.Icon size={11} style={{ color: r.color }} />
                      </div>
                      <span style={{ fontSize: '0.67rem', fontWeight: 600, color: textMain, fontFamily: ff,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-full" style={{ flex: 1,
                      fontSize: '0.625rem', fontWeight: 700, background: `${r.color}12`, color: r.color, fontFamily: ff }}>
                      {r.format}
                    </span>
                    <span style={{ flex: 1, fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>{r.size}</span>
                    <span style={{ flex: 1, fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{r.by.replace('Eng. ', '')}</span>
                    <span style={{ flex: 1, fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{r.ago}</span>
                    <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                      onClick={() => toast.success('Downloading', { description: `${r.title} re-downloaded` })}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg shrink-0"
                      style={{ flex: '0 0 52px', background: `${pri}12`, border: `1px solid ${pri}25`,
                        color: pri, fontSize: '0.625rem', fontWeight: 700, fontFamily: ff }}>
                      <Download size={9} /> Get
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
          {/* spacer */}
          <div style={{ height: 8 }} />

        </div>

      </div>
    </div>
  );
}