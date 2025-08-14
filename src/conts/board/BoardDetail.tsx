import React from 'react'
import style from './board.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { boardList } from './boardData';
import { Link } from 'react-router-dom';

const BoardDetail: React.FC = () => {
    //path에서 전달되어 온 값을 받아서 처리해주는 Hook
    //useParams()
    //<Route path='/board/:id'=>{id}
    //-----파라미터를 받아서 변수를 저장하기 위함******
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const details = boardList.find(item => item.id === Number(id));
    console.log(`상세보기 => ${typeof (id)}||${details}`);
    console.log(details);
    const delBoard = ()=>{
        if (window.confirm("정말 삭제하시겠습니까?")) {
            const oriBoardList=JSON.parse(localStorage.getItem('boardList')||'[]');
            const newBoardList = oriBoardList.filter((item:any)=>item.id!==Number(id));
            localStorage.setItem('boardList',JSON.stringify(newBoardList));
         alert("삭제되었습니다");   
         navigate('/board');
        }
    }

    return (
        <div className={style.container}>
            <h2>게시글 상세내용</h2>
            <table className={style.boardTable}>
                <tbody>
                    <tr>
                        <th>제목</th>
                        <td>{details?.title}</td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td>{details?.writer}</td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>{details?.content}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={2} style={{textAlign:'center'}}>
                            <button className={style.button} onClick={delBoard}>삭제</button>
                            {/* BoardForm.tsx */}
                            <Link to='/board' className={style.button}>목록으로 가라</Link>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default BoardDetail