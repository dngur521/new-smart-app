import { Typography, Paper, Box } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

/**
 * 홈 페이지 (기존 Home.jsx 대체)
 */
export default function HomePage() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <HomeRoundedIcon sx={{ fontSize: 100, color: 'primary.main' }} />
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Smart Home
      </Typography>
      <Typography variant="h6" color="text.secondary">
        좌측 메뉴를 통해 에어컨 제어 및 상태 확인이 가능합니다.
      </Typography>
    </Paper>
  );
}
