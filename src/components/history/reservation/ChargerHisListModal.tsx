import React, { useEffect, useState } from 'react';
import CommonModal from './CommonModal';
import { ReviewData } from './ReservationData';

interface ReviewDataProps {
    id: number;
    content: string;
    writer: string;
    date: string;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  reviewId?: number;
}



const ChargerHisListModal: React.FC<ModalProps> = ({ open, onClose, reviewId }) => {
    const [review, setReview] = useState<ReviewDataProps>();

    useEffect(()=>{ 
        if (!reviewId) return;
        if(reviewId) {
            const reviewData = ReviewData.find(item => item.id === reviewId) // axios 영역
            if (reviewData) setReview(reviewData);
        }
    }, [reviewId])

    return (
        <CommonModal open={open} onClose={onClose}>
            <h2>이용후기</h2>
            <p>작성자: {review?.writer}</p>
            <p>작성일: {review?.date}</p>
            <p>내용: {review?.content}</p>
        </CommonModal>
    );
}

export default ChargerHisListModal