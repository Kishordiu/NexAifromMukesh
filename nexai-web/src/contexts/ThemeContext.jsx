import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const THEMES = {
<<<<<<< HEAD
  care: {
    accent: '#3b82f6',
    accentRgb: '59, 130, 246',
    label: 'Care Mode',
    description: 'Default clinical monitoring'
  },
  rest: {
    accent: '#f59e0b',
    accentRgb: '245, 158, 11',
    label: 'Rest Mode',
    description: 'Low-contrast for nighttime'
  },
  clinician: {
    accent: '#8b5cf6',
    accentRgb: '139, 92, 246',
    label: 'Clinician Mode',
    description: 'Provider-facing purple theme'
=======
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
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
  }
};

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
<<<<<<< HEAD
    return localStorage.getItem('nexai_theme') || 'care';
  });

  // Apply theme as CSS custom properties on :root
  useEffect(() => {
    const theme = THEMES[mode] || THEMES.care;
=======
    return localStorage.getItem('diumed_theme') || 'clinical';
  });

  useEffect(() => {
    const theme = THEMES[mode] || THEMES.clinical;
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
    const root = document.documentElement;

    root.setAttribute('data-theme', mode);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-rgb', theme.accentRgb);
    
<<<<<<< HEAD
    // Adjust meta theme-color for mobile chrome bar
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'rest' ? '#1e293b' : '#ffffff');

    localStorage.setItem('nexai_theme', mode);
=======
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#ffffff'); // DiuMed stays clean white/glass

    localStorage.setItem('diumed_theme', mode);
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
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
<<<<<<< HEAD
    accent: THEMES[mode]?.accent || THEMES.care.accent,
    themeInfo: THEMES[mode] || THEMES.care,
=======
    accent: THEMES[mode]?.accent || THEMES.clinical.accent,
    themeInfo: THEMES[mode] || THEMES.clinical,
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
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
