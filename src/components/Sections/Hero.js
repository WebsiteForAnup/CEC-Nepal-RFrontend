import React from 'react';
import styles from './Hero.module.css';

const Hero = ({ hero = {} }) => {
  const {
    badge = 'Engineering Excellence Since 2006',
    title = 'Powering a',
    titleHighlight = 'Sustainable',
    titleSuffix = 'Future',
    subtitle = 'Leading national consultancy for Hydropower, Solar, and Infrastructure development in Nepal.',
    primaryCta = { label: 'Explore Services', scrollTo: 'services' },
    secondaryCta = { label: 'Consult with Experts', scrollTo: 'contact' },
  } = hero;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 70, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>{badge}</div>
        <h1>{title} <span>{titleHighlight}</span> {titleSuffix}</h1>
        <p>{subtitle}</p>
        <div className={styles.heroButtons}>
          <button className={styles.btnPrimary} onClick={() => scrollToSection(primaryCta.scrollTo)}>
            {primaryCta.label}
          </button>
          <button className={styles.btnSecondary} onClick={() => scrollToSection(secondaryCta.scrollTo)}>
            {secondaryCta.label}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;