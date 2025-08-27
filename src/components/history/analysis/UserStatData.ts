// 개인 충전 기록 데이터
export const MyChargingHistory = [
    {
        id: 1,
        date: "2024-01-15",
        station: "집 앞 개인 충전기",
        startTime: "09:30",
        endTime: "11:45",
        duration: 135, // 분
        kwh: 45.2,
        cost: 13500,
        carbonReduction: 18.1,
        location: "서울특별시 강남구 역삼동 123-45"
    },
    {
        id: 2,
        date: "2024-01-18",
        station: "회사 주차장 충전기",
        startTime: "14:20",
        endTime: "16:35",
        duration: 135,
        kwh: 42.8,
        cost: 12800,
        carbonReduction: 17.1,
        location: "서울특별시 강남구 테헤란로 123"
    },
    {
        id: 3,
        date: "2024-01-22",
        station: "친구집 충전기",
        startTime: "19:15",
        endTime: "21:30",
        duration: 135,
        kwh: 48.5,
        cost: 14500,
        carbonReduction: 19.4,
        location: "서울특별시 마포구 합정동 456-78"
    },
    {
        id: 4,
        date: "2024-01-25",
        station: "부모님 집 충전기",
        startTime: "08:00",
        endTime: "10:15",
        duration: 135,
        kwh: 41.3,
        cost: 12400,
        carbonReduction: 16.5,
        location: "경기도 성남시 분당구 정자동 789-12"
    },
    {
        id: 5,
        date: "2024-01-28",
        station: "휴가지 임대 충전기",
        startTime: "16:45",
        endTime: "19:00",
        duration: 135,
        kwh: 46.7,
        cost: 14000,
        carbonReduction: 18.7,
        location: "강원도 강릉시 주문진읍 321-54"
    },
    {
        id: 6,
        date: "2024-02-01",
        station: "집 앞 개인 충전기",
        startTime: "10:30",
        endTime: "12:45",
        duration: 135,
        kwh: 44.1,
        cost: 13200,
        carbonReduction: 17.6,
        location: "서울특별시 강남구 역삼동 123-45"
    },
    {
        id: 7,
        date: "2024-02-05",
        station: "회사 주차장 충전기",
        startTime: "15:20",
        endTime: "17:35",
        duration: 135,
        kwh: 43.9,
        cost: 13100,
        carbonReduction: 17.6,
        location: "서울특별시 강남구 테헤란로 123"
    },
    {
        id: 8,
        date: "2024-02-10",
        station: "친구집 충전기",
        startTime: "20:00",
        endTime: "22:15",
        duration: 135,
        kwh: 47.2,
        cost: 14100,
        carbonReduction: 18.9,
        location: "서울특별시 마포구 합정동 456-78"
    }
];

// 월별 충전 통계 데이터
export const MonthlyChargingStats = [
    {
        month: "1월",
        totalCharges: 5,
        totalKwh: 224.5,
        totalCost: 67200,
        totalDuration: 675,
        carbonReduction: 89.8
    },
    {
        month: "2월",
        totalCharges: 4,
        totalKwh: 235.2,
        totalCost: 45400,
        totalDuration: 405,
        carbonReduction: 54.1
    },
    {
        month: "3월",
        totalCharges: 2,
        totalKwh: 115.2,
        totalCost: 37400,
        totalDuration: 355,
        carbonReduction: 44.1
    },
    {
        month: "4월",
        totalCharges: 5,
        totalKwh: 324.2,
        totalCost: 70400,
        totalDuration: 605,
        carbonReduction: 254.1
    },
    {
        month: "5월",
        totalCharges: 7,
        totalKwh: 935.2,
        totalCost: 140400,
        totalDuration: 805,
        carbonReduction: 324.1
    },
    {
        month: "6월",
        totalCharges: 8,
        totalKwh: 1235.2,
        totalCost: 240400,
        totalDuration: 1405,
        carbonReduction: 554.1
    },
    {
        month: "7월",
        totalCharges: 5,
        totalKwh: 435.2,
        totalCost: 128400,
        totalDuration: 805,
        carbonReduction: 154.1
    },
    {
        month: "8월",
        totalCharges: 3,
        totalKwh: 135.2,
        totalCost: 40400,
        totalDuration: 405,
        carbonReduction: 54.1
    },
    {
        month: "9월",
        totalCharges: 0,
        totalKwh: 0,
        totalCost: 0,
        totalDuration: 0,
        carbonReduction: 0
    },
    {
        month: "10월",
        totalCharges: 0,
        totalKwh: 0,
        totalCost: 0,
        totalDuration: 0,
        carbonReduction: 0
    },
    {
        month: "11월",
        totalCharges: 0,
        totalKwh: 0,
        totalCost: 0,
        totalDuration: 0,
        carbonReduction: 0
    },
    {
        month: "12월",
        totalCharges: 0,
        totalKwh: 0,
        totalCost: 0,
        totalDuration: 0,
        carbonReduction: 0
    }
];

