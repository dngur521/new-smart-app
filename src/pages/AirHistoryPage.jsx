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
  Chip,
} from '@mui/material';
import { useAirHistory } from '../hooks/useApi';
import { getCommandDescription } from '../utils/commandUtils';
import dayjs from 'dayjs';


/**
 * 에어컨 제어 기록 페이지
 * (기존 AirHistApp.jsx, AirHistList.jsx 대체)
 * MUI Table, Pagination 및 React Query 훅 사용
 */
export default function AirHistoryPage() {
  const [page, setPage] = useState(0); // MUI Pagination은 0부터 시작
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // React Query 훅 사용 (API 페이지는 1부터 시작하므로 +1)
  const { data, isLoading, isError, error } = useAirHistory(page + 1, rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // 페이지 당 행 수 변경 시 1페이지로 리셋
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        에어컨 제어 기록
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
              <Table stickyHeader aria-label="aircon history table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      #
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>명령어</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      아두이노 응답
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      시간
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.data.map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell>{getCommandDescription(row.command)}</TableCell>
                      <TableCell align="center">
                        <Chip label={row.response || 'N/A'} size="small" />
                      </TableCell>
                      <TableCell align="right">{dayjs(row.timestamp).format('YY/MM/DD HH:mm')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
          </>
        )}
      </Paper>
    </Box>
  );
}
