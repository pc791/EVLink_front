import React, { useState } from 'react';
import './ReservationModal.css'; // 모달 스타일을 위한 CSS 파일

interface ReservationModalProps {
  onClose: () => void;
  reservationDetails: {
    date: string;
    time: string;
    station: string;
  };
}

const ReservationModal: React.FC<ReservationModalProps> = ({ onClose, reservationDetails }) => {
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [request, setRequest] = useState('');

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
          </div>
          <hr/>
          {/* 예약자 정보 섹션 */}
          <div className="user-info-section">
            <h3 className="required-title">예약자 정보 <span className="required-text">*필수입력</span></h3>
            <div className="form-group">
              <label>예약자*</label>
              <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>연락처*</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>이메일*</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="submit-button" onClick={handleReservationSubmit}>예약 완료</button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;