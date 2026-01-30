import React, { useState } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '', phone: '', subject: '' });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formState.name || !formState.email || !formState.message) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    // Send to Formspree
    fetch('https://formspree.io/f/xyzqwbdb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formState.name,
        email: formState.email,
        phone: formState.phone || 'Not provided',
        subject: formState.subject || 'General Inquiry',
        message: formState.message,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Email sent successfully');
          setStatusMessage({ 
            type: 'success', 
            text: `Thank you ${formState.name}! We've received your message and will contact you soon.` 
          });
          setFormState({ name: '', email: '', message: '', phone: '', subject: '' });
          setTimeout(() => setStatusMessage({ type: '', text: '' }), 5000);
        } else {
          throw new Error('Failed to send');
        }
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        setStatusMessage({ 
          type: 'error', 
          text: 'Failed to send your message. Please try again or contact us directly.' 
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <h1 className={styles.sectionTitle}>Get in Touch</h1>
        <p className={styles.sectionSubtitle}>
          Let's discuss your project and build something impactful together.
        </p>

        <div className={styles.contactWrapper}>
          {/* Contact Info */}
          <div className={styles.contactInfo}>
            <h2>Contact Information</h2>

            <div className={styles.infoItem}>
              <i className="fas fa-map-marker-alt"></i>
              <p>Nayabajar, Pokhara, Nepal</p>
            </div>

            <div className={styles.infoItem}>
              <i className="fas fa-phone-alt"></i>
              <p>+977 9813774974</p>
            </div>

            <div className={styles.infoItem}>
              <i className="fas fa-envelope"></i>
              <p>contactatjerusha@gmail.com</p>
            </div>

            <div className={styles.infoItem}>
              <i className="fas fa-clock"></i>
              <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.contactForm}>
            <h2>Send a Message</h2>
            
            {statusMessage.text && (
              <div className={`${styles.message} ${styles[statusMessage.type]}`}>
                {statusMessage.type === 'success' && <i className="fas fa-check-circle"></i>}
                {statusMessage.type === 'error' && <i className="fas fa-exclamation-circle"></i>}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  required
                  value={formState.name}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  required
                  value={formState.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className={styles.formRow}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formState.phone}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formState.subject}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <textarea
                name="message"
                placeholder="Tell us about your project... *"
                rows="5"
                required
                value={formState.message}
                onChange={handleInputChange}
                disabled={loading}
              ></textarea>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className={styles.mapContainer}>
          <iframe
            title="CEC Nepal Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3515.7!2d83.9!3d28.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995937bbf0376ff%3A0xf6cf823b25351992!2sPokhara!5e0!3m2!1sen!2snp!4v1700000000"
            loading="lazy"
            allowFullScreen=""
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;