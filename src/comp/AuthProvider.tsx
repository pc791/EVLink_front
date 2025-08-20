//comp/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
interface Member {
  userid: string;
  name: string;
  email: string;
}
interface AuthContextProps {
  member: Member | null;
  checkLogin: () => void;
  isLoggedIn: boolean;
  login: (userid: string, password: string) => Promise<'success' | 'fail' | 'error'>;
  logout: () => void;
  updateMemberName: (name: string) => void;
  updateMemberEmail: (email: string) => void;
  //로딩을 추가해서 checkLogin()이 끝날 때까지 기다리기 위한 기능
  loading: boolean;
}
// 1단계: Context 생성
const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [member, setMember] = useState<Member | null>(null);
  //추가
  const [loading, setLoading] = useState(true);
  //로그인 상태를 체크 해주는 함수
  const checkLogin = async () => {
    try {
      // withCredentials: true
      // backend에서도 .allowCredentials(true) 를 설정해야 함.(세션을 사용해서 동기화 할때 사용 )
      const res = await axios.get('http://192.168.0.92/myictstudy0521/api/login/session', {
        withCredentials: true
      });
      if (res.data?.userid) {
        setMember(res.data); // 로그인 된 정보를 받아서 useState에 저장한다.
      } else {
        setMember(null); //로그인 상태가 아니라면 useState를 초기화 
      }
    } catch {
      setMember(null); // 문제가 발생해도 초기화      
    } finally {
      //로그인정보를 받아오던지, 안받아 오던지 여기는 무조건 실행이 끝났다고 초기화하는 목적
      //RequireAuth.tsx 에서 loading = true 인 동안은 화면을 안 바꾸고 대기하고 있다가
      //loading = false 가 된 후 member가 null인지 아닌지를 판단해서 라우팅처리를 해라 라고 설정 될것이다
      setLoading(false);
    }
  };

  const login = async (userid: string, password: string): Promise<'success' | 'fail' | 'error'> => {
    try {
      const res = await axios.post(
        'http://192.168.0.92/myictstudy0521/api/login/dologin',
        { userid, password }, { withCredentials: true }
      );
      if (res.data === 'success') {
        await checkLogin(); // 로그인 성공 후 세션 정보 불러오기
        return 'success';
      } else {
        return 'fail';
      }
    } catch {
      return 'error';
    }
  };


  const logout = async () => {
    //window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_REST_API_KEY}&logout_redirect_uri=${encodeURIComponent(KAKAO_LOGOUT_REDIRECT_URI)}`;
    const KAKAO_REST_API_KEY = '0e2d58eb1e83daca8387836c7b4c6814';
    const KAKAO_LOGOUT_REDIRECT_URI = 'http://192.168.0.92:3000/login';
    try {
      await axios.get('http://192.168.0.92/myictstudy0521/api/login/dologout', {
        withCredentials: true
      });
      // 스토리지 삭제 - 카카오 
      localStorage.removeItem('kakao_id_token');
      sessionStorage.clear();
      window.Kakao.Auth.setAccessToken(null);
      setMember(null);
      // 카카오 로그아웃 인증삭제
      //https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#logout-of-service-and-kakaoaccount-sample
      window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_REST_API_KEY}&logout_redirect_uri=${encodeURIComponent(KAKAO_LOGOUT_REDIRECT_URI)}`;
    } catch (error) {
      console.error('카카오 로그아웃 실패', error);
    }
  };

  //새로 고침을 해도 초기화로 checkLogin() 을 호출해서 유지 시킨다.
  useEffect(() => {
    checkLogin();
  }, []);
  const updateMemberName = (name: string) => {
    setMember(prev => (prev ? { ...prev, name } : prev));
  };
  const updateMemberEmail = (email: string) => {
    setMember(prev => (prev ? { ...prev, email } : prev));
  };
  const isLoggedIn = member !== null;
  // 2단계: Context에 값 제공
  return (
    <AuthContext.Provider value={{
      member,
      isLoggedIn,
      checkLogin,
      login,
      logout,
      updateMemberName,
      updateMemberEmail,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
// 3단계: useAuth() 에서 값을 사용할 수 있도록 제공
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthContext 은 AuthProvider  안에서만 사용해야 합니다.');
  return context;
};
// 1단계: Context 생성
// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// // 2단계: Context에 값 제공
// <AuthContext.Provider value={{ member, setMember, login, logout, checkLogin }}>
//   {children}
// </AuthContext.Provider>

// // 3단계: useAuth() 에서 값을 사용할 수 있도록 제공공
// const context = useContext(AuthContext);
/*
useContext는 createContext()로 만든 전역 데이터를 하위 컴포넌트 어디에서든 꺼내 쓸 수 있도록 해주는 훅.
즉, AuthContext.Provider가 제공하는 값 (member, login, logout 등)을 받아오는 역할을 하는 것이다.
*/
