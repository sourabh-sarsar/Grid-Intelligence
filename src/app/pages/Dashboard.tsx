import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTheme, BackgroundPattern } from '../context/ThemeContext';
import { ConsumerCard } from '../components/dashboard/ConsumerCard';
import { PowerBalanceCard } from '../components/dashboard/PowerBalanceCard';
import { RevenueCard } from '../components/dashboard/RevenueCard';
import { AssetCard } from '../components/dashboard/AssetCard';
import { AlertsCard } from '../components/dashboard/AlertsCard';
import { ForecastCard } from '../components/dashboard/ForecastCard';
import { StudiesCard } from '../components/dashboard/StudiesCard';
import { MicroWidget } from '../components/dashboard/MicroWidgets';
import { Activity, Zap, TrendingDown, Gauge, GripVertical, Plus } from 'lucide-react';

export function getPatternStyle(pattern: BackgroundPattern, darkMode: boolean): React.CSSProperties {
  const base = darkMode ? '#111111' : '#f0f4fc';
  const lineColor = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(21,101,192,0.08)';

  const patterns: Record<BackgroundPattern, React.CSSProperties> = {
    none: { backgroundColor: base },
    grid: {
      backgroundColor: base,
      backgroundImage: `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`,
      backgroundSize: '24px 24px',
    },
    dots: {
      backgroundColor: base,
      backgroundImage: `radial-gradient(circle, ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(21,101,192,0.15)'} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
    },
    diagonal: {
      backgroundColor: base,
      backgroundImage: `repeating-linear-gradient(45deg, ${lineColor} 0, ${lineColor} 1px, transparent 0, transparent 50%)`,
      backgroundSize: '16px 16px',
    },
    blueprint: {
      backgroundColor: darkMode ? '#080808' : '#e8f0fe',
      backgroundImage: `linear-gradient(${darkMode ? 'rgba(200,200,200,0.06)' : 'rgba(21,101,192,0.12)'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? 'rgba(200,200,200,0.06)' : 'rgba(21,101,192,0.12)'} 1px, transparent 1px), linear-gradient(${darkMode ? 'rgba(200,200,200,0.03)' : 'rgba(21,101,192,0.06)'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? 'rgba(200,200,200,0.03)' : 'rgba(21,101,192,0.06)'} 1px, transparent 1px)`,
      backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
      backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
    },
    wave: {
      backgroundColor: base,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='20'%3E%3Cpath d='M0 10 Q25 0 50 10 Q75 20 100 10' stroke='${encodeURIComponent(lineColor)}' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
      backgroundSize: '100px 20px',
    },
    circuit: {
      backgroundColor: base,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 30 L20 30 M40 30 L60 30 M30 0 L30 20 M30 40 L30 60 M20 30 L20 20 L30 20 M40 30 L40 40 L30 40' stroke='${encodeURIComponent(lineColor)}' fill='none' stroke-width='1'/%3E%3Ccircle cx='30' cy='30' r='3' fill='none' stroke='${encodeURIComponent(lineColor)}' stroke-width='1'/%3E%3C/svg%3E")`,
      backgroundSize: '60px 60px',
    },
    hexagonal: {
      backgroundColor: base,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpolygon points='28,2 54,16 54,44 28,58 2,44 2,16' stroke='${encodeURIComponent(lineColor)}' fill='none' stroke-width='1'/%3E%3Cpolygon points='28,58 54,72 54,100 28,114 2,100 2,72' stroke='${encodeURIComponent(lineColor)}' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
      backgroundSize: '56px 100px',
    },
    noise: {
      backgroundColor: base,
      backgroundImage: `radial-gradient(ellipse at 20% 50%, ${darkMode ? 'rgba(21,101,192,0.15)' : 'rgba(21,101,192,0.05)'} 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, ${darkMode ? 'rgba(230,81,0,0.1)' : 'rgba(230,81,0,0.04)'} 0%, transparent 50%)`,
    },
    gradient: {
      backgroundImage: darkMode
        ? 'linear-gradient(135deg, #0a1628 0%, #0f1f3d 40%, #0a1628 100%)'
        : 'linear-gradient(135deg, #e8f0fe 0%, #f0f4fc 40%, #e3f2fd 100%)',
    },
    mesh: {
      backgroundColor: base,
      backgroundImage: `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px), radial-gradient(circle at center, ${darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(21,101,192,0.04)'} 0%, transparent 60%)`,
      backgroundSize: '40px 40px, 40px 40px, 400px 400px',
    },
  };
  return patterns[pattern] || patterns.none;
}

