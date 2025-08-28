import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react'
import CommonInfoSection from './CommonInfoSection';
import ChargerInfoSection from './ChargerInfoSection';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import CarInfoSection from './CarInfoSection';

const UserInfoTabs: React.FC = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
        <div style={{margin:'80px'}}>
            <Box sx={{ width: '100%', typography: 'body1', display: 'flex', justifyContent: 'center' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                            <TabList onChange={handleChange} aria-label="user info tabs">
                                <Tab label="공통사항" value="1" sx={{fontSize:'100%'}}/>
                                <Tab label="차량등록" value="2" sx={{fontSize:'100%'}}/>
                                <Tab label="충전기등록" value="3" sx={{fontSize:'100%'}}/>
                            </TabList>
                        </Box>
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                            <TabPanel value="1">
                                <CommonInfoSection />
                            </TabPanel>
                            <TabPanel value="2">
                                <CarInfoSection />
                            </TabPanel>
                            <TabPanel value="3">
                                <ChargerInfoSection />
                            </TabPanel>
                        </Box>
                    </Box>
                </TabContext>
            </Box>
        </div>
    )
}
export default UserInfoTabs