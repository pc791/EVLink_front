
export interface ChargingStations {
  chargerId: number;
  position: { lat: number; lng: number };
  addr: string;
  csNm: string;
  chargeTp: string;
  resYn: string;
  cpTp: string;
  payTotal:string;
};

// 개인 충전소 데이터를 가져오는 새로운 함수
export const fetchPrivateChargers = async (): Promise<ChargingStations[]> => {
  try {
    const response = await fetch('http://localhost:80/evlink/api/charger/list'); // Postman에서 확인된 URL
    if (!response.ok) {
      throw new Error('Failed to fetch private chargers');
    }
    const data: any[] = await response.json();

    // 백엔드 데이터 형식에 맞춰 ChargingStations 타입으로 변환
    return data.map(charger => ({
      chargerId: charger.chargerId,
      csNm: charger.csNm || '개인 충전소',
      addr: `${charger.addr} ${charger.addrDetail}`,
      // ✅ 백엔드에서 받은 필드 이름(latitude, longitude)을 사용하여 매핑
      position: { lat: charger.latitude, lng: charger.longitude },
      chargeTp: charger.chargerTp,
      resYn: charger.resYn === "Y" ? '충전가능' : '충전불가', // 상태를 `resYn` 필드로 판단
      cpTp: charger.chargerSocket,
      payTotal: charger.payTotal
    }));
  } catch (error) {
    console.error("개인 충전소 데이터 가져오기 실패:", error);
    return [];
  }
};

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
      // ✅ 모든 충전기 데이터를 배열에 담아 반환
      return responseData.data.map((item: any, index: number) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.longi);

        return {
          // id는 csId를 우선 사용하고, 없을 경우 lat, longi, cpTp를 조합하여 고유성을 확보
          id: item.csId || `${item.lat}-${item.longi}-${item.cpTp}-${index}`,
          position: { lat, lng },
          addr: item.addr || "주소 없음",
          csNm: item.csNm || "정보 없음",
          // 매핑 시, item.chargeTp가 숫자가 아닌 문자열일 수 있으므로 String()으로 처리
          chargeTp: chargeTpMap[String(item.chargeTp)] || "정보 없음",
          resYn: resYnMap[String(item.resYn)] || "정보 없음",
          cpTp: cpTpMap[String(item.cpTp)] || "정보 없음",
        };
      });
    } else {
      return [];
    }
  } catch (err) {
    console.error("EV 충전소 데이터 가져오기 실패:", err);
    return [];
  }
};



// addr 충전기주소
// chargeTp 충전기타입 1:완속, 2:급속
// resYn 충전기 상태코드  STRING  1:충전가능 2:충전중 3:고장/점검 4:통신장애 5:통신미연결
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

const resYnMap: Record<string, string> = {
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

// export const DUMMY_STATIONS: ChargingStation[] = [

//   ...Array.from({ length: 500 }, (_, i) => {
//     const lat = 37.45 + Math.random() * 0.1;
//     const lng = 126.90 + Math.random() * 0.15;
//     const chargeTpList = ['완속', '급속'];
//     const resYnList = ['충전가능', '충전중', '고장/점검', '통신장애', '통신미연결'];
//     const cpTpList = [
//       'B타입(5핀)',
//       'C타입(5핀)',
//       'BC타입(5핀)',
//       'BC타입(7핀)',
//       'AC5핀',
//       'AC3상',
//       'DC콤보',
//       'DC차데모+DC콤보'
//     ];
//     const gu = guList[Math.floor(Math.random() * guList.length)];
//     const street = streetList[Math.floor(Math.random() * streetList.length)];
//     const buildingNumber = Math.floor(Math.random() * 200) + 1;
//     return {
//       id: `cs${i + 5}`,
//       position: { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) },
//       addr: `서울 ${gu} ${street} ${buildingNumber}`,
//       chargeTp: chargeTpList[Math.floor(Math.random() * chargeTpList.length)],
//       resYn: resYnList[Math.floor(Math.random() * resYnList.length)],
//       cpTp: cpTpList[Math.floor(Math.random() * cpTpList.length)],
//       csNm: '건물명'
//     };
//   }),
// ];