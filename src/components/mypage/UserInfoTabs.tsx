import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react'
import CommonInfoSection from './CommonInfoSection';
import ChargerInfoSection from './ChargerInfoSection';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import CarInfoSection from './CarInfoSection';
import { useAuth } from '../../auth/AuthProvider';

// AuthProvider에 추가할 내용
interface UserInfoProps {
    user_id:number;
    user_tp:string;
}

const UserInfoTabs: React.FC = () => {
    const [value, setValue] = useState("1");
    const { profile } = useAuth();
    const [userInfo, setUserInfo] = useState<UserInfoProps>({
        user_id: profile?.userId ? parseInt(profile.userId) : 0,
        user_tp: profile?.userTp ? profile.userTp : ''
    });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // profile이 변경될 때 userInfo도 업데이트
  useEffect(() => {
    if (profile?.userId) {
      setUserInfo(prev => ({
        ...prev,
        user_id: parseInt(profile.userId!),
        user_tp: (profile.userTp!)
      }));
    }
  }, [profile?.userId]);

  // 세션에서 사용자의 서비스 유형 확인 필요

  return (
        <div style={{margin:'80px'}}>
            <Box sx={{ width: '100%', typography: 'body1'}}>
                <TabContext value={value}>
                    <Box sx={{ display: 'flex', borderRight: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="user info tabs" orientation="vertical" sx={{ borderRight: 1, borderColor: 'divider', minWidth: '10%' }}>
                            <Tab label="공통사항" value="1" sx={{fontSize:'100%'}}/>
                            <Tab label="차량등록" value="2" sx={{fontSize:'100%'}}/>
                            <Tab label="충전기등록" value="3" sx={{fontSize:'100%'}}/>
                        </TabList>
                        <Box sx={{ flexGrow: 1 }}>
                            <TabPanel value="1">
                                <CommonInfoSection userId={userInfo.user_id} />
                            </TabPanel>
                            <TabPanel value="2">
                                <CarInfoSection userId={userInfo.user_id} />
                            </TabPanel>
                            <TabPanel value="3">
                                <ChargerInfoSection userId={userInfo.user_id} />
                            </TabPanel>
                        </Box>
                    </Box>
                </TabContext>
            </Box>
        </div>
    )
}
export default UserInfoTabs