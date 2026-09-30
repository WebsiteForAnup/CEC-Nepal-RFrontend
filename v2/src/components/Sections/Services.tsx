import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';
import useScrollAnimation from '../../hooks/useScrollAnimation';

interface ServiceItem {
  slug: string;
  title: string;
  description: string;
  category?: string;
  image?: string;
  icon?: string;
  has_page?: boolean;
}

interface ServicesProps {
  services?: ServiceItem[];
}

const Services: React.FC<ServicesProps> = ({ services = [] }) => {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});

  const toggleExpand = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents layout trigger issues
    setExpandedServices(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const handleGetInTouch = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper to clip long grid text gracefully
  const truncateText = (text: string, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
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
          {services.map((service, index) => {
            const isExpanded = !!expandedServices[service.slug];
            const displayDescription = isExpanded 
              ? service.description 
              : truncateText(service.description);
            const isLongText = service.description.length > 120;

            const cardContent = (
              <div
                className={`${styles.serviceCard} ${service.has_page ? styles.clickableCard : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.imgContainer}>
                  {service.image && <img src={service.image} alt={service.title} />}
                  {service.category && <span className={styles.categoryBadge}>{service.category}</span>}
                </div>
                <div className={styles.serviceContent}>
                  <div className={styles.iconWrapper}>
                    {service.icon && <i className={`${service.icon} ${styles.icon}`}></i>}
                  </div>
                  <h3>{service.title}</h3>
                  
                  <p className={`${styles.description} ${isExpanded ? styles.expanded : ''}`}>
                    {displayDescription}
                  </p>

                  {/* Contextual Action Footers based on layout state */}
                  {service.has_page ? (
                    <div className={styles.cardFooterLink}>
                      Learn More <i className="fas fa-chevron-right"></i>
                    </div>
                  ) : (
                    isLongText && (
                      <button 
                        onClick={(e) => toggleExpand(e, service.slug)} 
                        className={styles.readMoreBtn}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? 'Show Less' : 'Read Full Scope'}
                        <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                      </button>
                    )
                  )}
                </div>
              </div>
            );

            return service.has_page ? (
              <Link
                to={`/service/${service.slug}`}
                key={service.slug}
                style={{ textDecoration: 'none', display: 'flex' }}
              >
                {cardContent}
              </Link>
            ) : (
              <div key={service.slug} className={styles.wrapperDiv}>
                {cardContent}
              </div>
            );
          })}
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