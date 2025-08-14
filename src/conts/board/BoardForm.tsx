import React, { useState } from 'react'
import style from './board.module.css'
import { Link, useNavigate } from 'react-router-dom'

const BoardForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');
    //useNavigate(); navigate('path')
    //window.location='path'; window.href='path';
    const navigate = useNavigate();
    const boardSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert(`${title}, ${writer}, ${content}`)
        console.log('새 글 등록:', { title, writer, content });
        const newBoard = {
            id: Date.now(), //초단위로 알아서 증가해서 식별
            title,
            writer,
            content
        }
        //기존의 스토리지에서 읽어와서 처리
        const boardList = localStorage.getItem('boardList');
        //스토리지에 값이 있다면 배열로 반환, 아니면 비어있는 배열로 반환
        const list = boardList ? JSON.parse(boardList) : [];
        list.push(newBoard);
        //localStorage.setItem('key',JSON.stringify(list));
        localStorage.setItem('boardList',JSON.stringify(list));
        alert('Save했어요')
        navigate('/board');//board로 이동
    };
    return (
        <div className={style.container}>
            <form onSubmit={boardSubmit}>
                <table className={style.boardTable}>
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input type="text" name='writer' id='writer' style={{ width: '100%', padding: '8px' }}
                                    onChange={e => setTitle(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <th>작성자</th>
                            <td>
                                <input type="text" name='writer' id='writer' style={{ width: '100%', padding: '8px' }}
                                    onChange={e => setWriter(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>
                                <textarea name='content' id='content' style={{ width: '100%', height: '150px', padding: '8px' }}
                                    onChange={e => setContent(e.target.value)} />
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={2}>
                                <button type='submit' className={style.button}>등록하기</button>
                                <Link to='/board' className={style.button} style={{ margin: '10px' }}>취소</Link>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </form>
        </div>
    )
}

export default BoardForm