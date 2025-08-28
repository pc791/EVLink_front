import React, { useEffect, useState } from 'react'
import CommonModal from './CommonModal';
import { Box, Button, FormControl, TextField } from '@mui/material';
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

    // 폼 제출 처리 함수
    const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('폼이 제출되었습니다:', review)
    }

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
            <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                <h2>이용후기</h2>
                <p>작성일자: {review?.date}</p>
                <FormControl onSubmit={handleSubmit}>
                    <TextField label="내용을 작성하세요" name="content" multiline variant="outlined" value={review?.content} onChange={handleInputChange('content')} rows={5} 
                    sx={{'& .MuiInputBase-root': {overflowY: 'auto',},'& textarea': {resize: 'none',}}}/>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2}}>
                        <Button variant="contained" size="small" type="submit" sx={{backgroundColor: '#0033A0'}}>저장</Button>
                        <Button onClick={onClose} sx={{ marginLeft: '10px', color: '#ffffff', backgroundColor: '#a71300' }}>닫기</Button>
                    </Box>
                </FormControl>
            </Box>
        </CommonModal>
    );
}

export default UserHisListModal