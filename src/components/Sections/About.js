import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutText}>
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
          <div className={styles.aboutStats}>
            <div className={styles.statCard}><h3>150+</h3><p>MW Optimized</p></div>
            <div className={styles.statCard}><h3>2006</h3><p>Established</p></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
