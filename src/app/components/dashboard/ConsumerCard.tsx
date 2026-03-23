import { useTheme, getPrimaryBg, getDensitySpacing } from '../../context/ThemeContext';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Home, Building2, Sprout, Factory, TrendingUp, Search, X, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const categories = [
  { name: 'Residential', count: 84200, pct: 62, color: '#1565C0', icon: Home },
  { name: 'Commercial',  count: 24100, pct: 18, color: '#0288D1', icon: Building2 },
  { name: 'Agricultural',count: 15300, pct: 11, color: '#43A047', icon: Sprout },
  { name: 'Industrial',  count: 12400, pct: 9,  color: '#E65100', icon: Factory },
];

const CAT_COLOR: Record<string, string> = {
  Residential:  '#1565C0',
  Commercial:   '#0288D1',
  Agricultural: '#43A047',
  Industrial:   '#E65100',
};

const CONSUMERS = [
  { id: 1,  name: 'Sourabh Singh',    category: 'Residential',   live: true  },
  { id: 2,  name: 'Sourabh Kumar',    category: 'Commercial',    live: true  },
  { id: 3,  name: 'Sourabh Sinha',    category: 'Industrial',    live: false },
  { id: 4,  name: 'Sourabh Sarsar',   category: 'Residential',   live: true  },
  { id: 5,  name: 'Sourabh Verma',    category: 'Agricultural',  live: true  },
  { id: 6,  name: 'Sourabh Gupta',    category: 'Commercial',    live: false },
  { id: 7,  name: 'Sourabh Sharma',   category: 'Residential',   live: true  },
  { id: 8,  name: 'Sourabh Mishra',   category: 'Industrial',    live: true  },
  { id: 9,  name: 'Sourabh Pandey',   category: 'Commercial',    live: false },
  { id: 10, name: 'Sourabh Yadav',    category: 'Agricultural',  live: true  },
  { id: 11, name: 'Rahul Singh',      category: 'Residential',   live: true  },
  { id: 12, name: 'Amit Kumar',       category: 'Commercial',    live: false },
  { id: 13, name: 'Priya Sharma',     category: 'Residential',   live: true  },
  { id: 14, name: 'Ravi Gupta',       category: 'Industrial',    live: true  },
  { id: 15, name: 'Neha Verma',       category: 'Agricultural',  live: false },
];

function LiveDot({ live }: { live: boolean }) {
  return (
    <span className="relative flex items-center justify-center" style={{ width: 10, height: 10 }}>
      <span
        className="absolute inline-flex rounded-full"
        style={{
          width: 10, height: 10,
          background: live ? '#22c55e' : '#ef4444',
          opacity: 0.4,
          animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) infinite',
        }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{
          width: 7, height: 7,
          background: live ? '#22c55e' : '#ef4444',
        }}
      />
    </span>
  );
}

