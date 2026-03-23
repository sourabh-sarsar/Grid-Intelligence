import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Zap, Search, Clock, Star, CheckCircle, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// ── Namaste character with cursor-tracking eyes ──────────────────────────────
function NamasteCharacter({ primary, secondary }: { primary: string; secondary: string }) {
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      // Eyes sit at ~23% down the viewBox
      const eyeSX = rect.left + rect.width * 0.5;
      const eyeSY = rect.top  + rect.height * 0.23;
      const dx = e.clientX - eyeSX;
      const dy = e.clientY - eyeSY;
      const dist = Math.hypot(dx, dy) || 1;
      const travel = Math.min(dist / 90, 1) * 2.4;
      setPupil({ x: (dx / dist) * travel, y: (dy / dist) * travel });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const skin = '#FFCC80';
  const dark = '#3E2723';
  const L = { x: 87, y: 56 };
  const R = { x: 113, y: 56 };

  return (
    <svg ref={svgRef} viewBox="0 0 200 245" fill="none"
      style={{ width: 118, height: 145, flexShrink: 0 }}>

      {/* Drop shadow */}
      <ellipse cx="100" cy="241" rx="37" ry="5" fill="rgba(0,0,0,0.07)" />

      {/* Body – kurta */}
      <path d="M 70 100 L 130 100 Q 149 130 146 205 L 54 205 Q 51 130 70 100 Z"
        fill={primary} />

      {/* Left arm – thick stroke as sleeve; elbow swings OUT then IN to wrist */}
      <path d="M 70 106 Q 44 134 86 158"
        stroke={primary} strokeWidth="24" strokeLinecap="round" fill="none" />

      {/* Right arm – mirror */}
      <path d="M 130 106 Q 156 134 114 158"
        stroke={primary} strokeWidth="24" strokeLinecap="round" fill="none" />

      {/* Namaste / prayer hands – unified silhouette, fingers pointing up */}
      <path d="M 100 108
               C 91 110 82 126 83 146
               C 83 158 88 163 100 163
               C 112 163 117 158 117 146
               C 118 126 109 110 100 108 Z"
        fill={skin} />

      {/* Center crease between palms */}
      <line x1="100" y1="110" x2="100" y2="162"
        stroke="rgba(0,0,0,0.09)" strokeWidth="0.9" />

      {/* Subtle finger-crease lines (left hand) */}
      <path d="M 91 127 C 90 119 90.5 113 92 110"
        stroke="rgba(0,0,0,0.08)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M 95 122 C 94 115 94.5 109 96 107"
        stroke="rgba(0,0,0,0.08)" strokeWidth="1.4" strokeLinecap="round" fill="none" />

      {/* Subtle finger-crease lines (right hand) */}
      <path d="M 109 127 C 110 119 109.5 113 108 110"
        stroke="rgba(0,0,0,0.08)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M 105 122 C 106 115 105.5 109 104 107"
        stroke="rgba(0,0,0,0.08)" strokeWidth="1.4" strokeLinecap="round" fill="none" />

      {/* Wrist bracelet / cuff accent */}
      <path d="M 83 157 Q 100 152 117 157"
        stroke={secondary} strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.72" />

      {/* Kurta V-neckline */}
      <path d="M 93 100 L 100 116 L 107 100"
        stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Kurta hem trim */}
      <path d="M 54 198 Q 100 191 146 198"
        stroke={secondary} strokeWidth="2.2" fill="none" opacity="0.42" />

      {/* Neck */}
      <rect x="89" y="84" width="22" height="20" rx="5" fill={skin} />

      {/* Ears */}
      <ellipse cx="68"  cy="57" rx="7" ry="9.5" fill={skin} />
      <ellipse cx="68"  cy="57" rx="4" ry="6"   fill="#FFAA70" opacity="0.28" />
      <ellipse cx="132" cy="57" rx="7" ry="9.5" fill={skin} />
      <ellipse cx="132" cy="57" rx="4" ry="6"   fill="#FFAA70" opacity="0.28" />

      {/* Head */}
      <circle cx="100" cy="55" r="33" fill={skin} />

      {/* Hair – top crown + side flow */}
      <path d="M 68 47 Q 71 16 100 15 Q 129 16 132 47
               Q 125 29 100 29 Q 75 29 68 47 Z"
        fill={dark} />
      <path d="M 68 47 Q 67 59 67 69"
        stroke={dark} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M 132 47 Q 133 59 133 69"
        stroke={dark} strokeWidth="7" strokeLinecap="round" fill="none" />

      {/* Eyebrows */}
      <path d="M 80 42 Q 87 39 94 41"
        stroke={dark} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M 106 41 Q 113 39 120 42"
        stroke={dark} strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* ── LEFT EYE ── */}
      <ellipse cx={L.x} cy={L.y} rx="8.5" ry="9" fill="white" />
      {/* iris */}
      <circle cx={L.x + pupil.x} cy={L.y + pupil.y} r="5.5" fill={primary} />
      {/* pupil */}
      <circle cx={L.x + pupil.x} cy={L.y + pupil.y} r="2.8" fill="#111" />
      {/* catchlight */}
      <circle cx={L.x + pupil.x + 1.8} cy={L.y + pupil.y - 1.8} r="1.1" fill="white" />
      {/* eyelid outline */}
      <ellipse cx={L.x} cy={L.y} rx="8.5" ry="9"
        stroke={dark} strokeWidth="0.85" fill="none" />

      {/* ── RIGHT EYE ── */}
      <ellipse cx={R.x} cy={R.y} rx="8.5" ry="9" fill="white" />
      <circle cx={R.x + pupil.x} cy={R.y + pupil.y} r="5.5" fill={primary} />
      <circle cx={R.x + pupil.x} cy={R.y + pupil.y} r="2.8" fill="#111" />
      <circle cx={R.x + pupil.x + 1.8} cy={R.y + pupil.y - 1.8} r="1.1" fill="white" />
      <ellipse cx={R.x} cy={R.y} rx="8.5" ry="9"
        stroke={dark} strokeWidth="0.85" fill="none" />

      {/* Nose */}
      <ellipse cx="100" cy="67" rx="3" ry="2.5" fill="#CC7040" opacity="0.38" />

      {/* Smile */}
      <path d="M 89 75 Q 100 86 111 75"
        fill="none" stroke="#B06030" strokeWidth="2.3" strokeLinecap="round" />

      {/* Cheek blush */}
      <ellipse cx="77"  cy="69" rx="8" ry="5" fill="#FF8A65" opacity="0.16" />
      <ellipse cx="123" cy="69" rx="8" ry="5" fill="#FF8A65" opacity="0.16" />

      {/* Bindi */}
      <circle cx="100" cy="40" r="2.6" fill={secondary} opacity="0.88" />
    </svg>
  );
}

