import React from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { PersonalChargerData, ChargerReservations, MonthlyChargerStats, ChargerUsageByTime } from './UserStatData'
import styles from './ChargerStatistics.module.css'

const ChargerStatistics: React.FC = () => {
    // 개인 충전기 정보
    const chargerInfo = PersonalChargerData[0]
    
    // 월별 통계 차트 데이터
    const monthlyStatsData = MonthlyChargerStats.map(month => ({
        월: month.month,
        예약수: month.totalReservations,
        사용시간: month.totalHours,
        충전량: month.totalKwh,
        수익: month.totalRevenue / 1000
    }))

    // 시간대별 사용 패턴 데이터
    const timeUsageData = ChargerUsageByTime.map(item => ({
        시간: item.hour,
        예약수: item.reservations,
        실제이용: item.actualUsage,
        평균시간: item.avgDuration,
        평균kWh: item.avgKwh
    }))

    // 상태별 예약 통계
    const statusStats = {
        완료: ChargerReservations.filter(r => r.status === '완료').length,
        예약중: ChargerReservations.filter(r => r.status === '예약중').length,
        취소: ChargerReservations.filter(r => r.status === '취소').length
    }

    return (
        <div className={styles['charger-statistics']}>
            {/* 충전기 정보 요약 */}
            <div className={styles['charger-info']}>
                <h3>충전기 정보</h3>
                <div className={styles['info-grid']}>
                    <div className={styles['info-item']}>
                        <span className={styles['info-label']}>타입:</span>
                        <span className={styles['info-value']}>{chargerInfo.chargerType}</span>
                    </div>
                    <div className={styles['info-item']}>
                        <span className={styles['info-label']}>위치:</span>
                        <span className={styles['info-value']}>{chargerInfo.location}</span>
                    </div>
                </div>
            </div>
            
            {/* 수치형 요약 정보 */}
            <div className={styles['summary-cards']}>
                <div className={styles['summary-card']}>
                    <h3>총 예약 수</h3>
                    <div className={styles['card-value']}>{chargerInfo.totalReservations}건</div>
                    <div className={styles['card-subtitle']}>누적 예약 건수</div>
                </div>
                
                <div className={styles['summary-card']}>
                    <h3>총 사용 시간</h3>
                    <div className={styles['card-value']}>{chargerInfo.totalUsageHours}시간</div>
                    <div className={styles['card-subtitle']}>누적 사용 시간</div>
                </div>
                
                <div className={styles['summary-card']}>
                    <h3>총 충전량</h3>
                    <div className={styles['card-value']}>{chargerInfo.totalKwh}kWh</div>
                    <div className={styles['card-subtitle']}>누적 전력 공급량</div>
                </div>
                
                <div className={styles['summary-card']}>
                    <h3>총 수익</h3>
                    <div className={styles['card-value']}>{(chargerInfo.totalRevenue / 10000).toFixed(1)}만원</div>
                    <div className={styles['card-subtitle']}>누적 수익</div>
                </div>
            </div>

            {/* 차트 섹션 */}
            <div className={styles['charts-section']}>
                <div className={styles['chart-row']}>
                    <div className={styles['chart-container']}>
                        <h3>월별 예약 및 수익 현황</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyStatsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="월" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="예약수" fill="#667eea" name="예약 수" />
                                <Bar yAxisId="left" dataKey="사용시간" fill="#764ba2" name="사용 시간" />
                                <Line yAxisId="right" type="monotone" dataKey="수익" stroke="#ffc658" strokeWidth={3} name="수익 (천원)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className={styles['chart-container']}>
                        <h3>시간대별 예약 및 이용 패턴</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={timeUsageData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="시간" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area 
                                    type="monotone" 
                                    dataKey="예약수" 
                                    stroke="#667eea" 
                                    fill="#667eea" 
                                    fillOpacity={0.3}
                                    strokeWidth={3}
                                    name="예약 수"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="실제이용" 
                                    stroke="#FF9800" 
                                    fill="#FF9800" 
                                    fillOpacity={0.3}
                                    strokeWidth={3}
                                    name="실제 이용 수"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 예약 현황 테이블 */}
            <div className={styles['detailed-stats']}>
                <h3>최근 예약 현황</h3>
                <div className={styles['stats-table']}>
                    <table>
                        <thead>
                            <tr>
                                <th>사용자명</th>
                                <th>차량 모델</th>
                                <th>예약일</th>
                                <th>시간</th>
                                <th>사용시간</th>
                                <th>충전량</th>
                                <th>비용</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ChargerReservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.userName}</td>
                                    <td>{reservation.carModel}</td>
                                    <td>{reservation.reservationDate}</td>
                                    <td>{reservation.startTime}~{reservation.endTime}</td>
                                    <td>{reservation.duration}시간</td>
                                    <td>{reservation.kwhUsed}kWh</td>
                                    <td>{reservation.cost.toLocaleString()}원</td>
                                    <td>
                                        <span className={`${styles['status']} ${styles[`status-${reservation.status === '완료' ? 'completed' : 'pending'}`]}`}>
                                            {reservation.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    )
}

export default ChargerStatistics