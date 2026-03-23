import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, User, Clock, Briefcase, Quote, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PARTICIPANTS = [
  {
    id: 'P01', name: 'Rajesh Kumar',    role: 'Grid Operations Manager',  exp: '12 yrs', zone: 'Zone A – North', color: '#1565C0',
    quote: '"I spend more time searching for the right data than actually making decisions. We need everything in one place."',
    highlights: ['Monitors 9 screens simultaneously', 'Resolves 3–5 major faults per shift', 'Uses 4 separate tools for data'],
    themes: ['Data fragmentation', 'Alert fatigue', 'Cognitive overload'],
  },
  {
    id: 'P02', name: 'Priya Sharma',    role: 'Energy Analyst',           exp: '6 yrs',  zone: 'HQ – Analytics', color: '#E65100',
    quote: '"The reports take forever to generate. I have to download raw CSVs and process them in Excel every single time."',
    highlights: ['Generates 15+ reports monthly', 'Data retrieval takes 15–25 min', 'Excel as primary analysis tool'],
    themes: ['Manual reporting', 'Tool limitations', 'Forecasting gaps'],
  },
  {
    id: 'P03', name: 'Amit Singh',      role: 'Field Engineer',           exp: '8 yrs',  zone: 'Zone B – South', color: '#2E7D32',
    quote: '"When I am at a substation, I have no idea what the control room can see. Communication is always delayed."',
    highlights: ['No mobile access to SCADA', 'Updates via phone calls only', 'Location context missing'],
    themes: ['Mobile access', 'Communication gaps', 'Field visibility'],
  },
  {
    id: 'P04', name: 'Sunita Verma',    role: 'DISCOM Administrator',     exp: '15 yrs', zone: 'HQ – Admin',     color: '#7B1FA2',
    quote: '"I need executive-level summaries instantly. Currently, compiling the CEO deck takes half a day."',
    highlights: ['Compiles dashboards manually', 'Relies on 3 department reports', 'No real-time executive view'],
    themes: ['Executive summaries', 'Data consolidation', 'Access control'],
  },
  {
    id: 'P05', name: 'Vikram Nair',     role: 'Load Dispatch Officer',    exp: '9 yrs',  zone: 'Zone C – West',  color: '#00838F',
    quote: '"Peak demand forecasts are always reactive. By the time I get the data, the peak has already hit."',
    highlights: ['Manages 500MW+ load balancing', 'Forecasts updated hourly manually', 'No predictive alerts'],
    themes: ['Forecasting', 'Proactive alerts', 'Real-time data'],
  },
  {
    id: 'P06', name: 'Deepa Mishra',    role: 'Revenue Officer',          exp: '11 yrs', zone: 'HQ – Revenue',   color: '#C62828',
    quote: '"AT&C loss figures differ between three systems. I never know which one is correct for the board meeting."',
    highlights: ['3 systems show different AT&C data', 'Manual reconciliation weekly', 'No single source of truth'],
    themes: ['Data accuracy', 'System reconciliation', 'Revenue tracking'],
  },
];

export function UXInterviews() {
  const [selected, setSelected] = useState(PARTICIPANTS[0]);
  const { settings } = useTheme();
  const ff       = `var(--md-font-family, ${settings.fontFamily})`;
  const isDark   = settings.darkMode;
  const pageBg   = isDark ? '#111111' : '#f0f4fc';
  const cardBg   = isDark ? '#1e1e1e' : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain  = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted = isDark ? '#78909c' : '#546e7a';
  const surface   = isDark ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08`;
  const pri = settings.primaryColor;
  const sec = settings.secondaryColor;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
          <MessageSquare size={16} style={{ color: sec }} />
        </div>
        <div className="flex-1">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>User Interviews</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>14 participants across 5 user roles · Jan 13–24, 2026</p>
        </div>
        <span className="px-2.5 py-1 rounded-full" style={{ background: surface, fontSize: '0.65rem', color: textMuted }}>
          {PARTICIPANTS.length} of 14 shown
        </span>
      </div>

      <div className="flex flex-1 min-h-0 gap-4 p-4">
        {/* Left: Participant list */}
        <div className="flex flex-col gap-2 overflow-y-auto shrink-0" style={{ width: 220 }}>
          <div style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            Participants
          </div>
          {PARTICIPANTS.map((p) => (
            <motion.button key={p.id} whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(p)}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl text-left transition-all"
              style={{
                background: selected.id === p.id ? `${p.color}15` : cardBg,
                border: `1px solid ${selected.id === p.id ? `${p.color}35` : border}`,
              }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${p.color}18` }}>
                <User size={15} style={{ color: p.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: textMain, truncate: true }}>{p.name}</div>
                <div style={{ fontSize: '0.625rem', color: textMuted }}>{p.role}</div>
              </div>
              {selected.id === p.id && <ChevronRight size={12} style={{ color: p.color, shrink: 0 }} />}
            </motion.button>
          ))}
        </div>

        {/* Right: Interview details */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div key={selected.id}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3">

              {/* Profile card */}
              <div className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: `${selected.color}10`, border: `1px solid ${selected.color}25` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${selected.color}20` }}>
                  <User size={28} style={{ color: selected.color }} />
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: selected.color }}>{selected.name}</div>
                  <div style={{ fontSize: '0.72rem', color: textMain, fontWeight: 600, marginTop: 2 }}>{selected.role}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Briefcase size={11} style={{ color: textMuted }} />
                      <span style={{ fontSize: '0.625rem', color: textMuted }}>{selected.exp} experience</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={11} style={{ color: textMuted }} />
                      <span style={{ fontSize: '0.625rem', color: textMuted }}>{selected.zone}</span>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full shrink-0" style={{ fontSize: '0.625rem', fontWeight: 700, background: `${selected.color}18`, color: selected.color }}>
                  {selected.id}
                </span>
              </div>

              {/* Key quote */}
              <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Quote size={13} style={{ color: selected.color }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: textMain }}>Key Quote</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: textMain, lineHeight: 1.8, fontStyle: 'italic', borderLeft: `3px solid ${selected.color}`, paddingLeft: 12 }}>
                  {selected.quote}
                </p>
              </div>

              {/* Highlights + Themes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                    Key Highlights
                  </div>
                  <div className="flex flex-col gap-2">
                    {selected.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${selected.color}15` }}>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: selected.color }} />
                        </div>
                        <span style={{ fontSize: '0.65rem', color: textMuted, lineHeight: 1.5 }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl p-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                    Themes Surfaced
                  </div>
                  <div className="flex flex-col gap-2">
                    {selected.themes.map((t, i) => (
                      <div key={i} className="px-2.5 py-1.5 rounded-xl"
                        style={{ background: `${selected.color}10`, border: `1px solid ${selected.color}20` }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: selected.color }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}