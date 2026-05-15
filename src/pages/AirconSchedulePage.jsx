import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PowerIcon from '@mui/icons-material/Power';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CancelIcon from '@mui/icons-material/Cancel';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import dayjs from 'dayjs';
import {
  useAirconSchedules,
  useCreateAirconSchedule,
  useCancelAirconSchedule,
  useDeleteAirconSchedulesBulk,
} from '../hooks/useApi';

const WIND_LABEL = { low: '약풍', mid: '중풍', high: '강풍', auto: '자동풍' };
const MODE_LABEL = { cool: '냉방', dry: '제습' };
const TEMPS = Array.from({ length: 13 }, (_, i) => 18 + i);
const DAYS_OPTIONS = [1, 3, 7, 14, 30];

const STATUS_CHIP = {
  pending:   { label: '대기중',  color: 'primary' },
  done:      { label: '완료',    color: 'success' },
  cancelled: { label: '취소됨', color: 'default' },
};

const CONFIRM_INIT = { open: false, title: '', description: '', payload: null };

export default function AirconSchedulePage() {
  const [action, setAction] = useState('on');
  const [scheduledAt, setScheduledAt] = useState(dayjs().add(1, 'hour').startOf('minute'));
  const [mode, setMode] = useState('cool');
  const [temp, setTemp] = useState(26);
  const [wind, setWind] = useState('auto');
  const [olderThanDays, setOlderThanDays] = useState(7);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirm, setConfirm] = useState(CONFIRM_INIT);

  const { data: schedules, isLoading } = useAirconSchedules();
  const { mutate: createSchedule, isPending: isCreating } = useCreateAirconSchedule();
  const { mutate: cancelSchedule, isPending: isCancelling } = useCancelAirconSchedule();
  const { mutate: bulkDelete, isPending: isBulkDeleting } = useDeleteAirconSchedulesBulk();

  const showSnackbar = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  const openConfirm = (title, description, payload) =>
    setConfirm({ open: true, title, description, payload });

  const handleConfirm = () => {
    bulkDelete(confirm.payload, {
      onSuccess: (data) => {
        showSnackbar(`${data.deleted}건이 삭제되었습니다.`);
        setConfirm(CONFIRM_INIT);
      },
      onError: (e) => {
        showSnackbar(`오류: ${e.message}`, 'error');
        setConfirm(CONFIRM_INIT);
      },
    });
  };

  const handleSubmit = () => {
    if (!scheduledAt?.isValid()) return;
    const payload = {
      action,
      scheduled_at: scheduledAt.format('YYYY-MM-DDTHH:mm:ss'),
      ...(action === 'on' && { temperature: temp, mode, wind }),
    };
    createSchedule(payload, {
      onSuccess: () => showSnackbar('예약이 등록되었습니다.'),
      onError: (e) => showSnackbar(`오류: ${e.message}`, 'error'),
    });
  };

  const handleCancel = (id) => {
    cancelSchedule(id, {
      onSuccess: () => showSnackbar('예약이 취소되었습니다.', 'info'),
      onError: (e) => showSnackbar(`오류: ${e.message}`, 'error'),
    });
  };

  const getSettingLabel = (s) => {
    if (s.action === 'off') return '-';
    return `${MODE_LABEL[s.mode] ?? s.mode} ${s.temperature}°C ${WIND_LABEL[s.wind] ?? s.wind}`;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>에어컨 예약</Typography>

      <Grid container spacing={3}>
        {/* 예약 등록 폼 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="새 예약" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>동작</Typography>
                  <ToggleButtonGroup
                    value={action}
                    exclusive
                    onChange={(_, v) => { if (v) setAction(v); }}
                    fullWidth
                    size="small"
                  >
                    <ToggleButton value="on" sx={{ gap: 0.5 }}>
                      <PowerIcon fontSize="small" /> 켜기
                    </ToggleButton>
                    <ToggleButton value="off" sx={{ gap: 0.5 }} color="error">
                      <PowerSettingsNewIcon fontSize="small" /> 끄기
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <DateTimePicker
                  label="예약 시각"
                  value={scheduledAt}
                  onChange={setScheduledAt}
                  ampm={false}
                  timeSteps={{ minutes: 1 }}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />

                {action === 'on' && (
                  <>
                    <FormControl size="small" fullWidth>
                      <InputLabel>모드</InputLabel>
                      <Select value={mode} label="모드" onChange={(e) => setMode(e.target.value)}>
                        <MenuItem value="cool">냉방</MenuItem>
                        <MenuItem value="dry">제습</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                      <InputLabel>온도</InputLabel>
                      <Select value={temp} label="온도" onChange={(e) => setTemp(e.target.value)}>
                        {TEMPS.map((t) => <MenuItem key={t} value={t}>{t}°C</MenuItem>)}
                      </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                      <InputLabel>바람 세기</InputLabel>
                      <Select value={wind} label="바람 세기" onChange={(e) => setWind(e.target.value)}>
                        <MenuItem value="auto">자동풍</MenuItem>
                        <MenuItem value="low">약풍</MenuItem>
                        <MenuItem value="mid">중풍</MenuItem>
                        <MenuItem value="high">강풍</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                )}

                <Button
                  variant="contained"
                  startIcon={isCreating ? <CircularProgress size={18} color="inherit" /> : <AddAlarmIcon />}
                  onClick={handleSubmit}
                  disabled={isCreating || !scheduledAt?.isValid()}
                  fullWidth
                >
                  {isCreating ? '등록 중...' : '예약 등록'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 예약 목록 */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="예약 목록" />
            <CardContent sx={{ pt: 0 }}>
              {/* 일괄 삭제 컨트롤 */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ sm: 'center' }}
                sx={{ mb: 2 }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteSweepIcon />}
                  disabled={isBulkDeleting}
                  onClick={() => openConfirm(
                    '취소됨 전체 삭제',
                    '취소된 예약 기록을 모두 삭제합니다. 이 작업은 되돌릴 수 없습니다.',
                    { status: 'cancelled' }
                  )}
                >
                  취소됨 전체 삭제
                </Button>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

                <Stack direction="row" spacing={1} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 90 }}>
                    <InputLabel>기간</InputLabel>
                    <Select
                      value={olderThanDays}
                      label="기간"
                      onChange={(e) => setOlderThanDays(e.target.value)}
                    >
                      {DAYS_OPTIONS.map((d) => (
                        <MenuItem key={d} value={d}>{d}일</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    startIcon={<DeleteOutlineIcon />}
                    disabled={isBulkDeleting}
                    onClick={() => openConfirm(
                      `${olderThanDays}일 이전 기록 삭제`,
                      `${olderThanDays}일 이전의 완료·취소된 예약 기록을 삭제합니다. 이 작업은 되돌릴 수 없습니다.`,
                      { older_than_days: olderThanDays }
                    )}
                  >
                    이전 기록 삭제
                  </Button>
                </Stack>
              </Stack>

              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : !schedules?.length ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  등록된 예약이 없습니다.
                </Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>예약 시각</TableCell>
                        <TableCell>동작</TableCell>
                        <TableCell>설정</TableCell>
                        <TableCell align="center">상태</TableCell>
                        <TableCell align="center">취소</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedules.map((s) => {
                        const { label, color } = STATUS_CHIP[s.status] ?? { label: s.status, color: 'default' };
                        return (
                          <TableRow key={s.id} sx={{ opacity: s.status !== 'pending' ? 0.6 : 1 }}>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              {dayjs(s.scheduled_at).format('MM/DD HH:mm')}
                            </TableCell>
                            <TableCell>
                              {s.action === 'on'
                                ? <Chip label="켜기" size="small" color="primary" variant="outlined" />
                                : <Chip label="끄기" size="small" color="error" variant="outlined" />
                              }
                            </TableCell>
                            <TableCell>{getSettingLabel(s)}</TableCell>
                            <TableCell align="center">
                              <Chip label={label} color={color} size="small" />
                            </TableCell>
                            <TableCell align="center">
                              {s.status === 'pending' && (
                                <Tooltip title="예약 취소">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleCancel(s.id)}
                                    disabled={isCancelling}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 확인 다이얼로그 */}
      <Dialog open={confirm.open} onClose={() => setConfirm(CONFIRM_INIT)}>
        <DialogTitle>{confirm.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirm.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(CONFIRM_INIT)}>취소</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirm}
            disabled={isBulkDeleting}
            startIcon={isBulkDeleting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
