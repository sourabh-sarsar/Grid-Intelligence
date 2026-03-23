import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Users, Network, Cpu, Activity, BarChart3,
  TrendingUp, FlaskConical, AlertCircle, FileText, Settings,
  Map, ChevronDown, ChevronRight, Lock, Layers, Database,
  Palette, Component, ArrowRight, Box, GitBranch, Radio,
  Zap, Shield, Eye, BarChart2, Clock, RefreshCw,
  MonitorSmartphone, SlidersHorizontal, BookOpen, Code2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ─── Domain colour system ─────────────────────────────────────────────────────

const DOMAINS: Record<string, { color: string; bg: string; label: string }> = {
  ops:      { color: '#1565C0', bg: '#E3F2FD', label: 'Grid Ops' },
  consumer: { color: '#00695C', bg: '#E0F2F1', label: 'Consumer' },
  finance:  { color: '#E65100', bg: '#FFF3E0', label: 'Finance' },
  planning: { color: '#6A1B9A', bg: '#F3E5F5', label: 'Planning' },
  infra:    { color: '#2E7D32', bg: '#E8F5E9', label: 'Infrastructure' },
  config:   { color: '#37474F', bg: '#ECEFF1', label: 'Config' },
  auth:     { color: '#B71C1C', bg: '#FFEBEE', label: 'Auth' },
  shell:    { color: '#0277BD', bg: '#E1F5FE', label: 'Shell' },
  data:     { color: '#4A148C', bg: '#EDE7F6', label: 'Data' },
};

// ─── Page definitions ─────────────────────────────────────────────────────────

