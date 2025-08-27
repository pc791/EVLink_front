import React, { useState } from 'react'
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import styles from '../layout/Layout.module.css';


interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Header />
            <div className={styles.page}>
                <main className={styles.main}>{children}</main>
            </div>
            <Footer />
        </div>
    )
}

export default Layout;