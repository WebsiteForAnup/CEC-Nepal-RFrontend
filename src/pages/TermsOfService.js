import React from 'react';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import styles from './TermsOfService.module.css';

const TermsOfService = () => {
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
          <div className={styles.articleCard}>
            <p className={styles.introText}>
              Welcome to the website of Clean Energy Consultants Pvt. Ltd. (CEC Nepal). Please read these Terms of Service ("Terms") carefully before using our website or services. By accessing or using our website, you agree to be bound by these Terms and our Privacy Policy.
            </p>

            <section className={styles.section}>
              <h2>1. Services Offered</h2>
              <p>
                Clean Energy Consultants Pvt. Ltd. provides specialized engineering, consultancy, and advisory services for hydropower, solar, wind, infrastructure, and environmental sectors. The information, resources, and templates available on this website are provided for informational and consultation inquiry purposes only.
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. Use of Site Content & Downloads</h2>
              <p>
                All documents, guidelines, templates, reports, and other resources provided in our Downloads Center are the intellectual property of CEC Nepal. You are granted a limited, non-exclusive, non-transferable license to view and download these materials for personal, non-commercial, or educational use. Any commercial redistribution, publication, or modification of our copyrighted content without prior written permission is strictly prohibited.
              </p>
            </section>

            <section className={styles.section}>
              <h2>3. Booking and Inquiry Forms</h2>
              <p>
                When you submit details through our "Book a Free Call" or contact forms, you agree to provide accurate, complete, and current information. Submitting an inquiry does not establish a formal engineering contract or client-consultant relationship. A formal relationship and scope of work are only established upon signing a bilateral agreement or service contract.
              </p>
            </section>

            <section className={styles.section}>
              <h2>4. Intellectual Property Rights</h2>
              <p>
                The CEC Nepal name, logo, slogans, branding elements, and all original content displayed on this website are owned by Clean Energy Consultants Pvt. Ltd. and are protected by Nepalese and international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className={styles.section}>
              <h2>5. Limitation of Liability</h2>
              <p>
                While we strive to keep the information on this website accurate and up-to-date, CEC Nepal makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability of the website or the information, services, or related graphics contained on the website. Any reliance you place on such information is strictly at your own risk.
              </p>
            </section>

            <section className={styles.section}>
              <h2>6. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Nepal. Any dispute arising under or in connection with these Terms or the use of our website shall be subject to the exclusive jurisdiction of the courts of Nepal.
              </p>
            </section>

            <section className={styles.section}>
              <h2>7. Changes to These Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We encourage users to check this page periodically for any changes. Continued use of our site following the posting of changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className={styles.contactSection}>
              <h2>Contact Us</h2>
              <p>If you have any questions or concerns regarding these Terms of Service, please reach out to us:</p>
              <div className={styles.contactDetails}>
                <p><strong><i className="fas fa-building"></i> Company:</strong> Clean Energy Consultants Pvt. Ltd. (CEC Nepal)</p>
                <p><strong><i className="fas fa-map-marker-alt"></i> Address:</strong> Lalitpur, Nepal</p>
                <p><strong><i className="fas fa-envelope"></i> Email:</strong> info@cecnepal.com.np</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfService;
