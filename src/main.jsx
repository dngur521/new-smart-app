import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createAppTheme } from './theme';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ColorModeProvider, useColorMode } from './context/ThemeContext';

const queryClient = new QueryClient();

function ThemedApp() {
  const { effectiveMode } = useColorMode();
  const theme = useMemo(() => createAppTheme(effectiveMode), [effectiveMode]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ColorModeProvider>
        <ThemedApp />
      </ColorModeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
