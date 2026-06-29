import { createTheme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

export function createAppTheme(mode: ThemeMode) {
  const isDark = mode === 'dark';

  return createTheme({
  palette: {
    mode,
    primary: {
      main: isDark ? '#8B5CF6' : '#6D28D9',
      light: isDark ? '#A78BFA' : '#8B5CF6',
      dark: isDark ? '#6D28D9' : '#4C1D95',
    },
    secondary: {
      main: isDark ? '#A855F7' : '#7C3AED',
    },
    success: {
      main: '#16A34A',
      light: '#86EFAC',
      dark: '#166534',
    },
    error: {
      main: '#DC2626',
      light: '#FCA5A5',
      dark: '#991B1B',
    },
    warning: {
      main: '#D97706',
      light: '#FCD34D',
      dark: '#92400E',
    },
    info: {
      main: '#2563EB',
    },
    background: {
      default: isDark ? '#07070B' : '#F8F7FB',
      paper: isDark ? '#111018' : '#FFFFFF',
    },
    text: {
      primary: isDark ? '#F4F1FA' : '#171421',
      secondary: isDark ? '#A7A0B8' : '#5D566B',
      disabled: isDark ? '#6D647A' : '#938AA3',
    },
    divider: isDark ? 'rgba(167, 160, 184, 0.16)' : 'rgba(68, 56, 85, 0.14)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500, letterSpacing: '0.02em' },
    body2: { fontSize: '0.8125rem' },
    caption: { fontSize: '0.75rem', letterSpacing: '0.04em' },
    overline: { fontSize: '0.6875rem', letterSpacing: '0.1em', fontWeight: 600 },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 8,
          border: isDark ? '1px solid rgba(167, 160, 184, 0.12)' : '1px solid rgba(68, 56, 85, 0.1)',
          boxShadow: isDark
            ? '0 18px 48px rgba(0, 0, 0, 0.42), 0 0 22px rgba(139, 92, 246, 0.06)'
            : '0 18px 42px rgba(42, 32, 64, 0.08), 0 0 18px rgba(109, 40, 217, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.02em',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.04em',
          fontSize: '0.6875rem',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(168, 85, 247, 0.22)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(109, 40, 217, 0.36)',
          },
        },
      },
    },
  },
});
}

const theme = createAppTheme('dark');

export default theme;
