import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Search, Users, MapPin, Zap, Cpu,
  Phone, Mail, ChevronRight, CheckCircle, XCircle,
  Building2, Home, Sprout, Factory, SlidersHorizontal, X,
  MoreVertical, Clock, RefreshCw, Tag, Shield, WifiOff, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme, getDensitySpacing } from '../context/ThemeContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// ── Photos ──────────────────────────────────────────────────────────────────
const PHOTO_BIZ_MAN   = 'https://images.unsplash.com/photo-1659355894117-0ae6f8f28d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
const PHOTO_WOMAN_PRO = 'https://images.unsplash.com/photo-1771240730126-594a8ab66be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
const PHOTO_FARMER    = 'https://images.unsplash.com/photo-1615724320397-9d4db10ec2a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
const PHOTO_YOUNG_MAN = 'https://images.unsplash.com/photo-1758561274313-536bf1c4192c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
const PHOTO_WOMAN_OUT = 'https://images.unsplash.com/photo-1764740185159-7bbfe02caa7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
const PHOTO_SENIOR    = 'https://images.unsplash.com/photo-1595956935400-eced8114c8ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
const PHOTO_ENGINEER  = 'https://images.unsplash.com/photo-1635828664463-c3b01cc9db85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

// ── Types ────────────────────────────────────────────────────────────────────
export type ConsumerCategory = 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial';

export interface ConsumerRecord {
  id: number;
  name: string;
  category: ConsumerCategory;
  live: boolean;
  photo: string;
  // Contact
  phone: string;
  email: string;
  // Address
  flat: string;
  building: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  // Connection
  consumerNo: string;
  connectionDate: string;
  connectionType: string;
  sanctionedLoad: string;
  tariffCategory: string;
  supplyVoltage: string;
  billCycle: string;
  // Meter
  meterId: string;
  meterBrand: string;
  meterMake: string;
  meterType: string;
  meterInstallDate: string;
  lastReadingDate: string;
  currentReading: number;
  previousReading: number;
  meterStatus: 'Active' | 'Faulty' | 'Replaced';
}