// 충전소별 이용 통계
export const StationUsageStats = [
    {
        station: "집 앞 개인 충전기",
        visitCount: 8,
        totalKwh: 356.2,
        totalCost: 106800,
        lastVisit: "2024-02-01"
    },
    {
        station: "회사 주차장 충전기",
        visitCount: 5,
        totalKwh: 214.3,
        totalCost: 64200,
        lastVisit: "2024-02-05"
    },
    {
        station: "친구집 충전기",
        visitCount: 3,
        totalKwh: 142.8,
        totalCost: 42800,
        lastVisit: "2024-02-10"
    },
    {
        station: "부모님 집 충전기",
        visitCount: 2,
        totalKwh: 82.6,
        totalCost: 24800,
        lastVisit: "2024-01-25"
    },
    {
        station: "휴가지 임대 충전기",
        visitCount: 1,
        totalKwh: 46.7,
        totalCost: 14000,
        lastVisit: "2024-01-28"
    }
];

// 시간대별 충전 패턴
export const TimePatternStats = [
    { hour: "07:00", usage: 1 },
    { hour: "08:00", usage: 1 },
    { hour: "09:00", usage: 1 },
    { hour: "10:00", usage: 3 },
    { hour: "14:00", usage: 3 },
    { hour: "15:00", usage: 2 },
    { hour: "16:00", usage: 2 },
    { hour: "19:00", usage: 1 },
    { hour: "20:00", usage: 1 }
];

// 요일별 충전 패턴
export const DayPatternStats = [
    { day: "월요일", usage: 2 },
    { day: "화요일", usage: 0 },
    { day: "수요일", usage: 1 },
    { day: "목요일", usage: 0 },
    { day: "금요일", usage: 2 },
    { day: "토요일", usage: 3 },
    { day: "일요일", usage: 3 }
];

export const ChargerStatData = [
    {
        month: "1월",
        totalCharges: 125,
        totalKwh: 502.3,
        avgSessionTime: 42,
        costSavings: 175000,
        carbonReduction: 125.6
    },
    {
        month: "2월",
        totalCharges: 138,
        totalKwh: 554.8,
        avgSessionTime: 44,
        costSavings: 194000,
        carbonReduction: 138.7
    },
    {
        month: "3월",
        totalCharges: 156,
        totalKwh: 625.2,
        avgSessionTime: 46,
        costSavings: 218000,
        carbonReduction: 156.3
    },
    {
        month: "4월",
        totalCharges: 142,
        totalKwh: 568.9,
        avgSessionTime: 43,
        costSavings: 199000,
        carbonReduction: 142.2
    },
    {
        month: "5월",
        totalCharges: 168,
        totalKwh: 673.4,
        avgSessionTime: 48,
        costSavings: 235000,
        carbonReduction: 168.4
    },
    {
        month: "6월",
        totalCharges: 185,
        totalKwh: 740.1,
        avgSessionTime: 50,
        costSavings: 259000,
        carbonReduction: 185.0
    }
]

export const ChargingPatternData = [
    { hour: "00:00", usage: 8 },
    { hour: "02:00", usage: 5 },
    { hour: "04:00", usage: 3 },
    { hour: "06:00", usage: 12 },
    { hour: "08:00", usage: 45 },
    { hour: "10:00", usage: 38 },
    { hour: "12:00", usage: 52 },
    { hour: "14:00", usage: 41 },
    { hour: "16:00", usage: 67 },
    { hour: "18:00", usage: 89 },
    { hour: "20:00", usage: 76 },
    { hour: "22:00", usage: 34 }
]

// 개인용 충전기 예약 및 사용 통계 데이터
export const PersonalChargerData = [
    {
        id: 1,
        chargerType: "AC 7kW",
        location: "서울시 강남구 역삼동 123-45",
        totalReservations: 156,
        totalUsageHours: 234.5,
        totalKwh: 1641.5,
        totalRevenue: 328300,
        avgRating: 4.8
    }
]

