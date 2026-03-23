import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Target, AlertTriangle, Briefcase, CheckCircle, Star,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PERSONAS = [
  {
    id: 'P1', name: 'Rajesh Kumar', role: 'Grid Operations Manager', age: 42,
    color: '#1565C0', avatar: '👨‍💼',
    bio: 'Rajesh has 12 years of experience managing grid operations for the Northern Zone. He oversees a team of 8 operators, coordinating fault response and load balancing. He is comfortable with technology but frustrated by fragmented tools.',
    goals: [
      'Single unified view of the entire grid in real-time',
      'Faster fault detection and automated dispatch workflows',
      'Mobile access when attending field inspections',
      'AI-assisted anomaly detection to reduce manual checking',
    ],
    frustrations: [
      'Constantly switching between 4 siloed software systems',
      'Alert notifications are too generic — no smart prioritisation',
      'Historical data retrieval takes 15–25 minutes manually',
      'SCADA system lags during peak load periods',
    ],
    responsibilities: [
      'Monitor grid KPIs across 6 substations',
      'Coordinate with field engineers during faults',
      'Prepare daily operations report for management',
      'Ensure AT&C loss targets are met each quarter',
    ],
    quote: '"I need a cockpit view, not a collection of spreadsheets."',
    tags: ['Power User', 'Decision Maker', 'Shift Lead'],
  },
  {
    id: 'P2', name: 'Priya Sharma', role: 'Energy Analyst', age: 34,
    color: '#E65100', avatar: '👩‍💻',
    bio: 'Priya is a data-driven analyst responsible for load forecasting, AT&C loss analysis, and revenue reconciliation. She holds an MBA in Energy Management and works primarily at headquarters, producing reports for senior management.',
    goals: [
      'Automated, on-demand report generation without manual data pulls',
      'Integrated forecasting models with live SCADA data',
      'Customisable dashboards for different stakeholder audiences',
      'Clean APIs to build custom analytical models',
    ],
    frustrations: [
      'Data from 3 systems never reconciles automatically',
      'AT&C loss figures are inconsistent across different reports',
      'Excel dependency for even simple trend analysis',
      'No version control on analytical models and reports',
    ],
    responsibilities: [
      'Monthly AT&C loss and revenue reconciliation reports',
      'Quarterly load forecasting for the SLDC submission',
      'Consumer category growth and billing trend analysis',
      'Board-level energy performance presentations',
    ],
    quote: '"If I could trust the data, I could do my job twice as fast."',
    tags: ['Analyst', 'Report User', 'Data-First'],
  },
  {
    id: 'P3', name: 'Amit Singh', role: 'Field Engineer', age: 38,
    color: '#2E7D32', avatar: '👷',
    bio: 'Amit works on-site at substations and distribution points across the Southern Zone. He is the first responder during equipment failures and needs real-time information while physically at the fault location — often with limited connectivity.',
    goals: [
      'Mobile-first app with offline mode for field work',
      'Real-time work order assignment with GPS routing',
      'Ability to upload fault photos and update status from the field',
      'Direct communication channel with control room operators',
    ],
    frustrations: [
      'No mobile access to SCADA or control room dashboards',
      'Work orders are communicated verbally via phone calls',
      'Cannot see what the control room is monitoring in real-time',
      'Report submission requires returning to office to use desktop',
    ],
    responsibilities: [
      'Physical inspection and repair of distribution equipment',
      'First-response during feeder trips and transformer faults',
      'Installing and replacing smart meters',
      'Logging fault details in the paper maintenance register',
    ],
    quote: '"A 5-minute phone delay during a fault costs everyone."',
    tags: ['Field User', 'Mobile-First', 'Offline Needs'],
  },
];

export function UXPersonas() {
  const [selected, setSelected] = useState(0);
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
  const p = PERSONAS[selected];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
          <User size={16} style={{ color: sec }} />
        </div>
        <div className="flex-1">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>User Personas</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>3 primary personas synthesised from 14 interviews and 42 survey responses</p>
        </div>
        {/* Persona switcher tabs */}
        <div className="flex gap-1">
          {PERSONAS.map((per, i) => (
            <motion.button key={per.id} whileTap={{ scale: 0.96 }}
              onClick={() => setSelected(i)}
              className="px-3 py-1.5 rounded-xl transition-all"
              style={{
                background: i === selected ? `${per.color}18` : surface,
                border: `1px solid ${i === selected ? `${per.color}35` : border}`,
                fontSize: '0.65rem', fontWeight: 700,
                color: i === selected ? per.color : textMuted,
              }}>
              {per.id}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4">

            {/* Profile banner */}
            <div className="rounded-2xl p-5 flex items-center gap-5"
              style={{ background: `${p.color}10`, border: `1px solid ${p.color}25` }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 text-4xl"
                style={{ background: `${p.color}20` }}>
                {p.avatar}
              </div>
              <div className="flex-1">
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: p.color }}>{p.name}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: textMain, marginTop: 2 }}>{p.role}</div>
                <div style={{ fontSize: '0.65rem', color: textMuted, marginTop: 2 }}>Age {p.age} · Field Research Participant</div>
                <div className="flex gap-1.5 mt-2">
                  {p.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full"
                      style={{ fontSize: '0.625rem', fontWeight: 700, background: `${p.color}15`, color: p.color }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {/* Quote */}
              <div className="max-w-sm p-3 rounded-2xl shrink-0"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#fff', border: `1px solid ${p.color}20` }}>
                <p style={{ fontSize: '0.7rem', color: textMain, fontStyle: 'italic', lineHeight: 1.7 }}>{p.quote}</p>
              </div>
            </div>

            {/* Bio */}
            <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="flex items-center gap-2 mb-2">
                <User size={13} style={{ color: p.color }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: textMain }}>Bio</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: textMuted, lineHeight: 1.8 }}>{p.bio}</p>
            </div>

            {/* Goals, Frustrations, Responsibilities */}
            <div className="grid grid-cols-3 gap-3">
              {/* Goals */}
              <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Target size={13} style={{ color: '#2E7D32' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: textMain }}>Goals</span>
                </div>
                <div className="flex flex-col gap-2">
                  {p.goals.map((g, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={11} style={{ color: '#2E7D32', marginTop: 2, shrink: 0, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.63rem', color: textMuted, lineHeight: 1.5 }}>{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frustrations */}
              <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={13} style={{ color: '#C62828' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: textMain }}>Frustrations</span>
                </div>
                <div className="flex flex-col gap-2">
                  {p.frustrations.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0" />
                      <span style={{ fontSize: '0.63rem', color: textMuted, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              <div className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase size={13} style={{ color: p.color }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: textMain }}>Responsibilities</span>
                </div>
                <div className="flex flex-col gap-2">
                  {p.responsibilities.map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Star size={10} style={{ color: p.color, marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.63rem', color: textMuted, lineHeight: 1.5 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}