const PAGES = [
  {
    id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, domain: 'ops', route: 'dashboard',
    subtitle: 'Bento Grid command centre',
    sections: [
      'Row 1 — Micro Widgets ×4 (Grid Health · Frequency · Power Factor · Energy Losses)',
      'Row 2 — Consumer Intelligence | Power Balance | System Alerts',
      'Row 3 — Revenue Analytics | Load Forecast | Grid Assets',
      'Row 4 — Power Studies (full-width)',
    ],
    features: ['Drag-to-swap cards', 'Show / hide individual cards', 'Add Card dropdown', '12-col dynamic span rebalancing'],
    charts: ['Area chart (Supply vs Load, 3 ranges)', 'Area chart w/ confidence band + Now marker', 'Bar+Line composed (Revenue vs Projected)', 'Donut / Pie (Consumer mix)'],
    cards: 11,
  },
  {
    id: 'consumers', label: 'Consumers', icon: Users, domain: 'consumer', route: 'consumers',
    subtitle: 'Consumer registry & detail',
    sections: ['Search + category filter bar', 'Consumer list (paginated)', 'Detail panel — Contact, Address, Connection, Meter'],
    features: ['Live-status ping badges', 'Category filter (Residential / Commercial / Agricultural / Industrial)', 'Per-record meter status (Active / Faulty / Replaced)', 'Photo avatars via Unsplash'],
    charts: [],
    cards: null,
  },
  {
    id: 'grid-explorer', label: 'Grid Explorer', icon: Network, domain: 'ops', route: 'grid-explorer',
    subtitle: 'Hierarchical topology drill-down',
    sections: ['Breadcrumb path (Zone→SS→Feeder→T-Bank→Circuit→Assets)', 'Grid / List view toggle', 'Search within level', 'Asset detail panel'],
    features: ['6-level hierarchy navigation', 'Deterministic pseudo-random data per node', 'Status badges (Healthy / Warning / Fault)', 'Child-count summary per node'],
    charts: [],
    cards: null,
  },
  {
    id: 'assets', label: 'Assets', icon: Cpu, domain: 'infra', route: 'assets',
    subtitle: 'Interactive map + asset registry',
    sections: ['Leaflet map with geo-coded CircleMarkers', 'Asset type filter sidebar', 'Status filter (Active / Faulty / Offline / Maintenance)', 'Asset detail panel (Dispatch, Checklist, Maintenance)'],
    features: ['Real Noida / Greater Noida coordinates', '4 asset types: Transformer · Substation · Feeder · Smart Meter', 'Toast on dispatch/checklist actions', 'Age & last-inspection tracking'],
    charts: ['Leaflet map (react-leaflet)'],
    cards: null,
  },
  {
    id: 'load', label: 'Load Monitor', icon: Activity, domain: 'ops', route: 'load',
    subtitle: 'Real-time demand tracking',
    sections: ['24 h load curve (Actual vs Forecast)', 'Zone-wise load breakdown (A–E)', 'Feeder-level table', 'KPI strip (Current demand · Peak · Load factor · Frequency)'],
    features: ['Now reference line on chart', 'Zone capacity utilisation bars', 'Feeder status (Active / Overloaded / Critical / Offline)', 'Download / Refresh actions'],
    charts: ['ComposedChart Area (Actual+Forecast)', 'ReferenceLine at current hour'],
    cards: null,
  },
  {
    id: 'revenue', label: 'Revenue', icon: BarChart3, domain: 'finance', route: 'revenue',
    subtitle: 'Billing, collections & AT&C',
    sections: ['Summary KPIs (Billed · Collected · Efficiency · AT&C Loss)', 'ComposedChart Bar+Line (Billed vs Collected + Efficiency %)', 'Category-wise pie breakdown', 'Period toggle (Monthly · Quarterly · Annual)'],
    features: ['Monthly / Quarterly / Annual datasets', 'FY 21-22 → 25-26 trend', 'Collection efficiency overlay line', 'Download & Send report actions'],
    charts: ['ComposedChart Bar+Line', 'PieChart (category mix)'],
    cards: null,
  },
  {
    id: 'forecast', label: 'Forecasting', icon: TrendingUp, domain: 'planning', route: 'forecast',
    subtitle: 'AI-powered demand prediction',
    sections: ['Forecast chart (Actual + Forecast + Confidence Band)', 'Horizon selector (Day · Week · Month)', 'Weather influence indicators', 'Peak demand annotation + model accuracy stats'],
    features: ['Eraser-technique confidence band', '"Now" vertical marker', 'Day-ahead 24h + Week + Month datasets', 'Refresh & Download actions'],
    charts: ['Area chart (Actual + Forecast + Upper/Lower band)', 'Bar chart (Weekly peak)'],
    cards: null,
  },
  {
    id: 'studies', label: 'Studies', icon: FlaskConical, domain: 'planning', route: 'studies',
    subtitle: 'Power simulations & engineering analysis',
    sections: ['Study list (Completed · Running · Scheduled · In Review · Failed)', 'Study metrics RadarChart', 'Violation count BarChart', 'Action toolbar (Run · Refresh · Download · View)'],
    features: ['7 study types', 'Progress bars for Running studies', 'Result modal per study type (KPI cards + data tables + conclusion)', 'New Study modal (Name · Type dropdown · Circuit dropdown with search)', 'Add-to-list after submission'],
    charts: ['RadarChart (study scores)', 'Bar chart (violations per study)'],
    cards: null,
  },
  {
    id: 'alerts', label: 'Alerts & Faults', icon: AlertCircle, domain: 'ops', route: 'alerts',
    subtitle: 'SCADA fault monitoring & incident management',
    sections: ['Alert list with Severity filter (Critical · High · Medium · Low)', 'Status workflow (Active → Acknowledged → Resolved)', 'Per-alert timeline panel', 'Assign / Acknowledge / Resolve actions'],
    features: ['4 severity levels with distinct colour coding (light + dark mode)', '5 device types (Feeder · Transformer · Consumer · System · Meter)', 'Real-time timeline per alert', 'Toast on status transitions'],
    charts: [],
    cards: null,
  },
  {
    id: 'reports', label: 'Reports', icon: FileText, domain: 'finance', route: 'reports',
    subtitle: 'Scheduled & on-demand reporting',
    sections: ['Report type catalogue (6 types)', 'Format selector (PDF · Excel · CSV)', 'Section checklist per report', 'Schedule / Preview / Generate / Email actions'],
    features: ['Revenue · Load · Consumer · Asset · Energy Audit · AT&C Loss reports', '6 sections per report type', 'Format badge chips', 'Toast on generate/schedule'],
    charts: ['Bar chart (scheduled reports)'],
    cards: null,
  },
  {
    id: 'settings', label: 'Settings', icon: Settings, domain: 'config', route: 'settings',
    subtitle: 'Full theme & UX customisation',
    sections: [
      'Theme & Colors — Primary (12 solid + 16 gradient) · Secondary (10 solid + 16 gradient) · 20 paired theme presets',
      'Typography — 15 Google Fonts · fontSize · lineSpacing',
      'Layout — Card radius · Card shadow · Card spacing · UI Density (3)',
      'Background Patterns — 11 patterns (Grid · Dots · Blueprint · Circuit · Hexagonal …)',
      'Dashboard Cards — Show / hide all 11 cards',
      'Motion & Accessibility — Motion (Full · Reduced · None) · Text size (Small · Medium · Large · XL)',
      'Live Preview Card — real-time rendering of all changes',
    ],
    features: ['All changes reflected globally via ThemeContext', 'Save / Reset buttons', 'Dark mode toggle in TopNavBar'],
    charts: [],
    cards: null,
  },
];

