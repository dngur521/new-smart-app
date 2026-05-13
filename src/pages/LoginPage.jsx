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
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useLogin, useLogout } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { mutate: login, isPending, isError, error, isSuccess } = useLogin();
  // 로그아웃 뮤테이션을 가져옵니다. (로그인 페이지에서 사용하지는 않지만 참고)
  // const { mutate: logout } = useLogout(); 

  useEffect(() => {
    // 이미 로그인되어 있으면 홈으로 이동
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);


  const handleSubmit = (e) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Stack spacing={2} alignItems="center">
          <LockOpenIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            로그인
          </Typography>
        </Stack>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="사용자 이름"
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
              {error.response?.data?.message || '로그인 중 오류가 발생했습니다.'}
            </Alert>
          )}
          {isSuccess && !isAuthenticated && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              로그인 성공, 프로필 로드 중...
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isPending ? '로그인 중...' : '로그인'}
          </Button>
          <MuiLink href="/auth/register" variant="body2" component={RouterLink} to="/auth/register">
            계정이 없으신가요? 회원가입
          </MuiLink>
        </Box>
      </Paper>
    </Box>
  );
}