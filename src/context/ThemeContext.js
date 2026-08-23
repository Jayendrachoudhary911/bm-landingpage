import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';

// Signature dark gradient presets (Midnight Obsidian & Deep Slate)
export const GRADIENTS = {
  headerDark: `
    radial-gradient(ellipse 140% 90% at 50% 100%, #6b9ecb 0%, #4172a0 25%, #1e4268 50%, #0a1b2d 75%, #000000 100%)
  `,
  headerLight: `
    radial-gradient(ellipse 140% 90% at 50% 100%, #6b9ecb 0%, #4172a0 25%, #1e4268 50%, #0a1b2d 75%, #000000 100%)
  `,
  headerLightDeep: `
    radial-gradient(ellipse 140% 90% at 50% 100%, #6b9ecb 0%, #4172a0 25%, #1e4268 50%, #0a1b2d 75%, #000000 100%)
  `,
  heroOverlayDark: `
    radial-gradient(ellipse at 50% 100%, rgba(56, 189, 248, 0.4), rgba(37, 99, 235, 0.25) 45%, transparent 70%)
  `,
  heroOverlayLight: `
    radial-gradient(ellipse at 50% 100%, rgba(56, 189, 248, 0.4), rgba(37, 99, 235, 0.25) 45%, transparent 70%)
  `,
};

const ThemeContext = createContext({
  mode: 'dark',
  toggleTheme: () => {},
  isDark: true,
  gradients: GRADIENTS,
});

export const useCustomTheme = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {

  const toggleTheme = () => {
    // Locked to pure dark theme per user request
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    try {
      localStorage.setItem('bm_theme_mode', 'dark');
    } catch (e) {
      // ignore
    }
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#38bdf8', // vibrant sky cyan
          light: '#7dd3fc',
          dark: '#0369a1',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#818cf8',
          light: '#a5b4fc',
          dark: '#4f46e5',
        },
        background: {
          default: '#000000',
          paper: '#090d16',
          surface: 'rgba(255, 255, 255, 0.04)',
          elevated: '#0f172a',
          glass: 'rgba(15, 23, 42, 0.8)',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          highlight: 'rgba(56, 189, 248, 0.35)',
        },
        divider: 'rgba(255, 255, 255, 0.08)',
      },
      typography: {
        fontFamily: "'Plus Jakarta Sans', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        h1: { fontWeight: 800 },
        h2: { fontWeight: 800 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
      },
      shape: {
        borderRadius: 16,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: '#000000',
              color: '#f8fafc',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 600,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      },
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ mode: 'dark', toggleTheme, isDark: true, gradients: GRADIENTS }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
