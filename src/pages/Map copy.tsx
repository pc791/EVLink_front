import React, { useEffect, useRef, useState } from 'react';
import { DUMMY_STATIONS, ChargingStation } from './EVdata';

const Map: React.FC = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [address, setAddress] = useState('서울특별시 강남구 테헤란로 152');
    const [search, setsearch] = useState('');
    const [isReservationPanelVisible, setIsReservationPanelVisible] = useState(false);
    const [selectedMarkerTitle, setSelectedMarkerTitle] = useState('');

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

                    // 기존 마커 생성 로직은 제거하고, 더미 데이터를 순회하며 마커를 생성합니다.
                    DUMMY_STATIONS.forEach((station: ChargingStation) => {
                        const markerPosition = new naver.maps.LatLng(station.position.lat, station.position.lng);
                        const marker = new naver.maps.Marker({
                            position: markerPosition,
                            map: map,
                            title: station.addr, // 충전소 이름으로 마커 제목 설정
                        });

                        // 정보창의 HTML 콘텐츠
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
                            <button id="cancel-btn-${station.id}">취소</button>
                        </div>
                    `;

                        const infoWindow = new naver.maps.InfoWindow({
                            content: infoWindowContent,
                            maxWidth: 200
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
                                const cancelBtn = document.getElementById(`cancel-btn-${station.id}`); // 취소 버튼 ID 가져오기

                                if (reserveBtn) {
                                    reserveBtn.onclick = () => {
                                        setIsReservationPanelVisible(true);
                                        setSelectedMarkerTitle(station.addr);
                                        infoWindow.close();
                                    };
                                }

                                // 취소 버튼 클릭 이벤트 핸들러 추가
                                if (cancelBtn) {
                                    cancelBtn.onclick = () => {
                                        infoWindow.close(); // 정보창을 닫는 함수 호출
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

    return (
        <div className="container">
            {/* 3번 영역: 검색 */}
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

            {/* 메인 컨텐츠 영역 */}
            <div className="main-content">
                {/* 4번 영역: 상세 정보 */}
                <div className="details-panel">
                    <h2>충전소 상세 정보</h2>
                    <p>조회된 리스트 기준 상세 정보</p>
                </div>

                {/* 2번 영역: 지도 */}
                <div style={{ width: '100%', height: '500px' }} ref={mapRef}>
                    {/* 지도 컨테이너 */}
                </div>

                {/* 5번 영역: 예약 - 조건부 렌더링 */}
                {isReservationPanelVisible && (
                    <div className="reservation-panel">
                        <h3>예약하기</h3>
                        <p>{selectedMarkerTitle}에 대한 예약</p>
                        <div className="reservation-input">
                            <label>날짜:</label>
                            <input type="date" defaultValue="2025-07-10" />
                        </div>
                        <div className="reservation-input">
                            <label>시간:</label>
                            <div className="time-grid">시간 입력 (그리드)</div>
                        </div>
                        <button className="reserve-button">예약하기</button>
                        <button className="reserve-button" onClick={() => setIsReservationPanelVisible(false)}>취소</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Map;