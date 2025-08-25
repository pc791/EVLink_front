import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import UserHistory from './UserHisList';
import ChargerHistory from './ChargerHisList';
import { GlobalModalProvider } from './GlobalModalProvider';
import ChargerHistoryModal from './ChargerHisListModal';
import UserHistoryModal from './UserHisListModal';

const ReservationTab: React.FC = () => {
    const [value, setValue] = React.useState("1");
    const modalMap = {
        creview: ChargerHistoryModal,
        ureview: UserHistoryModal,
      };

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
                            <Tab label="내 충전 예약" value="1" sx={{fontSize:'100%'}}/>
                            <Tab label="이용자 충전 예약" value="2" sx={{fontSize:'100%'}}/>
                        </TabList>
                        <Box sx={{ flexGrow: 1 }}>
                            <TabPanel value="1">
                                <GlobalModalProvider modals={modalMap}>
                                    <UserHistory />
                                </GlobalModalProvider>
                            </TabPanel>
                            <TabPanel value="2">
                                <GlobalModalProvider modals={modalMap}>
                                    <ChargerHistory />
                                </GlobalModalProvider>
                            </TabPanel>
                        </Box>
                    </Box>
                </TabContext>
            </Box>
        </div>
    )
}

export default ReservationTab