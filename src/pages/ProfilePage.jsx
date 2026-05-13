import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  TextField,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useAuth } from '../hooks/useAuth';
import { useDeleteUser } from '../hooks/useApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useUpdatePassword = (authApi) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (new_password) => {
      const res = await authApi.put('/user/update-password', { new_password });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export default function ProfilePage() {
  const { user, authApi } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const { mutate: updatePassword, isPending: isUpdating, isError: isUpdateError, isSuccess: isUpdateSuccess, error: updateError } = useUpdatePassword(authApi);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { mutate: deleteUser, isPending: isDeleting, isError: isDeleteError, error: deleteError, isSuccess: isDeleteSuccess } = useDeleteUser();

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }
    updatePassword(newPassword);
  };

  const handleDeleteAccount = () => {
    deleteUser();
  };

  // 탈퇴 성공 시 즉시 홈으로 이동 (logout은 useDeleteUser 내부에서 처리)
  if (isDeleteSuccess) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        회원 정보 ({user?.username})
      </Typography>

      <Stack spacing={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              기본 정보
            </Typography>
            <Stack spacing={1} sx={{ ml: 3 }}>
              <Typography variant="body1">
                사용자 ID: <Typography component="span" fontWeight="bold">{user?.id}</Typography>
              </Typography>
              <Typography variant="body1">
                사용자 이름: <Typography component="span" fontWeight="bold" color="primary.main">{user?.username}</Typography>
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card component="form" onSubmit={handlePasswordUpdate}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <KeyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              비밀번호 변경
            </Typography>
            <TextField
              label="새 비밀번호"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {isUpdateError && <Alert severity="error" sx={{ mt: 2 }}>{updateError.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.'}</Alert>}
            {isUpdateSuccess && <Alert severity="success" sx={{ mt: 2 }}>비밀번호가 성공적으로 변경되었습니다.</Alert>}
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
              disabled={isUpdating || newPassword.length < 8}
              startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isUpdating ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="error">
              <DeleteForeverIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              회원 탈퇴
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 2 }}
              onClick={() => setOpenDeleteDialog(true)}
              disabled={isDeleting}
            >
              회원 탈퇴하기
            </Button>
          </CardContent>
        </Card>
      </Stack>

      {/* 회원 탈퇴 확인 다이얼로그 */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle color="error">{"계정 영구 삭제 확인"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말로 계정을 삭제하시겠습니까? 모든 정보가 영구적으로 삭제됩니다.
          </DialogContentText>
          {isDeleteError && <Alert severity="error" sx={{ mt: 1 }}>{deleteError.response?.data?.message || '탈퇴 중 오류가 발생했습니다.'}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} disabled={isDeleting}>취소</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            autoFocus
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteForeverIcon />}
          >
            {isDeleting ? '삭제 중...' : '확인하고 삭제'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
