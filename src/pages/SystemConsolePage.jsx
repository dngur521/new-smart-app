// src/pages/SystemConsolePage.jsx

import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

// Nginx 프록시 주소 (이 주소가 ttyd의 HTML 페이지를 제공함)
const CONSOLE_URL = "/console-ws/";

export default function SystemConsolePage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>시스템 콘솔 (Pi 2)</Typography>
      
      {/* 1. Paper로 래핑하여 테마와 통일감을 줍니다. */}
      {/* 2. vh (viewport-height)를 사용해 터미널 창의 높이를 지정합니다. */}
      <Paper sx={{ 
        overflow: 'hidden', 
        height: '75vh', // 화면 높이의 75%
        display: 'flex',
        backgroundColor: '#000' // ttyd 배경과 맞춤
      }}>
        <iframe
          src={CONSOLE_URL}
          title="System Console Pi 2"
          style={{
            width: '100%',
            height: '100%',
            border: 'none', // iframe 테두리 제거
          }}
        />
      </Paper>
    </Box>
  );
}