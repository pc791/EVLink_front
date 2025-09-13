import React, { useState } from 'react';
import styles from './Header.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // 하나라도 누르면 전체 펼침

  const handleLogin = () => navigate('/Login');

const handleLogout = async () => {
  try {
    const ok = window.confirm('로그아웃 하시겠습니까?');
    if (!ok) return; // 사용자가 취소하면 종료
    await logout();
    navigate('/');
  } catch (e) {
    console.error('로그아웃 실패:', e);
  }
};

  return (
    <div className={styles['header-container']} onMouseLeave={() => setIsOpen(false)}>
      <header className={styles.header}>
        <div className={styles['navbar-container']}>

          {/* 로고: 이미지 자체만 링크 (좌측 상단, 크게) */}
          <div className={styles['logo-section']}>
            <NavLink to="/" className={styles['logo-link']} aria-label="홈으로 이동">
              <img
                src="/images/EVLink_logo.png"
                alt="EVLink Logo"
                className={styles['logo-image']}
              />
            </NavLink>
          </div>

          {/* 중앙 가로 메뉴: 무엇을 눌러도 전체 드롭다운 토글 */}
          <nav className={styles['top-center-nav']} aria-label="주 메뉴">
            <div className={styles['top-menu-item']} onClick={() => setIsOpen(prev => !prev)}>
              <span className={styles['top-menu-label']}>EV 충전소 찾기</span>
              <span className={styles.chevron}>▼</span>
            </div>
            <div className={styles['top-menu-item']} onClick={() => setIsOpen(prev => !prev)}>
              <span className={styles['top-menu-label']}>사용 내역</span>
              <span className={styles.chevron}>▼</span>
            </div>
            <div className={styles['top-menu-item']} onClick={() => setIsOpen(prev => !prev)}>
              <span className={styles['top-menu-label']}>커뮤니티</span>
              <span className={styles.chevron}>▼</span>
            </div>
          </nav>

          {/* 오른쪽: 로그인/로그아웃 */}
          <div className={styles['right-section']}>
            {!isLoggedIn ? (
              <div className={styles['right-buttons']}>
                <button className={styles['login-button']} onClick={handleLogin}>Login</button>
              </div>
            ) : (
              <div className={styles['right-buttons']}>
                <div className={styles['user-section']}>
                  {/* 순서: 내정보(👤) → 알림(🔔) → Logout */}
                  <NavLink to="/mypage" className={styles['my-info-button']} aria-label="내 정보">👤</NavLink>
                  <NavLink to="/mypage" className={styles['notification-button']} aria-label="알림">🔔</NavLink>
                  <button className={styles['logout-button']} onClick={handleLogout}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ▼ 모든 섹션을 한 번에 보여주는 드롭다운 */}
      <div className={`${styles['secondary-nav']} ${isOpen ? styles.show : ''}`}>
        <div className={styles['secondary-nav-container']}>
          <div className={styles['secondary-nav-items']}>

            <div className={styles['secondary-nav-section']}>
              <h3 className={styles['secondary-nav-title']}>EV 충전소 찾기</h3>
              <div className={styles['secondary-nav-links']}>
                <a href="#" className={styles['secondary-nav-item']}>서비스안내</a>
                <a href="#" className={styles['secondary-nav-item']}>충전소찾기</a>
              </div>
            </div>

            <div className={styles['secondary-nav-section']}>
              <h3 className={styles['secondary-nav-title']}>사용 내역</h3>
              <div className={styles['secondary-nav-links']}>
                <a href="#" className={styles['secondary-nav-item']}>이용현황</a>
                <a href="#" className={styles['secondary-nav-item']}>예약내역</a>
              </div>
            </div>

            <div className={styles['secondary-nav-section']}>
              <h3 className={styles['secondary-nav-title']}>커뮤니티</h3>
              <div className={styles['secondary-nav-links']}>
                <NavLink to="/event" className={styles['secondary-nav-item']}>이벤트</NavLink>
                <NavLink to="/notice" className={styles['secondary-nav-item']}>공지사항</NavLink>
                <NavLink to="/faq" className={styles['secondary-nav-item']}>FAQ</NavLink>
                <NavLink to="/review" className={styles['secondary-nav-item']}>사용자후기</NavLink>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;