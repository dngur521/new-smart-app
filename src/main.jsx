import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import theme from './theme';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';

// React Query 클라이언트 생성
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* React Query Provider */}
    <QueryClientProvider client={queryClient}>
      {/* MUI Theme Provider */}
      <ThemeProvider theme={theme}>
        {/* MUI Date Picker를 위한 설정 */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* CSS 리셋 및 기본 스타일 적용 */}
          <CssBaseline />
          {/* React Router Provider */}
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