// ── Fixed slot definitions (span + minHeight). Content is swappable. ──────────
const SLOTS = [
  { span: 3,  minHeight: undefined  },  // 0  micro-health
  { span: 3,  minHeight: undefined  },  // 1  micro-freq
  { span: 3,  minHeight: undefined  },  // 2  micro-pf
  { span: 3,  minHeight: undefined  },  // 3  micro-losses
  { span: 3,  minHeight: '340px'    },  // 4  consumer
  { span: 5,  minHeight: '340px'    },  // 5  powerbalance
  { span: 4,  minHeight: '340px'    },  // 6  alerts
  { span: 4,  minHeight: '300px'    },  // 7  revenue
  { span: 5,  minHeight: '300px'    },  // 8  forecast
  { span: 3,  minHeight: '300px'    },  // 9  assets
  { span: 12, minHeight: '280px'    },  // 10 studies
] as const;

// ── Base spans per slot index (mirrors SLOTS.span) ────────────────────────────
const BASE_SPANS = [3, 3, 3, 3, 3, 5, 4, 4, 5, 3, 12];

// ── Row groups: slot indices that share a grid row ────────────────────────────
const ROW_GROUPS = [
  [0, 1, 2, 3],   // micro widgets
  [4, 5, 6],      // consumer / power-balance / alerts
  [7, 8, 9],      // revenue / forecast / assets
  [10],           // studies
];

const INITIAL_ORDER = [
  'micro-health', 'micro-freq', 'micro-pf', 'micro-losses',
  'consumer', 'powerbalance', 'alerts',
  'revenue', 'forecast', 'assets',
  'studies',
];

const CARD_META: Record<string, { label: string; icon: string; group: string }> = {
  'micro-health':  { label: 'Grid Health',    icon: '⚡', group: 'Micro Widgets' },
  'micro-freq':    { label: 'Grid Frequency',  icon: '〰️', group: 'Micro Widgets' },
  'micro-pf':      { label: 'Power Factor',    icon: '📐', group: 'Micro Widgets' },
  'micro-losses':  { label: 'Energy Losses',   icon: '📉', group: 'Micro Widgets' },
  'consumer':      { label: 'Consumer',         icon: '👥', group: 'Main Cards' },
  'powerbalance':  { label: 'Power Balance',    icon: '⚖️', group: 'Main Cards' },
  'alerts':        { label: 'Alerts',           icon: '🚨', group: 'Main Cards' },
  'revenue':       { label: 'Revenue',          icon: '💰', group: 'Main Cards' },
  'forecast':      { label: 'Forecast',         icon: '🔮', group: 'Main Cards' },
  'assets':        { label: 'Assets',           icon: '🏗️', group: 'Main Cards' },
  'studies':       { label: 'Studies',          icon: '🧪', group: 'Main Cards' },
};

