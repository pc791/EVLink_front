// GalleryForm.tsx
import React, { useState } from 'react'
import styles from './gallery.module.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const GalleryForm: React.FC = () => {
  const [title,setTitle]=useState('');  
  const [image,setImage]=useState('');
  const navigate = useNavigate();
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // alert('이미지가 등록되었습니다!');
    const newGallery = {
      id: Date.now(),
      title,      
      image
    }
    const galleryList = localStorage.getItem('galleryList');
    const list = galleryList ? JSON.parse(galleryList) : [];
    list.push(newGallery);
    localStorage.setItem('galleryList', JSON.stringify(list));
    navigate('/gallery');
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>이미지 등록</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input className={styles.input} type="text" value={title} placeholder='제목 입력' onChange={e=>setTitle(e.target.value)} required/>
        <input className={styles.input} type="text" value={image} placeholder='이미지 URL 입력' onChange={e=>setImage(e.target.value)} required/>
                <button className={styles.button} type='submit'>등록</button>
        <Link to='/gallery' className={styles.button} style={{textAlign:'center'}}>취소</Link>
      </form>
    </div>

  )
}

export default GalleryForm;