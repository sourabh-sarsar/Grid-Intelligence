import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface GenericPageProps {
  title: string;
  subtitle: string;
  icon: string;
}

export function GenericPage({ title, subtitle, icon }: GenericPageProps) {
  const { settings } = useTheme();
  const textMain = settings.darkMode ? '#e0e0e0' : '#1a1a2e';
  const textMuted = settings.darkMode ? '#78909c' : '#546e7a';
  const pageBg = settings.darkMode ? '#111111' : '#f0f4fc';

  return (
    <div className="flex-1 flex items-center justify-center" style={{ background: pageBg }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="text-6xl mb-4">{icon}</div>
        <h1 className="font-bold mb-2" style={{ color: textMain, fontFamily: settings.fontFamily, fontSize: '24px' }}>{title}</h1>
        <p className="text-sm" style={{ color: textMuted, fontFamily: settings.fontFamily }}>{subtitle}</p>
        <div className="mt-6 flex items-center gap-2 justify-center">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: settings.primaryColor }} />
          <span className="text-xs" style={{ color: settings.primaryColor, fontFamily: settings.fontFamily }}>Module under development</span>
        </div>
      </motion.div>
    </div>
  );
}