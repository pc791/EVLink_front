import React, { useState } from 'react';
import styles from './gallery.module.css';
import { useNavigate } from 'react-router-dom';
//미리보기, 폼 전송을 위한 인터페이스
interface FormData{
    num:number;
    title:string;
    writer:string;
    contents: string;
    reip?:string;
    hit?:number;
    gdate?:string;
    //https://developer.mozilla.org/ko/docs/Web/API/File
    //File Interface는 javascript에서 파일을 접근할 수 있는 자바스크립트 객체이다.
    // images: File | null; 
    images:File[];
}
const GalleryForm: React.FC = () => {
 // jsObject 형 State를 선언, 초기화 
  const [formData, setFormData] = useState<FormData>({
    num:0,
    title:'',
    writer:'',
    contents:'',
    images:[] //여러개의 이미지 파일 [data:img/pngAS,data:img/pngAS]
  });
  // 미리보기를 구현할때 사용하는 상태관리 (넘어오는 파일의 이름이 한개가 아니기 때문에 배열로 처리리)
  const [preview, setPreview] = useState<string[]>([]);
  // navigate
  const naviate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); alert('이미지가 등록되었습니다!');
    // Form전송값 객체 new  FormData();
    //----------------------------------
    const myFormdata = new FormData();
    // state에 저장한 값을 FormData객체에 하나씩 저장
    // append("paramName",value)
    // 여기까지가 서버측 컨트럴러에게 전송하는 GalleryVO의 property와 같아야 한다.
    // addGallery(@ModelAttribute GalleryVO galleryVO
    myFormdata.append('writer',formData.writer);
    myFormdata.append('title',formData.title);
    myFormdata.append('contents',formData.contents);
    // 이미지 배열 => @RequestParam("images") MultipartFile[] images
    formData.images.forEach((file,index) =>{
      myFormdata.append('images',file);
    }); 
    try {
    console.log(`FormData => ${myFormdata}`);
    //----------------------------------
    // axios나 fetch  서버로 데이터를 전송 
    const response = await fetch('http://192.168.0.92/myictstudy0521/gallery/add',
      {method:'POST',body:myFormdata}
    );
     naviate('/gallery'); //입력 성공이면 리스트로 이동
    } catch (error) {
       console.error('전송 오류:', error);
    }

  };
 const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name,value,files} = e.target;
    console.log(`AllNames : ${name} : ${value}`);
    // files[0] =>첫번째 이미지 객체
    if (name === 'images' && files ) { // file이 존재할 경우
      // console.log(`ImageName : ${name} : ${value} | ${files[0]} , ${files[1]}`);
      // console.log(`typeofFile => ${typeof(files)}`);
        // 배열 - 파일을 하나씩 반복하면서 FileReader()로 바이너리로 읽어 들인 후 
        // 읽어 들인것은 기다린 후(콜백)에 preview에 저장한다.
        const fileArray = Array.from(files);
        //--------------------------------------------------------------------
        //배열에서 이미지 하나당 이미지의 주소를 반환 해주는 배열값
        const filePreviews = fileArray.map(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            //파일의 바이너리를 읽어서 반환 
            return new Promise<string>((resolve) => {
                reader.onloadend = () => {
                resolve(reader.result as string); //이미지 바이너리 값을 문자열로 전송 
              };
            });
        });
        //useState에 저장 - 하나라도 만약에 실패하게 되면, 전체가 실패 한것으로 취급 하고 싶다면
        Promise.all(filePreviews).then(pUrls => {
          setPreview(pUrls);
        });
        // 실제 읽어들인 이미지들을 useState에 formData에 추가해서 저장
         // 이미지 배열을 images:[]에  저장한다.
        setFormData({...formData,images:fileArray});
    }else{
        setFormData({...formData,[name]:value}); // name:iamges가 아닐 경우 일반 string 저장 
    }
 }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>이미지 등록</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input className={styles.input} type="text" placeholder="제목 입력"
           onChange={handleChange} required name='title'
        />
        <input type='text' id='contents' name='contents' onChange={handleChange} 
        className="form-control"
        placeholder="내용"
        />
        <input type='text' id='writer' name='writer' 
         onChange={handleChange} className="form-control"
          placeholder="작성자"
         />
        <input  className={styles.input} type="file" placeholder="이미지 URL 입력"
           onChange={handleChange} required name='images'  multiple
        />
        {/* 이미지 미리보기 */}
        {
          preview.length > 0 && (
             <div className="mb-3">
                {
                  preview.map((p,index) => (
                    <p key={index}>
                      <img  src={p} alt='' className='img-thumbnail'
                      style={{ marginRight: '10px', marginBottom: '10px', width: '150px', height: '150px' }}
                      />
                      <span>{p}</span>
                    </p>
                  ))
                }
             </div>
          )
        }
        <button type="submit" className={styles.button}>등록</button>
      </form>
    </div>
  );
};
export default GalleryForm;