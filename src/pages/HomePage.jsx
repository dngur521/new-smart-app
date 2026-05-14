import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PowerIcon from '@mui/icons-material/Power';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useAuth } from '../hooks/useAuth';
import { useSensorData, useAirHistory, useSendCommand, useWeather, useTodayTempHistory, useDustSensor, useTodayDustHistory } from '../hooks/useApi';
import { getCommandDescription } from '../utils/commandUtils';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [now, setNow] = useState(dayjs());
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: weather } = useWeather();
  const { data: sensorData } = useSensorData();
  const { data: airHistory } = useAirHistory(1, 5);
  const { data: todayTemp } = useTodayTempHistory();
  const { data: dustData } = useDustSensor();
  const { data: todayDust } = useTodayDustHistory();
  const { mutate: sendCommand, isPending } = useSendCommand();

  const lastAirRecord = airHistory?.data?.[0];
  const chartData = todayTemp?.data ?? [];
  const dustChartData = todayDust?.data ?? [];

  const handleQuickCommand = (cmd) => {
    sendCommand(cmd, { onSuccess: () => setSnackbarOpen(true) });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>홈</Typography>
      <Grid container spacing={3}>

        {/* 날짜/시간 + 날씨 */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ fontWeight: 700, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                    {now.format('HH:mm:ss')}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mt: 0.5 }}>
                    {now.locale('ko').format('YYYY년 MM월 DD일 dddd')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
                  {weather ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                        style={{ width: 64, height: 64 }}
                      />
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
                          {Math.round(weather.main.temp)}°C
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.3 }}>
                          {weather.weather[0].description} · {weather.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          체감 {Math.round(weather.main.feels_like)}°C · 습도 {weather.main.humidity}% · 풍속 {weather.wind.speed}m/s
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {import.meta.env.VITE_WEATHER_API_KEY ? '날씨 불러오는 중...' : '날씨: VITE_WEATHER_API_KEY 미설정'}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 실내 환경 */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="실내 환경" />
            <CardContent>
              {isAuthenticated && sensorData ? (
                <>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center" alignItems="center" sx={{ my: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <DeviceThermostatIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {sensorData.temperature}°C
                      </Typography>
                      <Typography variant="overline" color="text.secondary">온도</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <WaterDropIcon sx={{ fontSize: 40, color: 'info.main' }} />
                      <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main' }}>
                        {sensorData.humidity}%
                      </Typography>
                      <Typography variant="overline" color="text.secondary">습도</Typography>
                    </Box>
                  </Stack>
                  <Typography variant="subtitle2" color="text.secondary" align="center" sx={{ mt: 1 }}>미세먼지</Typography>
                  {dustData ? (
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <AirIcon sx={{ fontSize: 28, color: 'warning.main' }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>{dustData.data.pm1_0}</Typography>
                        <Typography variant="overline" color="text.secondary">PM1.0</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <AirIcon sx={{ fontSize: 28, color: 'warning.main' }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>{dustData.data.pm2_5}</Typography>
                        <Typography variant="overline" color="text.secondary">PM2.5</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <AirIcon sx={{ fontSize: 28, color: 'warning.main' }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>{dustData.data.pm10}</Typography>
                        <Typography variant="overline" color="text.secondary">PM10</Typography>
                      </Box>
                    </Stack>
                  ) : (
                    <Typography align="center" color="text.secondary" variant="body2" sx={{ mt: 1 }}>측정 중</Typography>
                  )}
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  {isAuthenticated
                    ? <CircularProgress />
                    : <Typography variant="body2" color="text.secondary">로그인 후 확인 가능합니다.</Typography>
                  }
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 에어컨 상태 + 빠른 제어 */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="에어컨" />
            <CardContent>
              {isAuthenticated ? (
                <Stack spacing={2}>
                  <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">마지막 제어</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {lastAirRecord ? getCommandDescription(lastAirRecord.command) : '기록 없음'}
                    </Typography>
                    {lastAirRecord && (
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(lastAirRecord.timestamp).format('MM/DD HH:mm')}
                      </Typography>
                    )}
                  </Box>
                  <Stack spacing={1}>
                    <Button fullWidth variant="contained" size="large" startIcon={<PowerIcon />}
                      onClick={() => handleQuickCommand('SEND 1,5')} disabled={isPending} sx={{ py: 1.2 }}>
                      전원 ON
                    </Button>
                    <Button fullWidth variant="contained" color="info" size="large" startIcon={<AcUnitIcon />}
                      onClick={() => handleQuickCommand('SEND 2,5')} disabled={isPending} sx={{ py: 1.2 }}>
                      파워 냉방
                    </Button>
                    <Button fullWidth variant="contained" color="error" size="large" startIcon={<PowerSettingsNewIcon />}
                      onClick={() => handleQuickCommand('SEND 0,5')} disabled={isPending} sx={{ py: 1.2 }}>
                      전원 OFF
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">로그인 후 제어 가능합니다.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 오늘 추이 차트 */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardHeader title={`온도·습도 추이 (${now.format('MM/DD')})`} sx={{ pb: 0 }} />
                <CardContent sx={{ pt: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {!isAuthenticated ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                      <Typography variant="body2" color="text.secondary">로그인 후 확인 가능합니다.</Typography>
                    </Box>
                  ) : chartData.length > 1 ? (
                    <LineChart
                      xAxis={[{
                        data: chartData.map(r => new Date(r.timestamp)),
                        scaleType: 'time',
                        valueFormatter: (v) => dayjs(v).format('HH:mm'),
                      }]}
                      series={[
                        { data: chartData.map(r => r.temperature), label: '온도 (°C)', color: '#1976d2', showMark: false },
                        { data: chartData.map(r => r.humidity), label: '습도 (%)', color: '#29b6f6', showMark: false },
                      ]}
                      height={180}
                      margin={{ left: 45, right: 20, top: 10, bottom: 30 }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                      <Typography variant="body2" color="text.secondary">오늘 데이터가 없습니다.</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardHeader title={`미세먼지 추이 (${now.format('MM/DD')})`} sx={{ pb: 0 }} />
                <CardContent sx={{ pt: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {!isAuthenticated ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                      <Typography variant="body2" color="text.secondary">로그인 후 확인 가능합니다.</Typography>
                    </Box>
                  ) : dustChartData.length > 1 ? (
                    <LineChart
                      xAxis={[{
                        data: dustChartData.map(r => new Date(r.timestamp)),
                        scaleType: 'time',
                        valueFormatter: (v) => dayjs(v).format('HH:mm'),
                      }]}
                      series={[
                        { data: dustChartData.map(r => r.pm2_5), label: 'PM2.5', color: '#ff9800', showMark: false },
                        { data: dustChartData.map(r => r.pm10), label: 'PM10', color: '#f44336', showMark: false },
                      ]}
                      height={180}
                      margin={{ left: 45, right: 20, top: 10, bottom: 30 }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                      <Typography variant="body2" color="text.secondary">오늘 데이터가 없습니다.</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="명령이 성공적으로 전송되었습니다."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
