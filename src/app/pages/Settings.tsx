import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Palette, Type, Layout, Grid, Sliders, Zap, Play, CheckCircle,
  RotateCcw, Save, Eye, Bell, Settings2, Search
} from 'lucide-react';
import { useTheme, BackgroundPattern, Density, Motion, Accessibility, getPrimaryBg, getSecondaryBg, getDensitySpacing } from '../context/ThemeContext';
import { getPatternStyle } from './Dashboard';

const PRESET_COLORS = [
  { name: 'Blue', value: '#1565C0' },
  { name: 'Indigo', value: '#3F51B5' },
  { name: 'Deep Purple', value: '#512DA8' },
  { name: 'Teal', value: '#00695C' },
  { name: 'Green', value: '#2E7D32' },
  { name: 'Cyan', value: '#0277BD' },
  { name: 'Purple', value: '#7B1FA2' },
  { name: 'Pink', value: '#C2185B' },
  { name: 'Red', value: '#C62828' },
  { name: 'Brown', value: '#4E342E' },
  { name: 'Blue Grey', value: '#37474F' },
  { name: 'Dark', value: '#212121' },
];

const SECONDARY_PRESETS = [
  { name: 'Orange', value: '#E65100' },
  { name: 'Amber', value: '#F57F17' },
  { name: 'Yellow', value: '#F9A825' },
  { name: 'Deep Orange', value: '#BF360C' },
  { name: 'Lime', value: '#827717' },
  { name: 'Light Blue', value: '#01579B' },
  { name: 'Cyan', value: '#006064' },
  { name: 'Teal', value: '#004D40' },
  { name: 'Green', value: '#1B5E20' },
  { name: 'Red', value: '#B71C1C' },
];

// Gradient swatches for Primary Color — clicking sets primaryColor to the darker shade
const PRIMARY_GRADIENT_COLORS = [
  { name: 'Blue Depth',    from: '#0D47A1', to: '#42A5F5', value: '#0D47A1' },
  { name: 'Ocean Blue',    from: '#1565C0', to: '#64B5F6', value: '#1565C0' },
  { name: 'Sky Dive',      from: '#0277BD', to: '#80D8FF', value: '#0277BD' },
  { name: 'Cobalt Night',  from: '#0D2137', to: '#1565C0', value: '#0D2137' },
  { name: 'Indigo Depth',  from: '#1A237E', to: '#7986CB', value: '#1A237E' },
  { name: 'Deep Purple',   from: '#311B92', to: '#9575CD', value: '#311B92' },
  { name: 'Violet Mist',   from: '#4A148C', to: '#CE93D8', value: '#4A148C' },
  { name: 'Plum Haze',     from: '#6A1B9A', to: '#BA68C8', value: '#6A1B9A' },
  { name: 'Teal Abyss',    from: '#004D40', to: '#4DB6AC', value: '#004D40' },
  { name: 'Emerald Dark',  from: '#00352B', to: '#26A69A', value: '#00352B' },
  { name: 'Forest Deep',   from: '#1B5E20', to: '#66BB6A', value: '#1B5E20' },
  { name: 'Jade Dark',     from: '#33691E', to: '#9CCC65', value: '#33691E' },
  { name: 'Ruby Noir',     from: '#880E4F', to: '#F06292', value: '#880E4F' },
  { name: 'Midnight',      from: '#0A0A0A', to: '#546E7A', value: '#0A0A0A' },
  { name: 'Graphite',      from: '#212121', to: '#78909C', value: '#212121' },
  { name: 'Steel',         from: '#263238', to: '#90A4AE', value: '#263238' },
];

// Gradient swatches for Secondary Color — clicking sets secondaryColor to the darker shade
const SECONDARY_GRADIENT_COLORS = [
  { name: 'Sunset',        from: '#BF360C', to: '#FF7043', value: '#BF360C' },
  { name: 'Amber Blaze',   from: '#E65100', to: '#FFB300', value: '#E65100' },
  { name: 'Golden Hour',   from: '#FF8F00', to: '#FFE082', value: '#FF8F00' },
  { name: 'Saffron',       from: '#F57F17', to: '#FFF176', value: '#F57F17' },
  { name: 'Crimson',       from: '#B71C1C', to: '#EF5350', value: '#B71C1C' },
  { name: 'Volcano',       from: '#7F0000', to: '#FF5252', value: '#7F0000' },
  { name: 'Rose Flame',    from: '#C62828', to: '#FF8A80', value: '#C62828' },
  { name: 'Coral Pink',    from: '#AD1457', to: '#FF80AB', value: '#AD1457' },
  { name: 'Magenta Flare', from: '#6A1B9A', to: '#EA80FC', value: '#6A1B9A' },
  { name: 'Burnt Gold',    from: '#795548', to: '#FFCA28', value: '#795548' },
  { name: 'Copper Glow',   from: '#4E342E', to: '#FF8F00', value: '#4E342E' },
  { name: 'Lime Volt',     from: '#33691E', to: '#B2FF59', value: '#33691E' },
  { name: 'Teal Spark',    from: '#006064', to: '#80DEEA', value: '#006064' },
  { name: 'Cyan Flash',    from: '#01579B', to: '#00E5FF', value: '#01579B' },
  { name: 'Deep Moss',     from: '#1B5E20', to: '#CCFF90', value: '#1B5E20' },
  { name: 'Bronze',        from: '#3E2723', to: '#FFAB40', value: '#3E2723' },
];

