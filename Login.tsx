import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'auth/AuthProvider';
import styles from './Login.module.css';

export default function Login() {
  const { isLoggedIn, loginWithProvider, logout, checkLogin, passwordless, profile } = useAuth();
  const navigate = useNavigate();

  // 첫 진입 시 세션 동기화(깜빡임 줄이기)
  useEffect(() => { void checkLogin(); }, [checkLogin]);

  // 로그인 상태면 로그인 페이지에 머무르지 않고 홈으로 이동
  useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true });
  }, [isLoggedIn, navigate]);

  // 로그인 전 UI
  if (!isLoggedIn) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h2 className={styles.title}>Login</h2>

          {/* 패스워드리스 */}
          <div className={styles.lane}>
            <button className={styles.textButton} onClick={() => passwordless('')}>
              Passwordless
            </button>
          </div>

          {/* 구분선 */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>또는</span>
          </div>

          {/* 소셜 로그인 */}
          <div className={styles.socialCol}>
            <button className={styles.imageButton} onClick={() => loginWithProvider('google')}>
              <img src="/images/google_login.png" alt="Google 로그인" className={styles.imgFit} />
            </button>

            <button className={styles.imageButton} onClick={() => loginWithProvider('kakao')}>
              <img src="/images/kakao_login.png" alt="Kakao 로그인" className={styles.imgFit} />
            </button>

            <button className={styles.imageButton} onClick={() => loginWithProvider('naver')}>
              <img src="/images/naver_login.png" alt="Naver 로그인" className={styles.imgFit} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // isLoggedIn이면 위 useEffect가 바로 이동시킴
  return <div className={styles.page}>로그인되었습니다.</div>;
}
