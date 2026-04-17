import React from 'react';
import styles from './Statistics.module.css';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const Statistics = ({ stats = [] }) => {
  const [statsRef, statsVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <section id="statistics" className={styles.statistics}>
      <div className={styles.container}>
        <div
          className={`${styles.sectionHeader} ${statsVisible ? styles.animate : ''}`}
        >
          <h2>Our Impact</h2>
          <div className={styles.line}></div>
        </div>

        <div
          ref={statsRef}
          className={styles.statsGrid}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.id ?? index}
              className={`${styles.statCard} ${statsVisible ? styles.slideIn : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.icon} style={{ color: stat.color }}>
                <i className={stat.icon}></i>
              </div>
              <div className={styles.value}>{stat.value}</div>
              <div className={styles.label}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.breakdown}>
          <h3>Project Status Distribution</h3>
          <div className={styles.statusBars}>
            <div className={styles.statusItem}>
              <div className={styles.barLabel}>
                <span>Generation</span>
                <span>25 Projects</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: '38%', backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.barLabel}>
                <span>Under Construction</span>
                <span>28 Projects</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: '42%', backgroundColor: '#f59e0b' }}></div>
              </div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.barLabel}>
                <span>PPA Stage</span>
                <span>11 Projects</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: '17%', backgroundColor: '#3b82f6' }}></div>
              </div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.barLabel}>
                <span>Testing &amp; Commissioning</span>
                <span>2 Projects</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: '3%', backgroundColor: '#8b5cf6' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
