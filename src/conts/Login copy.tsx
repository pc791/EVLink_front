import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../comp/AuthProvider';

const Login: React.FC = () => {
  const [formDate, setFormData] = useState({ userid: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();//useContext로 부터 login함수를 불러온다

  //onChange 이벤트로 입력값을 formData useState에 저장
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formDate, [e.target.name]: e.target.value });
  };

  //로그인 버튼을 클릭
  const submitLogin = async () => {//불러온 login 함수로 아이디와 비밀번호를 전달해서 서버로부터
    //데이터를 받아온후 성공이면 seccess, 실패면 fail 등이 반환된다
    const result = await login(formDate.userid, formDate.password);
    if (result === 'success') {
      setMessage('로그인 성공');
      navigate('/');
    } else if (result === 'fail') {
      setMessage('아이디 또는 비밀번호가 틀렸습니다');
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
        <p style={{ marginTop: '10px', color: 'red' }}>{message}</p>
      </div>
    </div>
  );
};

export default Login;