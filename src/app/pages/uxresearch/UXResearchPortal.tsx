import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen, LayoutGrid, ClipboardList, MessageSquare, BarChart2,
  Brain, User, Navigation, Lightbulb, Share2, TrendingUp,
  ArrowLeft, Search,
} from 'lucide-react';
import { useTheme, getPrimaryBg } from '../../context/ThemeContext';
import { UXResearchWorkspace } from './UXResearchWorkspace';
import Subtract from '../../../imports/Subtract';

const researchNavItems = [
  { id: 'ux-brief',      icon: BookOpen,       label: 'Project Brief' },
  { id: 'ux-overview',   icon: LayoutGrid,     label: 'Overview' },
  { id: 'ux-plan',       icon: ClipboardList,  label: 'Research Plan' },
  { id: 'ux-interviews', icon: MessageSquare,  label: 'User Interviews' },
  { id: 'ux-survey',     icon: BarChart2,      label: 'Survey Insights' },
  { id: 'ux-empathy',    icon: Brain,          label: 'Empathy Mapping' },
  { id: 'ux-personas',   icon: User,           label: 'User Personas' },
  { id: 'ux-journey',    icon: Navigation,     label: 'Journey Map' },
  { id: 'ux-insights',   icon: Lightbulb,      label: 'Insights & Opps' },
  { id: 'ux-ia',         icon: Share2,         label: 'Information Arch.' },
  { id: 'ux-impact',     icon: TrendingUp,     label: 'Research Impact' },
];

interface UXResearchPortalProps {
  onClose: () => void;
}

export function UXResearchPortal({ onClose }: UXResearchPortalProps) {
  const { settings } = useTheme();
  const [activePage, setActivePage] = useState('ux-brief');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isDark     = settings.darkMode;
  const ff         = `var(--md-font-family, ${settings.fontFamily})`;
  const sec        = settings.secondaryColor;
  const pri        = settings.primaryColor;
  const navBg      = isDark ? '#141414' : '#f0f4ff';
  const outerBg    = isDark ? '#0a0a0a' : '#e8effc';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(21,101,192,0.1)';
  const textMain   = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted  = isDark ? '#78909c' : '#546e7a';
  const inactiveBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

  return (
    <motion.div
      key="ux-portal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.28 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: outerBg, fontFamily: ff,
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gridTemplateRows: '56px 1fr',
        rowGap: '6px', columnGap: '6px',
        padding: '6px',
      }}
    >
      {/* ── Top bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{
          gridColumn: '1 / -1', gridRow: '1',
          background: isDark ? '#141414' : '#ffffff',
          borderRadius: 20,
          border: `1px solid ${borderColor}`,
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 18px',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md overflow-hidden shrink-0"
            style={{ background: getPrimaryBg(settings) }}
          >
            <div className="w-4 h-5" style={{ '--fill-0': 'white' } as React.CSSProperties}>
              <Subtract />
            </div>
          </div>
          <div>
            <div
              className="text-xs font-medium opacity-60"
              style={{ fontFamily: ff, color: isDark ? '#fff' : '#1a1a2e' }}
            >
              SOURABH
            </div>
            <div
              className="font-semibold leading-none"
              style={{ fontSize: '0.8rem', fontFamily: ff, color: pri }}
            >
              UX Research Workspace
            </div>
          </div>
        </div>

        <div style={{ width: 1, height: 28, background: borderColor, margin: '0 8px', flexShrink: 0 }} />

        <div style={{ flex: 1 }} />

        {/* Back to Login */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : `${pri}08`,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : `${pri}20`}`,
            color: textMuted, fontSize: '0.75rem', fontWeight: 600, fontFamily: ff,
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={14} style={{ color: textMuted }} />
          Back to Login
        </motion.button>
      </motion.div>

      {/* ── Sidebar nav ── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}
        style={{
          gridColumn: '1', gridRow: '2',
          background: navBg,
          borderRadius: 20,
          border: `1px solid ${borderColor}`,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Nav items */}
        <div className="flex flex-col flex-1 py-2 px-2 gap-0.5 overflow-y-auto">
          {researchNavItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            const isHovered = hoveredId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.03 }}
                className="relative"
              >
                <motion.button
                  onClick={() => setActivePage(item.id)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                  style={{
                    background: isActive
                      ? `${sec}15`
                      : isHovered
                      ? inactiveBg
                      : 'transparent',
                    border: isActive ? `1px solid ${sec}25` : '1px solid transparent',
                    fontFamily: ff,
                  }}
                >
                  <Icon size={14} style={{
                    color: isActive ? sec : textMuted,
                    transition: 'color 0.15s',
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? sec : textMuted,
                    transition: 'color 0.15s, font-weight 0.15s',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {item.label}
                  </span>

                  {/* Active pill */}
                  {isActive && (
                    <motion.div
                      layoutId="ux-portal-active"
                      className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: sec }}
                    />
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 shrink-0" style={{ borderTop: `1px solid ${borderColor}` }}>
          <p className="opacity-40 truncate" style={{ fontSize: '0.68rem', color: textMain }}>
            Grid Intelligence v2.4.1
          </p>
          <p className="opacity-30 truncate" style={{ fontSize: '0.65rem', color: textMain }}>
            © 2026 Sourabh
          </p>
        </div>
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        style={{
          gridColumn: '2', gridRow: '2',
          borderRadius: 20,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <UXResearchWorkspace activePage={activePage} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}