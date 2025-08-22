import React, { useEffect, useRef, useState } from 'react';
import { DUMMY_STATIONS, ChargingStation, fetchEvStations, ChargingStations } from './EVdata';
import './Map.css';
import ReservationModal from './ReservationModal';
import Calendar from './Calendar';

// (window as any).naver.maps.Event.addListener(mapInstance, 'idle', () => {
//                     infoWindow.close();
//                 });

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Map: React.FC = () => {
    const [aiAnswer, setAiAnswer] = useState("");
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isReservationPanelVisible, setIsReservationPanelVisible] = useState(false);
    const [selectedStationAddress, setSelectedStationAddress] = useState('');
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [selectedTimeRange, setSelectedTimeRange] = useState<string[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [mapInstance, setMapInstance] = useState<any>(null);
    const markersRef = useRef<any[]>([]);

    const [displayedStations, setDisplayedStations] = useState<ChargingStation[]>([]);

    const [stations, setStations] = useState<ChargingStations[]>([]);
    const imageFileHtml = (type: string): string => {
        if (!type) return "";
        if (type === "B타입(5핀)" || type === "C타입(5핀)" || type === "BC타입(5핀)") {
            return `<img src="/images/ac5.png" alt="타입" width="40" />`;
        } else if (type === "BC타입(7핀)") {
            return `<img src="/images/ac7.png" alt="타입" width="40" />`;
        } else if (type === "DC차데모") {
            return `<img src="/images/dc_cha.png" alt="타입" width="40" />`;
        } else if (type === "AC3상") {
            return `<img src="/images/dc_combo2.png" alt="타입" width="40" />`;
        } else if (type === "AC5핀") {
            return `<img src='/images/ac5.png' width="40" alt='타입' width={40} />`;
        } else if (type === "DC콤보") {
            return `<img src="/images/dc_combo1.png" alt="타입" width="40" />`;
        } else if (type === "DC차데모+DC콤보") {
            return `<img src="/images/dc_cha.png" alt="차데모" width="40" /><img src="/images/dc_combo1.png" alt="콤보" width="40" />`;
        } else if (type === "DC차데모+AC3상") {
            return `<img src="/images/dc_cha.png" alt="차데모" width="40" /><img src="/images/dc_combo2.png" alt="AC3상" width="40" />`;
        } else if (type === "DC차데모+DC콤보+AC3상") {
            return `<img src="/images/dc_cha.png" alt="차데모" width="40" /><img src="/images/dc_combo1.png" alt="콤보" width="40" /><img src="/images/dc_combo2.png" alt="AC3상" width="40" />`;
        }
        // fallback
        return `<span>${type}</span>`;
    };
    const imageFile = (type: string) => {
        if (type === "B타입(5핀)") {
            return <img src='/images/ac5.png' alt='타입' width={40} />;
        } else if (type === "C타입(5핀)") {
            return <img src='/images/ac5.png' alt='타입' width={40} />;
        } else if (type === "BC타입(5핀)") {
            return <img src='/images/ac5.png' alt='타입' width={40} />;
        } else if (type === "BC타입(7핀)") {
            return <img src='/images/ac7.png' alt='타입' width={40} />;
        } else if (type === "DC차데모") {
            return <img src='/images/dc_cha.png' alt='타입' width={40} />;
        } else if (type === "AC3상") {
            return <img src='/images/dc_combo2.png' alt='타입' width={40} />;
        } else if (type === "AC5핀") {
            return <img src='/images/ac5.png' alt='타입' width={40} />;
        } else if (type === "DC콤보") {
            return <img src='/images/dc_combo1.png' alt='타입' width={40} />;
        } else if (type === "DC차데모+DC콤보") {
            return <><img src='/images/dc_cha.png' alt='타입' width={40} /><img src='/images/dc_combo1.png' alt='타입' width={40} /></>;
        } else if (type === "DC차데모+AC3상") {
            return <><img src='/images/dc_cha.png' alt='타입' width={40} /><img src='/images/dc_combo2.png' alt='타입' width={40} /></>;
        } else if (type === "DC차데모+DC콤보+AC3상") {
            return <><img src='/images/dc_cha.png' alt='타입' width={40} /><img src='/images/dc_combo1.png' alt='타입' width={40} /><img src='/images/dc_combo2.png' alt='타입' width={40} /></>;
        }
    }

    const updateMarkersInViewport = (map: any) => {
        if (!map) return;

        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        const currentZoom = map.getZoom();
        if (currentZoom < 15) {
            setDisplayedStations([]);
            console.log(currentZoom,displayedStations);
            return;
        }

        const newMarkers: any[] = [];
        const stationsInView: ChargingStation[] = [];
        const mapBounds = map.getBounds();

        DUMMY_STATIONS.forEach(station => {
            const markerPosition = new (window as any).naver.maps.LatLng(
                station.position.lat,
                station.position.lng
            );

            if (mapBounds.hasLatLng(markerPosition)) {
                stationsInView.push(station);
                
                // ✅ 더미데이터 마커와 실제 데이터 마커 구분
                const isDummy = DUMMY_STATIONS.some(dummy => dummy.addr === station.addr);

                const marker = new (window as any).naver.maps.Marker({
                    position: markerPosition,
                    map: map,
                    title: station.addr,
                    icon: isDummy
                        ? {
                            content: `
      <div style="position: relative; width: 36px; height: 36px; background: ${station.cpStat === "충전가능" ? '#3bf654ff;' : '#6e6e6eff;'} border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transform: translate(-50%, -100%); margin-top: 25px;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: white; border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 10px solid ${station.cpStat === "충전가능" ? '#3bf654ff;' : '#6e6e6eff;'}"></div>
        ${station.chargeTp === "급속" ? `<span style="position:absolute; top:-6px; right:-6px; font-size:18px;"><img style="width : 40px" src="https://www.gscev.com/images/common/ev/marker/marker_lightning.png" /></span>` : ""}
      </div>
    `,
                            anchor: new (window as any).naver.maps.Point(0, 100),
                        }
                        : undefined // 실제 API 데이터는 기본 마커
                });

                newMarkers.push(marker);

                const infoWindow = new (window as any).naver.maps.InfoWindow({
                    anchorSkew: true,
                    maxWidth: 200,
                });

                (window as any).naver.maps.Event.addListener(marker, 'click', () => {
                    const content = `<div style="padding: 10px; font-size: 14px;">
                                <h4>${station.csNm}</h4>
                                <p>충전기 타입: ${station.chargeTp}</p>
                                <p>충전기 상태: ${station.cpStat}</p>
                                <div><p>충전방식: ${station.cpTp}</p><div style=" background-color: #f1f1f1; border-radius:8px; padding: 1vh; display: flex; justify-content: center; align-items: center;">${imageFileHtml(station.cpTp)}</div></div>
                                <button id="reserve-btn-${station.id}" style="
                                    background-color: #0033A0;
                                    color: white;
                                    border: none;
                                    padding: 5px 10px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    margin-top: 5px;"
                                    onmouseover="this.style.background='#4285F4'"
                                    onmouseout="this.style.background='#0033A0'"
                                    >예약하기</button>
                                <button id="cancel-btn-${station.id}" style="
                                    background-color: #ccc;
                                    color: black;
                                    border: none;
                                    padding: 5px 10px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    margin-left: 5px;"
                                    onmouseover="this.style.background='#9b9b9bff'"
                                    onmouseout="this.style.background='#ccccccff'"
                                    >닫기</button>
                                </div>`;
                    infoWindow.setContent(content);
                    map.panTo(marker.getPosition());
                    infoWindow.open(map, marker);
                    setTimeout(() => {
                        const btn = document.getElementById(`reserve-btn-${station.id}`);
                        if (btn) {
                            btn.addEventListener("click", () => {
                                setSelectedStationAddress(station.addr);
                                setIsReservationPanelVisible(true);
                                centerMapOnStation(station);
                            });
                        }
                        const cbtn = document.getElementById(`cancel-btn-${station.id}`);
                        if (cbtn) {
                            cbtn.addEventListener("click", () => {
                                infoWindow.close();
                            })
                        }
                    }, 0);
                });

                (window as any).naver.maps.Event.addListener(map, 'click', () => {
                    infoWindow.close();
                });
            }
        });

        stations.forEach(station => {
            const markerPosition = new (window as any).naver.maps.LatLng(
                station.position.lat,
                station.position.lng
            );

            if (mapBounds.hasLatLng(markerPosition)) {
                // Extract charger info for compatibility with ChargingStation type
                const charger = station.chargers[0] || { chargeTp: '', cpStat: '', cpTp: '' };
                stationsInView.push({
                    ...station,
                    chargeTp: charger.chargeTp,
                    cpStat: charger.cpStat,
                    cpTp: charger.cpTp,
                });

                // ✅ 더미데이터 마커와 실제 데이터 마커 구분
                const isDummy = DUMMY_STATIONS.some(dummy => dummy.addr === station.addr);

                const marker = new (window as any).naver.maps.Marker({
                    position: markerPosition,
                    map: map,
                    title: station.addr,
                    icon: isDummy
                        ? {
                            content: `
      <div style="position: relative; width: 36px; height: 36px; background: #3bf654ff; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transform: translate(-50%, -100%);">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: white; border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 10px solid #3bf654ff;"></div>
        ${(charger.chargeTp === "급속") ? `<span style="position:absolute; top:-6px; right:-6px; font-size:18px;">⚡</span>` : ""}
      </div>
    `,
                            anchor: new (window as any).naver.maps.Point(15, 15),
                        }
                        : undefined // 실제 API 데이터는 기본 마커
                });

                newMarkers.push(marker);

                const infoWindow = new (window as any).naver.maps.InfoWindow({
                    anchorSkew: true,
                    maxWidth: 200,
                });

                (window as any).naver.maps.Event.addListener(marker, 'click', () => {
                    const content = `<div style="padding: 10px; font-size: 14px;">
                                <h4>${station.csNm}</h4>
                                <p>충전기 타입: ${charger.chargeTp}</p>
                                <p>충전기 상태: ${charger.cpStat}</p>
                                <p>충전방식: ${charger.cpTp}</p>
                                </div>`;
                    infoWindow.setContent(content);
                    infoWindow.open(map, marker);
                });

                (window as any).naver.maps.Event.addListener(map, 'click', () => {
                    infoWindow.close();
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
        const loadStations = async () => {
            const data = await fetchEvStations();
            setStations(data);
        };
        loadStations();
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
            script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=hvhbhpsxn3&submodules=geocoder';
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

    }, [mapInstance, stations]);

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

    const askAI = async () => {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: "아니, 브라우저에 있는 회색 마커들은 뭐냐구." }],
                }),
            });

            const data = await response.json();
            setAiAnswer(data.choices[0].message.content);
        } catch (error) {
            console.error("AI 호출 실패:", error);
            setAiAnswer("오류 발생 😢");
        }
    };
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
                <select>
                    <option>충전기 타입</option>
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
                                    <h4 className="station-title">{station.csNm}</h4>
                                    <hr />
                                    <p className="station-title">{station.addr}</p>
                                    <p>상태: <strong>{station.cpStat}</strong></p>
                                    <p>타입: {station.chargeTp}, {station.cpTp}</p>
                                    <div style={{ backgroundColor: '#f1f1f1', borderRadius: '8px', padding: '1vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{imageFile(station.cpTp)}</div>
                                </li>
                            ))
                        ) : (
                            <p>현재 지도에 보이는 충전소가 없습니다. 지도를 더 확대해서 장소를 찾아보세요!</p>
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
            {/* <button onClick={askAI} style={{ margin: "10px 0", padding: "8px 16px" }}>
                AI에게 질문하기
            </button>
            {aiAnswer && (
                <div style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc" }}>
                    <strong>AI 응답:</strong>
                    <p>{aiAnswer}</p>
                </div>
            )} */}
        </div>
    );
};

export default Map;