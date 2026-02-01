import React, { useState, useEffect } from 'react';
import styles from './About.module.css';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const About = () => {
  const [textRef, textVisible] = useScrollAnimation({ threshold: 0.2 });
  const [statsRef, statsVisible] = useScrollAnimation({ threshold: 0.2 });
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  useEffect(() => {
    if (statsVisible) {
      // Animate counter for 150+
      let start1 = 0;
      const end1 = 150;
      const duration1 = 2000;
      const increment1 = end1 / (duration1 / 16);
      
      const timer1 = setInterval(() => {
        start1 += increment1;
        if (start1 >= end1) {
          setCount1(end1);
          clearInterval(timer1);
        } else {
          setCount1(Math.floor(start1));
        }
      }, 16);

      // Animate counter for 2006
      let start2 = 1990;
      const end2 = 2006;
      const duration2 = 2000;
      const increment2 = (end2 - start2) / (duration2 / 16);
      
      const timer2 = setInterval(() => {
        start2 += increment2;
        if (start2 >= end2) {
          setCount2(end2);
          clearInterval(timer2);
        } else {
          setCount2(Math.floor(start2));
        }
      }, 16);

      return () => {
        clearInterval(timer1);
        clearInterval(timer2);
      };
    }
  }, [statsVisible]);

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.aboutGrid}>
          <div 
            ref={textRef}
            className={`${styles.aboutText} ${textVisible ? styles.animate : ''}`}
          >
            <span className={styles.subTitle}>Welcome to CEC Nepal</span>
            <h2>Pioneering Green Energy Solutions</h2>
            
            <div className={styles.potentialBox}>
              <h3>Nepal's Hydropower Potential</h3>
              <p className={styles.potentialText}>Theoretically, Nepal has a hydropower potential of over <strong>83,000 MW</strong>, of which only about <strong>42,000 MW</strong> could be considered technically and economically feasible.</p>
            </div>

            <h3 className={styles.intentTitle}>Our Mission</h3>
            <div className={styles.aboutFeatures}>
              <div className={styles.featItem}><i className="fas fa-water"></i> Help Utilize Feasible Hydro Energy</div>
              <div className={styles.featItem}><i className="fas fa-arrow-down"></i> Reduce Energy Import Dependency</div>
              <div className={styles.featItem}><i className="fas fa-arrow-up"></i> Increase Export Of Hydropower</div>
              <div className={styles.featItem}><i className="fas fa-leaf"></i> Promote Clean Energy Generation</div>
            </div>
          </div>
          <div 
            ref={statsRef}
            className={`${styles.aboutStats} ${statsVisible ? styles.animateStats : ''}`}
          >
            <div className={styles.statCard}>
              <h3>{count1}+</h3>
              <p>MW Optimized</p>
            </div>
            <div className={styles.statCard}>
              <h3>{count2}</h3>
              <p>Established</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