// ─── Dashboard card definitions ───────────────────────────────────────────────

const DASH_CARDS = [
  { id: 'micro-health',  label: 'Grid Health',       group: 'Micro', span: 3,  value: '97.4 %',      status: 'good'  },
  { id: 'micro-freq',    label: 'Grid Frequency',    group: 'Micro', span: 3,  value: '49.98 Hz',    status: 'good'  },
  { id: 'micro-pf',      label: 'Power Factor',      group: 'Micro', span: 3,  value: '0.92 pf',     status: 'warn'  },
  { id: 'micro-losses',  label: 'Energy Losses',     group: 'Micro', span: 3,  value: '4.2 %',       status: 'warn'  },
  { id: 'consumer',      label: 'Consumer Intel.',   group: 'Main',  span: 3,  value: '1,36,000',    status: 'info'  },
  { id: 'powerbalance',  label: 'Power Balance',     group: 'Main',  span: 5,  value: '5,100 MW',    status: 'warn'  },
  { id: 'alerts',        label: 'System Alerts',     group: 'Main',  span: 4,  value: '2 Critical',  status: 'bad'   },
  { id: 'revenue',       label: 'Revenue Analytics', group: 'Main',  span: 4,  value: '₹293 Cr',     status: 'info'  },
  { id: 'forecast',      label: 'Load Forecast',     group: 'Main',  span: 5,  value: '618 MW peak', status: 'warn'  },
  { id: 'assets',        label: 'Grid Assets',       group: 'Main',  span: 3,  value: '3 Faults',    status: 'warn'  },
  { id: 'studies',       label: 'Power Studies',     group: 'Main',  span: 12, value: '5 studies',   status: 'info'  },
];

// ─── Theme system fields ──────────────────────────────────────────────────────

const THEME_FIELDS = [
  { key: 'primaryColor',          label: 'Primary Color',            type: 'color',   options: '12 solid + 16 gradients' },
  { key: 'primaryGradientFrom',   label: 'Primary Gradient From',    type: 'gradient',options: 'hex string' },
  { key: 'primaryGradientTo',     label: 'Primary Gradient To',      type: 'gradient',options: 'hex string' },
  { key: 'secondaryColor',        label: 'Secondary Color',          type: 'color',   options: '10 solid + 16 gradients' },
  { key: 'secondaryGradientFrom', label: 'Secondary Gradient From',  type: 'gradient',options: 'hex string' },
  { key: 'secondaryGradientTo',   label: 'Secondary Gradient To',    type: 'gradient',options: 'hex string' },
  { key: 'fontFamily',            label: 'Font Family',              type: 'font',    options: '15 Google Fonts' },
  { key: 'fontSize',              label: 'Font Size',                type: 'number',  options: 'px slider' },
  { key: 'lineSpacing',           label: 'Line Spacing',             type: 'number',  options: 'ratio slider' },
  { key: 'accessibility',         label: 'Accessibility Scale',      type: 'enum',    options: 'small · medium · large · xl' },
  { key: 'backgroundPattern',     label: 'Background Pattern',       type: 'enum',    options: '11 patterns' },
  { key: 'cardBorderRadius',      label: 'Card Border Radius',       type: 'number',  options: 'px slider (0–32)' },
  { key: 'cardShadow',            label: 'Card Shadow',              type: 'number',  options: 'depth slider' },
  { key: 'cardSpacing',           label: 'Card Spacing',             type: 'number',  options: 'px slider' },
  { key: 'density',               label: 'UI Density',               type: 'enum',    options: 'comfortable · compact · dense' },
  { key: 'motion',                label: 'Motion',                   type: 'enum',    options: 'full · reduced · none' },
  { key: 'darkMode',              label: 'Dark Mode',                type: 'bool',    options: 'toggle in TopNavBar' },
  { key: 'visibleCards',          label: 'Visible Dashboard Cards',  type: 'array',   options: 'string[] of card IDs' },
];