// Gradient theme pairs — each sets both primary + secondary at once
const GRADIENT_PRESETS = [
  { name: 'Ocean Blue',      primary: '#1565C0', secondary: '#42A5F5' },
  { name: 'Sky Horizon',     primary: '#0277BD', secondary: '#80D8FF' },
  { name: 'Midnight Navy',   primary: '#0D1B2A', secondary: '#1565C0' },
  { name: 'Forest Green',    primary: '#1B5E20', secondary: '#43A047' },
  { name: 'Emerald Glow',    primary: '#004D40', secondary: '#26A69A' },
  { name: 'Sage & Moss',     primary: '#33691E', secondary: '#8BC34A' },
  { name: 'Dark Brown',      primary: '#3E2723', secondary: '#795548' },
  { name: 'Warm Mocha',      primary: '#4E342E', secondary: '#A1887F' },
  { name: 'Sunset Orange',   primary: '#BF360C', secondary: '#FF7043' },
  { name: 'Amber Fire',      primary: '#E65100', secondary: '#FFB300' },
  { name: 'Royal Purple',    primary: '#4A148C', secondary: '#9C27B0' },
  { name: 'Violet Dream',    primary: '#1A237E', secondary: '#7C4DFF' },
  { name: 'Crimson Rose',    primary: '#B71C1C', secondary: '#EF5350' },
  { name: 'Deep Magenta',    primary: '#880E4F', secondary: '#EC407A' },
  { name: 'Graphite Slate',  primary: '#212121', secondary: '#546E7A' },
  { name: 'Steel & Ice',     primary: '#37474F', secondary: '#80CBC4' },
  { name: 'Deep Teal',       primary: '#006064', secondary: '#00ACC1' },
  { name: 'Nordic Fjord',    primary: '#0D47A1', secondary: '#00BCD4' },
  { name: 'Purple Haze',     primary: '#512DA8', secondary: '#CE93D8' },
  { name: 'Coral Reef',      primary: '#AD1457', secondary: '#FF8A65' },
];

const FONT_FAMILIES = [
  'Roboto', 'Inter', 'Open Sans', 'Lato', 'Poppins',
  'Nunito', 'Source Sans 3', 'IBM Plex Sans', 'DM Sans',
  'Plus Jakarta Sans', 'Outfit', 'Figtree', 'Manrope',
  'Space Grotesk', 'JetBrains Mono',
];

