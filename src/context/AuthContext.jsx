import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const AuthContext = createContext(null);

// withCredentials: true → 브라우저가 HttpOnly 쿠키를 자동으로 요청에 포함
const authApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const { mutate: fetchUserProfile } = useMutation({
    mutationFn: async () => {
      const { data } = await authApi.get('/user/profile');
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setIsAuthenticated(true);
    },
    onError: () => {
      logout();
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const refreshAccessToken = useCallback(async () => {
    // refresh_token_cookie가 withCredentials로 자동 전송됨
    await axios.post('/api/auth/refresh', {}, { withCredentials: true });
  }, []);

  useEffect(() => {
    let isRefreshing = false;
    let pendingRequests = [];

    const responseInterceptor = authApi.interceptors.response.use(
      response => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // 이미 refresh 중이면 완료될 때까지 대기 후 재시도
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              pendingRequests.push({ resolve, reject });
            })
              .then(() => authApi(originalRequest))
              .catch(err => Promise.reject(err));
          }

          isRefreshing = true;
          try {
            await refreshAccessToken();
            pendingRequests.forEach(({ resolve }) => resolve());
            pendingRequests = [];
            isRefreshing = false;
            return authApi(originalRequest);
          } catch (err) {
            pendingRequests.forEach(({ reject }) => reject(err));
            pendingRequests = [];
            isRefreshing = false;
            logout();
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      authApi.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshAccessToken, logout]);

  // 페이지 로드 시 항상 프로필 조회로 인증 상태 확인 (쿠키가 있으면 자동 전송)
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const contextValue = {
    isAuthenticated,
    user,
    isLoading,
    authApi,
    logout,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
