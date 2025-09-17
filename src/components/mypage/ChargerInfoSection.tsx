import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, SelectChangeEvent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CahrgerTypes } from './UserInfoData';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { BASE_URL } from '../../auth/constants';

declare const daum: any;

interface chargerInfoProp {
  user_id?:number;
  charger_id?:number; // 주소ID
  addr:string; // 주소
  addr_detail:string; // 상세주소
  charger_tel:string; // 연락처
  latitude:string; // 위도
  longitude:string; // 경도
  charger_tp:string; // 충전기타입
  charger_socket:string; // 충전방식(소켓)
  supply_power:string; // 공급용량(Kw)
  operator:string; // 충전사업자
  membership:boolean; // 충전사업자 회원여부
  open_time:Dayjs | null; // 예약가능한 시작 시간
  close_time:Dayjs | null; // 예약가능한 종료 시간
  res_yn:boolean; // 예약가능여부
  pay_hour:string; // 시간당 주차요금
  pay_total:string; // 이용요금(충전요금+주차비)
  remarks:string; // 특이사항
  user_tp:string;
}

const ChargerInfoSection: React.FC<{userId:number}> = ({userId}) => {
  const [chargerInfo, setChargerInfo] = useState<chargerInfoProp>({
    addr:'',
    addr_detail:'',
    charger_tel:'',
    latitude:'',
    longitude:'',
    charger_tp:'',
    charger_socket:'',
    supply_power:'',
    operator:'',
    membership:false,
    open_time:null,
    close_time:null,
    res_yn:false,
    pay_hour:'',
    pay_total:'',
    remarks:'',
    user_tp:''
  })

  const handleSelectChange = (event: SelectChangeEvent) => {
    if(event.target.name == 'charger_socket') {
      setChargerInfo((prev)=>({
        ...prev,
        charger_socket: event.target.value
      }))
    }
  };

  const handleInputChange = (field: keyof chargerInfoProp) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target
    setChargerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  };

  const handleCheckboxChange = (field: keyof chargerInfoProp) => (event: React.SyntheticEvent<Element, Event>, isChecked: boolean) => {
    setChargerInfo((prev)=>({
        ...prev,
        [field]: isChecked
    }))
  };

  // 전송할 데이터 검증
  const beforeValidate = () => {
      if (!chargerInfo.open_time || !chargerInfo.close_time) {
      alert('공유시간(시작/종료)을 모두 선택해주세요.');
      return false;
    }
    return true;
  }

  // 폼 제출 처리 함수
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!beforeValidate()) return;

    try {
      let response:any = null;
      if(chargerInfo.charger_id) {
        response = await axios.put(`${BASE_URL}/mypage/charger/${chargerInfo.charger_id}`, chargerInfo, {
          headers:{"Content-Type":"application/json"},
          withCredentials: true
        });
      }else{
        response = await axios.post(`${BASE_URL}/mypage/charger/add`, chargerInfo, {
          headers: {"Content-Type":"application/json"},
          withCredentials: true
        });
      }
      // console.log(response)

      if (response.data.success) {
        console.log(response.data.message);
      } else {
        console.log(`오류: ${response.data.message}`);
      }
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      alert('데이터 전송에 실패했습니다. 네트워크 연결을 확인해주세요.');
    }
  };


  // 다음 우편번호 서비스 호출 함수
  const getAddress = () => {
    if (!(window as any).daum?.Postcode) {
      alert('주소 검색 스크립트가 아직 로드되지 않았습니다.');
      return;
    }
    new daum.Postcode({
      oncomplete: function (data: any) {
        let fullAddr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        let extraAddr = '';
        if (data.userSelectedType === 'R') {
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')';
          }
        }
        setChargerInfo(prev => ({
          ...prev,
          addr: fullAddr + extraAddr,
          addr_detail: '' // 주소 검색 시 상세주소는 비워줌
        }));
      }
    }).open();
  };

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`${BASE_URL}/mypage/charger/${userId}`, {
        withCredentials: true
      })
      // console.log(response.data)
      if(response.data) {
        const chargerData = {
          user_id: response.data.userId,
          charger_id: response.data.chargerId,
          addr: response.data.addr,
          addr_detail: response.data.addrDetail,
          charger_tel: response.data.chargerTel,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          charger_tp: response.data.chargerTp,
          charger_socket: response.data.chargerSocket,
          supply_power: response.data.supplyPower,
          operator: response.data.operator,
          membership: response.data.membership,
          open_time: dayjs(response.data.openTime, "HH:mm:ss"),
          close_time: dayjs(response.data.closeTime, "HH:mm:ss"),
          res_yn: response.data.resYn,
          pay_hour: response.data.payHour,
          pay_total: response.data.payTotal,
          remarks: response.data.remarks,
          user_tp: response.data.user_tp
        }
        setChargerInfo(chargerData)
      }else{
        setChargerInfo((prev)=>({
          ...prev,
          user_id: userId
        }))
      }
    }
    getData()
  }, [])

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'stretch', sm: 'flex-end' }, mb: 3 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label htmlFor="addr" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>주소</label>
            <input 
              id="addr"
              type="text"
              name="addr" 
              value={chargerInfo.addr} 
              readOnly
              required 
              style={{
                width: '100%',
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

          <Button 
            variant="contained" 
            size="medium" 
            onClick={getAddress} 
            sx={{ 
              backgroundColor: '#0033A0',
              minWidth: '100px',
              height: '48px',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#002080'
              }
            }}
          >
            검색
          </Button>
        </Box>
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="addr_detail" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>상세주소</label>
          <input 
            id="addr_detail"
            type="text"
            name="addr_detail" 
            value={chargerInfo.addr_detail} 
            required 
            onChange={handleInputChange('addr_detail')}
            style={{
              width: '100%',
              maxWidth: '784px',
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
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="charger_tel" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>연락처</label>
          <input 
            id="charger_tel"
            type="tel"
            name="charger_tel" 
            value={chargerInfo.charger_tel} 
            required 
            onChange={handleInputChange('charger_tel')}
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
        <Box sx={{ mb: 3 }}>
          <FormLabel sx={{ fontSize: '16px', fontWeight: '500', color: '#333', mb: 2, display: 'block' }}>충전기 타입</FormLabel>
          <RadioGroup 
            row 
            name="charger_tp" 
            value={chargerInfo.charger_tp} 
            onChange={handleInputChange('charger_tp')}
            sx={{ flexWrap: 'wrap', gap: 1 }}
          >
            <FormControlLabel 
              value="급속" 
              control={<Radio sx={{ '&.Mui-checked': { color: '#0033A0' } }} />} 
              label="급속" 
              sx={{ mr: 3 }}
            />
            <FormControlLabel 
              value="완속" 
              control={<Radio sx={{ '&.Mui-checked': { color: '#0033A0' } }} />} 
              label="완속" 
            />
          </RadioGroup>
        </Box>
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
                        name="charger_socket"
                        value={opt.id}
                        checked={chargerInfo.charger_socket === opt.id}
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
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="supply_power" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>공급용량(kW)</label>
          <input 
            id="supply_power"
            type="number"
            name="supply_power" 
            value={chargerInfo.supply_power} 
            required 
            onChange={handleInputChange('supply_power')}
            style={{
              width: '100%',
              maxWidth: '200px',
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'flex-start', sm: 'flex-end' }, mb: 3 }}>
          <div style={{ minWidth: 0 }}>
            <label htmlFor="operator" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>충전사업자</label>
            <input 
              id="operator"
              type="text"
              name="operator" 
              value={chargerInfo.operator} 
              required 
              onChange={handleInputChange('operator')}
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
          <FormControlLabel 
            required 
            checked={chargerInfo.membership} 
            onChange={handleCheckboxChange('membership')} 
            control={<Checkbox sx={{ '&.Mui-checked': { color: '#0033A0' } }} />} 
            label="회원여부" 
            sx={{ mt: { xs: 1, sm: 0 } }} 
          />
        </Box>
        <FormControl sx={{ margin: "20px 0" }}>
          <FormLabel sx={{ fontSize: '16px', fontWeight: '500', color: '#333', mb: 2 }}>공유시간</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems={{ xs: 'stretch', sm: 'center' }} 
              sx={{ mt: 1 }}
            >
              <TimePicker
                label="시작시간"
                name="open_time"
                views={['hours']}
                format="HH:mm"
                ampm={true}
                timeSteps={{minutes:60}}
                value={chargerInfo.open_time}
                onChange={(newValue) => setChargerInfo((prev)=>({...prev, open_time: newValue}))}
                slotProps={{
                  textField: {
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }
                  },
                  layout: {
                    sx: {
                      '& .MuiMultiSectionDigitalClockSection-root': {
                        scrollbarGutter: 'stable both-edges',
                        '& .MuiList-root': { overflowY: 'scroll' }
                      },
                      '& .MuiDigitalClock-root .MuiList-root': {
                        overflowY: 'scroll',
                        scrollbarGutter: 'stable both-edges'
                      },
                    }
                  }
                }}
              />
              <TimePicker
                label="종료시간"
                name="close_time"
                views={['hours']}
                format="HH:mm"
                ampm={true}
                timeSteps={{minutes:60}}
                value={chargerInfo.close_time}
                onChange={(newValue) => setChargerInfo((prev)=>({...prev, close_time: newValue}))}
                slotProps={{
                  textField: {
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }
                  },
                  layout: {
                    sx: {
                      '& .MuiMultiSectionDigitalClockSection-root': {
                        scrollbarGutter: 'stable both-edges',
                        '& .MuiList-root': { overflowY: 'scroll' }
                      },
                      '& .MuiDigitalClock-root .MuiList-root': {
                        overflowY: 'scroll',
                        scrollbarGutter: 'stable both-edges'
                      },
                    }
                  }
                }}
              />
              <FormControlLabel 
                required 
                checked={chargerInfo.res_yn} 
                onChange={handleCheckboxChange('res_yn')} 
                control={<Checkbox sx={{ '&.Mui-checked': { color: '#0033A0' } }} />} 
                label="공유여부" 
                sx={{ mt: { xs: 1, sm: 0 } }} 
              />
            </Stack>
          </LocalizationProvider>
        </FormControl>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'flex-start', sm: 'flex-end' }, mb: 3 }}>
          <div>
            <label htmlFor="pay_hour" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>주차 이용요금(시간당)</label>
            <input 
              id="pay_hour"
              type="number"
              name="pay_hour" 
              value={chargerInfo.pay_hour} 
              required 
              onChange={handleInputChange('pay_hour')}
              style={{
                width: '100%',
                maxWidth: '200px',
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
          <FormLabel sx={{ fontSize: '14px', fontWeight: '500', color: '#333', mt: { xs: 1, sm: 0 } }}>
            예상 청구비용 : {chargerInfo.pay_total}
          </FormLabel>
        </Box>
        <FormControl fullWidth sx={{ marginTop: 4 }}>
          <div>
            <label htmlFor="remarks" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#333' }}>특이사항</label>
            <textarea 
              id="remarks"
              name="remarks" 
              value={chargerInfo.remarks} 
              onChange={handleInputChange('remarks')}
              rows={5}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#fff',
                resize: 'none',
                overflowY: 'auto',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0033A0'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
        </FormControl>
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

export default ChargerInfoSection