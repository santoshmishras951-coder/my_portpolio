import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface AccentColorPreset {
  id: string;
  name: string;
  hex: string;
  hoverHex: string;
  subtleBg: string;
  borderColor: string;
  ringColor: string;
}

export const ACCENT_PRESETS: AccentColorPreset[] = [
  {
    id: 'blue',
    name: 'Project Blue',
    hex: '#2563eb',
    hoverHex: '#1d4ed8',
    subtleBg: 'rgba(37, 99, 235, 0.12)',
    borderColor: 'rgba(37, 99, 235, 0.4)',
    ringColor: 'rgba(37, 99, 235, 0.25)'
  },
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    hex: '#06b6d4',
    hoverHex: '#0891b2',
    subtleBg: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    ringColor: 'rgba(6, 182, 212, 0.25)'
  },
  {
    id: 'emerald',
    name: 'Matrix Emerald',
    hex: '#10b981',
    hoverHex: '#059669',
    subtleBg: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    ringColor: 'rgba(16, 185, 129, 0.25)'
  },
  {
    id: 'violet',
    name: 'Royal Violet',
    hex: '#8b5cf6',
    hoverHex: '#7c3aed',
    subtleBg: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    ringColor: 'rgba(139, 92, 246, 0.25)'
  },
  {
    id: 'amber',
    name: 'Industrial Amber',
    hex: '#f59e0b',
    hoverHex: '#d97706',
    subtleBg: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    ringColor: 'rgba(245, 158, 11, 0.25)'
  },
  {
    id: 'rose',
    name: 'Neon Rose',
    hex: '#f43f5e',
    hoverHex: '#e11d48',
    subtleBg: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.4)',
    ringColor: 'rgba(244, 63, 94, 0.25)'
  }
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  accentColor: string; // Preset ID or Hex string
  setAccentColor: (color: string) => void;
  currentAccent: AccentColorPreset;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('santosh_portfolio_theme') as ThemeMode;
    return saved || 'dark';
  });

  const [accentColor, setAccentColor] = useState<string>(() => {
    const saved = localStorage.getItem('santosh_portfolio_accent');
    return saved || 'blue';
  });

  const [isDark, setIsDark] = useState<boolean>(true);

  // Compute current accent object
  const currentAccent: AccentColorPreset = useMemo(() => {
    const preset = ACCENT_PRESETS.find(p => p.id === accentColor || p.hex.toLowerCase() === accentColor.toLowerCase());
    if (preset) return preset;
    // Custom hex color
    return {
      id: 'custom',
      name: 'Custom',
      hex: accentColor.startsWith('#') ? accentColor : `#${accentColor}`,
      hoverHex: accentColor,
      subtleBg: `${accentColor}20`,
      borderColor: `${accentColor}66`,
      ringColor: `${accentColor}40`
    };
  }, [accentColor]);

  // Sync theme mode to html element and local storage
  useEffect(() => {
    localStorage.setItem('santosh_portfolio_theme', theme);
    const root = document.documentElement;

    const applyTheme = () => {
      const isDarkTarget = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(prev => (prev === isDarkTarget ? prev : isDarkTarget));
      if (isDarkTarget) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Sync accent color to document CSS variables and local storage
  useEffect(() => {
    localStorage.setItem('santosh_portfolio_accent', accentColor);
    const root = document.documentElement;

    root.style.setProperty('--accent-color', currentAccent.hex);
    root.style.setProperty('--accent-hover', currentAccent.hoverHex);
    root.style.setProperty('--accent-subtle', currentAccent.subtleBg);
    root.style.setProperty('--accent-border', currentAccent.borderColor);
    root.style.setProperty('--accent-ring', currentAccent.ringColor);
  }, [accentColor, currentAccent]);

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    isDark,
    accentColor,
    setAccentColor,
    currentAccent
  }), [theme, setTheme, isDark, accentColor, setAccentColor, currentAccent]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
