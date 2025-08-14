import React, { JSX } from 'react'
import { useAuth } from './AuthProvider'
import { Navigate, useLocation } from 'react-router-dom';
/*
<RequireAuth>
    <GalleryDetail/> => 이게 children 이다
</RequireAuth>
*/
//컴포넌트가 자식으로 오직 하나의 JSX요소만 받오독 제네릭으로 선언한 것이다
const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { member, loading } = useAuth();
  const location = useLocation();
  //loading = true인 동안은 화면을 안 바꾸고 대기하다가 
  //finally에 의해서 loading = false가  되면 member가 null인지 아닌지를 판단해서 처리해라.
  if (loading) {
    return <div>로딩 중입니다.</div>
  }
  if (!member) {//login 정보가 없으면
    //React Router의 <Navigate/>는 프로그래밍적으로 페이지를 이동시킬 때 사용하는 컴포넌트
    //자바스크립트의 location = "/login"
    //state={{from:location}}은 useLocation에서 현재의 위치 정보를 저장하기 위한 것이다
    //나중에 로그인이 성공 한 후에 원래 페이지로 되돌아올 수 있도록 설정한 것이다
    //history.push() 대신 history.replace()처럼 동작하게 함
    //로그인 후 뒤로가기 눌렀을 때 /login페이지가 뒤로가기 히스토리에 남지 않도록 막아주기 때문이다.
    return <Navigate to='/login' state={{ from: location }} replace />
  }
  return children;
}

export default RequireAuth