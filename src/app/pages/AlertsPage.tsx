import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, AlertTriangle, AlertOctagon, Bell, Info,
  CheckCircle, Clock, MapPin, Zap, Cpu, GitBranch,
  RefreshCw, Send, UserCheck, ChevronUp, X, Radio,
  WifiOff, Flame, Shield, Activity, Gauge,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved';

interface Alert {
  id: string;
  title: string;
  desc: string;
  severity: Severity;
  status: AlertStatus;
  zone: string;
  location: string;
  device: string;
  deviceType: 'Feeder' | 'Transformer' | 'Consumer' | 'System' | 'Meter';
  time: string;
  ago: string;
  assignedTo?: string;
  Icon: React.ElementType;
  timeline: Array<{ time: string; event: string; by?: string }>;
}

const SEV_CFG: Record<Severity, { color: string; bg: string; dot: string }> = {
  Critical: { color: '#B71C1C', bg: '#FFEBEE', dot: '#EF5350' },
  High:     { color: '#E65100', bg: '#FFF3E0', dot: '#FF9800' },
  Medium:   { color: '#F57F17', bg: '#FFFDE7', dot: '#FDD835' },
  Low:      { color: '#1565C0', bg: '#E3F2FD', dot: '#42A5F5' },
};
const DARK_SEV_CFG: Record<Severity, { color: string; bg: string; dot: string }> = {
  Critical: { color: '#EF9A9A', bg: '#B71C1C22', dot: '#EF5350' },
  High:     { color: '#FFCC80', bg: '#E6510022', dot: '#FF9800' },
  Medium:   { color: '#FFF176', bg: '#F57F1722', dot: '#FDD835' },
  Low:      { color: '#90CAF9', bg: '#1565C022', dot: '#42A5F5' },
};

const STATUS_CFG: Record<AlertStatus, { color: string; label: string }> = {
  Active:       { color: '#EF5350', label: 'Active' },
  Acknowledged: { color: '#FF9800', label: 'Acknowledged' },
  Resolved:     { color: '#4CAF50', label: 'Resolved' },
};

