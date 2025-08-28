import React, { useState } from 'react'
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import styles from '../layout/Layout.module.css';
import { useLocation } from 'react-router-dom';
interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    // 맵 페이지 경로가 '/map' 인 경우 Footer 숨김 처리
    const isMapPage = location.pathname === '/map';
    return (
        <div className={styles.layout}>
            <Header />
            <div className={styles.page}>
                <main className={styles.main}>{children}</main>
            </div>
            {!isMapPage && <Footer />}
        </div>
    )
}
export default Layout;