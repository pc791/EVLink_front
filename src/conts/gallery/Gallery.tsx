// Gallery.tsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import style from './gallery.module.css'
import axios from 'axios';

//resultType="map"일경우 대문자로 작성
interface GalleryVO {
  NUM: number;
  TITLE: string;
  CONTENTS: string;
  WRITER: string;
  REIP?: string;
  HIT?: number;
  GDATE?: string;
  IMAGENAME: string;
}
/*
{
      "HIT": 0,
      "ROW_NUM": 7,
      "NUM": 10,
      "WRITER": "d",
      "TITLE": "dddd",
      "IMAGENAME": "img02.jpg",
      "REIP": "192.168.0.92",
      "GDATE": "2025-06-02T05:35:15.000+00:00",
      "CONTENTS": "dd"
    },
*/

const Gallery: React.FC = () => {
  const [galleryList, setGalleryList] = useState<GalleryVO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); //기본 1값을 초기화
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  //검색을 위한 useState 추가
  const [searchType, setSearchType] = useState('1');
  const [searchValue, setSearchValue] = useState('');

  //한페이지에 보여줄 페이지 블록수

  const imageBasePath = 'http://192.168.0.92/myictstudy0521/imgfile/gallery/';

  const fetchGalleryList = async (page: number) => {
    try {
      const response = await axios.get('http://192.168.0.92/myictstudy0521/gallery/galleryList',
        { params: { cPage: page, searchType: searchType, searchValue: searchValue } })
      console.log(response.data.data)
      setGalleryList(response.data.data);
      setTotalItems(response.data.totalItems);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setStartPage(response.data.startPage);
      setEndPage(response.data.endPage);
    } catch (error) {
      console.error("데이터 가져오기 실패" + error);
    }
  }

  useEffect(() => {
    fetchGalleryList(currentPage);
  }, [currentPage]);
  //페이지 핸들러
  const pageChange = (page: number) => {
    setCurrentPage(page);
  }
  const searchFunction = () => {
    fetchGalleryList(1);
  }

  return (
    <div className={style.container}>
      <h2 className={style.title}>갤러리</h2>
      <div style={{ textAlign: 'right', marginBottom: '15px' }}>
        <Link to="/gallery/write" className={style.button}>이미지 추가</Link>
      </div>
      <div className={style.grid}>
        {galleryList.map(item => (
          <Link to={`/gallery/${item.NUM}`} key={item.NUM} style={{ textDecoration: 'none' }}>
            <div className={style.card}>
              <div className={style.cardTitle}>{item.NUM}</div>
              <img src={imageBasePath + item.IMAGENAME} alt={item.TITLE} />
              <div className={style.cardTitle}>{item.TITLE}</div>
            </div>
          </Link>
        ))}
      </div>
      <div>
        {/* 검색 */}
        <select
          onChange={(e) => { setSearchType(e.target.value) }}>
          <option value="1">작성자</option>
          <option value="2">제목</option>
          <option value="3">내용</option>
        </select>
        <input type='text'
          onChange={(e) => { setSearchValue(e.target.value) }} />
        <button className="btn btn-warning" onClick={searchFunction}>검색</button>
      </div>
      <div>
        <nav>
          <ul className="pagination justify-content-center">
            {/* PrevPage 출력하기 : startPage > 1 보다 클때   
                                        Upboard List = 73
                                        검수용 : totalPages 8 / startPage: 6 / endPage : 8
                                    */}
            {startPage > 1 && (
              <li className="page-item">
                <button className="page-link" onClick={() => { pageChange(startPage - 1) }}>이전</button>
              </li>
            )}


            {/* 페이지 출력하기 */}
            {
              // startPage = 1 , endPage=3 => [1,2,3]이란 배열을 만들어 준다.
              Array.from({ length: endPage - startPage + 1 }, (xx, i) => i + startPage)
                .map((page) => (
                  <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => { pageChange(page) }}>{page}</button>
                  </li>
                ))
            }


            {/* <li className="page-item active">
                                        <button className="page-link">2</button>
                                    </li> */}

            {/* NextPage 출력하기 : totalPage 보다 endPage 적을 때 다음페이지가 있는 것으로 계산  
                                검수용 : totalPages 8 / startPage: 1 / endPage : 5
                                */}
            {endPage < totalPages && (
              <li className="page-item">
                <button className="page-link" onClick={() => { pageChange(endPage + 1) }}>다음</button>
              </li>
            )}

          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Gallery;