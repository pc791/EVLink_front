import { Box, Button, FormControl, FormControlLabel, FormHelperText, FormLabel, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import React, { useState } from 'react'
import { ManufacturerData, CahrgerTypes } from './UserInfoData'

interface carInfoProp {
  carBrand:string,
  carModelYear:string,
  carModel:string,
  carNumber:string,
  carSocket:string
}

const CarInfoSection: React.FC = () => {
  const [carInfo, setCarInfo] = useState<carInfoProp>({
    carBrand:'',
    carModelYear:'',
    carModel:'',
    carNumber:'',
    carSocket:''
  })
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length:40 }, (_, i) => currentYear - i);

  const handleSelectChange = (event: SelectChangeEvent) => {
    if(event.target.name == 'carBrand') {
      setCarInfo((prev)=>({
        ...prev,
        carBrand: event.target.value,
        carModel: '',
        carModelYear: ''
      }))
    }
    if(event.target.name == 'carModel') {
      setCarInfo((prev)=>({
        ...prev,
        carModel: event.target.value,
        carModelYear: ''
      }))
    }
    if(event.target.name == 'carModelYear') {
      setCarInfo((prev)=>({
        ...prev,
        carModelYear: event.target.value
      }))
    }
    if(event.target.name == 'carSocket') {
      setCarInfo((prev)=>({
        ...prev,
        carSocket: event.target.value
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

  // 폼 제출 처리 함수
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('폼이 제출되었습니다:', carInfo)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }} size="small">
          <InputLabel id="label">제조사</InputLabel>
          <Select label="제조사" name="carBrand" value={carInfo?.carBrand} onChange={handleSelectChange}>
          {
            ManufacturerData.map((item)=>(
              <MenuItem key={item.carBrand} value={item.carBrand}>{item.carBrand}</MenuItem>
            ))
          }  
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }} size="small">
          <InputLabel>모델</InputLabel>
          <Select label="모델" name="carModel" value={carInfo.carModel} onChange={handleSelectChange} disabled={!carInfo.carBrand}>
          {
            ManufacturerData.find((brand)=>brand.carBrand === carInfo.carBrand)?.carModel.map((model)=>(
            <MenuItem key={model} value={model}>{model}</MenuItem>
          ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }} size="small">
          <InputLabel>연식</InputLabel>
          <Select label="연식" name="carModelYear" value={carInfo.carModelYear} onChange={handleSelectChange} disabled={!carInfo.carBrand}>
          {
            years.map((year) => (<MenuItem key={year} value={year.toString()}>{year}</MenuItem>
          ))}
          </Select>
        </FormControl><br/>
        <TextField label="차량번호" name="carNumber" size="small" value={carInfo.carNumber} margin="dense" variant="standard" onChange={handleInputChange('carNumber')} required style={{margin:"9px"}}/><br/>
        <FormControl style={{margin:"15px 8px"}}>
          <FormLabel>충전방식</FormLabel>
          <RadioGroup row name="carSocket" value={carInfo.carSocket} onChange={handleSelectChange}>
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
        </FormControl><br/>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" size="small" type="submit" sx={{backgroundColor: '#0033A0'}}>저장</Button>
        </Box>
      </form>
    </div>
  )
}

export default CarInfoSection