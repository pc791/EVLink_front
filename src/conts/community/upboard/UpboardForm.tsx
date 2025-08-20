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
  const [formData, setFormData] = useState<UpBoardVO>({
    title: '',
    writer: '',
    content: '',
    mfile: null as File | null
  });
  //File객체를 사용해서 읽어들인  값을 미리보기 용으로 사용할 useState
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement |
    HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      //jacascript FileReader() 를 사용해서 읽어온다
      //미리보기 구현*************
      //file 객체 읽어들임
      const file = e.target.files[0];
      //파일을 읽어 들이기 위함 FileReader() 객체 선언
      const reader = new FileReader();
      //Reader를 통해서 파일을 읽어오기위해서 감지하는 영역
      //여기서 파일을 읽어와서 핸들링하는 영역
      reader.onloadend = () => {//파일 stream이 읽어오는 영역
        console.log("파일 이미지가 감지됨")
        console.log(reader.result);
        setPreview(reader.result);
      }
      //읽어올 file 주소를
      reader.readAsDataURL(file);
      setFormData({ ...formData, mfile: file });
    }
  }
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('writer', formData.writer);
    data.append('content', formData.content);
    if (formData.mfile) {
      data.append('mfile', formData.mfile);
    }
    try {
      const url = 'http://192.168.0.92/myictstudy0521/upboard/upboardAdd';
      await axios.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/community/uplist');
    } catch (error) {
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
            {preview &&
              (<tr>
                <td colSpan={2} style={{ textAlign: 'center' }}>
                  <img src={preview as string} alt="" style={{ width: '150px', height: '150px', marginRight: '10px', marginLeft: '10px' }} />
                  {/* {preview as string} */}
                </td>
              </tr>
              )}
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