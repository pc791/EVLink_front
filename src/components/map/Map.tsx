import React, { useEffect, useRef, useState } from 'react';
import { DUMMY_STATIONS, ChargingStation, fetchEvStations, ChargingStations } from './EVdata';
import './Map.css';
import ReservationModal from './ReservationModal';
import Calendar from './Calendar';
import DigitalClockValue from './Timetable';

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Map: React.FC = () => {
    const [timetoselect, setTimetoselect] = useState(false);
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
    const [startChargeTime, setStartChargeTime] = useState(''); // "HH:mm"
    const [endChargeTime, setEndChargeTime] = useState(''); // "HH:mm"
    const markersRef = useRef<any[]>([]);
    const [selectedChargerType, setSelectedChargerType] = useState('충전기 타입'); // '급속', '완속'
    const [selectedChargerSocket, setSelectedChargerSocket] = useState('충전기 소켓'); // 'AC5핀', 'DC차', 등

    const [displayedStations, setDisplayedStations] = useState<ChargingStation[]>([]);

    const [stations, setStations] = useState<ChargingStations[]>([]);

    // 타임바 관련 state
    const [leftPosition, setLeftPosition] = useState<number>(0); // percent
    const [barWidth, setBarWidth] = useState<number>(0); // percent
    const [timelineScale, setTimelineScale] = useState<number>(1440); // minutes: 1440 or 2880

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
            console.log(currentZoom, displayedStations);

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

    // --- MUI UI에서 보내주는 시간 데이터를 가져와 가공하는 함수 ---
    function toMinutes(time: string) {
        if (!time) return NaN;
        const parts = time.split(':').map(s => parseInt(s, 10));
        if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return NaN;
        return parts[0] * 60 + parts[1];
    }

    // --- 사용자가 선택한 시간대를 시각화 시키는 useEffect 훅입니다. ---
    useEffect(() => {
        if (!startChargeTime || !endChargeTime) {
            setLeftPosition(0);
            setBarWidth(0);
            setTimelineScale(1440);
            return;
        }

        let startMin = toMinutes(startChargeTime);
        let endMin = toMinutes(endChargeTime);

        if (Number.isNaN(startMin) || Number.isNaN(endMin)) {
            setLeftPosition(0);
            setBarWidth(0);
            setTimelineScale(1440);
            return;
        }

        // 기본 스케일: 24시간(1440분)
        let scale = 1440;

        // 자정 넘어감 판단
        if (endMin < startMin) {
            // next day: 확장 스케일 48시간
            endMin += 1440;
            scale = 2880;
        }

        // left, width 계산 (percent)
        const leftPct = (startMin / scale) * 100;
        const widthPct = ((endMin - startMin) / scale) * 100;

        setTimelineScale(scale);
        setLeftPosition(leftPct);
        setBarWidth(Math.max(0, widthPct));
    }, [startChargeTime, endChargeTime]);

    // 라벨 텍스트 계산 (00:00, 가운데, 오른쪽)
    const leftLabel = '00:00';
    const centerLabel = timelineScale === 1440 ? '12:00' : '24:00';
    const rightLabel = timelineScale === 1440 ? '24:00' : '48:00';

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
                <select value={selectedChargerType} onChange={(e) => setSelectedChargerType(e.target.value)}>
                    <option>충전기 타입</option>
                    <option>완속</option>
                    <option>급속</option>
                </select>
                <select value={selectedChargerSocket} onChange={(e) => setSelectedChargerSocket(e.target.value)}>
                    <option>충전기 소켓</option>
                    <option>AC5핀</option>
                    <option>AC7핀</option>
                    <option>DC차데모</option>
                    <option>DC콤보1</option>
                    <option>DC콤보2</option>
                    <option>테슬라</option>
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
                    <div className={`reservation-panel-select ${timetoselect ? 'time' : ''}`}>
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
                                        onSelectDate={(e) => { setSelectedDate(e); setTimetoselect(true); }}
                                        unavailableDates={['2025-08-14']}
                                    />
                                </div>
                            </div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <hr/>
                            {/* 시간을 DigitalClockValue로 선택하면 startChargeTime / endChargeTime이 업데이트됩니다. */}
                            <DigitalClockValue
                                onChangeStart={(time) => setStartChargeTime(time)}
                                onChangeEnd={(time) => setEndChargeTime(time)}
                            />

                            <div className="time-bar-container">
                                <div className="time-bar-wrapper">
                                    {/* 타임바 배경 (원래 CSS에서 높이/배경을 정의) */}
                                    <div
                                        className="time-bar-orange"
                                        style={{
                                            left: `${leftPosition}%`,
                                            width: `${barWidth}%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="time-labels">
                                    <span className="time-label">{leftLabel}</span>
                                    <span className="time-label-center">{centerLabel}</span>
                                    <span className="time-label">{rightLabel}</span>
                                </div>
                            </div>

                            {/* 선택된 시간 표시 (가독성 좋게) */}
                            <div style={{ marginTop: '8px' }}>
                                <strong>선택된 시간:</strong>
                                <div>
                                    시작: {startChargeTime ? `${startChargeTime.replace(':', '시 ')}분` : '--'}
                                    {'  /  '}
                                    종료: {endChargeTime ? `${endChargeTime.replace(':', '시 ')}분` : '--'}
                                    {'  '}
                                    <span style={{ color: '#666', marginLeft: 8 }}>
                                        (스케일: {timelineScale === 1440 ? '24시간' : '48시간'})
                                    </span>
                                </div>
                            </div>

                            <button className="cancel-button" onClick={() => setTimetoselect(false)}>날짜 다시 선택하기</button>
                            <div className="panel-footer">
                                <button className="reserve-button" onClick={handleReserve}>예약하기</button>
                                <button className="cancel-button" onClick={() => setIsReservationPanelVisible(false)}>취소</button>
                            </div>
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
