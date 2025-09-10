// src/auth/AuthProvider.tsx
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:8080/TeamCProject_final';

interface AuthVO {
  isLoggedIn: boolean;
  email?: string;
  name?: string;
  provider?: string;
  profileImage?: string;
  token?: string;
}

type Provider = 'google' | 'kakao' | 'naver';

interface AuthCtx {
  profile: AuthVO | null;
  isLoggedIn: boolean;
  loginWithProvider: (p: Provider) => Promise<void>;
  checkLogin: () => Promise<void>;
  logout: () => Promise<void>;
  passwordless: (id: string) => Promise<void>; // ← 필수로 선언
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<AuthVO | null>(null);

  // Axios 기본 설정
  axios.defaults.baseURL = BASE_URL;
  axios.defaults.withCredentials = true;

  // 세션 확인
  const checkLogin = async (): Promise<void> => {
    try {
      const { data } = await axios.get<AuthVO>('/api/auth/session');
      setProfile(data.isLoggedIn ? data : null);
    } catch {
      setProfile(null);
    }
  };

  // 소셜 로그인 시작
const loginWithProvider = async (provider: Provider): Promise<void> => {
  window.location.assign(`${BASE_URL}/oauth2/authorization/${provider}`);
};


  // 로그아웃
  const logout = async (): Promise<void> => {
    await axios.post('/api/auth/logout').catch(() => {});
    setProfile(null);
  };

  // 패스워드리스 (엔드포인트는 서버에 맞게 유지)
  const passwordless = async (id: string): Promise<void> => {
    try {
      await axios.post('/login/login', {
        id,
        redirectUri: window.location.origin + '/auth/callback',
      });
      alert('로그인 링크를 보냈습니다. 메일함을 확인하세요.');
    } catch (e) {
      alert('로그인 링크 요청 실패');
    }
  };

  useEffect(() => {
    void checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        isLoggedIn: !!profile?.isLoggedIn,
        loginWithProvider,
        checkLogin,
        logout,
        passwordless,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용하세요.');
  return ctx;
};
