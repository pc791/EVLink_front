import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import React, { SyntheticEvent, useEffect, useState } from 'react'
import UserStatistics from './UserStatistics';
import ChargerStatistics from './ChargerStatistics';
import { useAuth } from '../../../auth/AuthProvider';

interface UserInfoProps {
    user_id:number;
    user_tp:string;
}

const UserStatTab: React.FC = () => {
    const [value, setValue] = useState("1");
    const { profile } = useAuth();
    const [userInfo, setUserInfo] = useState<UserInfoProps>({
        user_id: profile?.userId ? parseInt(profile.userId) : 0,
        user_tp: profile?.userTp ? profile.userTp : ''
    });
    
    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (profile?.userId) {
            setUserInfo(prev => ({
                ...prev,
                user_id: parseInt(profile.userId!),
                user_tp: (profile.userTp!)
            }));
        }
    }, [profile?.userId]);

    return (
        <div style={{margin:'80px'}}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ display: 'flex', borderRight: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="user info tabs" orientation="vertical" sx={{ borderRight: 1, borderColor: 'divider', minWidth: '10%' }}>
                            <Tab label="내 충전 현황" value="1" sx={{fontSize:'100%'}}/>
                            <Tab label="이용자 충전 현황" value="2" sx={{fontSize:'100%'}}/>
                        </TabList>
                        <Box sx={{ flexGrow: 1 }}>
                            <TabPanel value="1">
                                <UserStatistics userId={userInfo.user_id} />
                            </TabPanel>
                            <TabPanel value="2">
                                <ChargerStatistics userId={userInfo.user_id} />
                            </TabPanel>
                        </Box>
                    </Box>
                </TabContext>
            </Box>
        </div>
    )
}

export default UserStatTab