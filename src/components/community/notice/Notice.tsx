import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Notice.module.css';
import { BASE_URL } from '../../../auth/constants';

type Yn = 'Y' | 'N';

interface NoticeItem {
  noticeId: number;
  title: string;
  content: string;
  noticeDt: string;
  hit: number;
  majorYn: Yn;
  useYn: Yn;
}

const normalize = (it: any): NoticeItem => ({
  noticeId: Number(it.noticeId ?? it.notice_id),
  title: String(it.title ?? ''),
  content: String(it.content ?? ''),
  noticeDt: String(it.noticeDt ?? it.notice_dt ?? ''),
  hit: Number(it.hit ?? 0),
  majorYn: (it.majorYn ?? it.majoryn ?? it.major_yn ?? 'N') as Yn,
  useYn: (it.useYn ?? it.useyn ?? it.use_yn ?? 'Y') as Yn,
});

const Notice: React.FC = () => {
  const [noticeData, setNoticeData] = useState<NoticeItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const url = `${BASE_URL.replace(/\/+$/, '')}/notice/noticeList?t=${Date.now()}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      const arr: any[] = Array.isArray(raw) ? raw : (raw?.list ?? raw?.data ?? raw?.result ?? []);
      setNoticeData(arr.map(normalize));
    } catch (e) {
      console.error('Failed to load notices:', e);
      setNoticeData([]);
    }
  };

  useEffect(() => { load(); }, []);

  const usable = noticeData.filter(n => n.useYn === 'Y');

  const pinned = usable
    .filter(n => n.majorYn === 'Y')
    .sort((a, b) => b.noticeId - a.noticeId);

  const normalsAll = usable
    .filter(n => n.majorYn !== 'Y')
    .sort((a, b) => b.noticeId - a.noticeId);

  const filteredNormals = normalsAll.filter(n =>
    (n.title ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredNormals.length / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const pageNormals = filteredNormals.slice(start, start + itemsPerPage);

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
    setCurrentPage(1);
  };
  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };
  const goDetail = (n: NoticeItem) => navigate(`/notice/${n.noticeId}`);

  return (
    <div className={styles.page}>
      <div style={{height: '30px'}}></div>
      <div className={styles.container}>
        <h1 className={styles.noticetitle}>공지사항</h1>

        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="검색창"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleEnter}
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>검색</button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.noticeTable}>
            <thead>
              <tr>
                <th>등록일</th>
                <th>제목</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {/* 🔴 필독: 항상 최상단 */}
              {pinned.map(n => (
                <tr key={`pin-${n.noticeId}`} className={styles.pinnedRow} onClick={() => goDetail(n)}>
                  <td>{n.noticeDt}</td>
                  <td>
                    <span className={styles.badgePinned}>필독</span>
                    {n.title}
                  </td>
                  <td>{Number.isFinite(n.hit) ? n.hit : 0}</td>
                </tr>
              ))}

              {/* 일반 공지: 검색 + 페이징 */}
              {pageNormals.map(n => (
                <tr key={n.noticeId} className={styles.normalRow} onClick={() => goDetail(n)}>
                  <td>{n.noticeDt}</td>
                  <td>{n.title}</td>
                  <td>{Number.isFinite(n.hit) ? n.hit : 0}</td>
                </tr>
              ))}

              {pinned.length === 0 && filteredNormals.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '24px' }}>
                    표시할 공지가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/*  페이지네이션 */}
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notice;
