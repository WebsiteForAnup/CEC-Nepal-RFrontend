import React, { useState, useEffect } from 'react';
import styles from './About.module.css';
import useScrollAnimation from '../../hooks/useScrollAnimation';

interface PotentialBox {
  heading?: string;
  text?: string;
}

interface MissionItem {
  icon?: string;
  label?: string;
}

interface Counter {
  start?: number;
  end: number;
  duration?: number;
  suffix?: string;
  label: string;
}

interface AboutData {
  subtitle?: string;
  title?: string;
  potentialBox?: PotentialBox;
  missionTitle?: string;
  missionItems?: MissionItem[];
  counters?: Counter[];
}

interface AboutProps {
  about?: AboutData;
}

const About: React.FC<AboutProps> = ({ about = {} }) => {
  const {
    subtitle = 'Welcome to CEC Nepal',
    title = 'Pioneering Green Energy Solutions',
    potentialBox = {},
    missionTitle = 'Our Mission',
    missionItems = [],
    counters = [],
  } = about;

  const [textRef, textVisible] = useScrollAnimation({ threshold: 0.2 });
  const [statsRef, statsVisible] = useScrollAnimation({ threshold: 0.2 });
  const [counts, setCounts] = useState<number[]>(() => counters.map(() => 0));

  useEffect(() => {
    if (counters.length > 0) {
      setCounts(counters.map(() => 0));
    }
  }, [counters]);

  useEffect(() => {
    if (!statsVisible || counters.length === 0) return;

    const timers = counters.map((counter, i) => {
      const end = counter.end;
      const start = counter.start ?? 0;
      const duration = counter.duration ?? 2000;
      let current = start;
      const increment = (end - start) / (duration / 16);

      return setInterval(() => {
        current += increment;
        if (current >= end) {
          setCounts(prev => { const next = [...prev]; next[i] = end; return next; });
          clearInterval(timers[i]);
        } else {
          setCounts(prev => { const next = [...prev]; next[i] = Math.floor(current); return next; });
        }
      }, 16);
    });

    return () => timers.forEach(clearInterval);
  }, [statsVisible, counters]);

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.aboutGrid}>
          <div
            ref={textRef}
            className={`${styles.aboutText} ${textVisible ? styles.animate : ''}`}
          >
            <span className={styles.subTitle}>{subtitle}</span>
            <h2>{title}</h2>

            {potentialBox?.heading && (
              <div className={styles.potentialBox}>
                <h3>{potentialBox.heading}</h3>
                <p className={styles.potentialText}
                  dangerouslySetInnerHTML={{ __html: potentialBox.text || '' }}
                />
              </div>
            )}

            <h3 className={styles.intentTitle}>{missionTitle}</h3>
            <div className={styles.aboutFeatures}>
              {missionItems.map((item, i) => (
                <div key={i} className={styles.featItem}>
                  {item.icon && <i className={item.icon}></i>} {item.label}
                </div>
              ))}
            </div>
          </div>

          <div
            ref={statsRef}
            className={`${styles.aboutStats} ${statsVisible ? styles.animateStats : ''}`}
          >
            {counters.map((counter, i) => (
              <div key={i} className={styles.statCard}>
                <h3>{counts[i] !== undefined ? counts[i] : 0}{counter.suffix ?? ''}</h3>
                <p>{counter.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
