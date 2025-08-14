import React from 'react'
import Navbar from './Navbar';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import style from './Navbar.module.css';
import DropdownNav from './DropdownNav';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  //Login 정보를 테스트 하기 위해서 useContext로 부터 받아오기
  const { member, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    alert('로그아웃 되었습니다');
    navigate('/');
  }
  const commonLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${style.link} ${style.active}` : style.link;
  }

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between', // 공간을 사이로 벌려놓기
        alignItems: 'center', //중앙 정렬
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px'
      }}>
        <nav className={style.navbar}>
          <NavLink to="/"
            className={commonLinkClass}>Logo</NavLink>
        </nav>
        <div>날씨 정보</div>
        <div>
          {member ? (
            <>
              <span style={{ marginRight: '10px' }}>{member.name}님 환영합니다</span>
              <button onClick={handleLogout} style={{ color: 'white', background: 'transparent', border: 'none' }}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <a href="/login" style={{ marginRight: '10px', color: 'white' }}>로그인</a>
              <a href="/signup" style={{ color: 'white' }}>회원가입</a>
            </>
          )}
        </div>
        
      </header>
      <Navbar />
      <main>{children}</main>
      <footer style={{
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '10px',
        borderRadius: '0 0 8px 8px',
        textAlign: 'center'
      }}>
        @ 2025 FINAL PROJECT <b>EVLink</b>
      </footer>
    </div>
  )
}

export default Layout