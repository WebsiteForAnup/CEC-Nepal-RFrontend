import React, { useEffect } from 'react';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import styles from './Careers.module.css';
import careersData from '../data/pages/careers.json';

const Careers = () => {
  useEffect(() => {
    document.title = `Careers | CEC Nepal`;
  }, []);

  const { page, benefits, openings } = careersData;

  return (
    <>
      <NavbarRedesigned />
      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection} style={{ '--hero-bg': `url(${page.heroImage})` }}>
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <h1>{page.title}</h1>
              <p>{page.subtitle}</p>
            </div>
          </div>
        </section>

        <div className={styles.container}>
          {/* Benefits Section */}
          <section className={styles.benefitsSection}>
            <h2 className={styles.sectionTitle}>Why Join Us</h2>
            <div className={styles.benefitsGrid}>
              {benefits && benefits.map((benefit, index) => (
                <div key={index} className={styles.benefitCard}>
                  <i className={`${benefit.icon} ${styles.benefitIcon}`}></i>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Openings Section */}
          <section className={styles.openingsSection}>
            <h2 className={styles.sectionTitle}>Current Openings</h2>
            
            {openings && openings.length > 0 ? (
              <div className={styles.jobGrid}>
                {openings.map(job => (
                  <div key={job.id} className={styles.jobCard}>
                    <div className={styles.jobHeader}>
                      <div>
                        <h3 className={styles.jobTitle}>{job.title}</h3>
                        <div className={styles.jobMeta}>
                          <span className={styles.metaItem}>
                            <i className="fas fa-building"></i> {job.department}
                          </span>
                          <span className={styles.metaItem}>
                            <i className="fas fa-map-marker-alt"></i> {job.location}
                          </span>
                          <span className={styles.metaItem}>
                            <i className="fas fa-clock"></i> {job.type}
                          </span>
                          <span className={styles.metaItem}>
                            <i className="fas fa-briefcase"></i> {job.experience}
                          </span>
                        </div>
                      </div>
                      <span className={styles.jobStatus}>{job.status}</span>
                    </div>

                    <p className={styles.jobDescription}>{job.description}</p>

                    {job.requirements && job.requirements.length > 0 && (
                      <div className={styles.requirements}>
                        <h4>Requirements:</h4>
                        <ul>
                          {job.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <a href={`mailto:${job.applyEmail}?subject=Application for ${job.title}`} className={styles.applyBtn}>
                      Apply Now <i className="fas fa-paper-plane" style={{ marginLeft: '8px' }}></i>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <i className="fas fa-search"></i>
                <h3>No Open Positions</h3>
                <p>We currently don't have any open positions. Please check back later!</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Careers;