// ── Full dataset ─────────────────────────────────────────────────────────────
export const CONSUMERS_DATA: ConsumerRecord[] = [
  {
    id: 1, name: 'Sourabh Singh', category: 'Residential', live: true, photo: PHOTO_BIZ_MAN,
    phone: '+91 98765 43210', email: 'sourabh.singh@email.com',
    flat: 'B-204', building: 'Greenwood Apartments', area: 'Sector 14', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301',
    consumerNo: 'NDA-RES-001204', connectionDate: '12 Mar 2018', connectionType: 'Single Phase', sanctionedLoad: '5 kW', tariffCategory: 'LT-1 Domestic', supplyVoltage: '230V', billCycle: 'Monthly',
    meterId: 'MTR-NDA-58204', meterBrand: 'Genus', meterMake: 'Genus Innovation Ltd.', meterType: 'Smart AMR', meterInstallDate: '15 Mar 2018', lastReadingDate: '01 Mar 2026', currentReading: 45820, previousReading: 45612, meterStatus: 'Active',
  },
  {
    id: 2, name: 'Sourabh Kumar', category: 'Commercial', live: true, photo: PHOTO_YOUNG_MAN,
    phone: '+91 99887 76655', email: 'sourabh.kumar@biz.com',
    flat: 'Shop 12, GF', building: 'City Centre Mall', area: 'Sector 18', city: 'Noida', state: 'Uttar Pradesh', pincode: '201308',
    consumerNo: 'NDA-COM-003312', connectionDate: '05 Jun 2019', connectionType: 'Three Phase', sanctionedLoad: '20 kW', tariffCategory: 'LT-2 Non-Domestic', supplyVoltage: '415V', billCycle: 'Monthly',
    meterId: 'MTR-NDA-63312', meterBrand: 'Landis+Gyr', meterMake: 'Landis+Gyr Technologies', meterType: 'Smart AMI', meterInstallDate: '08 Jun 2019', lastReadingDate: '01 Mar 2026', currentReading: 112340, previousReading: 111890, meterStatus: 'Active',
  },
  {
    id: 3, name: 'Sourabh Sinha', category: 'Industrial', live: false, photo: PHOTO_ENGINEER,
    phone: '+91 97654 32109', email: 'sourabh.sinha@industries.com',
    flat: 'Plot 7, Unit 3', building: 'Phase II Industrial Estate', area: 'Surajpur', city: 'Greater Noida', state: 'Uttar Pradesh', pincode: '201306',
    consumerNo: 'GNA-IND-007003', connectionDate: '20 Jan 2015', connectionType: 'Three Phase HT', sanctionedLoad: '250 kW', tariffCategory: 'HT-Industrial', supplyVoltage: '11 kV', billCycle: 'Bi-Monthly',
    meterId: 'MTR-GNA-44003', meterBrand: 'Secure', meterMake: 'Secure Meters Ltd.', meterType: 'Tri-Vector ABT', meterInstallDate: '22 Jan 2015', lastReadingDate: '01 Feb 2026', currentReading: 982450, previousReading: 975200, meterStatus: 'Faulty',
  },
  {
    id: 4, name: 'Sourabh Sarsar', category: 'Residential', live: true, photo: PHOTO_SENIOR,
    phone: '+91 95432 10987', email: 'sarsar.family@gmail.com',
    flat: 'A-101', building: 'Shanti Kunj', area: 'Vasundhara', city: 'Ghaziabad', state: 'Uttar Pradesh', pincode: '201012',
    consumerNo: 'GZB-RES-009101', connectionDate: '03 Sep 2010', connectionType: 'Single Phase', sanctionedLoad: '3 kW', tariffCategory: 'LT-1 Domestic', supplyVoltage: '230V', billCycle: 'Monthly',
    meterId: 'MTR-GZB-20101', meterBrand: 'HPL', meterMake: 'HPL Electric & Power', meterType: 'Electronic Prepaid', meterInstallDate: '05 Sep 2010', lastReadingDate: '01 Mar 2026', currentReading: 28990, previousReading: 28754, meterStatus: 'Active',
  },
  {
    id: 5, name: 'Sourabh Verma', category: 'Agricultural', live: true, photo: PHOTO_FARMER,
    phone: '+91 94321 09876', email: 'verma.farm@email.com',
    flat: 'Khasra No. 214', building: 'Village Barola', area: 'Barola Khurd', city: 'Noida', state: 'Uttar Pradesh', pincode: '201304',
    consumerNo: 'NDA-AGR-011214', connectionDate: '18 Apr 2012', connectionType: 'Single Phase', sanctionedLoad: '7.5 kW', tariffCategory: 'LT-5 Agriculture', supplyVoltage: '230V', billCycle: 'Monthly',
    meterId: 'MTR-NDA-31214', meterBrand: 'Genus', meterMake: 'Genus Innovation Ltd.', meterType: 'Agricultural Feeder', meterInstallDate: '20 Apr 2012', lastReadingDate: '01 Mar 2026', currentReading: 54120, previousReading: 53890, meterStatus: 'Active',
  },
  {
    id: 6, name: 'Sourabh Gupta', category: 'Commercial', live: false, photo: PHOTO_SENIOR,
    phone: '+91 93210 98765', email: 'gupta.traders@gmail.com',
    flat: 'FF-08', building: 'Gupta Complex', area: 'Sector 63', city: 'Noida', state: 'Uttar Pradesh', pincode: '201309',
    consumerNo: 'NDA-COM-013008', connectionDate: '27 Nov 2016', connectionType: 'Three Phase', sanctionedLoad: '15 kW', tariffCategory: 'LT-2 Non-Domestic', supplyVoltage: '415V', billCycle: 'Monthly',
    meterId: 'MTR-NDA-50008', meterBrand: 'Schneider', meterMake: 'Schneider Electric India', meterType: 'Smart AMI', meterInstallDate: '29 Nov 2016', lastReadingDate: '28 Feb 2026', currentReading: 87650, previousReading: 87200, meterStatus: 'Active',
  },
  {
    id: 7, name: 'Sourabh Sharma', category: 'Residential', live: true, photo: PHOTO_BIZ_MAN,
    phone: '+91 92109 87654', email: 'sourabh.sharma@mail.com',
    flat: 'C-305', building: 'Preet Vihar Heights', area: 'Preet Vihar', city: 'Delhi', state: 'Delhi', pincode: '110092',
    consumerNo: 'DEL-RES-016305', connectionDate: '14 Jul 2020', connectionType: 'Single Phase', sanctionedLoad: '5 kW', tariffCategory: 'LT-1 Domestic', supplyVoltage: '230V', billCycle: 'Monthly',
    meterId: 'MTR-DEL-72305', meterBrand: 'Itron', meterMake: 'Itron India Ltd.', meterType: 'Smart AMR', meterInstallDate: '16 Jul 2020', lastReadingDate: '01 Mar 2026', currentReading: 21430, previousReading: 21190, meterStatus: 'Active',
  },
  {
    id: 8, name: 'Sourabh Mishra', category: 'Industrial', live: true, photo: PHOTO_ENGINEER,
    phone: '+91 91098 76543', email: 'mishra.industries@company.com',
    flat: 'Shed 3, Block D', building: 'Udyog Vihar Phase 4', area: 'DLF Phase 5', city: 'Gurugram', state: 'Haryana', pincode: '122015',
    consumerNo: 'GGN-IND-020003', connectionDate: '09 Feb 2017', connectionType: 'Three Phase HT', sanctionedLoad: '400 kW', tariffCategory: 'HT-Industrial', supplyVoltage: '33 kV', billCycle: 'Monthly',
    meterId: 'MTR-GGN-56003', meterBrand: 'ABB', meterMake: 'ABB India Ltd.', meterType: 'Trivector ABT', meterInstallDate: '12 Feb 2017', lastReadingDate: '01 Mar 2026', currentReading: 1245600, previousReading: 1238400, meterStatus: 'Active',
  },
  {
    id: 9, name: 'Sourabh Pandey', category: 'Commercial', live: false, photo: PHOTO_BIZ_MAN,
    phone: '+91 90987 65432', email: 'pandey.shop@email.com',
    flat: 'G-14', building: 'Ansal Plaza', area: 'Khel Gaon Marg', city: 'Delhi', state: 'Delhi', pincode: '110049',
    consumerNo: 'DEL-COM-022014', connectionDate: '31 Oct 2014', connectionType: 'Three Phase', sanctionedLoad: '25 kW', tariffCategory: 'LT-2 Non-Domestic', supplyVoltage: '415V', billCycle: 'Monthly',
    meterId: 'MTR-DEL-48014', meterBrand: 'Landis+Gyr', meterMake: 'Landis+Gyr Technologies', meterType: 'Smart AMI', meterInstallDate: '02 Nov 2014', lastReadingDate: '28 Feb 2026', currentReading: 156780, previousReading: 156100, meterStatus: 'Replaced',
  },
  {
    id: 10, name: 'Sourabh Yadav', category: 'Agricultural', live: true, photo: PHOTO_FARMER,
    phone: '+91 89876 54321', email: 'yadav.kisan@mail.com',
    flat: 'Khasra No. 88', building: 'Village Chhalera', area: 'Chhalera Bangar', city: 'Noida', state: 'Uttar Pradesh', pincode: '201305',
    consumerNo: 'NDA-AGR-024088', connectionDate: '22 Aug 2013', connectionType: 'Single Phase', sanctionedLoad: '5 kW', tariffCategory: 'LT-5 Agriculture', supplyVoltage: '230V', billCycle: 'Monthly',
    meterId: 'MTR-NDA-38088', meterBrand: 'HPL', meterMake: 'HPL Electric & Power', meterType: 'Agricultural Feeder', meterInstallDate: '24 Aug 2013', lastReadingDate: '01 Mar 2026', currentReading: 41230, previousReading: 41010, meterStatus: 'Active',
  },
  {
    id: 11, name: 'Rahul Singh', category: 'Residential', live: true, photo: PHOTO_YOUNG_MAN,
    phone: '+91 88765 43210', email: 'rahul.singh@gmail.com',
    flat: 'D-402', building: 'Sun City Residency', area: 'Sector 45', city: 'Faridabad', state: 'Haryana', pincode: '121001',
    consumerNo: 'FBD-RES-026402', connectionDate: '17 Dec 2021', connectionType: 'Single Phase', sanctionedLoad: '5 kW', tariffCategory: 'LT-1 Domestic', supplyVoltage: '230V', billCycle: 'Monthly',
    meterId: 'MTR-FBD-83402', meterBrand: 'Genus', meterMake: 'Genus Innovation Ltd.', meterType: 'Smart AMR', meterInstallDate: '19 Dec 2021', lastReadingDate: '01 Mar 2026', currentReading: 8740, previousReading: 8510, meterStatus: 'Active',
  },
  {
    id: 12, name: 'Amit Kumar', category: 'Commercial', live: false, photo: PHOTO_SENIOR,
    phone: '+91 87654 32109', email: 'amit.enterprises@biz.in',
    flat: 'SF-22', building: 'Shipra Mall', area: 'Indirapuram', city: 'Ghaziabad', state: 'Uttar Pradesh', pincode: '201014',
    consumerNo: 'GZB-COM-028022', connectionDate: '08 Mar 2011', connectionType: 'Three Phase', sanctionedLoad: '30 kW', tariffCategory: 'LT-2 Non-Domestic', supplyVoltage: '415V', billCycle: 'Monthly',
    meterId: 'MTR-GZB-25022', meterBrand: 'Secure', meterMake: 'Secure Meters Ltd.', meterType: 'Smart AMI', meterInstallDate: '10 Mar 2011', lastReadingDate: '28 Feb 2026', currentReading: 234560, previousReading: 233780, meterStatus: 'Active',
  },
  {
    id: 13, name: 'Priya Sharma', category: 'Residential', live: true, photo: PHOTO_WOMAN_PRO,
    phone: '+91 86543 21098', email: 'priya.sharma@email.com',
    flat: 'E-603', building: 'Lotus Tower', area: 'Sector 79', city: 'Noida', state: 'Uttar Pradesh', pincode: '201311',
    consumerNo: 'NDA-RES-030603', connectionDate: '25 Sep 2022', connectionType: 'Single Phase', sanctionedLoad: '5 kW', tariffCategory: 'LT-1 Domestic', supplyVoltage: '230V', billCycle: 'Monthly',
    meterId: 'MTR-NDA-91603', meterBrand: 'Itron', meterMake: 'Itron India Ltd.', meterType: 'Smart AMR', meterInstallDate: '27 Sep 2022', lastReadingDate: '01 Mar 2026', currentReading: 5820, previousReading: 5590, meterStatus: 'Active',
  },
  {
    id: 14, name: 'Ravi Gupta', category: 'Industrial', live: true, photo: PHOTO_ENGINEER,
    phone: '+91 85432 10987', email: 'ravi.gupta@manufacturing.com',
    flat: 'Plot 42', building: 'IMT Manesar', area: 'IMT Industrial Area', city: 'Manesar', state: 'Haryana', pincode: '122051',
    consumerNo: 'MNS-IND-032042', connectionDate: '14 May 2016', connectionType: 'Three Phase HT', sanctionedLoad: '500 kW', tariffCategory: 'HT-Industrial', supplyVoltage: '33 kV', billCycle: 'Monthly',
    meterId: 'MTR-MNS-61042', meterBrand: 'ABB', meterMake: 'ABB India Ltd.', meterType: 'Trivector ABT', meterInstallDate: '17 May 2016', lastReadingDate: '01 Mar 2026', currentReading: 2345800, previousReading: 2336500, meterStatus: 'Active',
  },
  {
    id: 15, name: 'Neha Verma', category: 'Agricultural', live: false, photo: PHOTO_WOMAN_OUT,
    phone: '+91 84321 09876', email: 'neha.farm@mail.com',
    flat: 'Khasra No. 312', building: 'Village Dadri', area: 'Dadri Rural', city: 'Greater Noida', state: 'Uttar Pradesh', pincode: '203207',
    consumerNo: 'GNA-AGR-034312', connectionDate: '06 Jan 2014', connectionType: 'Single Phase', sanctionedLoad: '7.5 kW', tariffCategory: 'LT-5 Agriculture', supplyVoltage: '230V', billCycle: 'Monthly',
    meterId: 'MTR-GNA-42312', meterBrand: 'Genus', meterMake: 'Genus Innovation Ltd.', meterType: 'Agricultural Feeder', meterInstallDate: '08 Jan 2014', lastReadingDate: '28 Feb 2026', currentReading: 38450, previousReading: 38200, meterStatus: 'Active',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const CAT_META: Record<ConsumerCategory, { color: string; icon: React.ElementType }> = {
  Residential:  { color: '#1565C0', icon: Home },
  Commercial:   { color: '#0288D1', icon: Building2 },
  Agricultural: { color: '#43A047', icon: Sprout },
  Industrial:   { color: '#E65100', icon: Factory },
};

function LiveDot({ live }: { live: boolean }) {
  return (
    <span className="relative flex items-center justify-center" style={{ width: 9, height: 9 }}>
      <span className="absolute inline-flex rounded-full" style={{ width: 9, height: 9, background: live ? '#22c55e' : '#ef4444', opacity: 0.35, animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) infinite' }} />
      <span className="relative inline-flex rounded-full" style={{ width: 6, height: 6, background: live ? '#22c55e' : '#ef4444' }} />
    </span>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  const { settings } = useTheme();
  const textMain  = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const textMuted = settings.darkMode ? '#78909c' : '#546e7a';
  return (
    <div className="flex items-start justify-between gap-2 py-2.5" style={{ borderBottom: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
      <span style={{ fontSize: '0.72rem', color: textMuted, minWidth: 110, flexShrink: 0, fontFamily: `var(--md-font-family, ${settings.fontFamily})` }}>{label}</span>
      <span style={{ fontSize: '0.73rem', color: textMain, fontWeight: 500, textAlign: 'right', fontFamily: mono ? 'monospace' : `var(--md-font-family, ${settings.fontFamily})` }}>{value}</span>
    </div>
  );
}

function SectionCard({ icon: Icon, title, color, children }: { icon: React.ElementType; title: string; color: string; children: React.ReactNode }) {
  const { settings } = useTheme();
  const cardBg  = settings.darkMode ? '#1e1e1e' : '#fff';
  const border  = settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  return (
    <div className="rounded-2xl p-4 mb-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: `var(--md-font-family, ${settings.fontFamily})` }}>{title}</span>
      </div>
      <div className="mt-1">
        {children}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
interface ConsumersPageProps {
  onBack?: () => void;
}

export function ConsumersPage({ onBack }: ConsumersPageProps) {
  const { settings } = useTheme();
  const ds = getDensitySpacing(settings.density);

  const [search, setSearch]               = useState('');
  const [filterCat, setFilterCat]         = useState<ConsumerCategory | 'All'>('All');
  const [filterStatus, setFilterStatus]   = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedId, setSelectedId]       = useState<number>(() => {
    const pending = localStorage.getItem('pendingConsumerId');
    if (pending) {
      localStorage.removeItem('pendingConsumerId');
      return parseInt(pending, 10);
    }
    return 1;
  });
  const [showFilter, setShowFilter]       = useState(false);

  // ── Actions dropdown + disconnect state ──────────────────────────────────
  const [showActions, setShowActions]           = useState(false);
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);
  const [disconnectedIds, setDisconnectedIds]   = useState<Set<number>>(new Set());
  const actionsRef = useRef<HTMLDivElement>(null);

  // ── Meter reading fetch state ─────────────────────────────────────────────
  const [readingOverrides, setReadingOverrides] = useState<Record<number, number>>({});
  const [fetchingReading, setFetchingReading]   = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const textMain  = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const textMuted = settings.darkMode ? '#78909c' : '#546e7a';
  const pageBg    = settings.darkMode ? '#111111' : '#f0f4fc';
  const cardBg    = settings.darkMode ? '#1e1e1e' : '#fff';
  const border    = settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const surface   = settings.darkMode ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08`;
  const rowHover  = settings.darkMode ? 'rgba(255,255,255,0.06)' : `${settings.primaryColor}08`;
  const ff        = `var(--md-font-family, ${settings.fontFamily})`;

  const filtered = useMemo(() => {
    return CONSUMERS_DATA.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.consumerNo.toLowerCase().includes(search.toLowerCase()) ||
                          c.meterId.toLowerCase().includes(search.toLowerCase());
      const matchCat    = filterCat === 'All' || c.category === filterCat;
      const matchStatus = filterStatus === 'All' || (filterStatus === 'Active' ? c.live : !c.live);
      return matchSearch && matchCat && matchStatus;
    });
  }, [search, filterCat, filterStatus]);

  const selected = CONSUMERS_DATA.find(c => c.id === selectedId) ?? CONSUMERS_DATA[0];
  const catMeta  = CAT_META[selected.category];
  // Effective live status (accounts for UI-level disconnects)
  const effectiveLive = selected.live && !disconnectedIds.has(selected.id);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>
      <style>{`@keyframes ping { 75%,100% { transform:scale(2); opacity:0; } }`}</style>

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}
      >
        {onBack && (
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={onBack}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: surface, border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(21,101,192,0.15)'}` }}
          >
            <ArrowLeft size={15} style={{ color: settings.primaryColor }} />
          </motion.button>
        )}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${settings.primaryColor}18` }}>
          <Users size={16} style={{ color: settings.primaryColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold leading-none" style={{ fontSize: '0.85rem', color: textMain }}>Consumer Management</h2>
          <p className="mt-0.5 truncate" style={{ fontSize: '0.68rem', color: textMuted }}>
            1,36,000 total consumers · {(122400 - disconnectedIds.size).toLocaleString('en-IN')} active
          </p>
        </div>
        {/* Summary chips — removed */}
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 gap-0">

        {/* ── LEFT: Consumer List ─────────────────────────────────────────── */}
        <div
          className="flex flex-col shrink-0 overflow-hidden"
          style={{ width: 300, borderRight: `1px solid ${border}` }}
        >
          {/* Search + filter bar */}
          <div className="px-3 py-2.5 shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: surface, border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(21,101,192,0.12)'}` }}>
              <Search size={12} style={{ color: textMuted, flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, ID…"
                className="flex-1 bg-transparent outline-none min-w-0"
                style={{ fontSize: '0.73rem', color: textMain, fontFamily: ff }}
              />
              {search && <button onClick={() => setSearch('')}><X size={11} style={{ color: textMuted }} /></button>}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              {(['All','Active','Inactive'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className="flex-1 py-1 rounded-lg transition-all"
                  style={{
                    fontSize: '0.65rem', fontWeight: 600,
                    background: filterStatus === s ? settings.primaryColor : (settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                    color: filterStatus === s ? '#fff' : textMuted,
                  }}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => setShowFilter(f => !f)}
                className="w-7 h-6 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: showFilter ? `${settings.primaryColor}18` : (settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                  color: showFilter ? settings.primaryColor : textMuted,
                  border: `1px solid ${showFilter ? `${settings.primaryColor}30` : 'transparent'}`,
                }}
              >
                <SlidersHorizontal size={11} />
              </button>
            </div>

            {/* Category filter dropdown */}
            <AnimatePresence>
              {showFilter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }}
                  className="overflow-hidden mt-2"
                >
                  <div className="flex flex-wrap gap-1">
                    {(['All', 'Residential', 'Commercial', 'Agricultural', 'Industrial'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilterCat(cat as ConsumerCategory | 'All')}
                        className="px-2 py-0.5 rounded-full transition-all"
                        style={{
                          fontSize: '0.625rem', fontWeight: 600,
                          background: filterCat === cat
                            ? (cat === 'All' ? settings.primaryColor : CAT_META[cat as ConsumerCategory]?.color ?? settings.primaryColor)
                            : (settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                          color: filterCat === cat ? '#fff' : textMuted,
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Count */}
          <div className="px-3 py-1.5 shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
            {(() => {
              const isFiltered = search.trim() !== '' || filterCat !== 'All' || filterStatus !== 'All';
              return (
                <span style={{ fontSize: '0.65rem', color: textMuted, fontFamily: ff }}>
                  {isFiltered
                    ? <>{filtered.length} result{filtered.length !== 1 ? 's' : ''} <span style={{ opacity: 0.6 }}>of 1,36,000 consumers</span></>
                    : <>1,36,000 consumers</>
                  }
                </span>
              );
            })()}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Users size={28} style={{ color: textMuted, opacity: 0.4 }} />
                <p style={{ fontSize: '0.75rem', color: textMuted }}>No consumers found</p>
              </div>
            ) : (
              filtered.map((c, i) => {
                const isSelected = c.id === selectedId;
                const cm = CAT_META[c.category];
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedId(c.id)}
                    className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-all relative"
                    style={{
                      background: isSelected
                        ? (settings.darkMode ? `${settings.primaryColor}20` : `${settings.primaryColor}10`)
                        : 'transparent',
                      borderBottom: `1px solid ${border}`,
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = rowHover; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full" style={{ background: settings.primaryColor }} />
                    )}
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-xl overflow-hidden" style={{ border: `2px solid ${isSelected ? settings.primaryColor : border}` }}>
                        <ImageWithFallback src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <LiveDot live={c.live} />
                      </div>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 justify-between">
                        <span className="font-semibold truncate" style={{ fontSize: '0.74rem', color: isSelected ? settings.primaryColor : textMain }}>{c.name}</span>
                        <ChevronRight size={11} style={{ color: isSelected ? settings.primaryColor : textMuted, opacity: 0.5, flexShrink: 0 }} />
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: '0.625rem', fontWeight: 600, background: `${cm.color}18`, color: cm.color }}>
                          {c.category}
                        </span>
                        <span style={{ fontSize: '0.625rem', color: textMuted }}>{c.consumerNo}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT: Detail Panel ─────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex-1 min-w-0 overflow-y-auto"
            style={{ padding: ds.pad }}
          >
            {/* ── Consumer Profile Hero ─────────────────────────────────── */}
            <div className="rounded-2xl p-4 mb-3 flex items-start gap-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
              {/* Photo */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden" style={{ border: `3px solid ${catMeta.color}30` }}>
                  <ImageWithFallback src={selected.photo} alt={selected.name} className="w-full h-full object-cover" />
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: effectiveLive ? '#22c55e' : '#ef4444', border: `2px solid ${cardBg}` }}
                >
                  {effectiveLive
                    ? <CheckCircle size={10} color="#fff" />
                    : <XCircle size={10} color="#fff" />}
                </div>
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h2 className="font-bold" style={{ fontSize: '1.1rem', color: textMain, fontFamily: ff }}>{selected.name}</h2>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ fontSize: '0.65rem', fontWeight: 700, background: `${catMeta.color}18`, color: catMeta.color, border: `1px solid ${catMeta.color}25` }}>
                        {React.createElement(catMeta.icon, { size: 9 })} {selected.category}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: textMuted, fontFamily: 'monospace' }}>{selected.consumerNo}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status chip */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl" style={{ background: effectiveLive ? '#dcfce7' : '#fee2e2', border: `1px solid ${effectiveLive ? '#bbf7d0' : '#fecaca'}` }}>
                      <LiveDot live={effectiveLive} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: effectiveLive ? '#15803d' : '#dc2626' }}>
                        {effectiveLive ? 'Active' : 'Disconnected'}
                      </span>
                    </div>

                    {/* ── Actions dropdown ─────────────────────────────── */}
                    <div ref={actionsRef} className="relative">
                      <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setShowActions(v => !v)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all"
                        style={{
                          background: showActions
                            ? `${settings.primaryColor}15`
                            : (settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'),
                          border: `1px solid ${showActions ? `${settings.primaryColor}35` : border}`,
                          color: showActions ? settings.primaryColor : textMain,
                        }}
                      >
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, fontFamily: ff }}>Actions</span>
                        <MoreVertical size={12} />
                      </motion.button>

                      <AnimatePresence>
                        {showActions && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.14 }}
                            className="absolute right-0 top-full mt-1.5 z-50"
                            style={{ minWidth: 164 }}
                          >
                            <div className="rounded-lg p-1" style={{ background: '#fff', border: '1px solid #e5e5e5', boxShadow: '4px 4px 8px rgba(193,252,211,0.2), 0 6px 20px rgba(0,0,0,0.12)' }}>
                              {/* Change TOD */}
                              <button
                                className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded text-left transition-colors hover:bg-black/5"
                                style={{ fontSize: '0.8rem', color: '#111' }}
                                onClick={() => { setShowActions(false); toast.success('Time-of-Day schedule updated', { description: `TOD updated for ${selected.name}` }); }}
                              >
                                <Clock size={13} style={{ color: '#555', flexShrink: 0 }} />
                                Change TOD
                              </button>
                              {/* Set Recovery */}
                              <button
                                className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded text-left transition-colors hover:bg-black/5"
                                style={{ fontSize: '0.8rem', color: '#111' }}
                                onClick={() => { setShowActions(false); toast.success('Recovery plan configured', { description: `Recovery set for ${selected.name}` }); }}
                              >
                                <RefreshCw size={13} style={{ color: '#555', flexShrink: 0 }} />
                                Set Recovery
                              </button>
                              {/* Flat rate — highlighted as active */}
                              <button
                                className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded text-left transition-colors hover:bg-black/5"
                                style={{ fontSize: '0.8rem', color: '#111' }}
                                onClick={() => { setShowActions(false); toast.success('Flat rate tariff applied', { description: `Tariff updated for ${selected.name}` }); }}
                              >
                                <Tag size={13} style={{ color: '#555', flexShrink: 0 }} />
                                Flat rate
                              </button>
                              {/* Protect meter */}
                              <button
                                className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded text-left transition-colors hover:bg-black/5"
                                style={{ fontSize: '0.8rem', color: '#111' }}
                                onClick={() => { setShowActions(false); toast.success('Meter protection enabled', { description: `Protection activated for ${selected.meterId}` }); }}
                              >
                                <Shield size={13} style={{ color: '#555', flexShrink: 0 }} />
                                Protect meter
                              </button>
                              {/* Divider */}
                              <div style={{ height: 1, background: '#e5e5e5', margin: '3px 8px' }} />
                              {/* Disconnect */}
                              <button
                                className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded text-left transition-colors hover:bg-red-50"
                                style={{ fontSize: '0.8rem', color: '#ec3636' }}
                                onClick={() => { setShowActions(false); setShowConfirmDisconnect(true); }}
                              >
                                <WifiOff size={13} style={{ color: '#ec3636', flexShrink: 0 }} />
                                Disconnect
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Contact row */}
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} style={{ color: textMuted }} />
                    <span style={{ fontSize: '0.72rem', color: textMain, fontFamily: ff }}>{selected.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} style={{ color: textMuted }} />
                    <span style={{ fontSize: '0.72rem', color: textMain, fontFamily: ff }}>{selected.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Meter Reading Comparison ───────────────────────────────── */}
            <div className="rounded-2xl p-4 mb-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${settings.primaryColor}18` }}>
                    <Cpu size={14} style={{ color: settings.primaryColor }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Meter Reading</span>
                </div>
                {/* Fetch button */}
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  disabled={fetchingReading}
                  onClick={() => {
                    setFetchingReading(true);
                    setTimeout(() => {
                      const base = readingOverrides[selected.id] ?? selected.currentReading;
                      const increment = Math.floor(Math.random() * 18) + 3; // +3 to +20 kWh
                      const newReading = base + increment;
                      setReadingOverrides(prev => ({ ...prev, [selected.id]: newReading }));
                      setFetchingReading(false);
                      toast.success('Reading updated', {
                        description: `${selected.meterId}: ${newReading.toLocaleString()} kWh (+${increment} kWh)`,
                      });
                    }, 1200);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all"
                  style={{
                    fontSize: '0.7rem', fontWeight: 600, fontFamily: ff,
                    background: fetchingReading ? `${settings.primaryColor}10` : `${settings.primaryColor}15`,
                    border: `1px solid ${settings.primaryColor}30`,
                    color: settings.primaryColor,
                    opacity: fetchingReading ? 0.7 : 1,
                    cursor: fetchingReading ? 'not-allowed' : 'pointer',
                  }}
                >
                  <motion.span
                    animate={fetchingReading ? { rotate: 360 } : { rotate: 0 }}
                    transition={fetchingReading ? { repeat: Infinity, duration: 0.8, ease: 'linear' } : {}}
                    style={{ display: 'flex' }}
                  >
                    <RefreshCw size={11} />
                  </motion.span>
                  {fetchingReading ? 'Fetching…' : 'Fetch current reading'}
                </motion.button>
              </div>
              <div className="rounded-xl p-3" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}06`, border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.06)' : `${settings.primaryColor}15`}` }}>
                {(() => {
                  const liveReading = readingOverrides[selected.id] ?? selected.currentReading;
                  const consumed = liveReading - selected.previousReading;
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center gap-0.5">
                        <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>Previous</span>
                        <span className="font-bold tabular-nums" style={{ fontSize: '1rem', color: textMuted }}>{selected.previousReading.toLocaleString()}</span>
                        <span style={{ fontSize: '0.625rem', color: textMuted }}>kWh</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <ChevronRight size={16} style={{ color: settings.primaryColor }} />
                        <motion.span
                          key={consumed}
                          initial={{ scale: 1.3, color: '#16a34a' }}
                          animate={{ scale: 1, color: '#2E7D32' }}
                          transition={{ duration: 0.4 }}
                          className="font-bold tabular-nums"
                          style={{ fontSize: '0.725rem' }}
                        >
                          +{consumed.toLocaleString()}
                        </motion.span>
                        <span style={{ fontSize: '0.625rem', color: '#2E7D32' }}>consumed</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span style={{ fontSize: '0.625rem', color: textMuted, fontFamily: ff }}>Current</span>
                        <motion.span
                          key={liveReading}
                          initial={{ scale: 1.15 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          className="font-bold tabular-nums"
                          style={{ fontSize: '1rem', color: settings.primaryColor }}
                        >
                          {liveReading.toLocaleString()}
                        </motion.span>
                        <span style={{ fontSize: '0.625rem', color: textMuted }}>kWh</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* ── Address ───────────────────────────────────────────────── */}
            <SectionCard icon={MapPin} title="Address" color="#1565C0">
              <InfoRow label="Flat / Door No." value={selected.flat} />
              <InfoRow label="Building / Society" value={selected.building} />
              <InfoRow label="Area / Locality" value={selected.area} />
              <InfoRow label="City" value={selected.city} />
              <InfoRow label="State" value={selected.state} />
              <InfoRow label="Pincode" value={selected.pincode} mono />
            </SectionCard>

            {/* ── Connection Information ─────────────────────────────────── */}
            <SectionCard icon={Zap} title="Connection Information" color={settings.primaryColor}>
              <InfoRow label="Consumer No." value={selected.consumerNo} mono />
              <InfoRow label="Connection Date" value={selected.connectionDate} />
              <InfoRow label="Connection Type" value={selected.connectionType} />
              <InfoRow label="Sanctioned Load" value={selected.sanctionedLoad} />
              <InfoRow label="Tariff Category" value={selected.tariffCategory} />
              <InfoRow label="Supply Voltage" value={selected.supplyVoltage} />
              <InfoRow label="Bill Cycle" value={selected.billCycle} />
            </SectionCard>

            {/* ── Meter Information ─────────────────────────────────────── */}
            <SectionCard icon={Cpu} title="Meter Information" color="#E65100">
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: ff }}>Meter Status</span>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    fontSize: '0.625rem', fontWeight: 700,
                    background: selected.meterStatus === 'Active' ? '#dcfce7' : selected.meterStatus === 'Faulty' ? '#fee2e2' : '#fef9c3',
                    color: selected.meterStatus === 'Active' ? '#15803d' : selected.meterStatus === 'Faulty' ? '#dc2626' : '#a16207',
                  }}
                >
                  {selected.meterStatus}
                </span>
              </div>
              <InfoRow label="Meter ID" value={selected.meterId} mono />
              <InfoRow label="Meter Brand" value={selected.meterBrand} />
              <InfoRow label="Meter Make" value={selected.meterMake} />
              <InfoRow label="Meter Type" value={selected.meterType} />
              <InfoRow label="Install Date" value={selected.meterInstallDate} />
              <InfoRow label="Last Reading Date" value={selected.lastReadingDate} />
            </SectionCard>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Disconnect Confirmation Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showConfirmDisconnect && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
              onClick={() => setShowConfirmDisconnect(false)}
            />
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-0 z-50 m-auto h-fit rounded-2xl p-6 flex flex-col items-center gap-4"
              style={{
                width: 340,
                background: cardBg,
                border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
              }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#fee2e2' }}>
                <WifiOff size={26} style={{ color: '#dc2626' }} />
              </div>

              {/* Text */}
              <div className="text-center">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: textMain, fontFamily: ff }}>Disconnect Consumer?</h3>
                <p className="mt-1.5" style={{ fontSize: '0.78rem', color: textMuted, lineHeight: 1.55, fontFamily: ff }}>
                  You are about to disconnect <strong style={{ color: textMain }}>{selected.name}</strong> ({selected.consumerNo}).
                  The supply will be cut immediately. This action can be reversed.
                </p>
              </div>

              {/* Alert note */}
              <div className="w-full flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                <AlertTriangle size={13} style={{ color: '#c2410c', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: '0.68rem', color: '#9a3412', lineHeight: 1.5 }}>
                  Ensure field team is notified. Disconnection will be logged with timestamp.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 w-full mt-1">
                <button
                  className="flex-1 py-2.5 rounded-xl transition-all"
                  style={{ background: settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', color: textMuted, fontSize: '0.8rem', fontWeight: 600, fontFamily: ff }}
                  onClick={() => setShowConfirmDisconnect(false)}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                  style={{ background: '#dc2626', color: '#fff', fontSize: '0.8rem', fontWeight: 700, fontFamily: ff }}
                  onClick={() => {
                    setDisconnectedIds(prev => new Set(prev).add(selected.id));
                    setShowConfirmDisconnect(false);
                    toast.error('Consumer Disconnected', {
                      description: `${selected.name} (${selected.consumerNo}) has been disconnected successfully.`,
                      duration: 5000,
                    });
                  }}
                >
                  <WifiOff size={13} />
                  Yes, Disconnect
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}