// ─── Component inventory ──────────────────────────────────────────────────────

const COMP_GROUPS = [
  {
    label: 'Layout Shell', color: DOMAINS.shell.color, bg: DOMAINS.shell.bg,
    items: ['TopNavBar', 'SideNav', 'Bento Grid (App.tsx)', 'AnimatePresence page transitions'],
  },
  {
    label: 'Dashboard Cards', color: DOMAINS.ops.color, bg: DOMAINS.ops.bg,
    items: ['MicroWidget', 'ConsumerCard', 'PowerBalanceCard', 'AlertsCard', 'RevenueCard', 'ForecastCard', 'AssetCard', 'StudiesCard'],
  },
  {
    label: 'Modals & Overlays', color: DOMAINS.planning.color, bg: DOMAINS.planning.bg,
    items: ['NewStudyModal', 'StudyResultModal', 'Request-to-Register flow', 'User profile dropdown', 'Add Card dropdown'],
  },
  {
    label: 'Charts (recharts)', color: DOMAINS.finance.color, bg: DOMAINS.finance.bg,
    items: ['AreaChart (supply/load, forecast, load monitor)', 'ComposedChart Bar+Line (revenue)', 'PieChart / Donut (consumers)', 'RadarChart (study scores)', 'BarChart (violations, reports)'],
  },
  {
    label: 'Map (react-leaflet)', color: DOMAINS.infra.color, bg: DOMAINS.infra.bg,
    items: ['MapContainer', 'TileLayer (OpenStreetMap)', 'CircleMarker (assets)', 'Popup (asset details)'],
  },
  {
    label: 'UI Primitives (shadcn)', color: DOMAINS.config.color, bg: DOMAINS.config.bg,
    items: ['Button · Input · Badge · Tooltip', 'Dialog · Sheet · Drawer', 'Tabs · Accordion', 'Select · Dropdown · Popover', 'Calendar · Progress · Slider', '40+ components total'],
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const c = status === 'good' ? '#4CAF50' : status === 'warn' ? '#FF9800' : status === 'bad' ? '#F44336' : '#1565C0';
  return <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />;
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function PageCard({ page, idx }: { page: typeof PAGES[0]; idx: number }) {
  const { settings } = useTheme();
  const [open, setOpen] = useState(false);
  const d = DOMAINS[page.domain];
  const isDark = settings.darkMode;

  const cardBg = isDark ? '#1e1e1e' : '#fff';
  const textMain = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted = isDark ? '#78909c' : '#546e7a';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: cardBg, border: `1px solid ${border}`, fontFamily: settings.fontFamily }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
        style={{ background: open ? (isDark ? 'rgba(255,255,255,0.04)' : `${d.color}06`) : 'transparent' }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: isDark ? `${d.color}22` : d.bg }}>
          <page.icon size={17} style={{ color: d.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold" style={{ fontSize: '0.85rem', color: textMain }}>{page.label}</span>
            <span className="px-1.5 py-0.5 rounded-full"
              style={{ fontSize: '0.625rem', fontWeight: 600, background: isDark ? `${d.color}22` : d.bg, color: d.color }}>
              {d.label}
            </span>
            <code className="px-1.5 py-0.5 rounded"
              style={{ fontSize: '0.625rem', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: textMuted }}>
              /{page.route}
            </code>
          </div>
          <p className="opacity-60 mt-0.5 truncate" style={{ fontSize: '0.72rem', color: textMuted }}>{page.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {page.cards !== null && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: isDark ? `${d.color}22` : d.bg, color: d.color }}>
              {page.cards} cards
            </span>
          )}
          {page.charts.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: isDark ? 'rgba(76,175,80,0.15)' : '#E8F5E9', color: '#2E7D32' }}>
              {page.charts.length} chart{page.charts.length > 1 ? 's' : ''}
            </span>
          )}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={15} style={{ color: textMuted }} />
          </motion.span>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-3"
              style={{ borderTop: `1px solid ${border}` }}>

              {/* Sections */}
              <div className="mt-3">
                <p className="mb-1.5" style={{ fontSize: '0.68rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sections</p>
                <div className="flex flex-col gap-1">
                  {page.sections.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight size={11} style={{ color: d.color, marginTop: 3, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.76rem', color: textMain, lineHeight: 1.45 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              {page.features.length > 0 && (
                <div>
                  <p className="mb-1.5" style={{ fontSize: '0.68rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Key Features</p>
                  <div className="flex flex-wrap gap-1.5">
                    {page.features.map((f, i) => (
                      <span key={i} className="px-2 py-1 rounded-lg"
                        style={{ fontSize: '0.72rem', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: textMain }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Charts */}
              {page.charts.length > 0 && (
                <div>
                  <p className="mb-1.5" style={{ fontSize: '0.68rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Visualisations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {page.charts.map((c, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-lg"
                        style={{ fontSize: '0.72rem', background: isDark ? 'rgba(76,175,80,0.12)' : '#E8F5E9', color: '#2E7D32' }}>
                        <BarChart2 size={10} /> {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main IA Page ─────────────────────────────────────────────────────────────

export function IAPage({ onBack }: { onBack?: () => void }) {
  const { settings } = useTheme();
  const isDark = settings.darkMode;

  const pageBg    = isDark ? '#0f0f0f' : '#f0f4fc';
  const cardBg    = isDark ? '#1e1e1e' : '#fff';
  const textMain  = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted = isDark ? '#78909c' : '#546e7a';
  const border    = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const ff        = settings.fontFamily;
  const pri       = settings.primaryColor;

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: pageBg, fontFamily: ff }}>
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                <ChevronDown size={16} style={{ color: textMuted, transform: 'rotate(90deg)' }} />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${pri}18` }}>
              <Map size={20} style={{ color: pri }} />
            </div>
            <div>
              <h1 className="font-bold" style={{ fontSize: '1.15rem', color: textMain }}>
                Information Architecture
              </h1>
              <p style={{ fontSize: '0.75rem', color: textMuted, opacity: 0.7 }}>
                Grid Intelligence Platform · v2.4.1 · Complete structural map
              </p>
            </div>
          </div>
          {/* Quick stats */}
          <div className="flex gap-2 flex-wrap">
            {[
              { v: '11', l: 'Pages' },
              { v: '11', l: 'Dash Cards' },
              { v: '18', l: 'Theme Fields' },
              { v: '40+', l: 'UI Components' },
              { v: '5', l: 'Chart Types' },
            ].map(s => (
              <div key={s.l} className="rounded-xl px-3 py-1.5 text-center"
                style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }}>
                <p className="font-bold" style={{ fontSize: '1rem', color: pri, lineHeight: 1 }}>{s.v}</p>
                <p style={{ fontSize: '0.64rem', color: textMuted }}>{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Layer Architecture ───────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <p className="mb-3 font-semibold" style={{ fontSize: '0.8rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            System Layers
          </p>
          <div className="flex flex-col gap-2">
            {/* Layer 1 */}
            {[
              {
                label: 'Authentication Layer', icon: Lock, d: DOMAINS.auth,
                items: ['LoginPage — Email / Password gate', 'Error states: wrong_password · no_access', 'Request-to-Register flow (Email · Name · Mobile · AOR Zone · Designation)', 'Credentials: sourabhsarsar@discom.com / 123456'],
              },
              {
                label: 'App Shell — Bento Grid', icon: Layers, d: DOMAINS.shell,
                items: ['TopNavBar (row 1 · full width) — Logo · Breadcrumb · Notifications · User profile · Nav-mode toggle · Dark-mode', 'SideNav (col 1 · row 2) — 11 nav items · Collapse/expand · Drag-to-top-bar · Alert badge · Tooltips', 'Main Content Area (col 2 · row 2) — AnimatePresence slide transitions', 'MotionConfig — full / reduced / none motion globally'],
              },
              {
                label: 'Global State — ThemeContext', icon: Database, d: DOMAINS.data,
                items: ['ThemeSettings (18 fields) persisted in React context', 'Helpers: getPrimaryBg() · getSecondaryBg() · primarySolid() · secondarySolid() · getDensitySpacing()', 'Density spacing object: { pad, gap, headerGap, iconBox, iconSize, itemPad }', 'MotionConfig transition overridden by settings.motion'],
              },
              {
                label: 'Foundation Libraries', icon: Code2, d: DOMAINS.config,
                items: ['motion/react — page transitions · card animations · micro-interactions', 'recharts — AreaChart · ComposedChart · PieChart · RadarChart · BarChart', 'react-leaflet — geo map on Assets page', 'sonner (Toaster) — toast notifications', 'lucide-react — icon system', 'shadcn/ui — 40+ primitive components'],
              },
            ].map((layer, li) => (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + li * 0.05 }}
                className="rounded-2xl p-4"
                style={{ background: cardBg, border: `1px solid ${border}` }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: isDark ? `${layer.d.color}22` : layer.d.bg }}>
                    <layer.icon size={14} style={{ color: layer.d.color }} />
                  </div>
                  <span className="font-semibold" style={{ fontSize: '0.82rem', color: textMain }}>{layer.label}</span>
                  <span className="px-1.5 py-0.5 rounded-full ml-auto"
                    style={{ fontSize: '0.625rem', fontWeight: 600, background: isDark ? `${layer.d.color}22` : layer.d.bg, color: layer.d.color }}>
                    {layer.d.label}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pl-9">
                  {layer.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: layer.d.color }} />
                      <p style={{ fontSize: '0.74rem', color: textMuted, lineHeight: 1.4 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Navigation Map ───────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <p className="mb-3 font-semibold" style={{ fontSize: '0.8rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Navigation Structure
          </p>
          <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {PAGES.map((page, i) => {
                const d = DOMAINS[page.domain];
                return (
                  <div key={page.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}` }}>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: isDark ? `${d.color}22` : d.bg }}>
                      <page.icon size={12} style={{ color: d.color }} />
                    </div>
                    <span style={{ fontSize: '0.74rem', color: textMain, fontWeight: 500 }}>{page.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 flex flex-wrap gap-3" style={{ borderTop: `1px solid ${border}` }}>
              {Object.entries(DOMAINS).filter(([k]) => !['auth', 'shell', 'data'].includes(k)).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: v.color }} />
                  <span style={{ fontSize: '0.68rem', color: textMuted }}>{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Dashboard Bento Grid Map ─────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
          <p className="mb-3 font-semibold" style={{ fontSize: '0.8rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Dashboard — Bento Grid Layout  <span style={{ fontSize: '0.7rem', fontWeight: 400, opacity: 0.6 }}>(12-column grid, 4 rows)</span>
          </p>
          <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '6px' }}>
              {DASH_CARDS.map((card) => {
                const statusColor = card.status === 'good' ? '#4CAF50' : card.status === 'warn' ? '#FF9800' : card.status === 'bad' ? '#F44336' : pri;
                const statusBg = isDark
                  ? card.status === 'good'  ? 'rgba(76,175,80,0.12)'
                    : card.status === 'warn' ? 'rgba(255,152,0,0.12)'
                    : card.status === 'bad'  ? 'rgba(244,67,54,0.12)'
                    : `${pri}18`
                  : card.status === 'good'  ? '#E8F5E9'
                    : card.status === 'warn' ? '#FFF3E0'
                    : card.status === 'bad'  ? '#FFEBEE'
                    : `${pri}10`;
                return (
                  <div
                    key={card.id}
                    className="rounded-xl p-2 flex flex-col gap-1"
                    style={{ gridColumn: `span ${card.span}`, background: statusBg, border: `1px solid ${statusColor}28`, minHeight: 56 }}
                  >
                    <div className="flex items-center gap-1.5">
                      <StatusDot status={card.status} />
                      <span className="font-semibold truncate" style={{ fontSize: '0.68rem', color: textMain }}>{card.label}</span>
                    </div>
                    <p style={{ fontSize: '0.65rem', color: statusColor, fontWeight: 600 }}>{card.value}</p>
                    <p style={{ fontSize: '0.625rem', color: textMuted, opacity: 0.7 }}>span {card.span}/12</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4" style={{ paddingTop: 12, borderTop: `1px solid ${border}` }}>
              <span style={{ fontSize: '0.72rem', color: textMuted }}>Features:</span>
              {['Drag-to-swap', 'Show/hide cards', 'Add Card dropdown', 'Dynamic span rebalancing', 'Restore all'].map(f => (
                <span key={f} className="px-2 py-0.5 rounded-lg"
                  style={{ fontSize: '0.7rem', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: textMuted }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── All Pages ────────────────────────────────────────────────────── */}
        <div>
          <p className="mb-3 font-semibold" style={{ fontSize: '0.8rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Pages — Click to expand
          </p>
          <div className="flex flex-col gap-2">
            {PAGES.map((page, i) => <PageCard key={page.id} page={page} idx={i} />)}
          </div>
        </div>

        {/* ── Theme System ─────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
          <p className="mb-3 font-semibold" style={{ fontSize: '0.8rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            ThemeContext — 18 Settings Fields
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y"
              style={{ '--tw-divide-opacity': 1 } as any}>
              {THEME_FIELDS.map((f, i) => {
                const typeColor = f.type === 'color' ? '#1565C0' : f.type === 'gradient' ? '#6A1B9A' : f.type === 'font' ? '#00695C' : f.type === 'enum' ? '#E65100' : f.type === 'bool' ? '#C62828' : f.type === 'array' ? '#2E7D32' : '#546e7a';
                return (
                  <div key={f.key} className="flex items-start gap-3 px-4 py-2.5"
                    style={{ borderBottom: i < THEME_FIELDS.length - 2 ? `1px solid ${border}` : 'none' }}>
                    <span className="px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                      style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', background: `${typeColor}18`, color: typeColor }}>
                      {f.type}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium truncate" style={{ fontSize: '0.74rem', color: textMain }}>{f.label}</p>
                      <p className="opacity-60 truncate" style={{ fontSize: '0.68rem', color: textMuted }}>{f.options}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Component Inventory ──────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}>
          <p className="mb-3 font-semibold" style={{ fontSize: '0.8rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Component Inventory
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMP_GROUPS.map((grp, gi) => (
              <motion.div
                key={grp.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.46 + gi * 0.04 }}
                className="rounded-2xl p-4"
                style={{ background: cardBg, border: `1px solid ${border}` }}
              >
                <p className="font-semibold mb-2.5" style={{ fontSize: '0.78rem', color: grp.color }}>{grp.label}</p>
                <div className="flex flex-col gap-1.5">
                  {grp.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: grp.color }} />
                      <p style={{ fontSize: '0.73rem', color: textMuted, lineHeight: 1.4 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Data Flows ───────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <p className="mb-3 font-semibold" style={{ fontSize: '0.8rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Key Data Flows
          </p>
          <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
            {[
              { from: 'LoginPage', to: 'App.tsx (isLoggedIn = true → activePage = dashboard)', color: DOMAINS.auth.color },
              { from: 'SideNav / TopNavBar', to: 'App.tsx (setActivePage) → renderContent() → Page component', color: DOMAINS.shell.color },
              { from: 'Settings page', to: 'ThemeContext.updateSettings() → all components re-render via useTheme()', color: DOMAINS.config.color },
              { from: 'Dashboard drag-drop', to: 'order[] state swap → dynamicSpans memo recomputes → grid reflows', color: DOMAINS.ops.color },
              { from: 'StudiesCard "New Study"', to: 'NewStudyModal → onStudyAdded() → studyList state prepend → list re-renders', color: DOMAINS.planning.color },
              { from: 'ConsumerCard search', to: 'searchQuery → CONSUMERS.filter() → AnimatePresence list swap', color: DOMAINS.consumer.color },
              { from: 'AlertsCard filter', to: 'filter state → alerts.filter() → AnimatePresence popLayout', color: DOMAINS.ops.color },
              { from: 'TopNavBar Sign Out', to: 'onLogout() → isLoggedIn = false + activePage = dashboard → LoginPage mounts', color: DOMAINS.auth.color },
            ].map((flow, i) => (
              <div key={i} className="flex items-start gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded font-medium shrink-0"
                  style={{ fontSize: '0.7rem', background: `${flow.color}18`, color: flow.color }}>
                  {flow.from}
                </span>
                <ArrowRight size={13} style={{ color: textMuted, marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontSize: '0.72rem', color: textMuted, lineHeight: 1.4 }}>{flow.to}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="text-center pb-4">
          <p style={{ fontSize: '0.7rem', color: textMuted, opacity: 0.5 }}>
            Grid Intelligence Platform · © 2026 Sourabh · IA generated 18 Mar 2026
          </p>
        </div>

      </div>
    </div>
  );
}