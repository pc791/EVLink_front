import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './NoticeDetail.module.css';

interface NoticeItem {
  id: number;
  title: string;
  content: string;
  writer: string;
  date: string;
  isPrimary: boolean;
  hit: number;
}

const NoticeDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const notice = location.state?.notice as NoticeItem;

  // 공지사항이 없으면 목록으로 이동
  if (!notice) {
    navigate('/notice');
    return null;
  }

  const handleBackToList = () => {
    navigate('/notice');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackToList}>
          ← 목록으로
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{notice.title}</h1>
          <div className={styles.meta}>
            <span className={styles.date}>등록일: {notice.date}</span>
            <span className={styles.hit}>조회수: {notice.hit}</span>
            {notice.isPrimary && <span className={styles.badge}>주요</span>}
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.contentText}>
            {notice.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
