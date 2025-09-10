import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import React, { useState } from 'react'
import { format, parse } from 'date-fns'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { CahrgerTypes } from './UserInfoData';
declare const daum: any;
interface chargerInfoProp {
  addr: string,
  addrDetail: string,
  chargerTel: string,
  chargerTp:string,
  chargerSocket: string,
  supplyPower: string,
  operator: string,
  membership: string,
  openTime: string,
  closeTime: string,
  payHour: string,
  remarks: string
}

const ChargerInfoSection: React.FC = () => {
  const [chargerInfo, setChargerInfo] = useState<chargerInfoProp>({
    addr: '',
    addrDetail: '',
    chargerTel: '',
    chargerTp:'',
    chargerSocket: '',
    supplyPower: '',
    operator: '',
    membership: 'N',
    openTime: '00:00:00',
    closeTime: '23:59:59',
    payHour: '',
    remarks: ''
  })

  const handleSelectChange = (event: SelectChangeEvent) => {
    if (event.target.name == 'chargerSocket') {
      setChargerInfo((prev) => ({
        ...prev,
        chargerSocket: event.target.value
      }))
    }
  };

  const handleInputChange = (field: keyof chargerInfoProp) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setChargerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  };

  const handleCheckboxChange = (event: React.SyntheticEvent<Element, Event>, isChecked: boolean) => {
    setChargerInfo((prev) => ({
      ...prev,
      membership: isChecked ? 'Y' : 'N' // true면 'Y', false면 'N'으로 설정
    }))
  };

  // 폼 제출 처리 함수
  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  try {
    const payload = {
      ... chargerInfo,
      //아이디 로그인한 아이디 가져와야함
      userId: '1',
    };

    const response = await fetch('http://localhost:80/evlink/api/charger/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
    } else {
      alert(`오류: ${result.message}`);
    }
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    alert('데이터 전송에 실패했습니다. 네트워크 연결을 확인해주세요.');
  }
};


  // 다음 우편번호 서비스 호출 함수
  const getAddress = () => {
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
          addrDetail: '' // 주소 검색 시 상세주소는 비워줌
        }));
      }
    }).open();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField label="주소" name="addr" size="small" value={chargerInfo.addr} margin="dense" variant="standard" InputProps={{ readOnly: true }} required style={{ margin: "9px", width: "350px" }} />

          <Button variant="contained" size="small" onClick={getAddress} sx={{ mt: 2, backgroundColor: '#0033A0' }}>검색</Button>

        </Box>
        <TextField label="상세주소" name="addrDetail" size="small" value={chargerInfo.addrDetail} margin="dense" variant="standard" onChange={handleInputChange('addrDetail')} required style={{ margin: "9px", width: "440px" }} /><br />
        <TextField label="연락처" name="chargerTel" size="small" value={chargerInfo.chargerTel} margin="dense" variant="standard" onChange={handleInputChange('chargerTel')} required style={{ margin: "9px" }} /><br />
        <RadioGroup
        row
        name="chargerTp"
        value={chargerInfo.chargerTp}
        onChange={handleInputChange('chargerTp')}
    >
        <FormControlLabel value="급속" control={<Radio />} label="급속" />
        <FormControlLabel value="완속" control={<Radio />} label="완속" />
    </RadioGroup>
        <FormControl style={{ margin: "15px 8px" }}>
          <FormLabel>충전방식</FormLabel>
          <RadioGroup row name="chargerSocket" value={chargerInfo.chargerSocket} onChange={handleSelectChange}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="caption table" sx={{ borderTop: "1px solid rgba(194, 194, 194, 0.6)" }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">선택</TableCell>
                    <TableCell align="center">종류</TableCell>
                    <TableCell align="center">설명</TableCell>
                    <TableCell align="center">충전소켓</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {CahrgerTypes.map((opt) => (
                    <TableRow key={opt.id}>
                      <TableCell align="center">
                        <FormControlLabel value={opt.id} control={<Radio />} label="" />
                      </TableCell>
                      <TableCell align="center">
                        {opt.label}
                      </TableCell>
                      <TableCell align="center">
                        {opt.description}
                      </TableCell>
                      <TableCell align="center">
                        <img src={`${process.env.PUBLIC_URL}/${opt.img}`} alt={opt.label} width={60} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </RadioGroup>
        </FormControl><br />
        <TextField label="최대출력(kW)" name="supplyPower" size="small" value={chargerInfo.supplyPower} margin="dense" variant="standard" onChange={handleInputChange('supplyPower')} required style={{ margin: "9px" }} /><br />
        <Box display="flex" alignItems="center" gap={2}>
          <TextField label="충전사업자" name="operator" size="small" value={chargerInfo.operator} margin="dense" variant="standard" onChange={handleInputChange('operator')} required style={{ margin: "9px" }} />
          <FormControlLabel checked={chargerInfo.membership === 'Y'} onChange={handleCheckboxChange} control={<Checkbox />} label="회원여부" sx={{ mt: '6px' }} /> <br />
        </Box>
        <FormControl style={{ margin: "15px 8px" }}>
          <FormLabel>사용허가시간</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DemoContainer components={['TimePicker', 'TimePicker']}>
              <TimePicker
                label="시작시간"
                name="openTime"
                // 문자열을 Date 객체로 변환하여 TimePicker의 value로 사용
                value={parse(chargerInfo.openTime, 'HH:mm:ss', new Date())}
                onChange={(newValue) => {
                  if (newValue) {
                    setChargerInfo((prev) => ({ ...prev, openTime: format(newValue as Date, 'HH:mm:ss') }));
                  }
                }}
              />
              <TimePicker
                label="종료시간"
                name="closeTime"
                // 문자열을 Date 객체로 변환하여 TimePicker의 value로 사용
                value={parse(chargerInfo.closeTime, 'HH:mm:ss', new Date())}
                onChange={(newValue) => {
                  if (newValue) {
                    setChargerInfo((prev) => ({ ...prev, closeTime: format(newValue as Date, 'HH:mm:ss') }));
                  }
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl><br />
        <TextField label="시간당 주차 이용요금" name="payHour" size="small" value={chargerInfo.payHour} margin="dense" variant="standard" onChange={handleInputChange('payHour')} required style={{ marginLeft: "9px", marginBottom: "35px" }} /><br />
        <FormControl fullWidth>
          <TextField label="특이사항" name="remarks" multiline variant="outlined" value={chargerInfo.remarks} onChange={handleInputChange('remarks')} rows={5}
            sx={{ '& .MuiInputBase-root': { overflowY: 'auto', }, '& textarea': { resize: 'none', }, }} />
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" size="small" type="submit" sx={{ backgroundColor: '#0033A0' }}>저장</Button>
        </Box>
      </form>
    </div>
  )
}

export default ChargerInfoSection