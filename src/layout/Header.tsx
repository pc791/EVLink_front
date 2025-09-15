import React, { useState } from 'react';
import styles from './Header.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

const Header: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const handleLogin = () => {
        navigate('/Login');
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    const toggleMenu = () => {
        setActiveDropdown(activeDropdown ? null : 'active');
    };

    const handleMouseLeave = () => {
        setActiveDropdown(null);
    };

    return (
        <div className={styles['header-container']} onMouseLeave={handleMouseLeave}>
            <header className={styles.header}>
                <div className={styles['navbar-container']}>
                    {/* Logo and Brand */}
                    <div className={styles['logo-section']}>
                        
                        <NavLink to=""><img src='/images/EVLink_logo.png' alt="EVLink Logo" style={{width:'10%', height:'10%'}} /></NavLink>
                        {/* <h1 className={styles['brand-name']}>EVLink</h1> */}
                         {/* <NavLink to="/" className={styles['brand-name']}>EVLink</NavLink> */}
                    </div>

                    {/* Right Section - Login, User Info, and Hamburger Menu */}
                    <div className={styles['right-section']}>
                        {!isLoggedIn ? (
                            <div className={styles['right-buttons']}>
                                <button className={styles['login-button']} onClick={handleLogin}>
                                    Login
                                </button>
                                <button className={styles['hamburger-menu']} onClick={toggleMenu}>
                                    <span className={styles['hamburger-line']}></span>
                                    <span className={styles['hamburger-line']}></span>
                                    <span className={styles['hamburger-line']}></span>
                                </button>
                            </div>
                        ) : (
                            <div className={styles['right-buttons']}>
                                <div className={styles['user-section']}>
                                    <NavLink to="/notice" className={styles['notification-button']}>
                                        🔔
                                    </NavLink>
                                    <NavLink to="/mypage" className={styles['my-info-button']}>
                                        👤
                                    </NavLink>
                                    <button className={styles['logout-button']} onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                                <button className={styles['hamburger-menu']} onClick={toggleMenu}>
                                    <span className={styles['hamburger-line']}></span>
                                    <span className={styles['hamburger-line']}></span>
                                    <span className={styles['hamburger-line']}></span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Secondary Navigation Bar */}
            <div className={`${styles['secondary-nav']} ${activeDropdown ? styles['show'] : ''}`}>
                <div className={styles['secondary-nav-container']}>
                    <div className={styles['secondary-nav-items']}>
                        {/* EV 충전소 찾기 섹션 */}
                        <div className={styles['secondary-nav-section']}>
                            <h3 className={styles['secondary-nav-title']}>EV 충전소 찾기</h3>
                            <div className={styles['secondary-nav-links']}>
                                <NavLink to="/map" className={styles['secondary-nav-item']}>충전소찾기</NavLink>
                                <NavLink to="/service" className={styles['secondary-nav-item']}>서비스안내</NavLink>
                            </div>
                        </div>

                        {/* 사용 내역 섹션 */}
                        <div className={styles['secondary-nav-section']}>
                            <h3 className={styles['secondary-nav-title']}>사용 내역</h3>
                            <div className={styles['secondary-nav-links']}>
                                <NavLink to="/analysis" className={styles['secondary-nav-item']}>이용현황</NavLink>
                                <NavLink to="/reservelist" className={styles['secondary-nav-item']}>예약내역</NavLink>
                            </div>
                        </div>

                   
                        {/* 커뮤니티 섹션 */}
                        <div className={styles['secondary-nav-section']}>
                            <h3 className={styles['secondary-nav-title']}>커뮤니티</h3>
                            <div className={styles['secondary-nav-links']}>
                                <NavLink to="/event" className={styles['secondary-nav-item']}>이벤트</NavLink>
                                <NavLink to="/notice" className={styles['secondary-nav-item']}>공지사항</NavLink>
                                <NavLink to="/faq" className={styles['secondary-nav-item']}>FAQ</NavLink>
                                <NavLink to="/board" className={styles['secondary-nav-item']}>이용후기(AI)</NavLink>
                                <NavLink to="/emoboard" className={styles['secondary-nav-item']}>커뮤니티(AI)</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;