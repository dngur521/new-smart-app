import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

/**
 * 로그인된 사용자만 접근할 수 있도록 보호하는 라우트 컴포넌트
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // 로그인되지 않았다면 로그인 페이지로 리디렉션
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}