import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Alert,
  Grid,
  Snackbar,
  Chip,
} from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PowerIcon from '@mui/icons-material/Power';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import { Link } from 'react-router-dom';
import { useSendCommand, useAirHistory } from '../hooks/useApi';
import { getCommandIndex, getCommandDescription } from '../utils/commandUtils';
import dayjs from 'dayjs';

export default function AirControlPage() {
  const [type, setType] = useState('cooling');
  const [temp, setTemp] = useState(18);
  const [wind, setWind] = useState('약풍');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { mutate: sendCommand, isPending, isError, error } = useSendCommand();
  const { data: recentHistory, isLoading: isHistoryLoading } = useAirHistory(1, 1);

  const handleCommand = (commandType) => {
    let commandToSend;

    if (commandType === 'powerCooling') {
      commandToSend = 'SEND 2,5';
    } else if (commandType === 'powerOff') {
      commandToSend = 'SEND 0,5';
    } else if (commandType === 'powerOn') {
      commandToSend = 'SEND 1,5';
    } else {
      const codeIndex = getCommandIndex(type, temp, wind);
      if (codeIndex !== null) {
        commandToSend = `SEND ${codeIndex},5`;
      } else {
        // UI상 발생하기 어려운 케이스 (선택 가능한 조합이 모두 codes에 정의되어 있음)
        alert('유효하지 않은 명령어 조합입니다.');
        return;
      }
    }
    sendCommand(commandToSend, { onSuccess: () => setSnackbarOpen(true) });
  };

  const temps = Array.from({ length: 13 }, (_, i) => 18 + i);
  const winds = ['약풍', '중풍', '강풍', '자동풍'];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        에어컨 제어
      </Typography>
      <Grid container spacing={3}>
        {/* 단축 명령어 */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="단축 명령어" />
            <CardContent sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<PowerIcon />}
                    onClick={() => handleCommand('powerOn')}
                    disabled={isPending}
                    sx={{ py: 1.5 }}
                  >
                    전원 ON
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="info"
                    size="large"
                    startIcon={<AcUnitIcon />}
                    onClick={() => handleCommand('powerCooling')}
                    disabled={isPending}
                    sx={{ py: 1.5 }}
                  >
                    파워 냉방
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<PowerSettingsNewIcon />}
                    onClick={() => handleCommand('powerOff')}
                    disabled={isPending}
                    sx={{ py: 1.5 }}
                  >
                    전원 OFF
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 상세 제어 */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="상세 제어" />
            <CardContent>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel id="type-select-label">종류</InputLabel>
                  <Select labelId="type-select-label" value={type} label="종류" onChange={(e) => setType(e.target.value)}>
                    <MenuItem value="cooling">냉방</MenuItem>
                    <MenuItem value="dehumidification">제습</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="temp-select-label">온도</InputLabel>
                  <Select labelId="temp-select-label" value={temp} label="온도" onChange={(e) => setTemp(e.target.value)}>
                    {temps.map((t) => <MenuItem key={t} value={t}>{t}℃</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="wind-select-label">바람 세기</InputLabel>
                  <Select labelId="wind-select-label" value={wind} label="바람 세기" onChange={(e) => setWind(e.target.value)}>
                    {winds.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={() => handleCommand('custom')}
                  disabled={isPending}
                  startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                >
                  {isPending ? '전송 중...' : '명령 전송'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 마지막 에어컨 제어 기록 */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="마지막 에어컨 제어 기록"
              action={
                <Button component={Link} to="/aircon/history" size="small" endIcon={<HistoryIcon />}>
                  전체 보기
                </Button>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              {isHistoryLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
              {!isHistoryLoading && recentHistory?.data?.length > 0 && (
                <Stack divider={<Divider flexItem />}>
                  {recentHistory.data.map((row) => (
                    <Box
                      key={row.id}
                      sx={{ display: 'flex', alignItems: 'center', py: 1.5, gap: 1 }}
                    >
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {getCommandDescription(row.command)}
                      </Typography>
                      <Chip label={row.response || 'N/A'} size="small" sx={{ flexShrink: 0 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {dayjs(row.timestamp).format('MM/DD HH:mm')}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
              {!isHistoryLoading && !recentHistory?.data?.length && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  기록 없음
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {isError && (
          <Grid item xs={12}>
            <Alert severity="error">오류: {error.message}</Alert>
          </Grid>
        )}
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
