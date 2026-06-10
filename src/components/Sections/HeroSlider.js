import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HeroSlider.module.css';

const HeroSlider = ({ hero = {}, news = [] }) => {
  const navigate = useNavigate();
  const {
    primaryCta,
    secondaryCta,
    slides = [],
  } = hero;

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play the slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds slide interval
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 70, behavior: 'smooth' });
    }
  };

  // Get recent 4 news items
  const recentNews = news.slice(0, 4);

  return (
    <section id="home" className={styles.heroContainer}>
      <div className={styles.heroGrid}>
        
        {/* LEFT COLUMN: Image Slider */}
        <div className={styles.sliderCol}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.slide} ${index === currentSlide ? styles.activeSlide : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className={styles.slideContent}>
                <div className={styles.slideTextInfo}>
                  <div className={styles.slideHeaderMeta}>
                    <span className={styles.slideBadge}>{slide.badge}</span>
                    <h2 className={styles.slideTitle}>
                      <span>{slide.titleHighlight}</span> {slide.titleSuffix}
                    </h2>
                  </div>
                  <p className={styles.slideDescription}>{slide.description}</p>
                </div>
                <div className={styles.heroButtons}>
                  {primaryCta && (
                    <button className={styles.btnPrimary} onClick={() => scrollToSection(primaryCta.scrollTo)}>
                      {primaryCta.label}
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  )}
                  {secondaryCta && (
                    <button className={styles.btnSecondary} onClick={() => scrollToSection(secondaryCta.scrollTo)}>
                      {secondaryCta.label}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Slider controls */}
          <button className={styles.prevBtn} onClick={handlePrevSlide} aria-label="Previous Slide">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className={styles.nextBtn} onClick={handleNextSlide} aria-label="Next Slide">
            <i className="fas fa-chevron-right"></i>
          </button>

          {/* Slider indicators */}
          <div className={styles.indicators}>
            {slides.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicatorDot} ${index === currentSlide ? styles.activeDot : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Live News & Notice Board */}
        <div className={styles.newsCol}>
          <div className={styles.newsPanel}>
            <div className={styles.newsHeader}>
              {/* <div className={styles.liveBadgeContainer}>
                <span className={styles.livePulse}></span>
                <span className={styles.liveText}>LIVE</span>
              </div> */}
              <h3>Recent News & Events</h3>
            </div>
            
            <div className={styles.newsList}>
              {recentNews.length > 0 ? (
                recentNews.map((item, idx) => (
                  <div
                    key={idx}
                    className={styles.newsItemCard}
                    onClick={() => navigate(`/news-event/${item.id}`)}
                  >
                    <div className={styles.itemMeta}>
                      <span className={`${styles.typeBadge} ${item.type === 'event' ? styles.eventBadge : styles.newsBadge}`}>
                        {item.type ? item.type.toUpperCase() : 'NEWS'}
                      </span>
                      <span className={styles.itemDate}>{item.date || ''}</span>
                    </div>
                    <h4 className={styles.itemTitle}>{item.title}</h4>
                    <p className={styles.itemDesc}>
                      {item.description ? item.description.substring(0, 75) + '...' : ''}
                    </p>
                  </div>
                ))
              ) : (
                <div className={styles.noNews}>No news items available at this time.</div>
              )}
            </div>

            <div className={styles.newsFooter}>
              <button className={styles.viewAllBtn} onClick={() => navigate('/news')}>
                View All News & Events <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSlider;
