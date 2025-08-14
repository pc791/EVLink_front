import React from 'react'
import Home from '../conts/Home'
import BoardList from '../conts/board/BoardList'
import BoardForm from '../conts/board/BoardForm'
import BoardDetail from '../conts/board/BoardDetail'
import Gallery from '../conts/gallery/Gallery'
import Chart from '../conts/Chart'
import Community from '../conts/Community'
import Diary from '../conts/Diary'
import Login from '../conts/Login'
import Signup from '../conts/member/Signup'
import GalleryForm from '../conts/gallery/GalleryForm'
import GalleryDetail from '../conts/gallery/GalleryDetail'
import { Route, Routes } from 'react-router-dom'
import UpboardList from '../conts/community/upboard/UpboardList'
import UpboardForm from '../conts/community/upboard/UpboardForm'
import UpboardDetail from '../conts/community/upboard/UpboardDetail'
import MemoList from '../conts/memo/MemoList'
import RequireAuth from '../comp/RequireAuth'
import Map from '../pages/Map'
import EvStationList from '../pages/EvStationList'



const AppRoutes: React.FC = () => {
  const routeList = [
    { path: '/', element: <Home /> },
    { path: '/board', element: <BoardList /> },        // 게시판 목록
    { path: '/board/write', element: <BoardForm /> },   // 게시판 글쓰기
    { path: '/board/:id', element: <BoardDetail /> },  // 게시판 상세페이지
    { path: '/gallery', element: <Gallery /> },
    { path: '/gallery/write', element: <GalleryForm /> },
    { path: '/gallery/:num', element: <RequireAuth><GalleryDetail /></RequireAuth> },
    { path: '/chart', element: <Chart /> },
    { path: '/community', element: <Community /> },
    { path: '/community/uplist', element: <UpboardList /> },
    { path: '/community/upform', element: <UpboardForm /> },
    { path: '/community/updetail/:num', element: <RequireAuth><UpboardDetail /></RequireAuth> },
    { path: '/memo', element: <MemoList /> },
    { path: '/diary', element: <Diary /> },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
    { path: '/map', element: <Map /> },
    { path: '/map2', element: <EvStationList /> },
  ]
  return (

    <Routes>
      {
        routeList.map((route, idx) => (
          <Route key={idx} {...route} />
        ))
      }
    </Routes>
  )
}

export default AppRoutes