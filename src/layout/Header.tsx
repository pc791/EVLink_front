import React, { useEffect, useRef, useState } from 'react';
import styles from './Header.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import ChatPanel from '../components/home/ChatAI';
import AssistantIcon from '@mui/icons-material/Assistant';
import  { BASE_URL, AI_URL } from '../auth/constants';

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const chatRef = useRef<HTMLDivElement | null>(null);

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
 // 응답 정규화 유틸: 다양한 서버 형식을 안전하게 문자열로 반환
  function normalizeAiResponse(payload: any): string {
    let raw: any = payload?.results ?? payload?.text ?? payload;

    // 배열이면 join
    if (Array.isArray(raw)) {
      try {
        raw = raw.join("\n");
      } catch { }
    }

    // 객체인 경우 JSON 문자열화
    if (typeof raw !== "string") {
      try {
        raw = JSON.stringify(raw, null, 2);
      } catch {
        raw = String(raw);
      }
    }

    // 이중 인코딩된 문자열 처리 (예: "\"line1\\nline2\"" 같은 케이스)
    try {
      const maybe = JSON.parse(raw);
      if (typeof maybe === "string") {
        raw = maybe;
      }
    } catch {
      // ignore
    }

    // 이스케이프된 줄바꿈 \\n -> 실제 \n
    raw = raw.replace(/\\n/g, "\n");

    return raw;
  }

  // 예시: 실제 AI 백엔드 호출 함수 (정규화된 문자열을 반환)
  const handleAiSend = async (text: string) => {
    try {
      const res = await fetch(`${AI_URL}/myGemini/geminiSercive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text }),
      });
      if (!res.ok) {
        console.error('서버 응답 상태:', res.status, await res.text());
        return "서버 응답에 문제가 있습니다.";
      }
      const data = await res.json();
      console.log('raw ai response:', data);
      const normalized = normalizeAiResponse(data);
      console.log('normalized ai response:', normalized);
      return normalized ?? "AI에서 응답이 없습니다.";
    } catch (e) {
      console.error(e);
      return "네트워크 에러가 발생했습니다.";
    }
  };

  // 바깥 클릭/ESC로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowChat(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!showChat) return;
      if (!chatRef.current) return;
      const target = e.target as Node;
      if (!chatRef.current.contains(target)) {
        // 클릭한 곳이 패널 내부가 아니면 닫기 (주석 처리된 부분 유지 의도에 따라 수정)
        // setShowChat(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [showChat]);
  
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

          <div className={styles.topbarRight}>
            {/* Chat toggle button (아이콘은 /icons/chat.svg 로 가정) */}
            <button
              type="button"
              className={styles.chatToggle}
              aria-expanded={showChat}
              aria-label={showChat ? "채팅 닫기" : "채팅 열기"}
              onClick={() => setShowChat((s) => !s)}
            >
              <AssistantIcon style={{ color: 'white' }} />
            </button>
          </div>
          <div
            ref={chatRef}
            className={`${styles.chatWrapper} ${showChat ? styles.open : ""}`}
            aria-hidden={!showChat}
          >
            <ChatPanel onSend={handleAiSend} />
          </div>
          {/* 오른쪽: 로그인/로그아웃 */}
          <div className={styles['right-section']}>
            {!isLoggedIn ? (
              <div className={styles['right-buttons']}>
                <button className={styles['login-button']} onClick={handleLogin}>로그인</button>
              </div>
            ) : (
              <div className={styles['right-buttons']}>
                <div className={styles['user-section']}>
                  {/* 순서: 내정보(👤) → 알림(🔔) → Logout */}
                  <NavLink to="/mypage" className={styles['my-info-button']} aria-label="내 정보">👤</NavLink>
                  {/* <NavLink to="/mypage" className={styles['notification-button']} aria-label="알림">🔔</NavLink> */}
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
                <NavLink to="/review" className={styles['secondary-nav-item']}>사용자후기</NavLink>
                <NavLink to="/emoboard" className={styles['secondary-nav-item']}>커뮤니티</NavLink>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;