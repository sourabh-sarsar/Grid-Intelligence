import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ComposedChart, Bar, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft, IndianRupee, TrendingUp, TrendingDown, AlertTriangle,
  Download, BarChart3, Building2, Home, Sprout, Factory,
  Wallet, CreditCard, Smartphone, Banknote, FileText,
  ChevronRight, RefreshCw, Zap, Send, CheckCircle, Clock,
  Activity, ArrowUpRight, Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme, getDensitySpacing, secondarySolid, getSecondaryBg } from '../context/ThemeContext';

// ── Types ─────────────────────────────────────────────────────────────────────
type Period = 'Monthly' | 'Quarterly' | 'Annual';

// ── Dataset ───────────────────────────────────────────────────────────────────
const MONTHLY_DATA = [
  { label: 'Apr', billed: 68.4, collected: 64.2, efficiency: 93.9 },
  { label: 'May', billed: 72.1, collected: 68.8, efficiency: 95.4 },
  { label: 'Jun', billed: 78.6, collected: 73.9, efficiency: 94.0 },
  { label: 'Jul', billed: 84.2, collected: 79.6, efficiency: 94.5 },
  { label: 'Aug', billed: 82.7, collected: 77.8, efficiency: 94.1 },
  { label: 'Sep', billed: 76.4, collected: 72.1, efficiency: 94.4 },
  { label: 'Oct', billed: 69.8, collected: 66.3, efficiency: 95.0 },
  { label: 'Nov', billed: 65.2, collected: 62.7, efficiency: 96.2 },
  { label: 'Dec', billed: 71.6, collected: 68.4, efficiency: 95.5 },
  { label: 'Jan', billed: 74.8, collected: 70.5, efficiency: 94.3 },
  { label: 'Feb', billed: 71.2, collected: 68.1, efficiency: 95.6 },
  { label: 'Mar*', billed: 38.4, collected: 21.0, efficiency: 54.7 },
];

const QUARTERLY_DATA = [
  { label: 'Q1 Apr–Jun', billed: 219.1, collected: 206.9, efficiency: 94.4 },
  { label: 'Q2 Jul–Sep', billed: 243.3, collected: 229.5, efficiency: 94.3 },
  { label: 'Q3 Oct–Dec', billed: 206.6, collected: 197.4, efficiency: 95.6 },
  { label: 'Q4 Jan–Mar*', billed: 184.4, collected: 159.6, efficiency: 86.5 },
];

const ANNUAL_DATA = [
  { label: 'FY 21–22', billed: 682.4, collected: 629.8, efficiency: 92.3 },
  { label: 'FY 22–23', billed: 731.6, collected: 682.4, efficiency: 93.3 },
  { label: 'FY 23–24', billed: 784.2, collected: 738.8, efficiency: 94.2 },
  { label: 'FY 24–25', billed: 828.6, collected: 782.4, efficiency: 94.4 },
  { label: 'FY 25–26*', billed: 853.4, collected: 793.4, efficiency: 93.0 },
];

const CATEGORY_DATA = [
  { name: 'Residential', value: 358.4, units: 524.8, consumers: 122400, color: '#1565C0', pct: 42.3, Icon: Home },
  { name: 'Commercial',  value: 237.6, units: 312.4, consumers:   9800, color: '#E65100', pct: 28.0, Icon: Building2 },
  { name: 'Industrial',  value: 189.8, units: 278.6, consumers:   2400, color: '#6A1B9A', pct: 22.4, Icon: Factory },
  { name: 'Agricultural',value:  61.5, units: 410.2, consumers:   1400, color: '#2E7D32', pct:  7.3, Icon: Sprout },
];

const ZONE_DATA = [
  { zone: 'Zone B', revenue: 218.6, target: 225.0, consumers: 42800 },
  { zone: 'Zone A', revenue: 192.4, target: 190.0, consumers: 38600 },
  { zone: 'Zone D', revenue: 187.3, target: 185.0, consumers: 31400 },
  { zone: 'Zone C', revenue: 156.8, target: 160.0, consumers: 27200 },
  { zone: 'Zone E', revenue:  92.2, target: 100.0, consumers: 16000 },
];

