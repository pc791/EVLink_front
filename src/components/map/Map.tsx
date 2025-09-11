import React, { useEffect, useRef, useState } from 'react';
import { fetchEvStations, ChargingStations, fetchPrivateChargers } from './EVdata';
import './Map.css';
import ReservationModal from './ReservationModal';
import Calendar from './Calendar';
import DigitalClockValue from './Timetable';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useLocation } from 'react-router-dom';

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
    const [selectedStationPayTotal, setSelectedStationPayTotal] = useState('');
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [startChargeTime, setStartChargeTime] = useState(''); // "HH:mm"
    const [endChargeTime, setEndChargeTime] = useState(''); // "HH:mm"
    const markersRef = useRef<any[]>([]);

    const [displayedStations, setDisplayedStations] = useState<ChargingStations[]>([]);
    const [privateStations, setPrivateStations] = useState<ChargingStations[]>([]);

    //선택한 마커의 충전기id 가져오기
    const [selectedChargerId, setSelectedChargerId] = useState<number>(0);
    const [stations, setStations] = useState<ChargingStations[]>([]);

    // 타임바 관련 state
    const [leftPosition, setLeftPosition] = useState<number>(0); // percent
    const [barWidth, setBarWidth] = useState<number>(0); // percent
    const [timelineScale, setTimelineScale] = useState<number>(1440); // minutes: 1440 or 2880
    const location = useLocation();
    // const [isModal2Visible, setIsModal2Visible] = useState(false);

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
        const stationsInView: ChargingStations[] = [];
        const mapBounds = map.getBounds();

        const allStations = [...stations, ...privateStations];

        allStations.forEach(station => {
            const markerPosition = new (window as any).naver.maps.LatLng(
                station.position.lat,
                station.position.lng
            );

            if (mapBounds.hasLatLng(markerPosition)) {

                stationsInView.push({
                    ...station,
                    chargeTp: station.chargeTp,
                    resYn: station.resYn,
                    cpTp: station.cpTp,
                });

                // ✅ 마커 아이콘을 결정하는 로직 (더미데이터 제외)
                let markerIcon;
                const isPrivate = privateStations.some(pStation => pStation.chargerId === station.chargerId);

                if (isPrivate) {
                    // 개인 충전소 아이콘 🔑
                    markerIcon = {
                        content: `
                        <div style="position: relative; width: 36px; height: 36px; background: ${station.resYn === "충전가능" ? '#3bf654ff;' : '#6e6e6eff;'} border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transform: translate(-50%, -100%); margin-top: 25px;">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: white; border-radius: 50%;"></div>
                            <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 10px solid ${station.resYn === "충전가능" ? '#3bf654ff;' : '#6e6e6eff;'}"></div>
                            ${station.chargeTp === "급속" ? `<span style="position:absolute; top:-6px; right:-6px; font-size:18px;"><img style="width : 40px" src="https://www.gscev.com/images/common/ev/marker/marker_lightning.png" /></span>` : ""}
                        </div>
                    `,
                        anchor: new (window as any).naver.maps.Point(0, 50),
                    };
                } else {
                    // 일반 공공 충전소 (기본 아이콘)
                    markerIcon = undefined;
                }

                const marker = new (window as any).naver.maps.Marker({
                    position: markerPosition,
                    map: map,
                    title: station.addr,
                    icon: markerIcon
                });

                newMarkers.push(marker);
                const infoWindow = new (window as any).naver.maps.InfoWindow({
                    anchorSkew: true,
                    maxWidth: 200,
                });

                (window as any).naver.maps.Event.addListener(marker, 'click', () => {
                    const content = `<div style="padding: 10px; font-size: 14px; height: auto;">
                    <p>주소: ${station.addr}</p>
                    <p>충전기 상태: ${station.resYn}</p>
    <p>충전기 타입: ${station.chargeTp}</p>
    <div>
        <p>충전방식: ${station.cpTp}</p>
        <div style="background-color: #f1f1f1; border-radius:8px; padding: 1vh; display: flex; justify-content: center; align-items: center;">
            ${imageFileHtml(station.cpTp)}
        </div>
    </div>
    
    ${isPrivate ? `
        <button 
            id="reserve-btn-${station.chargerId}" 
            style="
                background-color: ${station.resYn === "충전가능" ? "#0033A0" : "#d3d3d3"};
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 5px;"
            ${station.resYn === "충전가능" ? "" : "disabled"}
            onmouseover="if(!this.disabled) this.style.background='#4285F4'"
            onmouseout="if(!this.disabled) this.style.background='#0033A0'"
        >예약하기</button>
        <button 
            id="cancel-btn-${station.chargerId}" 
            style="
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
    ` : ''}
</div>`;
                    infoWindow.setContent(content);
                    map.panTo(marker.getPosition());
                    infoWindow.open(map, marker);

                    if (isPrivate) {
                        setTimeout(() => {
                            const btn = document.getElementById(`reserve-btn-${station.chargerId}`);
                            if (btn) {
                                btn.addEventListener("click", () => {
                                    setSelectedChargerId(station.chargerId);
                                    setSelectedStationAddress(station.addr);
                                    setSelectedStationPayTotal(station.payTotal);
                                    setIsReservationPanelVisible(true);
                                    centerMapOnStation({ ...station });
                                });
                            }
                            const cbtn = document.getElementById(`cancel-btn-${station.chargerId}`);
                            if (cbtn) {
                                cbtn.addEventListener("click", () => {
                                    infoWindow.close();
                                });
                            }
                        }, 0);
                    }
                });
                (window as any).naver.maps.Event.addListener(map, 'click', () => {
                    infoWindow.close();
                });
            }
        });


        markersRef.current = newMarkers;
        setDisplayedStations(stationsInView);
    };


    const centerMapOnStation = (station: ChargingStations) => {
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
            const kepcoData = await fetchEvStations();
            const privateData = await fetchPrivateChargers();
            console.log('개인 충전소 데이터:', privateData);
            setStations(kepcoData); // 공공 충전소 (KEPCO)
            setPrivateStations(privateData); // 개인 충전소
        };
        loadStations();

        const loadMap = async () => {
            const naver = (window as any).naver;
            if (!naver || !naver.maps || !naver.maps.Service) {
                setTimeout(loadMap, 100);
                return;
            }
            try {
                const stations = await fetchPrivateChargers();
                if (stations.length === 0) {
                    console.error('개인 충전소 데이터가 비어 있어 초기 지도를 생성할 수 없습니다.');
                    return;
                }

                const initialStation = stations[0];

                const centerLocation = new naver.maps.LatLng(initialStation.position.lat, initialStation.position.lng);
                const map = new naver.maps.Map(mapRef.current!, {
                    center: centerLocation,
                    zoom: 15,
                });
                setMapInstance(map);

            } catch (error) {
                console.error('지도 로딩 중 오류 발생:', error);
            }
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

    const handleDragEnd = () => {
        setIsDragging(false);
        setDragStartIndex(null);
    };

    const handleReserve = () => {
        // startChargeTime과 endChargeTime이 모두 존재하고 비어있지 않은지 확인합니다.
        if (startChargeTime && endChargeTime) {
            // 예약 로직 실행
            const selectedStation = privateStations.find(station => station.addr === selectedStationAddress);
            if (selectedStation) {
                centerMapOnStation(selectedStation);
            } else {
                console.error('선택된 충전소 정보를 찾을 수 없습니다.');
                alert('예약하려는 충전소 정보를 찾을 수 없습니다.');
            }
            setIsModalVisible(true);
        } else {
            // 둘 중 하나라도 없으면 경고 메시지를 표시합니다.
            alert('시간을 선택해주세요.');
        }
    };

    const reservationTimeDisplay = (endChargeTime || startChargeTime)
        ? `${parseInt(startChargeTime).toString().padStart(2, '0')}시~${(parseInt(endChargeTime)).toString().padStart(2, '0')}시, ${parseInt(endChargeTime) - parseInt(startChargeTime)}시간`
        : '시간 선택';

    const formatSelectedDate = () => {
        if (!selectedDate) return '';
        // 직접 YYYY-MM-DD 형식의 문자열을 생성합니다.
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // 서버가 기대하는 yyyy-MM-dd 형식으로 반환
        return `${year}-${month}-${day}`;
    };

    //예약총금액 모달에 보내기
    const totalAmount = (toHours(endChargeTime) - toHours(startChargeTime) + 24) % 24 * Number(selectedStationPayTotal);
    const reservationDetails = {
        chargerId: selectedChargerId,
        resDate: formatSelectedDate(),
        resStartTime: startChargeTime, // '20'
        resEndTime: endChargeTime,
        resAddr: selectedStationAddress,
        resPayTotalHour: String(totalAmount)
    };

    // --- MUI UI에서 보내주는 시간 데이터를 가져와 가공하는 함수 ---
    function toHours(hours: string) {
        if (!hours) return NaN;
        const h = parseInt(hours, 10);
        return Number.isNaN(h) ? NaN : h;
    }

    // --- 사용자가 선택한 시간대를 시각화 시키는 useEffect 훅입니다. ---
    useEffect(() => {
        if (!startChargeTime || !endChargeTime) {
            setLeftPosition(0);
            setBarWidth(0);
            setTimelineScale(1440); // 24시간(분)
            return;
        }

        const start = toHours(startChargeTime);
        const end = toHours(endChargeTime);

        if (Number.isNaN(start) || Number.isNaN(end)) {
            setLeftPosition(0);
            setBarWidth(0);
            setTimelineScale(1440);
            return;
        }

        // 24시간 스케일
        let scale = 24;

        // 자정 넘어가는 경우 처리
        let endForCalc = end;
        if (end < start) {
            endForCalc += 24;
            scale = 48;
        }

        // 퍼센트 계산
        const leftPct = (start / scale) * 100;
        const widthPct = ((endForCalc - start) / scale) * 100;

        setTimelineScale(scale * 60);
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
                <select>
                    <option>충전기 타입</option>
                </select>
                <button onClick={handleSearch}>검색</button>
            </div>
            <div className="main-content">
                <div className="map-container" ref={mapRef} />
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
                                    <p>상태: <strong>{station.resYn}</strong></p>
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
                <div className={`reservation-panel ${isReservationPanelVisible ? 'visible' : ''}`}>

                    <div className="reservation-panel-select">
                        <div className="panel-header">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3>예약하기</h3><CloseIcon style={{ cursor: 'pointer' }} onClick={() => setIsReservationPanelVisible(false)}></CloseIcon>
                            </div>
                            <p className="station-title">{selectedStationAddress}</p>
                            <p className="station-title">금액(시간) : {selectedStationPayTotal}원</p>
                        </div>
                        <div className={`panel-body ${timetoselect ? 'time' : ''}`}>
                            <div className="reservation-section">
                                <div className="section-header">날짜 선택</div>
                                <div className="date-picker">
                                    <Calendar
                                        selectedDate={selectedDate}
                                        onSelectDate={(e) => { setSelectedDate(e); setTimetoselect(true); }}
                                        unavailableDates={['2025-08-14']}
                                    />
                                    <p>날짜를 먼저 선택해 주세요!</p>
                                    <p>그 다음에 시간을 선택해 주세요!</p>
                                    <ArrowDownwardIcon />
                                </div>
                            </div>
                            <hr />
                            {/* 시간을 DigitalClockValue로 선택하면 startChargeTime / endChargeTime이 업데이트됩니다. */}
                            <div style={{ margin: 'auto' }}>
                                <DigitalClockValue
                                    onChangeStart={(time) => setStartChargeTime(time)}
                                    onChangeEnd={(time) => setEndChargeTime(time)}
                                />
                            </div>
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
                            <div>
                                <strong>선택된 시간 : </strong>
                                {startChargeTime}시
                                {'  ~  '}
                                {endChargeTime}시
                                {'  '}
                                <span style={{ color: '#666', marginLeft: 8 }}>
                                    (이용시간: {
                                        (startChargeTime && endChargeTime)
                                            ? `${(toHours(endChargeTime) - toHours(startChargeTime) + 24) % 24}시간`
                                            : '시간을 선택해 주세요'
                                    })
                                </span>
                                <p><strong>총예약 금액 : </strong>{`${(toHours(endChargeTime) - toHours(startChargeTime) + 24) % 24 * Number(selectedStationPayTotal)}원`}</p>
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
