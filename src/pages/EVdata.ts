export type ChargingStation = {
  id: string; // 각 충전소를 식별할 고유 ID
  position: { lat: number; lng: number };
  addr: string;
  chargeTp: string;
  cpStat: string;
  cpTp: string;
  //   cpNm: string;
  // ... 기타 상세 정보
};
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
// 더미 데이터
export const DUMMY_STATIONS: ChargingStation[] = [
  { id: 'cs1', position: { lat: 37.5009, lng: 127.0366 }, addr: '서울 강남구 테헤란로 100', chargeTp: '급속', cpStat: '충전가능', cpTp: 'B타입(5핀)' },
  { id: 'cs2', position: { lat: 37.5020, lng: 127.0420 }, addr: '서울 강남구 테헤란로 200', chargeTp: '완속', cpStat: '충전중', cpTp: 'C타입(5핀)' },
  { id: 'cs3', position: { lat: 37.5055, lng: 127.0390 }, addr: '서울 강남구 봉은사로 10', chargeTp: '급속', cpStat: '고장/점검', cpTp: 'BC타입(5핀)' },
  { id: 'cs4', position: { lat: 37.5050, lng: 127.0400 }, addr: '서울 강남구 논현로 50', chargeTp: '완속', cpStat: '통신장애', cpTp: 'DC콤보' },
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
      'C차 데모',
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
    };
  }),
];