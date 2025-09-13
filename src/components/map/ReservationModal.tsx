import React, { useState } from 'react';
import './ReservationModal.css'; // 모달 스타일을 위한 CSS 파일
import TossCashModal from '../tossAPI/TossCashModal';

interface ReservationModalProps {
  onClose: () => void;
  reservationDetails: {
    chargerId: number;
    resDate: string;
    resStartTime: string;
    resEndTime: string;
    resAddr: string;
    resPayTotalHour: string;
  };
}

const ReservationModal: React.FC<ReservationModalProps> = ({ onClose, reservationDetails }) => {
  const [resNm, setResNm] = useState('');
  const [resTel, setResTel] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // TossCashModal에 전달할 사용자 정보 객체
  const resInfo = { resNm, resTel, resEmail };

  const handleReservationSubmit = () => {
    // 예약 정보를 서버로 전송하는 로직을 여기에 추가
    console.log('예약 정보 제출:', {
      ...reservationDetails,
      resNm,
      resTel,
      resEmail,
    });
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
              <span>{reservationDetails.resStartTime}시 ~ {reservationDetails.resEndTime}시</span>
            </div>
            <div className="info-item">
              <label>충전소명</label>
              <span>{reservationDetails.resAddr}</span>
            </div>
            <div className="info-item">
              <label>결제 비용</label>
              <span>{reservationDetails.resPayTotalHour}원</span>
            </div>

          </div>
          <hr />
          {/* 예약자 정보 섹션 */}
          <div className="user-info-section">
            <h3 className="required-title">예약자 정보 <span className="required-text">*필수입력</span></h3>
            <div className="form-group">
              <label>예약자*</label>
              <input type="text" value={resNm} onChange={(e) => setResNm(e.target.value)} />
            </div>
            <div className="form-group">
              <label>연락처*</label>
              <input type="tel" value={resTel} onChange={(e) => setResTel(e.target.value)} />
            </div>
            <div className="form-group">
              <label>이메일*</label>
              <input type="email" value={resEmail} onChange={(e) => setResEmail(e.target.value)} />
            </div>
          </div>
        </div>
        <div>

        </div>
        <div className="modal-footer">
          <button
            className="submit-button"
            onClick={() => {
              // 필수 입력 항목 유효성 검사
              if (!resNm || !resTel || !resEmail) {
                alert('예약자 정보를 모두 입력해주세요.');
                return;
              }
              // 1. 예약 및 결제 정보 객체 생성
              const fullReservationData = {
                ...reservationDetails,
                resNm,
                resTel,
                resEmail,
              };

              // 2. 세션 스토리지에 저장 (문자열로 변환)
              sessionStorage.setItem('reservationData', JSON.stringify(fullReservationData));

              // 3. TossCashModal 렌더링
              setIsModalVisible(true);
            }}
          >
            결제 하기</button>
        </div>
        {isModalVisible && (
          <TossCashModal
            onClose={() => { console.log("토스 모달 닫아버리기."); setIsModalVisible(false) }}
            reservationDetails={reservationDetails}
            resInfo={resInfo}
          />
        )}
      </div>
    </div>
  );
};

export default ReservationModal;