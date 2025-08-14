import React, { useState } from 'react'
import styles from './upboard.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
//community/upboard/UpboardForm.tsx
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
const UpboardForm: React.FC = () => {

  //useState 선언 및 초기화
  const [formData, setFormData] = useState<UpBoardVO>({
    title: '',
    writer: '',
    content: '',
    mfile: null as File | null
  });
  //checkbox편 진행한 수업 내용을 한번더 비교 하기 바람.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement |
    HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) { // 파일업로드가 존재하면
      //useState에 저장하겠다.
      setFormData({ ...formData, mfile: e.target.files[0] });
    }
  }
  //axios 사용방법
  //const fN = async ()=> {}
  //입력후 리스트로 이동하기위한 훅을 생성
  const navigate = useNavigate();

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title',formData.title);
    data.append('writer',formData.writer);
    data.append('content',formData.content);
    if (formData.mfile) {
      data.append('mfile',formData.mfile);
    }
    //여기까지 useState에 저장된 값을 찾아와서 다시 FormData에 모든 값을 저장
    try{
      //파일 업로드시 폼의 속성 예 => encType='multipart/form-data'
      //무조건 post 방식이다 *****
      //axios.post(url,data,[{header}])
      const url='http://192.168.0.92/myictstudy0521/upboard/upboardAdd';
      await axios.post(url,data,{
        headers:{'Content-Type':'multipart/form-data'}
      });
      navigate('/community/uplist');
    }catch(error){
      console.log(`Error => ${error}`);
    }
    console.log(`FormData 전송 시 name이 필수 ! Title => ${formData.title}, Writer =>${formData.writer}`);
  }
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>이미지 등록 예제</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <table className={styles.boardTable}>
          <tbody>
            <tr>
              <th>제목</th>
              <td><input type="text" name="title" id="title"
                className={styles.input}
                onChange={handleChange} required
              /></td>
            </tr>
            <tr>
              <th>작성자</th>
              <td><input type="text" name="writer" id="writer"
                className={styles.input}
                onChange={handleChange} required
              /></td>
            </tr>
            <tr>
              <th>내용</th>
              <td><textarea name="content" id="content"
                style={{ width: '90%', height: '150px', padding: '8px' }}
                onChange={handleChange} required
              /></td>
            </tr>

            <tr>
              <th>이미지</th>
              <td><input type="file" name="mfile" id="mfile"
                className={styles.input}
                onChange={handleFileChange} required
              /></td>
            </tr>

          </tbody>
          <tfoot>
            <tr>
              <th colSpan={2}>
                <button type="submit" className={styles.button}>등록하기</button>
                <Link to="/community/uplist" className={styles.button}
                  style={{ marginLeft: '10px' }}
                >취소</Link>
              </th>
            </tr>
          </tfoot>
        </table>
      </form>
    </div>
  )
}

export default UpboardForm