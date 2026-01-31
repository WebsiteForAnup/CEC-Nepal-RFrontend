import React from 'react';
import styles from './Services.module.css';

const Services = () => {
  const services = [
    {
      id: 1,
      icon: 'fas fa-water',
      title: 'Hydropower',
      description: 'Feasibility and EPCM for hydroelectric projects.',
      image: '/images/services/hydropower.jpg'
    },
    {
      id: 2,
      icon: 'fas fa-solar-panel',
      title: 'Solar Energy',
      description: 'Utility-scale solar farms and grid integration.',
      image: '/images/services/solar-1.jpg'
    },
    {
      id: 3,
      icon: 'fas fa-leaf',
      title: 'Environment',
      description: 'Detailed EIA/IEE assessments and green compliance.',
      image: '/images/services/environment.jpg'
    },
    {
      id: 4,
      icon: 'fas fa-bridge',
      title: 'Infrastructure',
      description: 'Bridges, tunnels, and highways in Himalayan geology.',
      image: '/images/services/infrastructure.jpg'
    },
    {
      id: 5,
      icon: 'fas fa-wind',
      title: 'Wind Energy',
      description: 'Resource mapping and turbine layout optimization.',
      image: '/images/services/wind-1.jpg'
    },
    {
      id: 6,
      icon: 'fas fa-handshake',
      title: 'Project Consulting',
      description: 'Lender\'s engineering and technical audits.',
      image: '/images/services/consulting.jpg'
    }
  ];

  return (
    <section id="services" className={styles.services}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Our Core Services</h2>
          <div className={styles.line}></div>
        </div>
        <div className={styles.servicesGrid}>
          {services.map(service => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.imgContainer}>
                <img src={service.image} alt={service.title} />
              </div>
              <div className={styles.serviceContent}>
                <i className={`${service.icon} ${styles.icon}`}></i>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;