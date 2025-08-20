import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../comp/AuthProvider';
import KakaoLoginButton from '../comp/KakaoLoginButton';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ userid: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // useContext로 부터 login함수를 불러온다.
  //--------------------------------------------------------------
  const location = useLocation();
  //?from=/gallery 
  const [searchParams] = useSearchParams();
  // location.state에서 from 값 꺼내기 (기본값: '/')
  // 1. state.from || 2. 쿼리스트링 ?from=... || 3. 기본 "/"
  //location.state로부터 페이지 경로를 얻을 수 있으면 최우선 사용하고
  //아니면 URL에 포함된 쿼리 파라미터에서 from을 추출 하고
  //이도 저도 아니면 기본경로 즉 처음에 초기화 한 값을 사용한다. 
  let from = '/'; // 기본 경로
  // 1. location.state에 from이 있는 경우
  //location.state 객체에서 from 값을 꺼냄
  //state.from.pathname이 있으면 "어디서 왔는지" URL 경로를 의미 한다.
  const state = location.state as { from?: Location | string };
  //state와 state.from, state.from.pathname이 모두 있다면 = 이전 페이지가 있다는 것이기 때문에 
  //로그인 후 돌아갈 경로로 from.pathname을 저장 해놓는다.
  if (state?.from) {
    //alert(typeof state.from);//object
    if (typeof state.from == 'string') {
      //from:`/community/updetail/${item.num}` => string
      from = state.from;
    } else if (typeof state.from === 'object') { //object일 경우 처리
      //detail에서 useLocation의 값이 문자열이 아니라 useLocation() 즉 object이다.
      // from : location => object
      from = (state.from as Location).pathname;
    }

    //위의 if문이 안되면 URL 쿼리에서 ?from=값 형태가 있는지 확인을 해서 
  } else if (searchParams.get('from')) { // 2. 쿼리스트링에 from 파라미터가 있는 경우
    //RL 뒤에 붙은 쿼리 ?from=...가 보이는지 확인 해보고 
    //queryString 즉 ?from=... 값을 저장 해놓는다.
    from = searchParams.get('from')!;
  }

  //--------------------------------------------------------------
  // onChange이벤트로 입력값을 formData useState에 저장 
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // 로그인 버튼을 클릭 
  const submitLogin = async () => { // 불러온 login함수로 아이디와 비밀번호를 전달해서 서버로부터
    // 데이터를 받아온 후 성공이면 success , 실패면 fail 등이 반환 된다.
    const result = await login(formData.userid, formData.password);
    if (result === 'success') {
      setMessage('로그인 성공!');
      //{replace:true} 웹페이지 에서 로그인 이후 이동 하는 경로 , 뒤로 가기를 막아주는 역할 
      navigate(from, { replace: true });
    } else if (result === 'fail') {
      setMessage('아이디 또는 비밀번호가 틀렸습니다.');
    } else {
      setMessage('서버 오류');
    }
  };
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'baseline',
      marginTop: '130px',
      height: '100vh'
    }}>
      <div style={{
        width: '300px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2>로그인</h2>
        <input
          name="userid"
          onChange={inputChange}
          placeholder="아이디"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          name="password"
          type="password"
          onChange={inputChange}
          placeholder="비밀번호"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button
          onClick={submitLogin}
          style={{ width: '100%', padding: '10px', backgroundColor: '#03d92d', color: '#fff', border: 'none', borderRadius: '5px' }}
        >
          로그인
        </button>
        {/* 카카오 로그인 버튼 컴포넌트 추가 */}
        <div style={{marginTop:'20px'}}>
          <KakaoLoginButton/>
        </div>
        <p style={{ marginTop: '10px', color: 'red' }}>{message}</p>
      </div>
    </div>
  );
};

export default Login;