const AGING_DATA = [
  { label: '0–30 days',  amount: 28.4, pct: 56.7, color: '#4CAF50' },
  { label: '31–60 days', amount: 12.8, pct: 25.5, color: '#FF9800' },
  { label: '61–90 days', amount:  5.6, pct: 11.2, color: '#FF5722' },
  { label: '>90 days',   amount:  3.3, pct:  6.6, color: '#B71C1C' },
];

const RECENT_TXNS = [
  { id: 'TXN-9841', name: 'Rajesh Kumar',         no: 'NDA-RES-001204', amount: 2840,  mode: 'UPI',    cat: 'Residential',  time: '5 min ago',  ok: true  },
  { id: 'TXN-9840', name: 'Sharma Industries',    no: 'GNA-IND-007003', amount: 48620, mode: 'NEFT',   cat: 'Industrial',   time: '12 min ago', ok: true  },
  { id: 'TXN-9839', name: 'Green Apartments',     no: 'NDA-COM-004512', amount: 12480, mode: 'App',    cat: 'Commercial',   time: '18 min ago', ok: true  },
  { id: 'TXN-9838', name: 'Patel Commercial',     no: 'NDA-COM-003312', amount: 8940,  mode: 'Cash',   cat: 'Commercial',   time: '31 min ago', ok: true  },
  { id: 'TXN-9837', name: 'Ananya Residency',     no: 'NDA-RES-009801', amount: 1640,  mode: 'UPI',    cat: 'Residential',  time: '44 min ago', ok: true  },
  { id: 'TXN-9836', name: 'Sunrise Mall',         no: 'NDA-COM-005218', amount: 31720, mode: 'Cheque', cat: 'Commercial',   time: '1h ago',     ok: false },
  { id: 'TXN-9835', name: 'Ramesh Gupta',         no: 'NDA-RES-002201', amount: 3220,  mode: 'Online', cat: 'Residential',  time: '1.5h ago',   ok: true  },
  { id: 'TXN-9834', name: 'Agro Farm Co-op',      no: 'NDA-AGR-000312', amount: 5840,  mode: 'RTGS',   cat: 'Agricultural', time: '2h ago',     ok: true  },
  { id: 'TXN-9833', name: 'City Lights Hotel',    no: 'NDA-COM-008812', amount: 22340, mode: 'NEFT',   cat: 'Commercial',   time: '2.5h ago',   ok: true  },
  { id: 'TXN-9832', name: 'Suresh Yadav',         no: 'NDA-RES-014822', amount: 890,   mode: 'UPI',    cat: 'Residential',  time: '3h ago',     ok: true  },
];

const TOP_DEFAULTERS = [
  { id: 1, name: 'Noida Steel Corp Ltd',    no: 'GNA-IND-001204', cat: 'Industrial',   dues: 4.82, days: 127, zone: 'Zone E' },
  { id: 2, name: 'Spectrum Textiles',        no: 'NDA-IND-003401', cat: 'Industrial',   dues: 3.14, days: 89,  zone: 'Zone B' },
  { id: 3, name: 'Green Valley Resort',      no: 'NDA-COM-007812', cat: 'Commercial',   dues: 2.67, days: 95,  zone: 'Zone C' },
  { id: 4, name: 'Metro Commercial Hub',     no: 'NDA-COM-002294', cat: 'Commercial',   dues: 1.93, days: 63,  zone: 'Zone A' },
  { id: 5, name: 'Sunrise Industrial Park',  no: 'GNA-IND-005601', cat: 'Industrial',   dues: 1.72, days: 71,  zone: 'Zone D' },
  { id: 6, name: 'Fortune Mall & Complex',   no: 'NDA-COM-008841', cat: 'Commercial',   dues: 1.45, days: 55,  zone: 'Zone B' },
  { id: 7, name: 'Eastern Cold Storage',     no: 'NDA-COM-006724', cat: 'Commercial',   dues: 1.12, days: 42,  zone: 'Zone A' },
  { id: 8, name: 'Horizon Hotels Pvt Ltd',   no: 'NDA-COM-009901', cat: 'Commercial',   dues: 0.98, days: 38,  zone: 'Zone C' },
];

