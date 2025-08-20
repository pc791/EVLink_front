import React, { useEffect, useRef, useState } from 'react';
import { DUMMY_STATIONS, ChargingStation } from './EVdata';
import './Map.css';
import ReservationModal from './ReservationModal';
import Calendar from './Calendar';

const NAVER_MAP_API_KEY = 'hvhbhpsxn3';
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
// interface TransCoordResponse {
//     result: {
//         x: number;
//         y: number;
//     };
//     // 필요한 다른 속성이 있다면 여기에 추가할 수 있습니다.
// }

const Map: React.FC = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [address, setAddress] = useState('서울특별시 강남구 테헤란로 152');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isReservationPanelVisible, setIsReservationPanelVisible] = useState(false);
    const [selectedStationAddress, setSelectedStationAddress] = useState('');
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [selectedTimeRange, setSelectedTimeRange] = useState<string[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [mapInstance, setMapInstance] = useState<any>(null);
    const markersRef = useRef<any[]>([]);

    const [displayedStations, setDisplayedStations] = useState<ChargingStation[]>([]);

    const updateMarkersInViewport = (map: any) => {
        if (!map) return;

        // 기존 지도 상 마커 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        const currentZoom = map.getZoom();
        if (currentZoom < 15) {
            setDisplayedStations([]);
            return;
        }

        const newMarkers: any[] = [];
        const stationsInView: ChargingStation[] = [];
        const mapBounds = map.getBounds();

        DUMMY_STATIONS.forEach(station => {
            const markerPosition = new (window as any).naver.maps.LatLng(station.position.lat, station.position.lng);
            if (mapBounds.hasLatLng(markerPosition)) {
                stationsInView.push(station);
                const marker = new (window as any).naver.maps.Marker({
                    position: markerPosition,
                    map: map,
                    title: station.addr,
                });
                newMarkers.push(marker);

                (window as any).naver.maps.Event.addListener(marker, 'click', () => {
                    const infoWindow = new (window as any).naver.maps.InfoWindow({
                        content: `
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
                                ">닫기</button>
                            </div>
                        `,
                        maxWidth: 200,
                    });
                    infoWindow.open(map, marker);
                    setTimeout(() => {
                        document.getElementById(`reserve-btn-${station.id}`)?.addEventListener('click', () => {
                            setIsReservationPanelVisible(true);
                            setSelectedStationAddress(station.addr);
                            infoWindow.close();
                        });
                        document.getElementById(`cancel-btn-${station.id}`)?.addEventListener('click', () => {
                            infoWindow.close();
                        });
                    }, 0);
                });
            }
        });
        markersRef.current = newMarkers;
        setDisplayedStations(stationsInView);
    };

    const centerMapOnStation = (station: ChargingStation) => {
        if (mapInstance && station) {
            const newCenter = new (window as any).naver.maps.LatLng(station.position.lat, station.position.lng);
            mapInstance.setCenter(newCenter);
            // mapInstance.setZoom(15);
        }
    };

    // useEffect 1: 네이버 지도 API 로드 및 초기 지도 객체 생성
    useEffect(() => {
        const scriptId = 'naver-map-script';
        const existingScript = document.getElementById(scriptId);

        const loadMap = () => {
            const naver = (window as any).naver;
            if (!naver || !naver.maps || !naver.maps.Service) {
                setTimeout(loadMap, 100);
                return;
            }
            const initialStation = DUMMY_STATIONS[0];
            if (!initialStation) {
                console.error('더미 데이터가 비어 있어 초기 지도를 생성할 수 없습니다.');
                return;
            }
            const centerLocation = new naver.maps.LatLng(initialStation.position.lat, initialStation.position.lng);
            const map = new naver.maps.Map(mapRef.current!, {
                center: centerLocation,
                zoom: 15,
            });
            setMapInstance(map);
        };

        if (!existingScript) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_API_KEY}&submodules=geocoder`;
            script.async = true;
            script.onload = loadMap;
            document.head.appendChild(script);
        } else {
            loadMap();
        }

        return () => {
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
        };
    }, []);

    // useEffect 2: 지도 인스턴스가 생성되면 이벤트 리스너 추가
    useEffect(() => {
        if (mapInstance) {
            (window as any).naver.maps.Event.addListener(mapInstance, 'idle', () => updateMarkersInViewport(mapInstance));
            updateMarkersInViewport(mapInstance);
        }
    }, [mapInstance]);

    const handleSearch = () => {
        if (searchKeyword.trim() !== '' && mapInstance) {
            const naver = (window as any).naver;
            naver.maps.Service.geocode(
                { query: searchKeyword },
                (status: string, response: any) => {
                    if (status === naver.maps.Service.Status.OK && response.v2.addresses.length > 0) {
                        const { x, y } = response.v2.addresses[0];
                        const centerLocation = new naver.maps.LatLng(parseFloat(y), parseFloat(x));
                        mapInstance.setCenter(centerLocation);
                        updateMarkersInViewport(mapInstance);
                    } else {
                        alert('주소 변환에 실패했습니다.');
                    }
                }
            );
        }
    };

    // const handleSearch = () => {
    //     if (searchKeyword.trim() !== '' && mapInstance) {       
    //         const CLIENT_ID = 'VZDweLJfznylsIvzK3r7';
    //         const CLIENT_SECRET = 'dUEPQGCJ9y';

    //         // 2. 지역 검색 API URL을 정의하고, 검색어를 URL 인코딩합니다.
    //         const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(searchKeyword)}`;

    //         fetch(apiUrl, {
    //             method: 'GET',
    //             headers: {
    //                 'X-Naver-Client-Id': CLIENT_ID,
    //                 'X-Naver-Client-Secret': CLIENT_SECRET
    //             }
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 // 3. 검색 결과가 있는지 확인합니다.
    //                 if (data.items && data.items.length > 0) {
    //                     // 첫 번째 검색 결과의 좌표(mapx, mapy)를 가져옵니다.
    //                     const { mapx, mapy } = data.items[0];

    //                     // 4. 네이버 좌표 변환 서비스를 사용하여 WGS84 좌표로 변환합니다.
    //                     const naver = (window as any).naver;
    //                     naver.maps.Service.transCoord(
    //                         {
    //                             x: parseFloat(mapx),
    //                             y: parseFloat(mapy),
    //                             fromCoord: naver.maps.TransCoord.FROM_NAVER,
    //                             toCoord: naver.maps.TransCoord.TO_EPSG4326
    //                         },
    //                         (status: string, response: TransCoordResponse) => {
    //                             if (status === naver.maps.Service.Status.OK) {
    //                                 const { x, y } = response.result;
    //                                 const centerLocation = new naver.maps.LatLng(y, x);
    //                                 mapInstance.setCenter(centerLocation);
    //                                 updateMarkersInViewport(mapInstance);
    //                             } else {
    //                                 alert('좌표 변환에 실패했습니다.');
    //                             }
    //                         }
    //                     );
    //                 } else {
    //                     alert('검색 결과가 없습니다.');
    //                 }
    //             })
    //             .catch(error => {
    //                 console.error('API 호출 중 오류 발생:', error);
    //                 alert('검색 기능을 사용할 수 없습니다.');
    //             });
    //     }
    // };

    const availableTimeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = String(i).padStart(2, '0');
        const status = (i === 15 || i === 23) ? 'unavailable' : 'available';
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
            const selectedStation = DUMMY_STATIONS.find(station => station.addr === selectedStationAddress);
            if (selectedStation) {
                centerMapOnStation(selectedStation);
            }
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
        station: selectedStationAddress
    };

    return (
        <div className="container" onMouseUp={handleDragEnd}>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="충전소/지역/도로명 검색"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                />
                <select defaultValue={"충전 타입"}>
                    <option>충전 타입</option>
                    <option>급속</option>
                    <option>완속</option>
                </select>
                <select defaultValue={"충전기 타입"}>
                    <option>충전기 타입</option>
                    <option>B타입(5핀)</option>
                    <option>C타입(5핀)</option>
                    <option>BC타입(5핀)</option>
                    <option>BC타입(7핀)</option>
                </select>
                <button onClick={handleSearch}>검색</button>
            </div>
            <div className="main-content">
                <div className={`details-panel ${isSidebarOpen ? 'open' : ''}`}>
                    <h2>충전소 상세 정보</h2>
                    <p>조회된 리스트 기준 상세 정보</p>
                    <ul className="station-list">
                        {displayedStations.length > 0 ? (
                            displayedStations.map((station, index) => (
                                <li key={index} className="station-item">
                                    <h4 className="station-title">{station.addr}</h4>
                                    <p>상태: <strong>{station.cpStat}</strong></p>
                                    <p>타입: {station.chargeTp}, {station.cpTp}</p>
                                    <button
                                        className="reserve-button-small"
                                        onClick={() => {
                                            setSelectedStationAddress(station.addr);
                                            setIsReservationPanelVisible(true);
                                            centerMapOnStation(station);
                                        }}
                                    >
                                        예약
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p>현재 지도에 보이는 충전소가 없습니다.</p>
                        )}
                    </ul>
                </div>
                <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? '◀' : '▶'}
                </button>
                <div className="map-container" ref={mapRef} />
                <div className={`reservation-panel ${isReservationPanelVisible ? 'visible' : ''}`}>
                    <div className="panel-header">
                        <h3>예약하기</h3>
                        <p className="station-title">{selectedStationAddress}</p>
                    </div>
                    <div className="panel-body">
                        <div className="reservation-section">
                            <div className="section-header">날짜 선택</div>
                            <div className="date-picker">
                                <Calendar
                                    selectedDate={selectedDate}
                                    onSelectDate={setSelectedDate}
                                    unavailableDates={['2025-08-14']}
                                />
                            </div>
                        </div>
                        <div className="reservation-section">
                            <div className="section-header">
                                시간 선택
                                <span className="total-time">{reservationTimeDisplay}</span>
                            </div>
                            <div className="time-selector-container">
                                <div className="time-grid-scroller">
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
                            <div className="time-legend">
                                <span className="time-legend-item"><span className="unavailable-box"></span> 예약불가</span>
                                <span className="time-legend-item"><span className="available-box"></span> 가능</span>
                                <span className="time-legend-item"><span className="selected-box"></span> 선택</span>
                            </div>
                        </div>
                        <div className="panel-footer">
                            <button className="reserve-button" onClick={handleReserve}>예약하기</button>
                            <button className="cancel-button" onClick={() => setIsReservationPanelVisible(false)}>취소</button>
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