import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAirconStatus } from '../hooks/useApi';

export default function AirconStatusBadge() {
  const { data, isLoading, isError } = useAirconStatus();

  if (isLoading) return <CircularProgress size={14} />;
  if (isError || !data) return null;

  const isOn = data.is_on;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        bgcolor: isOn ? 'success.main' : 'error.main',
        flexShrink: 0,
      }} />
      <Typography variant="body2" sx={{ fontWeight: 500, color: isOn ? 'success.main' : 'error.main' }}>
        {isOn ? '켜짐' : '꺼짐'}
      </Typography>
    </Box>
  );
}
