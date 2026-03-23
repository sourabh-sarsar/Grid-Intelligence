import React from 'react';
import { motion } from 'motion/react';
import {
  BookOpen, AlertTriangle, Rocket, Lightbulb,
  CheckCircle, ArrowRight, Zap, Users, BarChart2, Shield,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PROBLEM_POINTS = [
  {
    icon: BarChart2, color: '#C62828',
    title: 'Fragmented data ecosystem',
    desc: 'DISCOM operators rely on 4+ disconnected systems — SCADA, ERP, Excel, and paper registers — with no single source of truth. AT&C loss figures regularly differ across systems by 3–7%.',
  },
  {
    icon: AlertTriangle, color: '#E65100',
    title: 'Critical alert fatigue',
    desc: 'The legacy alert system generates 200–400 undifferentiated notifications per shift. Operators dismiss up to 40% without review, creating dangerous blind spots during real fault events.',
  },
  {
    icon: Zap, color: '#7B1FA2',
    title: 'Slow fault-to-resolution pipeline',
    desc: 'Mean time from fault detection to field dispatch averages 23 minutes — 60% above industry benchmark — due to manual cross-checking, phone-based communication, and absence of contextual tooling.',
  },
  {
    icon: Users, color: '#1565C0',
    title: 'Invisible field operations',
    desc: 'Field engineers have zero real-time access to control room data during site visits. All coordination happens via phone calls, leading to duplication of effort and extended downtimes.',
  },
];

const AMBITIONS = [
  {
    label: 'Unified Intelligence Layer',
    desc: 'Build a single, role-aware control surface that consolidates every critical data stream — grid topology, live SCADA telemetry, alerts, assets, revenue, and forecasts — into one coherent workspace.',
    metric: '≥ 40% reduction in tool-switching per shift',
    color: '#1565C0',
    icon: Shield,
  },
  {
    label: 'Proactive, Not Reactive',
    desc: 'Shift the operator mental model from fire-fighting to anticipation. AI-assisted alert triage, 30-minute demand forecasts, and anomaly pre-warnings should make incidents predictable before they escalate.',
    metric: '< 5 min mean detection-to-awareness time',
    color: '#E65100',
    icon: Rocket,
  },
  {
    label: 'Field-First Mobile Experience',
    desc: 'Give field engineers a first-class mobile companion that mirrors the control room view, delivers contextual work orders with equipment history, and closes the communication gap in real time.',
    metric: 'Full parity between field and control room visibility',
    color: '#2E7D32',
    icon: Zap,
  },
  {
    label: 'Trusted, Reconciled Data',
    desc: 'Establish a single data governance layer that auto-reconciles figures across SCADA, ERP, and billing systems. Revenue officers and analysts should never again question which number is correct.',
    metric: '100% data consistency across modules',
    color: '#7B1FA2',
    icon: CheckCircle,
  },
];

const SOLUTION_PILLARS = [
  {
    num: '01', title: 'Control Room Dashboard',
    desc: 'A bento-grid command centre showing live grid health, zone-level KPIs, active alerts ranked by AI severity, and load-vs-forecast deviation — all updating in sub-second refresh cycles.',
    tags: ['Real-time SCADA', 'Smart alert triage', 'Zone drill-down', 'Role-based views'],
    color: '#1565C0',
  },
  {
    num: '02', title: 'Smart Alert Engine',
    desc: 'Machine-learning classifier trained on 18 months of historical fault data to suppress false positives, rank alert severity, auto-assign to the right role, and surface root-cause hypotheses inline.',
    tags: ['ML severity ranking', 'False-positive filter', 'Auto-assignment', 'Root-cause hints'],
    color: '#C62828',
  },
  {
    num: '03', title: 'Integrated Analytics Suite',
    desc: 'On-demand report generation, AT&C loss reconciliation, load forecasting with weather integration, and consumer-category revenue analysis — all operating from a single reconciled data layer.',
    tags: ['Auto-reconciliation', 'On-demand reports', 'Weather integration', 'Forecast models'],
    color: '#E65100',
  },
  {
    num: '04', title: 'Mobile Field Companion',
    desc: 'Progressive web app delivering work orders, equipment history, geo-located fault navigation, photo upload, and real-time status sync with the control room.',
    tags: ['GPS routing', 'Photo upload', 'Live sync', 'Work orders'],
    color: '#2E7D32',
  },
];

export function UXBrief() {
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

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${sec}18` }}>
          <BookOpen size={16} style={{ color: sec }} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>
            Project Brief
          </h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>
            Grid Intelligence Platform · UX Research Foundation Document
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full shrink-0"
          style={{ background: `${pri}10`, border: `1px solid ${pri}25`, fontSize: '0.65rem', color: pri, fontWeight: 600 }}>
          v1.0 — Approved
        </span>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

        {/* ── 1. Problem Statement ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>

          {/* Section label */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ background: sec }} />
            <AlertTriangle size={14} style={{ color: sec }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: sec, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Problem Statement
            </span>
          </div>

          {/* Context paragraph */}
          <div className="rounded-2xl p-4 mb-3"
            style={{ background: `${sec}08`, border: `1px solid ${sec}20` }}>
            <p style={{ fontSize: '0.72rem', color: textMain, lineHeight: 1.85 }}>
              India's DISCOMs operate mission-critical grid infrastructure, yet operators rely on
              pre-smartphone-era tools. The <strong style={{ color: textMain }}>Grid Intelligence Platform</strong> aims
              to modernise this — but without deep user research, the product mirrors legacy pain points rather
              than solving them. This brief defines the problem space, ambition, and design direction for all UX decisions.
            </p>
          </div>

          {/* Problem cards */}
          <div className="grid grid-cols-2 gap-3">
            {PROBLEM_POINTS.map((p, i) => {
              const PIcon = p.icon;
              return (
              <motion.div key={p.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -8 : 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="rounded-2xl p-4 flex gap-3"
                style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${p.color}12` }}>
                  <PIcon size={14} style={{ color: p.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textMain, marginBottom: 4 }}>
                    {p.title}
                  </div>
                  <p style={{ fontSize: '0.69rem', color: textMuted, lineHeight: 1.65 }}>{p.desc}</p>
                </div>
              </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 2. Ambition ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>

          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ background: pri }} />
            <Rocket size={14} style={{ color: pri }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: pri, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Ambition
            </span>
          </div>

          {/* Headline ambition statement */}
          <div className="rounded-2xl p-4 mb-3 flex items-start gap-4"
            style={{ background: `${pri}08`, border: `1px solid ${pri}22` }}>
            <Rocket size={20} style={{ color: pri, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.78rem', color: textMain, lineHeight: 1.85, fontStyle: 'italic' }}>
              "To make every DISCOM operator, analyst, and field engineer <strong style={{ color: pri }}>
              faster, more confident, and less cognitively burdened</strong> — by designing a platform
              that surfaces the right information to the right person at the right moment, automatically."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {AMBITIONS.map((a, i) => {
              const AIcon = a.icon;
              return (
              <motion.div key={a.label}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                className="rounded-2xl p-4 flex flex-col gap-2.5"
                style={{ background: cardBg, border: `1px solid ${a.color}20` }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${a.color}15` }}>
                    <AIcon size={13} style={{ color: a.color }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: a.color }}>{a.label}</span>
                </div>
                <p style={{ fontSize: '0.69rem', color: textMuted, lineHeight: 1.65 }}>{a.desc}</p>
                <div className="flex items-center gap-1.5 pt-1.5 mt-auto"
                  style={{ borderTop: `1px dashed ${a.color}25` }}>
                  <CheckCircle size={10} style={{ color: a.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, color: a.color }}>{a.metric}</span>
                </div>
              </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 3. Brief About Solution ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>

          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ background: '#2E7D32' }} />
            <Lightbulb size={14} style={{ color: '#2E7D32' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Brief About Solution
            </span>
          </div>

          {/* Intro */}
          <div className="rounded-2xl p-4 mb-3"
            style={{ background: '#2E7D3208', border: '1px solid #2E7D3222' }}>
            <p style={{ fontSize: '0.72rem', color: textMain, lineHeight: 1.85 }}>
              The solution is a <strong style={{ color: textMain }}>modular, role-aware SaaS platform</strong>{' '}
              built on a 12-column bento-grid layout with deep theme customisation, real-time data integration,
              and an AI-assisted intelligence layer. It is delivered as a unified web application with a
              Progressive Web App extension for field use. The platform is organised into four mutually
              reinforcing capability pillars, each informed directly by the research findings documented in
              this workspace.
            </p>
          </div>

          {/* Solution pillars */}
          <div className="grid grid-cols-2 gap-3">
            {SOLUTION_PILLARS.map((s, i) => (
              <motion.div key={s.num}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{ background: cardBg, border: `1px solid ${border}` }}>

                {/* Pillar header */}
                <div className="flex items-center gap-2.5">
                  <span style={{
                    fontSize: '1.5rem', fontWeight: 900, color: `${s.color}30`,
                    lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                  }}>
                    {s.num}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: s.color }}>{s.title}</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.69rem', color: textMuted, lineHeight: 1.65 }}>{s.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {s.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                      style={{ fontSize: '0.625rem', fontWeight: 600, background: `${s.color}10`, color: s.color, border: `1px solid ${s.color}20` }}>
                      <ArrowRight size={8} />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}