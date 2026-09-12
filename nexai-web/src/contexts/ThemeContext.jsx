import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const THEMES = {
  clinical: {
    accent: '#0EA5E9',      // clinical blue / cool cyan
    accentRgb: '14, 165, 233',
    label: 'Clinical Mode',
    description: 'DiuMed core operating environment'
  },
  calm: {
    accent: '#14B8A6',      // subtle aqua
    accentRgb: '20, 184, 166',
    label: 'Calm Mode',
    description: 'Reduced stimulus environment'
  },
  provider: {
    accent: '#8B5CF6',      // restrained violet
    accentRgb: '139, 92, 246',
    label: 'Provider Mode',
    description: 'Administrative and clinical oversight'
  }
};

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    return localStorage.getItem('diumed_theme') || 'clinical';
  });

  useEffect(() => {
    const theme = THEMES[mode] || THEMES.clinical;
    const root = document.documentElement;

    root.setAttribute('data-theme', mode);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-rgb', theme.accentRgb);
    
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#ffffff'); // DiuMed stays clean white/glass

    localStorage.setItem('diumed_theme', mode);
  }, [mode]);

  const setMode = useCallback((newMode) => {
    if (THEMES[newMode]) {
      setModeState(newMode);
    }
  }, []);

  const cycleMode = useCallback(() => {
    const keys = Object.keys(THEMES);
    const nextIdx = (keys.indexOf(mode) + 1) % keys.length;
    setModeState(keys[nextIdx]);
  }, [mode]);

  const value = {
    mode,
    setMode,
    cycleMode,
    accent: THEMES[mode]?.accent || THEMES.clinical.accent,
    themeInfo: THEMES[mode] || THEMES.clinical,
    availableThemes: THEMES,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
