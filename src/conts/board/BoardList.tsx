import React, { useEffect, useState } from 'react'
import style from './board.module.css'
import { BoardItem, boardList } from './boardData'
import { Link } from 'react-router-dom'

const BoardList: React.FC = () => {
  //BoardItem[] 전용으로 배열을 생성해서 초기값으로 useState를 생성한다
  const [boardList,setBoardList]=useState<BoardItem[]>([]);
  //useEffect로 초기화
  useEffect(()=>{
    const data = localStorage.getItem('boardList');
    if (data) {
      setBoardList(JSON.parse(data));
    }
  },[])


  //list(range(1,11))=> Array.from(갯수,()=>{})
  //const boardData=[]
  return (
    <div className={style.container}>
      <h2>BoardList</h2>
      <table className={style.boardTable}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {
            //[{id:1,title:'테스'},{},...].map((item)=>(<p></p>))
            //array.map((item)=>(<p>{item.id}</p>))
            boardList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  {/* BoardDetail.tsx */}
                  <Link to={`/board/${item.id}`} className={style.titleLink}>{item.title}</Link>
                </td>
                <td>{item.writer}</td>
              </tr>
            ))
          }
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} style={{ textAlign: 'center' }}>
              {/* BoardFrom.tsx */}
              <Link to="/board/write" className={style.button}>
                글쓰기
              </Link>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default BoardList