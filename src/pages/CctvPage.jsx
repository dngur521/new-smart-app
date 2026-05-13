import React, { useRef, useEffect } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

const CCTV_STREAM_URL = import.meta.env.VITE_CCTV_STREAM_URL || '/cctv-stream/';

export default function CctvPage() {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current; // 마운트 시점에 캡처 (cleanup 시점엔 null일 수 있음)
    return () => {
      if (img) {
        // src=''은 현재 페이지 URL로 해석되어 새 요청이 발생함
        // data URI로 즉시 교체해 MJPEG 스트림 연결을 강제 종료
        img.src = 'data:,';
      }
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        CCTV 실시간 스트리밍
      </Typography>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Paper sx={{ p: 1, overflow: 'hidden' }}>
            <img
              ref={imgRef}
              src={CCTV_STREAM_URL}
              alt="CCTV Live Stream"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '8px',
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}