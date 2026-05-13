import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Alert,
  Grid,
  Snackbar,
} from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PowerIcon from '@mui/icons-material/Power';
import SendIcon from '@mui/icons-material/Send';
import { useSendCommand } from '../hooks/useApi';
import { getCommandIndex } from '../utils/commandUtils';

export default function AirControlPage() {
  const [type, setType] = useState('cooling');
  const [temp, setTemp] = useState(18);
  const [wind, setWind] = useState('약풍');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { mutate: sendCommand, isPending, isError, error } = useSendCommand({
    onSuccess: () => setSnackbarOpen(true),
  });

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
    sendCommand(commandToSend);
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
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="단축 명령어" />
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" startIcon={<PowerIcon />} onClick={() => handleCommand('powerOn')} disabled={isPending}>
                  전원 ON
                </Button>
                <Button variant="contained" startIcon={<AcUnitIcon />} onClick={() => handleCommand('powerCooling')} disabled={isPending}>
                  파워 냉방
                </Button>
                <Button variant="contained" color="error" startIcon={<PowerSettingsNewIcon />} onClick={() => handleCommand('powerOff')} disabled={isPending}>
                  전원 OFF
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 상세 제어 */}
        <Grid item xs={12} md={6}>
          <Card>
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

        <Grid item xs={12}>
          {isError && <Alert severity="error">오류: {error.message}</Alert>}
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
