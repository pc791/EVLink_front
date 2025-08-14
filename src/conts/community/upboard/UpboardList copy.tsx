import axios from 'axios';
import React, { useEffect, useState } from 'react'
import style from './upboard.module.css'
import { Link } from 'react-router-dom';
//서버의 값을 받아와서 UI에 반복해서 배치

//1. 서버측으로 부터 받아올 UpBoardVO를 json타입으로 자바스크립트 인터페이스를 선언
interface UpBoardVO {
  num: number;
  title: string;
  writer: string;
  content: string;
  imgn: string;
  hit: number;
  reip: string;
  bdate: string;
}

const UpboardList: React.FC = () => {
  //2. 서버데이터 JsonArray 자바스크립트 배열로 저장할 ustState 선언
  //[]로 초기화
  const [upboardList, setUpboardList] = useState<UpBoardVO[]>([]);
  //3. 초기화 시 axios를 사용해서 서버측 데이터를 받아와서 useState에 저장하기

  //이미지 경로를 지정하기
  //http://192.168.0.92/myictstudy0521/imgfile/
  const imageBasePath= 'http://192.168.0.92/myictstudy0521/imgfile/';
  useEffect(() => {
    //서버에서 목록을 가져오는 함수
    //async()=>{await...}
    const fetchUpboardList = async () => {
      try {
        const response = await axios.get('http://192.168.0.92/myictstudy0521/upboard/upListDemo')
        console.log(response.data)
        setUpboardList(response.data)
      } catch (error) {
        console.error("데이터 가져오기 실패" + error);
      }
    }
    fetchUpboardList();
  }, []);

  return (
    <div className={style.container}>
      <h2>UpBoardList</h2>
      <table className={style.boardTable}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>이미지</th>
            <th>조회수</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {            
            upboardList.map((item) => (
              <tr key={item.num}>
                <td>{item.num}</td>
                <td>                 
                  <Link to={`/board/${item.num}`} className={style.titleLink}>{item.title}</Link>
                </td>
                <td>{item.writer}</td>
                <td>{item.imgn?(<img src={`${imageBasePath}${item.imgn}`} alt={item.title} style={{width:'80px', height:'auto'}}/>):("No Image")}</td>
                <td>{item.hit}</td>
                <td>{item.bdate}</td>
              </tr>
            ))
          }
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6} style={{ textAlign: 'center' }}>              
              <Link to="/community/upform" className={style.button}>
                글쓰기
              </Link>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default UpboardList