const ALERTS: Alert[] = [
  {
    id: 'ALT-001', severity: 'Critical', status: 'Active',
    title: 'Feeder Overload — Surajpur Industrial',
    desc: 'F-006 loading at 98.4% (24.6 MW / 25 MW). Immediate load shedding or load transfer required to prevent thermal damage.',
    zone: 'Zone E', location: 'Surajpur Industrial Estate', device: 'F-006', deviceType: 'Feeder',
    time: '17 Mar 2026, 14:48', ago: '12 min ago', Icon: Zap,
    timeline: [
      { time: '14:48', event: 'Alert triggered: Loading exceeded 95% threshold' },
      { time: '14:49', event: 'SCADA alarm raised on operator console' },
      { time: '14:51', event: 'Auto-notification sent to Zone E supervisor' },
    ],
  },
  {
    id: 'ALT-002', severity: 'Critical', status: 'Acknowledged',
    title: 'Transformer Fault — SS-012 Sector 62',
    desc: 'Protection relay R-014 tripped on Differential Protection. Transformer isolated. 420 consumers affected in Zone B.',
    zone: 'Zone B', location: 'Sector 62 IT Park S/S', device: 'SS-012 Tx-A', deviceType: 'Transformer',
    time: '17 Mar 2026, 14:26', ago: '34 min ago', assignedTo: 'Eng. R. Verma', Icon: AlertOctagon,
    timeline: [
      { time: '14:26', event: 'Differential protection relay tripped' },
      { time: '14:27', event: 'Breaker CB-012-A auto-opened', by: 'SCADA Auto' },
      { time: '14:29', event: 'Fault management team notified' },
      { time: '14:35', event: 'Alert acknowledged', by: 'Eng. R. Verma' },
      { time: '14:38', event: 'Crew dispatched to site' },
    ],
  },
  {
    id: 'ALT-003', severity: 'Critical', status: 'Active',
    title: 'Voltage Collapse Risk — Zone D Buses',
    desc: 'Bus voltage at Zone D (Bus-04) dropped to 0.963 pu. Reactive compensation needed. Below 0.95 pu will trigger cascade.',
    zone: 'Zone D', location: 'Knowledge Park Cluster', device: 'Bus-04', deviceType: 'System',
    time: '17 Mar 2026, 12:54', ago: '2h ago', Icon: AlertTriangle,
    timeline: [
      { time: '12:54', event: 'Voltage below 0.97 pu threshold detected' },
      { time: '13:02', event: 'Reactive power support initiated via CB bank' },
      { time: '13:15', event: 'Partial recovery to 0.963 pu; monitoring continued' },
    ],
  },
  {
    id: 'ALT-004', severity: 'High', status: 'Active',
    title: 'Low Power Factor — Knowledge Park IT Feeder',
    desc: 'F-003 power factor at 0.86 (threshold: 0.90). High reactive load from uncompensated IT cooling systems. APFC failure suspected.',
    zone: 'Zone D', location: 'Knowledge Park Phase II', device: 'F-003', deviceType: 'Feeder',
    time: '17 Mar 2026, 14:45', ago: '15 min ago', Icon: Gauge,
    timeline: [
      { time: '14:45', event: 'PF alarm triggered: PF below 0.90 limit' },
      { time: '14:46', event: 'APFC controller status: Offline' },
    ],
  },
  {
    id: 'ALT-005', severity: 'High', status: 'Active',
    title: 'Meter Tamper Detected — Sector 37 Zone A',
    desc: 'AMR meter NDA-RES-006284 triggered tamper seal alert. Cover tamper + magnetic interference. Energy theft investigation required.',
    zone: 'Zone A', location: 'Sector 37, Noida', device: 'MTR-NDA-06284', deviceType: 'Meter',
    time: '17 Mar 2026, 14:32', ago: '28 min ago', Icon: Shield,
    timeline: [
      { time: '14:32', event: 'Tamper event logged by AMR head-end system' },
      { time: '14:33', event: 'Vigilance team auto-notified' },
    ],
  },
  {
    id: 'ALT-006', severity: 'High', status: 'Acknowledged',
    title: 'RTU Communication Loss — Zone C SCADA',
    desc: 'Remote Terminal Unit RTU-025 at Pari Chowk unresponsive for >30 minutes. No telemetry from 4 feeders in Zone D.',
    zone: 'Zone C', location: 'Pari Chowk S/S', device: 'RTU-025', deviceType: 'System',
    time: '17 Mar 2026, 13:58', ago: '1h ago', assignedTo: 'Eng. S. Mishra', Icon: WifiOff,
    timeline: [
      { time: '13:58', event: 'RTU heartbeat timeout after 30 min' },
      { time: '14:10', event: 'Comm. team alerted', by: 'System Auto' },
      { time: '14:24', event: 'Acknowledged; IT team investigating', by: 'Eng. S. Mishra' },
    ],
  },
  {
    id: 'ALT-007', severity: 'High', status: 'Active',
    title: 'Transformer Loading >90% — SS-012 Tx-B',
    desc: 'Stand-by transformer SS-012 Tx-B now carrying load after Tx-A fault. Current loading 92.4%, approaching thermal limit.',
    zone: 'Zone B', location: 'Sector 62 IT Park S/S', device: 'SS-012 Tx-B', deviceType: 'Transformer',
    time: '17 Mar 2026, 14:27', ago: '1.5h ago', Icon: Flame,
    timeline: [
      { time: '14:27', event: 'Tx-B loading exceeded 90% post Tx-A trip' },
      { time: '14:30', event: 'Load transfer request raised' },
    ],
  },
  {
    id: 'ALT-008', severity: 'Medium', status: 'Active',
    title: 'Scheduled Maintenance Overdue — Transformer T-018',
    desc: 'Annual preventive maintenance of T-018 (Zone A) scheduled for 10 Mar 2026 is pending. Maintenance team has not confirmed.',
    zone: 'Zone A', location: 'Sector 50 S/S', device: 'T-018', deviceType: 'Transformer',
    time: '17 Mar 2026, 06:00', ago: '9h ago', Icon: Clock,
    timeline: [
      { time: '06:00', event: 'Scheduled maintenance reminder triggered' },
    ],
  },
  {
    id: 'ALT-009', severity: 'Medium', status: 'Acknowledged',
    title: 'High THD at Sector 62 IT Park',
    desc: 'Total Harmonic Distortion on F-004 measured at 8.2% (IEEE-519 limit: 5%). VFDs in data center causing harmonic injection.',
    zone: 'Zone B', location: 'Sector 62 IT Park', device: 'F-004', deviceType: 'Feeder',
    time: '17 Mar 2026, 11:20', ago: '3.5h ago', assignedTo: 'Eng. A. Gupta', Icon: Activity,
    timeline: [
      { time: '11:20', event: 'THD alarm triggered from PQ analyser' },
      { time: '12:05', event: 'Acknowledged; harmonic study scheduled', by: 'Eng. A. Gupta' },
    ],
  },
  {
    id: 'ALT-010', severity: 'Medium', status: 'Active',
    title: 'Consumer Complaint — No Supply Sector 37 Block C',
    desc: '14 consumers in Sector 37 Block C reporting no supply since 13:30. Junction box JB-37-C may have developed fault.',
    zone: 'Zone A', location: 'Sector 37 Block C', device: 'JB-37-C', deviceType: 'System',
    time: '17 Mar 2026, 13:38', ago: '1.2h ago', Icon: Bell,
    timeline: [
      { time: '13:38', event: '14 consumer complaints logged in CRM' },
      { time: '13:45', event: 'Line crew dispatched' },
    ],
  },
  {
    id: 'ALT-011', severity: 'Low', status: 'Resolved',
    title: 'Smart Meter Communication Error — Batch RTU-08',
    desc: '22 smart meters in RTU-08 batch failed to report at 12:00 cycle. Issue resolved after head-end server restart.',
    zone: 'Zone C', location: 'Kasna Residential Zone', device: 'RTU-08 Batch', deviceType: 'Meter',
    time: '17 Mar 2026, 12:05', ago: '3h ago', assignedTo: 'Eng. N. Saxena', Icon: Cpu,
    timeline: [
      { time: '12:05', event: 'Batch communication timeout detected' },
      { time: '12:18', event: 'Head-end server restarted', by: 'Eng. N. Saxena' },
      { time: '12:24', event: 'All 22 meters reconnected and reporting' },
      { time: '12:25', event: 'Alert resolved', by: 'Eng. N. Saxena' },
    ],
  },
  {
    id: 'ALT-012', severity: 'Low', status: 'Active',
    title: 'Battery Backup Low — RTU-031 Zone E',
    desc: 'UPS battery at RTU-031 at 18% capacity. Replace within 48 hours to avoid SCADA blind spot during grid outage.',
    zone: 'Zone E', location: 'Kasna 33/11 kV S/S', device: 'RTU-031', deviceType: 'System',
    time: '17 Mar 2026, 08:30', ago: '6.5h ago', Icon: Radio,
    timeline: [
      { time: '08:30', event: 'UPS battery level alert: 18%' },
    ],
  },
];

