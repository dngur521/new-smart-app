import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  CssBaseline,
  Button, // 1. Button 추가
  CircularProgress, // 2. 로딩 스피너 추가
  Stack, // 3. 스택 추가
} from '@mui/material';
// 4. 아이콘 추가
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import HistoryIcon from '@mui/icons-material/History';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import BarChartIcon from '@mui/icons-material/BarChart';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import VideocamIcon from '@mui/icons-material/Videocam';
import ComputerIcon from '@mui/icons-material/Computer';
import TerminalIcon from '@mui/icons-material/Terminal';
// ------------------------------------

import { useAuth } from '../hooks/useAuth'; // 5. useAuth 훅 import
import { useLogout } from '../hooks/useApi'; // 6. useLogout 훅 import


const drawerWidth = 240; // 사이드바 너비

// 메뉴 아이템 정의
const menuItems = [
  { text: '홈', icon: <HomeIcon />, path: '/', requiresAuth: false },
  { text: '에어컨 제어', icon: <AcUnitIcon />, path: '/aircon/control', requiresAuth: true },
  { text: '실시간 온습도', icon: <DeviceThermostatIcon />, path: '/temp/check', requiresAuth: true },
  { text: 'CCTV', icon: <VideocamIcon />, path: '/cctv', requiresAuth: true },
  { text: '제어 기록', icon: <HistoryIcon />, path: '/aircon/history', requiresAuth: true },
  { text: '온습도 기록', icon: <BarChartIcon />, path: '/temp/history', requiresAuth: true },
  { text: '시스템 정보', icon: <ComputerIcon />, path: '/system', requiresAuth: true },
  { text: '시스템 콘솔', icon: <TerminalIcon />, path: '/console', requiresAuth: true },
];

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  // 7. 인증 훅 사용
  const { isAuthenticated, user, isLoading } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout(); 

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // 로그아웃 핸들러
  const handleLogout = () => {
    // 서버에 무효화 요청 후 클라이언트 토큰 삭제
    logout();
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  // Drawer (사이드바)에 표시될 컨텐츠
  const drawerContent = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => {
            // 8. 로그인 상태에 따라 메뉴 표시 결정
            if (item.requiresAuth && !isAuthenticated) {
                return null;
            }
            return (
                <ListItem key={item.text} disablePadding>
                <ListItemButton
                    component={RouterLink}
                    to={item.path}
                    selected={location.pathname === item.path}
                    onClick={isMobile ? handleDrawerToggle : undefined}
                    sx={{
                    borderRadius: '0 100px 100px 0',
                    marginRight: '10px',
                    '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '& .MuiListItemIcon-root': {
                        color: 'white',
                        },
                        '&:hover': {
                        backgroundColor: 'primary.dark',
                        },
                    },
                    }}
                >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
                </ListItem>
            );
          })}

          {/* 9. 로그인/로그아웃 버튼 추가 */}
          <Box sx={{ px: 2, pt: 2 }}>
            {isLoading ? (
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                    <CircularProgress size={20} />
                    <Typography variant="caption">인증 확인 중...</Typography>
                </Stack>
            ) : isAuthenticated ? (
              <Stack spacing={1}>
                {/* 프로필 링크 */}
                <ListItemButton
                    component={RouterLink}
                    to="/user/profile"
                    selected={location.pathname === '/user/profile'}
                    onClick={isMobile ? handleDrawerToggle : undefined}
                >
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary={`프로필 (${user?.username})`} />
                </ListItemButton>
                {/* 로그아웃 버튼 */}
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  startIcon={isLoggingOut ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon />}
                >
                  {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                </Button>
              </Stack>
            ) : (
              <Button
                fullWidth
                variant="contained"
                startIcon={<LoginIcon />}
                component={RouterLink}
                to="/auth/login"
                onClick={isMobile ? handleDrawerToggle : undefined}
              >
                로그인
              </Button>
            )}
          </Box>
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Smart Home Dashboard
          </Typography>
          {/* 10. 데스크탑 헤더에 로그인/사용자 정보 표시 */}
          {!isMobile && (
              <Stack direction="row" spacing={2} alignItems="center">
                  {isLoading ? (
                      <CircularProgress color="inherit" size={24} />
                  ) : isAuthenticated ? (
                      <>
                          <Typography variant="subtitle1">
                              환영합니다, {user?.username}님!
                          </Typography>
                          <Button 
                              color="inherit" 
                              onClick={handleLogout} 
                              disabled={isLoggingOut}
                              startIcon={isLoggingOut ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon />}
                          >
                            로그아웃
                          </Button>
                      </>
                  ) : (
                      <Button 
                          color="inherit" 
                          component={RouterLink} 
                          to="/auth/login" 
                          startIcon={<LoginIcon />}
                      >
                          로그인
                      </Button>
                  )}
              </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* ... (기존 Drawer 코드) ... */}
      
      {/* Mobile Drawer (Temporary) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer (Permanent) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              backgroundColor: '#fdfdfd',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>


      {/* 메인 컨텐츠 영역 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          // 1. 너비는 100%를 유지하거나, flexGrow: 1에 맡깁니다.
          width: '100%', 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          
          // 2. 핵심 수정: 데스크탑(md) 이상에서 왼쪽 마진을 줍니다.
          // 이 마진이 사이드바가 차지하는 공간입니다.
          ml: { md: `${drawerWidth}px` }, 
          
          // 3. (선택적) AppBar가 차지하는 높이만큼 상단 패딩을 조정할 수도 있습니다.
          // pt: { xs: 8, md: 10 } // 만약 Toolbar만으로 부족하다면
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}>{children}</Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            textAlign: 'center',
            py: 2,
            mt: 4,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} SmartApp. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;