import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Grid,
  Alert,
  Stack,
  LinearProgress,
  Divider
} from '@mui/material';
import { useSystemStats } from '../hooks/useApi';

function LabeledLinearProgress({ label, value, total, unit, percent }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: '80px' }}>
          {label}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
        />
        <Typography variant="body1" sx={{ minWidth: '120px', textAlign: 'right', fontWeight: 'bold' }}>
          {total ? `${value} / ${total} ${unit}` : `${value} ${unit}`}
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ pl: '80px' }}>
        ({percent.toFixed(1)}%)
      </Typography>
    </Box>
  );
}

function InfoRow({ label, value, unit }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body1" fontWeight="bold">{value} {unit}</Typography>
    </Stack>
  );
}

export default function SystemInfoPage() {
  const { data, isLoading, isError, error, isFetching } = useSystemStats();

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">시스템 모니터링 (Pi 2)</Typography>
        {isFetching && !isLoading && <CircularProgress size={24} />}
      </Stack>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress size={60} />
            </Box>
          )}
          {isError && <Alert severity="error">오류: {error.message}</Alert>}
          {data && (
            <Card>
              <CardContent>
                {/* CPU */}
                <Typography variant="h6" gutterBottom>CPU</Typography>
                <LabeledLinearProgress label="사용률" value={data.cpu_usage} unit="%" percent={data.cpu_usage} />
                <InfoRow label="온도" value={data.cpu_temp} unit="C" />

                <Divider sx={{ my: 3 }} />

                {/* RAM */}
                <Typography variant="h6" gutterBottom>RAM</Typography>
                <LabeledLinearProgress label="사용량" value={data.ram_used_mb} total={data.ram_total_mb} unit="MB" percent={data.ram_percent} />

                <Divider sx={{ my: 3 }} />

                {/* Storage & Network */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>Storage (sda)</Typography>
                    <LabeledLinearProgress label="사용량" value={data.disk_used_gb} total={data.disk_total_gb} unit="GB" percent={data.disk_percent} />
                    <InfoRow label="온도" value={data.ssd_temp} unit="" />
                    <InfoRow label="Disk Read" value={data.disk_read_mb} unit="MB/s" />
                    <InfoRow label="Disk Write" value={data.disk_write_mb} unit="MB/s" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>Network (eth0)</Typography>
                    <InfoRow label="Download" value={data.net_download_mb} unit="MB/s" />
                    <InfoRow label="Upload" value={data.net_upload_mb} unit="MB/s" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
