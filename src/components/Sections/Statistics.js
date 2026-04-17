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
          {(stats.cards || []).map((stat, index) => (
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

        {stats.breakdown && stats.breakdown.length > 0 && (
          <div className={styles.breakdown}>
            <h3>Project Status Distribution</h3>
            <div className={styles.statusBars}>
              {stats.breakdown.map((item, index) => (
                <div key={index} className={styles.statusItem}>
                  <div className={styles.barLabel}>
                    <span>{item.label}</span>
                    <span>{item.count} Projects</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progress} 
                      style={{ 
                        width: `${item.percentage}%`, 
                        backgroundColor: item.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Statistics;
