import React from 'react';
import { motion } from 'motion/react';
import {
  ClipboardList, Target, FlaskConical, MessageSquare,
  BarChart2, Eye, Brain, CheckCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const OBJECTIVES = [
  { id: 1, title: 'Understand operator mental models', desc: 'How do grid operators conceptualize the power grid, faults, and normal operations?', priority: 'P0' },
  { id: 2, title: 'Map current tool workflows', desc: 'Document the existing end-to-end workflow from alert detection to resolution.', priority: 'P0' },
  { id: 3, title: 'Identify critical pain points', desc: 'Surface the biggest friction points that slow down response times and increase errors.', priority: 'P0' },
  { id: 4, title: 'Evaluate information hierarchy', desc: 'Understand what data is needed first, second, and third during an incident.', priority: 'P1' },
  { id: 5, title: 'Assess collaboration patterns', desc: 'How do operators, field engineers and supervisors collaborate during incidents?', priority: 'P1' },
  { id: 6, title: 'Discover mobile usage contexts', desc: 'When and where do users need access outside the control room?', priority: 'P2' },
];

const METHODS = [
  {
    id: 'interviews', icon: MessageSquare, color: '#1565C0', title: 'Semi-structured Interviews',
    desc: '45–60 min sessions with 14 participants across 3 user roles. Conducted remotely and on-site.',
    details: ['14 participants', '3 user roles', '45–60 min each', 'Recorded with consent'],
  },
  {
    id: 'survey', icon: BarChart2, color: '#E65100', title: 'Online Quantitative Survey',
    desc: '42 responses collected via Google Forms. Focused on tool usage frequency and pain point severity.',
    details: ['42 responses', '5-point Likert scale', '18 questions', 'Jan 27–31 2026'],
  },
  {
    id: 'observation', icon: Eye, color: '#7B1FA2', title: 'Control Room Observation',
    desc: '6 observation sessions (2hrs each) at DISCOM control centres. Fly-on-the-wall methodology.',
    details: ['6 sessions', '2 hrs each', '3 control rooms', 'No intervention'],
  },
  {
    id: 'analysis', icon: Brain, color: '#2E7D32', title: 'Affinity Mapping & Synthesis',
    desc: 'All qualitative data synthesized into 8 affinity clusters and 5 key opportunity areas.',
    details: ['8 clusters', '5 opportunities', 'FigJam board', '2 weeks synthesis'],
  },
];

const TIMELINE = [
  { week: 'Week 1', dates: 'Jan 6–10',  phase: 'Kick-off & Planning',       icon: ClipboardList, color: '#546e7a', done: true },
  { week: 'Week 2', dates: 'Jan 13–17', phase: 'Interviews — Batch 1',      icon: MessageSquare, color: '#1565C0', done: true },
  { week: 'Week 3', dates: 'Jan 20–24', phase: 'Interviews — Batch 2',      icon: MessageSquare, color: '#1565C0', done: true },
  { week: 'Week 4', dates: 'Jan 27–31', phase: 'Survey Live + Observation', icon: BarChart2,     color: '#E65100', done: true },
  { week: 'Week 5', dates: 'Feb 3–7',   phase: 'Data Transcription',        icon: FlaskConical,  color: '#7B1FA2', done: true },
  { week: 'Week 6', dates: 'Feb 10–14', phase: 'Affinity Mapping',          icon: Brain,         color: '#2E7D32', done: true },
  { week: 'Week 7', dates: 'Feb 17–21', phase: 'Concept Validation',        icon: Eye,           color: '#00838F', done: true },
  { week: 'Week 8', dates: 'Feb 24+',   phase: 'Reporting & Handoff',       icon: ClipboardList, color: '#E65100', done: false },
];

const PRIORITY_COLOR: Record<string, string> = {
  P0: '#C62828', P1: '#E65100', P2: '#1565C0',
};

export function UXResearchPlan() {
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
          <ClipboardList size={16} style={{ color: sec }} />
        </div>
        <div className="flex-1">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>Research Plan</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>Objectives, methodology, and timeline for the Grid Intelligence UX study</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Two-column: Objectives + Methodology */}
        <div className="grid grid-cols-2 gap-3">

          {/* Research Objectives */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${pri}18` }}>
                <Target size={12} style={{ color: pri }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>Research Objectives</span>
            </div>
            <div className="flex flex-col gap-2">
              {OBJECTIVES.map((obj, i) => (
                <motion.div key={obj.id}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.04 }}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl"
                  style={{ background: surface, border: `1px solid ${border}` }}>
                  <span className="px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                    style={{ fontSize: '0.625rem', fontWeight: 800, background: `${PRIORITY_COLOR[obj.priority]}15`, color: PRIORITY_COLOR[obj.priority] }}>
                    {obj.priority}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.67rem', fontWeight: 700, color: textMain, marginBottom: 2 }}>{obj.title}</div>
                    <div style={{ fontSize: '0.625rem', color: textMuted, lineHeight: 1.5 }}>{obj.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Research Methodology */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
                <FlaskConical size={12} style={{ color: sec }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>Research Methodology</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {METHODS.map((m, i) => (
                <motion.div key={m.id}
                  initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }}
                  className="rounded-xl p-3"
                  style={{ background: `${m.color}08`, border: `1px solid ${m.color}20` }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${m.color}18` }}>
                      <m.icon size={12} style={{ color: m.color }} />
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: textMain }}>{m.title}</span>
                  </div>
                  <p style={{ fontSize: '0.625rem', color: textMuted, lineHeight: 1.5, marginBottom: 8 }}>{m.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {m.details.map(d => (
                      <span key={d} className="px-1.5 py-0.5 rounded-full"
                        style={{ fontSize: '0.625rem', fontWeight: 600, background: `${m.color}15`, color: m.color }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}