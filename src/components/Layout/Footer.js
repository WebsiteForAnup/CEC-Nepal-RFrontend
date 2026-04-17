import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = ({ company = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    name = 'Clean Energy Consultants Pvt. Ltd.',
    shortName = 'CEC Nepal',
    description = "Leading national consultancy for Hydropower, Solar, and Infrastructure development in Nepal since 2006.",
    contact = {
      address: 'Pokhara, Nepal',
      phone: '+977 9813774974',
      email: 'contactatjerusha@gmail.com'
    },
    social = {
      facebook: 'https://facebook.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com'
    }
  } = company;

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      // We're on a detail page, navigate back to home with hash
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 150,
            behavior: 'smooth'
          });
        }
      }, 300);
    } else {
      // We're already on home, scroll directly
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 150,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            {/* Company Info */}
            <div className={styles.footerCol}>
              <div className={styles.footerLogo}>
                <img src="/images/cec-logo.png" alt={name} />
                <h3>CEC<span>Nepal</span></h3>
              </div>
              <p className={styles.footerDesc}>
                {description}
              </p>
              <div className={styles.socials}>
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                )}
                {social.linkedin && (
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                )}
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.footerCol}>
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About Us</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Our Services</a></li>
                <li><a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>Projects</a></li>
                <li><a href="#team" onClick={(e) => { e.preventDefault(); scrollToSection('team'); }}>Our Team</a></li>
                <li><a href="#news-events" onClick={(e) => { e.preventDefault(); scrollToSection('news-events'); }}>News & Events</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className={styles.footerCol}>
              <h4>Our Services</h4>
              <ul>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Hydropower Projects</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Solar Energy Solutions</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Environmental Assessment</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Infrastructure Development</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Wind Energy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className={styles.footerCol}>
              <h4>Contact Us</h4>
              <ul className={styles.contactInfo}>
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{contact.address}</span>
                </li>
                <li>
                  <i className="fas fa-phone"></i>
                  <span>{contact.phone}</span>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>{contact.email}</span>
                </li>
                <li>
                  <i className="fas fa-clock"></i>
                  <span>Sun - Thur: 10:00 AM - 5:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <div className={styles.footerBottomContent}>
            <p>&copy; {new Date().getFullYear()} {shortName}. All Rights Reserved.</p>
            <div className={styles.footerLinks}>
              <a href="#privacy">Privacy Policy</a>
              <span className={styles.separator}>|</span>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
