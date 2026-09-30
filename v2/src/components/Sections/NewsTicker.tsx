import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NewsTicker.module.css';

interface NewsItem {
  id?: string | number;
  date?: string;
  title: string;
  [key: string]: any;
}

interface NewsTickerProps {
  news?: NewsItem[];
}

const NewsTicker: React.FC<NewsTickerProps> = ({ news = [] }) => {
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
      <div className={styles.tickerScroll}>
        <div className={styles.tickerTrack}>
          {/* Double the list to create a seamless infinite loop */}
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <Link key={idx} to={`/news-event/${item.slug || item.id}`} className={styles.tickerItem} style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className={styles.tickerDate}>{item.date || ''}</span>
              <span className={styles.tickerTitle}>{item.title}</span>
              <span className={styles.tickerDivider}>•</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
