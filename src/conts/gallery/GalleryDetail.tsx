// src/main/conts/GalleryDetail.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../comp/AuthProvider';
import axios from 'axios';
import styles from './gallery.module.css';

interface GalleryItem {
  num: number;
  title: string;
  contents: string;
  writer: string;
  reip: string;
  hit: number;
  gdate: string;
  getimglist: GalleryImage[] | null;
}

interface GalleryImage {
  galleryid: number;
  imagename: string;
}

const GalleryDetail: React.FC = () => {
  const { member } = useAuth();
  const location = useLocation();
  const { num } = useParams<{ num: string }>();

  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      if (!num) {
        console.error("num 파라미터가 없습니다.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://192.168.0.92/myictstudy0521/gallery/gdetail`, {
          params: { num: parseInt(num) }
        });
        setItem(response.data);
        console.log("응답 데이터:", response.data);
      } catch (error) {
        console.error("데이터 요청 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [num]);


  if (loading) return <p>로딩 중...</p>;
  if (!item) return <p>이미지를 찾을 수 없습니다.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{item.title}</h2>
      <div className={styles.detail}>
        <p><strong>작성자:</strong> {item.writer}</p>
        <p><strong>내용:</strong> {item.contents}</p>
        <p><strong>작성일:</strong> {item.gdate}</p>
        <p><strong>조회수:</strong> {item.hit}</p>

        <div className={styles.imageBox}>
          {item.getimglist && item.getimglist.length > 0 ? (
            item.getimglist.map((img, idx) => (
              <img
                key={idx}
                src={`http://192.168.0.92/myictstudy0521/imgfile/gallery/${img.imagename}`}
                alt={`img-${idx}`}
                className={styles.image}
              />
            ))
          ) : (
            <p>이미지가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryDetail;
