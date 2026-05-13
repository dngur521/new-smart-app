import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

// ttyd 웹 인터페이스를 Nginx가 프록시하는 경로
const CONSOLE_URL = "/console-ws/";

export default function SystemConsolePage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>시스템 콘솔 (Pi 2)</Typography>
      <Paper sx={{
        overflow: 'hidden',
        height: '75vh',
        display: 'flex',
        backgroundColor: '#000', // ttyd 배경색에 맞춤
      }}>
        <iframe
          src={CONSOLE_URL}
          title="System Console Pi 2"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </Paper>
    </Box>
  );
}
