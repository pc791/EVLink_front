import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BASE_URL } from './constants';

interface User {
  usercode: number;
  id: string;
  uname: string;
  img: string;
  currentTime: string;
  currentMonth: string;
  memostatus: number;
}

interface AuthContextProps {
  user: User | null;
  isLoggedIn: boolean;
  checkLogin: () => Promise<void>;
  logout: () => Promise<void>;

  // 우리가 쓰는 로그인 방식들
  loginWithProvider: (provider: 'google' | 'naver' | 'kakao' | 'facebook') => void;
  sendMagicLinkById: (id: string) => Promise<void>;

  // 상태 업데이트 유틸
  updateUserName: (name: string) => void;
  updateImgName: (img: string) => void;
  updateMemostatus: (memostatus: number) => void;
  updateCurrentTime: (currentTime: string) => void;
  updateCurrentMonth: (currentMonth: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  //  소셜 로그인 시작
  const loginWithProvider = (provider: 'google' | 'naver' | 'kakao' | 'facebook') => {
    const redirect = encodeURIComponent(window.location.origin + '/auth/callback');
    window.location.href = `${BASE_URL}/oauth2/authorization/${provider}?redirect_uri=${redirect}`;
  };

  // 아이디 기반 링크 passwordless
  const sendMagicLinkById = async (id: string): Promise<void> => {
    await axios.post(
      `${BASE_URL}/signin/link`,
      { id, redirectUri: window.location.origin + '/auth/callback' },
      { withCredentials: true }
    );
    alert('로그인 링크를 보냈습니다. 메일함(또는 SMS)을 확인하세요.');
  };

  // 세션 확인
  const checkLogin = async (): Promise<void> => {
    try {
      const res = await axios.get(`${BASE_URL}/signin/session`, { withCredentials: true });
      const payload = res.data?.data ?? res.data;

      if (payload?.id) {
        setUser(payload);
        updateUserName(payload.uname ?? payload.name ?? '');
        updateImgName(payload.img ?? '');
        updateMemostatus(payload.memostatus ?? 0);
        updateCurrentTime(res.data?.currentTime ?? payload.currentTime ?? '');
        updateCurrentMonth(res.data?.currentMonth ?? payload.currentMonth ?? '');
      } else {
        setUser(null);
        updateUserName('');
        updateImgName('');
        updateMemostatus(0);
        updateCurrentTime('');
        updateCurrentMonth('');
      }
    } catch {
      setUser(null);
      updateUserName('');
      updateImgName('');
      updateMemostatus(0);
      updateCurrentTime('');
      updateCurrentMonth('');
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  // 로그아웃
  const logout = async (): Promise<void> => {
    await axios.get(`${BASE_URL}/signin/dosignout`, { withCredentials: true });
    setUser(null);
  };

  // 상태 업데이트 유틸 함수들
  const updateUserName = (uname: string) => setUser(prev => (prev ? { ...prev, uname } : prev));
  const updateImgName = (img: string) => setUser(prev => (prev ? { ...prev, img } : prev));
  const updateMemostatus = (memostatus: number) => setUser(prev => (prev ? { ...prev, memostatus } : prev));
  const updateCurrentTime = (currentTime: string) => setUser(prev => (prev ? { ...prev, currentTime } : prev));
  const updateCurrentMonth = (currentMonth: string) => setUser(prev => (prev ? { ...prev, currentMonth } : prev));

  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        checkLogin,
        logout,
        loginWithProvider,   // sns 
        sendMagicLinkById,   // passwordless
        updateUserName,
        updateImgName,
        updateMemostatus,
        updateCurrentTime,
        updateCurrentMonth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthContext는 AuthProvider 안에서만 사용해야 합니다.');
  return context;
};