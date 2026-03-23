import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Bell, Sun, Moon, ChevronDown, User, Settings as SettingsIcon, LogOut,
  ChevronRight, PanelLeft,
  LayoutDashboard, Users, Cpu, Activity, BarChart3,
  TrendingUp, FlaskConical, AlertCircle, FileText,
  LayoutGrid, Check, X, Mail, Phone, MapPin, Shield, Clock, Building2, Camera,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';
import { getPrimaryBg } from '../../context/ThemeContext';
import Subtract from '../../../imports/Subtract';

const primaryNavItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'consumers', icon: Users, label: 'Consumers' },
  { id: 'assets', icon: Cpu, label: 'Assets' },
  { id: 'load', icon: Activity, label: 'Load Monitor' },
  { id: 'revenue', icon: BarChart3, label: 'Revenue' },
];

const moreNavItems = [
  { id: 'forecast', icon: TrendingUp, label: 'Forecasting', badge: 0 },
  { id: 'studies', icon: FlaskConical, label: 'Studies', badge: 0 },
  { id: 'alerts', icon: AlertCircle, label: 'Alerts', badge: 7 },
  { id: 'reports', icon: FileText, label: 'Reports', badge: 0 },
  { id: 'settings', icon: SettingsIcon, label: 'Settings', badge: 0 },
];

interface TopNavBarProps {
  onNavigate?: (page: string) => void;
  onToggleSideNav?: () => void;
  sideNavCollapsed?: boolean;
  navMode?: 'side' | 'top';
  onNavModeChange?: (mode: 'side' | 'top') => void;
  activePage?: string;
  onLogout?: () => void;
}

