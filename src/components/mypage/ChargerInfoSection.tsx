import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import React, { useState } from 'react'
import { format, parse } from 'date-fns'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { CahrgerTypes } from './UserInfoData';

interface chargerInfoProp {
  charAddr:string,
  charLatitude:string,
  charLongitude:string,
  charTel:string,
  charConn:string,
  charOutput:string,
  charOperator:string,
  charMembership:boolean,
  charUseSTime:Date,
  charUseETime:Date,
  charFee:string,
  charNotes:string
}

const ChargerInfoSection: React.FC = () => {
  const [chargerInfo, setChargerInfo] = useState<chargerInfoProp>({
    charAddr:'',
    charLatitude:'',
    charLongitude:'',
    charTel:'',
    charConn:'',
    charOutput:'',
    charOperator:'',
    charMembership:false,
    charUseSTime:parse('00:00:00', 'HH:mm:ss', new Date()),
    charUseETime:parse('23:59:59', 'HH:mm:ss', new Date()),
    charFee:'',
    charNotes:''
  })

  const handleSelectChange = (event: SelectChangeEvent) => {
    if(event.target.name == 'charConn') {
      setChargerInfo((prev)=>({
        ...prev,
        charConn: event.target.value
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
    setChargerInfo((prev)=>({
        ...prev,
        charMembership: isChecked
    }))
  };

  const getAddress = () => {}

  return (
    <div>
      <form>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField label="주소" name="charAddr" size="small" value={chargerInfo.charAddr} margin="dense" variant="standard" onChange={handleInputChange('charAddr')} required style={{margin:"9px", width: "350px"}}/>
          <Button variant="contained" size="small" onClick={getAddress} sx={{ mt: 2, backgroundColor: '#0033A0' }}>검색</Button>
        </Box>
        <TextField label="연락처" name="charTel" size="small" value={chargerInfo.charTel} margin="dense" variant="standard" onChange={handleInputChange('charTel')} required style={{margin:"9px"}}/><br/>
        <FormControl style={{margin:"15px 8px"}}>
          <FormLabel>충전방식</FormLabel>
          <RadioGroup row name="charConn" value={chargerInfo.charConn} onChange={handleSelectChange}>
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
                        <FormControlLabel
                          value={opt.id}
                          control={<Radio />}
                          label=""
                        />
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
        </FormControl><br/>
        <TextField label="최대출력(kW)" name="charOutput" size="small" value={chargerInfo.charOutput} margin="dense" variant="standard" onChange={handleInputChange('charOutput')} required style={{margin:"9px"}}/><br/>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField label="충전사업자" name="charOperator" size="small" value={chargerInfo.charOperator} margin="dense" variant="standard" onChange={handleInputChange('charOperator')} required style={{margin:"9px"}}/>
          <FormControlLabel required checked={chargerInfo.charMembership} onChange={handleCheckboxChange} control={<Checkbox />} label="회원여부" sx={{ mt: '6px' }} /> <br/>
        </Box>
        <FormControl style={{margin:"15px 8px"}}>
          <FormLabel>사용허가시간</FormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DemoContainer components={['TimePicker', 'TimePicker']}>
              <TimePicker
                label="시작시간"
                name = "charUseSTime"
                value={chargerInfo.charUseSTime}
                onChange={(newValue) => setChargerInfo((prev)=>({...prev, charType: newValue instanceof Date ? format(newValue, 'HH:mm:ss') : format('00:00:00', 'HH:mm:ss') }))}
              />
              <TimePicker
                label="종료시간"
                name = "charUseETime"
                value={chargerInfo.charUseETime}
                onChange={(newValue) => setChargerInfo((prev)=>({...prev, charType: newValue instanceof Date ? format(newValue, 'HH:mm:ss') : format('23:59:59', 'HH:mm:ss') }))}
              />
            </DemoContainer>
        </LocalizationProvider>
        </FormControl><br/>
        <TextField label="시간당 주차 이용요금" name="charFee" size="small" value={chargerInfo.charFee} margin="dense" variant="standard" onChange={handleInputChange('charFee')} required style={{marginLeft:"9px", marginBottom:"35px"}}/><br/>
        <FormControl fullWidth>
          <TextField label="특이사항" name="charNotes" multiline variant="outlined" value={chargerInfo.charNotes} onChange={handleInputChange('charNotes')} rows={5} 
          sx={{'& .MuiInputBase-root': {overflowY: 'auto',},'& textarea': {resize: 'none',},}}/>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" size="small" type="submit" sx={{backgroundColor: '#0033A0'}}>저장</Button>
        </Box>
      </form>
    </div>
  )
}

export default ChargerInfoSection