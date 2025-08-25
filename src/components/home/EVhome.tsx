import React from 'react';
import styles from './EVhome.module.css';
// import Faq from './faq/FAQ';

const EVhome: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.content}>
          <h1 className={styles.title}>Smart Charging with EVLink</h1>
          <p className={styles.description}>
            EVLink와 함께라면 전기차 충전이 더욱 간편해집니다. 전국 충전소 지도와 충전 예약 시스템 등
            최적화된 사용자 경험을 제공하여 여러분의 충전 여정을 지원합니다.
          </p>
          <button className={styles.button}>충전소 찾기</button>
        </div>
        <div className={styles.image}>
          <img 
            src="/images/main4.jpg" 
            alt="EV charging stations with green glow"
          />
        </div>
      </section>

      {/* Innovation Section */}
      <section className={styles.section}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.icon}>⚡</div>
            <h2 className={styles.title}>EVLink의 혁신적인 충전 솔루션</h2>
            <p className={styles.description}>
              EVLink는 사용자 친화적인 인터페이스로 어디서든 쉽게 충전소를 찾을 수 있도록 
              전기차 충전의 새로운 기준을 제시합니다.
            </p>
            <div className={styles.buttons}>
              <button className={styles.button}>자세히 보기</button>
              <button className={styles.button}>가입하기</button>
            </div>
          </div>
          <div className={styles.right}>
            <img 
              src="/images/main3.jpg" 
              alt="Charging station with 28% display"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <h2 className={styles.title}>
          EVLink로 스마트한 전기차 충전의 새로운 경험을 만나보세요.
        </h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.image}>
              <img 
                src="/images/world-map-pins.jpg" 
                alt="World map with charging station pins"
              />
            </div>
            <h3 className={styles.cardTitle}>
              간편한 충전소 찾기와 예약 시스템을 제공합니다.
            </h3>
            <p className={styles.cardDescription}>
              EVLink는 전기차 충전소를 쉽게 찾고 예약할 수 있는 서비스를 제공합니다.
            </p>
            <a href="#" className={styles.link}>자세히</a>
          </div>

          <div className={styles.card}>
            <div className={styles.image}>
              <img 
                src="/images/main9.jpg" 
                alt="Usage history bar chart"
              />
            </div>
            <h3 className={styles.cardTitle}>
              사용 내역을 간편하게 확인하고 관리하세요.
            </h3>
            <p className={styles.cardDescription}>
              사용 내역과 예약 상세 내역을 한눈에 확인할 수 있습니다.
            </p>
            <a href="#" className={styles.link}>확인</a>
          </div>

          <div className={styles.card}>
            <div className={styles.image}>
              <img 
                src="/images/community-charging.jpg" 
                alt="EV charging station in green setting"
              />
            </div>
            <h3 className={styles.cardTitle}>
              커뮤니티와 함께하는 전기차 사용자들의 공간입니다.
            </h3>
            <p className={styles.cardDescription}>
              이벤트 공지사항을 통해 최신 정보를 받아보세요.
            </p>
            <a href="#" className={styles.link}>참여</a>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className={styles.section}>
        <h2 className={styles.title}>고객 후기</h2>
        <p className={styles.subtitle}>전기차 충전의 새로운 경험을 세공합니다.</p>
        
        <div className={styles.carousel}>
          <button className={styles.arrow}>‹</button>
          
          <div className={styles.reviews}>
            <div className={styles.reviewCard}>
              <div className={styles.logo}>Webflow</div>
              <p className={styles.quote}>
                EVLink 덕분에 충전이 훨씬 간편해졌습니다.
              </p>
              <div className={styles.reviewer}>
                <div className={styles.name}>김철수</div>
                <div className={styles.job}>팀장, ABC회사</div>
              </div>
              <a href="#" className={styles.link}>Read case study</a>
            </div>

            <div className={styles.reviewCard}>
              <div className={styles.logo}>Relume</div>
              <p className={styles.quote}>
                EVLink는 충전소를 쉽게 찾게 해줍니다.
              </p>
              <div className={styles.reviewer}>
                <div className={styles.name}>이영희</div>
                <div className={styles.job}>부장, XYZ기업</div>
              </div>
              <a href="#" className={styles.link}>Read case study</a>
            </div>
          </div>

          <button className={styles.arrow}>›</button>
        </div>a

        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.active}`}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
      </section>
    </div>
  );
};

export default EVhome;