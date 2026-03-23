import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ArrowLeft, Search, Cpu, Zap, GitBranch, Radio, X,
  AlertTriangle, CheckCircle, Clock, WifiOff, ChevronRight,
  MapPin, Layers, SlidersHorizontal, Activity, Shield, Wrench,
  Navigation, Calendar, Hash, Tag, BarChart2, Info, Send, ClipboardList,
} from 'lucide-react';
import { useTheme, getDensitySpacing, getPrimaryBg } from '../context/ThemeContext';
import { toast } from 'sonner';

// ── Types ────────────────────────────────────────────────────────────────────
type AssetType   = 'Transformer' | 'Substation' | 'Feeder' | 'SmartMeter';
type AssetStatus = 'Active' | 'Faulty' | 'Offline' | 'Maintenance';

interface GridAsset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  lat: number;
  lng: number;
  capacity: string;
  voltage: string;
  zone: string;
  lastInspection: string;
  age: number;
}

// ── Full asset dataset ────────────────────────────────────────────────────────
const ASSETS: GridAsset[] = [
  // SUBSTATIONS ─────────────────────────────────────────────────────────────
  { id:'SS-001', name:'Noida 220/33kV Grid S/S',           type:'Substation', status:'Active',      lat:28.627, lng:77.378, capacity:'220 kV',     voltage:'220/33 kV', zone:'Zone B',   lastInspection:'15 Jan 2026', age:12 },
  { id:'SS-002', name:'Dadri 400/220kV Transmission S/S',  type:'Substation', status:'Active',      lat:28.568, lng:77.548, capacity:'400 kV',     voltage:'400/220 kV',zone:'Zone E',   lastInspection:'20 Feb 2026', age:18 },
  { id:'SS-003', name:'Sector 50 33/11kV S/S',             type:'Substation', status:'Active',      lat:28.571, lng:77.370, capacity:'16 MVA',     voltage:'33/11 kV',  zone:'Zone B',   lastInspection:'10 Mar 2026', age:8  },
  { id:'SS-004', name:'Sector 37 33/11kV S/S',             type:'Substation', status:'Maintenance', lat:28.548, lng:77.338, capacity:'10 MVA',     voltage:'33/11 kV',  zone:'Zone A',   lastInspection:'05 Mar 2026', age:14 },
  { id:'SS-005', name:'Greater Noida West 33/11kV S/S',    type:'Substation', status:'Active',      lat:28.457, lng:77.465, capacity:'20 MVA',     voltage:'33/11 kV',  zone:'Zone D',   lastInspection:'12 Feb 2026', age:5  },
  { id:'SS-006', name:'Knowledge Park 33/11kV S/S',        type:'Substation', status:'Active',      lat:28.474, lng:77.493, capacity:'16 MVA',     voltage:'33/11 kV',  zone:'Zone D',   lastInspection:'08 Jan 2026', age:7  },
  { id:'SS-007', name:'Kasna 33/11kV S/S',                 type:'Substation', status:'Active',      lat:28.506, lng:77.527, capacity:'20 MVA',     voltage:'33/11 kV',  zone:'Zone E',   lastInspection:'25 Feb 2026', age:9  },
  { id:'SS-008', name:'Surajpur 33/11kV S/S',              type:'Substation', status:'Active',      lat:28.526, lng:77.503, capacity:'25 MVA',     voltage:'33/11 kV',  zone:'Zone E',   lastInspection:'01 Mar 2026', age:11 },
  { id:'SS-009', name:'Sector 125 33/11kV S/S',            type:'Substation', status:'Active',      lat:28.536, lng:77.389, capacity:'16 MVA',     voltage:'33/11 kV',  zone:'Zone C',   lastInspection:'18 Jan 2026', age:4  },
  { id:'SS-010', name:'Noida Expressway 33/11kV S/S',      type:'Substation', status:'Active',      lat:28.501, lng:77.413, capacity:'20 MVA',     voltage:'33/11 kV',  zone:'Zone C',   lastInspection:'22 Feb 2026', age:6  },
  { id:'SS-011', name:'Sector 18 Commercial 33/11kV S/S',  type:'Substation', status:'Active',      lat:28.570, lng:77.320, capacity:'25 MVA',     voltage:'33/11 kV',  zone:'Zone A',   lastInspection:'14 Mar 2026', age:15 },
  { id:'SS-012', name:'Sector 62 IT Park 33/11kV S/S',     type:'Substation', status:'Faulty',      lat:28.618, lng:77.369, capacity:'20 MVA',     voltage:'33/11 kV',  zone:'Zone B',   lastInspection:'28 Feb 2026', age:10 },
  { id:'SS-013', name:'Pari Chowk 33/11kV S/S',            type:'Substation', status:'Active',      lat:28.478, lng:77.504, capacity:'16 MVA',     voltage:'33/11 kV',  zone:'Zone D',   lastInspection:'07 Mar 2026', age:8  },
  { id:'SS-014', name:'Delta-1 33/11kV S/S',               type:'Substation', status:'Active',      lat:28.491, lng:77.520, capacity:'10 MVA',     voltage:'33/11 kV',  zone:'Zone E',   lastInspection:'19 Jan 2026', age:6  },
  { id:'SS-015', name:'Sector 10 33/11kV S/S',             type:'Substation', status:'Active',      lat:28.593, lng:77.314, capacity:'16 MVA',     voltage:'33/11 kV',  zone:'Zone A',   lastInspection:'11 Feb 2026', age:20 },
  { id:'SS-016', name:'Aqua Line Metro 33/11kV S/S',       type:'Substation', status:'Active',      lat:28.533, lng:77.420, capacity:'25 MVA',     voltage:'33/11 kV',  zone:'Zone C',   lastInspection:'03 Mar 2026', age:3  },
  { id:'SS-017', name:'Sector 76 33/11kV S/S',             type:'Substation', status:'Active',      lat:28.559, lng:77.388, capacity:'16 MVA',     voltage:'33/11 kV',  zone:'Zone B',   lastInspection:'27 Jan 2026', age:7  },
  { id:'SS-018', name:'Bisrakh 33/11kV S/S',               type:'Substation', status:'Active',      lat:28.469, lng:77.440, capacity:'10 MVA',     voltage:'33/11 kV',  zone:'Zone D',   lastInspection:'16 Feb 2026', age:9  },
  { id:'SS-019', name:'Rabupura 33/11kV S/S',              type:'Substation', status:'Maintenance', lat:28.449, lng:77.511, capacity:'10 MVA',     voltage:'33/11 kV',  zone:'Zone E',   lastInspection:'09 Mar 2026', age:13 },
  { id:'SS-020', name:'Sector 96 33/11kV S/S',             type:'Substation', status:'Active',      lat:28.513, lng:77.386, capacity:'20 MVA',     voltage:'33/11 kV',  zone:'Zone C',   lastInspection:'21 Feb 2026', age:5  },
  // TRANSFORMERS ──────────────────────────────────────────────────────────────
  { id:'TR-001', name:'DTR Sector-18 / Block A',           type:'Transformer', status:'Active',      lat:28.572, lng:77.324, capacity:'100 kVA',   voltage:'11/0.4 kV', zone:'Zone A',   lastInspection:'12 Jan 2026', age:8  },
  { id:'TR-002', name:'DTR Sector-37 / Main Market',       type:'Transformer', status:'Faulty',      lat:28.545, lng:77.340, capacity:'250 kVA',   voltage:'11/0.4 kV', zone:'Zone A',   lastInspection:'02 Mar 2026', age:12 },
  { id:'TR-003', name:'DTR Sector-50 / Residential',       type:'Transformer', status:'Active',      lat:28.573, lng:77.368, capacity:'100 kVA',   voltage:'11/0.4 kV', zone:'Zone B',   lastInspection:'18 Feb 2026', age:6  },
  { id:'TR-004', name:'DTR Sector-62 / IT Cluster',        type:'Transformer', status:'Active',      lat:28.614, lng:77.372, capacity:'500 kVA',   voltage:'11/0.4 kV', zone:'Zone B',   lastInspection:'25 Jan 2026', age:5  },
  { id:'TR-005', name:'DTR Expressway / Logistic Park',    type:'Transformer', status:'Active',      lat:28.497, lng:77.408, capacity:'630 kVA',   voltage:'11/0.4 kV', zone:'Zone C',   lastInspection:'10 Feb 2026', age:4  },
  { id:'TR-006', name:'DTR GN West / Residential Block',   type:'Transformer', status:'Active',      lat:28.461, lng:77.462, capacity:'250 kVA',   voltage:'11/0.4 kV', zone:'Zone D',   lastInspection:'06 Mar 2026', age:3  },
  { id:'TR-007', name:'DTR Knowledge Park / University',   type:'Transformer', status:'Active',      lat:28.471, lng:77.490, capacity:'500 kVA',   voltage:'11/0.4 kV', zone:'Zone D',   lastInspection:'14 Jan 2026', age:7  },
  { id:'TR-008', name:'DTR Kasna / Industrial Phase-II',   type:'Transformer', status:'Maintenance', lat:28.503, lng:77.530, capacity:'630 kVA',   voltage:'11/0.4 kV', zone:'Zone E',   lastInspection:'28 Jan 2026', age:10 },
  { id:'TR-009', name:'DTR Surajpur / EPIP Zone',          type:'Transformer', status:'Active',      lat:28.529, lng:77.498, capacity:'500 kVA',   voltage:'11/0.4 kV', zone:'Zone E',   lastInspection:'22 Feb 2026', age:8  },
  { id:'TR-010', name:'DTR Sector-10 / Colony Blocks',     type:'Transformer', status:'Active',      lat:28.596, lng:77.311, capacity:'100 kVA',   voltage:'11/0.4 kV', zone:'Zone A',   lastInspection:'17 Mar 2026', age:18 },
  { id:'TR-011', name:'DTR Sector-76 / Mixed Use',         type:'Transformer', status:'Active',      lat:28.556, lng:77.391, capacity:'250 kVA',   voltage:'11/0.4 kV', zone:'Zone B',   lastInspection:'04 Feb 2026', age:6  },
  { id:'TR-012', name:'DTR Bisrakh / Township',            type:'Transformer', status:'Active',      lat:28.472, lng:77.443, capacity:'250 kVA',   voltage:'11/0.4 kV', zone:'Zone D',   lastInspection:'13 Mar 2026', age:4  },
  { id:'TR-013', name:'DTR Sector-125 / Commercial Hub',   type:'Transformer', status:'Active',      lat:28.539, lng:77.383, capacity:'100 kVA',   voltage:'11/0.4 kV', zone:'Zone C',   lastInspection:'01 Jan 2026', age:3  },
  { id:'TR-014', name:'DTR Delta-1 / Residential',         type:'Transformer', status:'Active',      lat:28.488, lng:77.517, capacity:'100 kVA',   voltage:'11/0.4 kV', zone:'Zone E',   lastInspection:'09 Feb 2026', age:5  },
  { id:'TR-015', name:'DTR Pari Chowk / Market Complex',   type:'Transformer', status:'Active',      lat:28.480, lng:77.502, capacity:'250 kVA',   voltage:'11/0.4 kV', zone:'Zone D',   lastInspection:'20 Mar 2026', age:7  },
  { id:'TR-016', name:'DTR Sector-96 / High-rise Cluster', type:'Transformer', status:'Faulty',      lat:28.510, lng:77.390, capacity:'500 kVA',   voltage:'11/0.4 kV', zone:'Zone C',   lastInspection:'15 Mar 2026', age:4  },
  { id:'TR-017', name:'DTR Sector-37 / School Zone',       type:'Transformer', status:'Active',      lat:28.551, lng:77.343, capacity:'100 kVA',   voltage:'11/0.4 kV', zone:'Zone A',   lastInspection:'23 Jan 2026', age:11 },
  { id:'TR-018', name:'DTR Aqua Line / Metro Depot',       type:'Transformer', status:'Active',      lat:28.530, lng:77.415, capacity:'630 kVA',   voltage:'11/0.4 kV', zone:'Zone C',   lastInspection:'11 Mar 2026', age:3  },
  // FEEDERS ──────────────────────────────────────────────────────────────────
  { id:'FD-001', name:'Feeder F-01 — Sec-18 Main',         type:'Feeder', status:'Active',      lat:28.568, lng:77.321, capacity:'11 kV', voltage:'11 kV', zone:'Zone A', lastInspection:'08 Mar 2026', age:10 },
  { id:'FD-002', name:'Feeder F-02 — Sec-37 Ring',         type:'Feeder', status:'Faulty',      lat:28.544, lng:77.335, capacity:'11 kV', voltage:'11 kV', zone:'Zone A', lastInspection:'12 Mar 2026', age:14 },
  { id:'FD-003', name:'Feeder F-03 — Sec-50 Express',      type:'Feeder', status:'Active',      lat:28.576, lng:77.372, capacity:'11 kV', voltage:'11 kV', zone:'Zone B', lastInspection:'03 Feb 2026', age:8  },
  { id:'FD-004', name:'Feeder F-04 — Expressway Spur',     type:'Feeder', status:'Active',      lat:28.503, lng:77.406, capacity:'33 kV', voltage:'33 kV', zone:'Zone C', lastInspection:'15 Jan 2026', age:6  },
  { id:'FD-005', name:'Feeder F-05 — GN West Trunk',       type:'Feeder', status:'Active',      lat:28.455, lng:77.468, capacity:'33 kV', voltage:'33 kV', zone:'Zone D', lastInspection:'26 Feb 2026', age:5  },
  { id:'FD-006', name:'Feeder F-06 — Kasna Industrial',    type:'Feeder', status:'Active',      lat:28.509, lng:77.524, capacity:'33 kV', voltage:'33 kV', zone:'Zone E', lastInspection:'04 Mar 2026', age:9  },
  { id:'FD-007', name:'Feeder F-07 — Surajpur EPIP',       type:'Feeder', status:'Faulty',      lat:28.524, lng:77.496, capacity:'11 kV', voltage:'11 kV', zone:'Zone E', lastInspection:'17 Mar 2026', age:11 },
  { id:'FD-008', name:'Feeder F-08 — Sec-62 IT Main',      type:'Feeder', status:'Active',      lat:28.621, lng:77.376, capacity:'11 kV', voltage:'11 kV', zone:'Zone B', lastInspection:'20 Jan 2026', age:7  },
  { id:'FD-009', name:'Feeder F-09 — Knowledge Park',      type:'Feeder', status:'Active',      lat:28.476, lng:77.487, capacity:'11 kV', voltage:'11 kV', zone:'Zone D', lastInspection:'06 Feb 2026', age:6  },
  { id:'FD-010', name:'Feeder F-10 — Sec-10 Ring',         type:'Feeder', status:'Maintenance', lat:28.590, lng:77.318, capacity:'11 kV', voltage:'11 kV', zone:'Zone A', lastInspection:'10 Mar 2026', age:16 },
  { id:'FD-011', name:'Feeder F-11 — Bisrakh Road',        type:'Feeder', status:'Active',      lat:28.466, lng:77.445, capacity:'11 kV', voltage:'11 kV', zone:'Zone D', lastInspection:'13 Feb 2026', age:8  },
  { id:'FD-012', name:'Feeder F-12 — Sec-76 Radial',       type:'Feeder', status:'Active',      lat:28.558, lng:77.395, capacity:'11 kV', voltage:'11 kV', zone:'Zone B', lastInspection:'28 Feb 2026', age:5  },
  // SMART METER CLUSTERS ──────────────────────────────────────────────────────
  { id:'SM-C01', name:'AMR Cluster — Sector 18–25',        type:'SmartMeter', status:'Active',  lat:28.567, lng:77.317, capacity:'18,500 meters', voltage:'LT', zone:'Zone A',   lastInspection:'Auto-read', age:2 },
  { id:'SM-C02', name:'AMR Cluster — Sector 37–50',        type:'SmartMeter', status:'Active',  lat:28.559, lng:77.356, capacity:'24,200 meters', voltage:'LT', zone:'Zone A-B', lastInspection:'Auto-read', age:2 },
  { id:'SM-C03', name:'AMR Cluster — Sector 62–76',        type:'SmartMeter', status:'Active',  lat:28.612, lng:77.365, capacity:'28,100 meters', voltage:'LT', zone:'Zone B',   lastInspection:'Auto-read', age:3 },
  { id:'SM-C04', name:'AMR Cluster — Expressway Corridor', type:'SmartMeter', status:'Active',  lat:28.515, lng:77.402, capacity:'20,300 meters', voltage:'LT', zone:'Zone C',   lastInspection:'Auto-read', age:2 },
  { id:'SM-C05', name:'AMR Cluster — GN West',             type:'SmartMeter', status:'Offline', lat:28.462, lng:77.457, capacity:'12,450 meters', voltage:'LT', zone:'Zone D',   lastInspection:'Auto-read', age:1 },
  { id:'SM-C06', name:'AMR Cluster — GN East (Kasna)',     type:'SmartMeter', status:'Active',  lat:28.490, lng:77.515, capacity:'16,450 meters', voltage:'LT', zone:'Zone E',   lastInspection:'Auto-read', age:2 },
  { id:'SM-C07', name:'AMR Cluster — Sector 10–15',        type:'SmartMeter', status:'Active',  lat:28.594, lng:77.302, capacity:'16,000 meters', voltage:'LT', zone:'Zone A',   lastInspection:'Auto-read', age:4 },
];

