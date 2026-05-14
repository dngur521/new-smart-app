import React from 'react';
import { Box, Card, CardContent, CircularProgress, Typography, Grid, Alert, Stack } from '@mui/material';
import { useSensorData, useDustSensor } from '../hooks/useApi';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';

export default function TempCheckPage() {
  const { data, isLoading, isError, error, isFetching } = useSensorData();
  const { data: dustData } = useDustSensor();

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">실시간 온습도</Typography>
        {isFetching && <CircularProgress size={24} />}
      </Stack>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Card>
            <CardContent>
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                  <CircularProgress size={60} />
                </Box>
              )}
              {isError && <Alert severity="error">오류: {error.message}</Alert>}
              {data && (
                <>
                  <Typography variant="h6" color="text.secondary" gutterBottom align="center">
                    현재 상태
                  </Typography>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={4}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ my: 3 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <DeviceThermostatIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
                        {data.temperature}°C
                      </Typography>
                      <Typography variant="overline" color="text.secondary">온도</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <WaterDropIcon sx={{ fontSize: 40, color: 'info.main' }} />
                      <Typography variant="h3" color="info.main" sx={{ fontWeight: 700 }}>
                        {data.humidity}%
                      </Typography>
                      <Typography variant="overline" color="text.secondary">습도</Typography>
                    </Box>
                  </Stack>

                  <Typography variant="h6" color="text.secondary" gutterBottom align="center">
                    미세먼지
                  </Typography>
                  {dustData ? (
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={4}
                      justifyContent="center"
                      alignItems="center"
                      sx={{ my: 3 }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <AirIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                        <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
                          {dustData.data.pm1_0}
                        </Typography>
                        <Typography variant="overline" color="text.secondary">PM1.0 μg/m³</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <AirIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                        <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
                          {dustData.data.pm2_5}
                        </Typography>
                        <Typography variant="overline" color="text.secondary">PM2.5 μg/m³</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <AirIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                        <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
                          {dustData.data.pm10}
                        </Typography>
                        <Typography variant="overline" color="text.secondary">PM10 μg/m³</Typography>
                      </Box>
                    </Stack>
                  ) : (
                    <Typography align="center" color="text.secondary" sx={{ my: 3 }}>
                      측정 중
                    </Typography>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
