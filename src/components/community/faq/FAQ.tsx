import React, { useState } from 'react';
import styles from './FAQ.module.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 페이지당 9개 질문 (25개 ÷ 9 = 3페이지)

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "충전 후 세차 / 세차 후 충전해도 안전한가요?",
      answer: "네, 안전합니다. EVLink 충전기는 IP54 등급의 방수/방진 기능을 갖추고 있어 세차 후에도 안전하게 사용할 수 있습니다. 다만, 충전 중에는 세차를 피하시는 것을 권장합니다."
    },
    {
      id: 2,
      question: "눈/비오는 날도 충전 가능한가요?",
      answer: "네, 가능합니다. 모든 EVLink 충전소는 IP54 이상의 방수 등급을 갖추고 있어 악천후에도 안전하게 충전할 수 있습니다. 단, 극심한 폭풍이나 천재지변이 발생한 경우에는 안전을 위해 일시적으로 서비스가 중단될 수 있습니다."
    },
    {
      id: 3,
      question: "다른 차량이 충전중이던걸 제가 결제해버렸어요. 어떻게 해야 할까요?",
      answer: "실수로 다른 차량의 충전을 결제한 경우, 즉시 고객센터(1588-1234)로 연락해주세요. 충전기 번호와 시간을 알려주시면 해당 차량 소유자에게 환불 처리해드리겠습니다."
    },
    {
      id: 4,
      question: "다른 차량이 충전 중이었는데 모르고 충전을 중지시켜버렸어요.",
      answer: "다른 차량의 충전을 중지시킨 경우, 해당 차량 소유자에게 불편을 끼치게 됩니다. 즉시 고객센터로 연락하여 상황을 설명해주시고, 가능하다면 해당 차량 소유자에게 사과를 드리시기 바랍니다."
    },
    {
      id: 5,
      question: "충전 중에 차량을 떠나도 되나요?",
      answer: "충전 중 차량을 떠나는 것은 가능하지만, 충전 완료 후 10분 이내에 차량을 이동시켜주세요. 다른 사용자를 위해 충전기를 점유하지 않도록 협조해주시기 바랍니다."
    },
    {
      id: 6,
      question: "충전 속도가 느린 것 같은데 정상인가요?",
      answer: "충전 속도는 차량의 배터리 상태, 온도, 충전기 타입 등 여러 요인에 따라 달라집니다. 정상적인 범위 내라면 문제없습니다. 지속적으로 느리다면 고객센터로 문의해주세요."
    },
    {
      id: 7,
      question: "충전기 사용법을 모르겠어요.",
      answer: "EVLink 앱에서 간단한 사용법을 확인할 수 있습니다. 충전기에 QR코드가 부착되어 있으니 스캔하시면 바로 사용하실 수 있습니다. 추가 도움이 필요하시면 고객센터로 연락해주세요."
    },
    {
      id: 8,
      question: "결제 방법은 어떤 것들이 있나요?",
      answer: "신용카드, 체크카드, 모바일 결제(카카오페이, 네이버페이, 페이코), 그리고 EVLink 포인트를 사용하실 수 있습니다. 앱에서 결제 수단을 미리 등록하시면 더욱 편리하게 이용하실 수 있습니다."
    },
    {
      id: 9,
      question: "충전 중에 앱이 꺼져도 충전이 계속되나요?",
      answer: "네, 앱을 종료해도 충전은 계속됩니다. 하지만 충전 상태를 실시간으로 확인하고 완료 알림을 받으시려면 앱을 켜두시는 것을 권장합니다."
    },
    {
      id: 10,
      question: "충전기 고장 시 어떻게 해야 하나요?",
      answer: "충전기 고장 시 즉시 고객센터(1588-1234)로 연락해주세요. 충전기 번호와 고장 상황을 설명해주시면 빠른 조치를 취해드리겠습니다."
    },
    {
      id: 11,
      question: "충전 요금은 어떻게 계산되나요?",
      answer: "충전 요금은 충전량(kWh)과 충전 시간에 따라 계산됩니다. 앱에서 실시간 요금을 확인하실 수 있으며, 충전 완료 후 상세 내역을 제공해드립니다."
    },
    {
      id: 12,
      question: "충전기 예약은 얼마나 미리 해야 하나요?",
      answer: "충전기 예약은 최대 7일 전부터 가능하며, 최소 30분 전까지 예약하실 수 있습니다. 예약 시간 10분 전까지 도착하지 않으면 예약이 자동 취소됩니다."
    },
    {
      id: 13,
      question: "충전 중에 다른 차량이 대기하고 있으면 어떻게 해야 하나요?",
      answer: "충전 완료 후 10분 이내에 차량을 이동시켜주세요. 다른 사용자를 위해 충전기를 점유하지 않도록 협조해주시기 바랍니다."
    },
    {
      id: 14,
      question: "충전기 위치를 어떻게 찾나요?",
      answer: "EVLink 앱의 지도에서 가까운 충전소를 쉽게 찾을 수 있습니다. 현재 위치 기반으로 가장 가까운 충전소를 추천해드리며, 실시간 사용 가능 여부도 확인할 수 있습니다."
    },
    {
      id: 15,
      question: "충전 중에 차량을 시동 걸어도 되나요?",
      answer: "충전 중에는 차량 시동을 끄고 충전을 완료하는 것을 권장합니다. 시동을 걸면 충전 속도가 느려질 수 있습니다."
    },
    {
      id: 16,
      question: "충전기 타입별 차이점이 궁금해요.",
      answer: "EVLink는 완속충전기(7kW)와 급속충전기(50kW, 150kW)를 제공합니다. 완속충전기는 장시간 주차 시, 급속충전기는 빠른 충전이 필요할 때 사용하시면 됩니다."
    },
    {
      id: 17,
      question: "충전 중에 차량 문을 열어도 되나요?",
      answer: "네, 충전 중에도 차량 문을 열고 닫는 것은 안전합니다. 다만, 충전 케이블이 연결된 상태에서는 주의해서 사용해주세요."
    },
    {
      id: 18,
      question: "충전 완료 후 케이블을 뽑는 순서가 있나요?",
      answer: "먼저 앱에서 충전을 중지한 후, 차량의 충전 포트에서 케이블을 분리하고, 마지막에 충전기에서 케이블을 뽑아주세요."
    },
    {
      id: 19,
      question: "충전 중에 에어컨을 켜도 되나요?",
      answer: "충전 중 에어컨 사용은 가능하지만, 충전 속도가 느려질 수 있습니다. 가능하면 충전 완료 후 에어컨을 사용하시는 것을 권장합니다."
    },
    {
      id: 20,
      question: "충전기 사용 시간 제한이 있나요?",
      answer: "충전 완료 후 10분 이내에 차량을 이동시켜주세요. 다른 사용자를 위해 충전기를 점유하지 않도록 협조해주시기 바랍니다."
    },
    {
      id: 21,
      question: "충전 중에 음악을 들을 수 있나요?",
      answer: "네, 충전 중에도 차량 내 오디오 시스템을 사용할 수 있습니다. 다만, 배터리 소모를 줄이기 위해 볼륨을 적당히 조절하시는 것을 권장합니다."
    },
    {
      id: 22,
      question: "충전기 예약 취소는 언제까지 가능한가요?",
      answer: "예약 시간 30분 전까지는 무료로 취소 가능합니다. 30분 이내 취소 시 위약금이 발생할 수 있습니다."
    },
    {
      id: 23,
      question: "충전 중에 차량을 워시해도 되나요?",
      answer: "충전 중 차량 워시는 권장하지 않습니다. 충전기와 케이블에 물이 튀어 안전사고가 발생할 수 있습니다."
    },
    {
      id: 24,
      question: "충전기 사용 중 오류가 발생했어요.",
      answer: "충전기 오류 발생 시 즉시 충전을 중지하고 고객센터(1588-1234)로 연락해주세요. 오류 코드와 상황을 설명해주시면 빠른 해결을 도와드리겠습니다."
    },
    {
      id: 25,
      question: "충전 중에 차량을 잠글 수 있나요?",
      answer: "네, 충전 중에도 차량을 잠글 수 있습니다. 다만, 충전 완료 후 차량을 이동시킬 수 있도록 키를 가까이 두시는 것을 권장합니다."
    }
  ];

