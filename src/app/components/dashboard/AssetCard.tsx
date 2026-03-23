import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, GitBranch, Radio, ArrowRight } from 'lucide-react';
import { useTheme, getPrimaryBg, getDensitySpacing } from '../../context/ThemeContext';

const assets = [
  { icon: Cpu, label: 'Transformers', count: 1248, unit: 'units', status: 'warn', faultLabel: '1 faulty', color: '#1565C0' },
  { icon: Zap, label: 'Substations', count: 86, unit: 'stations', status: 'good', faultLabel: '', color: '#0288D1' },
  { icon: GitBranch, label: 'Feeders', count: 342, unit: 'lines', status: 'warn', faultLabel: '2 faulty', color: '#E65100' },
  { icon: Radio, label: 'Smart Meters', count: 136000, unit: 'devices', status: 'warn', faultLabel: '24 offline', color: '#43A047' },
];

export function AssetCard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { settings } = useTheme();
  const ds = getDensitySpacing(settings.density);
  const cardBg = settings.darkMode ? '#1e1e1e' : '#fff';
  const textMain = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const textMuted = settings.darkMode ? '#78909c' : '#546e7a';
  const borderColor = settings.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.25 }}
      className="flex flex-col h-full"
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        boxShadow: settings.darkMode ? 'none' : `0 ${settings.cardShadow * 2}px ${settings.cardShadow * 10}px rgba(0,0,0,0.06)`,
        borderRadius: `${settings.cardBorderRadius}px`,
        fontFamily: settings.fontFamily,
        padding: ds.pad,
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: ds.headerGap }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${settings.primaryColor}18` }}>
            <Cpu size={18} style={{ color: settings.primaryColor }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-none" style={{ color: textMain }}>Grid Assets</h3>
            <p className="text-xs opacity-60 mt-0.5" style={{ color: textMuted }}>Asset Inventory</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#FFF3E0', color: '#E65100' }}>3 Active Faults</span>
      </div>

      <div className="grid grid-cols-2 flex-1" style={{ gap: ds.gap }}>
        {assets.map((asset, i) => (
          <motion.div
            key={asset.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="rounded-2xl p-3 cursor-pointer"
            style={{ background: `${asset.color}0e`, border: `1px solid ${asset.color}22` }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: `${asset.color}20` }}>
              <asset.icon size={16} style={{ color: asset.color }} />
            </div>
            <div className="font-bold text-lg leading-none" style={{ color: asset.color }}>
              {asset.count >= 1000 ? `${(asset.count / 1000).toFixed(asset.count >= 10000 ? 1 : 1)}K` : asset.count}
            </div>
            <div className="text-xs mt-1 opacity-70" style={{ color: textMuted, fontFamily: settings.fontFamily }}>{asset.label}</div>
            {asset.status === 'warn' && (
              <div className="mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span className="text-xs" style={{ color: '#E65100' }}>{asset.faultLabel}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full py-2.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-all"
        style={{ background: getPrimaryBg(settings), color: '#fff' }}
        onClick={() => onNavigate?.('assets')}
      >
        View All Assets <ArrowRight size={14} />
      </motion.button>
    </motion.div>
  );
}