export function TopNavBar({
  onNavigate, onToggleSideNav, sideNavCollapsed,
  navMode = 'side', onNavModeChange, activePage, onLogout,
}: TopNavBarProps) {
  const { settings, updateSettings } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [cardsOpen, setCardsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(
    'https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjJidXNpbmVzcyUyMG1hbiUyMHN1aXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzM3MjIwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setProfileImage(ev.target.result as string);
        toast.success('Profile photo updated!');
      }
    };
    reader.readAsDataURL(file);
    // reset so the same file can be re-selected
    e.target.value = '';
  };

  const moreRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const textMain = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const inactiveColor = settings.darkMode ? '#78909c' : '#78909c';
  const dropdownBg = settings.darkMode ? '#252525' : '#fff';
  const dropdownBorder = settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  const isMoreActive = moreNavItems.some(item => item.id === activePage);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    if (moreOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moreOpen]);

  // Close "Cards" dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cardsRef.current && !cardsRef.current.contains(e.target as Node)) {
        setCardsOpen(false);
      }
    };
    if (cardsOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [cardsOpen]);

  const notifications = [
    { id: 1, type: 'critical', message: 'Transformer T-204 fault detected', time: '2m ago' },
    { id: 2, type: 'warning', message: 'Feeder F-12 overload: 98% capacity', time: '8m ago' },
    { id: 3, type: 'info', message: 'Load forecast updated for Zone 3', time: '15m ago' },
    { id: 4, type: 'critical', message: 'Voltage fluctuation in Sector 7', time: '22m ago' },
  ];

  const systemStatus = 'Normal';
  const statusConfig = {
    Normal: { color: '#2E7D32', bg: '#E8F5E9', dot: '#4CAF50' },
    Warning: { color: '#E65100', bg: '#FFF3E0', dot: '#FF9800' },
    Critical: { color: '#C62828', bg: '#FFEBEE', dot: '#F44336' },
  };
  const status = statusConfig[systemStatus as keyof typeof statusConfig];

  const DASHBOARD_CARDS: { id: string; label: string; group: string; icon: string }[] = [
    { id: 'micro-health',  label: 'Grid Health',    group: 'Micro Widgets', icon: '⚡' },
    { id: 'micro-freq',    label: 'Grid Frequency',  group: 'Micro Widgets', icon: '〰️' },
    { id: 'micro-pf',      label: 'Power Factor',    group: 'Micro Widgets', icon: '📐' },
    { id: 'micro-losses',  label: 'Energy Losses',   group: 'Micro Widgets', icon: '📉' },
    { id: 'consumer',      label: 'Consumer',         group: 'Main Cards',    icon: '👥' },
    { id: 'powerbalance',  label: 'Power Balance',    group: 'Main Cards',    icon: '⚖️' },
    { id: 'alerts',        label: 'Alerts',           group: 'Main Cards',    icon: '🚨' },
    { id: 'revenue',       label: 'Revenue',          group: 'Main Cards',    icon: '💰' },
    { id: 'forecast',      label: 'Forecast',         group: 'Main Cards',    icon: '🔮' },
    { id: 'assets',        label: 'Assets',           group: 'Main Cards',    icon: '🏗️' },
    { id: 'studies',       label: 'Studies',          group: 'Main Cards',    icon: '🧪' },
  ];

  const visibleCards = settings.visibleCards ?? DASHBOARD_CARDS.map(c => c.id);
  const hiddenCount = DASHBOARD_CARDS.length - visibleCards.length;

  const toggleCard = (id: string) => {
    const next = visibleCards.includes(id)
      ? visibleCards.filter(c => c !== id)
      : [...visibleCards, id];
    updateSettings({ visibleCards: next });
  };

  return (
    <>
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex items-center gap-2 px-3 h-full relative transition-all duration-200"
      style={{
        fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
        background: isDragOver
          ? (settings.darkMode ? `${settings.primaryColor}18` : `${settings.primaryColor}0a`)
          : 'transparent',
        outline: isDragOver ? `2px dashed ${settings.primaryColor}80` : 'none',
        outlineOffset: '-4px',
        borderRadius: isDragOver ? '18px' : undefined,
      }}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('application/nav-items') && navMode === 'side') {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setIsDragOver(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.getData('application/nav-items') === 'true') {
          onNavModeChange?.('top');
        }
      }}
    >

      {/* ── Drop zone overlay hint ─────────────────────────────────────── */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 rounded-2xl"
          >
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                background: `${settings.primaryColor}25`,
                color: settings.primaryColor,
                border: `1px solid ${settings.primaryColor}50`,
              }}
            >
              <PanelLeft size={14} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                Drop to move navigation here
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating sidebar toggle — hidden in top mode ───────────────── */}
      {onToggleSideNav && navMode === 'side' && (
        <motion.button
          onClick={onToggleSideNav}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          title={sideNavCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{
            position: 'fixed',
            left: sideNavCollapsed ? 52 : 208,
            top: 92,
            zIndex: 40,
            background: settings.darkMode ? '#252525' : '#ffffff',
            backgroundColor: settings.darkMode ? '#252525' : '#ffffff',
            border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.14)' : 'rgba(21,101,192,0.2)'}`,
            boxShadow: settings.darkMode
              ? '0 4px 20px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.3)'
              : '0 4px 16px rgba(21,101,192,0.18), 0 1px 4px rgba(0,0,0,0.08)',
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            isolation: 'isolate',
          }}
        >
          <motion.div
            animate={{ rotate: sideNavCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ChevronRight size={15} style={{ color: settings.darkMode ? '#aaa' : '#546e7a' }} />
          </motion.div>
        </motion.button>
      )}

      {/* ── Logo + brand ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 min-w-0 shrink-0 ml-0.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md overflow-hidden shrink-0"
          style={{ background: getPrimaryBg(settings) }}
        >
          <div className="w-4 h-5" style={{ '--fill-0': 'white' } as React.CSSProperties}>
            <Subtract />
          </div>
        </div>
        <div className="hidden md:block">
          <div
            className="text-xs font-medium opacity-60"
            style={{
              fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
              color: settings.darkMode ? '#fff' : '#1a1a2e',
            }}
          >
            SOURABH
          </div>
          <div
            className="font-semibold leading-none"
            style={{
              fontSize: '0.8rem',
              fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
              color: settings.primaryColor,
            }}
          >
            Grid Intelligence
          </div>
        </div>
      </div>

      {/* ── Horizontal nav — only in top mode ────────────────────────────── */}
      <AnimatePresence>
        {navMode === 'top' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex items-center gap-0.5 mx-3 flex-1 min-w-0"
          >
            {/* Primary nav items */}
            {primaryNavItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all relative shrink-0"
                  style={{
                    background: isActive ? `${settings.primaryColor}18` : 'transparent',
                    color: isActive ? settings.primaryColor : inactiveColor,
                    fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="topNavActiveBar"
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
                      style={{ background: settings.primaryColor, width: '55%' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon size={13} />
                  <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 600 : 400 }}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}

            {/* More dropdown */}
            <div ref={moreRef} className="relative shrink-0">
              <motion.button
                onClick={() => setMoreOpen(!moreOpen)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all"
                style={{
                  background: isMoreActive ? `${settings.primaryColor}18` : 'transparent',
                  color: isMoreActive ? settings.primaryColor : inactiveColor,
                  fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: isMoreActive ? 600 : 400 }}>More</span>
                <motion.div
                  animate={{ rotate: moreOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={11} />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1.5 w-48 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5"
                    style={{
                      background: dropdownBg,
                      border: `1px solid ${dropdownBorder}`,
                    }}
                  >
                    {moreNavItems.map((item) => {
                      const isActive = activePage === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => { onNavigate?.(item.id); setMoreOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors"
                          style={{
                            background: isActive
                              ? `${settings.primaryColor}12`
                              : 'transparent',
                            fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
                          }}
                          onMouseEnter={e => {
                            if (!isActive) (e.currentTarget as HTMLElement).style.background =
                              settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
                          }}
                          onMouseLeave={e => {
                            if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                          }}
                        >
                          <item.icon
                            size={13}
                            style={{ color: isActive ? settings.primaryColor : inactiveColor }}
                          />
                          <span
                            style={{
                              fontSize: '0.78rem',
                              color: isActive ? settings.primaryColor : textMain,
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {item.label}
                          </span>
                          {item.badge > 0 && (
                            <span
                              className="ml-auto w-4 h-4 rounded-full text-white flex items-center justify-center shrink-0"
                              style={{ fontSize: '9px', background: '#F44336' }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Restore sidebar button */}
            <motion.button
              onClick={() => onNavModeChange?.('side')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Restore sidebar navigation"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ml-1 shrink-0 transition-all"
              style={{
                color: inactiveColor,
                border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
                opacity: 0.65,
              }}
            >
              <PanelLeft size={12} />
              <span style={{ fontSize: '0.7rem' }}>Sidebar</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Right Section ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">

        {/* Collapsible Search */}
        <div className="relative flex items-center">
          <motion.div
            className="flex items-center overflow-hidden rounded-full"
            animate={{ width: searchFocused ? 220 : 32 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              height: 32,
              minHeight: 32,
              background: searchFocused
                ? (settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(25,118,210,0.07)')
                : (settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
              border: `1px solid ${searchFocused ? settings.primaryColor : 'transparent'}`,
              boxShadow: searchFocused ? `0 0 0 2px ${settings.primaryColor}22` : 'none',
            }}
            onMouseEnter={() => setSearchFocused(true)}
            onMouseLeave={(e) => {
              const input = e.currentTarget.querySelector('input');
              if (document.activeElement !== input) setSearchFocused(false);
            }}
          >
            <div
              className="w-8 h-8 flex items-center justify-center shrink-0 cursor-pointer"
              style={{ color: searchFocused ? settings.primaryColor : (settings.darkMode ? '#ccc' : '#546e7a') }}
            >
              <Search size={14} />
            </div>
            <input
              type="text"
              placeholder="Search consumers, assets..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="outline-none bg-transparent pr-3 py-2"
              style={{
                fontSize: '0.75rem',
                fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
                color: settings.darkMode ? '#e0e0e0' : '#1a1a2e',
                width: searchFocused ? '180px' : '0px',
                opacity: searchFocused ? 1 : 0,
                pointerEvents: searchFocused ? 'auto' : 'none',
                transition: 'width 0.3s ease, opacity 0.2s ease',
              }}
            />
          </motion.div>
        </div>

        {/* ── Cards Visibility Dropdown ───────────────────────────────────── */}
        <div ref={cardsRef} className="relative">
          <motion.button
            onClick={() => { setCardsOpen(!cardsOpen); setNotifOpen(false); setProfileOpen(false); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-1 h-8 px-2.5 rounded-full transition-all"
            style={{
              background: cardsOpen
                ? (settings.darkMode ? 'rgba(255,255,255,0.1)' : `${settings.primaryColor}12`)
                : (settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
              border: `1px solid ${cardsOpen ? settings.primaryColor : 'transparent'}`,
              boxShadow: cardsOpen ? `0 0 0 2px ${settings.primaryColor}22` : 'none',
              color: cardsOpen ? settings.primaryColor : (settings.darkMode ? '#ccc' : '#546e7a'),
            }}
            title="Toggle dashboard cards"
          >
            <LayoutGrid size={14} />
            <motion.div
              animate={{ rotate: cardsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={12} />
            </motion.div>
            {hiddenCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                style={{ fontSize: '8px', fontWeight: 700, background: settings.secondaryColor }}
              >
                {hiddenCount}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {cardsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 rounded-2xl shadow-2xl z-50 overflow-hidden"
                style={{
                  width: 230,
                  background: dropdownBg,
                  border: `1px solid ${dropdownBorder}`,
                  fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
                }}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: `1px solid ${dropdownBorder}` }}
                >
                  <div className="flex items-center gap-2">
                    <LayoutGrid size={13} style={{ color: settings.primaryColor }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: textMain }}>Dashboard Cards</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ fontSize: '10px', fontWeight: 600, background: `${settings.primaryColor}18`, color: settings.primaryColor }}
                  >
                    {visibleCards.length}/{DASHBOARD_CARDS.length}
                  </span>
                </div>

                {/* Card groups */}
                <div className="py-2 max-h-80 overflow-y-auto">
                  {(['Micro Widgets', 'Main Cards'] as const).map(group => (
                    <div key={group}>
                      {/* Group label */}
                      <div
                        className="px-4 pt-2 pb-1"
                        style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: settings.darkMode ? '#546e7a' : '#90a4ae' }}
                      >
                        {group}
                      </div>
                      {DASHBOARD_CARDS.filter(c => c.group === group).map(card => {
                        const isVisible = visibleCards.includes(card.id);
                        return (
                          <button
                            key={card.id}
                            onClick={() => toggleCard(card.id)}
                            className="w-full flex items-center gap-3 px-4 py-2 transition-colors"
                            onMouseEnter={e => (e.currentTarget.style.background = settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            style={{ background: 'transparent' }}
                          >
                            {/* Custom checkbox */}
                            <div
                              className="flex items-center justify-center rounded shrink-0 transition-all"
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: 4,
                                background: isVisible ? settings.primaryColor : 'transparent',
                                border: `1.5px solid ${isVisible ? settings.primaryColor : (settings.darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.22)')}`,
                                transition: 'background 0.15s, border-color 0.15s',
                              }}
                            >
                              {isVisible && <Check size={10} color="#fff" strokeWidth={3} />}
                            </div>
                            <span style={{ fontSize: '11px' }}>{card.icon}</span>
                            <span
                              style={{
                                fontSize: '0.78rem',
                                color: isVisible ? textMain : (settings.darkMode ? '#546e7a' : '#aaa'),
                                fontWeight: isVisible ? 500 : 400,
                                transition: 'color 0.15s',
                              }}
                            >
                              {card.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Footer actions */}
                <div
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ borderTop: `1px solid ${dropdownBorder}` }}
                >
                  <button
                    onClick={() => updateSettings({ visibleCards: DASHBOARD_CARDS.map(c => c.id) })}
                    style={{ fontSize: '0.72rem', fontWeight: 600, color: settings.primaryColor }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    Show All
                  </button>
                  <div style={{ width: 1, height: 12, background: dropdownBorder }} />
                  <button
                    onClick={() => {
                      updateSettings({ visibleCards: [] });
                    }}
                    style={{ fontSize: '0.72rem', fontWeight: 600, color: settings.darkMode ? '#78909c' : '#90a4ae' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    Hide All
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System Status Chip */}

        {/* Notifications */}
        <div className="relative">
          <motion.button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
          >
            <Bell size={16} style={{ color: settings.darkMode ? '#ccc' : '#546e7a' }} />
            <span
              className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full text-white flex items-center justify-center"
              style={{ fontSize: '8px', background: '#F44336' }}
            >
              4
            </span>
          </motion.button>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-10 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
              style={{ background: dropdownBg, border: `1px solid ${dropdownBorder}` }}
            >
              <div
                className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
              >
                <span
                  className="font-semibold"
                  style={{ fontSize: '0.85rem', fontFamily: `var(--md-font-family)`, color: textMain }}
                >
                  Notifications
                </span>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{ fontSize: '0.7rem', background: `${settings.primaryColor}20`, color: settings.primaryColor }}
                >
                  4 new
                </span>
              </div>
              {notifications.map(n => (
                <div
                  key={n.id}
                  className="px-4 py-3 flex gap-3 items-start cursor-pointer transition-colors"
                  style={{}}
                  onMouseEnter={e => (e.currentTarget.style.background = settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    className="mt-2 w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: n.type === 'critical' ? '#F44336' : n.type === 'warning' ? '#FF9800' : settings.primaryColor,
                    }}
                  />
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500, fontFamily: `var(--md-font-family)`, color: textMain }}>
                      {n.message}
                    </p>
                    <p className="opacity-50 mt-0.5" style={{ fontSize: '0.7rem', fontFamily: `var(--md-font-family)` }}>
                      {n.time}
                    </p>
                  </div>
                </div>
              ))}
              <div
                className="px-4 py-2.5 border-t text-center"
                style={{ borderColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
              >
                <button
                  style={{ fontSize: '0.75rem', fontWeight: 500, color: settings.primaryColor }}
                >
                  View all alerts
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Theme Toggle */}
        <motion.button
          onClick={() => updateSettings({ darkMode: !settings.darkMode })}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95, rotate: 180 }}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
        >
          {settings.darkMode
            ? <Sun size={16} style={{ color: '#FFD54F' }} />
            : <Moon size={16} style={{ color: '#546e7a' }} />
          }
        </motion.button>

        {/* User Profile */}
        <div className="relative">
          <motion.button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full transition-colors"
            style={{ background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
              <img
                src={profileImage}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="hidden md:block font-medium"
              style={{
                fontSize: '0.75rem',
                fontFamily: `var(--md-font-family)`,
                color: settings.darkMode ? '#e0e0e0' : '#1a1a2e',
              }}
            >
              SOURABH
            </span>
            <motion.span
              animate={{ rotate: profileOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ display: 'flex' }}
            >
              <ChevronDown size={11} style={{ color: settings.darkMode ? '#aaa' : '#546e7a' }} />
            </motion.span>
          </motion.button>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-10 w-64 rounded-2xl shadow-2xl z-50 overflow-hidden"
              style={{ background: dropdownBg, border: `1px solid ${dropdownBorder}` }}
            >
              {/* ── Profile header ── */}
              <div
                className="px-4 py-4"
                style={{ borderBottom: `1px solid ${dropdownBorder}` }}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar + online dot */}
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2" style={{ ringColor: settings.primaryColor }}>
                      <img
                        src={profileImage}
                        alt="Sourabh"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                      style={{ background: '#4CAF50', borderColor: dropdownBg }}
                    />
                  </div>
                  {/* Name + email + role */}
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-semibold truncate"
                      style={{ fontSize: '0.82rem', color: textMain, fontFamily: `var(--md-font-family)` }}
                    >
                      Sourabh Sarsar
                    </p>
                    <p
                      className="truncate"
                      style={{ fontSize: '0.68rem', color: settings.darkMode ? '#78909c' : '#90a4ae', fontFamily: `var(--md-font-family)` }}
                    >
                      sourabhsarsar@discom.com
                    </p>
                    <span
                      className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md"
                      style={{ fontSize: '0.625rem', fontWeight: 700, background: `${settings.primaryColor}18`, color: settings.primaryColor, letterSpacing: '0.03em' }}
                    >
                      <Shield size={8} />
                      Executive Engineer
                    </span>
                  </div>
                </div>
                {/* Zone pill */}
                <div
                  className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                  style={{ background: settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#4CAF50' }} />
                  <span style={{ fontSize: '0.68rem', color: settings.darkMode ? '#90a4ae' : '#78909c', fontFamily: `var(--md-font-family)` }}>
                    All Zones · DISCOM HQ
                  </span>
                  <span
                    className="ml-auto px-1.5 py-0.5 rounded-full"
                    style={{ fontSize: '0.625rem', fontWeight: 600, background: '#4CAF5018', color: '#4CAF50' }}
                  >
                    Online
                  </span>
                </div>
              </div>

              {/* ── Menu items ── */}
              <div className="py-1.5">
                <button
                  onClick={() => { setProfileModalOpen(true); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.background = settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <User size={13} style={{ color: settings.darkMode ? '#aaa' : '#546e7a' }} />
                  <span style={{ fontSize: '0.8rem', fontFamily: `var(--md-font-family)`, color: textMain }}>My Profile</span>
                  <ChevronRight size={11} style={{ color: settings.darkMode ? '#546e7a' : '#bbb', marginLeft: 'auto' }} />
                </button>
              </div>

              {/* ── Divider ── */}
              <div style={{ height: 1, background: dropdownBorder, margin: '0 12px' }} />

              {/* ── Sign Out ── */}
              <div className="py-1.5">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    toast.success('Signed out successfully. See you soon!');
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(244,67,54,0.07)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut size={13} style={{ color: '#F44336' }} />
                  <span style={{ fontSize: '0.8rem', fontFamily: `var(--md-font-family)`, color: '#F44336', fontWeight: 500 }}>
                    Sign Out
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>

    {/* ═══════════════════════════════════════════════════════════
        Profile Slide-in Panel
    ════════════════════════════════════════════════════════════ */}
    <AnimatePresence>
      {profileModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="profile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setProfileModalOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 60,
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(3px)',
            }}
          />

          {/* Panel */}
          <motion.div
            key="profile-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 70,
              width: 380,
              background: settings.darkMode ? '#1a1a1a' : '#ffffff',
              borderLeft: `1px solid ${dropdownBorder}`,
              boxShadow: '-12px 0 48px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: `1px solid ${dropdownBorder}` }}
            >
              <div className="flex items-center gap-2">
                <User size={15} style={{ color: settings.primaryColor }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: textMain, fontFamily: `var(--md-font-family)` }}>
                  My Profile
                </span>
              </div>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }}
                onMouseEnter={e => (e.currentTarget.style.background = settings.darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.09)')}
                onMouseLeave={e => (e.currentTarget.style.background = settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)')}
              >
                <X size={14} style={{ color: settings.darkMode ? '#aaa' : '#546e7a' }} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">

              {/* ── Avatar + name hero ── */}
              <div
                className="flex flex-col items-center px-6 py-8"
                style={{
                  background: settings.darkMode
                    ? `linear-gradient(160deg, ${settings.primaryColor}18 0%, transparent 70%)`
                    : `linear-gradient(160deg, ${settings.primaryColor}0d 0%, transparent 70%)`,
                  borderBottom: `1px solid ${dropdownBorder}`,
                }}
              >
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* Avatar with camera overlay */}
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden"
                    style={{
                      border: `3px solid ${settings.primaryColor}40`,
                      boxShadow: `0 0 0 4px ${settings.primaryColor}18, 0 8px 32px rgba(0,0,0,0.18)`,
                    }}
                  >
                    <img
                      src={profileImage}
                      alt="Sourabh Sarsar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Camera overlay on hover */}
                  <div
                    className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.55)' }}
                  >
                    <Camera size={18} color="#fff" />
                    <span style={{ fontSize: '0.625rem', color: '#fff', fontWeight: 600, letterSpacing: '0.02em' }}>Change</span>
                  </div>
                  {/* Online dot */}
                  <div
                    className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-[2.5px]"
                    style={{
                      background: '#4CAF50',
                      borderColor: settings.darkMode ? '#1a1a1a' : '#ffffff',
                    }}
                  />
                </div>

                {/* Upload hint text */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 flex items-center gap-1 px-3 py-1 rounded-full transition-all"
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: settings.primaryColor,
                    background: `${settings.primaryColor}12`,
                    border: `1px dashed ${settings.primaryColor}40`,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${settings.primaryColor}20`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${settings.primaryColor}12`; }}
                >
                  <Camera size={11} />
                  Upload New Photo
                </button>

                <h2
                  className="mt-4"
                  style={{ fontSize: '1.15rem', fontWeight: 700, color: textMain, fontFamily: `var(--md-font-family)` }}
                >
                  Sourabh Sarsar
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ fontSize: '0.72rem', fontWeight: 700, background: `${settings.primaryColor}18`, color: settings.primaryColor }}
                  >
                    <Shield size={10} />
                    Executive Engineer
                  </span>
                  <span
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                    style={{ fontSize: '0.68rem', fontWeight: 600, background: '#4CAF5014', color: '#4CAF50' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4CAF50' }} />
                    Online
                  </span>
                </div>

                <p
                  className="mt-2"
                  style={{ fontSize: '0.75rem', color: settings.darkMode ? '#78909c' : '#90a4ae', fontFamily: `var(--md-font-family)` }}
                >
                  DISCOM Administrator · Grid Intelligence Platform
                </p>
              </div>

              {/* ── Info cards ── */}
              <div className="px-5 py-5 flex flex-col gap-3">

                {/* Contact info */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)', border: `1px solid ${dropdownBorder}` }}
                >
                  <p
                    className="mb-3"
                    style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: settings.darkMode ? '#546e7a' : '#90a4ae' }}
                  >
                    Contact Information
                  </p>
                  {[
                    { icon: Mail, label: 'Email', value: 'sourabhsarsar@discom.com' },
                    { icon: Phone, label: 'Mobile', value: '+91 98765 43210' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-3 py-1.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${settings.primaryColor}12` }}
                      >
                        <row.icon size={13} style={{ color: settings.primaryColor }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.65rem', color: settings.darkMode ? '#546e7a' : '#90a4ae' }}>{row.label}</p>
                        <p style={{ fontSize: '0.78rem', color: textMain, fontWeight: 500 }}>{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Role & Assignment */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)', border: `1px solid ${dropdownBorder}` }}
                >
                  <p
                    className="mb-3"
                    style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: settings.darkMode ? '#546e7a' : '#90a4ae' }}
                  >
                    Role & Assignment
                  </p>
                  {[
                    { icon: Shield, label: 'Designation', value: 'Executive Engineer' },
                    { icon: Building2, label: 'Organisation', value: 'DISCOM HQ' },
                    { icon: MapPin, label: 'AOR Zone', value: 'All Zones' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-3 py-1.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${settings.secondaryColor}12` }}
                      >
                        <row.icon size={13} style={{ color: settings.secondaryColor }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.65rem', color: settings.darkMode ? '#546e7a' : '#90a4ae' }}>{row.label}</p>
                        <p style={{ fontSize: '0.78rem', color: textMain, fontWeight: 500 }}>{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Session info */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)', border: `1px solid ${dropdownBorder}` }}
                >
                  <p
                    className="mb-3"
                    style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: settings.darkMode ? '#546e7a' : '#90a4ae' }}
                  >
                    Session
                  </p>
                  {[
                    { icon: Clock, label: 'Last Login', value: 'Today at 10:23 AM' },
                    { icon: Shield, label: 'Account Status', value: 'Active · Verified' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-3 py-1.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
                      >
                        <row.icon size={13} style={{ color: settings.darkMode ? '#aaa' : '#546e7a' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.65rem', color: settings.darkMode ? '#546e7a' : '#90a4ae' }}>{row.label}</p>
                        <p style={{ fontSize: '0.78rem', color: textMain, fontWeight: 500 }}>{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Panel footer — Sign Out */}
            <div
              className="px-5 py-4 shrink-0"
              style={{ borderTop: `1px solid ${dropdownBorder}` }}
            >
              <button
                onClick={() => {
                  setProfileModalOpen(false);
                  toast.success('Signed out successfully. See you soon!');
                  onLogout?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all"
                style={{
                  background: 'rgba(244,67,54,0.08)',
                  border: '1px solid rgba(244,67,54,0.2)',
                  color: '#F44336',
                  fontFamily: `var(--md-font-family)`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(244,67,54,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(244,67,54,0.08)'; }}
              >
                <LogOut size={14} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}