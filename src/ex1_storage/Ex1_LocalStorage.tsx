import React, { useState } from 'react'
//localStorage는 브라우저에 영구 저장(삭제하기 전까지) , removeItem, clear 호출
//https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage
//sessionStorage는 브라우저 탭을 닫을 때 까지 ..... 탭을 닫으면 데이터 사라지고, 탭간의 공유가 안됨
//localStorage를 사용하면, 브라우저에 key-value 값을 Storage에 저장할 수 있음.
//저장한 데이터는 세션간에 공유 , 즉, 세션이 바뀌어도 저장한 데이터가 유지
//setItem(key,val) - key, value 추가
//getItem(key) - value 읽어 오기
//removeItem() - item 삭제
//clear() - 도메인 내의 localStorage 값 삭제
//length - 전체 item 갯수
//key() - index로 key값 찾기
const Ex1_LocalStorage: React.FC = () => {
  const [msg,setMsg] = useState('');
  // deleteLocalStorage()호출했을 때와 , saveLocalStorage 를 구분해서
  // storedMsg 에 처리를 하겠다.
  const [storedMsg,setStoredMsg] = useState<string|null>('');
  const saveLocalStorage = () => {
      localStorage.setItem("msg",msg);
      setStoredMsg(msg);
  };
  const deleteLocalStorage = () =>{
      localStorage.removeItem("msg");
      setStoredMsg(null);
  }
  return (
    <div>
      <input type="text" name="msg" id="msg" 
        onChange={ e=> setMsg(e.target.value)}
      />
      <button onClick={saveLocalStorage}>Save</button>
      <button onClick={deleteLocalStorage}>Delete</button>
      <p>{storedMsg}</p>
    </div>
  )
}

export default Ex1_LocalStorage