import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Network, ChevronRight, ArrowLeft,
  CheckCircle, AlertTriangle, XCircle,
  Zap, Activity, Gauge, Cpu, Cable,
  LayoutGrid, List, Search, Info,
  MapPin, Hash, Layers, Radio,
  X, Shield, Wrench, Calendar, ClipboardList,
  Thermometer, BarChart2, FileText, Tag,
} from 'lucide-react';
import { useTheme, getPrimaryBg, getDensitySpacing } from '../context/ThemeContext';

// ─── Types ──────────────────────────────────────────────────────────────────
type Status = 'healthy' | 'warning' | 'fault';
type Level = 'zone' | 'substation' | 'feeder' | 'tbank' | 'circuit' | 'assets';

interface PathItem { level: Level; id: string; name: string; }

interface GridItem {
  id: string;
  name: string;
  subtitle?: string;
  status: Status;
  metrics: { label: string; value: string }[];
  childCount: number;
  childLabel: string;
  tag?: string;
}

interface AssetItem {
  id: string;
  name: string;
  type: string;
  serialNo: string;
  make: string;
  status: Status;
  lastChecked: string;
}

// ─── Deterministic pseudo-random helpers ───────────────────────────────────
function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
  return Math.abs(h);
}
function pick<T>(seed: number, arr: T[]): T { return arr[seed % arr.length]; }
function rng(seed: number, min: number, max: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
}
function statusFromSeed(seed: number): Status {
  const v = seed % 10;
  if (v < 7) return 'healthy';
  if (v < 9) return 'warning';
  return 'fault';
}

// ─── Static top-level zone data ────────────────────────────────────────────
const ZONES: GridItem[] = [
  { id: 'za', name: 'Zone A', subtitle: 'Sector 10–18, Noida', status: 'healthy',  tag: 'Operational',
    metrics: [{ label: 'Sub-Stations', value: '4' }, { label: 'Live Load', value: '87.4 MW' }, { label: 'Consumers', value: '28,400' }, { label: 'AT&C Loss', value: '8.2%' }],
    childCount: 4, childLabel: 'Sub-Stations' },
  { id: 'zb', name: 'Zone B', subtitle: 'Sector 37–62, Noida', status: 'warning', tag: 'High Load',
    metrics: [{ label: 'Sub-Stations', value: '4' }, { label: 'Live Load', value: '112.7 MW' }, { label: 'Consumers', value: '34,120' }, { label: 'AT&C Loss', value: '11.4%' }],
    childCount: 4, childLabel: 'Sub-Stations' },
  { id: 'zc', name: 'Zone C', subtitle: 'Sector 100–137, Noida', status: 'healthy', tag: 'Operational',
    metrics: [{ label: 'Sub-Stations', value: '3' }, { label: 'Live Load', value: '73.1 MW' }, { label: 'Consumers', value: '22,800' }, { label: 'AT&C Loss', value: '7.8%' }],
    childCount: 3, childLabel: 'Sub-Stations' },
  { id: 'zd', name: 'Zone D', subtitle: 'Greater Noida West', status: 'fault',   tag: 'Grid Fault',
    metrics: [{ label: 'Sub-Stations', value: '3' }, { label: 'Live Load', value: '58.9 MW' }, { label: 'Consumers', value: '19,600' }, { label: 'AT&C Loss', value: '14.3%' }],
    childCount: 3, childLabel: 'Sub-Stations' },
  { id: 'ze', name: 'Zone E', subtitle: 'Greater Noida East (Dadri)', status: 'healthy', tag: 'Operational',
    metrics: [{ label: 'Sub-Stations', value: '3' }, { label: 'Live Load', value: '61.3 MW' }, { label: 'Consumers', value: '21,000' }, { label: 'AT&C Loss', value: '9.1%' }],
    childCount: 3, childLabel: 'Sub-Stations' },
];

// ─── Sub-station name templates ─────────────────────────────────────────────
const SS_PREFIXES  = ['33/11 kV GIS SS', '33/11 kV SS', '132/33 kV Grid SS', '33/11 kV AIS SS'];
const SS_LOCATIONS: Record<string, string[]> = {
  za: ['Sector-12', 'Sector-15', 'Sector-18', 'Sector-10 (HT)'],
  zb: ['Sector-37', 'Sector-45', 'Sector-56', 'Sector-62 (HT)'],
  zc: ['Sector-100', 'Sector-110', 'Sector-137'],
  zd: ['GN West-1', 'GN West-2', 'GN West-3'],
  ze: ['Dadri-1', 'Dadri-2', 'Dadri-3'],
};
const FEEDER_TAGS  = ['Residential', 'Commercial', 'Mixed', 'Industrial', 'Agricultural'];
const TBANK_CAPS   = ['100 kVA', '250 kVA', '400 kVA', '630 kVA', '25 kVA'];
const CIRCUIT_TYPES = ['Single Phase – LT Service', 'Three Phase – LT Service', 'Three Phase – HT Service'];
const ASSET_TYPES  = [
  { type: 'Smart Energy Meter',  make: 'Genus',   tag: 'Meter'    },
  { type: 'CT/PT Set',           make: 'Kappa',   tag: 'Measure'  },
  { type: 'Load Break Switch',   make: 'ABB',     tag: 'Switch'   },
  { type: 'Isolator',            make: 'Siemens', tag: 'Protect'  },
  { type: 'Surge Arrester',      make: 'OBO',     tag: 'Protect'  },
  { type: 'Service Cable',       make: 'Polycab', tag: 'Cable'    },
  { type: 'Distribution Box',    make: 'Havells', tag: 'Infra'    },
  { type: 'Capacitor Bank',      make: 'L&T',     tag: 'Reactive' },
];

