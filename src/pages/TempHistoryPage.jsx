import React, { useState } from 'react';
import {
  Box,
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
import { useTempHistory } from '../hooks/useApi';
import dayjs from 'dayjs';

export default function TempHistoryPage() {
  const [page, setPage] = useState(0); // MUI는 0-based, API는 1-based
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [goToInput, setGoToInput] = useState('');

  const { data, isLoading, isError, error } = useTempHistory(page + 1, rowsPerPage);

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        온습도 기록
      </Typography>
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
                      <TableCell align="right">{dayjs(row.timestamp).format('YY/MM/DD HH:mm')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
          </>
        )}
      </Paper>
    </Box>
  );
}
