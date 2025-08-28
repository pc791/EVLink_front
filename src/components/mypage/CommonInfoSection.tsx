import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'

interface commonInfoProp {
  nickname:string,
  email:string,
  tel:string,
  name:string
}

const CommonInfoSection: React.FC = () => {
  const [commonParams, setCommonParams] = useState<commonInfoProp>({
    nickname:'',
    email:'',
    tel:'',
    name:''
  })

  // onChange 이벤트 처리 함수
  const handleInputChange = (field: keyof commonInfoProp) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setCommonParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 폼 제출 처리 함수
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('폼이 제출되었습니다:', commonParams)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField 
          label="닉네임" 
          name="nickname" 
          size="small" 
          value={commonParams.nickname} 
          margin="dense" 
          variant="standard" 
          required 
          onChange={handleInputChange('nickname')}
          sx={{width: '80%'}}
        /><br/>
        <TextField 
          label="이메일" 
          name="email" 
          size="small" 
          value={commonParams.email} 
          margin="dense" 
          variant="standard" 
          slotProps={{       
            input: {
              readOnly: true,
            },
          }}
          sx={{width: '80%'}}
        /><br/>
        <TextField 
          label="연락처" 
          name="tel" 
          size="small" 
          value={commonParams.tel} 
          margin="dense" 
          variant="standard" 
          required 
          onChange={handleInputChange('tel')}
          sx={{width: '80%'}}
        /><br/>
        <TextField 
          label="이름" 
          name="name" 
          size="small" 
          value={commonParams.name} 
          margin="dense" 
          variant="standard" 
          required 
          onChange={handleInputChange('name')}
          sx={{width: '80%'}}
        /><br/>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" size="small" type="submit" sx={{backgroundColor: '#0033A0'}}>저장</Button>
        </Box>
      </form>
    </div>
  )
}

export default CommonInfoSection