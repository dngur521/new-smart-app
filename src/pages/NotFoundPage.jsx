import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <Paper elevation={0} sx={{ p: 6, textAlign: 'center', backgroundColor: 'transparent' }}>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'text.disabled' }} />
        <Typography variant="h1" sx={{ fontWeight: 700, color: 'text.disabled', lineHeight: 1 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
          페이지를 찾을 수 없습니다
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          요청하신 주소가 존재하지 않거나 이동되었습니다.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          홈으로 돌아가기
        </Button>
      </Paper>
    </Box>
  );
}
