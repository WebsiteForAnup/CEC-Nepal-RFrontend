import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>Engineering Excellence Since 2006</div>
        <h1>Powering a <span>Sustainable</span> Future</h1>
        <p>Leading national consultancy for Hydropower, Solar, and Infrastructure development in Nepal.</p>
        <div className={styles.heroButtons}>
          <button className={styles.btnPrimary} onClick={() => scrollToSection('services')}>Explore Services</button>
          <button className={styles.btnSecondary} onClick={() => scrollToSection('contact')}>Consult with Experts</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;