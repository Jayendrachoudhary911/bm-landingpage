// theme.js
import { createTheme } from '@mui/material/styles';

export const getMD3Theme = (mode = 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#a8c7fa', // Primary
        contrastText: '#062e6f',
      },
      secondary: {
        main: '#c2e7ff', // Secondary container
        contrastText: '#001d35',
      },
      background: {
        default: mode === 'dark' ? '#111318' : '#f8f9ff',
        paper: mode === 'dark' ? '#1d2026' : '#edf0f8',
      },
      tonal: {
        surfaceContainerLow: mode === 'dark' ? '#191c20' : '#f2f3fa',
        surfaceContainer: mode === 'dark' ? '#1d2026' : '#edf0f8',
        surfaceContainerHigh: mode === 'dark' ? '#272a31' : '#e7e8f0',
        outline: mode === 'dark' ? '#8c9199' : '#72777f',
        outlineVariant: mode === 'dark' ? '#43474e' : '#c3c7cf',
      },
    },
    shape: {
      borderRadius: 16, // MD3 standard container rounding
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, sans-serif',
      h4: {
        fontWeight: 800,
        letterSpacing: '-0.03em',
      },
      h6: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      body1: {
        lineHeight: 1.6,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 9999, // Pill shape for MD3 buttons
            textTransform: 'none',
            fontWeight: 700,
            padding: '10px 24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            backgroundColor: '#a8c7fa',
            color: '#062e6f',
            '&:hover': {
              backgroundColor: '#c2e7ff',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            backgroundImage: 'none',
            transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.25s cubic-bezier(0.2, 0, 0, 1)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 600,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 16,
            },
          },
        },
      },
    },
  });