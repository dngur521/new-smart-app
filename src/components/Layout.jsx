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
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';
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
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { Menu, MenuItem } from '@mui/material';

import { useAuth } from '../hooks/useAuth';
import { useLogout } from '../hooks/useApi';
import { useColorMode } from '../context/ThemeContext';
import ChatBot from './ChatBot';

const drawerWidth = 240;

// requiresAuth: true인 항목은 비로그인 시 사이드바에서 숨김
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

const themeMenuOptions = [
  { value: 'light', label: '라이트', icon: <LightModeIcon fontSize="small" /> },
  { value: 'dark', label: '다크', icon: <DarkModeIcon fontSize="small" /> },
  { value: 'system', label: '시스템 설정', icon: <SettingsBrightnessIcon fontSize="small" /> },
];

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMenuAnchor, setThemeMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { colorMode, setColorMode } = useColorMode();

  const currentThemeOption = themeMenuOptions.find(o => o.value === colorMode);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    if (isMobile) handleDrawerToggle();
  };

  const drawerContent = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => {
            if (item.requiresAuth && !isAuthenticated) return null;
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
                      '& .MuiListItemIcon-root': { color: 'white' },
                      '&:hover': { backgroundColor: 'primary.dark' },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}

          <Box sx={{ px: 2, pt: 2 }}>
            {isLoading ? (
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <CircularProgress size={20} />
                <Typography variant="caption">인증 확인 중...</Typography>
              </Stack>
            ) : isAuthenticated ? (
              <Stack spacing={1}>
                <ListItemButton
                  component={RouterLink}
                  to="/user/profile"
                  selected={location.pathname === '/user/profile'}
                  onClick={isMobile ? handleDrawerToggle : undefined}
                >
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText primary={`프로필 (${user?.username})`} />
                </ListItemButton>
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
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              color="inherit"
              onClick={(e) => setThemeMenuAnchor(e.currentTarget)}
              size="small"
            >
              {currentThemeOption?.icon}
            </IconButton>
            <Menu
              anchorEl={themeMenuAnchor}
              open={Boolean(themeMenuAnchor)}
              onClose={() => setThemeMenuAnchor(null)}
            >
              {themeMenuOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  selected={colorMode === option.value}
                  onClick={() => { setColorMode(option.value); setThemeMenuAnchor(null); }}
                >
                  <ListItemIcon>{option.icon}</ListItemIcon>
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </Stack>

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

      {/* 모바일: 오버레이 Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // 마운트 유지로 모바일 열기 성능 개선
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 데스크탑: 고정 Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          ml: { md: `${drawerWidth}px` }, // permanent Drawer는 content를 밀지 않으므로 직접 마진 지정
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
        <Box component="footer" sx={{ textAlign: 'center', py: 2, mt: 4, color: 'text.secondary' }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} SmartApp. All rights reserved.
          </Typography>
        </Box>
      </Box>
      <ChatBot />
    </Box>
  );
}

export default Layout;
