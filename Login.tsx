import React from 'react';
import { useAuth } from 'auth/AuthProvider';
import styles from './Login.module.css';
export default function Login() {
  const { profile, isLoggedIn, loginWithProvider, logout, checkLogin, passwordless } = useAuth();

  // 화면 전체 중앙 배치
  const pageContainer: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f9fafb',
  };

  // 카드 컨테이너
  const card: React.CSSProperties = {
    fontFamily: 'sans-serif',
    padding: 20,
    maxWidth: 420,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  // lane (버튼/구분선 공통 폭)
  const lane: React.CSSProperties = {
    width: '70%',
    maxWidth: 360,
    minWidth: 240,
    margin: '0 auto',
  };

  // 텍스트 버튼
  const textButton: React.CSSProperties = {
    width: '100%',
    height: 45,
    border: '1px solid #ccc',
    borderRadius: 6,
    background: '#f5f5f5',
    cursor: 'pointer',
    fontSize: 14,
  };

  // 이미지 버튼
  const imageButton: React.CSSProperties = {
    width: '100%',
    height: 45,
    border: '1px solid #ccc',
    borderRadius: 6,
    background: '#f5f5f5',
    padding: 0,
    overflow: 'hidden',
    cursor: 'pointer',
  };

  const imgFit: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  // 로그인 상태가 아니면 로그인 화면 표시
  if (profile === null && !isLoggedIn) {
    return (
      <div style={pageContainer}>
        <div style={card}>
          <h2 style={{ marginBottom: 16, textAlign: 'center', width: '100%' }}>Login</h2>

          {/* 패스워드리스 */}
          <div style={lane}>
            <button style={textButton} onClick={() => passwordless('')}>
              Passwordless
            </button>
          </div>

          {/* 구분선 */}
          <div style={{ ...lane, display: 'flex', alignItems: 'center', margin: '16px auto' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
            <span style={{ margin: '0 8px', color: '#666', fontSize: 14 }}>또는</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
          </div>

          {/* 소셜 로그인 */}
          <div style={{ ...lane, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button style={imageButton} onClick={() => loginWithProvider('google')}>
              <img src="/images/google_login.png" alt="Google 로그인" style={imgFit} />
            </button>

            <button style={imageButton} onClick={() => loginWithProvider('kakao')}>
              <img src="/images/kakao_login.png" alt="Kakao 로그인" style={imgFit} />
            </button>

            <button style={imageButton} onClick={() => loginWithProvider('naver')}>
              <img src="/images/naver_login.png" alt="Naver 로그인" style={imgFit} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 로그인 상태인 경우 내 프로필 화면 표시
  return (
    <div style={pageContainer}>
      <div style={card}>
        <h2 style={{ marginBottom: 16, textAlign: 'center', width: '100%' }}>내 프로필</h2>

        <div style={{ ...lane, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          {profile?.profileImage && (
            <img
              src={profile.profileImage}
              alt="avatar"
              style={{ width: 40, height: 40, borderRadius: '50%' }}
            />
          )}
          <div>
            <strong>{profile?.name}</strong>
            <div style={{ fontSize: 14, color: '#555' }}>
              {profile?.email} · {profile?.provider}
            </div>
          </div>
        </div>

        <div style={{ ...lane, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={textButton} onClick={checkLogin}>
            세션 새로고침
          </button>
          <button style={textButton} onClick={logout}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
