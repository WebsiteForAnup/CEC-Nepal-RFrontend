import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const Services = ({ services = [] }) => {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });

  const handleGetInTouch = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className={styles.services}>
      <div className={styles.container}>
        <div
          ref={headerRef}
          className={`${styles.sectionHeader} ${headerVisible ? styles.animate : ''}`}
        >
          <h2>Our Core Services</h2>
          <div className={styles.line}></div>
        </div>
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <Link
              to={`/service/${service.id}`}
              key={service.id}
              style={{ textDecoration: 'none' }}
            >
              <div
                className={styles.serviceCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.imgContainer}>
                  <img src={service.image} alt={service.title} />
                </div>
                <div className={styles.serviceContent}>
                  <i className={`${service.icon} ${styles.icon}`}></i>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.ctaContainer}>
          <button className={styles.getInTouchBtn} onClick={handleGetInTouch}>
            Get in Touch
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;