import React from 'react';
import styles from './Services.module.css';

const Services = () => {
  const services = [
    {
      id: 1,
      icon: 'fas fa-water',
      title: 'Hydropower',
      description: 'Feasibility and EPCM for hydroelectric projects.',
      image: 'https://cecnepal.com.np/wp-content/uploads/2023/10/viber_image_2023-10-11_11-57-27-112-1536x1024.jpg'
    },
    {
      id: 2,
      icon: 'fas fa-solar-panel',
      title: 'Solar Energy',
      description: 'Utility-scale solar farms and grid integration.',
      image: 'https://images.unsplash.com/photo-1574981520814-0bc725ba2c0e?w=800&h=200&fit=crop'
    },
    {
      id: 3,
      icon: 'fas fa-leaf',
      title: 'Environment',
      description: 'Detailed EIA/IEE assessments and green compliance.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=200&fit=crop'
    },
    {
      id: 4,
      icon: 'fas fa-bridge',
      title: 'Infrastructure',
      description: 'Bridges, tunnels, and highways in Himalayan geology.',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=200&fit=crop'
    },
    {
      id: 5,
      icon: 'fas fa-wind',
      title: 'Wind Energy',
      description: 'Resource mapping and turbine layout optimization.',
      image: 'https://images.unsplash.com/photo-1607837343456-3047591d86d0?w=800&h=200&fit=crop'
    },
    {
      id: 6,
      icon: 'fas fa-handshake',
      title: 'Project Consulting',
      description: 'Lender\'s engineering and technical audits.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=200&fit=crop'
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