import React, { useEffect, useState } from 'react';
import '../map/ReservationModal.css'; // 모달 스타일을 위한 CSS 파일
import { CheckoutPage } from './Checkout';

interface ReservationModalProps {
  onClose: () => void;
  reservationDetails: {
    date: string;
    time: string;
    station: string;
  };
}

const TossCashModal: React.FC<ReservationModalProps> = ({ onClose, reservationDetails }) => {
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [request, setRequest] = useState('');
  const [cash, setCash] = useState(parseInt(reservationDetails.time) * 2000)

  const handleReservationSubmit = () => {
    // 예약 정보를 서버로 전송하는 로직을 여기에 추가
    console.log('예약 정보 제출:', {
      ...reservationDetails,
      userName,
      phone,
      email,
      purpose,
      request
    });
    alert('예약이 완료되었습니다!');
    onClose();
  };

  useEffect(() => {
    setCash(parseInt(reservationDetails.time) * 2000)
  }, [reservationDetails.time]);

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
              <span>{reservationDetails.date}</span>
            </div>
            <div className="info-item">
              <label>예약 시간</label>
              <span>{reservationDetails.time}</span>
            </div>
            <div className="info-item">
              <label>예약 인원</label>
              <span>1명</span>
            </div>
            <div className="info-item">
              <label>충전소명</label>
              <span>{reservationDetails.station}</span>
            </div>
            <div className="info-item">
              <label>금액</label>
              <span>(시간당 2,000원이라는 가정하에) {parseInt(reservationDetails.time) * 2000}원</span>
            </div>
          </div>
          <hr/>
          <CheckoutPage value= {cash} />
        </div>
        {/* <div className="modal-footer">
          <button className="submit-button" onClick={handleReservationSubmit}>예약 완료</button>
        </div> */}
      </div>
    </div>
  );
};

export default TossCashModal;