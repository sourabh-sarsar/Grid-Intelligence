import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FlaskConical, Play, Pause, CheckCircle, XCircle, Plus, Clock,
  ChevronDown, Search, X, Loader2, CheckCircle2, Eye,
  Zap, AlertTriangle, TrendingUp, Activity, Shield, BarChart2,
} from 'lucide-react';
import { useTheme, getDensitySpacing } from '../../context/ThemeContext';
import { toast } from 'sonner';

// ─── Constants ────────────────────────────────────────────────────────────────

const CIRCUITS = [
  { id: 'F-01', name: 'Feeder F-01', zone: 'Zone A', type: 'Main Feeder' },
  { id: 'F-02', name: 'Feeder F-02', zone: 'Zone A', type: 'Residential' },
  { id: 'F-03', name: 'Feeder F-03', zone: 'Zone A', type: 'Commercial' },
  { id: 'F-08', name: 'Feeder F-08', zone: 'Zone B', type: 'Industrial' },
  { id: 'F-12', name: 'Feeder F-12', zone: 'Zone B', type: 'Mixed Load' },
  { id: 'F-15', name: 'Feeder F-15', zone: 'Zone C', type: 'Agricultural' },
  { id: 'F-18', name: 'Feeder F-18', zone: 'Zone C', type: 'Residential' },
  { id: 'SS-04', name: 'Substation SS-04', zone: 'Zone A', type: '11 kV Bus' },
  { id: 'SS-07', name: 'Substation SS-07', zone: 'Zone B', type: '33 kV Bus' },
  { id: 'SS-14', name: 'Substation SS-14', zone: 'Zone C', type: '132 kV' },
  { id: 'T-119', name: 'Transformer T-119', zone: 'Zone A', type: 'Distribution' },
  { id: 'T-204', name: 'Transformer T-204', zone: 'Zone B', type: 'Distribution' },
  { id: 'RMU-06', name: 'Ring Main RMU-06', zone: 'Zone C', type: 'RMU' },
  { id: 'RMU-11', name: 'Ring Main RMU-11', zone: 'Zone B', type: 'RMU' },
  { id: 'LT-05', name: 'LT Network Sector-5', zone: 'Zone A', type: 'LT Network' },
];

