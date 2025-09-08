// Login page supporting BOTH passwordless (email link) and social OAuth logins.
// - Passwordless: sends your email to backend to receive a magic link
// - Social: redirects to backend OAuth endpoints (Google, Naver, Kakao, Facebook)
// Backend is responsible for setting the session and redirecting back to the app.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css';
// import { AuthProvider } from '../../auth/AuthProvider';
// // import constants from '../../auth/constants';

const Login: React.FC = () => {
  // UI state
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Read any error coming back from backend redirects (e.g., /login?error=oauth_failed)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthErr = params.get('error');
    if (oauthErr) {
      setError('소셜 로그인에 실패했습니다. 다시 시도해주세요.');
    }
  }, []);

  // Start Passwordless login by asking backend to send a link to the provided email
  const handlePasswordlessLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // Adjust endpoint to match your backend implementation
      await axios.post('/api/auth/passwordless/start', { email }, { withCredentials: true });
      setInfo('로그인 링크를 이메일로 전송했습니다. 메일함을 확인해주세요.');
    } catch (err) {
      setError('이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // Start the OAuth flow by navigating to our backend endpoints
  const handleSocialLogin = (provider: 'google' | 'naver' | 'kakao' | 'facebook') => {
    setIsLoading(true);
    setError('');
    setInfo('');
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        {/* Header */} 
        {/* <div className={styles.header}>
          <img src="/images/logo.png" alt="EVLink Logo" className={styles.logo} />
          <h1 className={styles.title}>EVLink에 로그인</h1>
          <p className={styles.subtitle}>전기차 충전의 새로운 경험을 시작하세요</p>
        </div> */}

        {/* Passwordless Login (Email magic link) */}
        <div className={styles.passwordlessSection}>
          <h2 className={styles.sectionTitle}>Passwordless</h2>
          <form onSubmit={handlePasswordlessLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 입력하세요"
                className={styles.emailInput}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={styles.passwordlessButton}
              disabled={isLoading}
            >
              {isLoading ? '전송 중...' : '이메일로 로그인 링크 받기'}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerText}>또는</span>
        </div>

        {/* Social Login
            - Each button sends the user to /api/auth/{provider}
            - Backend completes OAuth and sets session
            - On success, backend redirects back to the app (e.g., "/") */}
       <div className={styles.socialSection}>
          <h2 className={styles.sectionTitle}>소셜 계정으로 로그인</h2>
          <div className={styles.socialButtons}>
            <button
              onClick={() => handleSocialLogin('google')}
              className={`${styles.socialButton} ${styles.google}`}
              disabled={isLoading}
            >
              <img src="/images/google-icon.png" alt="Google" className={styles.socialIcon} />
              <span>Google로 로그인</span>
            </button>

            <button
              onClick={() => handleSocialLogin('naver')}
              className={`${styles.socialButton} ${styles.naver}`}
              disabled={isLoading}
            >
              <img src="/images/naver-icon.png" alt="Naver" className={styles.socialIcon} />
              <span>네이버로 로그인</span>
            </button>

            <button
              onClick={() => handleSocialLogin('kakao')}
              className={`${styles.socialButton} ${styles.kakao}`}
              disabled={isLoading}
            >
              <img src="/images/kakao-icon.png" alt="Kakao" className={styles.socialIcon} />
              <span>카카오로 로그인</span>
            </button>

            <button
              onClick={() => handleSocialLogin('facebook')}
              className={`${styles.socialButton} ${styles.facebook}`}
              disabled={isLoading}
            >
              <img src="/images/facebook-icon.png" alt="Facebook" className={styles.socialIcon} />
              <span>페이스북으로 로그인</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Informational message (e.g., after sending magic link) */}
        {info && (
          <p className={styles.footerText}>{info}</p>
        )}

        {/* Footer: for OAuth, first login acts as signup. No separate signup needed. */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            계정이 없으신가요? <span className={styles.signupLink}>소셜 계정 또는 이메일로 시작하세요</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