interface AlertsPageProps { onBack?: () => void; }

export function AlertsPage({ onBack }: AlertsPageProps) {
  const { settings } = useTheme();
  const ff      = `var(--md-font-family, ${settings.fontFamily})`;
  const isDark  = settings.darkMode;
  const pageBg  = isDark ? '#111111' : '#f0f4fc';
  const cardBg  = isDark ? '#1e1e1e' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain= isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted = isDark ? '#78909c' : '#546e7a';
  const surface = isDark ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08`;
  const pri = settings.primaryColor;
  const sec = settings.secondaryColor;
  const sevCfg = isDark ? DARK_SEV_CFG : SEV_CFG;

  const [selectedId, setSelectedId] = useState('ALT-001');
  const [filterSev, setFilterSev] = useState<'All' | Severity>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | AlertStatus>('All');
  const [alertStatuses, setAlertStatuses] = useState<Record<string, AlertStatus>>(
    Object.fromEntries(ALERTS.map(a => [a.id, a.status]))
  );
  const [acting, setActing] = useState<string | null>(null);
  const [liveCount, setLiveCount] = useState(ALERTS.filter(a => a.status === 'Active').length);

  const alert = ALERTS.find(a => a.id === selectedId) ?? ALERTS[0];
  const alertStatus = alertStatuses[alert.id] ?? alert.status;
  const statusCfg = STATUS_CFG[alertStatus];
  const sevC = sevCfg[alert.severity];

  const filtered = ALERTS.filter(a => {
    const matchSev = filterSev === 'All' || a.severity === filterSev;
    const matchSt  = filterStatus === 'All' || (alertStatuses[a.id] ?? a.status) === filterStatus;
    return matchSev && matchSt;
  });

  const counts = {
    Critical: ALERTS.filter(a => a.severity === 'Critical').length,
    High:     ALERTS.filter(a => a.severity === 'High').length,
    Medium:   ALERTS.filter(a => a.severity === 'Medium').length,
    Low:      ALERTS.filter(a => a.severity === 'Low').length,
  };

  // Simulate new alerts
  useEffect(() => {
    const t = setInterval(() => {
      setLiveCount(p => p); // keep stable for now but timer runs
    }, 8000);
    return () => clearInterval(t);
  }, []);

  function handleAcknowledge() {
    setActing(alert.id);
    setTimeout(() => {
      setAlertStatuses(p => ({ ...p, [alert.id]: 'Acknowledged' }));
      setActing(null);
      toast.success('Alert acknowledged', { description: `${alert.title} acknowledged by current user` });
    }, 1000);
  }

  function handleResolve() {
    setActing(`${alert.id}-r`);
    setTimeout(() => {
      setAlertStatuses(p => ({ ...p, [alert.id]: 'Resolved' }));
      setActing(null);
      toast.success('Alert resolved', { description: `${alert.title} marked as resolved` });
    }, 1200);
  }

  function handleEscalate() {
    toast.info('Alert escalated', { description: `${alert.title} escalated to DISCOM Control Room` });
  }

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
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EF535018' }}>
          <Bell size={16} style={{ color: '#EF5350' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>Alerts & Fault Management</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>System alerts, fault tracking & incident resolution · Live</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(['Critical', 'High', 'Medium', 'Low'] as Severity[]).map(s => (
            <span key={s} className="flex items-center gap-1 px-2 py-1 rounded-full"
              style={{ background: sevCfg[s].bg, fontSize: '0.625rem', fontWeight: 700, color: sevCfg[s].color, cursor: 'pointer' }}
              onClick={() => setFilterSev(p => p === s ? 'All' : s)}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: sevCfg[s].dot, display: 'inline-block' }} />
              {counts[s]} {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left: Alert list */}
        <div className="flex flex-col shrink-0 overflow-hidden" style={{ width: 320, borderRight: `1px solid ${border}` }}>
          {/* Status filter */}
          <div className="flex items-center gap-1 px-3 py-2 shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            {(['All', 'Active', 'Acknowledged', 'Resolved'] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className="flex-1 py-1 rounded-lg transition-all"
                style={{ fontSize: '0.625rem', fontWeight: 600, fontFamily: ff,
                  background: filterStatus === s ? pri : surface, color: filterStatus === s ? '#fff' : textMuted }}>
                {s === 'Acknowledged' ? "Ack'd" : s}
              </button>
            ))}
          </div>
          {/* Count */}
          <div className="flex items-center gap-2 px-3 py-1.5 shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            <span style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>
              Showing <b style={{ color: textMain }}>{filtered.length}</b> of {ALERTS.length} alerts
            </span>
            <span className="ml-auto flex items-center gap-1" style={{ fontSize: '0.625rem', color: '#EF5350', fontFamily: ff }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#EF5350', display: 'inline-block' }} />
              {ALERTS.filter(a => (alertStatuses[a.id] ?? a.status) === 'Active').length} active
            </span>
          </div>
          {/* List */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {filtered.map((a, idx) => {
                const cfg = sevCfg[a.severity];
                const st  = alertStatuses[a.id] ?? a.status;
                const isSel = a.id === selectedId;
                return (
                  <motion.button key={a.id}
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => setSelectedId(a.id)}
                    className="w-full text-left flex items-start gap-2.5 px-3 py-2.5"
                    style={{ background: isSel ? `${pri}10` : 'transparent',
                      borderBottom: `1px solid ${border}`, borderLeft: `3px solid ${isSel ? pri : 'transparent'}` }}
                    whileHover={{ background: surface }}>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: cfg.bg }}>
                      <a.Icon size={11} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: textMain, fontFamily: ff,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>
                      <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{a.zone} · {a.ago}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="px-1.5 py-0.5 rounded-full"
                        style={{ fontSize: '0.625rem', fontWeight: 700, background: cfg.bg, color: cfg.color }}>
                        {a.severity}
                      </span>
                      {st !== 'Active' && (
                        <span style={{ fontSize: '0.625rem', color: STATUS_CFG[st].color }}>{st}</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Alert detail */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div key={alert.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">

              {/* Alert header */}
              <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: sevC.bg }}>
                    <alert.Icon size={18} style={{ color: sevC.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded-full"
                        style={{ fontSize: '0.625rem', fontWeight: 700, background: sevC.bg, color: sevC.color }}>{alert.severity}</span>
                      <span className="px-2 py-0.5 rounded-full"
                        style={{ fontSize: '0.625rem', fontWeight: 700, background: `${STATUS_CFG[alertStatus].color}18`, color: STATUS_CFG[alertStatus].color }}>
                        {statusCfg.label}
                      </span>
                      <span style={{ fontSize: '0.63rem', color: textMuted, fontFamily: ff }}>{alert.ago}</span>
                    </div>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: textMain, fontFamily: ff, marginBottom: 6 }}>{alert.title}</h3>
                    <p style={{ fontSize: '0.7rem', color: textMuted, fontFamily: ff, lineHeight: 1.6 }}>{alert.desc}</p>
                  </div>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { Icon: MapPin,    label: 'Location',   val: alert.location },
                    { Icon: Zap,      label: 'Zone',        val: alert.zone },
                    { Icon: Cpu,      label: 'Device',      val: `${alert.device} (${alert.deviceType})` },
                    { Icon: Clock,    label: 'Timestamp',   val: alert.time },
                    ...(alert.assignedTo ? [{ Icon: UserCheck, label: 'Assigned To', val: alert.assignedTo }] : []),
                  ].map(m => (
                    <div key={m.label} className="flex items-center gap-2 rounded-xl px-2.5 py-2"
                      style={{ background: surface, border: `1px solid ${border}` }}>
                      <m.Icon size={11} style={{ color: textMuted, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>{m.label}</div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: textMain, fontFamily: ff }}>{m.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${border}` }}>
                  {alertStatus === 'Active' && (
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      disabled={acting === alert.id}
                      onClick={handleAcknowledge}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                      style={{ background: `${pri}15`, border: `1px solid ${pri}30`, color: pri,
                        fontSize: '0.7rem', fontWeight: 700, fontFamily: ff }}>
                      {acting === alert.id
                        ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} style={{ display: 'flex' }}><RefreshCw size={11} /></motion.span>
                        : <CheckCircle size={11} />}
                      Acknowledge
                    </motion.button>
                  )}
                  {(alertStatus === 'Active' || alertStatus === 'Acknowledged') && (
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      disabled={acting === `${alert.id}-r`}
                      onClick={handleResolve}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                      style={{ background: '#4CAF5015', border: '1px solid #4CAF5030', color: '#4CAF50',
                        fontSize: '0.7rem', fontWeight: 700, fontFamily: ff }}>
                      {acting === `${alert.id}-r`
                        ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} style={{ display: 'flex' }}><RefreshCw size={11} /></motion.span>
                        : <X size={11} />}
                      Mark Resolved
                    </motion.button>
                  )}
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={handleEscalate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ background: `${sec}15`, border: `1px solid ${sec}30`, color: sec,
                      fontSize: '0.7rem', fontWeight: 700, fontFamily: ff }}>
                    <ChevronUp size={11} /> Escalate
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => toast.info('Dispatch sent', { description: 'Field crew notified via mobile app' })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ background: surface, border: `1px solid ${border}`, color: textMuted,
                      fontSize: '0.7rem', fontWeight: 600, fontFamily: ff }}>
                    <Send size={11} /> Dispatch Crew
                  </motion.button>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                    <Clock size={13} style={{ color: pri }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Event Timeline</span>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-0 bottom-0 w-px" style={{ background: border }} />
                  {alert.timeline.map((t, i) => (
                    <div key={i} className="flex items-start gap-3 mb-3 last:mb-0 relative">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10"
                        style={{ background: i === 0 ? `${pri}20` : surface, border: `1px solid ${i === 0 ? pri + '40' : border}` }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: i === 0 ? pri : textMuted }} />
                      </div>
                      <div className="flex-1 py-0.5">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: textMain, fontFamily: ff }}>{t.time}</span>
                          {t.by && <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: '0.625rem', background: `${pri}12`, color: pri, fontFamily: ff }}>{t.by}</span>}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: textMuted, fontFamily: ff, marginTop: 1 }}>{t.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related alerts in same zone */}
              {(() => {
                const related = ALERTS.filter(a => a.zone === alert.zone && a.id !== alert.id).slice(0, 3);
                if (!related.length) return null;
                return (
                  <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
                        <Bell size={13} style={{ color: sec }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>
                        Related Alerts in {alert.zone}
                      </span>
                    </div>
                    {related.map(r => {
                      const rc = sevCfg[r.severity];
                      return (
                        <motion.button key={r.id} onClick={() => setSelectedId(r.id)}
                          className="w-full text-left flex items-center gap-2.5 p-2.5 rounded-xl mb-1"
                          style={{ background: surface, border: `1px solid ${border}` }}
                          whileHover={{ scale: 1.01 }}>
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: rc.bg }}>
                            <r.Icon size={10} style={{ color: rc.color }} />
                          </div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: textMain, fontFamily: ff, flex: 1,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</span>
                          <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff, flexShrink: 0 }}>{r.ago}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  );
}