import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, SelectChangeEvent } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../auth/constants';

interface commonInfoProp {
  user_id?:number;
  user_nicknm:string;
  login_id:string;
  user_phone:string;
  user_nm:string;
  user_tp:string;
}

const CommonInfoSection: React.FC<{userId:number}> = ({userId}) => {
  const [commonParams, setCommonParams] = useState<commonInfoProp>({
    user_nicknm:'',
    login_id:'',
    user_phone:'',
    user_nm:'',
    user_tp:''
  })

  // onChange 이벤트 처리 함수
  const handleInputChange = (field: keyof commonInfoProp) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setCommonParams(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // 전송할 데이터 검증
  const beforeValidate = () => {
    return true;
  }

  // 폼 제출 처리 함수
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!beforeValidate()) return;
    try{
      const response = await axios.post(`${BASE_URL}/mypage/common/save`, commonParams, {
        headers:{"Content-Type":"application/json"},
        withCredentials: true
      });

      if (response.data.success) {
        console.log(response.data.message);
      } else {
        console.log(`오류: ${response.data.message}`);
      }
    }catch(error){
      console.error('API 호출 중 오류 발생:', error);
      alert('데이터 전송에 실패했습니다. 네트워크 연결을 확인해주세요.');
    }
  }

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`${BASE_URL}/mypage/common/${userId}`, {
        withCredentials: true
      })
      // console.log(response.data)
      if(response.data) {
        const commonData = {
          user_id: response.data.user_id,
          login_id: response.data.login_id,
          user_nicknm: response.data.user_nicknm,
          user_nm: response.data.user_nm,
          user_phone: response.data.user_phone,
          user_tp: response.data.user_tp
        }
        setCommonParams(commonData)
      }
    }
    getData()
  }, [])

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label htmlFor="user_nicknm" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333', textAlign: 'left', width: '400px' }}>닉네임</label>
            <input 
              id="user_nicknm"
              type="text"
              name="user_nicknm" 
              value={commonParams.user_nicknm} 
              required 
              onChange={handleInputChange('user_nicknm')}
              style={{
                width: '400px',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#fff',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0033A0'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label htmlFor="login_id" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333', textAlign: 'left', width: '400px' }}>아이디(e-mail)</label>
            <input 
              id="login_id"
              type="email"
              name="login_id" 
              value={commonParams.login_id} 
              readOnly
              style={{
                width: '400px',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#f8f9fa',
                color: '#666',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label htmlFor="user_nm" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333', textAlign: 'left', width: '400px' }}>이름</label>
            <input 
              id="user_nm"
              type="text"
              name="user_nm" 
              value={commonParams.user_nm} 
              required 
              onChange={handleInputChange('user_nm')}
              style={{
                width: '400px',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#fff',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0033A0'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label htmlFor="user_phone" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333', textAlign: 'left', width: '400px' }}>연락처</label>
            <input 
              id="user_phone"
              type="tel"
              name="user_phone" 
              value={commonParams.user_phone} 
              required 
              onChange={handleInputChange('user_phone')}
              style={{
                width: '400px',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#fff',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0033A0'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            size="medium" 
            type="submit" 
            sx={{
              backgroundColor: '#0033A0',
              minWidth: '120px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#002080'
              }
            }}
          >
            저장
          </Button>
        </Box>
      </form>
    </div>
  )
}

export default CommonInfoSection