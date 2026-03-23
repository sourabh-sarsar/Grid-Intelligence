import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Users, Cpu, Activity, BarChart3,
  TrendingUp, FlaskConical, AlertCircle, FileText, Settings,
  ChevronRight, GripVertical, Network, Heart,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getPrimaryBg } from '../../context/ThemeContext';

// ── Tiny Namaste icon for nav item ───────────────────────────────────────────
function NamasteNavIcon({ size = 17, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <span style={{ fontSize: size, lineHeight: 1, display: 'inline-flex', alignItems: 'center', ...style }}>
      🙏
    </span>
  );
}

const navItems = [
  { id: 'dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'consumers',     icon: Users,           label: 'Consumers' },
  { id: 'grid-explorer', icon: Network,         label: 'Grid Explorer' },
  { id: 'assets',        icon: Cpu,             label: 'Assets' },
  { id: 'load',          icon: Activity,        label: 'Load Monitor' },
  { id: 'revenue',       icon: BarChart3,       label: 'Revenue' },
  { id: 'forecast',      icon: TrendingUp,      label: 'Forecasting' },
  { id: 'studies',       icon: FlaskConical,    label: 'Studies' },
  { id: 'alerts',        icon: AlertCircle,     label: 'Alerts' },
  { id: 'reports',       icon: FileText,        label: 'Reports' },
  { id: 'settings',      icon: Settings,        label: 'Settings' },
  { id: 'thankyou',      icon: NamasteNavIcon,  label: 'Thank You' },
];

interface SideNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  navMode?: 'side' | 'top';
  onNavModeChange?: (mode: 'side' | 'top') => void;
}

export function SideNav({
  activePage, onNavigate, collapsed, onToggle,
  navMode = 'side', onNavModeChange,
}: SideNavProps) {
  const { settings } = useTheme();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const bg           = settings.darkMode ? '#141414' : '#f0f4ff';
  const textColor    = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const inactiveColor= settings.darkMode ? '#666666' : '#78909c';
  const borderColor  = settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(21,101,192,0.1)';
  const ff  = `var(--md-font-family, ${settings.fontFamily})`;
  const pri = settings.primaryColor;
  const sec = settings.secondaryColor;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: bg }}>

      {/* ── Nav Items ───────────────────────────────────────────────── */}
      <div
        draggable={navMode === 'side'}
        onDragStart={(e) => {
          e.dataTransfer.setData('application/nav-items', 'true');
          e.dataTransfer.effectAllowed = 'move';
        }}
        className="flex flex-col flex-1 py-2 px-2 gap-0.5 overflow-y-auto overflow-x-hidden"
        style={{ cursor: navMode === 'side' ? 'grab' : 'default' }}
      >
        {/* Drag hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1.5 px-2 mb-1 shrink-0 select-none rounded-lg py-1 transition-colors"
          style={{ opacity: 0.35, color: inactiveColor, justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <GripVertical size={11} style={{ color: inactiveColor }} />
          {!collapsed && (
            <span style={{ fontSize: '0.625rem', fontFamily: ff }}>Drag to top bar</span>
          )}
        </motion.div>

        {/* Nav items — animated swap between app/research */}
        <AnimatePresence mode="wait">
          <motion.div
            key="app-items"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-0.5"
          >
            {navItems.map((item, index) => {
              const isActive  = activePage === item.id;
              const isHovered = hoveredId === item.id;
              return (
                <div key={item.id} className="relative group/item">
                  <motion.button
                    onClick={() => onNavigate(item.id)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.03, duration: 0.25 }}
                    whileHover={{ x: collapsed ? 0 : 3 }}
                    whileTap={{ scale: 0.97 }}
                    title={collapsed ? item.label : undefined}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="w-full flex items-center gap-3 py-2.5 rounded-2xl transition-all relative"
                    style={{
                      background: isActive
                        ? `${pri}18`
                        : isHovered
                        ? (settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)')
                        : 'transparent',
                      fontFamily: ff,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      paddingLeft: collapsed ? '0' : '12px',
                      paddingRight: collapsed ? '0' : '12px',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ background: getPrimaryBg(settings) }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all"
                      style={{ background: isActive ? `${pri}22` : 'transparent' }}
                    >
                      <item.icon
                        size={17}
                        style={{ color: isActive ? pri : inactiveColor }}
                      />
                    </div>

                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.span
                          key="label"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="leading-none truncate overflow-hidden whitespace-nowrap"
                          style={{
                            fontSize: '0.8rem',
                            color: isActive ? pri : inactiveColor,
                            fontWeight: isActive ? 600 : 400,
                            fontFamily: ff,
                          }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Alert badge — only in app mode */}
                    {item.id === 'alerts' && (
                      <AnimatePresence initial={false}>
                        {collapsed ? (
                          <motion.span
                            key="badge-dot"
                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
                            style={{ background: '#F44336', borderColor: bg }}
                          />
                        ) : (
                          <motion.span
                            key="badge-full"
                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            className="ml-auto w-4 h-4 rounded-full text-white flex items-center justify-center shrink-0"
                            style={{ fontSize: '9px', background: '#F44336' }}
                          >
                            3
                          </motion.span>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.button>

                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <div
                      className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg whitespace-nowrap z-50 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150"
                      style={{
                        fontSize: '0.72rem', fontWeight: 500,
                        background: settings.darkMode ? '#252525' : '#1a1a2e',
                        color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                        fontFamily: ff, pointerEvents: 'none',
                      }}
                    >
                      {item.label}
                      <span
                        className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
                        style={{ borderRightColor: settings.darkMode ? '#252525' : '#1a1a2e' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Thank You Module ─────────────────────────────────────────────── */}

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-3 shrink-0 overflow-hidden"
            style={{ borderTop: `1px solid ${borderColor}` }}
          >
            <p className="opacity-40 truncate" style={{ fontSize: '0.68rem', fontFamily: ff, color: textColor }}>
              Grid Intelligence v2.4.1
            </p>
            <p className="opacity-30 truncate" style={{ fontSize: '0.65rem', fontFamily: ff, color: textColor }}>
              © 2026 Sourabh
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}