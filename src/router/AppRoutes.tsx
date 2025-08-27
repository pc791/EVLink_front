import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../layout/Layout'
import { useAuth } from '../auth/AuthProvider'


// Page Components
import EVhome from '../components/home/EVhome'
import Login from '../components/login/Login';
import FAQ from '../components/community/faq/FAQ'
import Event from '../components/community/event/Event';
import Notice from '../components/community/notice/Notice';
import NoticeDetail from '../components/community/notice/NoticeDetail';
import Map from '../components/map/Map'
import UserInfoTabs from '../components/mypage/UserInfoTabs'
import UserStatTab from '../components/history/analysis/UserStatTab'
import ReservationTab from '../components/history/reservation/ReservationTab'
// import Map from '../components/map/Map';
// import mypage from '.conts/mypage/Mypage';


// import Analysis from '../components/analysis/Analysis';
// import Service from '../components/service/Service';
// import Rserveform from '../components/reserveform/Reserveform';
// import Reservelist from '../components/reservelist/Reservelist';


const AppRoutes: React.FC = () => {
    const routeList = [ 
        { path: '/', element: <EVhome />},
        { path: '/Login', element: <Login /> },// 로그인
        { path: '/map', element: <Map />  }, // 충전소 찾기 (맵)
        { path: '/mypage', element: <UserInfoTabs /> }, // 마이페이지
        { path: '/notice', element: <Notice /> }, // 공지사항
        { path: '/notice/:id', element: <NoticeDetail /> }, // 공지사항
        { path: '/faq', element: <FAQ /> }, // FAQ
        { path: '/event', element: <Event /> }, // 이벤트
        { path: '/analysis', element: <UserStatTab /> }, // 이용현황
        // { path: '/service', element: <Service /> }, // 서비스안내
        // { path: '/reserveform', element: <Reserveform />}, // 예약 폼
        { path: '/reservelist', element: <ReservationTab />}, // 예약 리스트
    ]
    
    
  return (
    <Routes>
        {
            routeList.map((routeList,idx) => (
                <Route key = {idx} {...routeList}/>
            ))
        }
    </Routes>
  
  )
}

export default AppRoutes