// ─── Data generators ────────────────────────────────────────────────────────
function getSubstations(zoneId: string): GridItem[] {
  const locs = SS_LOCATIONS[zoneId] ?? ['SS-1', 'SS-2', 'SS-3'];
  return locs.map((loc, i) => {
    const seed = hashStr(`${zoneId}-ss-${i}`);
    const cap  = pick(seed, [20, 40, 63, 100]);
    const load = rng(seed + 1, Math.round(cap * 0.45), Math.round(cap * 0.85));
    return {
      id:       `${zoneId}-ss${i}`,
      name:     `${pick(seed + 2, SS_PREFIXES)}, ${loc}`,
      subtitle: `${cap} MVA capacity`,
      status:   statusFromSeed(seed),
      tag:      `${load}/${cap} MVA`,
      metrics:  [
        { label: 'Feeders',   value: String(rng(seed + 3, 12, 15)) },
        { label: 'Load',      value: `${load} MVA` },
        { label: 'Capacity',  value: `${cap} MVA` },
        { label: 'Voltage',   value: '33/11 kV' },
      ],
      childCount: rng(seed + 3, 12, 15),
      childLabel: 'Feeders',
    };
  });
}

function getFeeders(ssId: string, count: number): GridItem[] {
  return Array.from({ length: count }, (_, i) => {
    const seed   = hashStr(`${ssId}-f-${i}`);
    const length = (rng(seed, 10, 45) / 10).toFixed(1);
    const load   = (rng(seed + 1, 4, 18) / 10).toFixed(2);
    const tag    = pick(seed + 2, FEEDER_TAGS);
    return {
      id:       `${ssId}-f${i}`,
      name:     `Feeder F-${String(i + 1).padStart(2, '0')}`,
      subtitle: `${tag} area`,
      status:   statusFromSeed(seed + 3),
      tag,
      metrics:  [
        { label: 'T-Banks',  value: String(rng(seed + 4, 8, 10)) },
        { label: 'Length',   value: `${length} km` },
        { label: 'Load',     value: `${load} MW` },
        { label: 'Voltage',  value: '11 kV' },
      ],
      childCount: rng(seed + 4, 8, 10),
      childLabel: 'T-Banks',
    };
  });
}

function getTBanks(feederId: string, count: number): GridItem[] {
  return Array.from({ length: count }, (_, i) => {
    const seed  = hashStr(`${feederId}-tb-${i}`);
    const cap   = pick(seed, TBANK_CAPS);
    const capKW = parseInt(cap);
    const load  = rng(seed + 1, Math.round(capKW * 0.4), Math.round(capKW * 0.92));
    const pct   = Math.round((load / capKW) * 100);
    const circs = rng(seed + 2, 1, 3);
    return {
      id:       `${feederId}-tb${i}`,
      name:     `DTR-${String(i + 1).padStart(3, '0')}`,
      subtitle: `Dist. Transformer · ${cap}`,
      status:   pct > 85 ? 'warning' : statusFromSeed(seed + 3),
      tag:      cap,
      metrics:  [
        { label: 'Circuits',  value: String(circs) },
        { label: 'Capacity',  value: cap },
        { label: 'Load',      value: `${load} kW` },
        { label: 'Util.',     value: `${pct}%` },
      ],
      childCount: circs,
      childLabel: 'Circuits',
    };
  });
}

function getCircuits(tbankId: string, count: number): GridItem[] {
  return Array.from({ length: count }, (_, i) => {
    const seed    = hashStr(`${tbankId}-c-${i}`);
    const type    = CIRCUIT_TYPES[i % CIRCUIT_TYPES.length];
    const voltage = type.startsWith('Single') ? 240 : type.includes('HT') ? 11000 : 415;
    const current = rng(seed + 1, 15, 180);
    const assets  = rng(seed + 2, 4, 9);
    return {
      id:       `${tbankId}-c${i}`,
      name:     `Circuit ${['R-Phase', 'Y-Phase', 'B-Phase'][i] ?? `C-${i + 1}`}`,
      subtitle: type,
      status:   statusFromSeed(seed + 4),
      tag:      `${voltage < 1000 ? voltage + ' V' : (voltage / 1000) + ' kV'}`,
      metrics:  [
        { label: 'Assets',   value: String(assets) },
        { label: 'Voltage',  value: `${voltage < 1000 ? voltage + ' V' : (voltage / 1000) + ' kV'}` },
        { label: 'Current',  value: `${current} A` },
        { label: 'Power',    value: `${((voltage * current) / 1000).toFixed(1)} kW` },
      ],
      childCount: assets,
      childLabel: 'Assets',
    };
  });
}

function getAssets(circuitId: string, count: number): AssetItem[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = hashStr(`${circuitId}-a-${i}`);
    const a    = ASSET_TYPES[seed % ASSET_TYPES.length];
    const yr   = rng(seed + 1, 18, 24);
    const mo   = rng(seed + 2, 1, 12);
    const day  = rng(seed + 3, 1, 28);
    return {
      id:          `${circuitId}-a${i}`,
      name:        `${a.type} #${rng(seed + 4, 1000, 9999)}`,
      type:        a.type,
      make:        a.make,
      serialNo:    `SN${rng(seed + 5, 100000, 999999)}`,
      status:      statusFromSeed(seed + 6),
      lastChecked: `${String(day).padStart(2, '0')}/${String(mo).padStart(2, '0')}/20${yr}`,
    };
  });
}

// ─── Status helpers ──────────────────────────────────────────────────────────
const STATUS_COLOR: Record<Status, string> = {
  healthy: '#22C55E',
  warning: '#F59E0B',
  fault:   '#EF4444',
};
const STATUS_LABEL: Record<Status, string> = {
  healthy: 'Healthy',
  warning: 'Warning',
  fault:   'Fault',
};
const STATUS_ICON: Record<Status, React.ReactNode> = {
  healthy: <CheckCircle size={12} />,
  warning: <AlertTriangle size={12} />,
  fault:   <XCircle size={12} />,
};

