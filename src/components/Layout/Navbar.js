import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
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
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle pending scroll when navigating back to home
  useEffect(() => {
    if (location.pathname === '/' && pendingSection) {
      setTimeout(() => {
        const element = document.getElementById(pendingSection);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 150,
            behavior: 'smooth'
          });
        }
        setPendingSection(null);
      }, 300);
    }
  }, [location.pathname, pendingSection]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      // We're on a detail page, navigate back to home and mark the section
      setPendingSection(id);
      navigate('/');
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you can add your form submission logic (API call, email, etc.)
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
    alert('Thank you! We will contact you soon for a free counseling session.');
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className={styles.topBar}>
        <div className={styles.topContainer}>
          <p className={styles.announcement}>
            "From Nature to Nation: Clean Energy for All" 
          </p>
          <a href="#!" onClick={() => setShowBookingForm(true)} className={styles.callButton}>
            <i className="fas fa-phone"></i>
            Book a Free 15-min Call
          </a>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className={styles.modalOverlay} onClick={() => setShowBookingForm(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowBookingForm(false)}>
              <i className="fas fa-times"></i>
            </button>
            <h2>Book Your Free Counseling Session</h2>
            <p className={styles.modalSubtitle}>Tell us about your project and we'll get back to you within 24 hours</p>
            
            <form onSubmit={handleFormSubmit}>
              <div className={styles.formRow}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  required
                  value={formData.name}
                  onChange={handleFormChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  required
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>

              <div className={styles.formRow}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
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
                placeholder="Tell us about your project... *"
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
                  <option value="consulting">Consulting</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="deployment">Deployment</option>
                  <option value="all">All Services</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Schedule Free Session
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <div className={styles.navFlex}>
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                if (location.pathname !== '/') {
                  navigate('/');
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }} 
              className={styles.logo}
            >
              <img src="/images/cec-logo.png" alt="CEC Nepal Logo" className={styles.logoImage} />
              <span className={styles.logoText}>CEC<span className={styles.logoHighlight}>Nepal</span></span>
            </a>
            <ul className={styles.navLinks}>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a></li>
              <li><a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>Projects</a></li>
              <li><a href="#team" onClick={(e) => { e.preventDefault(); scrollToSection('team'); }}>Our Team</a></li>
              <li><a href="#news-events" onClick={(e) => { e.preventDefault(); scrollToSection('news-events'); }}>News & Events</a></li>
              <li 
                className={styles.dropdownContainer}
                onMouseEnter={() => setShowUpdatesDropdown(true)}
                onMouseLeave={() => setShowUpdatesDropdown(false)}
              >
                <a href="#updates">Updates</a>
                <div className={`${styles.dropdown} ${showUpdatesDropdown ? styles.show : ''}`}>
                  <Link to="/gallery" className={styles.dropdownItem}>
                    <span>Gallery</span>
                  </Link>
                  <Link to="/downloads" className={styles.dropdownItem}>
                    <span>Downloads</span>
                  </Link>
                </div>
              </li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
            </ul>
            <button className={styles.registerBtn} onClick={() => scrollToSection('contact')}>
              Register Now
            </button>
            <div className={`${styles.burger} ${mobileMenuOpen ? styles.toggle : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <div className={styles.line1}></div>
              <div className={styles.line2}></div>
              <div className={styles.line3}></div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;