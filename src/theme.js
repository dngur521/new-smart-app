import { createTheme } from '@mui/material/styles';
import { koKR } from '@mui/material/locale';

export const createAppTheme = (mode) => createTheme(
  {
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      background: mode === 'light'
        ? { default: '#f4f6f8', paper: '#ffffff' }
        : { default: '#121212', paper: '#1e1e1e' },
    },
    typography: {
      fontFamily: '"Pretendard", system-ui, Avenir, Helvetica, Arial, sans-serif',
      h4: { fontWeight: 700, marginBottom: '1rem' },
      h6: { fontWeight: 700 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 700,
          },
        },
      },
    },
  },
  koKR
);
