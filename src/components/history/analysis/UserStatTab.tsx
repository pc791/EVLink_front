import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import React from 'react'
import UserStatistics from './UserStatistics';
import ChargerStatistics from './ChargerStatistics';

const UserStatTab: React.FC = () => {
    const [value, setValue] = React.useState("1");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <div style={{margin:'80px', backgroundColor: '#ffffff'}}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ display: 'flex', borderRight: 1, borderColor: 'divider' }}>
                        <TabList 
                            onChange={handleChange} 
                            aria-label="user info tabs"
                            orientation="vertical"
                            sx={{ borderRight: 1, borderColor: 'divider', minWidth: '10%' }}
                        >
                            <Tab label="내 충전 현황" value="1" sx={{fontSize:'100%'}}/>
                            <Tab label="이용자 충전 현황" value="2" sx={{fontSize:'100%'}}/>
                        </TabList>
                        <Box sx={{ flexGrow: 1 }}>
                            <TabPanel value="1">
                                <UserStatistics />
                            </TabPanel>
                            <TabPanel value="2">
                                <ChargerStatistics />
                            </TabPanel>
                        </Box>
                    </Box>
                </TabContext>
            </Box>
        </div>
    )
}

export default UserStatTab