import React, { useState, useEffect } from 'react';
import styles from './Statistics.module.css';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalMW: 0,
    totalProjects: 0,
    generationProjects: 0,
    underConstructionProjects: 0,
  });
  
  const [statsRef, statsVisible] = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    if (statsVisible) {
      // Calculate totals from project data
      const projects = [
        // Generation (25 projects)
        { capacity: 25 }, { capacity: 7.6 }, { capacity: 3 }, { capacity: 3 }, { capacity: 0.99 },
        { capacity: 4.5 }, { capacity: 8 }, { capacity: 7.5 }, { capacity: 2.4 }, { capacity: 25 },
        { capacity: 2 }, { capacity: 22 }, { capacity: 20 }, { capacity: 4.3 }, { capacity: 2 },
        { capacity: 0.99 }, { capacity: 4.5 }, { capacity: 8.8 }, { capacity: 4.5 }, { capacity: 6.6 },
        { capacity: 54 }, { capacity: 2.4 }, { capacity: 8.5 }, { capacity: 8 }, { capacity: 5 },
        // Under Construction (28 projects)
        { capacity: 5.8 }, { capacity: 50 }, { capacity: 9.94 }, { capacity: 5 }, { capacity: 5.2 },
        { capacity: 4.99 }, { capacity: 14.9 }, { capacity: 8.5 }, { capacity: 5 }, { capacity: 9.5 },
        { capacity: 6 }, { capacity: 97.2 }, { capacity: 4.95 }, { capacity: 21.5 }, { capacity: 6.3 },
        { capacity: 11 }, { capacity: 20 }, { capacity: 16.26 }, { capacity: 6 }, { capacity: 22 },
        { capacity: 44 }, { capacity: 0 }, { capacity: 40.27 }, { capacity: 7.5 }, { capacity: 8.8 },
        { capacity: 6 }, { capacity: 22.5 }, { capacity: 40 },
      ];

      const totalMW = projects.reduce((sum, p) => sum + p.capacity, 0);
      
      const interval = setInterval(() => {
        setStats(prev => ({
          totalMW: Math.min(prev.totalMW + Math.ceil(totalMW / 50), totalMW),
          totalProjects: Math.min(prev.totalProjects + 1, 66),
          generationProjects: Math.min(prev.generationProjects + Math.ceil(25 / 50), 25),
          underConstructionProjects: Math.min(prev.underConstructionProjects + Math.ceil(28 / 50), 28),
        }));
      }, 30);

      return () => clearInterval(interval);
    }
  }, [statsVisible]);

  const statCards = [
    { label: 'Total Capacity', value: stats.totalMW.toFixed(0), suffix: ' MW', icon: '⚡' },
    { label: 'Projects Studied', value: stats.totalProjects, suffix: '+', icon: '📊' },
    { label: 'In Generation', value: stats.generationProjects, suffix: '+', icon: '✅' },
    { label: 'Under Construction', value: stats.underConstructionProjects, suffix: '+', icon: '🏗️' },
  ];

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
          {statCards.map((stat, index) => (
            <div 
              key={index} 
              className={`${styles.statCard} ${statsVisible ? styles.slideIn : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.icon}>{stat.icon}</div>
              <div className={styles.value}>
                {stat.value}
                <span className={styles.suffix}>{stat.suffix}</span>
              </div>
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
                <div className={styles.progress} style={{ width: '38%', backgroundColor: '#10b981' }}></div>
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
                <span>Testing & Commissioning</span>
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
