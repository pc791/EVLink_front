import React from 'react'
import HTMLFlipBook from 'react-pageflip';

interface MyBookProps {
  //책디자인의 너비와 높이 (필수)
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string; //우리가 만들 클래스 속성 적용 
  showCover?: boolean; //showCover 가 true이면 첫번째 페이지를 표지로 사용하겠다
  autoSize?: boolean;
  maxShadowOpacity?: number;//페이지를 넘길때 그림자의 투명도값 (기본값 1 , 0 ~ 1)
  mobileScrollSupport?: boolean;// 모바일 장치에서 스크롤로 넘길 것이냐
}
const myData = [
  {image: "images/bg1.png", text: '오늘은 강가를 걸었다. 물소리가 좋았다\n 정말 재미있었다. 아 행복하다'},
  {image: "images/bg2.png", text: '밤에 거리를 걸다'},
  {image: "images/bg3.png", text: '도서관에서 책읽기'},
  {image: "images/bg4.png", text: '오늘은 비내림'},
  {image: "images/bg5.png", text: '내일도 비내림 내일도'}
]

const Diary: React.FC<MyBookProps> = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h2>Diary</h2>
      {/* 중앙에 배치를 하고 overflow: 'hidden' 해서 흔들림 방지  */}
      <div style={{
        width: '620px', margin: '20px auto',
        overflow: 'hidden', borderRadius: '10px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
      }}>
        {/* usePortrait={true} : 모바일에서 화면이 작으면 책이 한장(반응형웹) */}
        <HTMLFlipBook width={300} height={400} showCover={true}
          {...({ style: {}, usePortrait: true } as any)}
          autoSize={true} mobileScrollSupport={true} maxShadowOpacity={0.2}
          usePortrait={true} style={{ borderRadius: '10px' }}
        >
          {(() => myData.flatMap((entry, idx) => [
            //이미지 페이지
            <div key={`img-${idx}`} style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
              <img src={entry.image} alt={`Diary Image ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>,

            //텍스트 페이지
            <div key={`txt-${idx}`} style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              fontSize: '18px',

            }}>
              <p style={{ margin: 0 }}>{entry.text}</p>
            </div>
          ]))()}

        </HTMLFlipBook>
      </div>
    </div>
  )
}

export default Diary