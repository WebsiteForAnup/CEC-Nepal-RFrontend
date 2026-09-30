import React from 'react';
import styles from './Hero.module.css';

interface Cta {
  label: string;
  scrollTo: string;
}

interface HeroData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
}

interface HeroProps {
  hero?: HeroData;
}

const Hero: React.FC<HeroProps> = ({ hero = {} }) => {
  const {
    badge = 'Engineering Excellence Since 2006',
    title = 'Powering a',
    titleHighlight = 'Sustainable',
    titleSuffix = 'Future',
    subtitle = 'Leading national consultancy for Hydropower, Solar, and Infrastructure development in Nepal.',
    primaryCta = { label: 'Explore Services', scrollTo: 'services' },
    secondaryCta = { label: 'Consult with Experts', scrollTo: 'contact' },
  } = hero;

  const scrollToSection = (id: string) => {
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