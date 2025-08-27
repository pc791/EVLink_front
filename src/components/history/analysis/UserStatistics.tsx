import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart } from 'recharts';
import { MyChargingHistory, MonthlyChargingStats, StationUsageStats, TimePatternStats, DayPatternStats } from './UserStatData';
import styles from './UserStatistics.module.css';

const UserStatistics: React.FC = () => {
  // 색상 팔레트
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  // 개인 충전 요약 통계
  const totalCharges = MyChargingHistory.length;
  const totalKwh = MyChargingHistory.reduce((sum, record) => sum + record.kwh, 0);
  const totalCost = MyChargingHistory.reduce((sum, record) => sum + record.cost, 0);
  const avgDuration = Math.round(MyChargingHistory.reduce((sum, record) => sum + record.duration, 0) / totalCharges);

  // 충전소별 방문 횟수 데이터
  const stationVisitData = StationUsageStats.map(station => ({
    충전소: station.station,
    방문횟수: station.visitCount,
    총kWh: station.totalKwh,
    총비용: station.totalCost / 1000
  }));

  // 월별 충전량 데이터
  const monthlyData = MonthlyChargingStats.map(month => ({
    월: month.month,
    총충전: month.totalCharges,
    총kWh: month.totalKwh,
    총비용: month.totalCost / 1000,
    총시간: month.totalDuration / 60
  }));

  // 시간대별 충전 패턴 데이터
  const timePatternData = TimePatternStats.map(item => ({
    시간: item.hour,
    충전횟수: item.usage
  }));

  // 요일별 충전 패턴 데이터
  const dayPatternData = DayPatternStats.map(item => ({
    요일: item.day,
    충전횟수: item.usage
  }));

  // 최근 충전 기록 (최신 5개)
  const recentCharging = MyChargingHistory.slice(-5).reverse();

  return (
    <div className={styles.statisticsContainer}>
      {/* 주요 지표 카드들 */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.primary}`}>
          <div className={styles.kpiContent}>
            <div className={styles.kpiText}>
              <h3>총 충전 횟수</h3>
              <h2>{totalCharges}회</h2>
            </div>
            <div className={styles.kpiIcon}>🔌</div>
          </div>
        </div>

        <div className={`${styles.kpiCard} ${styles.success}`}>
          <div className={styles.kpiContent}>
            <div className={styles.kpiText}>
              <h3>총 충전량</h3>
              <h2>{totalKwh.toFixed(1)}kWh</h2>
            </div>
            <div className={styles.kpiIcon}>⚡</div>
          </div>
        </div>

        <div className={`${styles.kpiCard} ${styles.info}`}>
          <div className={styles.kpiContent}>
            <div className={styles.kpiText}>
              <h3>총 충전 비용</h3>
              <h2>{(totalCost / 1000).toFixed(1)}천원</h2>
            </div>
            <div className={styles.kpiIcon}>💰</div>
          </div>
        </div>

        <div className={`${styles.kpiCard} ${styles.warning}`}>
          <div className={styles.kpiContent}>
            <div className={styles.kpiText}>
              <h3>평균 충전 시간</h3>
              <h2>{avgDuration}분</h2>
            </div>
            <div className={styles.kpiIcon}>⏰</div>
          </div>
        </div>
      </div>

      {/* 차트 그리드 */}
      <div className={styles.chartsGrid}>
        {/* 충전소별 방문 현황 Bar 차트 */}
        <div className={styles.chartCard}>
          <h3>충전소별 방문 현황</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={stationVisitData} margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="충전소" type="category" />
              <YAxis yAxisId="left" type="number" domain={[0, 'dataMax + 2']} />
              <YAxis yAxisId="right" orientation="right" type="number" domain={[0, 'dataMax * 1.1']} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="방문횟수" fill="#8884d8" />
              <Line yAxisId="right" dataKey="총kWh" stroke="#82ca9d" strokeWidth={2} dot />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 월별 충전량 Line 차트 */}
        <div className={styles.chartCard}>
          <h3>월별 충전량</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="월" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="총충전" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="총kWh" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="총비용" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 시간대별 충전 패턴 Area 차트 */}
        <div className={styles.chartCard}>
          <h3>시간대별 충전 횟수</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timePatternData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="시간" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="충전횟수" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 요일별 충전 패턴 Bar 차트 */}
        <div className={styles.chartCard}>
          <h3>요일별 충전 횟수</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dayPatternData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="요일" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="충전횟수" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 최근 충전 기록 테이블 */}
        <div className={`${styles.chartCard} ${styles.fullWidth}`}>
          <h3>최근 충전 기록</h3>
          <div className={styles.tableContainer}>
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>충전소</th>
                  <th>시간</th>
                  <th>충전량</th>
                  <th>비용</th>
                  <th>주소</th>
                </tr>
              </thead>
              <tbody>
                {recentCharging.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>
                      {record.station}
                    </td>
                    <td>{record.startTime}~{record.endTime}</td>
                    <td>{record.kwh}kWh</td>
                    <td>{(record.cost / 1000).toFixed(1)}천원</td>
                    <td>{record.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;