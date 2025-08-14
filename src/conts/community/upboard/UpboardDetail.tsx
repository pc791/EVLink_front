import React, { useEffect, useState } from 'react'
import style from './upboard.module.css';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import UpboardComm from './UpboardComm';
import { useAuth } from '../../../comp/AuthProvider';

interface UpBoardVO {
    num?: number;
    title: string;
    writer: string;
    content: string;
    imgn?: string;
    hit?: number;
    reip?: string;
    bdate?: string;
    mfile: File | null;
}

const UpboardDetail: React.FC = () => {
    const { member } = useAuth();
    const location = useLocation();


    const [upboard, setUpboard] = useState<UpBoardVO | null>(null);
    //라우터에서 넘어오는 파라미터를 받아서 저장한다
    const { num } = useParams<{ num: string }>();
    //초기화할때 서버의 데이터를 받아와서 upboard에 저장한 후 랜더링 시키기
    useEffect(() => {
        const detailServer = async () => {
            const resp = await axios.get<UpBoardVO>(`http://192.168.0.92/myictstudy0521/upboard/updetail?num=${num}`);
            setUpboard(resp.data);
            console.log(resp.data);
        }
        detailServer();
    }, [num])
    const imageBasePath = 'http://192.168.0.92/myictstudy0521/imgfile/';

    // if (!member) {
    //     return <Navigate to='/login' state={{ from: location }} replace />
    // }

    return (
        <div className={style.container}>
            <h2>UpBoard 상세내용</h2>
            <table className={style.boardTable}>
                <tbody>
                    <tr>
                        <th>번호</th><td>{upboard?.num}</td>
                    </tr>
                    <tr>
                        <th>제목</th><td>{upboard?.title}</td>
                    </tr>
                    <tr>
                        <th>작성자</th><td>{upboard?.writer}</td>
                    </tr>
                    <tr>
                        <th>이미지</th><td>{upboard?.imgn && (<img src={`${imageBasePath}${upboard.imgn}`}
                            alt={upboard.title} className={imageBasePath} />)}</td>
                    </tr>
                    <tr>
                        <th>내용</th><td>{upboard?.content}</td>
                    </tr>

                </tbody>
                {/* tfoot 목록으로 가는 링크를 만들고 스타일은 .button  */}
                <tfoot>
                    <tr>
                        <td colSpan={2} style={{ textAlign: "center" }}>
                            <button className={style.button} >삭제</button>
                            <Link to="/community/uplist" className={style.button}>목록으로</Link>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <hr />
            <UpboardComm num={upboard?.num} />
        </div>
    )
}
export default UpboardDetail