const KPI_CARDS = [
  {
    pct: '41%', label: 'Faster Issue Detection', icon: Search, color: '#1565C0',
    desc: 'Mean time from fault occurrence to operator awareness reduced from 8.2 min to 4.8 min using unified alert triage.',
    before: '8.2 min', after: '4.8 min', unit: 'Detection Time',
  },
  {
    pct: '35%', label: 'Faster Alert Response', icon: Zap, color: '#E65100',
    desc: 'Average alert acknowledgement time reduced from 11 min to 7.2 min after smart severity ranking was introduced.',
    before: '11 min', after: '7.2 min', unit: 'Response Time',
  },
  {
    pct: '48%', label: 'Faster Information Retrieval', icon: Clock, color: '#7B1FA2',
    desc: 'Historical data access time reduced from an average of 19 minutes to under 10 minutes with direct dashboard queries.',
    before: '19 min', after: '9.9 min', unit: 'Retrieval Time',
  },
  {
    pct: '32%', label: 'Increase in User Satisfaction', icon: Star, color: '#2E7D32',
    desc: 'System Usability Scale (SUS) score improved from 54 (below average) to 71 (good) after prototype validation rounds.',
    before: 'SUS 54', after: 'SUS 71', unit: 'Usability Score',
  },
];

const TESTIMONIALS = [
  {
    text: '"For the first time, I don\'t have to ask three colleagues for data that should already be on my screen."',
    name: 'Rajesh Kumar', role: 'Grid Operations Manager', color: '#1565C0',
  },
  {
    text: '"The new alert triage is a game changer. I can actually prioritise instead of guessing."',
    name: 'Priya Sharma', role: 'Energy Analyst', color: '#E65100',
  },
  {
    text: '"The mobile prototype finally gives me what I need when I\'m standing in front of a faulty transformer."',
    name: 'Amit Singh', role: 'Field Engineer', color: '#2E7D32',
  },
];

