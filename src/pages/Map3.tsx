import React, { useEffect, useRef, useState } from 'react';
import { DUMMY_STATIONS } from './EVdata';

interface ChargerStatusItem {
  csId: string;
  csNm: string;
  addr: string;
  lat: string;
  longi: string;
}

const NAVER_MAP_API_KEY = 'hvhbhpsxn3';
const KEPCO_API_KEY = '5F1cIB0v88jck3w9aeiJbF849KB6XDDlK334sXn3';
const KEPCO_API_URL = '/openapi/v1/EVchargeManage.do';
const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const naverRef = useRef<any>(null);
  const naverMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [address, setAddress] = useState('서울특별시 강남구 테헤란로 152');
  const [search, setSearch] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [isReservationPanelVisible, setIsReservationPanelVisible] = useState(false);
  const [chargerData, setChargerData] = useState<ChargerStatusItem[]>([]);

    // useEffect 1: API 호출 (컴포넌트 마운트 시 한 번만 실행)
  useEffect(() => {
    const fetchChargerStatus = async () => {
      try {
        const queryParams = new URLSearchParams({
          'apiKey': KEPCO_API_KEY,
          'pageNo': '1',
          'numOfRows': '10',
        });

        const response = await fetch(`${KEPCO_API_URL}?${queryParams}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API 호출 중 오류 발생:', response.status, errorText);
          return;
        }

        const jsonData = await response.json();
        const items = jsonData.data || [];
        
        const parsedData: ChargerStatusItem[] = items.map((item: any) => ({
          csId: item.충전소ID || '',
          csNm: item.충전소명 || '',
          addr: item.주소 || '',
          lat: item.위도 || '0',
          longi: item.경도 || '0',
        }));

        setChargerData(parsedData);
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
      }
    };

    fetchChargerStatus();
  }, []);

  // useEffect 2: 네이버 지도 초기화 (컴포넌트 마운트 시 한 번만 실행)
  useEffect(() => {
    if (!mapRef.current) return;
    const scriptId = 'naver-map-script';

    const loadScriptAndInitMap = () => {
      const naver = (window as any).naver;
      naverRef.current = naver;

      if (!naverMapRef.current) {
        const centerPosition = new naver.maps.LatLng(37.5009, 127.0366);
        naverMapRef.current = new naver.maps.Map(mapRef.current, {
          center: centerPosition,
          zoom: 16,
        });
      }
    };

    if (!(window as any).naver) {
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_API_KEY}&submodules=geocoder`;
        script.async = true;
        script.addEventListener('load', loadScriptAndInitMap);
        document.head.appendChild(script);
      } else {
        loadScriptAndInitMap();
      }
    } else {
      loadScriptAndInitMap();
    }
  }, []); // 의존성 배열이 비어있으므로 최초 1회만 실행

  // useEffect 3: chargerData가 업데이트될 때 마커만 새로고침
  useEffect(() => {
    const naver = naverRef.current;
    const naverMap = naverMapRef.current;

    // 네이버 맵과 데이터가 모두 준비되었을 때만 실행
    if (naver && naverMap && chargerData.length > 0) {
      // 기존 마커 제거
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      // 새로운 마커 생성 및 지도에 추가
      chargerData.forEach(station => {
        const position = new naver.maps.LatLng(parseFloat(station.lat), parseFloat(station.longi));
        const marker = new naver.maps.Marker({
          position,
          map: naverMap,
          title: station.csNm,
        });
        naver.maps.Event.addListener(marker, 'click', () => {
          setSelectedMarker(station);
        });
        markersRef.current.push(marker);
      });

      // 지도의 중심을 첫 번째 마커 위치로 이동
      if (chargerData[0].lat && chargerData[0].longi) {
        naverMap.setCenter(new naver.maps.LatLng(parseFloat(chargerData[0].lat), parseFloat(chargerData[0].longi)));
      }
    }
  }, [chargerData, naverMapRef.current, naverRef.current]); // naverMapRef.current와 naverRef.current를 의존성 배열에 추가하여 지도 초기화 이후 실행 보장

  const closeInfo = () => setSelectedMarker(null);
  const handleSearch = () => { if (search.trim() !== '') setAddress(search); };
  const handleReserve = () => { setIsReservationPanelVisible(true); closeInfo(); };
  const closeReservation = () => setIsReservationPanelVisible(false);

  return (
    <div className="container" style={{ position: 'relative' }}>
      <div className="search-bar">
        <input type="text" placeholder="키워드 검색" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }} />
        <select><option>충전기 타입</option></select>
        <button onClick={handleSearch}>검색</button>
      </div>
      <div className="main-content" style={{ position: 'relative' }}>
        <div style={{ width: '100%', height: 500, position: 'relative' }} ref={mapRef} />
        <div>
          <h2>충전 상태</h2>
          {chargerData.map((item, index) => (
            <div key={item.csId || `${item.csNm}-${index}`}>
              {item.csNm}
            </div>
          ))}
        </div>
        {selectedMarker && (
          <div style={{ position: 'absolute', left: '50%', top: 80, transform: 'translateX(-50%)', background: '#fff', border: '1px solid #ddd', borderRadius: 8, zIndex: 10, padding: 18, minWidth: 220, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', }}>
            <strong>{selectedMarker.csNm}</strong>
            <p>{selectedMarker.addr}</p>
            <div style={{ marginTop: 10 }}>
              <button style={{ padding: '6px 15px', background: '#4285F4', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }} onClick={handleReserve}>예약하기</button>
              <button style={{ marginLeft: 7, color: '#888', background: 'none', border: 'none', cursor: 'pointer' }} onClick={closeInfo}>닫기</button>
            </div>
          </div>
        )}
        {isReservationPanelVisible && (
          <div className="reservation-panel" style={{ position: 'absolute', top: 180, left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid #ddd', borderRadius: 8, zIndex: 15, padding: 24, minWidth: 320, boxShadow: '0 2px 8px rgba(0,0,0,0.20)', }}>
            <h3>예약</h3>
            <p><strong>{selectedMarker?.csNm || address}</strong>에 대한 예약할 시간</p>
            <div className="reservation-input">
              <label>날짜: </label>
              <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              <label>시간: </label>
              <input type='time' className="time-grid" />~
              <input type='time' className="time-grid" />
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="reserve-button" style={{ marginRight: 7 }}>예약하기</button>
              <button onClick={closeReservation}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;