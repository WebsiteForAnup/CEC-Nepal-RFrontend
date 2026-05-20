import React from 'react';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import styles from './PrivacyPolicy.module.css';

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
          <div className={styles.articleCard}>
            <p className={styles.introText}>
              At Clean Energy Consultants Pvt. Ltd. (CEC Nepal), we are committed to protecting the privacy and security of our clients, visitors, and website users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or submit forms to us.
            </p>

            <section className={styles.section}>
              <h2>1. Information We Collect</h2>
              <p>
                We collect personal information that you voluntarily provide to us when expressing interest in obtaining information about our services or contacting us. The information we collect may include:
              </p>
              <ul>
                <li><strong>Contact Information:</strong> Full Name, Email Address, Phone Number, and Company/Organization Name.</li>
                <li><strong>Project Details:</strong> Information regarding your prospective projects, timeline, budget, and services of interest, which you share in our inquiry or booking forms.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, including:
              </p>
              <ul>
                <li>To schedule and conduct free consultation calls or counseling sessions.</li>
                <li>To respond to your inquiries, questions, and requests for service support.</li>
                <li>To send you project proposals, estimates, and administrative communications.</li>
                <li>To evaluate the performance of our website and optimize visitor experience.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>3. Data Protection and Security</h2>
              <p>
                We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please remember that no transmission over the internet is completely secure, and we cannot guarantee absolute security of your electronic submissions.
              </p>
            </section>

            <section className={styles.section}>
              <h2>4. Sharing of Information</h2>
              <p>
                CEC Nepal does not sell, rent, trade, or share your personal information with third parties for marketing purposes. We may share information with trusted third-party service providers who assist us in operating our website, conducting our business, or serving our clients, so long as those parties agree to keep this information confidential and comply with data security standards.
              </p>
            </section>

            <section className={styles.section}>
              <h2>5. Your Privacy Rights</h2>
              <p>
                Depending on your location, you may have the right to request access to the personal information we hold about you, request corrections to any inaccuracies, or request the deletion of your data. To exercise these rights, please contact us using the details provided below.
              </p>
            </section>

            <section className={styles.section}>
              <h2>6. Cookies and Tracking</h2>
              <p>
                Our website may use cookies and similar tracking technologies to enhance navigation, analyze site traffic, and support form submission. You can set your browser to refuse all or some browser cookies, but note that some parts of the site may then become inaccessible or not function properly.
              </p>
            </section>

            <section className={styles.contactSection}>
              <h2>Contact Us</h2>
              <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
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

export default PrivacyPolicy;
