import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Notice.module.css';

interface NoticeItem {
  id: number;
  title: string;
  content: string;
  date: string;
  major_yn: boolean;
  hit: number;
}

const Notice: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const noticeData: NoticeItem[] = [
    {
      id: 1,
      title: "주요공지사항1",
      content: "내용입니다1.",
      date: "2025-01-10",
      major_yn: true,
      hit: 1
    },
    {
      id: 2,
      title: "주요공지사항2",
      content: "내용입니다2.",
      date: "2025-01-08",
      major_yn: true,
      hit: 1
    },
    {
      id: 3,
      title: "공지사항3",
      content: "내용입니다3.",
      date: "2025-01-05",
      major_yn: true,
      hit: 1
    },
    {
      id: 4,
      title: "공지사항4",
      content: "내용입니다4.",
      date: "2024-12-28",
      major_yn: false,
      hit: 1
    },
    {
      id: 5,
      title: "공지사항5",
      content: "내용입니다5",
      date: "2024-12-20",
      major_yn: false,
      hit: 1
    },
    {
      id: 6,
      title: "공지사항6",
      content: "내용입니다6",
      date: "2024-12-15",
      major_yn: false,
      hit: 1
    },
    {
      id: 7,
      title: "공지사항7",
      content: "내용입니다7",
      date: "2024-12-10",
      major_yn: false,
      hit: 1
    },
    {
      id: 8,
      title: "공지사항8",
      content: "내용입니다8",
      date: "2024-12-05",
      major_yn: false,
      hit: 1
    },
    {
      id: 9,
      title: "공지사항9",
      content: "내용입니다9.",
      date: "2024-11-30",
      major_yn: false,
      hit: 1
    },
    {
      id: 10,
      title: "공지사항10",
      content: "내용입니다10.",
      date: "2024-11-25",
      major_yn: false,
      hit: 2
    }
  ];

  const primaryNotices = noticeData.filter(notice => notice.major_yn);
  const normalNotices = noticeData.filter(notice => !notice.major_yn);

  const filteredNotices = normalNotices.filter(notice =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotices = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  const handleNoticeClick = (notice: NoticeItem) => {
    navigate(`/notice/${notice.id}`, { state: { notice } });
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.noticetitle}>공지사항</h1>
      
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="검색창"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          검색
        </button>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.noticeTable}>
          <thead>
            <tr>
              <th>제목</th>
              <th>등록일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {primaryNotices.map((notice) => (
              <tr key={notice.id} className={styles.primaryRow} onClick={() => handleNoticeClick(notice)}>
                <td>
                  <span className={styles.badge}>필독</span>
                  {notice.title}
                </td>
                <td>{notice.date}</td>
                <td>{notice.hit}</td>
              </tr>
            ))}
            {currentNotices.map((notice) => (
              <tr key={notice.id} className={styles.normalRow} onClick={() => handleNoticeClick(notice)}>
                <td>{notice.title}</td>
                <td>{notice.date}</td>
                <td>{notice.hit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageButton} 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button 
            className={styles.pageButton} 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default Notice;