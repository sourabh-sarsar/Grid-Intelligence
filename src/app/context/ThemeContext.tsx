import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Density = 'comfortable' | 'compact' | 'dense';
export type Motion = 'full' | 'reduced' | 'none';
export type Accessibility = 'small' | 'medium' | 'large' | 'xl';
export type BackgroundPattern =
  | 'none' | 'grid' | 'dots' | 'diagonal' | 'blueprint' | 'wave'
  | 'circuit' | 'hexagonal' | 'noise' | 'gradient' | 'mesh';

export interface ThemeSettings {
  primaryColor: string;
  primaryGradientFrom: string;
  primaryGradientTo: string;
  secondaryColor: string;
  secondaryGradientFrom: string;
  secondaryGradientTo: string;
  fontFamily: string;
  fontSize: number;
  lineSpacing: number;
  accessibility: Accessibility;
  backgroundPattern: BackgroundPattern;
  cardBorderRadius: number;
  cardShadow: number;
  cardSpacing: number;
  density: Density;
  motion: Motion;
  darkMode: boolean;
  visibleCards: string[];
}

const defaultSettings: ThemeSettings = {
  primaryColor: '#1565C0',
  primaryGradientFrom: '',
  primaryGradientTo: '',
  secondaryColor: '#E65100',
  secondaryGradientFrom: '',
  secondaryGradientTo: '',
  fontFamily: 'Roboto',
  fontSize: 16,
  lineSpacing: 1.5,
  accessibility: 'medium',
  backgroundPattern: 'grid',
  cardBorderRadius: 16,
  cardShadow: 2,
  cardSpacing: 16,
  density: 'comfortable',
  motion: 'full',
  darkMode: false,
  visibleCards: [
    'micro-health', 'micro-freq', 'micro-pf', 'micro-losses',
    'consumer', 'powerbalance', 'alerts',
    'revenue', 'forecast', 'assets',
    'studies',
  ],
};

/** Returns a CSS background value: gradient if one is stored, otherwise the solid color. */
export function getPrimaryBg(s: ThemeSettings, angle = '135deg'): string {
  if (s.primaryGradientFrom && s.primaryGradientTo) {
    return `linear-gradient(${angle}, ${s.primaryGradientFrom}, ${s.primaryGradientTo})`;
  }
  return s.primaryColor;
}

/** Returns a CSS background value: gradient if one is stored, otherwise the solid color. */
export function getSecondaryBg(s: ThemeSettings, angle = '135deg'): string {
  if (s.secondaryGradientFrom && s.secondaryGradientTo) {
    return `linear-gradient(${angle}, ${s.secondaryGradientFrom}, ${s.secondaryGradientTo})`;
  }
  return s.secondaryColor;
}

/** The "from" shade of the primary, used as a single solid color for text/icons/SVG strokes. */
export function primarySolid(s: ThemeSettings): string {
  return s.primaryGradientFrom || s.primaryColor;
}

/** The "from" shade of the secondary, used as a single solid color for text/icons/SVG strokes. */
export function secondarySolid(s: ThemeSettings): string {
  return s.secondaryGradientFrom || s.secondaryColor;
}

/** Returns spacing tokens driven by the current density setting. */
export function getDensitySpacing(density: Density) {
  return {
    pad:       density === 'dense' ? 8  : density === 'compact' ? 12 : 16,  // card outer padding (px)
    gap:       density === 'dense' ? 6  : density === 'compact' ? 8  : 12,  // gap between list items (px)
    itemPad:   density === 'dense' ? 8  : density === 'compact' ? 10 : 12,  // padding inside a row item (px)
    headerGap: density === 'dense' ? 8  : density === 'compact' ? 10 : 14,  // header → content margin (px)
    iconSize:  density === 'dense' ? 14 : density === 'compact' ? 16 : 18,  // header icon size (px)
    iconBox:   density === 'dense' ? 28 : density === 'compact' ? 32 : 36,  // header icon box (px)
  } as const;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (partial: Partial<ThemeSettings>) => void;
  resetSettings: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function lighten(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `rgb(${lr},${lg},${lb})`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);

  const applySettings = useCallback((s: ThemeSettings) => {
    const root = document.documentElement;

    // ── Colors ──────────────────────────────────────────────────────────────
    root.style.setProperty('--md-primary', s.primaryColor);
    root.style.setProperty('--md-primary-container', lighten(s.primaryColor, 0.85));
    root.style.setProperty('--md-secondary', s.secondaryColor);
    root.style.setProperty('--md-secondary-container', lighten(s.secondaryColor, 0.85));

    // ── Typography ───────────────────────────────────────────────────────────
    root.style.setProperty('--md-font-family', s.fontFamily);

    // Accessibility multiplier × base font size → updates --font-size used by
    // `html { font-size: var(--font-size) }` in theme.css so ALL rem values scale
    const a11yScale: Record<string, number> = { small: 0.875, medium: 1, large: 1.125, xl: 1.25 };
    const computedSize = Math.round(s.fontSize * (a11yScale[s.accessibility] ?? 1));
    root.style.setProperty('--font-size', `${computedSize}px`);
    root.style.setProperty('--md-font-size', `${computedSize}px`);

    // Line-height — consumed by body rule in index.css
    root.style.setProperty('--md-line-spacing', `${s.lineSpacing}`);

    // ── Card style ───────────────────────────────────────────────────────────
    root.style.setProperty('--md-card-radius', `${s.cardBorderRadius}px`);
    root.style.setProperty('--md-card-spacing', `${s.cardSpacing}px`);
    root.style.setProperty('--md-card-shadow', `${s.cardShadow}`);

    // ── Density ──────────────────────────────────────────────────────────────
    const densityPad = s.density === 'dense' ? '8px' : s.density === 'compact' ? '12px' : '16px';
    const densityGap = s.density === 'dense' ? '6px' : s.density === 'compact' ? '8px'  : '12px';
    root.style.setProperty('--md-density-pad', densityPad);
    root.style.setProperty('--md-density-gap', densityGap);
    root.setAttribute('data-density', s.density);

    // ── Motion ───────────────────────────────────────────────────────────────
    // CSS-level override (for non-Motion.js transitions like border, opacity…)
    root.setAttribute('data-motion', s.motion);

    // ── Dark mode ────────────────────────────────────────────────────────────
    if (s.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    applySettings(settings);
  }, [settings, applySettings]);

  const updateSettings = useCallback((partial: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </ThemeContext.Provider>
  );
}