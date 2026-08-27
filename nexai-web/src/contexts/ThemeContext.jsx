import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const THEMES = {
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
  }
};

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    return localStorage.getItem('nexai_theme') || 'care';
  });

  // Apply theme as CSS custom properties on :root
  useEffect(() => {
    const theme = THEMES[mode] || THEMES.care;
    const root = document.documentElement;

    root.setAttribute('data-theme', mode);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-rgb', theme.accentRgb);
    
    // Adjust meta theme-color for mobile chrome bar
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'rest' ? '#1e293b' : '#ffffff');

    localStorage.setItem('nexai_theme', mode);
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
    accent: THEMES[mode]?.accent || THEMES.care.accent,
    themeInfo: THEMES[mode] || THEMES.care,
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