export const ChargerReservations = [
    {
        id: 1,
        userName: "김철수",
        phone: "010-1234-5678",
        carModel: "테슬라 모델 3",
        reservationDate: "2024-01-15",
        startTime: "14:00",
        endTime: "16:00",
        duration: 2,
        kwhUsed: 14.0,
        cost: 2800,
        status: "완료"
    },
    {
        id: 2,
        userName: "이영희",
        phone: "010-2345-6789",
        carModel: "현대 아이오닉 5",
        reservationDate: "2024-01-16",
        startTime: "09:00",
        endTime: "11:30",
        duration: 2.5,
        kwhUsed: 17.5,
        cost: 3500,
        status: "완료"
    },
    {
        id: 3,
        userName: "박민수",
        phone: "010-3456-7890",
        carModel: "기아 EV6",
        reservationDate: "2024-01-17",
        startTime: "19:00",
        endTime: "21:00",
        duration: 2,
        kwhUsed: 14.0,
        cost: 2800,
        status: "완료"
    },
    {
        id: 4,
        userName: "정연호",
        phone: "010-4567-8901",
        carModel: "테슬라 모델 Y",
        reservationDate: "2024-01-18",
        startTime: "10:00",
        endTime: "13:00",
        duration: 3,
        kwhUsed: 21.0,
        cost: 4200,
        status: "예약중"
    },
    {
        id: 5,
        userName: "최지영",
        phone: "010-5678-9012",
        carModel: "볼보 XC40 Recharge",
        reservationDate: "2024-01-19",
        startTime: "15:00",
        endTime: "17:00",
        duration: 2,
        kwhUsed: 14.0,
        cost: 2800,
        status: "예약중"
    }
]

export const MonthlyChargerStats = [
    {
        month: "1월",
        totalReservations: 28,
        totalHours: 42.5,
        totalKwh: 297.5,
        totalRevenue: 59500,
        peakUsageHours: "14:00-16:00"
    },
    {
        month: "2월",
        totalReservations: 32,
        totalHours: 48.0,
        totalKwh: 336.0,
        totalRevenue: 67200,
        peakUsageHours: "15:00-17:00"
    },
    {
        month: "3월",
        totalReservations: 35,
        totalHours: 52.5,
        totalKwh: 367.5,
        totalRevenue: 73500,
        peakUsageHours: "16:00-18:00"
    },
    {
        month: "4월",
        totalReservations: 30,
        totalHours: 45.0,
        totalKwh: 315.0,
        totalRevenue: 63000,
        peakUsageHours: "13:00-15:00"
    },
    {
        month: "5월",
        totalReservations: 38,
        totalHours: 57.0,
        totalKwh: 399.0,
        totalRevenue: 79800,
        peakUsageHours: "14:00-16:00"
    },
    {
        month: "6월",
        totalReservations: 42,
        totalHours: 63.0,
        totalKwh: 441.0,
        totalRevenue: 88200,
        peakUsageHours: "15:00-17:00"
    }
]

export const ChargerUsageByTime = [
    { hour: "06:00", reservations: 3, actualUsage: 2, avgDuration: 2.0, avgKwh: 14.0 },
    { hour: "08:00", reservations: 8, actualUsage: 7, avgDuration: 2.5, avgKwh: 17.5 },
    { hour: "10:00", reservations: 12, actualUsage: 10, avgDuration: 2.0, avgKwh: 14.0 },
    { hour: "12:00", reservations: 15, actualUsage: 13, avgDuration: 1.5, avgKwh: 10.5 },
    { hour: "14:00", reservations: 22, actualUsage: 19, avgDuration: 2.0, avgKwh: 14.0 },
    { hour: "16:00", reservations: 25, actualUsage: 22, avgDuration: 2.5, avgKwh: 17.5 },
    { hour: "18:00", reservations: 28, actualUsage: 25, avgDuration: 2.0, avgKwh: 14.0 },
    { hour: "20:00", reservations: 20, actualUsage: 18, avgDuration: 2.5, avgKwh: 17.5 },
    { hour: "22:00", reservations: 12, actualUsage: 10, avgDuration: 2.0, avgKwh: 14.0 },
    { hour: "00:00", reservations: 5, actualUsage: 4, avgDuration: 2.0, avgKwh: 14.0 }
]