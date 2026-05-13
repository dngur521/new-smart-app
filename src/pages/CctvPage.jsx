import React, { useRef, useEffect } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

const CCTV_STREAM_URL = import.meta.env.VITE_CCTV_STREAM_URL || '/cctv-stream/';

export default function CctvPage() {
  const imgRef = useRef(null);

  useEffect(() => {
    return () => {
      // 페이지 이탈 시 src를 비워 브라우저의 MJPEG 스트림 연결을 강제 종료
      if (imgRef.current) {
        imgRef.current.src = '';
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