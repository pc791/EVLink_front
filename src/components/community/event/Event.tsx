// src/pages/event/Event.tsx
import React, { useEffect, useState } from 'react';
import styles from './Event.module.css';
import { BASE_URL } from '../../../auth/constants'; 

interface EventItem {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: 'ongoing' | 'closed';
  description?: string;
  imageUrl?: string;
  content?: string;
}

const Event: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventData, setEventData] = useState<EventItem[]>([]);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
      
        const url = `${BASE_URL.replace(/\/+$/, '')}/event/list`;
        console.log('[EVENT] GET:', url);

     
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const raw = await res.json();
        const arr = Array.isArray(raw) ? raw : (raw?.data ?? raw?.list ?? []);

        const toAbs = (u?: string | null) =>
          !u ? undefined : /^https?:\/\//i.test(u) ? u : `${BASE_URL}${u.startsWith('/') ? '' : '/'}${u}`;

        const mapped: EventItem[] = arr
          .filter((e: any) => (e.useYn ?? e.useyn ?? 'Y') === 'Y') // useYn 있으면 'Y'만
          .map((e: any) => ({
            id: e.eventId ?? e.id,
            title: e.title ?? '',
            startDate: e.startDate ?? e.start_dt ?? '',
            endDate: e.endDate ?? e.end_dt ?? '',
            status: 'closed', 
            description: e.description ?? '',
            imageUrl: toAbs(e.imageUrl ?? e.imgUrl ?? e.img_path),
            content: e.content ?? '',
          }));

        if (!aborted) setEventData(mapped);
      } catch (e) {
        console.error('이벤트 불러오기 실패:', e);
        if (!aborted) setEventData([]);
      }
    })();
    return () => { aborted = true; };
  }, []);

  // 그대로 유지: 날짜로 상태 계산
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
  const totalPages = Math.ceil(closedEvents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = closedEvents.slice(startIndex, startIndex + itemsPerPage);

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

                {/* 진행중만 이미지 표시 */}
                {event.imageUrl && (
                  <div className={styles.imageSection}>
                    <h4 className={styles.contentTitle}>이벤트 이미지</h4>
                    <div className={styles.imageContainer}>
                      <img
                        src={event.imageUrl}
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