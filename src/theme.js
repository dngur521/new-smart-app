import { createTheme } from '@mui/material/styles';
import { koKR } from '@mui/material/locale';

// Material Design 라이트 테마를 생성합니다.
const theme = createTheme(
    {
        palette: {
            mode: 'light',
            primary: {
                main: '#1976d2', // Google Material Blue
            },
            secondary: {
                main: '#dc004e', // Google Material Pink
            },
            background: {
                default: '#f4f6f8',
                paper: '#ffffff',
            },
        },
        typography: {
            fontFamily: '"Pretendard", system-ui, Avenir, Helvetica, Arial, sans-serif',
            h4: {
                fontWeight: 700,
                marginBottom: '1rem',
            },
            h6: {
                fontWeight: 700,
            },
        },
        components: {
            // 카드(Paper) 컴포넌트에 기본 그림자와 둥근 모서리 적용
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    },
                },
            },
            // 버튼 둥근 모서리
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none', // 'SEND' 대신 'Send'
                        fontWeight: 700,
                    },
                },
            },
        },
    },
    koKR // MUI 컴포넌트 한국어 로케일 (예: TablePagination)
);

export default theme;