// ─── Level config ────────────────────────────────────────────────────────────
const LEVEL_ORDER: Level[] = ['zone', 'substation', 'feeder', 'tbank', 'circuit', 'assets'];
const LEVEL_LABEL: Record<Level, string> = {
  zone:       'Zones',
  substation: 'Sub-Stations',
  feeder:     'Feeders',
  tbank:      'T-Banks / DTRs',
  circuit:    'Circuits',
  assets:     'Assets',
};
const LEVEL_ICON: Record<Level, React.ReactNode> = {
  zone:       <MapPin size={14} />,
  substation: <Layers size={14} />,
  feeder:     <Cable size={14} />,
  tbank:      <Zap size={14} />,
  circuit:    <Radio size={14} />,
  assets:     <Cpu size={14} />,
};

// ─── Props ───────────────────────────────────────────────────────────────────
interface GridExplorerPageProps { onBack?: () => void; }

// ─── Component ───────────────────────────────────────────────────────────────
export function GridExplorerPage({ onBack }: GridExplorerPageProps) {
  const { settings } = useTheme();
  const ff      = `var(--md-font-family, ${settings.fontFamily})`;
  const isDark  = settings.darkMode;
  const pri     = settings.primaryColor;
  const sec     = settings.secondaryColor;
  const sp      = getDensitySpacing(settings);

  const bg        = isDark ? '#0a0a0a' : '#e8effc';
  const cardBg    = isDark ? '#1a1a1a' : '#ffffff';
  const border    = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(21,101,192,0.1)';
  const textMain  = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted = isDark ? '#78909c' : '#546e7a';
  const headerBg  = isDark ? '#141414' : '#ffffff';
  const inputBg   = isDark ? 'rgba(255,255,255,0.05)' : '#f4f7ff';

  // ── State ──────────────────────────────────────────────────────────────────
  const [path,     setPath]     = useState<PathItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search,   setSearch]   = useState('');
  const [dir,      setDir]      = useState<1 | -1>(1);
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);

  // ── Derived current level ──────────────────────────────────────────────────
  const currentLevel: Level = path.length === 0 ? 'zone'
    : path.length === 1 ? 'substation'
    : path.length === 2 ? 'feeder'
    : path.length === 3 ? 'tbank'
    : path.length === 4 ? 'circuit'
    : 'assets';

  const nextLevel = LEVEL_ORDER[LEVEL_ORDER.indexOf(currentLevel) + 1] as Level | undefined;

  // ── Generate items for current level ──────────────────────────────────────
  const items: GridItem[] = useMemo(() => {
    if (currentLevel === 'zone')       return ZONES;
    const parentId   = path[path.length - 1].id;
    const grandCount = path[path.length - 1] as any;
    if (currentLevel === 'substation') return getSubstations(path[0].id);
    if (currentLevel === 'feeder') {
      const ss = getSubstations(path[0].id).find(s => s.id === path[1].id)!;
      return getFeeders(parentId, ss?.childCount ?? 12);
    }
    if (currentLevel === 'tbank') {
      const ss    = getSubstations(path[0].id).find(s => s.id === path[1].id)!;
      const feeds = getFeeders(path[1].id, ss?.childCount ?? 12);
      const f     = feeds.find(x => x.id === path[2].id)!;
      return getTBanks(parentId, f?.childCount ?? 9);
    }
    if (currentLevel === 'circuit') {
      const ss  = getSubstations(path[0].id).find(s => s.id === path[1].id)!;
      const fds = getFeeders(path[1].id, ss?.childCount ?? 12);
      const fd  = fds.find(x => x.id === path[2].id)!;
      const tbs = getTBanks(path[2].id, fd?.childCount ?? 9);
      const tb  = tbs.find(x => x.id === path[3].id)!;
      return getCircuits(parentId, tb?.childCount ?? 2);
    }
    return [];
  }, [path, currentLevel]);

  const assets: AssetItem[] = useMemo(() => {
    if (currentLevel !== 'assets') return [];
    const circuitId = path[path.length - 1].id;
    // get child count from parent circuit
    const count = (() => {
      const ss  = getSubstations(path[0].id).find(s => s.id === path[1].id)!;
      const fds = getFeeders(path[1].id, ss?.childCount ?? 12);
      const fd  = fds.find(x => x.id === path[2].id)!;
      const tbs = getTBanks(path[2].id, fd?.childCount ?? 9);
      const tb  = tbs.find(x => x.id === path[3].id)!;
      const cs  = getCircuits(path[3].id, tb?.childCount ?? 2);
      return cs.find(x => x.id === circuitId)?.childCount ?? 6;
    })();
    return getAssets(circuitId, count);
  }, [path, currentLevel]);

  // ── Filtered ───────────────────────────────────────────────────────────────
  const filteredItems = items.filter(it =>
    it.name.toLowerCase().includes(search.toLowerCase()) ||
    (it.subtitle ?? '').toLowerCase().includes(search.toLowerCase())
  );
  const filteredAssets = assets.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase())
  );

  // ── Status counts ──────────────────────────────────────────────────────────
  const counts = useMemo(() => {
    const src = currentLevel === 'assets' ? assets : items;
    return {
      healthy: (src as any[]).filter(x => x.status === 'healthy').length,
      warning: (src as any[]).filter(x => x.status === 'warning').length,
      fault:   (src as any[]).filter(x => x.status === 'fault').length,
      total:   src.length,
    };
  }, [items, assets, currentLevel]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  function drillInto(item: GridItem) {
    if (!nextLevel) return;
    setDir(1);
    setSearch('');
    setPath(p => [...p, { level: currentLevel, id: item.id, name: item.name }]);
  }
  function goUp() {
    setDir(-1);
    setSearch('');
    setPath(p => p.slice(0, -1));
  }
  function goToIndex(i: number) {
    setDir(-1);
    setSearch('');
    setPath(p => p.slice(0, i));
  }

  // ── Animations ─────────────────────────────────────────────────────────────
  const pageKey = path.map(p => p.id).join('/') + currentLevel;
  const variants = {
    initial: (d: number) => ({ x: d * 40, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit:    (d: number) => ({ x: d * -40, opacity: 0 }),
  };

  return (
    <div className="flex flex-col h-full" style={{ background: bg, fontFamily: ff }}>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-4 flex items-center gap-4"
        style={{ background: headerBg, borderBottom: `1px solid ${border}` }}>
        {onBack && (
          <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : `${pri}10`, color: pri }}>
            <ArrowLeft size={16} />
          </motion.button>
        )}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${pri}18` }}>
          <Network size={16} style={{ color: pri }} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 style={{ fontSize: '1rem', fontWeight: 700, color: textMain, lineHeight: 1.2 }}>
            Grid Explorer
          </h1>
          <p style={{ fontSize: '0.72rem', color: textMuted, marginTop: 1 }}>
            Zone → Sub-Station → Feeder → T-Bank → Circuit → Assets
          </p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-xl p-1"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : `${pri}0c` }}>
          {(['grid', 'list'] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: viewMode === m ? (isDark ? 'rgba(255,255,255,0.12)' : `${pri}20`) : 'transparent',
                color: viewMode === m ? pri : textMuted,
              }}>
              {m === 'grid' ? <LayoutGrid size={14} /> : <List size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-2.5 flex items-center gap-1.5 overflow-x-auto"
        style={{ background: headerBg, borderBottom: `1px solid ${border}` }}>

        {/* ── "All Zones" — always first, highlighted when at root ── */}
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
          onClick={() => goToIndex(0)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 transition-colors"
          style={{
            background: path.length === 0 ? `${pri}15` : 'transparent',
            color: path.length === 0 ? pri : textMuted,
            fontSize: '0.72rem', fontWeight: path.length === 0 ? 700 : 500,
          }}>
          All Zones
        </motion.button>

        {/* ── Hierarchy slots: filled when selected, grey placeholder otherwise ── */}
        {[
          { placeholder: 'Zone',        pathIndex: 0 },
          { placeholder: 'Sub-Station', pathIndex: 1 },
          { placeholder: 'Feeder',      pathIndex: 2 },
          { placeholder: 'T-Bank',      pathIndex: 3 },
          { placeholder: 'Circuit',     pathIndex: 4 },
        ].map(({ placeholder, pathIndex }) => {
          const isSelected = path.length > pathIndex;
          const isCurrent  = pathIndex === path.length - 1;
          return (
            <React.Fragment key={placeholder}>
              <ChevronRight size={11} style={{ color: textMuted, flexShrink: 0 }} />
              {isSelected ? (
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                  onClick={() => goToIndex(pathIndex + 1)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 transition-colors max-w-[160px]"
                  style={{
                    background: isCurrent ? `${pri}15` : 'transparent',
                    color: isCurrent ? pri : textMuted,
                    fontSize: '0.72rem', fontWeight: isCurrent ? 700 : 500,
                  }}>
                  <span className="truncate">{path[pathIndex].name}</span>
                </motion.button>
              ) : (
                <span
                  className="px-2.5 py-1 rounded-lg shrink-0"
                  style={{
                    fontSize: '0.72rem',
                    color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)',
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                    border: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  }}>
                  {placeholder}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-3 flex flex-wrap items-center gap-3">
        {/* Back button */}
        {path.length > 0 && (
          <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}
            onClick={goUp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : `${pri}0c`,
              color: textMuted, fontSize: '0.72rem', fontWeight: 600 }}>
            <ArrowLeft size={13} />
            {path.length >= 2 ? path[path.length - 2].name : 'All Zones'}
          </motion.button>
        )}
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: inputBg, border: `1.5px solid ${border}`, maxWidth: 320 }}>
          <Search size={13} style={{ color: textMuted, flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${LEVEL_LABEL[currentLevel].toLowerCase()}…`}
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: '0.78rem', color: textMain, fontFamily: ff }} />
        </div>
        <div className="flex-1" />
        {/* Status pills */}
        {[
          { key: 'healthy', color: '#22C55E', label: 'Healthy' },
          { key: 'warning', color: '#F59E0B', label: 'Warning' },
          { key: 'fault',   color: '#EF4444', label: 'Fault'   },
        ].map(s => (
          <div key={s.key} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: `${s.color}15`, fontSize: '0.68rem', fontWeight: 600, color: s.color }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color }} />
            {counts[s.key as Status]} {s.label}
          </div>
        ))}
        <span style={{ fontSize: '0.68rem', color: textMuted, fontWeight: 500 }}>
          {counts.total} total
        </span>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={pageKey}
            custom={dir}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >

            {/* ── Assets level ───────────────────────────────────────── */}
            {currentLevel === 'assets' ? (
              <div className="flex flex-col gap-2">
                {filteredAssets.length === 0 ? (
                  <EmptyState label="No assets found" isDark={isDark} textMuted={textMuted} />
                ) : filteredAssets.map((a, i) => (
                  <motion.div key={a.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ x: 3, boxShadow: `0 4px 16px ${pri}18` }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedAsset(a)}
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer"
                    style={{ background: cardBg, border: `1px solid ${border}`, borderLeft: `3px solid ${STATUS_COLOR[a.status]}` }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${pri}12` }}>
                      <Cpu size={15} style={{ color: pri }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="truncate" style={{ fontSize: '0.82rem', fontWeight: 600, color: textMain }}>{a.name}</span>
                        <StatusBadge status={a.status} />
                      </div>
                      <span style={{ fontSize: '0.68rem', color: textMuted }}>{a.type} · {a.make}</span>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
                      <span style={{ fontSize: '0.65rem', color: textMuted }}>S/N {a.serialNo}</span>
                      <span style={{ fontSize: '0.625rem', color: textMuted }}>Checked {a.lastChecked}</span>
                    </div>
                    <ChevronRight size={14} style={{ color: textMuted, flexShrink: 0 }} />
                  </motion.div>
                ))}
              </div>
            ) : viewMode === 'grid' ? (

              /* ── Grid view ──────────────────────────────────────────── */
              <div className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {filteredItems.length === 0 ? (
                  <div className="col-span-full">
                    <EmptyState label={`No ${LEVEL_LABEL[currentLevel].toLowerCase()} found`} isDark={isDark} textMuted={textMuted} />
                  </div>
                ) : filteredItems.map((item, i) => (
                  <GridCard key={item.id} item={item} index={i}
                    nextLevel={nextLevel}
                    isDark={isDark} pri={pri} sec={sec}
                    cardBg={cardBg} border={border} textMain={textMain} textMuted={textMuted}
                    ff={ff}
                    onClick={() => drillInto(item)}
                  />
                ))}
              </div>

            ) : (
              /* ── List view ──────────────────────────────────────────── */
              <div className="flex flex-col gap-2">
                {filteredItems.length === 0 ? (
                  <EmptyState label={`No ${LEVEL_LABEL[currentLevel].toLowerCase()} found`} isDark={isDark} textMuted={textMuted} />
                ) : filteredItems.map((item, i) => (
                  <ListRow key={item.id} item={item} index={i}
                    nextLevel={nextLevel}
                    isDark={isDark} pri={pri}
                    cardBg={cardBg} border={border} textMain={textMain} textMuted={textMuted}
                    ff={ff}
                    onClick={() => drillInto(item)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Asset Profile Slide-over ────────────────────────────────────── */}
      <AnimatePresence>
        {selectedAsset && (
          <AssetProfilePanel
            asset={selectedAsset}
            profile={buildAssetProfile(selectedAsset, path)}
            onClose={() => setSelectedAsset(null)}
            isDark={isDark} pri={pri} sec={sec}
            cardBg={cardBg} border={border}
            textMain={textMain} textMuted={textMuted} ff={ff}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const color = STATUS_COLOR[status];
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0"
      style={{ background: `${color}18`, color, fontSize: '0.625rem', fontWeight: 700 }}>
      {STATUS_ICON[status]}
      {STATUS_LABEL[status]}
    </span>
  );
}

interface CardProps {
  item: GridItem; index: number; nextLevel?: Level;
  isDark: boolean; pri: string; sec: string;
  cardBg: string; border: string; textMain: string; textMuted: string; ff: string;
  onClick: () => void;
}

function GridCard({ item, index, nextLevel, isDark, pri, sec, cardBg, border, textMain, textMuted, ff, onClick }: CardProps) {
  const statusColor = STATUS_COLOR[item.status];
  const canDrill = !!nextLevel;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={canDrill ? { y: -2, boxShadow: `0 8px 24px ${pri}18` } : {}}
      whileTap={canDrill ? { scale: 0.98 } : {}}
      onClick={canDrill ? onClick : undefined}
      className="flex flex-col rounded-2xl overflow-hidden transition-shadow"
      style={{ background: cardBg, border: `1.5px solid ${border}`, cursor: canDrill ? 'pointer' : 'default' }}
    >
      {/* Status bar */}
      <div className="h-1 w-full shrink-0" style={{ background: statusColor }} />

      <div className="flex flex-col gap-3 p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="truncate" style={{ fontSize: '0.88rem', fontWeight: 700, color: textMain, fontFamily: ff }}>
                {item.name}
              </span>
            </div>
            {item.subtitle && (
              <span style={{ fontSize: '0.68rem', color: textMuted }}>{item.subtitle}</span>
            )}
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2">
          {item.metrics.map(m => (
            <div key={m.label} className="flex flex-col gap-0.5 px-2.5 py-2 rounded-xl"
              style={{ background: isDark ? 'rgba(255,255,255,0.04)' : `${pri}06` }}>
              <span style={{ fontSize: '0.625rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: textMain, fontFamily: ff }}>{m.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        {canDrill && (
          <div className="flex items-center justify-between pt-1"
            style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(21,101,192,0.08)'}` }}>
            {item.tag && (
              <span className="px-2 py-0.5 rounded-full"
                style={{ fontSize: '0.625rem', fontWeight: 600,
                  background: `${pri}12`, color: pri }}>
                {item.tag}
              </span>
            )}
            <div className="flex items-center gap-1 ml-auto"
              style={{ fontSize: '0.7rem', fontWeight: 600, color: pri }}>
              <span>{item.childCount} {item.childLabel}</span>
              <ChevronRight size={13} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface RowProps {
  item: GridItem; index: number; nextLevel?: Level;
  isDark: boolean; pri: string;
  cardBg: string; border: string; textMain: string; textMuted: string; ff: string;
  onClick: () => void;
}

function ListRow({ item, index, nextLevel, isDark, pri, cardBg, border, textMain, textMuted, ff, onClick }: RowProps) {
  const statusColor = STATUS_COLOR[item.status];
  const canDrill = !!nextLevel;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.025 }}
      whileHover={canDrill ? { x: 3 } : {}}
      whileTap={canDrill ? { scale: 0.99 } : {}}
      onClick={canDrill ? onClick : undefined}
      className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-shadow"
      style={{ background: cardBg, border: `1.5px solid ${border}`,
        cursor: canDrill ? 'pointer' : 'default',
        borderLeft: `3px solid ${statusColor}` }}
    >
      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="truncate" style={{ fontSize: '0.82rem', fontWeight: 600, color: textMain, fontFamily: ff }}>
            {item.name}
          </span>
          <StatusBadge status={item.status} />
        </div>
        {item.subtitle && (
          <span style={{ fontSize: '0.68rem', color: textMuted }}>{item.subtitle}</span>
        )}
      </div>

      {/* Metrics row */}
      <div className="hidden md:flex items-center gap-4 shrink-0">
        {item.metrics.slice(0, 3).map(m => (
          <div key={m.label} className="flex flex-col items-end gap-0.5">
            <span style={{ fontSize: '0.625rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* Drill arrow */}
      {canDrill && (
        <div className="flex items-center gap-1 shrink-0"
          style={{ color: pri, fontSize: '0.7rem', fontWeight: 600 }}>
          <span className="hidden sm:inline">{item.childCount} {item.childLabel}</span>
          <ChevronRight size={15} />
        </div>
      )}
    </motion.div>
  );
}

function EmptyState({ label, isDark, textMuted }: { label: string; isDark: boolean; textMuted: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(21,101,192,0.06)' }}>
        <Search size={20} style={{ color: textMuted }} />
      </div>
      <span style={{ fontSize: '0.82rem', color: textMuted }}>{label}</span>
    </div>
  );
}

// ─── Extended asset profile data ────────────────────────────────────────────
interface FaultLog { date: string; code: string; description: string; resolved: boolean; }
interface AssetProfile {
  installDate: string;
  warrantyExpiry: string;
  ageYears: number;
  ratedVoltage: string;
  ratedCurrent: string;
  ratedCapacity: string;
  ipRating: string;
  protectionClass: string;
  powerFactor: string;
  frequency: string;
  energyConsumed: string;
  temperature: string;
  healthScore: number;
  nextMaintenanceDate: string;
  maintenanceCrew: string;
  faultLogs: FaultLog[];
  location: { zone: string; substation: string; feeder: string; tbank: string; circuit: string };
}

const FAULT_DESCS = [
  'Overvoltage detected on primary terminal',
  'Insulation resistance below threshold (< 1 MΩ)',
  'Thermal trip — sustained overload > 120%',
  'Earth fault detected, isolator opened',
  'Communication loss with SCADA node',
  'Surge arrestor flashover event logged',
  'Phase imbalance > 15% reported',
  'Partial discharge readings elevated',
];
const FAULT_CODES = ['OVP-01', 'INS-03', 'THR-07', 'EF-02', 'COM-05', 'SA-04', 'PI-08', 'PD-06'];
const CREWS = ['Crew Alpha – Sector North', 'Crew Beta – Sector South', 'Crew Gamma – GN West', 'Crew Delta – GN East'];
const IP_RATINGS = ['IP54', 'IP55', 'IP65', 'IP67'];
const PROT_CLASS = ['Class I', 'Class II', 'Class II+'];

function buildAssetProfile(asset: AssetItem, path: PathItem[]): AssetProfile {
  const seed = hashStr(asset.id);
  const instYr = rng(seed + 10, 2015, 2022);
  const instMo = rng(seed + 11, 1, 12);
  const instDay = rng(seed + 12, 1, 28);
  const age = 2026 - instYr;
  const warrantyYrs = pick(seed + 13, [3, 5, 7]);
  const warrantyExpYr = instYr + warrantyYrs;
  const healthScore = asset.status === 'fault' ? rng(seed + 14, 28, 45)
    : asset.status === 'warning' ? rng(seed + 15, 55, 74)
    : rng(seed + 16, 82, 98);
  const nextMoNum = rng(seed + 17, 1, 12);
  const nextMoDay = rng(seed + 18, 1, 28);
  const faultCount = asset.status === 'fault' ? rng(seed + 20, 2, 3)
    : asset.status === 'warning' ? 1 : 0;
  const faultLogs: FaultLog[] = Array.from({ length: faultCount }, (_, i) => {
    const fs = hashStr(`${asset.id}-fault-${i}`);
    const fy = rng(fs, 2023, 2025);
    const fm = rng(fs + 1, 1, 12);
    const fd = rng(fs + 2, 1, 28);
    return {
      date: `${String(fd).padStart(2,'0')}/${String(fm).padStart(2,'0')}/${fy}`,
      code: pick(fs + 3, FAULT_CODES),
      description: pick(fs + 4, FAULT_DESCS),
      resolved: i < faultCount - 1 || asset.status !== 'fault',
    };
  });
  const voltageMap: Record<string, string> = {
    'Smart Energy Meter': '240 V / 415 V',
    'CT/PT Set': '11 kV / 33 kV',
    'Load Break Switch': '11 kV',
    'Isolator': '33 kV',
    'Surge Arrester': '11 kV',
    'Service Cable': '415 V',
    'Distribution Box': '415 V',
    'Capacitor Bank': '11 kV',
  };
  const currentMap: Record<string, string> = {
    'Smart Energy Meter': '5–100 A',
    'CT/PT Set': '200/5 A',
    'Load Break Switch': '630 A',
    'Isolator': '400 A',
    'Surge Arrester': '10 kA (8/20 µs)',
    'Service Cable': '300 A',
    'Distribution Box': '250 A',
    'Capacitor Bank': '50 kVAR',
  };
  return {
    installDate: `${String(instDay).padStart(2,'0')}/${String(instMo).padStart(2,'0')}/${instYr}`,
    warrantyExpiry: `${String(instDay).padStart(2,'0')}/${String(instMo).padStart(2,'0')}/${warrantyExpYr}`,
    ageYears: age,
    ratedVoltage: voltageMap[asset.type] ?? '415 V',
    ratedCurrent: currentMap[asset.type] ?? '100 A',
    ratedCapacity: `${rng(seed + 30, 50, 630)} kVA`,
    ipRating: pick(seed + 31, IP_RATINGS),
    protectionClass: pick(seed + 32, PROT_CLASS),
    powerFactor: `${(rng(seed + 33, 88, 99) / 100).toFixed(2)} lag`,
    frequency: '50 Hz',
    energyConsumed: `${rng(seed + 34, 1200, 9800).toLocaleString()} kWh`,
    temperature: `${rng(seed + 35, 32, 67)}°C`,
    healthScore,
    nextMaintenanceDate: `${String(nextMoDay).padStart(2,'0')}/${String(nextMoNum).padStart(2,'0')}/2026`,
    maintenanceCrew: pick(seed + 36, CREWS),
    faultLogs,
    location: {
      zone:        path[0]?.name ?? '—',
      substation:  path[1]?.name ?? '—',
      feeder:      path[2]?.name ?? '—',
      tbank:       path[3]?.name ?? '—',
      circuit:     path[4]?.name ?? '—',
    },
  };
}

function AssetProfilePanel({ asset, profile, onClose, isDark, pri, sec, cardBg, border, textMain, textMuted, ff }: {
  asset: AssetItem;
  profile: AssetProfile;
  onClose: () => void;
  isDark: boolean;
  pri: string;
  sec: string;
  cardBg: string;
  border: string;
  textMain: string;
  textMuted: string;
  ff: string;
}) {
  const panelBg   = isDark ? '#111111' : '#f4f7ff';
  const sectionBg = isDark ? '#1a1a1a' : '#ffffff';
  const hdrBg     = isDark ? '#141414' : '#ffffff';
  const statusColor = STATUS_COLOR[asset.status];
  const hs = profile.healthScore;
  const hsColor = hs >= 80 ? '#22C55E' : hs >= 55 ? '#F59E0B' : '#EF4444';
  const circumference = 2 * Math.PI * 22;
  const dash = (hs / 100) * circumference;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
      />
      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
        style={{ width: 420, maxWidth: '100vw', background: panelBg, fontFamily: ff,
          boxShadow: '-8px 0 40px rgba(0,0,0,0.25)' }}
      >
        {/* ── Header ───────────────────────────────────────────���─────── */}
        <div className="shrink-0 px-5 py-4 flex items-center gap-3"
          style={{ background: hdrBg, borderBottom: `1px solid ${border}` }}>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: isDark ? 'rgba(255,255,255,0.07)' : `${pri}10`, color: pri }}>
            <X size={15} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: '0.625rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 1 }}>Asset Profile</p>
            <h2 className="truncate" style={{ fontSize: '0.92rem', fontWeight: 700, color: textMain }}>{asset.name}</h2>
          </div>
          <StatusBadge status={asset.status} />
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* Hero card */}
          <div className="mx-4 mt-4 rounded-2xl overflow-hidden"
            style={{ background: sectionBg, border: `1.5px solid ${border}` }}>
            <div className="h-1" style={{ background: statusColor }} />
            <div className="px-5 py-4 flex items-center gap-4">
              {/* Health score ring */}
              <div className="relative shrink-0 flex items-center justify-center" style={{ width: 64, height: 64 }}>
                <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="32" cy="32" r="22" fill="none"
                    stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="6" />
                  <circle cx="32" cy="32" r="22" fill="none"
                    stroke={hsColor} strokeWidth="6"
                    strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" />
                </svg>
                <span className="absolute" style={{ fontSize: '0.78rem', fontWeight: 800, color: hsColor }}>{hs}</span>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: textMain }}>{asset.type}</span>
                  <span className="px-2 py-0.5 rounded-full"
                    style={{ fontSize: '0.625rem', fontWeight: 600, background: `${pri}12`, color: pri }}>{asset.make}</span>
                </div>
                <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>S/N {asset.serialNo}</p>
                <p style={{ fontSize: '0.65rem', color: textMuted, marginTop: 1 }}>
                  Health Score · <span style={{ color: hsColor, fontWeight: 600 }}>{hs >= 80 ? 'Excellent' : hs >= 55 ? 'Fair' : 'Critical'}</span>
                </p>
              </div>
            </div>
            {/* Location breadcrumb */}
            <div className="px-5 pb-4 flex items-center gap-1 flex-wrap"
              style={{ borderTop: `1px solid ${border}`, paddingTop: 10 }}>
              {[
                { label: profile.location.zone,       icon: <MapPin size={9} /> },
                { label: profile.location.substation, icon: <Layers size={9} /> },
                { label: profile.location.feeder,     icon: <Cable size={9} /> },
                { label: profile.location.tbank,      icon: <Zap size={9} /> },
                { label: profile.location.circuit,    icon: <Radio size={9} /> },
              ].filter(l => l.label !== '—').map((l, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight size={9} style={{ color: textMuted, flexShrink: 0 }} />}
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                    style={{ fontSize: '0.625rem', color: textMuted, background: isDark ? 'rgba(255,255,255,0.05)' : `${pri}08` }}>
                    {l.icon} {l.label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── Identity & Lifecycle ─────────────────────────────────── */}
          <SectionLabel label="Identity & Lifecycle" textMuted={textMuted} />
          <InfoGrid isDark={isDark} pri={pri} border={border} sectionBg={sectionBg}
            textMain={textMain} textMuted={textMuted} items={[
              { icon: <Hash size={13} />,      label: 'Serial No.',      value: asset.serialNo },
              { icon: <Tag size={13} />,       label: 'Make / Model',    value: asset.make },
              { icon: <Calendar size={13} />,  label: 'Install Date',    value: profile.installDate },
              { icon: <Activity size={13} />,  label: 'Age',             value: `${profile.ageYears} yrs` },
              { icon: <Shield size={13} />,    label: 'Warranty Expiry', value: profile.warrantyExpiry },
              { icon: <FileText size={13} />,  label: 'Asset Type',      value: asset.type },
            ]} />

          {/* ── Electrical Specifications ───────────────────────────── */}
          <SectionLabel label="Electrical Specifications" textMuted={textMuted} />
          <InfoGrid isDark={isDark} pri={pri} border={border} sectionBg={sectionBg}
            textMain={textMain} textMuted={textMuted} items={[
              { icon: <Zap size={13} />,       label: 'Rated Voltage',   value: profile.ratedVoltage },
              { icon: <Gauge size={13} />,     label: 'Rated Current',   value: profile.ratedCurrent },
              { icon: <BarChart2 size={13} />, label: 'Rated Capacity',  value: profile.ratedCapacity },
              { icon: <Activity size={13} />,  label: 'Power Factor',    value: profile.powerFactor },
              { icon: <Radio size={13} />,     label: 'Frequency',       value: profile.frequency },
              { icon: <Cpu size={13} />,       label: 'Energy Consumed', value: profile.energyConsumed },
            ]} />

          {/* ── Physical & Environment ──────────────────────────────── */}
          <SectionLabel label="Physical & Environment" textMuted={textMuted} />
          <InfoGrid isDark={isDark} pri={pri} border={border} sectionBg={sectionBg}
            textMain={textMain} textMuted={textMuted} items={[
              { icon: <Thermometer size={13} />, label: 'Temperature',      value: profile.temperature },
              { icon: <Shield size={13} />,      label: 'IP Rating',        value: profile.ipRating },
              { icon: <Shield size={13} />,      label: 'Protection Class', value: profile.protectionClass },
              { icon: <Info size={13} />,        label: 'Last Checked',     value: asset.lastChecked },
            ]} />

          {/* ── Maintenance ─────────────────────────────────────────── */}
          <SectionLabel label="Maintenance" textMuted={textMuted} />
          <div className="mx-4 rounded-2xl overflow-hidden"
            style={{ background: sectionBg, border: `1.5px solid ${border}` }}>
            <div className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: `1px solid ${border}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${sec}15` }}>
                <Wrench size={13} style={{ color: sec }} />
              </div>
              <div>
                <p style={{ fontSize: '0.625rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Scheduled</p>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: textMain }}>{profile.nextMaintenanceDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${sec}15` }}>
                <ClipboardList size={13} style={{ color: sec }} />
              </div>
              <div>
                <p style={{ fontSize: '0.625rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Crew</p>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: textMain }}>{profile.maintenanceCrew}</p>
              </div>
            </div>
          </div>

          {/* ── Fault Log ───────────────────────────────────────────── */}
          <SectionLabel label={`Fault Log (${profile.faultLogs.length})`} textMuted={textMuted} />
          <div className="mx-4 mb-6 rounded-2xl overflow-hidden"
            style={{ background: sectionBg, border: `1.5px solid ${border}` }}>
            {profile.faultLogs.length === 0 ? (
              <div className="flex items-center gap-3 px-4 py-4">
                <CheckCircle size={16} style={{ color: '#22C55E', flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: '#22C55E', fontWeight: 600 }}>No fault history — asset is operating normally</span>
              </div>
            ) : profile.faultLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3"
                style={{ borderBottom: i < profile.faultLogs.length - 1 ? `1px solid ${border}` : undefined }}>
                <div className="flex flex-col items-center gap-1 mt-0.5 shrink-0">
                  <div className="w-2 h-2 rounded-full" style={{ background: log.resolved ? '#22C55E' : '#EF4444' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded-md"
                      style={{ fontSize: '0.625rem', fontWeight: 700,
                        background: log.resolved ? '#22C55E18' : '#EF444418',
                        color: log.resolved ? '#22C55E' : '#EF4444' }}>
                      {log.code}
                    </span>
                    <span style={{ fontSize: '0.625rem', color: textMuted }}>{log.date}</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded-md"
                      style={{ fontSize: '0.625rem', fontWeight: 600,
                        background: log.resolved ? '#22C55E18' : '#EF444418',
                        color: log.resolved ? '#22C55E' : '#EF4444' }}>
                      {log.resolved ? 'Resolved' : 'Active'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: textMain }}>{log.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </motion.div>
    </>
  );
}

function SectionLabel({ label, textMuted }: { label: string; textMuted: string }) {
  return (
    <p className="px-5 pt-4 pb-1.5"
      style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted,
        textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {label}
    </p>
  );
}

function InfoGrid({ items, isDark, pri, border, sectionBg, textMain, textMuted }: {
  items: { icon: React.ReactNode; label: string; value: string }[];
  isDark: boolean; pri: string; border: string;
  sectionBg: string; textMain: string; textMuted: string;
}) {
  return (
    <div className="mx-4 rounded-2xl overflow-hidden"
      style={{ background: sectionBg, border: `1.5px solid ${border}` }}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2.5"
          style={{ borderBottom: i < items.length - 1 ? `1px solid ${border}` : undefined }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${pri}10`, color: pri }}>
            {item.icon}
          </div>
          <span style={{ fontSize: '0.72rem', color: textMuted, flex: '0 0 110px' }}>{item.label}</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: textMain, flex: 1, textAlign: 'right' }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}