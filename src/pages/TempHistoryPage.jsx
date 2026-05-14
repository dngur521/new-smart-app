import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  CircularProgress,
  Alert,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTempHistory, useSeekPage, useTodayTempHistory, useTodayDustHistory } from '../hooks/useApi';
import dayjs from 'dayjs';

export default function TempHistoryPage() {
  const [page, setPage] = useState(0); // MUI는 0-based, API는 1-based
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [goToInput, setGoToInput] = useState('');
  const [seekDate, setSeekDate] = useState(null);

  const { data, isLoading, isError, error } = useTempHistory(page + 1, rowsPerPage);
  const { mutate: seekPage, isPending: isSeekPending } = useSeekPage('/arduino/dht-history/seek');
  const { data: todayTemp } = useTodayTempHistory();
  const { data: todayDust } = useTodayDustHistory();
  const chartData = todayTemp?.data ?? [];
  const dustChartData = todayDust?.data ?? [];

  const totalPages = Math.ceil((data?.total || 0) / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleGoToPage = (e) => {
    if (e.key !== 'Enter') return;
    const target = parseInt(goToInput, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      setPage(target - 1);
    }
    setGoToInput('');
  };

  const handleSeekPage = () => {
    if (!seekDate) return;
    seekPage(
      { timestamp: seekDate.toISOString(), limit: rowsPerPage },
      { onSuccess: (res) => setPage(res.page - 1) }
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        온습도 기록
      </Typography>

      {/* 오늘 추이 차트 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title={`온도·습도 추이 (${dayjs().format('MM/DD')})`} sx={{ pb: 0 }} />
            <CardContent sx={{ pt: 0 }}>
              {chartData.length > 1 ? (
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
                  height={200}
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
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title={`미세먼지 추이 (${dayjs().format('MM/DD')})`} sx={{ pb: 0 }} />
            <CardContent sx={{ pt: 0 }}>
              {dustChartData.length > 1 ? (
                <LineChart
                  xAxis={[{
                    data: dustChartData.map(r => new Date(r.timestamp)),
                    scaleType: 'time',
                    valueFormatter: (v) => dayjs(v).format('HH:mm'),
                  }]}
                  series={[
                    { data: dustChartData.map(r => r.pm1_0), label: 'PM1.0', color: '#4caf50', showMark: false },
                    { data: dustChartData.map(r => r.pm2_5), label: 'PM2.5', color: '#ff9800', showMark: false },
                    { data: dustChartData.map(r => r.pm10), label: 'PM10', color: '#f44336', showMark: false },
                  ]}
                  height={200}
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

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {isError && <Alert severity="error">오류: {error.message}</Alert>}
        {data && (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="temperature history table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>#</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>온도 (°C)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>습도 (%)</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>PM1.0 (μg/m³)</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>PM2.5 (μg/m³)</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>PM10 (μg/m³)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>시간</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.data.map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        {row.temperature}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'info.main' }}>{row.humidity}</TableCell>
                      <TableCell align="center" sx={{ color: 'warning.main' }}>{row.pm1_0 ?? '값 없음'}</TableCell>
                      <TableCell align="center" sx={{ color: 'warning.main' }}>{row.pm2_5 ?? '값 없음'}</TableCell>
                      <TableCell align="center" sx={{ color: 'warning.main' }}>{row.pm10 ?? '값 없음'}</TableCell>
                      <TableCell align="right">{dayjs(row.timestamp).format('YY/MM/DD HH:mm')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, pt: 1.5, pb: 0.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  날짜/시간으로 이동:
                </Typography>
                <DateTimePicker
                  value={seekDate}
                  onChange={setSeekDate}
                  slotProps={{ textField: { size: 'small' } }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSeekPage}
                  disabled={!seekDate || isSeekPending}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {isSeekPending ? <CircularProgress size={16} color="inherit" /> : '이동'}
                </Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    몇 페이지로 이동:
                  </Typography>
                  <TextField
                    size="small"
                    type="number"
                    value={goToInput}
                    onChange={(e) => setGoToInput(e.target.value)}
                    onKeyDown={handleGoToPage}
                    placeholder={`1-${totalPages}`}
                    sx={{ width: 80 }}
                    inputProps={{ min: 1, max: totalPages }}
                  />
                </Box>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={data.total || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="페이지 당 행:"
                  labelDisplayedRows={({ from, to, count }) => `${count}개 중 ${from}-${to}`}
                />
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
