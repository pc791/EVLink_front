import axios from 'axios';
import React, { useEffect, useState } from 'react'
import style from './memo.module.css'
import { Link } from 'react-router-dom';
//서버의 값을 받아와서 UI에 반복해서 배치
/*
{
  "totalItems": 31,
  "startPage": 1,
  "data": [
    {
      "num": 50,
      "title": "업로드 마무리",
      "writer": "테스형",
      "content": "ㅇㅇ",
      "imgn": "gallery13.jpg",
      "hit": 0,
      "reip": "192.168.0.92",
      "bdate": "2025-05-26 14:23:41",
      "mfile": null
    },
    .....    
  ],
  "totalPages": 4,
  "endPage": 4,
  "currentPage": 1
}
*/

//1. 서버측으로 부터 받아올 UpBoardVO를 json타입으로 자바스크립트 인터페이스를 선언
interface MemoVO {
  num: number;
  writer: string;
  conts: string; 
  mreip: string;
  mdate: string;
}

const MemoList: React.FC = () => {
  //2. 서버데이터 JsonArray 자바스크립트 배열로 저장할 ustState 선언
  //[]로 초기화
  const [memoList, setMemoList] = useState<MemoVO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); //기본 1값을 초기화
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  //한페이지에 보여줄 페이지 블록수
  const pagePerBlock = 5;
  //3. 초기화 시 axios를 사용해서 서버측 데이터를 받아와서 useState에 저장하기

  useEffect(() => {
    //서버에서 목록을 가져오는 함수
    //async()=>{await...}
    const fetchMemoList = async (page: number) => {
      try {
        //http://192.168.0.92/myictstudy0521/memo/upList?cPage=1
        //서버에 파라미터를 Map으로 전달한다 자바스크립트 Object 리터럴 {key, value}
        // => @RequestParam Map<String, String> paramMap
        const response = await axios.get('http://192.168.0.92/myictstudy0521/memo/memoList',
          { params: { cPage: page } })
        console.log(response.data.data)
        setMemoList(response.data.data);
        setTotalItems(response.data.totalItems);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setStartPage(response.data.startPage);
        setEndPage(response.data.endPage);
      } catch (error) {
        console.error("데이터 가져오기 실패" + error);
      }
    }
    fetchMemoList(currentPage);
  }, [currentPage]);
  //페이지 핸들러
  const pageChange=(page:number)=>{
    setCurrentPage(page);
  }

  return (
    <div className={style.container}>
      <h2>MemoBoardList={totalItems}</h2>
      <h3>검수용 : totalPages {totalPages} / startPage: {startPage}/ endPage : {endPage}</h3>
      <table className={style.boardTable}>
        <thead>
          <tr><td colSpan={6}>현재페이지 {currentPage}</td></tr>
          <tr>
            <th>번호</th>            
            <th>작성자</th>
            <th>내용</th>
            <th>아이피피</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {
            memoList.map((item) => (
              <tr key={item.num}>
                <td>{item.num}</td>
                <td>
                  <Link to={`/memo/${item.num}`} className={style.titleLink}>{item.writer}</Link>
                </td>
                <td>{item.conts}</td>                
                <td>{item.mreip}</td>
                <td>{item.mdate}</td>
              </tr>
            ))
          }
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={5}>
              <nav>
                <ul className='pagination justify-content-center'>
                  {startPage > 1 && (
                    <li className='page-item'>
                      <button className='page-link' onClick={() => { pageChange(startPage - 1) }}>이전</button>
                    </li>
                  )}
                  {
                    Array.from({ length: endPage - startPage + 1 }, (xx, i) => i + startPage)
                      .map((page) => (
                        // 
                        <li key={page} className={`page-item ${page==currentPage}?'active':''}`}>
                          <button className='page-link' onClick={() => { pageChange(page) }}>{page}</button>
                        </li>
                      ))
                  }
                  {/*<li className='page-item active'>
                <button className='page-link'>2</button>
              </li>/*/}
                  {endPage < totalPages && (
                    <li className='page-item'>
                      <button className='page-link' onClick={() => { pageChange(endPage + 1) }}>다음</button>
                    </li>
                  )}
                </ul>
              </nav>
            </th>
          </tr>
          <tr>
            <td colSpan={5} style={{ textAlign: 'center' }}>
              <Link to="/community/upform" className={style.button}>
                글쓰기
              </Link>
            </td>
          </tr>
        </tfoot>
      </table >
    </div >
  )
}

export default MemoList