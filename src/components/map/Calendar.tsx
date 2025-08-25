import React, { useState } from 'react';

interface CalendarProps {
    selectedDate: string; // YYYY-MM-DD
    onSelectDate: (date: string) => void;
    unavailableDates: string[]; // 예약불가 날짜 목록
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate, unavailableDates }) => {
    // 초기 연, 월 (selectedDate 기반)
    const [year, setYear] = useState(parseInt(selectedDate.split('-')[0], 10));
    const [month, setMonth] = useState(parseInt(selectedDate.split('-')[1], 10) - 1);

    // 이번 달 첫 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    // 오늘 날짜 문자열
    const todayStr = new Date().toISOString().slice(0, 10);

    // 달력 날짜 배열 (빈칸 포함)
    const calendarDays: (string | null)[] = [];
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        calendarDays.push(dayStr);
    }

    // 월 이동 함수
    const handlePrevMonth = () => {
        let newYear = year;
        let newMonth = month - 1;
        if (newMonth < 0) {
            newYear -= 1;
            newMonth = 11;
        }
        setYear(newYear);
        setMonth(newMonth);
    };

    const handleNextMonth = () => {
        let newYear = year;
        let newMonth = month + 1;
        if (newMonth > 11) {
            newYear += 1;
            newMonth = 0;
        }
        setYear(newYear);
        setMonth(newMonth);
    };

    // 년-월 텍스트
    const displayYearMonth = `${year}년 ${String(month + 1).padStart(2, '0')}월`;

    return (
        <div className="custom-calendar">
            <div className="calendar-header">
                <button onClick={handlePrevMonth} className="nav-button">{'<'}</button>
                <div className="year-month">{displayYearMonth}</div>
                <button onClick={handleNextMonth} className="nav-button">{'>'}</button>
            </div>

            <div className="calendar-weekdays">
                <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
            </div>

            <div className="calendar-body">
                {calendarDays.map((date, idx) => {
                    if (!date) return <div key={idx} className="calendar-empty" />;

                    const isToday = date === todayStr;
                    const isSelected = date === selectedDate;
                    const isUnavailable = unavailableDates.includes(date);

                    // 오늘 이전 날짜는 무조건 예약불가 처리
                    const isPast = date < todayStr;

                    let classes = "calendar-day";
                    if (isUnavailable || isPast) classes += " unavailable";
                    else if (isSelected) classes += " selected";
                    else if (isToday) classes += " today";

                    return (
                        <div
                            key={idx}
                            className={classes}
                            onClick={() => {
                                if (!(isUnavailable || isPast)) onSelectDate(date);
                            }}
                        >
                            {parseInt(date.split('-')[2], 10)}
                        </div>
                    );
                })}
            </div>

            <div className="calendar-legend">
                <span><span className="legend unavailable" />예약불가</span>
                <span><span className="legend today" />오늘</span>
                <span><span className="legend selected" />선택</span>
            </div>
        </div>
    );
};

export default Calendar;
