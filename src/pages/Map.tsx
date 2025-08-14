import React, { useEffect, useRef, useState } from 'react';
import { DUMMY_STATIONS, ChargingStation } from './EVdata';
import './Map.css';
import ReservationModal from './ReservationModal'; // 모달 컴포넌트 임포트

// 현재 날짜를 YYYY-MM-DD 형식으로 반환하는 헬퍼 함수
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [address, setAddress] = useState('서울특별시 강남구 테헤란로 152');
  const [search, setsearch] = useState('');
  const [isReservationPanelVisible, setIsReservationPanelVisible] = useState(false);
  const [selectedMarkerTitle, setSelectedMarkerTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedTimeRange, setSelectedTimeRange] = useState<string[]>([]);
  
  // 드래그 선택을 위한 상태 추가
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  
  // 모달 관련 상태 추가
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (mapRef.current) {
      loadNaverMap(address);
    }
  }, [address]);

  const loadNaverMap = (searchAddress: string) => {
    const scriptId = 'naver-map-script';
    const existingScript = document.getElementById(scriptId);

    const loadMap = () => {
      const naver = (window as any).naver;
      if (!naver || !naver.maps || !naver.maps.Service) {
        console.log('Naver Maps API 또는 geocoder 로드 중...');
        setTimeout(loadMap, 100);
        return;
      }

      naver.maps.Service.geocode(
        { query: searchAddress },
        (status: string, response: any) => {
          if (status !== naver.maps.Service.Status.OK || response.v2.addresses.length === 0) {
            alert('주소 변환에 실패했거나 유효한 주소를 찾을 수 없습니다.');
            if (mapRef.current) {
              mapRef.current.innerHTML = '유효한 주소를 찾을 수 없습니다.';
            }
            return;
          }

          const { x, y } = response.v2.addresses[0];
          const centerLocation = new naver.maps.LatLng(parseFloat(y), parseFloat(x));

          const map = new naver.maps.Map(mapRef.current!, {
            center: centerLocation,
            zoom: 16,
          });

          DUMMY_STATIONS.forEach((station: ChargingStation) => {
            const markerPosition = new naver.maps.LatLng(station.position.lat, station.position.lng);
            const marker = new naver.maps.Marker({
              position: markerPosition,
              map: map,
              title: station.addr,
            });

            const infoWindowContent = `
              <div style="padding: 10px; font-size: 14px;">
                <h4>${station.addr}</h4>
                <p>충전기 타입: ${station.chargeTp}</p>
                <p>충전기 상태: ${station.cpStat}</p>
                <p>충전방식: ${station.cpTp}</p>
                <button id="reserve-btn-${station.id}" style="
                  background-color: #4285F4;
                  color: white;
                  border: none;
                  padding: 5px 10px;
                  border-radius: 4px;
                  cursor: pointer;
                  margin-top: 5px;
                ">예약하기</button>
                <button id="cancel-btn-${station.id}" style="
                  background-color: #ccc;
                  color: black;
                  border: none;
                  padding: 5px 10px;
                  border-radius: 4px;
                  cursor: pointer;
                  margin-left: 5px;
                ">취소</button>
              </div>
            `;

            const infoWindow = new naver.maps.InfoWindow({
              content: infoWindowContent,
              maxWidth: 200,
            });

            naver.maps.Event.addListener(marker, 'click', () => {
              if (infoWindow.getMap()) {
                infoWindow.close();
              } else {
                infoWindow.open(map, marker);
              }
            });

            naver.maps.Event.addListener(infoWindow, 'open', () => {
              setTimeout(() => {
                const reserveBtn = document.getElementById(`reserve-btn-${station.id}`);
                const cancelBtn = document.getElementById(`cancel-btn-${station.id}`);

                if (reserveBtn) {
                  reserveBtn.onclick = () => {
                    setIsReservationPanelVisible(true);
                    setSelectedMarkerTitle(station.addr);
                    infoWindow.close();
                  };
                }

                if (cancelBtn) {
                  cancelBtn.onclick = () => {
                    infoWindow.close();
                  };
                }
              }, 50);
            });
          });
        }
      );
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src =
        'https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=hvhbhpsxn3&submodules=geocoder';
      script.async = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    } else {
      loadMap();
    }
  };

  const handleSearch = () => {
    if (search.trim() !== '') {
      setAddress(search);
    }
  };

  const availableTimeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = String(i).padStart(2, '0');
    const status = (i === 16 || i === 23) ? 'unavailable' : 'available';
    const price = (i >= 17 && i <= 21) ? 7000 : 6000;
    
    return {
      time: hour,
      price: status === 'available' ? price : null,
      status: status,
    };
  });

  const handleDragStart = (index: number) => {
    if (availableTimeSlots[index].status === 'unavailable') return;
    setIsDragging(true);
    setDragStartIndex(index);
    setSelectedTimeRange([availableTimeSlots[index].time]);
  };

  const handleDragOver = (index: number) => {
    if (!isDragging || dragStartIndex === null) return;
    
    const start = Math.min(dragStartIndex, index);
    const end = Math.max(dragStartIndex, index);
    
    const hasUnavailable = availableTimeSlots.slice(start, end + 1).some(slot => slot.status === 'unavailable');
    if (hasUnavailable) {
        setIsDragging(false);
        setDragStartIndex(null);
        setSelectedTimeRange([]);
        alert('예약 불가능한 시간이 포함되어 드래그가 취소되었습니다.');
        return;
    }
    
    const newTimeRange = availableTimeSlots.slice(start, end + 1).map(slot => slot.time);
    setSelectedTimeRange(newTimeRange);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStartIndex(null);
  };
  
  const handleReserve = () => {
    if (selectedTimeRange.length > 0) {
      setIsModalVisible(true);
    } else {
      alert('시간을 선택해주세요.');
    }
  };
  
  const totalReservationHours = selectedTimeRange.length;
  const reservationTimeDisplay = totalReservationHours > 0
    ? `${selectedTimeRange[0].padStart(2, '0')}시~${(parseInt(selectedTimeRange[totalReservationHours - 1]) + 1).toString().padStart(2, '0')}시, ${totalReservationHours}시간`
    : '시간 선택';

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('ko-KR', options).replace(/\s/g, '');
  };

  const reservationDetails = {
    date: formatSelectedDate(),
    time: reservationTimeDisplay,
    station: selectedMarkerTitle
  };

  return (
    <div className="container" onMouseUp={handleDragEnd}>
      <div className="search-bar">
        <input
          type="text"
          placeholder="충전소/지역/도로명 검색"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <select>
          <option>충전기 타입</option>
        </select>
        <button onClick={handleSearch}>검색</button>
      </div>
      <div className="main-content">
        <div className="details-panel">
          <h2>충전소 상세 정보</h2>
          <p>조회된 리스트 기준 상세 정보</p>
        </div>
        <div className="map-container" ref={mapRef} />
        <div className={`reservation-panel ${isReservationPanelVisible ? 'visible' : ''}`}>
          <div className="panel-header">
            <h3>예약하기</h3>
            <p className="station-title">{selectedMarkerTitle}</p>
          </div>
          <div className="panel-body">
            <div className="reservation-section">
              <div className="section-header">날짜 선택</div>
              <div className="date-picker">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
            <div className="reservation-section">
              <div className="section-header">
                시간 선택
                <span className="total-time">{reservationTimeDisplay}</span>
              </div>
              <div className="time-selector-container">
                <div 
                  className="time-grid-scroller"
                >
                  {availableTimeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`time-slot ${selectedTimeRange.includes(slot.time) ? 'selected' : 
                        slot.status === 'available' ? 'available' : 'unavailable'
                      }`}
                      onMouseDown={() => handleDragStart(index)}
                      onMouseOver={() => handleDragOver(index)}
                    >
                      <span className="time-label">{slot.time}시</span>
                      {slot.price && <span className="price-label">{slot.price.toLocaleString()}원</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="legend">
                <span className="legend-item"><span className="unavailable-box"></span> 예약불가</span>
                <span className="legend-item"><span className="available-box"></span> 가능</span>
                <span className="legend-item"><span className="selected-box"></span> 선택</span>
              </div>
            </div>
            <div className="panel-footer">
              <button className="reserve-button" onClick={handleReserve}>예약하기</button>
              <button 
                className="cancel-button" 
                onClick={() => setIsReservationPanelVisible(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
      {isModalVisible && (
        <ReservationModal
          onClose={() => setIsModalVisible(false)}
          reservationDetails={reservationDetails}
        />
      )}
    </div>
  );
};

export default Map;