import React, { useEffect, useState } from 'react';

interface EvStationItem {
    id: string;
    addr: string;
}

const KEPCO_API_KEY = '5F1cIB0v88jck3w9aeiJbF849KB6XDDlK334sXn3';
const KEPCO_API_URL = '/openapi/v1/EVchargeManage.do';

const EvStationList: React.FC = () => {
    const [evStations, setEvStations] = useState<EvStationItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvStations = async () => {
            try {
                const queryParams = new URLSearchParams();
                queryParams.append('apiKey', KEPCO_API_KEY);
                queryParams.append('returnType', 'json');
                const response = await fetch(`${KEPCO_API_URL}?${queryParams.toString()}`);

                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                const responseData = await response.json();
                // 응답 데이터에 `data` 키가 있고, 그 값이 배열인지 확인
                if (responseData && Array.isArray(responseData.data)) {
                    // `id`와 `addr`를 포함하는 객체 배열을 바로 상태에 저장
                    setEvStations(responseData.data);
                } else {
                    // 데이터 형식이 예상과 다르거나 비어있으면 빈 배열로 설정
                    setEvStations([]);
                }

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('알 수 없는 오류 발생');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEvStations();
    }, []);

    if (loading) return <div>데이터를 불러오는 중...</div>;
    if (error) return <div>오류: {error}</div>;

    return (
        <div>
            <h1>한국전력공사 전기차 충전소 목록</h1>
            {evStations.length > 0 ? (
                <ul>
                    {evStations.map((station) => (
                        <li key={station.id}>
                            ID: {station.id}, 주소: {station.addr}
                        </li>
                    ))}
                </ul>
            ) : (
                <div>충전소 데이터가 없습니다.</div>
            )}
        </div>
    );
};

export default EvStationList;