export function ConsumerCard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { settings } = useTheme();
  const ds = getDensitySpacing(settings.density);
  const [activeSlice, setActiveSlice]   = useState<number | null>(null);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [showAbsolute, setShowAbsolute] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const trimmed = searchQuery.trim().toLowerCase();
  const consumerResults = trimmed.length > 0
    ? CONSUMERS.filter(c => c.name.toLowerCase().includes(trimmed))
    : [];
  const isSearching = trimmed.length > 0;

  const filteredCats = categories.filter(c =>
    !isSearching && c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const chartData = filteredCats.length > 0 ? filteredCats : categories;

  const cardBg    = settings.darkMode ? '#1e1e1e' : '#fff';
  const textMain  = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const textMuted = settings.darkMode ? '#78909c' : '#546e7a';
  const border    = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const surface   = settings.darkMode ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08`;
  const rowHover  = settings.darkMode ? 'rgba(255,255,255,0.05)' : `${settings.primaryColor}08`;
  const divider   = settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
        boxShadow: settings.darkMode
          ? 'none'
          : `0 ${settings.cardShadow * 2}px ${settings.cardShadow * 10}px rgba(21,101,192,0.08)`,
        borderRadius: `${settings.cardBorderRadius}px`,
        fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
        padding: ds.pad,
      }}
    >
      {/* ping keyframe */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2" style={{ marginBottom: ds.headerGap }}>
        <AnimatePresence mode="wait" initial={false}>
          {searchOpen ? (
            <motion.div
              key="searchbar"
              initial={{ opacity: 0, scaleX: 0.7 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.7 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="flex-1 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 overflow-hidden"
              style={{
                background: surface,
                border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(21,101,192,0.15)'}`,
                transformOrigin: 'right center',
              }}
            >
              <Search size={12} style={{ color: textMuted, flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Escape' && (setSearchOpen(false), setSearchQuery(''))}
                placeholder="Search consumers…"
                className="flex-1 bg-transparent outline-none min-w-0"
                style={{ fontSize: '0.74rem', color: textMain }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="shrink-0">
                  <X size={11} style={{ color: textMuted }} />
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5 flex-1 min-w-0"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${settings.primaryColor}18` }}
              >
                <Users size={16} style={{ color: settings.primaryColor }} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold leading-none truncate" style={{ fontSize: '0.8rem', color: textMain }}>
                  Consumer Intelligence
                </h3>
                <p className="opacity-60 mt-0.5 truncate" style={{ fontSize: '0.68rem', color: textMuted }}>
                  All consumers by type
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search toggle only — ● Live badge removed */}
        <div className="flex items-center gap-1.5 shrink-0">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (searchOpen) { setSearchOpen(false); setSearchQuery(''); }
              else setSearchOpen(true);
            }}
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors"
            style={{
              background: searchOpen ? `${settings.primaryColor}18` : surface,
              border: `1px solid ${searchOpen
                ? `${settings.primaryColor}30`
                : (settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(21,101,192,0.1)')}`,
            }}
            title={searchOpen ? 'Close search' : 'Search consumers'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {searchOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={13} style={{ color: settings.primaryColor }} />
                </motion.span>
              ) : (
                <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Search size={13} style={{ color: textMuted }} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Total Count + Trend ──────────────────────────────────────────────── */}
      <div className="rounded-2xl p-3 mb-3" style={{ background: surface }}>
        <div className="flex items-end justify-between">
          <div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="font-bold leading-none"
              style={{ fontSize: '2rem', color: settings.primaryColor }}
            >
              1,36,000
            </motion.div>
            <p className="mt-0.5 opacity-60" style={{ fontSize: '0.7rem', color: textMuted }}>
              Total Active Consumers
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <motion.span
              onClick={() => setShowAbsolute(v => !v)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer select-none overflow-hidden"
              animate={{ width: 'auto' }}
              style={{
                fontSize: '0.65rem',
                background: '#E8F5E9',
                color: '#2E7D32',
                fontWeight: 600,
                transformOrigin: 'right center',
                whiteSpace: 'nowrap',
              }}
              title="Click to toggle"
            >
              <TrendingUp size={9} />
              <AnimatePresence mode="wait" initial={false}>
                {showAbsolute ? (
                  <motion.span key="abs" initial={{ opacity: 0, x: 8, width: 0 }} animate={{ opacity: 1, x: 0, width: 'auto' }} exit={{ opacity: 0, x: 8, width: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }} style={{ display: 'inline-block', overflow: 'hidden' }}>
                    +3,264
                  </motion.span>
                ) : (
                  <motion.span key="pct" initial={{ opacity: 0, x: -8, width: 0 }} animate={{ opacity: 1, x: 0, width: 'auto' }} exit={{ opacity: 0, x: -8, width: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }} style={{ display: 'inline-block', overflow: 'hidden' }}>
                    +2.4%
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
            <span style={{ fontSize: '0.65rem', color: textMuted, opacity: 0.6 }}>vs last month</span>
          </div>
        </div>
        {/* Stacked bar */}
        <div className="flex gap-0.5 mt-2 h-1.5 rounded-full overflow-hidden">
          {categories.map(cat => (
            <div key={cat.name} className="rounded-full" style={{ width: `${cat.pct}%`, background: cat.color }} />
          ))}
        </div>
      </div>

      {/* ── Consumer Search Results / Default View ───────────────────────────── */}
      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="consumer-results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="flex-1 min-h-0 flex flex-col overflow-hidden"
          >
            {/* result count */}
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span style={{ fontSize: '0.67rem', color: textMuted }}>
                {consumerResults.length === 0
                  ? 'No results'
                  : `${consumerResults.length} result${consumerResults.length > 1 ? 's' : ''} found`}
              </span>
              {consumerResults.length === 1 && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-1.5 py-0.5 rounded-full"
                  style={{ fontSize: '0.625rem', background: '#dcfce7', color: '#15803d', fontWeight: 600 }}
                >
                  Exact match
                </motion.span>
              )}
            </div>

            {/* list */}
            <div className="flex-1 overflow-y-auto" style={{ borderTop: `1px solid ${divider}` }}>
              <AnimatePresence>
                {consumerResults.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-4 text-center"
                    style={{ fontSize: '0.72rem', color: textMuted }}
                  >
                    No consumer found for "{searchQuery}"
                  </motion.p>
                ) : (
                  consumerResults.map((consumer, i) => {
                    const catColor = CAT_COLOR[consumer.category] ?? textMuted;
                    return (
                      <motion.div
                        key={consumer.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-2.5 px-1.5 py-2 rounded-xl cursor-pointer transition-all"
                        style={{ borderBottom: i < consumerResults.length - 1 ? `1px solid ${divider}` : 'none' }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = rowHover}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                        onClick={() => {
                          localStorage.setItem('pendingConsumerId', String(consumer.id));
                          onNavigate?.('consumers');
                        }}
                      >
                        <LiveDot live={consumer.live} />
                        <span className="flex-1 truncate" style={{ fontSize: '0.74rem', color: textMain, fontWeight: 500 }}>
                          {consumer.name}
                        </span>
                        <span
                          className="shrink-0 px-1.5 py-0.5 rounded-full"
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            background: `${catColor}18`,
                            color: catColor,
                            border: `1px solid ${catColor}30`,
                          }}
                        >
                          {consumer.category}
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        ) : (

          /* ── Default: Donut + Category Table ──────────────────────────── */
          <motion.div
            key="default-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-h-0 flex flex-col"
          >
            {/* Donut Chart */}
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <div style={{ width: '100%', height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={56}
                      outerRadius={82}
                      dataKey="pct"
                      paddingAngle={2}
                      cornerRadius={5}
                      onMouseEnter={(_, i) => setActiveSlice(i)}
                      onMouseLeave={() => setActiveSlice(null)}
                      stroke={cardBg}
                      strokeWidth={2}
                    >
                      {chartData.map((cat, i) => (
                        <Cell
                          key={cat.name}
                          fill={cat.color}
                          opacity={activeSlice === null || activeSlice === i ? 1 : 0.3}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number, name: string) => [`${v}%`, name]}
                      contentStyle={{
                        borderRadius: '10px',
                        border: 'none',
                        background: settings.darkMode ? '#252525' : '#fff',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                        fontFamily: 'var(--md-font-family)',
                        fontSize: '11px',
                        color: textMain,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Table */}
            <div style={{ borderTop: `1px solid ${divider}` }}>
              {categories.map((cat, i) => (
                <div
                  key={cat.name}
                  className="flex items-center gap-2 px-1.5 py-2 rounded-xl transition-all"
                  style={{ borderBottom: i < categories.length - 1 ? `1px solid ${divider}` : 'none' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = rowHover;
                    setActiveSlice(i);
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                    setActiveSlice(null);
                  }}
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
                  <span
                    className="flex-1 truncate"
                    style={{
                      fontSize: '0.72rem',
                      color: activeSlice === i ? cat.color : textMain,
                      fontWeight: activeSlice === i ? 600 : 400,
                      transition: 'color 0.15s',
                    }}
                  >
                    {cat.name}
                  </span>
                  <span className="font-semibold tabular-nums" style={{ fontSize: '0.72rem', color: cat.color, width: '34px', textAlign: 'right' }}>
                    {cat.pct}%
                  </span>
                  <span className="tabular-nums" style={{ fontSize: '0.71rem', color: textMuted, width: '52px', textAlign: 'right' }}>
                    {cat.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* View All */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.('consumers')}
              className="mt-3 w-full py-2.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-all"
              style={{ background: getPrimaryBg(settings), color: '#fff' }}
            >
              View All Consumers <ArrowRight size={14} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}