const PATTERNS: { id: BackgroundPattern; label: string }[] = [
  { id: 'none', label: 'Clean' },
  { id: 'grid', label: 'Grid' },
  { id: 'dots', label: 'Dots' },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'blueprint', label: 'Blueprint' },
  { id: 'wave', label: 'Waves' },
  { id: 'circuit', label: 'Circuit' },
  { id: 'hexagonal', label: 'Hexagons' },
  { id: 'noise', label: 'Noise' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'mesh', label: 'Mesh' },
];

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  const { settings } = useTheme();
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${settings.primaryColor}18` }}>
        <Icon size={16} style={{ color: settings.primaryColor }} />
      </div>
      <div>
        <h3 className="font-semibold text-sm" style={{ color: settings.darkMode ? '#e0e0e0' : '#1a1a2e', fontFamily: settings.fontFamily }}>{title}</h3>
        <p className="text-xs opacity-60" style={{ color: settings.darkMode ? '#78909c' : '#546e7a', fontFamily: settings.fontFamily }}>{subtitle}</p>
      </div>
    </div>
  );
}

function SettingsSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { settings } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="p-5 mb-4"
      style={{
        borderRadius: `${settings.cardBorderRadius}px`,
        background: settings.darkMode ? '#1e1e1e' : '#fff',
        border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: settings.darkMode ? 'none' : '0 2px 12px rgba(0,0,0,0.05)',
        fontFamily: settings.fontFamily,
      }}
    >
      {children}
    </motion.div>
  );
}

function PreviewCard({ activeSection }: { activeSection: string }) {
  const { settings } = useTheme();
  const patternStyle = getPatternStyle(settings.backgroundPattern, settings.darkMode);
  const cr = `${settings.cardBorderRadius}px`;
  const crSm = `${Math.max(6, Math.round(settings.cardBorderRadius * 0.55))}px`;
  const surfacePage = settings.darkMode ? '#181818' : '#f0f4fc';
  const surfaceCard = settings.darkMode ? '#242424' : '#ffffff';
  const surfaceSub = settings.darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const border = settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const textMain = settings.darkMode ? '#e8e8e8' : '#1a1a2e';
  const textSub = settings.darkMode ? '#78909c' : '#607d8b';
  const shadowLvl = ['none', '0 1px 4px rgba(0,0,0,0.06)', '0 2px 8px rgba(0,0,0,0.1)', '0 4px 16px rgba(0,0,0,0.14)', '0 8px 24px rgba(0,0,0,0.18)'];
  const shadow = shadowLvl[Math.min(settings.cardShadow, 4)];
  const ff = settings.fontFamily;

  // Scale cardSpacing down proportionally for the preview panel
  const previewPad = `${Math.max(8, Math.round(settings.cardSpacing * 0.7))}px`;
  const previewGap = `${Math.max(6, Math.round(settings.cardSpacing * 0.55))}px`;

  const SectionLabel = ({ children }: { children: string }) => (
    <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: textSub, fontFamily: ff, marginBottom: '8px' }}>{children}</p>
  );

  const Block = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{ background: surfaceCard, border: `1px solid ${border}`, borderRadius: cr, padding: previewPad, boxShadow: shadow, ...style }}>
      {children}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto" style={{ ...patternStyle, background: surfacePage, borderRadius: cr }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: previewGap, padding: previewGap }}>
        {/* ── BUTTONS ── */}
        <Block>
          <SectionLabel>Buttons</SectionLabel>
          <div className="flex flex-wrap gap-2">
            <button style={{ background: getPrimaryBg(settings), color: '#fff', border: 'none', borderRadius: crSm, padding: '6px 14px', fontSize: '11px', fontWeight: 600, fontFamily: ff, cursor: 'default', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Zap size={10} /> Primary
            </button>
            <button style={{ background: getSecondaryBg(settings), color: '#fff', border: 'none', borderRadius: crSm, padding: '6px 14px', fontSize: '11px', fontWeight: 600, fontFamily: ff, cursor: 'default' }}>
              Secondary
            </button>
            <button style={{ background: 'transparent', color: settings.primaryColor, border: `1.5px solid ${settings.primaryColor}`, borderRadius: crSm, padding: '5px 13px', fontSize: '11px', fontWeight: 600, fontFamily: ff, cursor: 'default' }}>
              Outline
            </button>
            <button style={{ background: `${settings.primaryColor}14`, color: settings.primaryColor, border: 'none', borderRadius: crSm, padding: '6px 14px', fontSize: '11px', fontWeight: 600, fontFamily: ff, cursor: 'default' }}>
              Ghost
            </button>
            <button style={{ background: '#C62828', color: '#fff', border: 'none', borderRadius: crSm, padding: '6px 14px', fontSize: '11px', fontWeight: 600, fontFamily: ff, cursor: 'default' }}>
              Danger
            </button>
            <button style={{ background: surfaceSub, color: textMain, border: `1px solid ${border}`, borderRadius: crSm, padding: '6px 8px', cursor: 'default', display: 'flex', alignItems: 'center' }}>
              <Save size={11} style={{ color: textSub }} />
            </button>
            <button style={{ background: surfaceSub, color: textSub, border: `1px solid ${border}`, borderRadius: crSm, padding: '6px 14px', fontSize: '11px', fontFamily: ff, cursor: 'not-allowed', opacity: 0.5 }}>
              Disabled
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button style={{ background: getPrimaryBg(settings), color: '#fff', border: 'none', borderRadius: '999px', padding: '5px 14px', fontSize: '11px', fontWeight: 600, fontFamily: ff, cursor: 'default' }}>
              Pill Primary
            </button>
            <button style={{ background: 'transparent', color: settings.secondaryColor, border: `1.5px solid ${settings.secondaryColor}`, borderRadius: '999px', padding: '4px 13px', fontSize: '11px', fontWeight: 600, fontFamily: ff, cursor: 'default' }}>
              Pill Outline
            </button>
            <button style={{ background: getSecondaryBg(settings), color: '#fff', border: 'none', borderRadius: '999px', padding: '5px 14px', fontSize: '11px', fontWeight: 600, fontFamily: ff, cursor: 'default', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CheckCircle size={10} /> Confirm
            </button>
          </div>
        </Block>

        {/* ── BADGES ── */}
        <Block>
          <SectionLabel>Badges &amp; Status</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Primary', bg: `${settings.primaryColor}18`, color: settings.primaryColor },
              { label: 'Secondary', bg: `${settings.secondaryColor}18`, color: settings.secondaryColor },
              { label: 'Success', bg: '#E8F5E9', color: '#2E7D32' },
              { label: 'Warning', bg: '#FFF8E1', color: '#E65100' },
              { label: 'Error', bg: '#FFEBEE', color: '#C62828' },
              { label: 'Neutral', bg: surfaceSub, color: textSub },
            ].map(b => (
              <span key={b.label} style={{ background: b.bg, color: b.color, borderRadius: '999px', padding: '3px 9px', fontSize: '10px', fontWeight: 600, fontFamily: ff }}>{b.label}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { label: 'Online', color: '#43A047' },
              { label: 'Idle', color: '#FF9800' },
              { label: 'Offline', color: '#F44336' },
              { label: 'Syncing', color: settings.primaryColor },
            ].map(d => (
              <span key={d.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: surfaceSub, border: `1px solid ${border}`, borderRadius: '999px', padding: '3px 9px', fontSize: '10px', fontFamily: ff, color: textMain }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.color, display: 'inline-block', flexShrink: 0 }} />
                {d.label}
              </span>
            ))}
          </div>
        </Block>

        {/* ── INPUTS & CONTROLS ── */}
        <Block>
          <SectionLabel>Inputs &amp; Controls</SectionLabel>
          <div className="flex flex-col gap-2.5">
            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: textSub, fontFamily: ff, display: 'block', marginBottom: '4px' }}>Feeder Name</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: surfaceSub, border: `1.5px solid ${settings.primaryColor}`, borderRadius: crSm, padding: '6px 10px' }}>
                <Search size={11} style={{ color: settings.primaryColor, flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: textSub, fontFamily: ff }}>Feeder F-12 North</span>
                <span style={{ marginLeft: 'auto', width: '1px', height: '14px', background: settings.primaryColor, display: 'inline-block' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: textSub, fontFamily: ff, display: 'block', marginBottom: '4px' }}>Zone (read-only)</label>
              <div style={{ display: 'flex', alignItems: 'center', background: surfaceSub, border: `1.5px solid ${border}`, borderRadius: crSm, padding: '6px 10px', opacity: 0.55 }}>
                <span style={{ fontSize: '11px', color: textSub, fontFamily: ff }}>Zone A — Northern Grid</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {[{ label: 'Auto-sync', on: true }, { label: 'Dark Mode', on: settings.darkMode }, { label: 'Alerts', on: false }].map(t => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '28px', height: '16px', borderRadius: '999px', background: t.on ? getPrimaryBg(settings) : (settings.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'), position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: t.on ? '14px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: textMain, fontFamily: ff }}>{t.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {[{ label: 'Export PDF', checked: true }, { label: 'Export CSV', checked: true }, { label: 'Send Email', checked: false }].map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: c.checked ? getPrimaryBg(settings) : 'transparent', border: `1.5px solid ${c.checked ? settings.primaryColor : border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {c.checked && <CheckCircle size={8} style={{ color: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: '10px', color: textMain, fontFamily: ff }}>{c.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {['Daily', 'Weekly', 'Monthly'].map((r, i) => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `1.5px solid ${i === 1 ? settings.primaryColor : border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i === 1 && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: getPrimaryBg(settings) }} />}
                  </div>
                  <span style={{ fontSize: '10px', color: textMain, fontFamily: ff }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </Block>

        {/* ── PROGRESS & SLIDERS ── */}
        <Block>
          <SectionLabel>Progress &amp; Sliders</SectionLabel>
          <div className="flex flex-col gap-2.5">
            {[
              { label: 'Grid Utilisation', val: 78, color: settings.primaryColor },
              { label: 'Revenue Target', val: 62, color: settings.secondaryColor },
              { label: 'Fault Resolution', val: 91, color: '#43A047' },
              { label: 'Energy Loss', val: 24, color: '#F44336' },
            ].map(p => (
              <div key={p.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', color: textMain, fontFamily: ff }}>{p.label}</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: p.color, fontFamily: ff }}>{p.val}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '999px', background: settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.val}%`, background: p.color, borderRadius: '999px' }} />
                </div>
              </div>
            ))}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', color: textMain, fontFamily: ff }}>Load Threshold</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: settings.primaryColor, fontFamily: ff }}>4500 MW</span>
              </div>
              <div style={{ position: 'relative', height: '6px', borderRadius: '999px', background: settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }}>
                <div style={{ height: '100%', width: '65%', background: getPrimaryBg(settings), borderRadius: '999px' }} />
                <div style={{ position: 'absolute', top: '50%', left: '65%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', borderRadius: '50%', background: '#fff', border: `2px solid ${settings.primaryColor}`, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
          </div>
        </Block>

        {/* ── NOTIFICATIONS ── */}
        <Block>
          <SectionLabel>Notifications</SectionLabel>
          <div className="flex flex-col gap-2">
            {[
              { icon: '⚡', color: settings.primaryColor, bg: `${settings.primaryColor}12`, title: 'Forecast Updated', desc: 'Zone 3 load forecast revised to 4850 MW' },
              { icon: '⚠️', color: '#E65100', bg: settings.darkMode ? 'rgba(230,81,0,0.10)' : '#FFF3E0', title: 'Feeder Overload', desc: 'Feeder F-12 reached 98% capacity' },
              { icon: '✅', color: '#2E7D32', bg: settings.darkMode ? 'rgba(46,125,50,0.10)' : '#E8F5E9', title: 'Sync Complete', desc: 'All substations reported successfully' },
            ].map((n, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: n.bg, border: `1px solid ${n.color}28`, borderRadius: crSm, padding: '8px 12px' }}>
                <span style={{ fontSize: '13px', lineHeight: 1, marginTop: '1px' }}>{n.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: n.color, fontFamily: ff }}>{n.title}</div>
                  <div style={{ fontSize: '10px', color: textSub, fontFamily: ff, marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.desc}</div>
                </div>
                <span style={{ fontSize: '9px', color: textSub, fontFamily: ff, flexShrink: 0, marginTop: '2px' }}>2m ago</span>
              </div>
            ))}
          </div>
        </Block>

        {/* ── TABS & CHIPS ── */}
        <Block>
          <SectionLabel>Tabs &amp; Chips</SectionLabel>
          <div style={{ display: 'flex', gap: '0', marginBottom: '12px', borderBottom: `1px solid ${border}` }}>
            {['Overview', 'Feeders', 'Reports', 'Logs'].map((t, i) => (
              <div key={t} style={{ padding: '5px 12px', fontSize: '11px', fontFamily: ff, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? settings.primaryColor : textSub, borderBottom: i === 0 ? `2px solid ${settings.primaryColor}` : '2px solid transparent', marginBottom: '-1px', cursor: 'default' }}>{t}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginBottom: '8px' }}>
            {['All', '12H', '24H', '7D', '30D'].map((c, i) => (
              <span key={c} style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '10px', fontFamily: ff, fontWeight: i === 2 ? 700 : 400, background: i === 2 ? getPrimaryBg(settings) : surfaceSub, color: i === 2 ? '#fff' : textSub, border: `1px solid ${i === 2 ? 'transparent' : border}`, cursor: 'default' }}>{c}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
            {['Zone A', 'Zone B', 'Residential', 'Commercial', '+ Add'].map((ch, i) => (
              <span key={ch} style={{ padding: '3px 9px', borderRadius: crSm, fontSize: '10px', fontFamily: ff, background: i < 2 ? `${settings.primaryColor}14` : surfaceSub, color: i < 2 ? settings.primaryColor : textSub, border: `1px solid ${i < 2 ? settings.primaryColor + '30' : border}`, cursor: 'default' }}>{ch}</span>
            ))}
          </div>
        </Block>

        {/* ── UI DENSITY (shown only when density section is active) ── */}
        {activeSection === 'density' && (() => {
          const ds = getDensitySpacing(settings.density);
          const itemBg = settings.darkMode ? 'rgba(255,255,255,0.05)' : `${settings.primaryColor}08`;
          const densityRows = [
            { color: '#2E7D32' },
            { color: settings.primaryColor },
            { color: '#6A1B9A' },
            { color: '#E65100' },
            { color: settings.secondaryColor },
          ];
          const cards = [
            { label: 'Grid Health', value: '97.4 %', color: '#2E7D32', bg: '#E8F5E9' },
            { label: 'Frequency',   value: '49.98 Hz', color: settings.primaryColor, bg: `${settings.primaryColor}14` },
            { label: 'Power Factor',value: '0.92 pf',  color: '#6A1B9A', bg: '#F3E5F5' },
            { label: 'Energy Loss', value: '4.2 %',    color: '#E65100', bg: '#FFF3E0' },
          ];
          return (
            <>
              {/* Token badge row */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginBottom: '2px' }}>
                {[
                  { label: 'Outer pad', val: `${ds.pad}px` },
                  { label: 'Row gap',   val: `${ds.gap}px` },
                  { label: 'Item pad',  val: `${ds.itemPad}px` },
                  { label: 'Icon box',  val: `${ds.iconBox}px` },
                ].map(t => (
                  <span key={t.label} style={{ fontSize: '9px', fontWeight: 700, fontFamily: ff, padding: '3px 8px', borderRadius: '999px', background: `${settings.primaryColor}14`, color: settings.primaryColor }}>
                    {t.label}: {t.val}
                  </span>
                ))}
              </div>

              {/* Micro-widget row mockup */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: ds.gap }}>
                {cards.map(c => (
                  <div
                    key={c.label}
                    style={{
                      background: surfaceCard,
                      border: `1px solid ${border}`,
                      borderRadius: cr,
                      padding: ds.pad,
                      boxShadow: shadow,
                      display: 'flex',
                      flexDirection: 'column' as const,
                      gap: Math.round(ds.gap * 0.5),
                      transition: 'padding 0.25s ease, gap 0.25s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ width: ds.iconBox * 0.8, height: ds.iconBox * 0.8, borderRadius: Math.round(ds.iconBox * 0.25), background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 0.25s, height 0.25s' }}>
                        <div style={{ width: ds.iconSize * 0.55, height: ds.iconSize * 0.55, borderRadius: 2, background: c.color }} />
                      </div>
                      <div style={{ height: 5, width: 24, borderRadius: 3, background: c.color, opacity: 0.5 }} />
                    </div>
                    <div style={{ height: 8, width: 48, borderRadius: 3, background: c.color, opacity: 0.8 }} />
                    <div style={{ height: 5, width: 38, borderRadius: 3, background: settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                    <div style={{ height: 3, borderRadius: 999, background: settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '72%', background: c.color, borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* List card mockup */}
              <Block>
                <SectionLabel>List Card — {settings.density.charAt(0).toUpperCase() + settings.density.slice(1)}</SectionLabel>
                {/* card header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: ds.headerGap, transition: 'margin 0.25s ease' }}>
                  <div style={{ width: ds.iconBox, height: ds.iconBox, borderRadius: Math.round(ds.iconBox * 0.3), background: `${settings.primaryColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'width 0.25s, height 0.25s' }}>
                    <div style={{ width: ds.iconSize * 0.55, height: ds.iconSize * 0.55, borderRadius: 2, background: settings.primaryColor }} />
                  </div>
                  <div>
                    <div style={{ height: 7, width: 80, borderRadius: 4, background: settings.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)', marginBottom: 4 }} />
                    <div style={{ height: 5, width: 52, borderRadius: 4, background: settings.darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }} />
                  </div>
                </div>
                {/* list rows */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: ds.gap, transition: 'gap 0.25s ease' }}>
                  {densityRows.map((row, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: `${Math.round(ds.itemPad * 0.55)}px ${Math.round(ds.itemPad * 0.8)}px`,
                        borderRadius: Math.round(ds.iconBox * 0.3),
                        background: idx % 2 === 0 ? itemBg : 'transparent',
                        transition: 'padding 0.25s ease, background 0.2s ease',
                      }}
                    >
                      <div style={{ height: 6, width: 70, borderRadius: 3, background: settings.darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)' }} />
                      <div style={{ height: 6, width: 36, borderRadius: 3, background: row.color, opacity: 0.65 }} />
                    </div>
                  ))}
                </div>
              </Block>
            </>
          );
        })()}

        {/* ── AVATARS & ICON BUTTONS ── */}
        <Block>
          <SectionLabel>Avatars &amp; Icon Buttons</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' as const }}>
            {[
              { initials: 'AK', bg: getPrimaryBg(settings), color: '#fff' },
              { initials: 'MR', bg: getSecondaryBg(settings), color: '#fff' },
              { initials: 'PS', bg: surfaceSub, color: textMain },
            ].map((av, i) => (
              <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: av.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: av.color, fontSize: '11px', fontWeight: 700, fontFamily: ff, flexShrink: 0 }}>{av.initials}</div>
            ))}
            <div style={{ width: '1px', height: '28px', background: border, margin: '0 4px' }} />
            {([Bell, Settings2, Eye, RotateCcw] as React.ElementType[]).map((Icon, i) => (
              <div key={i} style={{ width: '30px', height: '30px', borderRadius: crSm, background: surfaceSub, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}>
                <Icon size={13} style={{ color: i === 0 ? settings.primaryColor : textSub }} />
              </div>
            ))}
          </div>
        </Block>

      </div>
    </div>
  );
}

export function Settings() {
  const { settings, updateSettings, resetSettings } = useTheme();
  const [activeSection, setActiveSection] = useState('theme');
  const [saved, setSaved] = useState(false);
  const textMain = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const textMuted = settings.darkMode ? '#78909c' : '#546e7a';
  const pageBg = settings.darkMode ? '#111111' : '#f0f4fc';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: 'theme', icon: Palette, label: 'Theme Colors' },
    { id: 'typography', icon: Type, label: 'Typography' },
    { id: 'patterns', icon: Grid, label: 'Background' },
    { id: 'cards', icon: Layout, label: 'Card Style' },
    { id: 'density', icon: Sliders, label: 'UI Density' },
    { id: 'motion', icon: Play, label: 'Motion' },
  ];

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: pageBg, fontFamily: settings.fontFamily }}>
      {/* Left Panel */}
      <div className="flex-1 overflow-y-auto p-4" style={{ maxWidth: '600px' }}>
        <div className="flex gap-2 mb-5 flex-wrap">
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: activeSection === sec.id ? getPrimaryBg(settings) : (settings.darkMode ? 'rgba(255,255,255,0.06)' : '#fff'),
                color: activeSection === sec.id ? '#fff' : textMuted,
                border: `1px solid ${activeSection === sec.id ? 'transparent' : (settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')}`,
              }}
            >
              <sec.icon size={12} />
              {sec.label}
            </button>
          ))}
        </div>

        {/* Theme Colors */}
        {activeSection === 'theme' && (
          <>
            <SettingsSection delay={0.05}>
              <SectionHeader icon={Palette} title="Primary Color" subtitle="Main brand color for buttons, active states, and highlights" />
              <div className="flex flex-wrap gap-2 mb-4">
                {PRESET_COLORS.map(c => (
                  <motion.button
                    key={c.value}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateSettings({ primaryColor: c.value })}
                    title={c.name}
                    className="w-8 h-8 rounded-full transition-all flex items-center justify-center"
                    style={{
                      background: c.value,
                      boxShadow: settings.primaryColor === c.value ? `0 0 0 2px #fff, 0 0 0 4px ${c.value}` : 'none',
                    }}
                  >
                    {settings.primaryColor === c.value && <CheckCircle size={14} className="text-white" />}
                  </motion.button>
                ))}
              </div>
              {/* Gradient tones — primary */}
              <div className="flex items-center gap-2 mb-2 mt-1">
                <div className="flex-1 h-px" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }} />
                <span className="text-xs px-2 shrink-0" style={{ color: textMuted }}>Gradient Tones</span>
                <div className="flex-1 h-px" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }} />
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {PRIMARY_GRADIENT_COLORS.map(g => (
                  <motion.button
                    key={g.value}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateSettings({ primaryColor: g.value, primaryGradientFrom: g.from, primaryGradientTo: g.to })}
                    title={g.name}
                    className="rounded-xl overflow-hidden transition-all"
                    style={{
                      border: `2px solid ${settings.primaryColor === g.value ? g.value : (settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                      boxShadow: settings.primaryColor === g.value ? `0 0 0 2px ${g.value}50` : 'none',
                    }}
                  >
                    <div className="h-7 w-full relative" style={{ background: `linear-gradient(90deg, ${g.from}, ${g.to})` }}>
                      {settings.primaryColor === g.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle size={12} style={{ color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                        </div>
                      )}
                    </div>
                    <div className="py-0.5 px-1 text-center" style={{ background: settings.darkMode ? '#252525' : '#f5f5f5' }}>
                      <span style={{ fontSize: '9px', color: settings.primaryColor === g.value ? g.value : textMuted, fontFamily: settings.fontFamily, whiteSpace: 'nowrap', overflow: 'hidden', display: 'block', textOverflow: 'ellipsis' }}>{g.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="text-xs font-medium" style={{ color: textMuted }}>Custom Color:</label>
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={e => updateSettings({ primaryColor: e.target.value })}
                  className="w-10 h-8 rounded-lg cursor-pointer"
                  style={{ padding: '2px' }}
                />
                <span className="text-xs font-mono px-2 py-1 rounded-lg" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: textMuted }}>{settings.primaryColor}</span>
                <div className="w-6 h-6 rounded-full" style={{ background: settings.primaryColor }} />
              </div>
            </SettingsSection>

            <SettingsSection delay={0.1}>
              <SectionHeader icon={Palette} title="Secondary Color" subtitle="Accent color for charts, badges, and secondary actions" />
              <div className="flex flex-wrap gap-2 mb-4">
                {SECONDARY_PRESETS.map(c => (
                  <motion.button
                    key={c.value}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateSettings({ secondaryColor: c.value })}
                    title={c.name}
                    className="w-8 h-8 rounded-full transition-all flex items-center justify-center"
                    style={{
                      background: c.value,
                      boxShadow: settings.secondaryColor === c.value ? `0 0 0 2px #fff, 0 0 0 4px ${c.value}` : 'none',
                    }}
                  >
                    {settings.secondaryColor === c.value && <CheckCircle size={14} className="text-white" />}
                  </motion.button>
                ))}
              </div>
              {/* Gradient tones — secondary */}
              <div className="flex items-center gap-2 mb-2 mt-1">
                <div className="flex-1 h-px" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }} />
                <span className="text-xs px-2 shrink-0" style={{ color: textMuted }}>Gradient Tones</span>
                <div className="flex-1 h-px" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }} />
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {SECONDARY_GRADIENT_COLORS.map(g => (
                  <motion.button
                    key={g.value}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateSettings({ secondaryColor: g.value, secondaryGradientFrom: g.from, secondaryGradientTo: g.to })}
                    title={g.name}
                    className="rounded-xl overflow-hidden transition-all"
                    style={{
                      border: `2px solid ${settings.secondaryColor === g.value ? g.value : (settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                      boxShadow: settings.secondaryColor === g.value ? `0 0 0 2px ${g.value}50` : 'none',
                    }}
                  >
                    <div className="h-7 w-full relative" style={{ background: `linear-gradient(90deg, ${g.from}, ${g.to})` }}>
                      {settings.secondaryColor === g.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle size={12} style={{ color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                        </div>
                      )}
                    </div>
                    <div className="py-0.5 px-1 text-center" style={{ background: settings.darkMode ? '#252525' : '#f5f5f5' }}>
                      <span style={{ fontSize: '9px', color: settings.secondaryColor === g.value ? g.value : textMuted, fontFamily: settings.fontFamily, whiteSpace: 'nowrap', overflow: 'hidden', display: 'block', textOverflow: 'ellipsis' }}>{g.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium" style={{ color: textMuted }}>Custom:</label>
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={e => updateSettings({ secondaryColor: e.target.value })}
                  className="w-10 h-8 rounded-lg cursor-pointer"
                  style={{ padding: '2px' }}
                />
                <span className="text-xs font-mono px-2 py-1 rounded-lg" style={{ background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: textMuted }}>{settings.secondaryColor}</span>
              </div>
            </SettingsSection>

            <SettingsSection delay={0.15}>
              <SectionHeader icon={Zap} title="Dark Mode" subtitle="Toggle between light and dark themes" />
              <div className="flex items-center gap-4">
                {[
                  { value: false, label: 'Light Mode', icon: '☀️' },
                  { value: true, label: 'Dark Mode', icon: '🌙' },
                ].map(opt => (
                  <motion.button
                    key={opt.label}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => updateSettings({ darkMode: opt.value })}
                    className="flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 transition-all"
                    style={{
                      background: settings.darkMode === opt.value ? `${settings.primaryColor}18` : (settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                      border: `2px solid ${settings.darkMode === opt.value ? settings.primaryColor : 'transparent'}`,
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{opt.icon}</span>
                    <span className="text-xs font-medium" style={{ color: settings.darkMode === opt.value ? settings.primaryColor : textMuted }}>{opt.label}</span>
                  </motion.button>
                ))}
              </div>
            </SettingsSection>


          </>
        )}

        {/* Typography */}
        {activeSection === 'typography' && (
          <>
            <SettingsSection delay={0.05}>
              <SectionHeader icon={Type} title="Font Family" subtitle="Choose the typeface for the entire dashboard" />
              <div className="grid grid-cols-3 gap-2">
                {FONT_FAMILIES.map(font => (
                  <motion.button
                    key={font}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateSettings({ fontFamily: font })}
                    className="py-2.5 px-3 rounded-xl text-xs text-left transition-all"
                    style={{
                      fontFamily: font,
                      background: settings.fontFamily === font ? `${settings.primaryColor}18` : (settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                      border: `1.5px solid ${settings.fontFamily === font ? settings.primaryColor : 'transparent'}`,
                      color: settings.fontFamily === font ? settings.primaryColor : textMain,
                    }}
                  >
                    <div className="font-medium truncate">{font}</div>
                    <div className="opacity-50" style={{ fontSize: '10px' }}>AaBbCc 123</div>
                  </motion.button>
                ))}
              </div>
            </SettingsSection>

            <SettingsSection delay={0.1}>
              <SectionHeader icon={Type} title="Font Size" subtitle="Base font size for the dashboard" />
              <div className="flex items-center gap-4">
                <input
                  type="range" min={12} max={18} step={1}
                  value={settings.fontSize}
                  onChange={e => updateSettings({ fontSize: parseInt(e.target.value) })}
                  className="flex-1"
                  style={{ accentColor: settings.primaryColor }}
                />
                <span className="text-sm font-bold w-12 text-right" style={{ color: textMain }}>{settings.fontSize}px</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[{ label: 'Small', value: 12 }, { label: 'Medium', value: 14 }, { label: 'Large', value: 16 }, { label: 'XL', value: 18 }].map(s => (
                  <button key={s.label} onClick={() => updateSettings({ fontSize: s.value })}
                    className="py-2 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: settings.fontSize === s.value ? settings.primaryColor : (settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                      color: settings.fontSize === s.value ? '#fff' : textMuted,
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </SettingsSection>

            <SettingsSection delay={0.15}>
              <SectionHeader icon={Type} title="Line Spacing" subtitle="Text line height for readability" />
              <div className="flex items-center gap-4">
                <input
                  type="range" min={1.2} max={2.0} step={0.1}
                  value={settings.lineSpacing}
                  onChange={e => updateSettings({ lineSpacing: parseFloat(e.target.value) })}
                  className="flex-1"
                  style={{ accentColor: settings.primaryColor }}
                />
                <span className="text-sm font-bold w-10 text-right" style={{ color: textMain }}>{settings.lineSpacing.toFixed(1)}x</span>
              </div>
            </SettingsSection>

            <SettingsSection delay={0.2}>
              <SectionHeader icon={Type} title="Accessibility Scale" subtitle="Adjust overall UI size for accessibility" />
              <div className="grid grid-cols-4 gap-2">
                {([
                  { id: 'small', label: 'Small', desc: 'Compact view' },
                  { id: 'medium', label: 'Medium', desc: 'Default' },
                  { id: 'large', label: 'Large', desc: 'Easier to read' },
                  { id: 'xl', label: 'Extra Large', desc: 'High accessibility' },
                ] as { id: Accessibility; label: string; desc: string }[]).map(s => (
                  <motion.button
                    key={s.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => updateSettings({ accessibility: s.id })}
                    className="py-3 rounded-2xl flex flex-col items-center gap-1 transition-all"
                    style={{
                      background: settings.accessibility === s.id ? `${settings.primaryColor}18` : (settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                      border: `2px solid ${settings.accessibility === s.id ? settings.primaryColor : 'transparent'}`,
                    }}
                  >
                    <span className="font-bold" style={{ color: settings.accessibility === s.id ? settings.primaryColor : textMain, fontSize: s.id === 'small' ? '12px' : s.id === 'large' ? '16px' : s.id === 'xl' ? '18px' : '14px' }}>Aa</span>
                    <span className="text-xs font-medium" style={{ color: settings.accessibility === s.id ? settings.primaryColor : textMuted }}>{s.label}</span>
                    <span style={{ fontSize: '9px', color: textMuted }}>{s.desc}</span>
                  </motion.button>
                ))}
              </div>
            </SettingsSection>
          </>
        )}

        {/* Background Patterns */}
        {activeSection === 'patterns' && (
          <SettingsSection delay={0.05}>
            <SectionHeader icon={Grid} title="Background Pattern" subtitle="Choose the background pattern for the dashboard" />
            <div className="grid grid-cols-3 gap-3">
              {PATTERNS.map(p => {
                const style = getPatternStyle(p.id, settings.darkMode);
                return (
                  <motion.button
                    key={p.id}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => updateSettings({ backgroundPattern: p.id })}
                    className="rounded-2xl overflow-hidden transition-all"
                    style={{
                      border: `2px solid ${settings.backgroundPattern === p.id ? settings.primaryColor : (settings.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`,
                      boxShadow: settings.backgroundPattern === p.id ? `0 0 0 2px ${settings.primaryColor}40` : 'none',
                    }}
                  >
                    <div className="h-16" style={style} />
                    <div className="py-1.5 px-2 text-center" style={{ background: settings.darkMode ? '#1e1e1e' : '#fff' }}>
                      <span className="text-xs font-medium" style={{ color: settings.backgroundPattern === p.id ? settings.primaryColor : textMuted, fontFamily: settings.fontFamily }}>{p.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </SettingsSection>
        )}

        {/* Card Style */}
        {activeSection === 'cards' && (
          <>
            <SettingsSection delay={0.05}>
              <SectionHeader icon={Layout} title="Border Radius" subtitle="Roundness of cards and components" />
              <div className="flex items-center gap-4 mb-3">
                <input
                  type="range" min={0} max={28} step={2}
                  value={settings.cardBorderRadius}
                  onChange={e => updateSettings({ cardBorderRadius: parseInt(e.target.value) })}
                  className="flex-1"
                  style={{ accentColor: settings.primaryColor }}
                />
                <span className="text-sm font-bold w-12 text-right" style={{ color: textMain }}>{settings.cardBorderRadius}px</span>
              </div>
              <div className="flex gap-3 mt-2">
                {[{ label: 'Square', value: 4 }, { label: 'Slight', value: 8 }, { label: 'Rounded', value: 16 }, { label: 'Pill', value: 24 }].map(s => (
                  <button key={s.label} onClick={() => updateSettings({ cardBorderRadius: s.value })}
                    className="flex-1 py-3 text-xs font-medium transition-all"
                    style={{
                      borderRadius: `${s.value}px`,
                      background: settings.cardBorderRadius === s.value ? settings.primaryColor : (settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                      color: settings.cardBorderRadius === s.value ? '#fff' : textMuted,
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </SettingsSection>

            <SettingsSection delay={0.1}>
              <SectionHeader icon={Layout} title="Shadow Elevation" subtitle="Card shadow depth and intensity" />
              <div className="flex items-center gap-4 mb-3">
                <input
                  type="range" min={0} max={5} step={1}
                  value={settings.cardShadow}
                  onChange={e => updateSettings({ cardShadow: parseInt(e.target.value) })}
                  className="flex-1"
                  style={{ accentColor: settings.primaryColor }}
                />
                <span className="text-sm font-bold w-12 text-right" style={{ color: textMain }}>Level {settings.cardShadow}</span>
              </div>
              <div className="flex gap-3">
                {[0, 1, 2, 3, 4, 5].map(l => (
                  <button key={l} onClick={() => updateSettings({ cardShadow: l })}
                    className="flex-1 h-10 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: settings.cardShadow === l ? settings.primaryColor : (settings.darkMode ? '#252525' : '#fff'),
                      color: settings.cardShadow === l ? '#fff' : textMuted,
                      boxShadow: `0 ${l * 2}px ${l * 8}px rgba(0,0,0,${0.04 + l * 0.04})`,
                      border: `1px solid ${settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    }}>
                    {l}
                  </button>
                ))}
              </div>
            </SettingsSection>

            <SettingsSection delay={0.15}>
              <SectionHeader icon={Layout} title="Card Spacing" subtitle="Internal padding and gap between cards" />
              <div className="flex items-center gap-4">
                <input
                  type="range" min={8} max={28} step={2}
                  value={settings.cardSpacing}
                  onChange={e => updateSettings({ cardSpacing: parseInt(e.target.value) })}
                  className="flex-1"
                  style={{ accentColor: settings.primaryColor }}
                />
                <span className="text-sm font-bold w-12 text-right" style={{ color: textMain }}>{settings.cardSpacing}px</span>
              </div>
            </SettingsSection>
          </>
        )}

        {/* UI Density */}
        {activeSection === 'density' && (
          <SettingsSection delay={0.05}>
            <SectionHeader icon={Sliders} title="UI Density" subtitle="Control the information density and spacing across all cards" />
            <div className="grid grid-cols-3 gap-3">
              {([
                { id: 'comfortable', label: 'Comfortable', desc: 'Spacious layout for clarity', icon: '◻  ◻  ◻' },
                { id: 'compact', label: 'Compact', desc: 'Balanced information density', icon: '▪ ▪ ▪ ▪' },
                { id: 'dense', label: 'Dense', desc: 'Maximum data on screen', icon: '■■■■■■' },
              ] as { id: Density; label: string; desc: string; icon: string }[]).map(d => (
                <motion.button
                  key={d.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => updateSettings({ density: d.id })}
                  className="py-5 rounded-2xl flex flex-col items-center gap-2 transition-all"
                  style={{
                    background: settings.density === d.id ? `${settings.primaryColor}14` : (settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                    border: `2px solid ${settings.density === d.id ? settings.primaryColor : 'transparent'}`,
                  }}
                >
                  <span className="font-mono text-sm" style={{ color: settings.density === d.id ? settings.primaryColor : textMuted }}>{d.icon}</span>
                  <span className="text-sm font-semibold" style={{ color: settings.density === d.id ? settings.primaryColor : textMain }}>{d.label}</span>
                  <span className="text-xs text-center px-2" style={{ color: textMuted, fontSize: '10px' }}>{d.desc}</span>
                </motion.button>
              ))}
            </div>

          </SettingsSection>
        )}

        {/* Motion */}
        {activeSection === 'motion' && (
          <SettingsSection delay={0.05}>
            <SectionHeader icon={Play} title="Motion & Animations" subtitle="Control UI animation preferences" />
            <div className="flex flex-col gap-3">
              {([
                { id: 'full', label: 'Full Animations', desc: 'All micro-interactions and transitions enabled', icon: '✨' },
                { id: 'reduced', label: 'Reduced Motion', desc: 'Subtle transitions only, no elaborate animations', icon: '◑' },
                { id: 'none', label: 'No Animations', desc: 'Static UI, no motion (accessibility mode)', icon: '○' },
              ] as { id: Motion; label: string; desc: string; icon: string }[]).map(m => (
                <motion.button
                  key={m.id}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateSettings({ motion: m.id })}
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl transition-all text-left"
                  style={{
                    background: settings.motion === m.id ? `${settings.primaryColor}14` : (settings.darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                    border: `2px solid ${settings.motion === m.id ? settings.primaryColor : 'transparent'}`,
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{m.icon}</span>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: settings.motion === m.id ? settings.primaryColor : textMain }}>{m.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: textMuted }}>{m.desc}</div>
                  </div>
                  {settings.motion === m.id && <CheckCircle size={16} className="ml-auto" style={{ color: settings.primaryColor }} />}
                </motion.button>
              ))}
            </div>
          </SettingsSection>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-2 pb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetSettings}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all"
            style={{ background: settings.darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: textMuted }}
          >
            <RotateCcw size={14} /> Reset Defaults
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium text-white transition-all"
            style={{ background: saved ? '#2E7D32' : getPrimaryBg(settings) }}
          >
            {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Settings</>}
          </motion.button>
        </div>
      </div>

      {/* Right Panel: Live Preview — fills entire height */}
      <div className="flex-1 flex flex-col overflow-hidden border-l p-3" style={{ borderColor: settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', background: settings.darkMode ? '#111111' : '#e8effc' }}>
        {/* Compact header badge */}
        <div className="flex items-center gap-2 mb-2 shrink-0">
          <Eye size={13} style={{ color: settings.primaryColor }} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: textMain, fontFamily: settings.fontFamily }}>Live Preview</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ fontSize: '10px', background: `${settings.primaryColor}20`, color: settings.primaryColor, fontFamily: settings.fontFamily }}>● Live</span>
        </div>
        {/* Preview fills remaining space */}
        <div className="flex-1 min-h-0">
          <PreviewCard activeSection={activeSection} />
        </div>
      </div>
    </div>
  );
}