import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './NoticeDetail.module.css';
import { BASE_URL } from '../../../auth/constants';

type Yn = 'Y' | 'N';

export interface NoticeItem {
  noticeId: number;
  title: string;
  content: string;
  writer?: string;
  noticeDt: string;
  majorYn: Yn;
  hit: number;
}

const normalizeNotice = (it: any): NoticeItem => ({
  noticeId: Number(it.noticeId ?? it.notice_id),
  title: String(it.title ?? ''),
  content: String(it.content ?? ''),
  writer: it.writer,
  noticeDt: String(it.noticeDt ?? it.notice_dt ?? ''),
  hit: Number(it.hit ?? 0),
  majorYn: (it.majorYn ?? it.majoryn ?? it.major_yn ?? 'N') as Yn,
});

const NoticeDetail: React.FC = () => {
  const { id: routeId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [notice, setNotice] = useState<NoticeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!routeId) { setError('잘못된 경로입니다.'); setLoading(false); return; }

    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        const url = `${BASE_URL.replace(/\/+$/, '')}/notice/detail/${routeId}?t=${Date.now()}`;
        const res = await fetch(url, { cache: 'no-store', credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw[0] : raw;
        if (!aborted) setNotice(normalizeNotice(data));
      } catch (e: any) {
        if (!aborted) setError(e.message || '불러오기 실패');
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => { aborted = true; };
  }, [routeId]);

  if (loading) return <div>불러오는 중...</div>;
  if (error) return <div style={{ color: 'red' }}>에러: {error}</div>;
  if (!notice) return <div>데이터가 없습니다.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/notice')}>
          ← 목록으로
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{notice.title}</h1>
          <div className={styles.meta}>
            <span className={styles.date}>등록일: {notice.noticeDt}</span>
            <span className={styles.hit}>조회수: {notice.hit}</span>
            {notice.majorYn === 'Y' && <span className={styles.badge}>필독</span>}
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.contentText}>{notice.content}</div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