const TARIFF_SLABS = [
  { cat: 'LT-1 Domestic',    type: 'Residential',  color: '#1565C0', slabs: ['0–100 u: ₹3.50/u', '101–200 u: ₹5.00/u', '201–400 u: ₹6.50/u', '>400 u: ₹7.20/u'], fixed: '₹35/month' },
  { cat: 'LT-2 Non-Domestic',type: 'Commercial',   color: '#E65100', slabs: ['All units: ₹7.50/u'],                                                               fixed: '₹125/month' },
  { cat: 'LT-3 Agricultural', type: 'Agricultural', color: '#2E7D32', slabs: ['All units: ₹1.50/u'],                                                               fixed: 'Nil' },
  { cat: 'HT-Industrial',    type: 'Industrial',   color: '#6A1B9A', slabs: ['All units: ₹6.80/u', 'Demand: ₹350/kVA'],                                           fixed: '₹500/month' },
];

const MODE_ICON: Record<string, React.ElementType> = {
  UPI: Smartphone, NEFT: Zap, App: Smartphone, Cash: Banknote,
  Online: CreditCard, Cheque: FileText, RTGS: Zap,
};

const CAT_COLOR: Record<string, string> = {
  Residential: '#1565C0', Commercial: '#E65100', Industrial: '#6A1B9A', Agricultural: '#2E7D32',
};

// ── Component ─────────────────────────────────────────────────────────────────
interface RevenuePageProps { onBack?: () => void; }

