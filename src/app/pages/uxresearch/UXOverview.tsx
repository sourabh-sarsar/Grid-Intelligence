import React from 'react';
import { motion } from 'motion/react';
import {
  Search, MessageSquare, BarChart2, Eye, Users, Lightbulb,
  Clock, CheckCircle, TrendingUp, FileText,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const STATS = [
  { label: 'User Interviews',         value: '14', icon: MessageSquare, color: '#1565C0' },
  { label: 'Survey Responses',        value: '42', icon: BarChart2,     color: '#E65100' },
  { label: 'Stakeholder Interviews',  value: '5',  icon: Users,         color: '#2E7D32' },
  { label: 'Control Room Observations', value: '6', icon: Eye,          color: '#7B1FA2' },
  { label: 'Personas Created',        value: '3',  icon: Users,         color: '#C62828' },
];

const METHODS = [
  { method: 'Semi-structured Interviews', count: 14, color: '#1565C0', pct: 42 },
  { method: 'Online Survey',              count: 42, color: '#E65100', pct: 85 },
  { method: 'Contextual Observation',     count: 6,  color: '#7B1FA2', pct: 25 },
  { method: 'Stakeholder Workshops',      count: 5,  color: '#2E7D32', pct: 20 },
  { method: 'Heuristic Evaluation',       count: 3,  color: '#00838F', pct: 12 },
];

const KEY_INSIGHTS = [
  { text: 'Operators monitor 7–12 screens simultaneously with no unified view', severity: 'high' },
  { text: 'Alert fatigue is critical — 40% of alerts are dismissed without review', severity: 'high' },
  { text: 'Data lives in 4+ siloed systems; no single source of truth', severity: 'high' },
  { text: 'Fault-to-resolution time is 60% longer than industry benchmark', severity: 'medium' },
  { text: 'Mobile access needed during field visits — currently unavailable', severity: 'medium' },
  { text: 'Historical data retrieval takes 15–25 minutes manually', severity: 'medium' },
];

// Top row rendered left-to-right: Discovery … Synthesis
const TOP_ROW = [
  { phase: 'Discovery',  dates: 'W1', desc: 'Stakeholder kick-off & planning' },
  { phase: 'Interviews', dates: 'W2', desc: '14 in-depth user interviews' },
  { phase: 'Survey',     dates: 'W3', desc: '42 quantitative survey responses' },
  { phase: 'Synthesis',  dates: 'W4', desc: 'Affinity mapping & insight clustering' },
];

// Bottom row rendered left-to-right: Reporting … UI Design
// Flow direction is R→L (UI Design is the start, Reporting is the end)
const BOTTOM_ROW = [
  { phase: 'Reporting',  dates: 'W14',    desc: 'Research report & recommendations',   isActive: false },
  { phase: 'Validation', dates: 'W13',    desc: 'Concept testing & feedback',           isActive: false },
  { phase: 'UI Testing', dates: 'W12',    desc: 'Usability testing with operators',     isActive: false },
  { phase: 'UI Design',  dates: 'W5–W11', desc: 'Wireframes, prototypes & design system', isActive: true },
];

const CONN_H = 36; // px — height of the vertical connector between the two rows

export function UXOverview() {
  const { settings } = useTheme();
  const ff      = `var(--md-font-family, ${settings.fontFamily})`;
  const isDark  = settings.darkMode;
  const pageBg  = isDark ? '#111111' : '#f0f4fc';
  const cardBg  = isDark ? '#1e1e1e' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMain   = isDark ? '#e0e0e0' : '#1a1a2e';
  const textMuted  = isDark ? '#78909c' : '#546e7a';
  const surface    = isDark ? 'rgba(255,255,255,0.04)' : `${settings.primaryColor}08`;
  const pri = settings.primaryColor;
  const sec = settings.secondaryColor;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
          <Search size={16} style={{ color: sec }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>
            UX Research Workspace
          </h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>
            Grid Intelligence Platform · DISCOM Operator Research · Jan–Feb 2026
          </p>
        </div>

      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-3">
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-3 flex flex-col gap-1.5 w-full min-w-0"
              style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}15` }}>
                <s.icon size={13} style={{ color: s.color }} />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.625rem', color: textMuted, lineHeight: 1.3 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main bento grid */}
        <div className="grid grid-cols-3 gap-3 flex-1">

          {/* Research Summary */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="col-span-2 rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${pri}18` }}>
                <FileText size={12} style={{ color: pri }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>Research Summary</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: textMuted, lineHeight: 1.7 }}>
              A comprehensive UX research study was conducted for the Grid Intelligence Platform to understand
              the mental models, workflows, and pain points of DISCOM grid operators, energy analysts, and
              administrators. The research combined qualitative depth interviews with quantitative survey data,
              supplemented by on-site control room observations. Insights are organized into five opportunity
              areas that directly inform the platform's information architecture and feature prioritisation.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {['Grid Operators', 'Energy Analysts', 'DISCOM Admins', 'Field Engineers', 'Supervisors'].map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full"
                  style={{ fontSize: '0.625rem', fontWeight: 600, background: `${pri}10`, color: pri, border: `1px solid ${pri}20` }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Research Methods */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${sec}18` }}>
                <BarChart2 size={12} style={{ color: sec }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>Research Methods</span>
            </div>
            <div className="flex flex-col gap-2">
              {METHODS.map(m => (
                <div key={m.method}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span style={{ fontSize: '0.625rem', color: textMuted }}>{m.method}</span>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, color: m.color }}>{m.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: surface }}>
                    <motion.div className="h-full rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ delay: 0.3, duration: 0.6 }}
                      style={{ background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Key Insights */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${sec}18` }}>
                <Lightbulb size={12} style={{ color: sec }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>Key Insights</span>
            </div>
            {KEY_INSIGHTS.map((insight, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.04 }}
                className="flex items-start gap-2 p-2 rounded-xl"
                style={{ background: insight.severity === 'high' ? `${sec}08` : surface, border: `1px solid ${insight.severity === 'high' ? `${sec}20` : border}` }}>
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: insight.severity === 'high' ? sec : textMuted }} />
                <span style={{ fontSize: '0.625rem', color: textMuted, lineHeight: 1.5 }}>{insight.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Research Timeline */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="col-span-2 rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${pri}18` }}>
                <Clock size={12} style={{ color: pri }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: textMain }}>Research Timeline</span>
            </div>

            {/* ── Snake Timeline ─────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

              {/* Row 1 labels — above nodes */}
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                {TOP_ROW.map((t) => (
                  <div key={t.phase} style={{ flex: 1, textAlign: 'center', padding: '0 4px', paddingBottom: 8 }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: textMain }}>{t.phase}</div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 600, color: pri, marginTop: 2 }}>{t.dates}</div>
                    <div style={{ fontSize: '0.625rem', color: textMuted, marginTop: 3, lineHeight: 1.35 }}>{t.desc}</div>
                  </div>
                ))}
              </div>

              {/* Row 1 nodes */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {TOP_ROW.map((t, i) => (
                  <div key={t.phase} style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
                    {/* left connector */}
                    <div style={{ flex: 1, height: 2, background: i === 0 ? 'transparent' : '#2e7d32' }} />
                    {/* node */}
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0, zIndex: 10,
                      background: '#2e7d32', border: `2px solid #2e7d32`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CheckCircle size={10} color="#fff" />
                    </div>
                    {/* right connector — transparent for Synthesis (connects vertically instead) */}
                    <div style={{ flex: 1, height: 2, background: i === TOP_ROW.length - 1 ? 'transparent' : '#2e7d32' }} />
                    {/* vertical connector going DOWN from Synthesis */}
                    {i === TOP_ROW.length - 1 && (
                      <div style={{
                        position: 'absolute', left: '50%', top: '100%',
                        transform: 'translateX(-50%)',
                        width: 2, height: CONN_H, background: sec, zIndex: 1,
                      }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Vertical connector spacer */}
              <div style={{ height: CONN_H }} />

              {/* Row 2 nodes — Reporting … UI Design (flow R→L) */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {BOTTOM_ROW.map((t, i) => (
                  <div key={t.phase} style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
                    {/* vertical connector going UP from UI Design */}
                    {i === BOTTOM_ROW.length - 1 && (
                      <div style={{
                        position: 'absolute', left: '50%', bottom: '100%',
                        transform: 'translateX(-50%)',
                        width: 2, height: CONN_H, background: sec, zIndex: 1,
                      }} />
                    )}
                    {/* left connector — transparent for Reporting (terminal node) */}
                    <div style={{ flex: 1, height: 2, background: i === 0 ? 'transparent' : sec }} />
                    {/* node */}
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0, zIndex: 10,
                      background: sec,
                      border: `3px solid ${sec}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                    </div>
                    {/* right connector — transparent for UI Design */}
                    <div style={{ flex: 1, height: 2, background: i === BOTTOM_ROW.length - 1 ? 'transparent' : sec }} />
                  </div>
                ))}
              </div>

              {/* Row 2 labels — below nodes */}
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {BOTTOM_ROW.map((t) => (
                  <div key={t.phase} style={{ flex: 1, textAlign: 'center', padding: '0 4px', paddingTop: 8 }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: sec }}>{t.phase}</div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 600, color: textMuted, marginTop: 2 }}>{t.dates}</div>
                    <div style={{ fontSize: '0.625rem', color: textMuted, marginTop: 3, lineHeight: 1.35 }}>
                      {t.phase === 'UI Design' ? 'Built with AI · Delivered to developers for API integration' : t.desc}
                    </div>
                  </div>
                ))}
              </div>

            </div>
            {/* ── End Snake Timeline ─────────────────────────────── */}

          </motion.div>

        </div>
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}