import React, { useState } from 'react'
import style from './signup.module.css';

const Signup: React.FC = () => {
  //회원의 데이터를 저장할 useState
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    gender: '',
    hobby: [] as string[],
    birth: '',
    country: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [idChecked, setIdChecked] = useState(false);//id 중복체크

  //유효성을 체크하는 함수 정의
  const validate = () => {
    //{username:"아이디를 입력하세요"}
    const newErrors: { [key: string]: string } = {};
    if (!form.username) {
      newErrors.username = '아이디를 입력하세요';
    }
    if (!idChecked) {
      newErrors.idCheck = '아이디 중복확인은 필수입니다'
    }
    if (!form.email) {
      newErrors.email = '이메일을 입력하세요'
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = '비밀번호를 최소 6자 이상 입력하세요';
    }
    if (!form.gender) {
      newErrors.gender = '성별을 선택하세요';
    }
    if (!form.hobby.length) {
      newErrors.hobby = '하나 이상의 취미를 선택하세요'
    }
    if (!form.birth) {
      newErrors.birth = '생년월일을 입력하세요';
    }
    if (!form.country) {
      newErrors.country = '국가를 선택하세요';
    }
    return newErrors;
  }

  const imsiUserid = ['admin', 'tess', 'ictuser'];//임시회원아이디

  const memberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    //type이 checkbox일 경우
    if (type === 'checkbox') {
      //checked 된 값
      let checked = (e.target as HTMLInputElement).checked;
      console.log('Checkbox : ' + checked + ":" + value);
      //FilterTest.tsx에서 따로 구현해서 설명
      console.log({ [name]: checked ? value : [name].filter(h => h !== value) })
      //(checked === true) : 값에 value를 추가한다 ["독서"]+"운동"=>["독서","운동"]
      //(checked === false) : filter 를 사용해서 "운동"해제 했다면 =>["독서"] 
      setForm(prev => ({
        ...prev, hobby: checked ?
          [...prev.hobby, value] :
          prev.hobby.filter(h => h !== value)
      }));
    } else {
      console.log('Checkbox가 아닙니다');
      //<input type="" name="" value=""/>
      console.log(`name=> ${name},value=> ${value}`);
      //change 이벤트가 발생할 때 회원의 정보를 저장하는 객체를
      //useState 즉 form에 저장하기 위해서 setForm호출해서 값을 저장한다
      //저장형태
      //{username:'', email:'', password:'',...}
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  //아이디 중복검사 실행
  const checkUsername = () => {
    console.log(`id값=> ${form.username.trim()}`);
    if (!form.username.trim()) {
      alert("아이디를 입력하세요!");
      return;
    }
    //includes 함수를 사용해서 입력받은 값이 존재하면 true, 아니면 false
    console.log(`IdCheck=> ${imsiUserid.includes(form.username.trim().toLowerCase())}`);
    if (imsiUserid.includes(form.username.trim().toLowerCase())) {
      alert('이미 존재하는 아이디입니다');
      setIdChecked(false);//useState에 false저장장
    } else {
      alert('사용 가능한 아이디입니다');
      setIdChecked(true);
    }
  }

  //회원가입 버튼 이벤트 핸들링
  const signupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("회원가입 성공");
    //유효성 검사
    const myErrors = validate();
    if (Object.keys(myErrors).length > 0) {
      console.log(Object.keys(myErrors));
      setErrors(myErrors);
    } else {
      //서버로 전송
      console.log('선택된 취미들:' + form.hobby);
    }
  }

  return (
    <div className={style.signupContainer}>
      <h2>회원가입</h2>
      <form className={style.form} onSubmit={signupSubmit}>
        <label>아이디</label>
        <div className={style.inputRow}>
          <input type="text" name='username' id='username' onChange={memberChange} />
          <button type='button' className={style.checkButton} onClick={checkUsername}>중복확인</button>
        </div>
        {/* {val && 실행}
          errors.username : validate() 호출할 때 useState form에 있는 속성들중에
          값이 없을 떄 메세지를 저장한 키값으로 만들어 진다
        */}
        {errors.username && <p className={style.error}>{errors.username}</p>}
        {errors.idCheck && <p className={style.error}>{errors.idCheck}</p>}
        <label>이메일</label>
        <input type="email" name='email' id='email' onChange={memberChange} />
        {errors.email && <p className={style.error}>{errors.email}</p>}

        <label>비밀번호</label>
        <input type="password" name='password' id='password' onChange={memberChange} />
        {errors.password && <p className={style.error}>{errors.password}</p>}

        <label>성별</label>
        <div className={style.gender}>
          <label><input type="radio" name='gender' value='남자' onChange={memberChange} /> 남자</label>
          <label><input type="radio" name='gender' value='여자' onChange={memberChange} /> 여자</label>
        </div>
        {errors.gender && <p className={style.error}>{errors.gender}</p>}

        <label>취미</label>
        <div className={style.hobby}>
          <label><input type="checkbox" name='hobby' value='독서' onChange={memberChange} />독서</label>
          <label><input type="checkbox" name='hobby' value='운동' onChange={memberChange} />운동</label>
          <label><input type="checkbox" name='hobby' value='음악' onChange={memberChange} />음악</label>
        </div>
        {errors.hobby && <p className={style.error}>{errors.hobby}</p>}

        <label>생년월일</label>
        <input type="date" name='birth' id='birth' onChange={memberChange} />
        {errors.birth && <p className={style.error}>{errors.birth}</p>}

        <label>국가</label>
        <select name="country" id="country" onChange={memberChange}>
          <option value="">국가 선택</option>
          <option value="한국">한국</option>
          <option value="미국">미국</option>
          <option value="일본">일본</option>
          <option value="영국">영국</option>
        </select>
        {errors.country && <p className={style.error}>{errors.country}</p>}

        <button type='submit' className={style.submitButton}>가입하기</button>
      </form>
    </div>
  )
}

export default Signup