import { Box, Button, FormControl, FormControlLabel, FormHelperText, FormLabel, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ManufacturerData, CahrgerTypes } from './UserInfoData'
import axios from 'axios';

interface carInfoProp {
  user_id?:number;
  car_id?:number;
  car_plate:string;
  car_mf:string;
  car_model:string;
  car_year:string;
  car_socket:string;
  user_tp:string;
}

const CarInfoSection: React.FC<{userId:number}> = ({userId}) => {
  const [carInfo, setCarInfo] = useState<carInfoProp>({
    car_plate:'',
    car_mf:'',
    car_model:'',
    car_year:'',
    car_socket:'',
    user_tp:''
  })
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length:40 }, (_, i) => currentYear - i);

  const handleSelectChange = (event: SelectChangeEvent) => {
    if(event.target.name == 'car_mf') {
      setCarInfo((prev)=>({
        ...prev,
        car_mf: event.target.value,
        car_model: '',
        car_year: ''
      }))
    }
    if(event.target.name == 'car_model') {
      setCarInfo((prev)=>({
        ...prev,
        car_model: event.target.value,
        car_year: ''
      }))
    }
    if(event.target.name == 'car_year') {
      setCarInfo((prev)=>({
        ...prev,
        car_year: event.target.value
      }))
    }
    if(event.target.name == 'car_socket') {
      setCarInfo((prev)=>({
        ...prev,
        car_socket: event.target.value
      }))
    }
  };

  const handleInputChange = (field: keyof carInfoProp) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setCarInfo(prev => ({
      ...prev,
      [field]: value
    }))
  };

  // 전송할 데이터 검증
  const beforeValidate = () => {
    return true;
  }

  // 폼 제출 처리 함수
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!beforeValidate()) return;
    try{
      let response:any = null;
      if(carInfo.car_id) {
        response = await axios.put(`http://localhost/evlink/mypage/car/${carInfo.car_id}`, carInfo, {
          headers:{"Content-Type":"application/json"},
          withCredentials: true
        });
      }else{
        response = await axios.post('http://localhost/evlink/mypage/car/add', carInfo, {
          headers:{"Content-Type":"application/json"},
          withCredentials: true
        });
      }

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
        const response = await axios.get(`http://localhost/evlink/mypage/car/${userId}`, {
          withCredentials: true
        })
        // console.log(response.data)
        if(response.data) {
          const carData = {
            user_id: response.data.user_id,
            car_id: response.data.car_id,
            car_plate: response.data.car_plate,
            car_mf: response.data.car_mf,
            car_model: response.data.car_model,
            car_year: response.data.car_year,
            car_socket: response.data.car_socket,
            user_tp: response.data.user_tp
          }
          setCarInfo(carData)
        }else{
          setCarInfo((prev)=>({
            ...prev,
            user_id: userId
          }))
        }
      }
      getData()
    }, [])

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 차량 정보 선택 섹션 */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2, 
            flexWrap: 'wrap',
            alignItems: 'flex-end'
          }}>
            <FormControl 
              variant="outlined" 
              sx={{ 
                minWidth: { xs: '100%', sm: '200px' },
                maxWidth: { xs: '100%', sm: '250px' }
              }} 
              size="medium"
            >
              <InputLabel>제조사</InputLabel>
              <Select 
                label="제조사" 
                name="car_mf" 
                value={carInfo?.car_mf} 
                onChange={handleSelectChange}
                sx={{ borderRadius: '8px' }}
              >
                {ManufacturerData.map((item) => (
                  <MenuItem key={item.car_mf} value={item.car_mf}>{item.car_mf}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl 
              variant="outlined" 
              sx={{ 
                minWidth: { xs: '100%', sm: '200px' },
                maxWidth: { xs: '100%', sm: '250px' }
              }} 
              size="medium"
            >
              <InputLabel>모델</InputLabel>
              <Select 
                label="모델" 
                name="car_model" 
                value={carInfo.car_model} 
                onChange={handleSelectChange} 
                disabled={!carInfo.car_mf}
                sx={{ borderRadius: '8px' }}
              >
                {ManufacturerData.find((brand) => brand.car_mf === carInfo.car_mf)?.car_model.map((model) => (
                  <MenuItem key={model} value={model}>{model}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl 
              variant="outlined" 
              sx={{ 
                minWidth: { xs: '100%', sm: '150px' },
                maxWidth: { xs: '100%', sm: '200px' }
              }} 
              size="medium"
            >
              <InputLabel>연식</InputLabel>
              <Select 
                label="연식" 
                name="car_year" 
                value={carInfo.car_year} 
                onChange={handleSelectChange} 
                disabled={!carInfo.car_mf}
                sx={{ borderRadius: '8px' }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 차량번호 입력 */}
          <div>
            <label htmlFor="car_plate" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>차량번호</label>
            <input 
              id="car_plate"
              type="text"
              name="car_plate" 
              value={carInfo.car_plate} 
              required 
              onChange={handleInputChange('car_plate')}
              style={{
                width: '100%',
                maxWidth: '300px',
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

          {/* 충전방식 선택 */}
          <div style={{ margin: "20px 0" }}>
            <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '16px' }}>충전방식</label>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #ddd' }}>선택</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #ddd' }}>종류</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #ddd' }}>충전소켓</th>
                  </tr>
                </thead>
                <tbody>
                  {CahrgerTypes.map((opt) => (
                    <tr key={opt.id}>
                      <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'middle', borderBottom: '1px solid #ddd' }}>
                        <input
                          type="radio"
                          name="car_socket"
                          value={opt.id}
                          checked={carInfo.car_socket === opt.id}
                          onChange={handleSelectChange}
                          style={{ 
                            accentColor: '#0033A0',
                            transform: 'scale(1.2)'
                          }}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'middle', fontSize: '14px', borderBottom: '1px solid #ddd' }}>
                        {opt.label}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', verticalAlign: 'middle', borderBottom: '1px solid #ddd' }}>
                        <img 
                          src={`${process.env.PUBLIC_URL}/${opt.img}`} 
                          alt={opt.label} 
                          style={{ width: '60px', height: 'auto' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default CarInfoSection