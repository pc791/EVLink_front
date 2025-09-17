import React from 'react';
import '../map/ReservationModal.css'; // 모달 스타일을 위한 CSS 파일
import { CheckoutPage } from './Checkout';
import { BASE_URL } from '../../auth/constants';

interface TossCashModalProps {
  onClose: () => void;
  reservationDetails: {
    chargerId: number;
    resDate: string;
    resStartTime: string;
    resEndTime: string;
    resAddr: string;
    resPayTotalHour: string;
  };
  resInfo: {
    resNm: string;
    resTel: string;
    resEmail: string;
  };
}

const TossCashModal: React.FC<TossCashModalProps> = ({ onClose, reservationDetails, resInfo }) => {

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      const payload = {
        // 서버 VO에 정의된 필드명과 일치시켜야 합니다.
        // 아래 필드들은 Map.tsx에서 받아와야 합니다.
        // 예시로 '3'을 하드코딩했으니, 실제 값으로 변경해야 합니다.
        userId: "4", // 실제 로그인한 사용자 ID
        chargerId: reservationDetails.chargerId, // 예약하려는 충전기 ID
        resNm: resInfo.resNm,
        resTel: resInfo.resTel,
        resEmail: resInfo.resEmail,

        // ✅ 서버 VO에 맞게 날짜와 시간을 분리하여 전송
        // 이 데이터는 Map.tsx에서 'YYYY-MM-DD', 'HH:mm' 형식으로 받아와야 합니다.
        resDate: reservationDetails.resDate,
        resStartTime: `${reservationDetails.resStartTime}:00:00`,
        resEndTime: `${reservationDetails.resEndTime}:00:00`,

        payTotalHour: reservationDetails.resPayTotalHour, // 금액 정보
        resStatus: "R", // 예약 상태 (R: 예약 완료)
        useStatus: "N", // 이용 상태 (N: 미사용)

        // 결제 시스템에서 받은 정보
        paymentKey: paymentData.paymentKey,
        orderId: paymentData.orderId,
      };
      const response = await fetch(`${BASE_URL}/api/reservation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('예약 데이터 전송 실패');
      }

      console.log('예약 성공:', await response.json());
    } catch (error) {
      console.error('예약 처리 중 오류:', error);
      alert('예약 처리에 문제가 발생했습니다.');
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>예약 정보</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {/* 예약 정보 섹션 */}
          <div className="reservation-info-section">
            <div className="info-item">
              <label>예약 날짜</label>
              <span>{reservationDetails.resDate}</span>
            </div>
            <div className="info-item">
              <label>예약 시간</label>
              <span>{reservationDetails.resStartTime}시 ~{reservationDetails.resEndTime}시</span>
            </div>
            <div className="info-item">
              <label>충전소명</label>
              <span>{reservationDetails.resAddr}</span>
            </div>
            <div className="info-item">
              <label>결제금액</label>
              <span>{reservationDetails.resPayTotalHour}원</span>
            </div>
          </div>
          <hr />
          <CheckoutPage
            value={Number(reservationDetails.resPayTotalHour)}
          />
        </div>
      </div>

    </div>
  );
};

export default TossCashModal;