export function RevenuePage({ onBack }: RevenuePageProps) {
  const { settings } = useTheme();
  const ds  = getDensitySpacing(settings.density);
  const ff  = `var(--md-font-family, ${settings.fontFamily})`;
  const isDark   = settings.darkMode;
  const pageBg   = isDark ? '#111111' : '#f0f4fc';
  const cardBg   = isDark ? '#1e1e1e' : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted= isDark ? '#78909c' : '#546e7a';
  const surface  = isDark ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08`;
  const gridC    = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const ttBg     = isDark ? '#252525' : '#fff';
  const sec      = settings.secondaryColor;
  const pri      = settings.primaryColor;

  const [period, setPeriod] = useState<Period>('Monthly');
  const [sending, setSending] = useState<number | null>(null);
  const [activeCatIdx, setActiveCatIdx] = useState<number | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const chartData = period === 'Monthly' ? MONTHLY_DATA : period === 'Quarterly' ? QUARTERLY_DATA : ANNUAL_DATA;

  // Derived KPI totals
  const totalBilled    = useMemo(() => chartData.reduce((s, d) => s + d.billed,    0), [chartData]);
  const totalCollected = useMemo(() => chartData.reduce((s, d) => s + d.collected, 0), [chartData]);
  const efficiency     = useMemo(() => (totalCollected / totalBilled) * 100, [totalBilled, totalCollected]);
  const outstanding    = useMemo(() => totalBilled - totalCollected, [totalBilled, totalCollected]);
  const atcLoss        = 8.7;
  const realization    = 6.82;

  function handleSendNotice(d: typeof TOP_DEFAULTERS[0]) {
    setSending(d.id);
    setTimeout(() => {
      setSending(null);
      toast.success('Demand notice sent', {
        description: `₹${d.dues.toFixed(2)} Cr notice dispatched to ${d.name}`,
      });
    }, 1400);
  }

  // ── Donut label renderer ───────────────────────────────────────────────────
  const renderDonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const d = CATEGORY_DATA[index];
    if (d.pct < 8) return null;
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fontWeight: 700, fontFamily: ff }}>
        {d.pct}%
      </text>
    );
  };

  // ── Chart tooltip ──────────────────────────────────────────────────────────
  const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: ttBg, border: `1px solid ${border}`, borderRadius: 12, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontFamily: ff }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMain, marginBottom: 6 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2" style={{ fontSize: '0.68rem', color: textMuted, marginBottom: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.fill || p.stroke, display: 'inline-block' }} />
            <span>{p.name}:</span>
            <span style={{ fontWeight: 700, color: textMain }}>
              {p.name === 'Efficiency' ? `${p.value.toFixed(1)}%` : `₹${p.value.toFixed(1)} Cr`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // ── KPI Card ───────────────────────────────────────────────────────────────
  function KpiCard({ icon: Icon, label, value, sub, color, trend, warn }: {
    icon: React.ElementType; label: string; value: string; sub: string;
    color: string; trend?: 'up' | 'down'; warn?: boolean;
  }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 rounded-2xl p-3.5"
        style={{ background: cardBg, border: `1px solid ${border}` }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
          <Icon size={17} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
          <div className="flex items-end gap-1.5 mt-0.5 flex-wrap">
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: warn ? '#EF5350' : textMain, fontFamily: ff, lineHeight: 1.1 }}>{value}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {trend === 'up' && <ArrowUpRight size={11} style={{ color: '#4CAF50' }} />}
            {trend === 'down' && <TrendingDown size={11} style={{ color: warn ? '#EF5350' : '#4CAF50' }} />}
            {warn && !trend && <AlertTriangle size={10} style={{ color: '#FF9800' }} />}
            <span style={{ fontSize: '0.63rem', color: warn ? '#FF9800' : textMuted, fontFamily: ff }}>{sub}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}
      >
        {onBack && (
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={onBack}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: surface, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(21,101,192,0.15)'}` }}
          >
            <ArrowLeft size={15} style={{ color: pri }} />
          </motion.button>
        )}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
          <IndianRupee size={16} style={{ color: sec }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>Revenue Analytics</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>Billing, collections & financial insights · FY 2025–26</p>
        </div>

        {/* Period filter */}
        <div className="flex items-center gap-1 shrink-0">
          {(['Monthly', 'Quarterly', 'Annual'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-2.5 py-1 rounded-xl transition-all"
              style={{
                fontSize: '0.68rem', fontWeight: 600, fontFamily: ff,
                background: period === p ? getSecondaryBg(settings) : surface,
                color: period === p ? '#fff' : textMuted,
                border: `1px solid ${period === p ? 'transparent' : border}`,
              }}
            >{p}</button>
          ))}
        </div>

        {/* Export */}
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => toast.success('Report exported', { description: 'Revenue summary exported as PDF' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0"
          style={{ background: `${sec}15`, color: sec, border: `1px solid ${sec}30`, fontSize: '0.68rem', fontWeight: 600, fontFamily: ff }}
        >
          <Download size={13} /> Export
        </motion.button>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
        <div
          className="flex flex-col gap-3 overflow-y-auto p-3 shrink-0"
          style={{ width: 300, borderRight: `1px solid ${border}` }}
        >
          {/* KPI cards */}
          <KpiCard icon={BarChart3}    label="Revenue Billed (YTD)"     value={`₹${totalBilled.toFixed(1)} Cr`}     sub="+8.4% vs last FY"          color={pri}         trend="up"   />
          <KpiCard icon={Wallet}       label="Revenue Collected"         value={`₹${totalCollected.toFixed(1)} Cr`}  sub={`${efficiency.toFixed(1)}% efficiency`} color="#4CAF50" trend="up"   />
          <KpiCard icon={AlertTriangle}label="Outstanding Dues"          value={`₹${outstanding.toFixed(1)} Cr`}     sub="Across all categories"      color="#FF9800"               warn         />
          <KpiCard icon={Activity}     label="AT&C Losses"               value={`${atcLoss}%`}                        sub="−0.3% vs last FY"           color="#EF5350"     trend="down" />
          <KpiCard icon={IndianRupee}  label="Avg. Realisation Rate"     value={`₹${realization}/unit`}              sub="Blended across tariffs"     color={sec}         trend="up"   />

          {/* Collection Aging ───────────────────────────────────────────── */}
          <div className="rounded-2xl p-3.5" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
                <Clock size={13} style={{ color: sec }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Collection Aging</span>
              <span className="ml-auto" style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>₹50.1 Cr total</span>
            </div>

            {/* Stacked bar */}
            <div className="flex rounded-full overflow-hidden mb-3" style={{ height: 8 }}>
              {AGING_DATA.map(a => (
                <div key={a.label} style={{ width: `${a.pct}%`, background: a.color }} />
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {AGING_DATA.map(a => (
                <div key={a.label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: a.color }} />
                  <span style={{ fontSize: '0.68rem', color: textMuted, fontFamily: ff, flex: 1 }}>{a.label}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: textMain, fontFamily: ff }}>₹{a.amount} Cr</span>
                  <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: '0.625rem', fontWeight: 700, background: `${a.color}18`, color: a.color }}>{a.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tariff Rate Schedule ───────────────────────────────────────── */}
          <div className="rounded-2xl p-3.5" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                <FileText size={13} style={{ color: pri }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Tariff Schedule</span>
            </div>
            <div className="flex flex-col gap-2">
              {TARIFF_SLABS.map(t => (
                <div key={t.cat} className="rounded-xl p-2.5" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : `${t.color}06`, border: `1px solid ${t.color}20` }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color }} />
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: t.color, fontFamily: ff }}>{t.cat}</span>
                    <span className="ml-auto" style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>Fixed: {t.fixed}</span>
                  </div>
                  {t.slabs.map((s, i) => (
                    <div key={i} style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff, lineHeight: 1.6 }}>• {s}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Category mini list ─────────────────────────────────────────── */}
          <div className="rounded-2xl p-3.5" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                <Users size={13} style={{ color: pri }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Revenue by Category</span>
            </div>
            {CATEGORY_DATA.map(c => (
              <div key={c.name} className="flex items-center gap-2 mb-2">
                <c.Icon size={12} style={{ color: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.68rem', color: textMuted, fontFamily: ff, flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: textMain, fontFamily: ff }}>₹{c.value} Cr</span>
                <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: '0.625rem', fontWeight: 700, background: `${c.color}18`, color: c.color }}>{c.pct}%</span>
              </div>
            ))}
            {/* Stacked bar */}
            <div className="flex rounded-full overflow-hidden mt-2" style={{ height: 6 }}>
              {CATEGORY_DATA.map(c => (
                <div key={c.name} style={{ width: `${c.pct}%`, background: c.color }} />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

          {/* ── Billing vs Collection Trend ──────────────────────────────── */}
          <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
                  <BarChart3 size={15} style={{ color: sec }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: textMain, fontFamily: ff }}>
                    Billing vs Collection Trend
                  </div>
                  <div style={{ fontSize: '0.65rem', color: textMuted, fontFamily: ff }}>
                    {period === 'Annual' ? 'Last 5 Financial Years' : period === 'Quarterly' ? 'FY 2025–26 Quarters' : 'FY 2025–26 Monthly · *Mar partial'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: `${pri}90` }} />
                  <span style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>Billed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: `${sec}90` }} />
                  <span style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>Collected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-0.5 rounded-full" style={{ background: '#4CAF50' }} />
                  <span style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>Efficiency %</span>
                </div>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={period} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={chartData} margin={{ top: 4, right: 40, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="billedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={pri} stopOpacity={0.85} />
                        <stop offset="100%" stopColor={pri} stopOpacity={0.4} />
                      </linearGradient>
                      <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={sec} stopOpacity={0.85} />
                        <stop offset="100%" stopColor={sec} stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridC} vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10, fill: textMuted, fontFamily: ff }} axisLine={false} tickLine={false} tickFormatter={v => `${v}`} />
                    <YAxis yAxisId="right" orientation="right" domain={[80, 100]} tick={{ fontSize: 10, fill: '#4CAF50', fontFamily: ff }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar yAxisId="left" dataKey="billed"    name="Billed"    fill="url(#billedGrad)"    radius={[4,4,0,0]} maxBarSize={28} />
                    <Bar yAxisId="left" dataKey="collected" name="Collected" fill="url(#collectedGrad)" radius={[4,4,0,0]} maxBarSize={28} />
                    <Line yAxisId="right" type="monotone" dataKey="efficiency" name="Efficiency" stroke="#4CAF50" strokeWidth={2} dot={{ r: 3, fill: '#4CAF50' }} activeDot={{ r: 5 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Zone Revenue + Category Donut ────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">

            {/* Zone Revenue */}
            <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                  <Zap size={13} style={{ color: pri }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Zone-wise Revenue</span>
                <span className="ml-auto" style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>vs Target</span>
              </div>
              <div className="flex flex-col gap-3">
                {ZONE_DATA.map(z => {
                  const pct = (z.revenue / z.target) * 100;
                  const over = pct >= 100;
                  const barColor = over ? '#4CAF50' : pct >= 95 ? sec : '#EF5350';
                  return (
                    <motion.div
                      key={z.zone}
                      onHoverStart={() => setHoveredZone(z.zone)}
                      onHoverEnd={() => setHoveredZone(null)}
                      animate={{ scale: hoveredZone === z.zone ? 1.01 : 1 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: textMain, fontFamily: ff }}>{z.zone}</span>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '0.65rem', color: textMuted, fontFamily: ff }}>₹{z.revenue} Cr</span>
                          <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: '0.625rem', fontWeight: 700, background: `${barColor}18`, color: barColor }}>
                            {over ? '↑' : ''}{pct.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="rounded-full overflow-hidden" style={{ height: 6, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: barColor }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{z.consumers.toLocaleString('en-IN')} consumers</span>
                        <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>Target: ₹{z.target} Cr</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Category Donut */}
            <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                  <Activity size={13} style={{ color: pri }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Revenue Mix</span>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ flex: '0 0 140px', height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CATEGORY_DATA} cx="50%" cy="50%"
                        innerRadius={40} outerRadius={68}
                        dataKey="value" paddingAngle={2}
                        labelLine={false} label={renderDonutLabel}
                        onMouseEnter={(_, i) => setActiveCatIdx(i)}
                        onMouseLeave={() => setActiveCatIdx(null)}
                      >
                        {CATEGORY_DATA.map((c, i) => (
                          <Cell
                            key={c.name} fill={c.color}
                            opacity={activeCatIdx === null || activeCatIdx === i ? 1 : 0.45}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  {CATEGORY_DATA.map((c, i) => {
                    const isActive = activeCatIdx === i;
                    return (
                      <motion.div
                        key={c.name}
                        animate={{ scale: isActive ? 1.03 : 1 }}
                        onHoverStart={() => setActiveCatIdx(i)}
                        onHoverEnd={() => setActiveCatIdx(null)}
                        className="rounded-xl px-2.5 py-2 cursor-pointer"
                        style={{ background: isActive ? `${c.color}12` : 'transparent', border: `1px solid ${isActive ? c.color + '40' : 'transparent'}` }}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: isActive ? c.color : textMuted, fontFamily: ff, flex: 1 }}>{c.name}</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: textMain, fontFamily: ff }}>₹{c.value} Cr</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 ml-4">
                          <span style={{ fontSize: '0.6rem', color: textMuted, fontFamily: ff }}>{c.units} MU · {c.consumers.toLocaleString('en-IN')} consumers</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Top Defaulters + Recent Transactions ─────────────────────── */}
          <div className="grid grid-cols-2 gap-4">

            {/* Top Defaulters */}
            <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EF535018' }}>
                  <AlertTriangle size={13} style={{ color: '#EF5350' }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Top Defaulters</span>
                <span className="ml-auto px-2 py-0.5 rounded-full" style={{ fontSize: '0.625rem', fontWeight: 700, background: '#EF535018', color: '#EF5350', fontFamily: ff }}>
                  ₹{TOP_DEFAULTERS.reduce((s, d) => s + d.dues, 0).toFixed(2)} Cr total
                </span>
              </div>

              {/* Table header */}
              <div className="flex items-center gap-2 px-2 pb-1.5" style={{ borderBottom: `1px solid ${border}` }}>
                {['Consumer', 'Category', 'Dues', 'Overdue', ''].map((h, i) => (
                  <span key={i} style={{
                    fontSize: '0.625rem', fontWeight: 700, color: textMuted, fontFamily: ff,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    flex: i === 0 ? 2 : i === 4 ? '0 0 60px' : 1,
                  }}>{h}</span>
                ))}
              </div>

              <div className="flex flex-col">
                {TOP_DEFAULTERS.map((d, idx) => {
                  const catColor = CAT_COLOR[d.cat] ?? pri;
                  const urgency = d.days > 90 ? '#B71C1C' : d.days > 60 ? '#FF5722' : '#FF9800';
                  return (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-center gap-2 px-2 py-2 rounded-xl"
                      style={{ borderBottom: idx < TOP_DEFAULTERS.length - 1 ? `1px solid ${border}` : 'none' }}
                      whileHover={{ background: surface }}
                    >
                      <div style={{ flex: 2, minWidth: 0 }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: textMain, fontFamily: ff, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                        <div style={{ fontSize: '0.6rem', color: textMuted, fontFamily: ff }}>{d.no}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: '0.58rem', fontWeight: 700, background: `${catColor}15`, color: catColor, fontFamily: ff, whiteSpace: 'nowrap' }}>
                          {d.cat.substring(0, 4)}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#EF5350', fontFamily: ff }}>₹{d.dues.toFixed(2)} Cr</div>
                        <div style={{ fontSize: '0.6rem', color: textMuted, fontFamily: ff }}>{d.zone}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: '0.6rem', fontWeight: 700, background: `${urgency}18`, color: urgency, fontFamily: ff }}>
                          {d.days}d
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        disabled={sending === d.id}
                        onClick={() => handleSendNotice(d)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg shrink-0"
                        style={{
                          flex: '0 0 60px', fontSize: '0.625rem', fontWeight: 700, fontFamily: ff,
                          background: sending === d.id ? `${sec}10` : `${sec}15`,
                          color: sec, border: `1px solid ${sec}30`,
                          opacity: sending === d.id ? 0.7 : 1,
                          cursor: sending === d.id ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {sending === d.id
                          ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} style={{ display: 'flex' }}><RefreshCw size={9} /></motion.span>
                          : <Send size={9} />
                        }
                        {sending === d.id ? '…' : 'Notice'}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-2xl p-4 flex flex-col" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#4CAF5018' }}>
                  <CheckCircle size={13} style={{ color: '#4CAF50' }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Recent Transactions</span>
                <span className="ml-auto flex items-center gap-1" style={{ fontSize: '0.625rem', color: '#4CAF50', fontFamily: ff }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4CAF50', display: 'inline-block' }} />
                  Live
                </span>
              </div>

              <div className="flex flex-col gap-1 overflow-y-auto flex-1" style={{ maxHeight: 340 }}>
                {RECENT_TXNS.map((t, idx) => {
                  const ModeIcon = MODE_ICON[t.mode] ?? CreditCard;
                  const catColor = CAT_COLOR[t.cat] ?? pri;
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-center gap-2.5 px-2 py-2 rounded-xl"
                      style={{ borderBottom: idx < RECENT_TXNS.length - 1 ? `1px solid ${border}` : 'none' }}
                      whileHover={{ background: surface }}
                    >
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${catColor}15` }}>
                        <ModeIcon size={12} style={{ color: catColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: textMain, fontFamily: ff, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                        <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{t.no} · {t.mode}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: t.ok ? '#4CAF50' : '#FF9800', fontFamily: ff }}>
                          +₹{t.amount.toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                          {t.ok
                            ? <CheckCircle size={8} style={{ color: '#4CAF50' }} />
                            : <Clock size={8} style={{ color: '#FF9800' }} />
                          }
                          <span style={{ fontSize: '0.58rem', color: textMuted, fontFamily: ff }}>{t.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Summary footer */}
              <div className="shrink-0 pt-2.5 mt-1" style={{ borderTop: `1px solid ${border}` }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>Today's collection so far</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4CAF50', fontFamily: ff }}>
                    +₹{RECENT_TXNS.filter(t => t.ok).reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom spacer */}
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  );
}