// ── Asset type config ─────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<AssetType, { label: string; color: string; mapColor: string; Icon: React.ElementType; total: number }> = {
  Transformer: { label: 'Transformers', color: '#1565C0', mapColor: '#2196F3', Icon: Cpu,       total: 1248  },
  Substation:  { label: 'Substations',  color: '#0288D1', mapColor: '#00BCD4', Icon: Zap,       total: 86    },
  Feeder:      { label: 'Feeders',      color: '#E65100', mapColor: '#FF7043', Icon: GitBranch, total: 342   },
  SmartMeter:  { label: 'Smart Meters', color: '#2E7D32', mapColor: '#66BB6A', Icon: Radio,     total: 136000 },
};

const STATUS_CONFIG: Record<AssetStatus, { color: string; bg: string; Icon: React.ElementType; label: string }> = {
  Active:      { color: '#2E7D32', bg: '#E8F5E9', Icon: CheckCircle,  label: 'Active'      },
  Faulty:      { color: '#C62828', bg: '#FFEBEE', Icon: AlertTriangle, label: 'Faulty'      },
  Offline:     { color: '#546e7a', bg: '#ECEFF1', Icon: WifiOff,       label: 'Offline'     },
  Maintenance: { color: '#E65100', bg: '#FFF3E0', Icon: Clock,         label: 'Maintenance' },
};

