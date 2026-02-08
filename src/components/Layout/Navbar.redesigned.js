import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './NavbarRedesigned.module.css';

const NavbarRedesigned = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showUpdatesDropdown, setShowUpdatesDropdown] = useState(false);
  const [pendingSection, setPendingSection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDetails: '',
    budget: '',
    timeline: '',
    services: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === '/' && pendingSection) {
      setTimeout(() => {
        const element = document.getElementById(pendingSection);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 200,
            behavior: 'smooth'
          });
        }
        setPendingSection(null);
      }, 300);
    }
  }, [location.pathname, pendingSection]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setShowUpdatesDropdown(false);
    if (location.pathname !== '/') {
      setPendingSection(id);
      navigate('/');
    } else {
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 200,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      projectDetails: '',
      budget: '',
      timeline: '',
      services: ''
    });
    setShowBookingForm(false);
    alert('Thank you! We will contact you soon.');
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div className={styles.topBar}>
        <div className={styles.topContainer}>
          <div className={styles.taglineSection}>
            <i className="fas fa-leaf"></i>
            <p className={styles.tagline}>From Nature to Nation: Clean Energy for All</p>
          </div>
          <button 
            className={styles.callButton}
            onClick={() => setShowBookingForm(true)}
            aria-label="Book a call"
          >
            <i className="fas fa-phone-alt"></i>
            <span>Book a Free Call</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.logoSection}>
            <button
              className={styles.logo}
              onClick={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="CEC Nepal Home"
            >
              <img src="/images/cec-logo.png" alt="CEC Nepal" className={styles.logoImage} />
              <span className={styles.logoText}>
                CEC<span className={styles.logoHighlight}>Nepal</span>
              </span>
            </button>
          </div>

          {/* Center Navigation Links */}
          <div className={`${styles.navCenter} ${mobileMenuOpen ? styles.active : ''}`}>
            <button 
              className={styles.navLink}
              onClick={() => scrollToSection('about')}
            >
              About
            </button>
            <button 
              className={styles.navLink}
              onClick={() => scrollToSection('services')}
            >
              Services
            </button>
            <button 
              className={styles.navLink}
              onClick={() => scrollToSection('projects')}
            >
              Projects
            </button>
            <button 
              className={styles.navLink}
              onClick={() => scrollToSection('team')}
            >
              Team
            </button>
            <button 
              className={styles.navLink}
              onClick={() => scrollToSection('news-events')}
            >
              News
            </button>

            {/* Updates Dropdown */}
            <div 
              className={styles.dropdownContainer}
              onMouseEnter={() => setShowUpdatesDropdown(true)}
              onMouseLeave={() => setShowUpdatesDropdown(false)}
            >
              <button className={styles.navLink}>
                Updates
                <i className="fas fa-chevron-down"></i>
              </button>
              <div className={`${styles.dropdownMenu} ${showUpdatesDropdown ? styles.visible : ''}`}>
                <Link to="/gallery" className={styles.dropdownItem}>
                  <i className="fas fa-image"></i>
                  <span>Gallery</span>
                </Link>
                <Link to="/downloads" className={styles.dropdownItem}>
                  <i className="fas fa-download"></i>
                  <span>Downloads</span>
                </Link>
              </div>
            </div>

            <button 
              className={styles.navLink}
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>
          </div>

          {/* Right CTA */}
          <button 
            className={styles.registerBtn}
            onClick={() => scrollToSection('contact')}
          >
            Register Now
            <i className="fas fa-arrow-right"></i>
          </button>

          {/* Mobile Hamburger Menu */}
          <button
            className={`${styles.hamburger} ${mobileMenuOpen ? styles.active : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>
      </nav>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div 
          className={styles.modalOverlay} 
          onClick={() => setShowBookingForm(false)}
        >
          <div 
            className={styles.modalContent} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className={styles.closeBtn} 
              onClick={() => setShowBookingForm(false)}
              aria-label="Close form"
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className={styles.modalHeader}>
              <h2>Book Your Free Consultation</h2>
              <p>Tell us about your project and we'll get back to you within 24 hours</p>
            </div>

            <form onSubmit={handleFormSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={handleFormChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>

              <div className={styles.formRow}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={handleFormChange}
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company/Organization"
                  value={formData.company}
                  onChange={handleFormChange}
                />
              </div>

              <textarea
                name="projectDetails"
                placeholder="Tell us about your project..."
                rows="4"
                required
                value={formData.projectDetails}
                onChange={handleFormChange}
              ></textarea>

              <div className={styles.formRow}>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleFormChange}
                >
                  <option value="">Select Budget Range</option>
                  <option value="under-10k">Under $10K</option>
                  <option value="10k-50k">$10K - $50K</option>
                  <option value="50k-100k">$50K - $100K</option>
                  <option value="above-100k">Above $100K</option>
                </select>

                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleFormChange}
                >
                  <option value="">Project Timeline</option>
                  <option value="urgent">Urgent (1-3 months)</option>
                  <option value="3-6months">3-6 months</option>
                  <option value="6-12months">6-12 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div className={styles.formRow}>
                <select
                  name="services"
                  value={formData.services}
                  onChange={handleFormChange}
                >
                  <option value="">Services Interested In</option>
                  <option value="hydropower">Hydropower</option>
                  <option value="solar">Solar Energy</option>
                  <option value="wind">Wind Energy</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="environment">Environment</option>
                  <option value="consulting">Consulting</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Schedule Free Consultation
                <i className="fas fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarRedesigned;
