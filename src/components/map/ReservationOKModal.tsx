import React, { useEffect, useState } from 'react';
import '../map/ReservationModal.css'; // 모달 스타일을 위한 CSS 파일

interface ReservationModalProps {
  onClose: () => void;
  reservationDetails: {
    resDate: string;
    resStartTime: string;
    resEndTime: string;
    resAddr: string;
    resPayTotalHour:string;
  };
}

const ReservationOKModal: React.FC<ReservationModalProps> = ({ onClose, reservationDetails }) => {



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
              <span>{reservationDetails.resStartTime}~{reservationDetails.resEndTime}</span>
            </div>            
            <div className="info-item">
              <label>충전소명</label>
              <span>{reservationDetails.resAddr}</span>
            </div>
          </div>
          <hr/>
          <h1>예약이 완료 되셨습니다~!</h1>
        </div>
        {/* <div className="modal-footer">
          <button className="submit-button" onClick={handleReservationSubmit}>예약 완료</button>
        </div> */}
      </div>
    </div>
  );
};

export default ReservationOKModal;