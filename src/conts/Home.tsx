import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const Home: React.FC = () => {
  const settings = {
    dots: true, //하단점
    fade: true,
    waitForAnimate: false,
    infinite: true, //무한반복
    speed: 500,
    slidesToshow: 1, //한번에 보여줄 슬라이드
    slidesToScroll: 1, //한번에 넘길때 몇개씩 넘길 수
    autoplay: true, //자동 시작
    autoplatSpeed: 3000, //넘기는 속도
    arrows: true // 화살표 좌우
  };

  const homeData = [
    { id: 1, img: "images/bg1.png", text: '안녕하세요 ICTPassword!' },
    { id: 2, img: "images/bg2.png", text: '스프링전문가' },
    { id: 3, img: "images/bg3.png", text: '테스형입니다' }
  ]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', marginTop: '30px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Home</h2>
      <Slider {...settings}>
        {
          homeData.map(hdata => (
            <div key={hdata.id}>
              <div style={{
                position: 'relative', height: '400px',
                background: `url(${hdata.img}) center/cover no-repeat`,
                overflow: "hidden"
              }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#fff', fontSize: '24px',
                    fontWeight: 'bold',
                    padding: '20px 40px',
                    borderRadius: '8px'
                  }}
                >{hdata.text}</div>
              </div>
            </div>
          ))
        }
      </Slider >
    </div>
  )
}

export default Home