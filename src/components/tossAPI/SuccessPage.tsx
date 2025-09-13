import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

interface ReservationData {
  chargerId: string;
  resNm: string;
  resTel: string;
  resEmail: string;
  resDate: string;
  resStartTime: string;
  resEndTime: string;
  resPayTotalHour: number;
}

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isProcessDone = useRef(false);
  // 예약 정보를 저장할 상태 변수 추가
  const [reservationInfo, setReservationInfo] = useState<ReservationData | null>(null);

  // 함수 매개변수에 타입을 명시
  const processReservationOnce = async (
    reservationData: ReservationData,
    orderId: string,
    amount: string,
    paymentKey: string
  ) => {
    const finalPayload = {
      userId: "4",
      chargerId: reservationData.chargerId,
      resNm: reservationData.resNm,
      resTel: reservationData.resTel,
      resEmail: reservationData.resEmail,
      resDate: reservationData.resDate,
      resStartTime: `${reservationData.resStartTime}:00:00`,
      resEndTime: `${reservationData.resEndTime}:00:00`,
      payTotalHour: reservationData.resPayTotalHour,
      resStatus: "R",
      useStatus: "N",
      paymentKey: paymentKey,
      orderId: orderId,
    };

    try {
      const reservationResponse = await fetch('http://localhost:80/evlink/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (!reservationResponse.ok) {
        throw new Error('예약 데이터 전송 실패');
      }
      console.log('최종 예약 정보 백엔드 전송 성공:', await reservationResponse.json());
      isProcessDone.current = true;
    } catch (error) {
      console.error('예약 정보 전송 중 오류:', error);
      alert('예약 처리에 문제가 발생했습니다. 관리자에게 문의하세요.');
    } finally {
      sessionStorage.removeItem("reservationData");
    }
  };

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const paymentKey = searchParams.get("paymentKey");

    if (!orderId || !amount || !paymentKey) {
      console.log('결제 정보가 URL에 없어 예약 처리 로직을 건너뜁니다.');
      return;
    }

    const storedData = sessionStorage.getItem("reservationData");
    const reservationData: ReservationData | null = storedData ? JSON.parse(storedData) : null;
    // 세션 스토리지 데이터 저장
    setReservationInfo(reservationData);
    if (reservationData && !isProcessDone.current) {
      // 함수 호출 인자 전달
      processReservationOnce(reservationData, orderId, amount, paymentKey);
    }
  }, [searchParams]);

  return (
    <div style={{
      marginTop: '100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div className="box_section">
        {reservationInfo ? (
          <>
            <h2>결제 성공 🎉</h2>
            <p>예약이 성공적으로 완료되었습니다.</p>
            <h3>결제 정보</h3>
            <p><strong>주문번호:</strong> {searchParams.get("orderId")}</p>
            <p><strong>결제 금액:</strong> {Number(searchParams.get("amount")).toLocaleString()}원</p>
            <hr />
            <h3>예약자 정보</h3>
            <p><strong>예약자명 : </strong> {reservationInfo.resNm}</p>
            <p><strong>연락처 : </strong> {reservationInfo.resTel}</p>
            <p><strong>이메일 : </strong> {reservationInfo.resEmail}</p>
            <p><strong>예약 날짜 : </strong> {reservationInfo.resDate}</p>
            <p><strong>예약 시간 : </strong> {`${reservationInfo.resStartTime}시 ~ ${reservationInfo.resEndTime}시`}</p>
            <hr />
          </>
        ) : (
          <p>예약 정보가 만료되었습니다. 예약내역을 확인해 주세요</p>
        )}
      </div>
      <div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
        <NavLink to='/reservelist' className="reserve-button" style={{ textDecoration: 'None' }}>예약내역 확인하기</NavLink>
        <NavLink to='/map' className="reserve-button" style={{ textDecoration: 'None' }}>지도로 이동</NavLink>
      </div>
    </div>
  );
}