import React from 'react';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import styles from './PrivacyPolicy.module.css';
import { privacyPolicyHtml } from './PrivacyPolicyContent';

const PrivacyPolicy = () => {
  return (
    <>
      <NavbarRedesigned />
      <main className={styles.mainContent}>
        <div className={styles.heroSection}>
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <h1>Privacy Policy</h1>
              <p>Last updated: May 20, 2026</p>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.articleCard} dangerouslySetInnerHTML={{ __html: privacyPolicyHtml }}>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
