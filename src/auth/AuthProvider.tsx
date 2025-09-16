// src/auth/AuthProvider.tsx
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import  { BASE_URL } from './constants';
// const BASE_URL = 'http://localhost:8080/EVLink_backend-main';

//  첫 요청 전에 적용되도록 파일 최상단에서 설정
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

interface AuthVO {
  isLoggedIn: boolean;
  email?: string;
  name?: string;
  provider?: string;
  profile?: string;
  userId?: string;
  userTp?: string;
}
type Provider = 'google' | 'kakao' | 'naver';

interface AuthCtx {
  profile: AuthVO | null;
  isLoggedIn: boolean;
  loginWithProvider: (p: Provider) => Promise<void>;
  checkLogin: () => Promise<void>;
  logout: () => Promise<void>;
  passwordless: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<AuthVO | null>(null);

  // 세션 확인
  const checkLogin = useCallback(async () => {
    try {
      const { data } = await axios.get<AuthVO>('/api/auth/session');
      setProfile(data?.isLoggedIn ? data : null);
    } catch {
      setProfile(null);
    }
  }, []);

  // 소셜 로그인 시작 (서버 OAuth 엔드포인트로 이동)
  const loginWithProvider = async (provider: Provider) => {
    window.location.assign(`${BASE_URL}/oauth2/authorization/${provider}`);
  };

  // 로그아웃 후 즉시 세션 재확인
  const logout = useCallback(async () => {
    try { await axios.post('/api/auth/logout'); } catch {}
    await checkLogin();
  }, [checkLogin]);

  // 선택: 패스워드리스
  const passwordless = async (id: string) => {
    try {
      await axios.post('/login/Login', {
        id,
        redirectUri: window.location.origin + '/auth/callback',
      });
    } catch {
      console.log('로그인 실패');
    }
  };

  // 앱 시작/포커스 시 세션 동기화
  useEffect(() => {
    void checkLogin();
    const onVisible = () => { if (document.visibilityState === 'visible') void checkLogin(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [checkLogin]);

  const isLoggedIn = !!profile?.isLoggedIn;

  return (
    <AuthContext.Provider value={{ profile, isLoggedIn, loginWithProvider, checkLogin, logout, passwordless }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용하세요.');
  return ctx;
};
