import React from 'react';
import { motion } from 'motion/react';
import { Navigation, ArrowRight, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const STAGES = [
  {
    id: 'monitoring', label: 'Monitoring Grid', emoji: '😐', mood: 'Neutral',
    moodColor: '#546e7a', color: '#1565C0',
    actions: [
      'Watching live SCADA display',
      'Checking load vs. demand forecast',
      'Reviewing overnight logs',
      'Cross-checking 3 separate tool dashboards',
    ],
    thoughts: [
      '"Load seems stable for now."',
      '"Hope nothing triggers during handoff."',
      '"Need to check Zone B transformer reading."',
    ],
    painPoints: [
      'No unified view — must check 4 tools',
      'Load data refresh lags by 2–5 minutes',
      'Alert queue has 30+ unread notifications',
    ],
  },
  {
    id: 'detecting', label: 'Detecting Issue', emoji: '😟', mood: 'Stress',
    moodColor: '#E65100', color: '#E65100',
    actions: [
      'Alert notification appears in SCADA',
      'Tries to identify fault zone from alert text',
      'Checks voltage on 3 separate screens',
      'Calls colleague to confirm reading',
    ],
    thoughts: [
      '"Is this a real fault or a false positive?"',
      '"Which feeder is this affecting?"',
      '"I need more context — one alert is not enough."',
    ],
    painPoints: [
      'Alerts lack location context',
      '40% of alerts are false positives',
      'No severity auto-ranking on incoming alerts',
    ],
  },
  {
    id: 'investigating', label: 'Investigating Cause', emoji: '😠', mood: 'Frustration',
    moodColor: '#C62828', color: '#C62828',
    actions: [
      'Pulls historical data from ERP manually',
      'Exports CSV and opens in Excel',
      'Calls field engineer for on-site visual',
      'Logs incident manually in paper register',
    ],
    thoughts: [
      '"Why does this export take 10 minutes?"',
      '"I should have this data in front of me already."',
      '"The field team isn\'t responding on the portal."',
    ],
    painPoints: [
      'Historical data retrieval is slow (15–25 min)',
      'Field communication happens via phone only',
      'No root-cause suggestion from the system',
    ],
  },
  {
    id: 'acting', label: 'Taking Action', emoji: '😤', mood: 'Pressure',
    moodColor: '#7B1FA2', color: '#7B1FA2',
    actions: [
      'Issues switching instruction to control room',
      'Calls field engineer to proceed to fault site',
      'Updates supervisor via WhatsApp message',
      'Logs action start time in paper register',
    ],
    thoughts: [
      '"I\'m making this call with incomplete data."',
      '"I hope the field team gets there in time."',
      '"My supervisor will want an update in 10 minutes."',
    ],
    painPoints: [
      'Dispatch workflow is entirely manual',
      'No structured communication trail',
      'Cannot track field engineer location or ETA',
    ],
  },
  {
    id: 'resolving', label: 'Resolving Incident', emoji: '😊', mood: 'Relief',
    moodColor: '#2E7D32', color: '#2E7D32',
    actions: [
      'Field engineer confirms repair complete',
      'Verifies grid stability back on SCADA',
      'Manually writes resolution report',
      'Updates incident log with close time',
    ],
    thoughts: [
      '"Finally — that took longer than it should."',
      '"The report will take another hour to write."',
      '"I need to flag this in the weekly meeting."',
    ],
    painPoints: [
      'Post-incident report is entirely manual',
      'No automatic timeline generation',
      'Lessons learned are not systematically captured',
    ],
  },
];

export function UXJourney() {
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

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: pageBg, fontFamily: ff }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 56, borderBottom: `1px solid ${border}`, background: cardBg }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sec}18` }}>
          <Navigation size={16} style={{ color: sec }} />
        </div>
        <div className="flex-1">
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: textMain, lineHeight: 1 }}>User Journey Map</h2>
          <p style={{ fontSize: '0.68rem', color: textMuted, marginTop: 2 }}>Fault response journey · Rajesh Kumar, Grid Operations Manager</p>
        </div>
        <div className="flex items-center gap-2">
          {[{ e: '😐', l: 'Neutral' }, { e: '😟', l: 'Stress' }, { e: '😠', l: 'Frustration' }, { e: '😤', l: 'Pressure' }, { e: '😊', l: 'Relief' }].map(m => (
            <div key={m.l} className="flex items-center gap-1">
              <span style={{ fontSize: '0.85rem' }}>{m.e}</span>
              <span style={{ fontSize: '0.625rem', color: textMuted }}>{m.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Journey board — horizontal scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        <div className="flex gap-3 h-full" style={{ minWidth: STAGES.length * 280 + (STAGES.length - 1) * 12 }}>
          {STAGES.map((stage, i) => (
            <React.Fragment key={stage.id}>
              {/* Stage card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="flex flex-col rounded-2xl overflow-hidden shrink-0"
                style={{ width: 276, border: `1px solid ${stage.color}25`, background: cardBg }}>

                {/* Stage header */}
                <div className="px-3 py-2.5 flex items-center gap-2 shrink-0"
                  style={{ background: `${stage.color}12`, borderBottom: `1px solid ${stage.color}20` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${stage.color}25`, fontSize: '0.7rem', fontWeight: 800, color: stage.color }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: stage.color, flex: 1 }}>{stage.label}</span>
                  <span style={{ fontSize: '1.2rem' }}>{stage.emoji}</span>
                  <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: '0.625rem', fontWeight: 700, background: `${stage.moodColor}15`, color: stage.moodColor }}>
                    {stage.mood}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
                  {/* Actions */}
                  <div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                      Actions
                    </div>
                    <div className="flex flex-col gap-1">
                      {stage.actions.map((a, j) => (
                        <div key={j} className="flex items-start gap-1.5">
                          <Zap size={9} style={{ color: stage.color, marginTop: 3, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.625rem', color: textMuted, lineHeight: 1.4 }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Thoughts */}
                  <div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                      Thoughts
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {stage.thoughts.map((t, j) => (
                        <div key={j} className="px-2 py-1.5 rounded-lg"
                          style={{ background: `${stage.color}08`, border: `1px solid ${stage.color}15` }}>
                          <span style={{ fontSize: '0.625rem', color: textMain, fontStyle: 'italic', lineHeight: 1.4 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pain points */}
                  <div>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#C62828', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                      Pain Points
                    </div>
                    <div className="flex flex-col gap-1">
                      {stage.painPoints.map((pp, j) => (
                        <div key={j} className="flex items-start gap-1.5 p-1.5 rounded-lg"
                          style={{ background: '#C6282808', border: '1px solid #C6282820' }}>
                          <AlertTriangle size={9} style={{ color: '#C62828', marginTop: 2, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.625rem', color: textMuted, lineHeight: 1.4 }}>{pp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Connector arrow */}
              {i < STAGES.length - 1 && (
                <div className="flex items-center justify-center shrink-0" style={{ width: 12 }}>
                  <ArrowRight size={16} style={{ color: textMuted, opacity: 0.4 }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}