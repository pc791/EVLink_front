import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface UpBoardCommProps {
  num?: number;
}
//192.168.0.92/myictstudy0521/upboard/upcommList?num=1
//json의 결과를 보고 작성
interface UpBoardCommVO {
  num: number;
  ucode: number;
  uwriter: string;
  ucontent: string;
  reip: string;
  uregdate: string;
}

const UpboardComm: React.FC<UpBoardCommProps> = ({ num }) => {
  //step 7) axios로 json으로 받아온 데이터를 저장할 useState를 정의
  //useState의 자료형은? UpBoardCommVO[] => jsonList안에 jsonObject이기 때문에
  const [comments, setComments] = useState<UpBoardCommVO[]>([]);

  //step 8) axios로 json 받아와서 setComments호출해서 useState인 comments 에 저장해놓고
  //ui에서 map()으로 반복해서 출력
  const getComments = async () => {
    try {
      const url = `http://192.168.0.92/myictstudy0521/upboard/upcommList?num=${num}`;
      const response = await axios.get<UpBoardCommVO[]>(url);
      console.log(response.data);
      setComments(response.data);
    } catch (error) {
      console.error("데이터 로딩 실패", error);
    }
  }

  //step 3) 폼에서 입력한 값을 onChange 이벤트가 발생할때 마다 값을 저장하기 위한 저장장소를 선언한다.
  const [writer, serWriter] = useState("");
  const [content, setContent] = useState("");
  //step 2) 버튼이 클릭이 되면 동작하는 함수 form의 데이터 전송을 하기위한 함수이다
  //여기서 폼이 전송이 되는것을 막아야한다.
  const commentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //alert("Form 동작!");
    console.log(`Writer : ${writer}`);
    console.log(`Content : ${content}`);
    //step 4) 서버측에 데이터를 받는 유형을 확인한 후 지금처럼 @RequestBodt형태 즉, json이면
    //front에서는 json으로 데이터를 전송해야함 ****
    //
    const commentData = {
      ucode: num,
      uwriter: writer,
      ucontent: content,
      reip: '192.168.0.92'
    }
    //step 5) axios.post() 를 사용해서 서버측으로 json데이터를 전송한다
    try {
      await axios.post(`http://192.168.0.92/myictstudy0521/upboard/upcommAdd`, commentData, {
        headers: { 'Content-Type': 'application/json' }
      });
      serWriter("");
      setContent("");
      //입력 성공후 다시 서버로 최신데이터를 갱신
      getComments();
    } catch (error) {
      console.error("전송 실패!", error);
    }

  }
  //step 6) 댓글같은 경우느 입력한 것이 즉시 반영 되어야한다
  //서버측 함수를 복붙
  //http://192.168.0.92/myictstudy0521/upboard/upcommList?num=1
  //@GetMapping("/upcommList")
  //public List<UpBoardCommVO> listBoardComm(@RequestParam("num") int num) {
  //interface 정의하기

  useEffect(() => {
    console.log("Num" + num);
    getComments();
  }, [num])

  return (
    <div className='mt-4'>
      <h4>Comments</h4>
      {/* step 1) form  디자인 작성 이후 폼의 전송을 위해 axios로 처리하는 방법
      form 속성에 onSubmit속성을 부여
      그리고 적당한 함수를 호출*/}
      <form className='mb-3' onSubmit={commentSubmit}>
        <div className='mb-2'>
          <input type='text' placeholder='작성자' className='form-control' onChange={(e) => serWriter(e.target.value)} />
        </div>
        <div className='mb-2'>
          <textarea className='form-control' placeholder='댓글' onChange={(e) => setContent(e.target.value)} />
        </div>
        <div className='text-center'>
          <button type='submit' className='btn btn-primary'>댓글작성</button>
        </div>
      </form>
      {/*댓글 리스트*/}
      <ul className='list-group'>
        {comments.map((vo) => (
          <li className='list-group-item' key={vo.num}>
            <strong>{vo.uwriter}</strong>
            <span className='text-muted'>{vo.uregdate}</span>
            <p>{vo.ucontent}</p>
          </li>
        ))}
      </ul>
      {/*<ul className='list-group'>
        <li className='list-group-item'>
          <strong>테스형</strong>
          <span className='text-muted'>2025-05-29</span>
          <p>댓글 작성된 리스트 내용 들어감</p>
        </li>
      </ul>*/}
    </div>
  )
}

export default UpboardComm