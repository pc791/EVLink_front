import React, { useState, useEffect } from 'react';
import styles from './FAQ.module.css';
import { BASE_URL } from '../../../auth/constants'; 

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  // 입력값(타이핑 저장용)과 실제 검색어(필터용) 분리
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 9; // 페이지당 9개 질문

  // 백엔드에서 FAQ 데이터 가져오기
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${BASE_URL}/faq/list`, {
          credentials: 'include', // 세션 쿠키 포함
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        // 백엔드 데이터를 프론트엔드 형식으로 변환
        const mappedData: FAQItem[] = (Array.isArray(data) ? data : []).map((item: any) => ({
          id: item.faqId || item.faq_id || 0,
          question: item.question || '',
          answer: item.answer || '',
        }));

        setFaqData(mappedData);
      } catch (e: any) {
        setError(e.message || 'FAQ를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);

  // 버튼 눌렀을 때만 검색 적용 (입력값 -> 실제 검색어로 복사)
  const handleSearchClick = () => {
    setSearchTerm(searchInputValue.trim());
    setCurrentPage(1);
    setExpandedItems([]); // 검색 시 펼침 초기화
  };

  // 필터는 오직 searchTerm 기준(버튼 눌러야 변경)
  const filteredFAQ = faqData.filter((item) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return (
      (item.question || '').toLowerCase().includes(term) ||
      (item.answer || '').toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredFAQ.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFAQ = filteredFAQ.slice(startIndex, endIndex);

  const toggleItem = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedItems([]); // 페이지 변경 시 열린 답변들 닫기
  };

  const handleFirstPage = () => currentPage > 1 && handlePageChange(1);
  const handleLastPage = () => currentPage < totalPages && handlePageChange(totalPages);
  const handlePrevPage = () => currentPage > 1 && handlePageChange(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && handlePageChange(currentPage + 1);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    return pages;
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className={styles.faqContainer}>
        <h1 className={styles.faqTitle}>FAQ</h1>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>FAQ를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.faqContainer}>
        <h1 className={styles.faqTitle}>FAQ</h1>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.faqContainer}>
      <h1 className={styles.faqTitle}>FAQ</h1>

      {/* 검색: 오른쪽 정렬, 버튼 눌러야 반영 */}
      <div className={styles.searchSection}>
        <form
          className={styles.searchRow}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchClick();
          }}
        >
          <input
            type="text"
            placeholder="검색어를 입력해주세요"
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)} // 타이핑은 저장만
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            검색
          </button>
        </form>
      </div>

      {/* 고정 박스(고정 높이 + 내부 스크롤) */}
      <div className={styles.faqList}>
        {currentFAQ.length > 0 ? (
          currentFAQ.map((item) => {
            const isOpen = expandedItems.includes(item.id);
            return (
              <div key={item.id} className={styles.faqItem}>
                <div
                  className={styles.questionContainer}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className={styles.questionContent}>
                    <span className={styles.questionMark} aria-hidden>
                      Q.
                    </span>
                    <span className={styles.questionText}>{item.question}</span>
                  </div>
                  <div className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>
                    ▾
                  </div>
                </div>

                {isOpen && (
                  <div className={styles.answerContainer}>
                    <div className={styles.answerContent}>
                      <span className={styles.answerMark} aria-hidden>
                        A.
                      </span>
                      <div className={styles.answerText}>{item.answer}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className={styles.noResults}>
            <p>검색 결과가 없습니다</p>
            <p>검색어를 다시 확인해 주세요.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={`${styles.paginationButton} ${
              currentPage === 1 ? styles.disabled : ''
            }`}
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            aria-label="첫 페이지"
          >
            «
          </button>
          <button
            className={`${styles.paginationButton} ${
              currentPage === 1 ? styles.disabled : ''
            }`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            ‹
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={`${styles.paginationButton} ${
                currentPage === page ? styles.active : ''
              }`}
              onClick={() => handlePageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              <span className={styles.pageNumber}>{page}</span>
            </button>
          ))}

          <button
            className={`${styles.paginationButton} ${
              currentPage === totalPages ? styles.disabled : ''
            }`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            ›
          </button>
          <button
            className={`${styles.paginationButton} ${
              currentPage === totalPages ? styles.disabled : ''
            }`}
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            aria-label="마지막 페이지"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default FAQ;
