import React from 'react';
import styles from './NewsTicker.module.css';

const NewsTicker = ({ news = [] }) => {
  if (!news || news.length === 0) return null;
  const tickerItems = news;

  const handleTickerClick = () => {
    const element = document.getElementById('news-events');
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.tickerContainer}>
      <div className={styles.tickerLabel} onClick={handleTickerClick}>
        <span className={styles.pulseDot}></span>
        LATEST UPDATES
      </div>
      <div className={styles.tickerScroll} onClick={handleTickerClick}>
        <div className={styles.tickerTrack}>
          {/* Double the list to create a seamless infinite loop */}
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <span key={idx} className={styles.tickerItem}>
              <span className={styles.tickerDate}>{item.date || ''}</span>
              <span className={styles.tickerTitle}>{item.title}</span>
              <span className={styles.tickerDivider}>•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
