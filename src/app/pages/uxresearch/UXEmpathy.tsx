import React from 'react';
import { motion } from 'motion/react';
import { Brain, Eye, Heart, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StickyNote { text: string; rotate: number; color: string; }

const QUADRANTS: {
  id: string; label: string; icon: React.ElementType; color: string;
  bg: string; notes: StickyNote[];
}[] = [
  {
    id: 'thinks', label: 'Thinks', icon: Brain, color: '#1565C0', bg: '#EFF6FF',
    notes: [
      { text: 'Is the grid stable right now?', rotate: -2, color: '#DBEAFE' },
      { text: 'Will this alert escalate further?', rotate: 1.5, color: '#BFDBFE' },
      { text: 'I hope no one misses a fault on night shift.', rotate: -1, color: '#93C5FD' },
      { text: 'Too many dashboards to monitor.', rotate: 2, color: '#DBEAFE' },
      { text: 'What was the load profile yesterday at this time?', rotate: -1.5, color: '#BFDBFE' },
    ],
  },
  {
    id: 'feels', label: 'Feels', icon: Heart, color: '#C62828', bg: '#FFF1F2',
    notes: [
      { text: 'Overwhelmed by the volume of alerts.', rotate: 1, color: '#FEE2E2' },
      { text: 'Frustrated when systems show conflicting data.', rotate: -2, color: '#FECACA' },
      { text: 'Anxious during peak demand hours.', rotate: 1.5, color: '#FCA5A5' },
      { text: 'Relief when the fault is resolved and the zone stabilises.', rotate: -1, color: '#FEE2E2' },
      { text: 'Stressed when management asks for instant summaries.', rotate: 2, color: '#FECACA' },
    ],
  },
  {
    id: 'says', label: 'Says', icon: Zap, color: '#E65100', bg: '#FFF7ED',
    notes: [
      { text: '"Can someone confirm the transformer status in Zone B?"', rotate: -1.5, color: '#FED7AA' },
      { text: '"The SCADA is lagging again."', rotate: 2, color: '#FDBA74' },
      { text: '"I need this report by end of shift — pull it manually."', rotate: -1, color: '#FED7AA' },
      { text: '"Why are we getting alerts for things that resolved themselves?"', rotate: 1, color: '#FDBA74' },
      { text: '"There should be one screen for all of this."', rotate: -2, color: '#FED7AA' },
    ],
  },
  {
    id: 'does', label: 'Does', icon: Eye, color: '#2E7D32', bg: '#F0FDF4',
    notes: [
      { text: 'Switches between 4 different software tools in a single shift.', rotate: 1.5, color: '#BBF7D0' },
      { text: 'Calls field engineers via phone when the portal is slow.', rotate: -2, color: '#86EFAC' },
      { text: 'Maintains personal Excel logs as backup tracking.', rotate: 1, color: '#BBF7D0' },
      { text: 'Dismisses alerts after a quick glance to clear the queue.', rotate: -1, color: '#86EFAC' },
      { text: 'Walks to a colleague\'s desk to cross-verify readings.', rotate: 2, color: '#BBF7D0' },
    ],
  },
];

export function UXEmpathy() {
  const { settings } = useTheme();
  const ff       = `var(--md-font-family, ${settings.fontFamily})`;
  const isDark   = settings.darkMode;
  const pageBg   = isDark ? '#111111' : '#f0f4fc';
  const cardBg   = isDark ? '#1e1e1e' : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain  = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted = isDark ? '#78909c' : '#546e7a';
  const sec = settings.secondaryColor;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
          <Brain size={16} style={{ color: sec }} />
        </div>
        <div className="flex-1">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>Empathy Map</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>Composite empathy map for the Grid Operator persona · synthesised from 14 interviews</p>
        </div>
        <span className="px-2.5 py-1 rounded-full" style={{ background: `${sec}10`, border: `1px solid ${sec}20`, fontSize: '0.65rem', color: sec, fontWeight: 600 }}>
          Composite Persona
        </span>
      </div>

      {/* 2×2 grid */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="grid grid-cols-2 gap-3 h-full">
          {QUADRANTS.map((q, qi) => (
            <motion.div key={q.id}
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: qi * 0.08 }}
              className="rounded-2xl p-4 flex flex-col gap-3 overflow-hidden"
              style={{ background: isDark ? '#1e1e1e' : q.bg, border: `1px solid ${q.color}25` }}>
              {/* Quadrant header */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{ background: `${q.color}20` }}>
                  <q.icon size={14} style={{ color: q.color }} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: q.color, letterSpacing: '-0.01em' }}>
                  {q.label}
                </span>
              </div>

              {/* Sticky notes */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                {q.notes.map((note, ni) => (
                  <motion.div key={ni}
                    initial={{ opacity: 0, y: 8, rotate: 0 }}
                    animate={{ opacity: 1, y: 0, rotate: note.rotate }}
                    transition={{ delay: 0.1 + qi * 0.05 + ni * 0.06 }}
                    whileHover={{ rotate: 0, scale: 1.02, zIndex: 10 }}
                    className="rounded-xl p-2.5 cursor-default"
                    style={{
                      background: isDark ? `${q.color}12` : note.color,
                      border: `1px solid ${q.color}20`,
                      boxShadow: `2px 3px 8px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
                      transformOrigin: 'center center',
                      position: 'relative',
                    }}>
                    <p style={{ fontSize: '0.67rem', color: isDark ? textMain : '#1a1a2e', lineHeight: 1.5 }}>
                      {note.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
