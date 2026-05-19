import React, { useState, useEffect, useRef } from 'react';
import styles from './Contact.module.css';
import contactConfig from '../../data/global/contact.json';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths in Webpack environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Contact = ({ company = {} }) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '', phone: '', subject: '' });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const [activeMapIndex, setActiveMapIndex] = useState(0);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const {
    contact = {}
  } = company;

  const mergedContact = {
    address: 'Pokhara, Nepal',
    phone: '+977 9813774974',
    email: 'contactatjerusha@gmail.com',
    openingHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
    formspreeId: 'xyzqwbdb',
    ...contact
  };

  const mapCoordinates = React.useMemo(() => {
    return company.location?.mapCoordinates || contactConfig.mapCoordinates || [];
  }, [company.location?.mapCoordinates]);

  useEffect(() => {
    if (mapContainerRef.current && mapCoordinates.length > 0) {
      if (!mapRef.current) {
        const primaryCoord = mapCoordinates.find(c => c.priority === 1) || mapCoordinates[0];
        const lat = parseFloat(primaryCoord.latitude);
        const lng = parseFloat(primaryCoord.longitude);
        const zoom = primaryCoord.zoom || 14;

        if (!isNaN(lat) && !isNaN(lng)) {
          mapRef.current = L.map(mapContainerRef.current, {
            center: [lat, lng],
            zoom: zoom,
            scrollWheelZoom: false,
            zoomControl: false
          });

          // Add OpenStreetMap tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(mapRef.current);

          L.control.zoom({
            position: 'bottomright'
          }).addTo(mapRef.current);

          // Clear old markers if any
          markersRef.current.forEach(m => m.remove());
          markersRef.current = [];

          mapCoordinates.forEach((coord, idx) => {
            const cLat = parseFloat(coord.latitude);
            const cLng = parseFloat(coord.longitude);
            if (!isNaN(cLat) && !isNaN(cLng)) {
              const marker = L.marker([cLat, cLng]).addTo(mapRef.current);
              
              if (coord.popUpDetails) {
                const { name: pName, address, phone, email, type } = coord.popUpDetails;
                const popupContent = `
                  <div style="font-family: inherit; color: #1e293b; padding: 4px; min-width: 150px;">
                    <strong style="display: block; font-size: 13px; color: #10b981; margin-bottom: 2px;">${pName}</strong>
                    ${type ? `<span style="display: inline-block; font-size: 10px; background: #e2e8f0; color: #475569; padding: 2px 6px; border-radius: 3px; margin-bottom: 4px;">${type}</span>` : ''}
                    ${address ? `<div style="font-size: 11px; margin-bottom: 2px;"><i class="fas fa-map-marker-alt" style="color: #10b981; margin-right: 4px;"></i>${address}</div>` : ''}
                    ${phone ? `<div style="font-size: 11px; margin-bottom: 2px;"><i class="fas fa-phone" style="color: #10b981; margin-right: 4px;"></i>${phone}</div>` : ''}
                    ${email ? `<div style="font-size: 11px; margin-bottom: 4px;"><i class="fas fa-envelope" style="color: #10b981; margin-right: 4px;"></i>${email}</div>` : ''}
                    <a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${cLat},${cLng}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; font-size: 10px; background: #10b981; color: white; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 6px;">
                      <i class="fas fa-street-view"></i> Street View
                    </a>
                  </div>
                `;
                marker.bindPopup(popupContent);
              }
              
              markersRef.current.push(marker);

              if (idx === 0) {
                setTimeout(() => {
                  marker.openPopup();
                }, 500);
              }
            }
          });
        }
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapCoordinates]);

  useEffect(() => {
    if (mapRef.current && mapCoordinates.length > 0) {
      const coord = mapCoordinates[activeMapIndex] || mapCoordinates[0];
      const lat = parseFloat(coord.latitude);
      const lng = parseFloat(coord.longitude);
      const zoom = coord.zoom || 14;
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.flyTo([lat, lng], zoom, {
          duration: 1.2
        });

        const activeMarker = markersRef.current[activeMapIndex];
        if (activeMarker) {
          setTimeout(() => {
            activeMarker.openPopup();
          }, 1200);
        }
      }
    }
  }, [activeMapIndex, mapCoordinates]);

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
    const formspreeUrl = `https://formspree.io/f/${mergedContact.formspreeId || 'xyzqwbdb'}`;
    fetch(formspreeUrl, {
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
          {(mergedContact.address || mergedContact.phone || mergedContact.email || mergedContact.openingHours) && (
            <div className={styles.contactInfo}>
              <h2>Contact Information</h2>

              {mergedContact.address && (
                <div className={styles.infoItem}>
                  <i className="fas fa-map-marker-alt"></i>
                  <p>{mergedContact.address}</p>
                </div>
              )}

              {mergedContact.phone && (
                <div className={styles.infoItem}>
                  <i className="fas fa-phone-alt"></i>
                  <p>{mergedContact.phone}</p>
                </div>
              )}

              {mergedContact.email && (
                <div className={styles.infoItem}>
                  <i className="fas fa-envelope"></i>
                  <p>{mergedContact.email}</p>
                </div>
              )}

              {mergedContact.openingHours && (
                <div className={styles.infoItem}>
                  <i className="fas fa-clock"></i>
                  <p>{mergedContact.openingHours}</p>
                </div>
              )}
            </div>
          )}

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
        {mapCoordinates.length > 0 && (
          <div className={styles.mapWrapper}>
            <div className={styles.mapTabs}>
              {mapCoordinates.map((coord, index) => (
                <button
                  key={index}
                  className={`${styles.mapTabBtn} ${activeMapIndex === index ? styles.activeMapTab : ''}`}
                  onClick={() => setActiveMapIndex(index)}
                >
                  <i className="fas fa-map-marked-alt" style={{ marginRight: '6px' }}></i>
                  {coord.popUpDetails?.type || `Location ${index + 1}`}
                </button>
              ))}
            </div>
            <div ref={mapContainerRef} className={styles.mapContainer}></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;