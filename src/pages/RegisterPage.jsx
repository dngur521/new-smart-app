import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Link as MuiLink,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useRegister } from '../hooks/useApi';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { mutate: register, isPending, isError, error, isSuccess } = useRegister();

  useEffect(() => {
    // 회원가입 성공 시 2초 후 로그인 페이지로 이동
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/auth/login', { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ username, password });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Stack spacing={2} alignItems="center">
          <PersonAddIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            회원가입
          </Typography>
        </Stack>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="사용할 사용자 이름"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="비밀번호"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.response?.data?.message || '회원가입 중 오류가 발생했습니다.'}
            </Alert>
          )}
          {isSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              회원가입 성공! 2초 후 로그인 페이지로 이동합니다.
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isPending ? '등록 중...' : '가입하기'}
          </Button>

          <MuiLink href="/auth/login" variant="body2" component={RouterLink} to="/auth/login">
            이미 계정이 있으신가요? 로그인
          </MuiLink>
        </Box>
      </Paper>
    </Box>
  );
}