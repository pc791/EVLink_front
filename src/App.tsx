import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './comp/Layout';
import Home from './conts/Home';
import BoardList from './conts/board/BoardList';
import Gallery from './conts/gallery/Gallery';
import Chart from './conts/Chart';
import Diary from './conts/Diary';
import Login from './conts/Login';
import Signup from './conts/member/Signup';
import Community from './conts/Community';
import FilterTest from './conts/FilterTest';
import BoardDetail from './conts/board/BoardDetail';
import BoardForm from './conts/board/BoardForm';
import AppRoutes from './router/AppRoutes';
import Ex1_LocalStorage from './ex1_storage/Ex1_LocalStorage';
import Ex2_LocalStorage from './ex1_storage/Ex2_LocalStorage';
import { AuthProvider } from './comp/AuthProvider';


function App() {
  return (
    // <>
    // <FilterTest/>
    // </>
    // <Router>
    //   <Layout>
    //     <Routes>
    //       <Route path='/' element={<Home/>}/>
    //       <Route path='/board' element={<BoardList/>}/>
    //       {/* http://localhost:3000/board/1 , 2 모두가 :id로 들어감 */}
    //       <Route path='/board/:id' element={<BoardDetail/>}/>
    //       <Route path='/board/write' element={<BoardForm/>}/>
    //       <Route path="/gallery" element={<Gallery />} />
    //       <Route path="/chart" element={<Chart />} />
    //       <Route path="/diary" element={<Diary />} />
    //       <Route path="/login" element={<Login />} />
    //       <Route path='/community' element={<Community/>}/>
    //       <Route path="/signup" element={<Signup />} />
    //     </Routes>
    //   </Layout>
    // </Router>
    <AuthProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </AuthProvider>
    // <>
    // <Ex1_LocalStorage/>
    // {/* <Ex2_LocalStorage/> */}
    // </>
  );
}

export default App;