const STUDY_TYPE_LIST = [
  'Load Flow Analysis',
  'IC Analysis',
  'Demand Prediction',
  'Feeder Capacity Study',
  'Short Circuit Analysis',
  'Harmonic Analysis',
  'Load Allocation',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Circuit { id: string; name: string; zone: string; type: string; }

interface StudyEntry {
  id: number;
  name: string;
  type: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  zone: string;
  circuit?: string;
}

// ─── Result Templates ─────────────────────────────────────────────────────────

type KpiStatus = 'good' | 'warn' | 'bad' | 'info';

interface ResultTemplate {
  icon: React.ElementType;
  kpis: { label: string; value: string; unit: string; status: KpiStatus }[];
  tables: {
    title: string;
    cols: string[];
    rows: (string | { text: string; status?: KpiStatus })[][];
  }[];
  conclusion: string;
}

const RESULT_TEMPLATES: Record<string, ResultTemplate> = {
  'Load Flow Analysis': {
    icon: Activity,
    kpis: [
      { label: 'Max Voltage Dev.', value: '±4.8', unit: '%', status: 'warn' },
      { label: 'Total Active Loss', value: '38.4', unit: 'MW', status: 'warn' },
      { label: 'Overloaded Lines', value: '3', unit: 'feeders', status: 'bad' },
      { label: 'Load Factor', value: '0.74', unit: 'p.u.', status: 'good' },
    ],
    tables: [
      {
        title: 'Bus Voltage Profile',
        cols: ['Bus / Node', 'Voltage (pu)', 'Angle (°)', 'Status'],
        rows: [
          ['Bus-132kV SS-14', '1.02', '0.0°', { text: 'Normal', status: 'good' }],
          ['Bus-33kV SS-07', '0.99', '-2.4°', { text: 'Normal', status: 'good' }],
          ['Bus-11kV SS-04', '0.96', '-5.1°', { text: 'Normal', status: 'good' }],
          ['Bus-LT F-08', '0.93', '-8.7°', { text: 'Low Voltage', status: 'warn' }],
          ['Bus-LT F-12', '0.91', '-10.2°', { text: 'Critical', status: 'bad' }],
          ['Bus-LT F-15', '0.94', '-7.3°', { text: 'Normal', status: 'good' }],
        ],
      },
      {
        title: 'Active Power Losses',
        cols: ['Feeder', 'Rated (MVA)', 'Flow (MVA)', 'Loss (MW)'],
        rows: [
          ['F-01 (Zone A)', '20', '14.2', '0.84'],
          ['F-08 (Zone B)', '15', '17.3', '2.10'],
          ['F-12 (Zone B)', '12', '13.8', '3.42'],
          ['F-15 (Zone C)', '10', '7.4', '0.52'],
          ['F-18 (Zone C)', '8', '5.9', '0.38'],
        ],
      },
    ],
    conclusion: 'Three feeders (F-08, F-12, F-02) are operating above rated capacity. Voltage at LT bus of F-12 is below 0.92 pu — immediate load relief via F-11 tie switch recommended. Total technical losses of 38.4 MW represent 7.2% of injected power.',
  },

  'Feeder Capacity Study': {
    icon: BarChart2,
    kpis: [
      { label: 'Avg Loading', value: '71.4', unit: '%', status: 'warn' },
      { label: 'Overloaded', value: '2', unit: 'feeders', status: 'bad' },
      { label: 'Available Cap.', value: '42.6', unit: 'MVA', status: 'info' },
      { label: 'Peak Load', value: '148.3', unit: 'MW', status: 'warn' },
    ],
    tables: [
      {
        title: 'Feeder Loading Summary',
        cols: ['Feeder', 'Rated (MVA)', 'Peak Load (MVA)', 'Loading %', 'Status'],
        rows: [
          ['F-01 — Zone A', '20', '14.2', '71%', { text: 'Normal', status: 'good' }],
          ['F-03 — Zone A', '18', '12.6', '70%', { text: 'Normal', status: 'good' }],
          ['F-08 — Zone B', '15', '17.3', '115%', { text: 'Overloaded', status: 'bad' }],
          ['F-12 — Zone B', '12', '13.8', '115%', { text: 'Overloaded', status: 'bad' }],
          ['F-15 — Zone C', '10', '7.4', '74%', { text: 'Normal', status: 'good' }],
          ['F-18 — Zone C', '8', '6.9', '86%', { text: 'Marginal', status: 'warn' }],
        ],
      },
      {
        title: 'Capacity Augmentation Plan',
        cols: ['Feeder', 'Additional Need (MVA)', 'Priority', 'Est. Cost (₹ Cr)'],
        rows: [
          ['F-08 — Industrial', '+5 MVA', { text: 'High', status: 'bad' }, '3.2'],
          ['F-12 — Mixed', '+3 MVA', { text: 'High', status: 'bad' }, '2.1'],
          ['F-18 — Residential', '+2 MVA', { text: 'Medium', status: 'warn' }, '1.4'],
        ],
      },
    ],
    conclusion: 'Feeders F-08 and F-12 are critically overloaded at 115% of rated capacity. Immediate capacity augmentation recommended: new 5 MVA transformer at SS-07 and reconductoring of F-08 with Dog conductor. Budget estimate: ₹5.3 Crore.',
  },

  'Short Circuit Analysis': {
    icon: Shield,
    kpis: [
      { label: 'Max Fault Current', value: '22.4', unit: 'kA', status: 'warn' },
      { label: 'Min Fault Current', value: '4.8', unit: 'kA', status: 'good' },
      { label: 'Critical Bus', value: 'SS-07', unit: '33kV', status: 'bad' },
      { label: 'CB Adequacy', value: '92%', unit: 'passing', status: 'good' },
    ],
    tables: [
      {
        title: 'Fault Level Summary',
        cols: ['Bus', 'Voltage Level', '3-Ph Fault (kA)', 'L-G Fault (kA)', 'Status'],
        rows: [
          ['SS-14 Inf. Bus', '132 kV', '31.5', '28.4', { text: 'OK', status: 'good' }],
          ['SS-07 HV Bus', '33 kV', '22.4', '19.8', { text: 'Check CB', status: 'warn' }],
          ['SS-04 HV Bus', '11 kV', '14.6', '12.3', { text: 'OK', status: 'good' }],
          ['T-204 LV Bus', '0.415 kV', '9.8', '8.2', { text: 'OK', status: 'good' }],
          ['Sector 7 LT', '0.415 kV', '4.8', '4.1', { text: 'OK', status: 'good' }],
        ],
      },
      {
        title: 'Circuit Breaker Adequacy',
        cols: ['CB ID', 'Rated (kA)', 'Required (kA)', 'Margin', 'Verdict'],
        rows: [
          ['CB-SS14-01', '40', '31.5', '+8.5 kA', { text: 'Adequate', status: 'good' }],
          ['CB-SS07-03', '25', '22.4', '+2.6 kA', { text: 'Marginal', status: 'warn' }],
          ['CB-SS04-07', '20', '14.6', '+5.4 kA', { text: 'Adequate', status: 'good' }],
          ['CB-T204-LV', '12', '9.8', '+2.2 kA', { text: 'Adequate', status: 'good' }],
        ],
      },
    ],
    conclusion: 'Maximum fault level at SS-07 33kV bus is 22.4 kA, with only 2.6 kA margin on existing CB-SS07-03 (rated 25 kA). Recommend upgrading CB-SS07-03 to 31.5 kA rated breaker before next load cycle. All LT protection is adequate.',
  },

  'Harmonic Analysis': {
    icon: Zap,
    kpis: [
      { label: 'Max THD (V)', value: '6.8', unit: '%', status: 'bad' },
      { label: 'Dominant', value: '5th', unit: 'harmonic', status: 'warn' },
      { label: 'IEEE 519 Limit', value: '5.0', unit: '% THD', status: 'info' },
      { label: 'Non-Compliant', value: '3', unit: 'buses', status: 'bad' },
    ],
    tables: [
      {
        title: 'Harmonic Distortion by Bus',
        cols: ['Measurement Point', 'Fund. (V)', 'THD (%)', '5th (%)', '7th (%)', 'Compliance'],
        rows: [
          ['PCC — SS-14 132kV', '132,000', '1.2%', '0.9%', '0.6%', { text: 'Pass', status: 'good' }],
          ['PCC — SS-04 11kV', '11,000', '4.1%', '3.2%', '1.8%', { text: 'Pass', status: 'good' }],
          ['F-08 Industrial Bus', '11,000', '6.8%', '5.4%', '2.9%', { text: 'Fail', status: 'bad' }],
          ['F-12 Mixed Bus', '11,000', '5.6%', '4.8%', '2.1%', { text: 'Fail', status: 'bad' }],
          ['VFD Load Bus', '0.415', '8.2%', '6.9%', '3.4%', { text: 'Fail', status: 'bad' }],
        ],
      },
      {
        title: 'Harmonic Sources Identified',
        cols: ['Source', 'Type', 'Magnitude (kVAR)', 'Recommendation'],
        rows: [
          ['VFD Drives (F-08)', 'Current Harmonic', '420 kVAR', { text: 'Install 5th order filter', status: 'warn' }],
          ['UPS Systems', 'Current Harmonic', '180 kVAR', { text: 'Delta-Wye transformer', status: 'info' }],
          ['Arc Furnace (Industrial)', 'Interharmonic', '290 kVAR', { text: 'Passive filter bank', status: 'warn' }],
        ],
      },
    ],
    conclusion: 'Three buses exceed IEEE 519-2022 THD limit of 5%. Primary source is VFD drives at the industrial feeder F-08. Recommend installing a 7th-order passive harmonic filter (600 kVAR) at SS-04 11kV bus. Estimated cost: ₹18 Lakh. Expected THD reduction to < 3.5%.',
  },

  'Demand Prediction': {
    icon: TrendingUp,
    kpis: [
      { label: 'Peak Q2 Demand', value: '5,640', unit: 'MW', status: 'warn' },
      { label: 'Growth Rate', value: '+8.2', unit: '%', status: 'info' },
      { label: 'Avg Daily Peak', value: '5,180', unit: 'MW', status: 'info' },
      { label: 'Confidence', value: '94.6', unit: '%', status: 'good' },
    ],
    tables: [
      {
        title: 'Demand Forecast — Q2 (Monthly)',
        cols: ['Month', 'Min (MW)', 'Avg (MW)', 'Peak (MW)', 'vs Last Year'],
        rows: [
          ['April 2026', '2,840', '4,210', '5,240', { text: '+7.8%', status: 'warn' }],
          ['May 2026', '3,020', '4,480', '5,520', { text: '+8.1%', status: 'warn' }],
          ['June 2026', '3,280', '4,760', '5,640', { text: '+8.5%', status: 'bad' }],
        ],
      },
      {
        title: 'Load Category Breakdown (June 2026 Peak)',
        cols: ['Category', 'Demand (MW)', 'Share', 'Growth vs LY'],
        rows: [
          ['Residential (A/C)', '2,180', '38.7%', { text: '+12.4%', status: 'bad' }],
          ['Commercial', '1,420', '25.2%', { text: '+6.8%', status: 'warn' }],
          ['Industrial', '1,360', '24.1%', { text: '+4.2%', status: 'good' }],
          ['Agricultural', '680', '12.1%', { text: '+3.1%', status: 'good' }],
        ],
      },
    ],
    conclusion: 'Q2 2026 peak demand is projected at 5,640 MW — 8.5% above same period last year, driven by residential cooling load growth (+12.4%). Recommended procurement: Additional 300 MW bilateral contract and activation of DSM programme targeting 180 MW shiftable residential load during 14:00–18:00.',
  },

  'IC Analysis': {
    icon: Shield,
    kpis: [
      { label: 'Transfer Capacity', value: '480', unit: 'MW', status: 'info' },
      { label: 'Used Capacity', value: '68.4', unit: '%', status: 'warn' },
      { label: 'Stability Margin', value: '28.3', unit: '%', status: 'good' },
      { label: 'Interface MVA', value: '520', unit: 'MVA', status: 'info' },
    ],
    tables: [
      {
        title: 'Interconnection Interface Capacity',
        cols: ['Interface', 'Rated (MVA)', 'Available (MW)', 'Used (%)', 'Status'],
        rows: [
          ['IC-01 — 220kV Tie (North)', '200', '142', '71%', { text: 'Marginal', status: 'warn' }],
          ['IC-02 — 132kV Tie (East)', '150', '108', '72%', { text: 'Marginal', status: 'warn' }],
          ['IC-03 — 132kV Tie (South)', '100', '52', '52%', { text: 'Normal', status: 'good' }],
          ['IC-04 — 33kV Tie (West)', '70', '28', '40%', { text: 'Normal', status: 'good' }],
        ],
      },
      {
        title: 'Power Transfer Stability Limits',
        cols: ['Interface', 'Thermal Limit (MW)', 'Stability Limit (MW)', 'Binding Limit'],
        rows: [
          ['IC-01 North', '200', '175', { text: 'Stability', status: 'warn' }],
          ['IC-02 East', '150', '138', { text: 'Stability', status: 'warn' }],
          ['IC-03 South', '100', '115', { text: 'Thermal', status: 'good' }],
          ['IC-04 West', '70', '82', { text: 'Thermal', status: 'good' }],
        ],
      },
    ],
    conclusion: 'Both 220kV and 132kV interconnection ties to North and East zones are stability-limited at 71–72% usage. Reactive compensation (2×50 MVAR SVC) at IC-01 is recommended to improve stability margin by ~15%. No immediate thermal violations; however N-1 contingency may cause overloads on IC-01 during peak hours.',
  },

  'Load Allocation': {
    icon: Activity,
    kpis: [
      { label: 'Total Allocated', value: '4,920', unit: 'MW', status: 'info' },
      { label: 'Unserved Load', value: '42', unit: 'MW', status: 'warn' },
      { label: 'Priority Load Served', value: '100', unit: '%', status: 'good' },
      { label: 'Load Shed', value: '0.85', unit: '%', status: 'good' },
    ],
    tables: [
      {
        title: 'Load Allocation by Consumer Category',
        cols: ['Category', 'Demand (MW)', 'Allocated (MW)', 'Served %', 'Priority'],
        rows: [
          ['Essential Services', '480', '480', '100%', { text: 'P1', status: 'good' }],
          ['Industrial', '1,360', '1,330', '97.8%', { text: 'P2', status: 'good' }],
          ['Commercial', '1,420', '1,390', '97.9%', { text: 'P3', status: 'good' }],
          ['Residential', '2,180', '2,150', '98.6%', { text: 'P4', status: 'good' }],
          ['Agricultural', '680', '570', '83.8%', { text: 'P5', status: 'warn' }],
        ],
      },
      {
        title: 'Zone-wise Distribution',
        cols: ['Zone', 'Contracted (MW)', 'Supplied (MW)', 'Deficit (MW)', 'Status'],
        rows: [
          ['Zone A', '1,840', '1,840', '0', { text: 'Balanced', status: 'good' }],
          ['Zone B', '2,180', '2,152', '28', { text: 'Minor Deficit', status: 'warn' }],
          ['Zone C', '900', '928', '+28', { text: 'Export', status: 'info' }],
        ],
      },
    ],
    conclusion: 'Agricultural load bearing 16.2% curtailment due to supply shortage in Zone B. Essential services, industrial, and residential categories fully served. Recommend 28 MW temporary import from Zone C via IC-04 tie switch to balance Zone B deficit. Load restoration ETA: 2 hours post tie-switch commissioning.',
  },
};

// ─── Status config ─────────────────────────────────────────────────────────────

const statusConfig = {
  running:   { color: '#1565C0', bg: '#E3F2FD',  icon: Play,        label: 'Running'   },
  completed: { color: '#2E7D32', bg: '#E8F5E9',  icon: CheckCircle, label: 'Completed' },
  failed:    { color: '#C62828', bg: '#FFEBEE',  icon: XCircle,     label: 'Failed'    },
};

const KPI_STATUS_STYLE: Record<KpiStatus, { bg: string; color: string }> = {
  good: { bg: '#E8F5E9', color: '#2E7D32' },
  warn: { bg: '#FFF3E0', color: '#E65100' },
  bad:  { bg: '#FFEBEE', color: '#C62828' },
  info: { bg: '#E3F2FD', color: '#1565C0' },
};

// ─── Initial studies ──────────────────────────────────────────────────────────

const INITIAL_STUDIES: StudyEntry[] = [
  { id: 1, name: 'Load Flow Analysis',    type: 'Load Flow Analysis',    status: 'running',   progress: 68,  startTime: '14:22', zone: 'Zone A & B', circuit: 'F-08' },
  { id: 2, name: 'Demand Prediction Q2',  type: 'Demand Prediction',     status: 'running',   progress: 92,  startTime: '13:45', zone: 'All Zones' },
  { id: 3, name: 'Feeder Capacity Study', type: 'Feeder Capacity Study',  status: 'completed', progress: 100, startTime: '11:30', zone: 'Zone C',    circuit: 'F-15' },
  { id: 4, name: 'Short Circuit Analysis',type: 'Short Circuit Analysis', status: 'completed', progress: 100, startTime: '09:15', zone: 'Sector 7',  circuit: 'T-204' },
  { id: 5, name: 'Harmonic Analysis',     type: 'Harmonic Analysis',      status: 'failed',    progress: 34,  startTime: '12:00', zone: 'Industrial', circuit: 'F-08' },
];

// ─── New Study Modal ──────────────────────────────────────────────────────────

function NewStudyModal({
  isOpen, onClose, onAdd, settings, textMain, textMuted, cardBg,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (s: { name: string; type: string; circuit: Circuit }) => void;
  settings: any;
  textMain: string;
  textMuted: string;
  cardBg: string;
}) {
  const [studyName, setStudyName]         = useState('');
  const [studyType, setStudyType]         = useState('');
  const [typeOpen, setTypeOpen]           = useState(false);
  const [circuit, setCircuit]             = useState<Circuit | null>(null);
  const [circuitOpen, setCircuitOpen]     = useState(false);
  const [circuitSearch, setCircuitSearch] = useState('');
  const [runState, setRunState]           = useState<'idle' | 'running' | 'done'>('idle');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStudyName(''); setStudyType(''); setCircuit(null);
        setCircuitSearch(''); setTypeOpen(false); setCircuitOpen(false); setRunState('idle');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (circuitOpen) setTimeout(() => searchRef.current?.focus(), 60);
  }, [circuitOpen]);

  const filteredCircuits = CIRCUITS.filter(c =>
    !circuitSearch ||
    c.name.toLowerCase().includes(circuitSearch.toLowerCase()) ||
    c.zone.toLowerCase().includes(circuitSearch.toLowerCase()) ||
    c.type.toLowerCase().includes(circuitSearch.toLowerCase())
  );

  const canRun = studyName.trim().length > 0 && studyType && circuit && runState === 'idle';

  const handleRun = () => {
    if (!canRun || !circuit) return;
    setRunState('running');
    setTimeout(() => {
      setRunState('done');
      onAdd({ name: studyName.trim(), type: studyType, circuit });
      toast.success(`"${studyName}" is now running`, {
        description: `${studyType} on ${circuit.name}`,
        icon: '▶️',
      });
    }, 2400);
  };

  const inputBase = {
    background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.1)'}`,
    color: textMain,
    fontFamily: settings.fontFamily,
    borderRadius: '12px',
    outline: 'none',
    width: '100%',
    padding: '10px 12px',
    fontSize: '0.84rem',
  } as React.CSSProperties;

  const dropdownPaper = {
    background: settings.darkMode ? '#252525' : '#fff',
    border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.1)'}`,
    boxShadow: '0 10px 40px rgba(0,0,0,0.22)',
    borderRadius: '14px',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="nsbdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(5px)' }}
            onClick={() => runState !== 'running' && onClose()}
          />

          {/* Modal card */}
          <motion.div
            key="nsmodal"
            initial={{ opacity: 0, scale: 0.90, y: 28 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{ opacity: 0, scale: 0.90, y: 28 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md pointer-events-auto rounded-2xl flex flex-col"
              style={{
                background: cardBg,
                border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                boxShadow: '0 28px 80px rgba(0,0,0,0.28)',
                fontFamily: settings.fontFamily,
                padding: '24px',
                gap: '20px',
              }}
              onClick={e => { e.stopPropagation(); setTypeOpen(false); setCircuitOpen(false); }}
            >
              {/* ── Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${settings.primaryColor}18` }}>
                    <FlaskConical size={20} style={{ color: settings.primaryColor }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: textMain, fontSize: '0.95rem' }}>New Power Study</p>
                    <p className="opacity-60" style={{ color: textMuted, fontSize: '0.72rem' }}>Configure & run simulation</p>
                  </div>
                </div>
                {runState !== 'running' && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }}
                  >
                    <X size={15} style={{ color: textMuted }} />
                  </button>
                )}
              </div>

              {/* ── Body */}
              <AnimatePresence mode="wait">
                {runState === 'done' ? (
                  /* Success state */
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3 py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: '#E8F5E9' }}
                    >
                      <CheckCircle2 size={32} style={{ color: '#2E7D32' }} />
                    </motion.div>
                    <div className="text-center">
                      <p className="font-semibold" style={{ color: textMain, fontSize: '0.95rem' }}>Study Started!</p>
                      <p className="mt-1 opacity-60" style={{ color: textMuted, fontSize: '0.74rem' }}>
                        "{studyName}" has been queued and is now running
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onClose}
                      className="mt-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ background: settings.primaryColor }}
                    >
                      Done
                    </motion.button>
                  </motion.div>

                ) : (
                  /* Form */
                  <motion.div key="form" className="flex flex-col gap-4">

                    {/* Study Name */}
                    <div className="flex flex-col gap-1.5">
                      <label style={{ fontSize: '0.75rem', color: textMuted, fontWeight: 500 }}>Study Name</label>
                      <input
                        value={studyName}
                        onChange={e => setStudyName(e.target.value)}
                        placeholder="e.g. Peak Load Analysis Q2 2026"
                        disabled={runState === 'running'}
                        style={{ ...inputBase, opacity: runState === 'running' ? 0.6 : 1 }}
                      />
                    </div>

                    {/* Study Type dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label style={{ fontSize: '0.75rem', color: textMuted, fontWeight: 500 }}>Study Type</label>
                      <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => { if (runState !== 'running') { setTypeOpen(v => !v); setCircuitOpen(false); } }}
                          className="w-full flex items-center justify-between transition-all"
                          style={{ ...inputBase, cursor: runState === 'running' ? 'not-allowed' : 'pointer', textAlign: 'left' }}
                        >
                          <span style={{ color: studyType ? textMain : textMuted, fontSize: '0.84rem' }}>
                            {studyType || 'Select study type…'}
                          </span>
                          <motion.span animate={{ rotate: typeOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown size={15} style={{ color: textMuted }} />
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {typeOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -6, scaleY: 0.9 }}
                              animate={{ opacity: 1, y: 0,  scaleY: 1   }}
                              exit={{    opacity: 0, y: -6, scaleY: 0.9 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-0 right-0 top-full mt-1.5 overflow-hidden z-20"
                              style={{ ...dropdownPaper, transformOrigin: 'top' }}
                            >
                              {STUDY_TYPE_LIST.map(t => (
                                <button
                                  key={t}
                                  onClick={() => { setStudyType(t); setTypeOpen(false); }}
                                  className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors"
                                  style={{
                                    fontSize: '0.83rem',
                                    color: textMain,
                                    background: studyType === t ? `${settings.primaryColor}14` : 'transparent',
                                  }}
                                  onMouseEnter={e => { if (studyType !== t) (e.currentTarget as HTMLElement).style.background = settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'; }}
                                  onMouseLeave={e => { if (studyType !== t) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                >
                                  <span>{t}</span>
                                  {studyType === t && <CheckCircle2 size={13} style={{ color: settings.primaryColor }} />}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Circuit dropdown with search */}
                    <div className="flex flex-col gap-1.5">
                      <label style={{ fontSize: '0.75rem', color: textMuted, fontWeight: 500 }}>Select Circuit</label>
                      <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => { if (runState !== 'running') { setCircuitOpen(v => !v); setTypeOpen(false); } }}
                          className="w-full flex items-center justify-between transition-all"
                          style={{ ...inputBase, cursor: runState === 'running' ? 'not-allowed' : 'pointer', textAlign: 'left' }}
                        >
                          {circuit ? (
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="font-medium truncate" style={{ color: textMain, fontSize: '0.84rem' }}>{circuit.name}</span>
                              <span className="shrink-0 px-1.5 py-0.5 rounded-full"
                                style={{ fontSize: '0.625rem', background: `${settings.primaryColor}15`, color: settings.primaryColor }}>
                                {circuit.zone}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: textMuted, fontSize: '0.84rem' }}>Select circuit…</span>
                          )}
                          <motion.span animate={{ rotate: circuitOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown size={15} style={{ color: textMuted }} />
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {circuitOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -6, scaleY: 0.9 }}
                              animate={{ opacity: 1, y: 0,  scaleY: 1   }}
                              exit={{    opacity: 0, y: -6, scaleY: 0.9 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-0 right-0 top-full mt-1.5 flex flex-col overflow-hidden z-20"
                              style={{ ...dropdownPaper, transformOrigin: 'top', maxHeight: '232px' }}
                            >
                              {/* Search bar */}
                              <div className="flex items-center gap-2 px-3 py-2.5 shrink-0"
                                style={{ borderBottom: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}` }}>
                                <Search size={12} style={{ color: textMuted, flexShrink: 0 }} />
                                <input
                                  ref={searchRef}
                                  value={circuitSearch}
                                  onChange={e => setCircuitSearch(e.target.value)}
                                  placeholder="Search circuits…"
                                  className="flex-1 bg-transparent outline-none"
                                  style={{ fontSize: '0.8rem', color: textMain }}
                                  onClick={e => e.stopPropagation()}
                                />
                                {circuitSearch && (
                                  <button onClick={e => { e.stopPropagation(); setCircuitSearch(''); }}>
                                    <X size={11} style={{ color: textMuted }} />
                                  </button>
                                )}
                              </div>

                              {/* List */}
                              <div className="overflow-y-auto flex-1" style={{ maxHeight: '172px' }}>
                                {filteredCircuits.length === 0 ? (
                                  <p className="text-center py-4" style={{ fontSize: '0.78rem', color: textMuted }}>No circuits found</p>
                                ) : filteredCircuits.map(c => (
                                  <button
                                    key={c.id}
                                    onClick={() => { setCircuit(c); setCircuitOpen(false); setCircuitSearch(''); }}
                                    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors"
                                    style={{ background: circuit?.id === c.id ? `${settings.primaryColor}12` : 'transparent' }}
                                    onMouseEnter={e => { if (circuit?.id !== c.id) (e.currentTarget as HTMLElement).style.background = settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'; }}
                                    onMouseLeave={e => { if (circuit?.id !== c.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                  >
                                    <div className="flex flex-col min-w-0">
                                      <span className="font-medium truncate" style={{ fontSize: '0.82rem', color: textMain }}>{c.name}</span>
                                      <span style={{ fontSize: '0.68rem', color: textMuted }}>{c.type}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span className="px-1.5 py-0.5 rounded-full"
                                        style={{ fontSize: '0.625rem', background: `${settings.primaryColor}14`, color: settings.primaryColor }}>
                                        {c.zone}
                                      </span>
                                      {circuit?.id === c.id && <CheckCircle2 size={12} style={{ color: settings.primaryColor }} />}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Run Study button */}
                    <motion.button
                      whileHover={canRun ? { scale: 1.02 } : {}}
                      whileTap={canRun  ? { scale: 0.98 } : {}}
                      onClick={handleRun}
                      disabled={!canRun}
                      className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all"
                      style={{
                        fontSize: '0.86rem',
                        background: canRun
                          ? settings.primaryColor
                          : (settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'),
                        color: canRun ? '#fff' : textMuted,
                        cursor: canRun ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {runState === 'running' ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Loader2 size={16} />
                          </motion.span>
                          Running Simulation…
                        </>
                      ) : (
                        <>
                          <Play size={14} fill="currentColor" />
                          Run Study
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Study Result Modal ───────────────────────────────────────────────────────

function StudyResultModal({
  study, onClose, settings, textMain, textMuted, cardBg,
}: {
  study: StudyEntry | null;
  onClose: () => void;
  settings: any;
  textMain: string;
  textMuted: string;
  cardBg: string;
}) {
  const isOpen = !!study;
  const result: ResultTemplate | null = study ? (RESULT_TEMPLATES[study.type] ?? null) : null;
  const borderColor = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';

  const cellStyle = (highlight?: boolean) => ({
    padding: '8px 12px',
    fontSize: '0.78rem',
    color: highlight ? textMain : textMuted,
    borderBottom: `1px solid ${borderColor}`,
    fontWeight: highlight ? 600 : 400,
  } as React.CSSProperties);

  return (
    <AnimatePresence>
      {isOpen && study && result && (
        <>
          {/* Backdrop */}
          <motion.div
            key="srbdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="srmodal"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-2xl pointer-events-auto rounded-2xl flex flex-col overflow-hidden"
              style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                boxShadow: '0 32px 96px rgba(0,0,0,0.32)',
                fontFamily: settings.fontFamily,
                maxHeight: '88vh',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── Result header */}
              <div className="flex items-center justify-between px-6 py-4 shrink-0"
                style={{ borderBottom: `1px solid ${borderColor}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: '#E8F5E9' }}>
                    <result.icon size={20} style={{ color: '#2E7D32' }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: textMain, fontSize: '0.95rem' }}>{study.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span style={{ fontSize: '0.72rem', color: textMuted }}>{study.type}</span>
                      {study.circuit && (
                        <>
                          <span style={{ color: textMuted, fontSize: '0.72rem' }}>·</span>
                          <span style={{ fontSize: '0.72rem', color: textMuted }}>{study.circuit}</span>
                        </>
                      )}
                      <span style={{ color: textMuted, fontSize: '0.72rem' }}>·</span>
                      <span style={{ fontSize: '0.72rem', color: textMuted }}>{study.zone}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }}
                >
                  <X size={15} style={{ color: textMuted }} />
                </button>
              </div>

              {/* ── Scrollable body */}
              <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">

                {/* KPI summary row */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {result.kpis.map((kpi, i) => {
                    const st = KPI_STATUS_STYLE[kpi.status];
                    const darkBg = settings.darkMode
                      ? kpi.status === 'good' ? 'rgba(76,175,80,0.13)'
                        : kpi.status === 'warn' ? 'rgba(255,152,0,0.13)'
                        : kpi.status === 'bad'  ? 'rgba(244,67,54,0.13)'
                        : 'rgba(21,101,192,0.13)'
                      : st.bg;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="rounded-xl p-3"
                        style={{ background: darkBg }}
                      >
                        <p style={{ fontSize: '0.68rem', color: st.color, opacity: 0.85 }}>{kpi.label}</p>
                        <p className="font-bold mt-0.5" style={{ fontSize: '1.1rem', color: st.color, lineHeight: 1 }}>
                          {kpi.value}
                        </p>
                        <p style={{ fontSize: '0.64rem', color: st.color, opacity: 0.75 }}>{kpi.unit}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Data tables */}
                {result.tables.map((table, ti) => (
                  <motion.div
                    key={ti}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + ti * 0.08 }}
                    className="rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${borderColor}` }}
                  >
                    <div className="px-4 py-2.5"
                      style={{ background: settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderBottom: `1px solid ${borderColor}` }}>
                      <p className="font-semibold" style={{ fontSize: '0.78rem', color: textMain }}>{table.title}</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ background: settings.darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                            {table.cols.map((col, ci) => (
                              <th key={ci} style={{ padding: '7px 12px', fontSize: '0.7rem', color: textMuted, textAlign: 'left', borderBottom: `1px solid ${borderColor}`, fontWeight: 600 }}>
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, ri) => (
                            <tr key={ri}
                              style={{ background: ri % 2 === 0 ? 'transparent' : (settings.darkMode ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.012)') }}>
                              {row.map((cell, ci) => {
                                if (typeof cell === 'object' && cell !== null && 'text' in cell) {
                                  const cst = KPI_STATUS_STYLE[cell.status ?? 'info'];
                                  const darkCellBg = settings.darkMode
                                    ? cell.status === 'good' ? 'rgba(76,175,80,0.15)'
                                      : cell.status === 'warn' ? 'rgba(255,152,0,0.15)'
                                      : cell.status === 'bad' ? 'rgba(244,67,54,0.15)'
                                      : 'rgba(21,101,192,0.15)'
                                    : cst.bg;
                                  return (
                                    <td key={ci} style={{ padding: '8px 12px', borderBottom: `1px solid ${borderColor}` }}>
                                      <span className="px-2 py-0.5 rounded-full font-medium"
                                        style={{ fontSize: '0.7rem', background: darkCellBg, color: cst.color }}>
                                        {cell.text}
                                      </span>
                                    </td>
                                  );
                                }
                                return (
                                  <td key={ci} style={cellStyle(ci === 0)}>
                                    {String(cell)}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                ))}

                {/* Conclusion */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36 }}
                  className="rounded-xl p-4 flex gap-3"
                  style={{ background: settings.darkMode ? 'rgba(21,101,192,0.13)' : '#E3F2FD', border: `1px solid ${settings.darkMode ? 'rgba(21,101,192,0.25)' : 'rgba(21,101,192,0.2)'}` }}
                >
                  <AlertTriangle size={16} style={{ color: '#1565C0', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="font-semibold mb-1" style={{ fontSize: '0.76rem', color: '#1565C0' }}>Engineer's Conclusion</p>
                    <p style={{ fontSize: '0.78rem', color: settings.darkMode ? '#90CAF9' : '#1565C0', lineHeight: 1.55, opacity: 0.9 }}>
                      {result.conclusion}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* ── Footer */}
              <div className="flex items-center justify-between px-6 py-3 shrink-0"
                style={{ borderTop: `1px solid ${borderColor}` }}>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} style={{ color: textMuted }} />
                  <span style={{ fontSize: '0.72rem', color: textMuted }}>Completed at {study.startTime}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl font-medium text-white"
                  style={{ fontSize: '0.8rem', background: settings.primaryColor }}
                >
                  Close Report
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── StudiesCard ──────────────────────────────────────────────────────────────

export function StudiesCard() {
  const { settings } = useTheme();
  const ds = getDensitySpacing(settings.density);

  const [studyList, setStudyList]   = useState<StudyEntry[]>(INITIAL_STUDIES);
  const [modalOpen, setModalOpen]   = useState(false);
  const [resultStudy, setResultStudy] = useState<StudyEntry | null>(null);
  const [hoveredId, setHoveredId]   = useState<number | null>(null);
  const [pausedIds, setPausedIds]   = useState<Set<number>>(new Set());

  const cardBg      = settings.darkMode ? '#1e1e1e' : '#fff';
  const textMain    = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const textMuted   = settings.darkMode ? '#78909c' : '#546e7a';
  const borderColor = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  const handleStudyAdded = ({ name, type, circuit }: { name: string; type: string; circuit: Circuit }) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setStudyList(prev => [{
      id: Date.now(),
      name,
      type,
      status: 'running',
      progress: 5,
      startTime: time,
      zone: circuit.zone,
      circuit: circuit.name,
    }, ...prev]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
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
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${settings.primaryColor}18` }}>
            <FlaskConical size={18} style={{ color: settings.primaryColor }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-none" style={{ color: textMain }}>Power Studies</h3>
            <p className="text-xs opacity-60 mt-0.5" style={{ color: textMuted }}>Simulations & Analysis</p>
          </div>
        </div>

        {/* ── Selected element: New Study button → opens form modal */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white"
          style={{ background: settings.primaryColor }}
        >
          <Plus size={12} /> New Study
        </motion.button>
      </div>

      {/* Studies list */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ gap: ds.gap }}>
        <AnimatePresence initial={false}>
          {studyList.map((study, i) => {
            const s = statusConfig[study.status as keyof typeof statusConfig];
            const isCompleted = study.status === 'completed';
            return (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ delay: i < 5 ? 0.4 + i * 0.07 : 0 }}
                className="flex gap-3 rounded-2xl"
                style={{
                  padding: ds.itemPad,
                  background: settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
                }}
              >
                {/* Status icon / pause button */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{
                    background: study.status === 'running' && pausedIds.has(study.id) ? '#FFF8E1' : s.bg,
                    cursor: study.status === 'running' ? 'pointer' : 'default',
                  }}
                  onMouseEnter={() => study.status === 'running' && setHoveredId(study.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    if (study.status !== 'running') return;
                    const isNowPaused = !pausedIds.has(study.id);
                    setPausedIds(prev => {
                      const next = new Set(prev);
                      isNowPaused ? next.add(study.id) : next.delete(study.id);
                      return next;
                    });
                    toast[isNowPaused ? 'warning' : 'success'](
                      `"${study.name}" has been ${isNowPaused ? 'paused' : 'resumed'}`,
                      { description: isNowPaused ? 'You can resume at any time.' : 'Study is running again.', icon: isNowPaused ? '⏸️' : '▶️' }
                    );
                  }}
                >
                  {study.status === 'running' && hoveredId === study.id ? (
                    <Pause size={14} style={{ color: pausedIds.has(study.id) ? '#F59E0B' : s.color }} />
                  ) : study.status === 'running' && pausedIds.has(study.id) ? (
                    <Pause size={14} style={{ color: '#F59E0B' }} />
                  ) : (
                    <s.icon size={14} style={{ color: s.color }} />
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate leading-snug" style={{ color: textMain }}>{study.name}</p>
                  <p className="text-xs opacity-50 truncate" style={{ color: textMuted }}>
                    {study.type} · {study.circuit ? study.circuit : study.zone}
                  </p>
                  {study.status === 'running' && (
                    <div className="mt-1.5 w-full h-1.5 rounded-full overflow-hidden"
                      style={{ background: settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${study.progress}%` }}
                        transition={{ delay: i < 5 ? 0.5 + i * 0.07 : 0.1, duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: settings.primaryColor }}
                      />
                    </div>
                  )}
                </div>

                {/* Right col */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  <div className="flex items-center gap-1">
                    <Clock size={9} style={{ color: textMuted }} />
                    <span className="text-xs opacity-50" style={{ color: textMuted }}>{study.startTime}</span>
                  </div>
                  {study.status === 'running' && (
                    <span className="text-xs font-medium" style={{ color: settings.primaryColor }}>{study.progress}%</span>
                  )}
                  {/* See Result button for completed studies */}
                  {isCompleted && RESULT_TEMPLATES[study.type] && (
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setResultStudy(study)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        background: `${settings.primaryColor}16`,
                        color: settings.primaryColor,
                        border: `1px solid ${settings.primaryColor}30`,
                        marginTop: '2px',
                      }}
                    >
                      <Eye size={9} /> See Result
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* New Study modal */}
      <NewStudyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleStudyAdded}
        settings={settings}
        textMain={textMain}
        textMuted={textMuted}
        cardBg={cardBg}
      />

      {/* Study Result modal */}
      <StudyResultModal
        study={resultStudy}
        onClose={() => setResultStudy(null)}
        settings={settings}
        textMain={textMain}
        textMuted={textMuted}
        cardBg={cardBg}
      />
    </motion.div>
  );
}
