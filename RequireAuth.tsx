import React, { JSX } from 'react'
import { useAuth } from 'auth/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';

/* <RequireAuth>
  <Evhome/> => children .
</RequireAuth> */
// components 가 자식으로 오직 하나의 JSX요소만 받도록 제네릭으로 선언
// AOP같은 효과
const RequireAuth: React.FC<{children: JSX.Element}> = ({children}) => {
    const {isLoggedIn} = useAuth();
    const location = useLocation();
    if(!isLoggedIn){
      return <Navigate to = "/Login" state={{from:location}} replace/>;
    }
    
    return children;
}

export default RequireAuth