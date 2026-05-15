import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import { useCctvConfig, useUpdateCctvConfig } from '../hooks/useApi';

const CCTV_STREAM_URL = import.meta.env.VITE_CCTV_STREAM_URL || '/cctv-stream/';

export default function CctvPage() {
  const imgRef = useRef(null);
  const [isRestarting, setIsRestarting] = useState(false);

  const { data: cctvConfig } = useCctvConfig();
  const { mutate: updateConfig } = useUpdateCctvConfig();

  useEffect(() => {
    const img = imgRef.current;
    return () => {
      if (img) img.src = 'data:,';
    };
  }, []);

  const forceReconnect = () => {
    const img = imgRef.current;
    if (!img) return;
    img.src = 'data:,';
    setTimeout(() => {
      if (imgRef.current) {
        imgRef.current.src = `${CCTV_STREAM_URL}?_=${Date.now()}`;
      }
    }, 500);
  };

  const handleResolutionChange = (e) => {
    setIsRestarting(true);
    updateConfig(
      { resolution: e.target.value, fps: 30 },
      {
        onSuccess: () => {
          setTimeout(() => {
            setIsRestarting(false);
            forceReconnect();
          }, 2000);
        },
        onError: () => setIsRestarting(false),
      }
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>CCTV 실시간 스트리밍</Typography>

      {cctvConfig && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>해상도</InputLabel>
            <Select
              value={cctvConfig.current.resolution}
              label="해상도"
              onChange={handleResolutionChange}
              disabled={isRestarting}
            >
              {cctvConfig.supported.map(({ resolution }) => (
                <MenuItem key={resolution} value={resolution}>{resolution}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {isRestarting && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">스트림 재시작 중...</Typography>
            </Box>
          )}
        </Box>
      )}

      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Paper sx={{ p: 1, overflow: 'hidden', position: 'relative' }}>
            {isRestarting && (
              <Box sx={{
                position: 'absolute', inset: 0, zIndex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.5)', borderRadius: '8px',
              }}>
                <CircularProgress sx={{ color: 'white' }} />
              </Box>
            )}
            <img
              ref={imgRef}
              src={CCTV_STREAM_URL}
              alt="CCTV Live Stream"
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
