import React, { useState } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add your form submission logic
    console.log('Form submitted:', formState);
    setFormState({ name: '', email: '', message: '' });
    alert(`Thank you ${formState.name}, we will contact you soon!`);
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
          </div>

          {/* Contact Form */}
          <div className={styles.contactForm}>
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              />
              <textarea
                name="message"
                placeholder="Tell us about your project..."
                rows="5"
                required
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              ></textarea>
              <button type="submit" className={styles.submitBtn}>Send Message</button>
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