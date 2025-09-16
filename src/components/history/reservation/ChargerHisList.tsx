import React, { useState } from 'react'
import { ChargerReservations } from './ReservationData';
import { Box, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';

interface reservationProps {
    COMM_UID?: number;
    COMM_DATE: string;
    GOWORK_TIME: string;
    GOWORK_CO?: string;
    LEAVEWORK_TIME: string;
    LEAVEWORK_CO?: string;
    IS_LATE: string;
    OVER_TIME: string
    SA_UID?: number;
    ROW_NUM: number;
}

const ChargerHisList: React.FC<{userId:number}> = ({userId}) => {
    const [keyword, setKeyword] = useState('');
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        pageSize: 10,
        page: 0,
    });

    

    // 컬럼 정의
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 80, type: 'number', align: 'center', headerAlign: 'center' },
        { field: 'member', headerName: '회원명', flex: 100, align: 'center', headerAlign: 'center' },
        { field: 'carType', headerName: '차량 모델', flex: 150, align: 'center', headerAlign: 'center' },
        { field: 'chargeAmount', headerName: '충전량 (kWh)', flex: 100, type: 'number', align: 'right', headerAlign: 'center' },
        { field: 'date', headerName: '예약 날짜/시간', flex: 160, align: 'center', headerAlign: 'center' },
        { field: 'price', headerName: '가격 (원)', flex: 120, type: 'number', align: 'right', headerAlign: 'center' },
        { 
            field: 'usedYn', 
            headerName: '사용 여부', 
            flex: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <span style={{ 
                    color: params.value ? '#2e7d32' : '#d32f2f',
                    fontWeight: 'bold'
                }}>
                    {params.value ? '사용' : '미사용'}
                </span>
            )
        }
    ];

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        setKeyword(value)
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        console.log('조회 Keyword:', keyword)
        // 여기에 폼 제출 로직을 구현할 수 있습니다
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Box sx={{ width: '90%', height: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>이용자 충전 예약</Typography>
                <Box sx={{marginBottom:'10px'}}>
                    <form onSubmit={handleSubmit} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
                        <input 
                            type="text" 
                            placeholder="검색어를 입력해주세요" 
                            name="keyword" 
                            value={keyword} 
                            onChange={handleInputChange} 
                            style={{
                                width: '300px',
                                height: '40px',
                                padding: '8px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '12px',
                                fontSize: '14px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                        <button 
                            type="submit"
                            style={{
                                height: '40px',
                                padding: '8px 16px',
                                backgroundColor: '#0033A0',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                boxSizing: 'border-box',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#002080'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0033A0'}
                        >
                            조회
                        </button>
                    </form>
                </Box>
                <DataGrid
                    rows={ChargerReservations}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                    initialState={{
                        sorting: { sortModel: [{ field: 'date', sort: 'desc' }] }
                    }}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #e0e0e0',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5',
                            borderBottom: '2px solid #e0e0e0',
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: '#f8f8f8',
                        }
                    }}
                />
            </Box>
        </div>
    )
}

export default ChargerHisList