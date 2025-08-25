export type ChargingStation = {
  id: string; // 각 개인 충전소를 식별할 고유 ID
  position: { lat: number; lng: number };
  addr: string;
  chargeTp: string;
  cpStat: string;
  cpTp: string;
  csNm: string;
  // ... 기타 상세 정보
};
export interface ChargingStations {
  id: string;
  position: { lat: number; lng: number };
  addr: string;
  csNm: string;
  chargers: {
    chargeTp: string;
    cpStat: string;
    cpTp: string;
  }[];
}
// addr 충전기주소
// chargeTp 충전기타입 1:완속, 2:급속
// cpStat 충전기 상태코드  STRING  1:충전가능 2:충전중 3:고장/점검 4:통신장애 5:통신미연결
// cpTp 충전방식  STRING  1:B타입(5핀) 2:C타입(5핀) 3:BC타입(5핀) 4:BC타입(7핀) 5:C차 데모 6:AC3상 7:DC콤보 8:DC차데모+DC콤보
// cpNm 충전소명칭 STRING  충전소 명칭(ex:한전본사 남측주차장)
const guList = [
  '종로구', '중구', '용산구', '성동구', '광진구', '동대문구', '중랑구',
  '성북구', '강북구', '도봉구', '노원구', '은평구', '서대문구', '마포구',
  '양천구', '강서구', '구로구', '금천구', '영등포구', '동작구', '관악구',
  '서초구', '강남구', '송파구', '강동구'
];
const streetList = [
  '테헤란로', '서초대로', '마포대로', '동호로', '월드컵북로', '양재대로',
  '경인로', '노원로', '성북로', '강변북로', '올림픽대로', '남부순환로'
];

// 매핑 테이블
const chargeTpMap: Record<string, string> = {
  "1": "완속",
  "2": "급속",
};

const cpStatMap: Record<string, string> = {
  "1": "충전가능",
  "2": "충전중",
  "3": "고장/점검",
  "4": "통신장애",
  "5": "통신미연결",
};

const cpTpMap: Record<string, string> = {
  "01": "B타입(5핀)",
  "02": "C타입(5핀)",
  "03": "BC타입(5핀)",
  "04": "BC타입(7핀)",
  "05": "DC차데모",
  "06": "AC3상",
  "07": "DC콤보",
  "08": "DC차데모+DC콤보",
  "09": "DC차데모+AC3상",
  "10": "DC차데모+DC콤보+AC3상"
};

// 더미 데이터

export const DUMMY_STATIONS: ChargingStation[] = [
  
  ...Array.from({ length: 500 }, (_, i) => {
    const lat = 37.45 + Math.random() * 0.1;
    const lng = 126.90 + Math.random() * 0.15;
    const chargeTpList = ['완속', '급속'];
    const cpStatList = ['충전가능', '충전중', '고장/점검', '통신장애', '통신미연결'];
    const cpTpList = [
      'B타입(5핀)',
      'C타입(5핀)',
      'BC타입(5핀)',
      'BC타입(7핀)',
      'AC5핀',
      'AC3상',
      'DC콤보',
      'DC차데모+DC콤보'
    ];
    const gu = guList[Math.floor(Math.random() * guList.length)];
    const street = streetList[Math.floor(Math.random() * streetList.length)];
    const buildingNumber = Math.floor(Math.random() * 200) + 1;
    return {
      id: `cs${i + 5}`,
      position: { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) },
      addr: `서울 ${gu} ${street} ${buildingNumber}`,
      chargeTp: chargeTpList[Math.floor(Math.random() * chargeTpList.length)],
      cpStat: cpStatList[Math.floor(Math.random() * cpStatList.length)],
      cpTp: cpTpList[Math.floor(Math.random() * cpTpList.length)],
      csNm: '건물명'
    };
  }),
];
// evApi.ts

// KEPCO API 기본값
const KEPCO_API_KEY = "5F1cIB0v88jck3w9aeiJbF849KB6XDDlK334sXn3";
const KEPCO_API_URL = "/openapi/v1/EVchargeManage.do";

// 실제 데이터를 가져오는 함수
export const fetchEvStations = async (): Promise<ChargingStations[]> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("apiKey", KEPCO_API_KEY);
    queryParams.append("returnType", "json");

    const response = await fetch(`${KEPCO_API_URL}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    if (responseData && Array.isArray(responseData.data)) {
      // ✅ 좌표별 충전소 묶기
      const stationMap = new Map<string, ChargingStations>();

      responseData.data.forEach((item: any, index: number) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.longi);
        const key = `${lat},${lng}`;

        if (!stationMap.has(key)) {
          stationMap.set(key, {
            id: item.csId || `cs${index}`,
            position: { lat, lng },
            addr: item.addr || "주소 없음",
            csNm: item.csNm || "정보 없음",
            chargers: [], // ← 여러 충전기 정보 들어갈 배열
          });
        }

        // 기존 station 가져와서 chargers에 push
        const station = stationMap.get(key)!;
        station.chargers.push({
          chargeTp: chargeTpMap[item.chargeTp] || "정보 없음",
          cpStat: cpStatMap[item.cpStat] || "정보 없음",
          cpTp: cpTpMap[item.cpTp] || "정보 없음",
        });
      });

      return Array.from(stationMap.values());
    } else {
      return [];
    }
  } catch (err) {
    console.error("EV 충전소 데이터 가져오기 실패:", err);
    return [];
  }
};