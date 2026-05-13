// src/pages/CctvPage.jsx

import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material'; // 1. Grid를 import 합니다.

const CCTV_STREAM_URL = import.meta.env.VITE_CCTV_STREAM_URL || '/cctv-stream/';

export default function CctvPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        CCTV 실시간 스트리밍
      </Typography>

      {/* 2. '실시간 온습도' 페이지처럼 Grid 컨테이너로 감싸서 중앙 정렬 및 너비 제한 */}
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>

          {/* 3. Paper에서 backgroundColor: '#000' 를 제거합니다. */}
          {/* p: 1 (8px) 패딩을 주어 "살짝 큰" 느낌을 줍니다. */}
          <Paper sx={{ p: 1, overflow: 'hidden' }}>
            <img
              src={CCTV_STREAM_URL}
              alt="CCTV Live Stream"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                // 4. (추천) 이미지 자체에도 둥근 모서리를 줘서 카드와 일체감을 줍니다.
                borderRadius: '8px', 
              }}
            />
          </Paper>

        </Grid>
      </Grid>
    </Box>
  );
}