export function Dashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { settings, updateSettings } = useTheme();
  const patternStyle = getPatternStyle(settings.backgroundPattern, settings.darkMode);
  const gap = `${Math.max(8, settings.cardSpacing * 0.6)}px`;

  const visibleCards = settings.visibleCards ?? INITIAL_ORDER;

  // ── Drag & drop order (must be declared before dynamicSpans) ───────────────
  const [order, setOrder] = useState<string[]>(INITIAL_ORDER);

  // ── Dynamic spans: redistribute 12 cols across visible slots per row ────────
  const dynamicSpans = useMemo(() => {
    const spans = [...BASE_SPANS];
    for (const group of ROW_GROUPS) {
      const visible = group.filter(i => visibleCards.includes(order[i]));
      if (visible.length === 0 || visible.length === group.length) continue;
      const totalBase = visible.reduce((s, i) => s + BASE_SPANS[i], 0);
      let used = 0;
      visible.forEach((i, j) => {
        if (j === visible.length - 1) {
          spans[i] = 12 - used;
        } else {
          const s = Math.round(BASE_SPANS[i] * 12 / totalBase);
          spans[i] = s;
          used += s;
        }
      });
    }
    return spans;
  }, [visibleCards, order]);

  // ── Add card dropdown ──────────────────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [cardJustAdded, setCardJustAdded] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);

  const hiddenCards = INITIAL_ORDER.filter(id => !visibleCards.includes(id));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addRef.current && !addRef.current.contains(e.target as Node)) {
        setAddOpen(false);
      }
    };
    if (addOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [addOpen]);

  const addCard = (id: string) => {
    updateSettings({ visibleCards: [...visibleCards, id] });
    setAddOpen(false);
    setCardJustAdded(true);
  };

  // ── Remaining drag & drop state ────────────────────────────────────────────
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const dragSrcRef = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    dragSrcRef.current = idx;
    setDraggingIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/dashboard-card', String(idx));
    // Use the slot's outer wrapper as the ghost image
    const el = document.querySelector(`[data-slot="${idx}"]`) as HTMLElement | null;
    if (el) e.dataTransfer.setDragImage(el, el.offsetWidth / 2, 36);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    if (!e.dataTransfer.types.includes('application/dashboard-card')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragSrcRef.current !== null && dragSrcRef.current !== idx) {
      setDragOverIdx(idx);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIdx: number) => {
    e.preventDefault();
    const srcIdx = dragSrcRef.current;
    if (srcIdx === null || srcIdx === targetIdx) { reset(); return; }
    setOrder(prev => {
      const next = [...prev];
      [next[srcIdx], next[targetIdx]] = [next[targetIdx], next[srcIdx]];
      return next;
    });
    reset();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIdx(prev => (prev === idx ? null : prev));
    }
  };

  const reset = () => {
    dragSrcRef.current = null;
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  // ── Card renderer ──────────────────────────────────────────────────────────
  const renderCard = (id: string) => {
    switch (id) {
      case 'micro-health':  return <MicroWidget icon={Activity} label="Grid Health" value="97.4" unit="%" status="good" trend="↑ Healthy" delay={0.05} />;
      case 'micro-freq':    return <MicroWidget icon={Zap} label="Grid Frequency" value="49.98" unit="Hz" status="info" trend="Stable" delay={0.1} />;
      case 'micro-pf':      return <MicroWidget icon={Gauge} label="Power Factor" value="0.92" unit="pf" status="purple" trend="↓ Low" delay={0.15} />;
      case 'micro-losses':  return <MicroWidget icon={TrendingDown} label="Energy Losses" value="4.2" unit="%" status="warn" trend="↑ High" delay={0.2} />;
      case 'consumer':      return <ConsumerCard onNavigate={onNavigate} />;
      case 'powerbalance':  return <PowerBalanceCard />;
      case 'alerts':        return <AlertsCard />;
      case 'revenue':       return <RevenueCard />;
      case 'forecast':      return <ForecastCard />;
      case 'assets':        return <AssetCard onNavigate={onNavigate} />;
      case 'studies':       return <StudiesCard />;
      default:              return null;
    }
  };

  const anyDragging = draggingIdx !== null;

  return (
    <div className="flex-1 overflow-y-auto relative" style={{ ...patternStyle, minHeight: 0 }}>

      {/* ── SELECTED ELEMENT — draggable bento grid ───────────────────────── */}
      <div className="p-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap }}>

        {SLOTS.map((slot, idx) => {
          // Skip cards that have been hidden via the nav toggle
          if (!visibleCards.includes(order[idx])) return null;

          const isDragging  = draggingIdx === idx;
          const isOver      = dragOverIdx === idx && !isDragging;
          const isHovered   = hoveredIdx  === idx;
          const isIdleOther = anyDragging && !isDragging && !isOver;

          return (
            <div
              key={order[idx]}
              data-slot={idx}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={reset}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragLeave={(e) => handleDragLeave(e, idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                gridColumn: `span ${dynamicSpans[idx]}`,
                minHeight: slot.minHeight,
                position: 'relative',
                borderRadius: '16px',
                cursor: isDragging ? 'grabbing' : 'default',
                // Dragging source: fade out
                opacity: isDragging ? 0.3 : isIdleOther ? 0.7 : 1,
                // Drop target: dashed ring + glow + slight scale
                outline: isOver
                  ? `2px dashed ${settings.primaryColor}`
                  : anyDragging && !isDragging
                    ? `1px dashed ${settings.primaryColor}40`
                    : 'none',
                outlineOffset: '3px',
                transform: isOver ? 'scale(0.975)' : 'scale(1)',
                boxShadow: isOver
                  ? `0 0 0 8px ${settings.primaryColor}18, 0 8px 32px ${settings.primaryColor}20`
                  : 'none',
                transition: 'opacity 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease, outline 0.1s ease',
                zIndex: isOver ? 3 : isDragging ? 0 : 1,
              }}
            >
              {/* ── Drag handle (visual indicator, pointer-events:none so it */}
              {/*    doesn't block card interactions) ──────────────────────── */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 10,
                  zIndex: 40,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 6px 3px 4px',
                  borderRadius: '8px',
                  background: isHovered && !isDragging
                    ? (settings.darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)')
                    : 'transparent',
                  opacity: isHovered && !isDragging ? 1 : 0,
                  transition: 'opacity 0.15s, background 0.15s',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                <GripVertical
                  size={12}
                  style={{ color: settings.darkMode ? '#aaaaaa' : '#90a4ae' }}
                />
                {slot.span >= 4 && (
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 500,
                      color: settings.darkMode ? '#888' : '#90a4ae',
                      fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    drag to swap
                  </span>
                )}
              </div>

              {/* ── Drop-target label shown in the center during drag ──────── */}
              {isOver && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '16px',
                    zIndex: 35,
                    pointerEvents: 'none',
                    background: `${settings.primaryColor}0d`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      background: `${settings.primaryColor}22`,
                      border: `1px solid ${settings.primaryColor}50`,
                      color: settings.primaryColor,
                    }}
                  >
                    <GripVertical size={13} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: `var(--md-font-family, ${settings.fontFamily})` }}>
                      Swap here
                    </span>
                  </div>
                </div>
              )}

              {/* ── Card content ──────────────────────────────────────────── */}
              {renderCard(order[idx])}
            </div>
          );
        })}

        {/* ── Add Card Button at bottom of grid — only when some cards still visible ── */}
        {hiddenCards.length > 0 && visibleCards.length > 0 && !cardJustAdded && (
          <div
            className="relative flex items-center justify-center"
            style={{ gridColumn: 'span 12', minHeight: 56 }}
          >
            <button
              onClick={() => setAddOpen(!addOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
              style={{
                background: addOpen
                  ? (settings.darkMode ? 'rgba(255,255,255,0.1)' : `${settings.primaryColor}12`)
                  : (settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                border: `1.5px dashed ${addOpen ? settings.primaryColor : (settings.darkMode ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)')}`,
                color: addOpen ? settings.primaryColor : (settings.darkMode ? '#78909c' : '#90a4ae'),
                fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = settings.primaryColor;
                (e.currentTarget as HTMLElement).style.color = settings.primaryColor;
                (e.currentTarget as HTMLElement).style.background = settings.darkMode ? 'rgba(255,255,255,0.07)' : `${settings.primaryColor}08`;
              }}
              onMouseLeave={e => {
                if (!addOpen) {
                  (e.currentTarget as HTMLElement).style.borderColor = settings.darkMode ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)';
                  (e.currentTarget as HTMLElement).style.color = settings.darkMode ? '#78909c' : '#90a4ae';
                  (e.currentTarget as HTMLElement).style.background = settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
                }
              }}
            >
              <Plus size={14} />
              <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Add Card</span>
              <span
                className="px-1.5 py-0.5 rounded-full"
                style={{ fontSize: '10px', fontWeight: 700, background: settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)', color: 'inherit' }}
              >
                {hiddenCards.length}
              </span>
            </button>
          </div>
        )}

      </div>

      {/* ── Add Card Button — pinned at 30% from top when ALL cards are hidden ── */}
      {visibleCards.length === 0 && (
        <div
          ref={addRef}
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* Empty state hint */}
          <p style={{ fontSize: '0.8rem', color: settings.darkMode ? '#546e7a' : '#90a4ae', marginBottom: 4, fontFamily: `var(--md-font-family, ${settings.fontFamily})` }}>
            No cards on the dashboard
          </p>

          <button
            onClick={() => setAddOpen(!addOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
            style={{
              background: addOpen
                ? (settings.darkMode ? 'rgba(255,255,255,0.1)' : `${settings.primaryColor}12`)
                : (settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
              border: `1.5px dashed ${addOpen ? settings.primaryColor : (settings.darkMode ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)')}`,
              color: addOpen ? settings.primaryColor : (settings.darkMode ? '#78909c' : '#90a4ae'),
              fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = settings.primaryColor;
              (e.currentTarget as HTMLElement).style.color = settings.primaryColor;
              (e.currentTarget as HTMLElement).style.background = settings.darkMode ? 'rgba(255,255,255,0.07)' : `${settings.primaryColor}08`;
            }}
            onMouseLeave={e => {
              if (!addOpen) {
                (e.currentTarget as HTMLElement).style.borderColor = settings.darkMode ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)';
                (e.currentTarget as HTMLElement).style.color = settings.darkMode ? '#78909c' : '#90a4ae';
                (e.currentTarget as HTMLElement).style.background = settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
              }
            }}
          >
            <Plus size={14} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Add Card</span>
            <span
              className="px-1.5 py-0.5 rounded-full"
              style={{ fontSize: '10px', fontWeight: 700, background: settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)', color: 'inherit' }}
            >
              {hiddenCards.length}
            </span>
          </button>

          {/* Dropdown — absolutely positioned so it never shifts the button */}
          {addOpen && (
            <div
              className="rounded-2xl shadow-2xl overflow-hidden z-50"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 240,
                background: settings.darkMode ? '#252525' : '#fff',
                border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                fontFamily: `var(--md-font-family, ${settings.fontFamily})`,
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}
              >
                <div className="flex items-center gap-2">
                  <Plus size={13} style={{ color: settings.primaryColor }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: settings.darkMode ? '#e0e0e0' : '#1a1a2e' }}>
                    Add to Dashboard
                  </span>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{ fontSize: '10px', fontWeight: 600, background: `${settings.primaryColor}18`, color: settings.primaryColor }}
                >
                  {hiddenCards.length} hidden
                </span>
              </div>

              {/* Groups */}
              <div className="py-1.5 max-h-72 overflow-y-auto">
                {(['Micro Widgets', 'Main Cards'] as const).map(group => {
                  const groupCards = hiddenCards.filter(id => CARD_META[id]?.group === group);
                  if (groupCards.length === 0) return null;
                  return (
                    <div key={group}>
                      <div
                        className="px-4 pt-2 pb-1"
                        style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: settings.darkMode ? '#546e7a' : '#90a4ae' }}
                      >
                        {group}
                      </div>
                      {groupCards.map(id => {
                        const meta = CARD_META[id];
                        return (
                          <button
                            key={id}
                            onClick={() => addCard(id)}
                            className="w-full flex items-center gap-3 px-4 py-2 transition-colors text-left"
                            onMouseEnter={e => (e.currentTarget.style.background = settings.darkMode ? 'rgba(255,255,255,0.06)' : `${settings.primaryColor}08`)}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            style={{ background: 'transparent' }}
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: `${settings.primaryColor}15`, fontSize: '14px' }}
                            >
                              {meta?.icon}
                            </div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 500, color: settings.darkMode ? '#e0e0e0' : '#1a1a2e' }}>
                              {meta?.label}
                            </span>
                            <Plus size={12} className="ml-auto shrink-0" style={{ color: settings.primaryColor, opacity: 0.7 }} />
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div
                className="px-4 py-2.5"
                style={{ borderTop: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}
              >
                <button
                  onClick={() => { updateSettings({ visibleCards: INITIAL_ORDER }); setAddOpen(false); }}
                  className="w-full py-1.5 rounded-xl transition-colors"
                  style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', background: settings.primaryColor }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Restore All Cards
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}