import React, { useEffect, useState } from 'react'
import CommonModal from './CommonModal';
import { FormControl, TextField } from '@mui/material';
import { ReviewData } from './ReservationData';
import { getValueByDataKey } from 'recharts/types/util/ChartUtils';

interface ReviewDataProps {
    id?: number;
    content?: string;
    writer?: string;
    date?: string;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  reviewId?: number;
}

const UserHisListModal: React.FC<ModalProps> = ({ open, onClose, reviewId }) => {
    const [review, setReview] = useState<ReviewDataProps>();
    
    const handleInputChange = (field: keyof ReviewDataProps) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        setReview(prev => ({
          ...prev,
          [field]: value
        }))
      };

    useEffect(() => {
        if (!reviewId) {
            return;
        }
        if(reviewId) {
            const reviewData = ReviewData.find(item => item.id === reviewId) // axios 영역
            if (reviewData) setReview(reviewData);
        }
    },[reviewId])

    return (
        <CommonModal open={open} onClose={onClose}>
            <h2>이용후기</h2>
            <p>작성일자: {review?.date}</p>
            <FormControl fullWidth>
                <TextField label="내용을 작성하세요" name="content" multiline variant="outlined" value={review?.content} onChange={handleInputChange('content')} rows={5} 
                sx={{'& .MuiInputBase-root': {overflowY: 'auto',},'& textarea': {resize: 'none',},}}/>
            </FormControl>
        </CommonModal>
    );
}

export default UserHisListModal