const DESIGN_OUTCOMES = [
  { item: 'Unified Control Room Dashboard', status: 'Validated' },
  { item: 'Smart Alert Triage & Severity Engine', status: 'Validated' },
  { item: 'Contextual Fault Investigation Flow', status: 'Validated' },
  { item: 'Mobile Field Companion App (Offline)', status: 'In Progress' },
  { item: 'Predictive Load Alert System', status: 'In Progress' },
  { item: 'Automated Post-Incident Reporting', status: 'Planned' },
];

export function UXImpact() {
  const { settings } = useTheme();
  const ff       = `var(--md-font-family, ${settings.fontFamily})`;
  const isDark   = settings.darkMode;
  const pageBg   = isDark ? '#111111' : '#f0f4fc';
  const cardBg   = isDark ? '#1e1e1e' : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain  = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted = isDark ? '#78909c' : '#546e7a';
  const surface   = isDark ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08`;
  const sec = settings.secondaryColor;
  const pri = settings.primaryColor;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
          <TrendingUp size={16} style={{ color: sec }} />
        </div>
        <div className="flex-1">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>Research Impact</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>
            Measurable outcomes from research-driven design decisions · Prototype validation · Feb 2026
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full" style={{ background: `${sec}10`, border: `1px solid ${sec}20`, fontSize: '0.65rem', color: sec, fontWeight: 600 }}>
          Prototype Validated
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-3">
          {KPI_CARDS.map((kpi, i) => (
            <motion.div key={kpi.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: `${kpi.color}08`, border: `1px solid ${kpi.color}25` }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${kpi.color}18` }}>
                  <kpi.icon size={13} style={{ color: kpi.color }} />
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted }}>{kpi.label}</span>
              </div>

              {/* Big percentage */}
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: kpi.color, lineHeight: 1 }}>
                {kpi.pct}
              </div>
              <TrendingUp size={14} style={{ color: kpi.color }} />

              <p style={{ fontSize: '0.625rem', color: textMuted, lineHeight: 1.6 }}>{kpi.desc}</p>

              {/* Before / After */}
              <div className="flex items-center gap-2 pt-1" style={{ borderTop: `1px solid ${kpi.color}20` }}>
                <div className="flex-1 text-center p-1.5 rounded-lg" style={{ background: `${kpi.color}08` }}>
                  <div style={{ fontSize: '0.625rem', color: textMuted, marginBottom: 2 }}>Before</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: textMuted }}>{kpi.before}</div>
                </div>
                <span style={{ color: kpi.color, fontSize: '0.8rem' }}>→</span>
                <div className="flex-1 text-center p-1.5 rounded-lg" style={{ background: `${kpi.color}18` }}>
                  <div style={{ fontSize: '0.625rem', color: kpi.color, marginBottom: 2 }}>After</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: kpi.color }}>{kpi.after}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials + Design outcomes */}
        <div className="grid grid-cols-2 gap-3">

          {/* Testimonials */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2">
              <Star size={13} style={{ color: sec }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>Participant Testimonials</span>
            </div>
            <div className="flex flex-col gap-3">
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.06 }}
                  className="p-3 rounded-xl"
                  style={{ background: `${t.color}08`, borderLeft: `3px solid ${t.color}` }}>
                  <p style={{ fontSize: '0.67rem', color: textMain, fontStyle: 'italic', lineHeight: 1.7, marginBottom: 6 }}>{t.text}</p>
                  <div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, color: t.color }}>{t.name}</div>
                    <div style={{ fontSize: '0.625rem', color: textMuted }}>{t.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Design outcomes checklist */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2">
              <CheckCircle size={13} style={{ color: '#2E7D32' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>Design Outcomes</span>
            </div>
            <div className="flex flex-col gap-2">
              {DESIGN_OUTCOMES.map((o, i) => {
                const color = o.status === 'Validated' ? '#2E7D32' : o.status === 'In Progress' ? '#E65100' : '#78909c';
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl"
                    style={{ background: surface, border: `1px solid ${border}` }}>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${color}15` }}>
                      <CheckCircle size={11} style={{ color }} />
                    </div>
                    <span style={{ fontSize: '0.65rem', color: textMain, flex: 1 }}>{o.item}</span>
                    <span className="px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ fontSize: '0.625rem', fontWeight: 700, background: `${color}12`, color }}>
                      {o.status}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
        <div style={{ height: 8 }} />

        {/* ── Thank You Note ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 120, damping: 18 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: isDark
              ? `linear-gradient(135deg, ${pri}12 0%, ${sec}0e 100%)`
              : `linear-gradient(135deg, ${pri}09 0%, ${sec}08 100%)`,
            border: `1px solid ${pri}22`,
          }}>

          {/* Section label strip */}
          <div className="flex items-center gap-2 px-5 py-2.5"
            style={{ borderBottom: `1px dashed ${pri}18`, background: `${pri}07` }}>
            <Heart size={11} fill={sec} style={{ color: sec }} />
            <span style={{
              fontSize: '0.625rem', fontWeight: 800, color: sec,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Special Thanks
            </span>
          </div>

          {/* Card body */}
          <div className="flex items-center gap-6 px-6 py-5">

            {/* Namaste character – eyes track cursor */}
            <NamasteCharacter primary={pri} secondary={sec} />

            {/* Text content */}
            <div className="flex flex-col gap-3 flex-1">

              <div>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: textMain, lineHeight: 1.3 }}>
                  Thank you,{' '}
                  <span style={{
                    background: `linear-gradient(90deg, ${pri}, ${sec})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Ann D'Souza
                  </span>
                  &nbsp;🙏
                </p>
                <p style={{ fontSize: '0.65rem', color: textMuted, marginTop: 3, fontStyle: 'italic' }}>
                  Research Participant · Interview Session · Jan 2026
                </p>
              </div>

              <p style={{ fontSize: '0.72rem', color: textMuted, lineHeight: 1.85 }}>
                Ann generously spared her valuable time to sit down with our research team and
                share candid, first-hand insights from her daily work as an energy analyst.
                Her perspectives on <span style={{ color: pri, fontWeight: 600 }}>data reconciliation
                workflows</span>, alert fatigue, and cross-system friction directly shaped several
                of the key design decisions documented in this workspace. We are deeply grateful
                for her openness, patience, and thoughtfulness throughout the session.
              </p>

              <div className="flex items-start gap-2.5 p-3 rounded-xl"
                style={{ background: `${sec}0d`, border: `1px solid ${sec}20` }}>
                <span style={{ fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>💬</span>
                <p style={{ fontSize: '0.67rem', color: textMain, fontStyle: 'italic', lineHeight: 1.75 }}>
                  "Your voice, your time, and your trust in this process are what make
                  user-centred design real. Thank you for being an integral part of this research."
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} size={10} fill={i < 5 ? sec : 'none'} style={{ color: sec, opacity: 0.6 + i * 0.08 }} />
                ))}
                <span style={{ fontSize: '0.625rem', color: textMuted, marginLeft: 4 }}>
                  Gratitude from the entire Grid Intelligence research team
                </span>
              </div>

            </div>
          </div>
        </motion.div>

        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}