// ── Map controller (flies to selected asset) ──────────────────────────────────
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.9, easeLinearity: 0.25 });
  }, [center[0], center[1], zoom]);
  return null;
}

// ── Asset Profile Drawer ───────────────────────────────────────────────────────
interface ProfileDrawerProps {
  asset: GridAsset;
  onClose: () => void;
  cardBg: string;
  border: string;
  textMain: string;
  textMuted: string;
  isDark: boolean;
  ff: string;
  primaryColor: string;
}

function AssetProfileDrawer({ asset, onClose, cardBg, border, textMain, textMuted, isDark, ff, primaryColor }: ProfileDrawerProps) {
  const tc = TYPE_CONFIG[asset.type];
  const sc = STATUS_CONFIG[asset.status];
  const Icon = tc.Icon;
  const StatusIcon = sc.Icon;

  const [wfmConfirmOpen, setWfmConfirmOpen] = useState(false);
  const [wfmSubmitting,  setWfmSubmitting]  = useState(false);

  function handleWfmSubmit() {
    setWfmSubmitting(true);
    setTimeout(() => {
      setWfmSubmitting(false);
      setWfmConfirmOpen(false);
      toast.success(`Work order raised for ${asset.id}`, {
        description: `${asset.name} has been sent to WFM as a Critical fault. Field team will be dispatched shortly.`,
        duration: 5000,
      });
    }, 1200);
  }

  // Derive extra display values
  const installYear = new Date().getFullYear() - asset.age;
  const conditionPct = asset.status === 'Active' ? Math.max(55, 100 - asset.age * 3) :
                       asset.status === 'Faulty'  ? Math.max(15, 40 - asset.age * 2) :
                       asset.status === 'Maintenance' ? 65 : 30;
  const conditionColor = conditionPct >= 70 ? '#2E7D32' : conditionPct >= 40 ? '#E65100' : '#C62828';

  const Section = ({ title, icon: SIcon }: { title: string; icon: React.ElementType }) => (
    <div className="flex items-center gap-2 px-4 pt-4 pb-1.5">
      <SIcon size={11} style={{ color: primaryColor }} />
      <span style={{ fontSize: '0.625rem', fontWeight: 700, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: ff }}>
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: border }} />
    </div>
  );

  const Row = ({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) => (
    <div className="flex items-center justify-between gap-3 px-4 py-1.5">
      <span style={{ fontSize: '0.7rem', color: textMuted, fontFamily: ff, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: valueColor ?? textMain, fontFamily: ff, textAlign: 'right' }}>{value}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
      className="absolute top-0 right-0 h-full flex flex-col overflow-hidden z-[1100]"
      style={{ width: 320, background: cardBg, borderLeft: `1px solid ${border}`, boxShadow: '-8px 0 32px rgba(0,0,0,0.18)' }}
    >
      {/* ── Drawer header ── */}
      <div className="shrink-0 px-4 py-3 flex items-start gap-3" style={{ borderBottom: `1px solid ${border}`, background: `${tc.color}0e` }}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${tc.color}22` }}>
          <Icon size={18} style={{ color: tc.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: textMain, fontFamily: ff, lineHeight: 1.2 }}>{asset.name}</div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{asset.id}</span>
            <span style={{ opacity: 0.4, color: textMuted }}>·</span>
            <span
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
              style={{ fontSize: '0.625rem', fontWeight: 700, background: `${sc.color}18`, color: sc.color }}
            >
              <StatusIcon size={8} /> {sc.label}
            </span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
          onClick={onClose}
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', color: textMuted }}
        >
          <X size={13} />
        </motion.button>
      </div>

      {/* ── Condition bar ── */}
      <div className="px-4 py-2.5 shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center justify-between mb-1.5">
          <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>Asset Condition</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: conditionColor, fontFamily: ff }}>{conditionPct}%</span>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${conditionPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="h-full rounded-full"
            style={{ background: conditionColor }}
          />
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Identity */}
        <Section title="Identity" icon={Hash} />
        <Row label="Asset ID"   value={asset.id} />
        <Row label="Type"       value={tc.label.slice(0, -1)} valueColor={tc.color} />
        <Row label="Zone"       value={asset.zone} />
        <Row label="Status"     value={
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: `${sc.color}18`, color: sc.color, fontSize: '0.65rem', fontWeight: 700 }}>
            <StatusIcon size={8} /> {sc.label}
          </span>
        } />

        {/* Technical Specs */}
        <Section title="Technical Specs" icon={Activity} />
        <Row label="Capacity"       value={asset.capacity} />
        <Row label="Voltage Level"  value={asset.voltage} />
        <Row label="Asset Age"      value={`${asset.age} year${asset.age !== 1 ? 's' : ''}`} />
        <Row label="Installed"      value={`Year ${installYear}`} />
        <Row label="Condition"      value={`${conditionPct}%`} valueColor={conditionColor} />

        {/* Location */}
        <Section title="Location" icon={Navigation} />
        <Row label="Zone"      value={asset.zone} />
        <Row label="Latitude"  value={`${asset.lat.toFixed(4)}° N`} />
        <Row label="Longitude" value={`${asset.lng.toFixed(4)}° E`} />
        <Row label="Coordinates" value={
          <a
            href={`https://maps.google.com/?q=${asset.lat},${asset.lng}`}
            target="_blank" rel="noreferrer"
            style={{ color: primaryColor, fontSize: '0.65rem', textDecoration: 'underline', fontWeight: 600 }}
          >
            Open in Maps ↗
          </a>
        } />

        {/* Maintenance */}
        <Section title="Maintenance" icon={Wrench} />
        <Row label="Last Inspection" value={asset.lastInspection} />
        <Row label="Next Due"
          value={asset.lastInspection === 'Auto-read' ? 'Real-time' :
            asset.age <= 5 ? 'Dec 2026' : asset.age <= 10 ? 'Sep 2026' : 'Jun 2026'}
        />
        <Row label="Maintenance Cycle"
          value={asset.type === 'Transformer' ? 'Annual' :
                 asset.type === 'Substation'  ? 'Bi-annual' :
                 asset.type === 'Feeder'       ? 'Quarterly' : 'Continuous'}
        />
        <Row label="Priority"
          value={asset.status === 'Faulty' ? 'Critical' : asset.status === 'Maintenance' ? 'High' : asset.age > 15 ? 'Medium' : 'Normal'}
          valueColor={asset.status === 'Faulty' ? '#C62828' : asset.status === 'Maintenance' ? '#E65100' : asset.age > 15 ? '#F9A825' : '#2E7D32'}
        />

        {/* Compliance */}
        <Section title="Compliance" icon={Shield} />
        <Row label="Safety Rating"   value={asset.status === 'Faulty' ? 'Under Review' : 'Certified'} valueColor={asset.status === 'Faulty' ? '#C62828' : '#2E7D32'} />
        <Row label="Last Audit"      value={asset.lastInspection === 'Auto-read' ? 'N/A' : asset.lastInspection} />
        <Row label="Regulatory Body" value="UPERC / CEA" />
        <Row label="Load Circuit"    value={`DISCOM-NOIDA-${asset.zone.replace('Zone ', '')}`} />

        <div className="h-4" />
      </div>

      {/* ── Footer actions ── */}
      <div className="shrink-0 px-4 py-3 flex flex-col gap-2" style={{ borderTop: `1px solid ${border}` }}>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5"
            style={{ background: `${primaryColor}18`, color: primaryColor, fontSize: '0.72rem', fontWeight: 600, fontFamily: ff }}
          >
            <BarChart2 size={12} /> Analytics
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5"
            style={{ background: `${sc.color}18`, color: sc.color, fontSize: '0.72rem', fontWeight: 600, fontFamily: ff }}
          >
            <Wrench size={12} /> Service
          </motion.button>
        </div>

        {/* Send to WFM — only for Faulty assets */}
        {asset.status === 'Faulty' && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setWfmConfirmOpen(true)}
            className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg,#C62828,#E53935)',
              color: '#fff', fontSize: '0.75rem', fontWeight: 700, fontFamily: ff,
              boxShadow: '0 4px 14px rgba(198,40,40,0.35)',
            }}
          >
            <Send size={13} /> Send to WFM
          </motion.button>
        )}
      </div>

      {/* ── WFM Confirmation overlay ── */}
      <AnimatePresence>
        {wfmConfirmOpen && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[10]"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
              onClick={() => !wfmSubmitting && setWfmConfirmOpen(false)}
            />

            {/* dialog card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="absolute left-4 right-4 z-[11] rounded-2xl overflow-hidden"
              style={{
                bottom: 80, background: cardBg,
                border: '1px solid rgba(198,40,40,0.3)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
              }}
            >
              {/* dialog header */}
              <div className="px-4 pt-4 pb-3 flex items-start gap-3" style={{ borderBottom: `1px solid ${border}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(198,40,40,0.12)' }}>
                  <ClipboardList size={16} style={{ color: '#C62828' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Raise WFM Work Order</p>
                  <p style={{ fontSize: '0.65rem', color: textMuted, fontFamily: ff, marginTop: 2 }}>
                    This will dispatch a field crew for fault rectification.
                  </p>
                </div>
                <button onClick={() => !wfmSubmitting && setWfmConfirmOpen(false)} style={{ color: textMuted }}>
                  <X size={13} />
                </button>
              </div>

              {/* asset summary */}
              <div className="px-4 py-3 flex flex-col gap-1.5">
                {([
                  ['Asset',    asset.name],
                  ['ID',       asset.id],
                  ['Type',     tc.label.slice(0, -1)],
                  ['Zone',     asset.zone],
                  ['Priority', 'Critical'],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span style={{ fontSize: '0.68rem', color: textMuted, fontFamily: ff }}>{label}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: label === 'Priority' ? '#C62828' : textMain, fontFamily: ff }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* warning note */}
              <div className="mx-4 mb-3 px-3 py-2 rounded-xl flex items-start gap-2"
                style={{ background: 'rgba(198,40,40,0.07)', border: '1px solid rgba(198,40,40,0.18)' }}
              >
                <AlertTriangle size={12} style={{ color: '#C62828', marginTop: 1, flexShrink: 0 }} />
                <p style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff, lineHeight: 1.5 }}>
                  A work order will be created in the WFM system and a field team will be notified immediately.
                </p>
              </div>

              {/* action buttons */}
              <div className="px-4 pb-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setWfmConfirmOpen(false)}
                  disabled={wfmSubmitting}
                  className="flex-1 py-2.5 rounded-xl"
                  style={{ border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontSize: '0.72rem', fontWeight: 600, fontFamily: ff }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleWfmSubmit}
                  disabled={wfmSubmitting}
                  className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg,#C62828,#E53935)',
                    color: '#fff', fontSize: '0.72rem', fontWeight: 700, fontFamily: ff,
                    opacity: wfmSubmitting ? 0.75 : 1,
                  }}
                >
                  {wfmSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent"
                      />
                      Submitting…
                    </>
                  ) : (
                    <><Send size={12} /> Confirm & Send</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
interface AssetsPageProps {
  onBack?: () => void;
}

export function AssetsPage({ onBack }: AssetsPageProps) {
  const { settings } = useTheme();
  const ds = getDensitySpacing(settings.density);
  const ff = `var(--md-font-family, ${settings.fontFamily})`;

  const isDark   = settings.darkMode;
  const pageBg   = isDark ? '#111111' : '#f0f4fc';
  const cardBg   = isDark ? '#1e1e1e' : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted= isDark ? '#78909c' : '#546e7a';
  const surface  = isDark ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08`;
  const rowHover = isDark ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08`;

  // ── State ──────────────────────────────────────────────────────────────────
  const [search,      setSearch]      = useState('');
  const [filterType,  setFilterType]  = useState<AssetType | 'All'>('All');
  const [filterStatus,setFilterStatus]= useState<AssetStatus | 'All'>('All');
  const [filterZone,  setFilterZone]  = useState<string>('All');
  const [sortBy,      setSortBy]      = useState<'name' | 'id' | 'age-asc' | 'age-desc' | 'status'>('name');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [layerVis,    setLayerVis]    = useState<Record<AssetType, boolean>>({
    Transformer: true, Substation: true, Feeder: true, SmartMeter: true,
  });
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [profileAsset, setProfileAsset] = useState<GridAsset | null>(null);
  const [mapTarget,   setMapTarget]   = useState<{ center: [number, number]; zoom: number }>({
    center: [28.535, 77.420], zoom: 12,
  });

  const selectedAsset = useMemo(() => ASSETS.find(a => a.id === selectedId) ?? null, [selectedId]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const ALL_ZONES = useMemo(() => {
    const zones = Array.from(new Set(ASSETS.map(a => a.zone))).sort();
    return ['All', ...zones];
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = ASSETS.filter(a => {
      if (filterType   !== 'All' && a.type   !== filterType)   return false;
      if (filterStatus !== 'All' && a.status !== filterStatus) return false;
      if (filterZone   !== 'All' && a.zone   !== filterZone)   return false;
      if (q && !a.name.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q) && !a.zone.toLowerCase().includes(q)) return false;
      return true;
    });
    return [...base].sort((a, b) => {
      if (sortBy === 'name')     return a.name.localeCompare(b.name);
      if (sortBy === 'id')       return a.id.localeCompare(b.id);
      if (sortBy === 'age-asc')  return a.age - b.age;
      if (sortBy === 'age-desc') return b.age - a.age;
      if (sortBy === 'status')   return a.status.localeCompare(b.status);
      return 0;
    });
  }, [search, filterType, filterStatus, filterZone, sortBy]);

  // ── Map markers (apply layer visibility) ──────────────────────────────────
  const mapAssets = useMemo(() => ASSETS.filter(a => layerVis[a.type]), [layerVis]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleSelectAsset(asset: GridAsset) {
    setSelectedId(asset.id);
    setMapTarget({ center: [asset.lat, asset.lng], zoom: 15 });
  }

  const isFiltered = search.trim() !== '' || filterType !== 'All' || filterStatus !== 'All' || filterZone !== 'All' || sortBy !== 'name';
  const activeFilterCount = [
    filterType   !== 'All',
    filterStatus !== 'All',
    filterZone   !== 'All',
    sortBy       !== 'name',
  ].filter(Boolean).length;

  // ── Stat counts ────────────────────────────────────────────────────────────
  const faultCount = ASSETS.filter(a => a.status === 'Faulty').length;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 shrink-0"
        style={{ height: 52, borderBottom: `1px solid ${border}`, background: cardBg }}
      >
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: surface, color: textMuted }}
        >
          <ArrowLeft size={15} />
        </motion.button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${settings.primaryColor}18` }}>
            <Cpu size={16} style={{ color: settings.primaryColor }} />
          </div>
          <div>
            <h1 style={{ fontSize: '0.9rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>Grid Assets</h1>
            <p style={{ fontSize: '0.65rem', color: textMuted, marginTop: 2 }}>Noida DISCOM — Asset Inventory</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {faultCount > 0 && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: '#FFEBEE', fontSize: '0.68rem', fontWeight: 600, color: '#C62828' }}>
              <AlertTriangle size={10} /> {faultCount} Active Faults
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full" style={{ background: surface, fontSize: '0.68rem', color: textMuted }}>
            1,37,676 total assets
          </span>
        </div>
      </div>

      {/* ── Body: List + Map ──────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
        <div
          className="flex flex-col shrink-0 overflow-hidden"
          style={{ width: 360, borderRight: `1px solid ${border}` }}
        >
          {/* Summary stat chips */}
          <div className="grid grid-cols-2 gap-2 p-3 shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            {(Object.entries(TYPE_CONFIG) as [AssetType, typeof TYPE_CONFIG[AssetType]][]).map(([type, cfg]) => {
              const Icon = cfg.Icon;
              const faultyCount = ASSETS.filter(a => a.type === type && a.status === 'Faulty').length;
              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilterType(prev => prev === type ? 'All' : type)}
                  className="rounded-2xl p-2.5 text-left transition-all"
                  style={{
                    background: filterType === type ? `${cfg.color}18` : cardBg,
                    border: `1px solid ${filterType === type ? `${cfg.color}40` : border}`,
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${cfg.color}18` }}>
                      <Icon size={12} style={{ color: cfg.color }} />
                    </div>
                    {faultyCount > 0 && (
                      <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full" style={{ fontSize: '9px', background: '#FFEBEE', color: '#C62828', fontWeight: 700 }}>
                        {faultyCount}⚠
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: cfg.color, lineHeight: 1 }}>
                    {cfg.total >= 1000 ? cfg.total.toLocaleString('en-IN') : cfg.total}
                  </div>
                  <div style={{ fontSize: '0.63rem', color: textMuted, marginTop: 2 }}>{cfg.label}</div>
                </motion.button>
              );
            })}
          </div>

          {/* Search + filters */}
          <div className="px-3 pt-2.5 pb-2 flex flex-col gap-2 shrink-0" style={{ borderBottom: `1px solid ${border}` }}>

            {/* Search row */}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1"
                style={{ background: surface, border: `1px solid ${border}` }}
              >
                <Search size={13} style={{ color: textMuted }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, ID or zone…"
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: '0.75rem', color: textMain, fontFamily: ff }}
                />
                {search && (
                  <button onClick={() => setSearch('')}><X size={12} style={{ color: textMuted }} /></button>
                )}
              </div>

              {/* Filter toggle button */}
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setFilterPanelOpen(p => !p)}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl shrink-0"
                style={{
                  background: filterPanelOpen ? `${settings.primaryColor}18` : surface,
                  border: `1px solid ${filterPanelOpen ? `${settings.primaryColor}50` : border}`,
                  color: filterPanelOpen ? settings.primaryColor : textMuted,
                  fontFamily: ff, fontSize: '0.72rem', fontWeight: 600,
                }}
              >
                <SlidersHorizontal size={13} />
                {activeFilterCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{ fontSize: '9px', fontWeight: 700, background: settings.primaryColor }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </motion.button>
            </div>

            {/* Status pills — always visible */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff, fontWeight: 600, opacity: 0.7, marginRight: 2 }}>STATUS</span>
              {(['All', 'Active', 'Faulty', 'Maintenance', 'Offline'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className="px-2.5 py-1 rounded-full transition-all"
                  style={{
                    fontSize: '0.63rem', fontWeight: 600, fontFamily: ff,
                    background: filterStatus === s
                      ? (s === 'All' ? settings.primaryColor : STATUS_CONFIG[s as AssetStatus]?.color ?? settings.primaryColor)
                      : surface,
                    color: filterStatus === s ? '#fff' : textMuted,
                    border: `1px solid ${filterStatus === s ? 'transparent' : border}`,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Expanded filter panel */}
            <AnimatePresence>
              {filterPanelOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div
                    className="flex flex-col gap-2.5 pt-2 pb-1 px-3 rounded-xl"
                    style={{ background: isDark ? 'rgba(255,255,255,0.03)' : `${settings.primaryColor}05`, border: `1px solid ${border}` }}
                  >
                    {/* Asset Type row */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted, fontFamily: ff, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Asset Type</span>
                        {filterType !== 'All' && (
                          <button onClick={() => setFilterType('All')} style={{ fontSize: '0.625rem', color: settings.primaryColor, fontFamily: ff, fontWeight: 600 }}>Clear</button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(['All', 'Transformer', 'Substation', 'Feeder', 'SmartMeter'] as const).map(t => {
                          const cfg = t !== 'All' ? TYPE_CONFIG[t] : null;
                          const isActive = filterType === t;
                          return (
                            <button
                              key={t}
                              onClick={() => setFilterType(t)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-full transition-all"
                              style={{
                                fontSize: '0.63rem', fontWeight: 600, fontFamily: ff,
                                background: isActive ? (cfg?.color ?? settings.primaryColor) : 'transparent',
                                color: isActive ? '#fff' : textMuted,
                                border: `1px solid ${isActive ? 'transparent' : border}`,
                              }}
                            >
                              {cfg && <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? 'rgba(255,255,255,0.7)' : cfg.color, display: 'inline-block', flexShrink: 0 }} />}
                              {t === 'SmartMeter' ? 'Smart Meter' : t}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: border }} />

                    {/* Zone row */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted, fontFamily: ff, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Zone</span>
                        {filterZone !== 'All' && (
                          <button onClick={() => setFilterZone('All')} style={{ fontSize: '0.625rem', color: settings.primaryColor, fontFamily: ff, fontWeight: 600 }}>Clear</button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ALL_ZONES.map(z => {
                          const isActive = filterZone === z;
                          return (
                            <button
                              key={z}
                              onClick={() => setFilterZone(z)}
                              className="px-2.5 py-1 rounded-full transition-all"
                              style={{
                                fontSize: '0.63rem', fontWeight: 600, fontFamily: ff,
                                background: isActive ? settings.primaryColor : 'transparent',
                                color: isActive ? '#fff' : textMuted,
                                border: `1px solid ${isActive ? 'transparent' : border}`,
                              }}
                            >
                              {z}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: border }} />

                    {/* Sort row */}
                    <div className="pb-0.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted, fontFamily: ff, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sort By</span>
                        {sortBy !== 'name' && (
                          <button onClick={() => setSortBy('name')} style={{ fontSize: '0.625rem', color: settings.primaryColor, fontFamily: ff, fontWeight: 600 }}>Reset</button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {([
                          { value: 'name',     label: 'Name A–Z' },
                          { value: 'id',       label: 'ID' },
                          { value: 'age-asc',  label: 'Newest' },
                          { value: 'age-desc', label: 'Oldest' },
                          { value: 'status',   label: 'Status' },
                        ] as const).map(opt => {
                          const isActive = sortBy === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setSortBy(opt.value)}
                              className="px-2.5 py-1 rounded-full transition-all"
                              style={{
                                fontSize: '0.63rem', fontWeight: 600, fontFamily: ff,
                                background: isActive ? settings.secondaryColor : 'transparent',
                                color: isActive ? '#fff' : textMuted,
                                border: `1px solid ${isActive ? 'transparent' : border}`,
                              }}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reset all */}
                    {activeFilterCount > 0 && (
                      <motion.button
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => { setFilterType('All'); setFilterStatus('All'); setFilterZone('All'); setSortBy('name'); }}
                        className="w-full py-1.5 rounded-lg flex items-center justify-center gap-1.5"
                        style={{ background: `${settings.primaryColor}12`, color: settings.primaryColor, fontSize: '0.68rem', fontWeight: 700, fontFamily: ff }}
                      >
                        <X size={10} /> Reset all filters ({activeFilterCount})
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Count bar */}
          <div className="px-3 py-1.5 shrink-0 flex items-center justify-between gap-2" style={{ borderBottom: `1px solid ${border}` }}>
            <span style={{ fontSize: '0.65rem', color: textMuted, fontFamily: ff }}>
              Showing{' '}
              <span style={{ fontWeight: 700, color: textMain }}>{filtered.length}</span>
              {' of '}
              {filterType === 'All' ? (
                <span style={{ fontWeight: 600 }}>
                  {(Object.values(TYPE_CONFIG).reduce((sum, cfg) => sum + cfg.total, 0)).toLocaleString('en-IN')} assets
                </span>
              ) : (
                <span style={{ fontWeight: 600, color: TYPE_CONFIG[filterType].color }}>
                  {TYPE_CONFIG[filterType].total.toLocaleString('en-IN')} {TYPE_CONFIG[filterType].label.toLowerCase()}
                </span>
              )}
            </span>
            {isFiltered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => { setSearch(''); setFilterType('All'); setFilterStatus('All'); setFilterZone('All'); setSortBy('name'); }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ fontSize: '0.625rem', fontWeight: 600, color: settings.primaryColor, background: `${settings.primaryColor}12`, fontFamily: ff }}
              >
                <X size={9} /> Clear all
              </motion.button>
            )}
          </div>

          {/* Asset list */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 gap-2"
                >
                  <MapPin size={28} style={{ color: textMuted, opacity: 0.4 }} />
                  <p style={{ fontSize: '0.75rem', color: textMuted }}>No assets match your filters</p>
                </motion.div>
              ) : (
                filtered.map((asset, i) => {
                  const tc  = TYPE_CONFIG[asset.type];
                  const sc  = STATUS_CONFIG[asset.status];
                  const Icon = tc.Icon;
                  const StatusIcon = sc.Icon;
                  const isSelected = selectedId === asset.id;
                  return (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.025 }}
                      onClick={() => handleSelectAsset(asset)}
                      className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-all"
                      style={{
                        borderBottom: `1px solid ${border}`,
                        background: isSelected ? `${settings.primaryColor}10` : 'transparent',
                        borderLeft: isSelected ? `3px solid ${settings.primaryColor}` : '3px solid transparent',
                      }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = rowHover; }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${tc.color}18` }}>
                        <Icon size={14} style={{ color: tc.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate" style={{ fontSize: '0.75rem', fontWeight: 600, color: textMain }}>{asset.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span style={{ fontSize: '0.625rem', color: textMuted }}>{asset.id}</span>
                          <span style={{ fontSize: '0.625rem', color: textMuted, opacity: 0.5 }}>·</span>
                          <span style={{ fontSize: '0.625rem', color: textMuted }}>{asset.zone}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
                          style={{ fontSize: '0.625rem', fontWeight: 600, background: `${sc.color}15`, color: sc.color }}
                        >
                          <StatusIcon size={8} /> {sc.label}
                        </span>
                        <span style={{ fontSize: '0.625rem', color: textMuted }}>{asset.capacity}</span>
                      </div>
                      {isSelected && (
                        <motion.button
                          whileHover={{ scale: 1.15, x: 2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={e => { e.stopPropagation(); setProfileAsset(asset); }}
                          className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${settings.primaryColor}18` }}
                        >
                          <ChevronRight size={13} style={{ color: settings.primaryColor }} />
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT PANEL: Map ─────────────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden">

          {/* Asset Profile Drawer */}
          <AnimatePresence>
            {profileAsset && (
              <AssetProfileDrawer
                key={profileAsset.id}
                asset={profileAsset}
                onClose={() => setProfileAsset(null)}
                cardBg={cardBg}
                border={border}
                textMain={textMain}
                textMuted={textMuted}
                isDark={isDark}
                ff={ff}
                primaryColor={settings.primaryColor}
              />
            )}
          </AnimatePresence>

          {/* Layer toggle button */}
          <div className="absolute top-3 right-3 z-[1000]">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={() => setLayerPanelOpen(p => !p)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-lg"
              style={{
                background: cardBg, border: `1px solid ${border}`,
                color: layerPanelOpen ? settings.primaryColor : textMain,
                fontFamily: ff, fontSize: '0.72rem', fontWeight: 600,
              }}
            >
              <Layers size={13} /> Layers
            </motion.button>

            <AnimatePresence>
              {layerPanelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 rounded-2xl shadow-2xl overflow-hidden py-2 min-w-max"
                  style={{ background: cardBg, border: `1px solid ${border}` }}
                >
                  {(Object.entries(TYPE_CONFIG) as [AssetType, typeof TYPE_CONFIG[AssetType]][]).map(([type, cfg]) => {
                    const Icon = cfg.Icon;
                    const visible = layerVis[type];
                    return (
                      <button
                        key={type}
                        onClick={() => setLayerVis(p => ({ ...p, [type]: !p[type] }))}
                        className="w-full flex items-center gap-2.5 px-4 py-2 transition-colors"
                        style={{ fontFamily: ff }}
                        onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div
                          className="w-3 h-3 rounded-full shrink-0 transition-all"
                          style={{ background: visible ? cfg.mapColor : (isDark ? '#333' : '#ddd') }}
                        />
                        <Icon size={12} style={{ color: visible ? cfg.color : textMuted }} />
                        <span style={{ fontSize: '0.75rem', color: visible ? textMain : textMuted }}>{cfg.label}</span>
                        <span className="ml-auto" style={{ fontSize: '0.65rem', color: textMuted, opacity: 0.7 }}>{visible ? 'Visible' : 'Hidden'}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Selected asset info chip */}
          <AnimatePresence>
            {selectedAsset && (
              <motion.div
                key={selectedAsset.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xl"
                style={{ background: cardBg, border: `1px solid ${border}`, fontFamily: ff, maxWidth: 400, minWidth: 300 }}
              >
                {(() => {
                  const tc = TYPE_CONFIG[selectedAsset.type];
                  const sc = STATUS_CONFIG[selectedAsset.status];
                  const Icon = tc.Icon;
                  return (
                    <>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${tc.color}18` }}>
                        <Icon size={14} style={{ color: tc.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate" style={{ fontSize: '0.75rem', fontWeight: 700, color: textMain }}>{selectedAsset.name}</div>
                        <div style={{ fontSize: '0.625rem', color: textMuted, marginTop: 1 }}>
                          {selectedAsset.id} · {selectedAsset.voltage} · {selectedAsset.zone}
                        </div>
                      </div>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full shrink-0" style={{ fontSize: '0.625rem', fontWeight: 700, background: `${sc.color}15`, color: sc.color }}>
                        {sc.label}
                      </span>
                      <button onClick={() => setSelectedId(null)}><X size={13} style={{ color: textMuted }} /></button>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leaflet Map */}
          <MapContainer
            center={[28.535, 77.420]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <MapController center={mapTarget.center} zoom={mapTarget.zoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={
                isDark
                  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
              }
            />
            {mapAssets.map(asset => {
              const tc = TYPE_CONFIG[asset.type];
              const sc = STATUS_CONFIG[asset.status];
              const isSelected = selectedId === asset.id;
              const radius = asset.type === 'Substation' ? 9 : asset.type === 'SmartMeter' ? 7 : 6;
              return (
                <CircleMarker
                  key={asset.id}
                  center={[asset.lat, asset.lng]}
                  radius={isSelected ? radius + 4 : radius}
                  pathOptions={{
                    fillColor: asset.status !== 'Active' ? sc.color : tc.mapColor,
                    fillOpacity: 0.9,
                    color: isSelected ? '#fff' : (asset.status !== 'Active' ? sc.color : tc.mapColor),
                    weight: isSelected ? 3 : 1.5,
                    opacity: 1,
                  }}
                  eventHandlers={{ click: () => handleSelectAsset(asset) }}
                >
                  <Popup>
                    <div style={{ fontFamily: 'system-ui, sans-serif', minWidth: 200 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 4, color: tc.color }}>{asset.name}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: '0.72rem' }}>
                        <span style={{ color: '#546e7a' }}>ID</span>         <span style={{ fontWeight: 600 }}>{asset.id}</span>
                        <span style={{ color: '#546e7a' }}>Type</span>       <span style={{ fontWeight: 600 }}>{tc.label.slice(0,-1)}</span>
                        <span style={{ color: '#546e7a' }}>Status</span>     <span style={{ fontWeight: 600, color: sc.color }}>{sc.label}</span>
                        <span style={{ color: '#546e7a' }}>Capacity</span>   <span style={{ fontWeight: 600 }}>{asset.capacity}</span>
                        <span style={{ color: '#546e7a' }}>Voltage</span>    <span style={{ fontWeight: 600 }}>{asset.voltage}</span>
                        <span style={{ color: '#546e7a' }}>Zone</span>       <span style={{ fontWeight: 600 }}>{asset.zone}</span>
                        <span style={{ color: '#546e7a' }}>Age</span>        <span style={{ fontWeight: 600 }}>{asset.age} yrs</span>
                        <span style={{ color: '#546e7a' }}>Inspected</span>  <span style={{ fontWeight: 600 }}>{asset.lastInspection}</span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Map legend */}
          <div
            className="absolute bottom-4 left-3 z-[1000] rounded-2xl px-3 py-2.5 flex flex-col gap-1.5"
            style={{ background: cardBg, border: `1px solid ${border}`, fontFamily: ff }}
          >
            <p style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Legend</p>
            {(Object.entries(TYPE_CONFIG) as [AssetType, typeof TYPE_CONFIG[AssetType]][]).filter(([t]) => layerVis[t]).map(([type, cfg]) => (
              <div key={type} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cfg.mapColor }} />
                <span style={{ fontSize: '0.65rem', color: textMain }}>{cfg.label}</span>
              </div>
            ))}
            <div style={{ marginTop: 4, borderTop: `1px solid ${border}`, paddingTop: 4 }}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#C62828' }} />
                <span style={{ fontSize: '0.65rem', color: textMain }}>Fault / Offline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}