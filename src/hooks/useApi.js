import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import axios from 'axios';

export const useSensorData = () => {
    const { authApi, isAuthenticated } = useAuth();
    return useQuery({
        queryKey: ['sensorData'],
        queryFn: async () => {
            const res = await authApi.get('/arduino/dht-sensor');
            if (res.data.status !== 'success') throw new Error(res.data.message || 'Failed to fetch sensor data');
            return res.data;
        },
        refetchInterval: 5000,
        staleTime: 1000,
        enabled: isAuthenticated,
    });
};

export const useAirHistory = (page, rowsPerPage) => {
    const { authApi, isAuthenticated } = useAuth();
    return useQuery({
        queryKey: ['airHistory', page, rowsPerPage],
        queryFn: async () => {
            const res = await authApi.get('/arduino/aircon-history', { params: { page, limit: rowsPerPage } });
            if (res.data.status !== 'success') throw new Error(res.data.message || 'Failed to fetch history');
            return res.data;
        },
        placeholderData: (previousData) => previousData,
        enabled: isAuthenticated,
    });
};

export const useTempHistory = (page, rowsPerPage) => {
    const { authApi } = useAuth();
    return useQuery({
        queryKey: ['tempHistory', page, rowsPerPage],
        queryFn: async () => {
            const res = await authApi.get('/arduino/dht-history', { params: { page, limit: rowsPerPage } });
            if (res.data.status !== 'success') throw new Error(res.data.message || 'Failed to fetch history');
            return res.data;
        },
        placeholderData: (previousData) => previousData,
        enabled: !!authApi,
    });
};

const postCommand = async ({ command, authApi }) => {
    const res = await authApi.post(`/arduino/send-command`, { command });
    const data = res.data;
    if (data.status !== 'success') throw new Error(data.message || 'Failed to send command');
    return data;
};

export const useSendCommand = () => {
    const queryClient = useQueryClient();
    const { authApi } = useAuth();

    return useMutation({
        mutationFn: (command) => postCommand({ command, authApi }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['airHistory'] });
        },
    });
};

export const useLogin = () => {
    const { fetchUserProfile } = useAuth();

    return useMutation({
        mutationFn: async ({ username, password }) => {
            // withCredentials: true → 백엔드가 내려주는 HttpOnly 쿠키를 브라우저가 저장
            const res = await axios.post('/api/auth/login', { username, password }, { withCredentials: true });
            return res.data;
        },
        onSuccess: () => {
            fetchUserProfile();
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: async ({ username, password }) => {
            const res = await axios.post('/api/auth/register', { username, password });
            return res.data;
        },
    });
};

export const useLogout = () => {
    const { logout } = useAuth();

    return useMutation({
        mutationFn: async () => {
            // withCredentials: true → refresh_token_cookie를 백엔드로 전송해 서버에서 쿠키 삭제
            await axios.post('/api/auth/logout', {}, { withCredentials: true });
        },
        onSuccess: () => {
            logout();
        },
        onError: () => {
            // 서버 요청 실패해도 클라이언트 상태는 초기화
            logout();
        },
    });
};

export const useDeleteUser = () => {
    const { authApi, logout } = useAuth();

    return useMutation({
        mutationFn: async () => {
            const res = await authApi.delete('/user/delete');
            return res.data;
        },
        onSuccess: () => {
            logout();
        },
    });
};

export const useWeather = () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const city = import.meta.env.VITE_WEATHER_CITY || 'Seoul';
    return useQuery({
        queryKey: ['weather', city],
        queryFn: async () => {
            const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: { q: city, appid: apiKey, units: 'metric', lang: 'kr' },
            });
            return res.data;
        },
        refetchInterval: 10 * 60 * 1000,
        staleTime: 5 * 60 * 1000,
        enabled: !!apiKey,
        retry: 1,
    });
};

export const useTodayTempHistory = () => {
    const { authApi, isAuthenticated } = useAuth();
    return useQuery({
        queryKey: ['todayTempHistory'],
        queryFn: async () => {
            const res = await authApi.get('/arduino/dht-history/today');
            if (res.data.status !== 'success') throw new Error(res.data.message || 'Failed to fetch today history');
            return res.data;
        },
        refetchInterval: 5 * 60 * 1000,
        enabled: isAuthenticated,
    });
};

export const useSeekPage = (endpoint) => {
    const { authApi } = useAuth();
    return useMutation({
        mutationFn: async ({ timestamp, limit }) => {
            const res = await authApi.get(endpoint, { params: { timestamp, limit } });
            if (res.data.status !== 'success') throw new Error(res.data.message || 'Failed to seek page');
            return res.data;
        },
    });
};

const fetchSystemStats = async (authApi) => {
    const res = await authApi.get('/system/stats');
    if (res.status !== 200) throw new Error('Network response was not ok');
    const data = res.data;
    if (data.status !== 'success') throw new Error(data.message || 'Failed to fetch system stats');
    return data.data;
};

export const useSystemStats = () => {
    const { authApi } = useAuth();

    return useQuery({
        queryKey: ['systemStats'],
        queryFn: () => fetchSystemStats(authApi),
        refetchInterval: 3000,
        staleTime: 1000,
        enabled: !!authApi,
    });
};
