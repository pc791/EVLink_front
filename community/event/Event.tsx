import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Event.module.css';

interface EventItem {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: 'ongoing' | 'closed';
  description?: string;
  image?: string;
  content?: string;
}

const Event: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // const navigate = useNavigate();

  const eventData: EventItem[] = [
    {
      id: 1,
      title: "신규 EV충전소 1+1 프로모션",
      startDate: "2025-08-24",
      endDate: "2025-09-31",
      status: "ongoing",
      description: "신규 충전소 이용 시 1+1 혜택을 제공합니다.",
      image: "/images/event2.png",
      content: ""
    },
    {
      id: 2,
      title: "여름 시즌 특별 할인 프로모션",
      startDate: "2025-07-01",
      endDate: "2026-07-31",
      status: "ongoing",
      description: "여름 시즌 한정 특별 할인을 제공합니다.",
      image: "/images/event1.png",
      content: "12323544646456487ㅋㅋㅋㅋㅋ"
    },
    {
      id: 3,
      title: "신규 충전소 오픈 혜택 이벤트",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      status: "ongoing",
      description: "신규 충전소 오픈 기념 특별 혜택을 제공했습니다."
    },
    {
      id: 4,
      title: "비밀번호 변경 이벤트",
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      status: "closed",
      description: "보안 강화를 위한 비밀번호 변경 이벤트를 진행했습니다."
    },
    {
      id: 5,
      title: "풍성한 가을 이벤트",
      startDate: "2024-09-01",
      endDate: "2024-09-30",
      status: "closed",
      description: "가을 시즌 특별 프로모션을 진행했습니다."
    }
  ];

  const getEventStatus = (event: EventItem) => {
    const today = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    return (today >= startDate && today <= endDate) ? 'ongoing' : 'closed';
  };

  const processedEventData: EventItem[] = eventData.map(event => ({
    ...event,
    status: getEventStatus(event) as 'ongoing' | 'closed'
  }));

  const ongoingEvents = processedEventData.filter(event => event.status === 'ongoing');
  const closedEvents = processedEventData.filter(event => event.status === 'closed');

  const itemsPerPage = 5;
  const totalPages = Math.ceil(closedEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = closedEvents.slice(startIndex, startIndex + itemsPerPage);

//   const handleEventClick = (event: EventItem) => {
//     navigate(`/event/${event.id}`, { state: { event } });
//   };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>EVENT</h1>
      
      {ongoingEvents.length > 0 && (
        <div className={styles.ongoingSection}>
          <h2 className={styles.sectionTitle}>진행중인 이벤트</h2>
          {ongoingEvents.map((event) => (
            <div key={event.id} className={styles.ongoingDetail}>
              <div className={styles.detailHeader}>
                <div className={styles.statusSection}>
                  <span className={styles.ongoingBadge}>진행중</span>
                  <span className={styles.eventDate}>{event.startDate} ~ {event.endDate}</span>
                </div>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                {event.description && (
                  <p className={styles.eventDescription}>{event.description}</p>
                )}
              </div>
              
              <div className={styles.detailContent}>
                <div className={styles.textSection}>
                  <h4 className={styles.contentTitle}>이벤트 상세 내용</h4>
                  <div className={styles.contentText}>
                    {event.content || "이벤트 상세 내용이 준비 중입니다."}
                  </div>
                </div>
                
                {event.image && (
                  <div className={styles.imageSection}>
                    <h4 className={styles.contentTitle}>이벤트 이미지</h4>
                    <div className={styles.imageContainer}>
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className={styles.eventImage}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/event-placeholder.jpg';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.closedSection}>
        <h2 className={styles.sectionTitle}>마감된 이벤트</h2>
        <div className={styles.eventList}>
          {currentEvents.map((event) => (
            <div key={event.id} className={styles.eventItem}>
              <span className={styles.closedBadge}>마감</span>
              <span className={styles.eventTitle}>{event.title}</span>
              <span className={styles.eventDate}>{event.startDate} ~ {event.endDate}</span>
            </div>
          ))}
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
            <span className={styles.pageInfo}>{currentPage} / {totalPages}</span>
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
    </div>
  );
};

export default Event;