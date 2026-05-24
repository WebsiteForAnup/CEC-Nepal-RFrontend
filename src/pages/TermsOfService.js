import React, { useState, useEffect } from 'react';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import styles from './TermsOfService.module.css';

const TermsOfService = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/terms.html')
      .then(res => res.text())
      .then(text => setContent(text))
      .catch(err => console.error('Failed to load terms of service content:', err));
  }, []);

  return (
    <>
      <NavbarRedesigned />
      <main className={styles.mainContent}>
        <div className={styles.heroSection}>
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <h1>Terms of Service</h1>
              <p>Last updated: May 20, 2026</p>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.articleCard} dangerouslySetInnerHTML={{ __html: content }}>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfService;