//   // [ADD] API로부터 가져온 데이터를 담을 상태
//   const [faqData, setFaqData] = useState<FAQItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState<string | null>(null);

//   // [ADD] 최초 1회 FAQ 데이터 불러오기 (관리자/백엔드가 제공할 API)
//   useEffect(() => {
//     const fetchFAQs = async () => {
//       try {
//         setLoading(true);
//         setLoadError(null);

//         //  관리자에게 요청할 기본 형태:
//         // GET /api/faqs?activeOnly=true  (서버에서 최신 FAQ 리스트 반환)
//         const res = await fetch('/api/faqs?activeOnly=true');

//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await res.json();

//         // 서버 응답이 { items: FAQItem[] } 이거나 그냥 FAQItem[] 둘 다 대응
//         const items: FAQItem[] = Array.isArray(data) ? data : (data.items ?? []);
//         setFaqData(items);
//       } catch (err: any) {
//         console.error('FAQ 불러오기 실패:', err);
//         setLoadError('FAQ를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFAQs();
//   }, []); // 최초 1회만



  const filteredFAQ = faqData.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredFAQ.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFAQ = filteredFAQ.slice(startIndex, endIndex);

  const toggleItem = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedItems([]); // 페이지 변경 시 열린 답변들 닫기
  };

  const handleFirstPage = () => {
    if (currentPage > 1) {
      handlePageChange(1);
    }
  };

  const handleLastPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(totalPages);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3; // Show 3 page numbers at a time

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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



  return (
    <div className={styles.faqContainer}>
      {/* FAQ 제목 */}
      <h1 className={styles.faqTitle}>FAQ</h1>
      
      {/* 검색창 */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="검색어를 입력해주세요"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // 검색 시 첫 페이지로 이동
            }}
            className={styles.searchInput}
          />
          {/* <div className={styles.searchIcon}>🔍</div> */}
        </div>
      </div>

      {/* FAQ 목록 */}
      <div className={styles.faqList}>
        {currentFAQ.length > 0 ? (
          currentFAQ.map((item) => (
            <div key={item.id} className={styles.faqItem}>
              <div 
                className={styles.questionContainer}
                onClick={() => toggleItem(item.id)}
              >
                <div className={styles.questionContent}>
                  <span className={styles.questionMark}>Q</span>
                  <span className={styles.questionText}>{item.question}</span>
                </div>
                <div className={`${styles.arrow} ${expandedItems.includes(item.id) ? styles.arrowUp : ''}`}>
                  ▼
                </div>
              </div>
              
              {expandedItems.includes(item.id) && (
                <div className={styles.answerContainer}>
                  <div className={styles.answerContent}>
                    <span className={styles.answerMark}>A</span>
                    <span className={styles.answerText}>{item.answer}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <p>검색 결과가 없습니다.</p>
            <p>다른 검색어를 입력해보세요.</p>
          </div>
        )}
      </div>


      {/* 페이지네이션 */}
      {filteredFAQ.length > itemsPerPage && (
        <div className={styles.pagination}>
          <button
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
            onClick={handleFirstPage}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={`${styles.paginationButton} ${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
          <button
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default FAQ;