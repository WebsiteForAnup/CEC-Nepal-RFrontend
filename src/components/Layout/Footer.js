import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './Footer.module.css';
import contactConfig from '../../data/global/contact.json';
import { getCompany } from '../../services/homeService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths in Webpack environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const parsedCompany = getCompany();

const defaultCompanyData = {
  ...parsedCompany,
  logo: parsedCompany.logo || "/images/cec-logo.png",
  contact: {
    ...parsedCompany.contact
  },
  social: {
    ...parsedCompany.social
  }
};

const quickLinks = [
  { "label": "About Us", "targetId": "about" },
  { "label": "Our Services", "targetId": "services" },
  { "label": "Projects", "targetId": "projects" },
  { "label": "Our Team", "targetId": "team" },
  { "label": "News & Events", "targetId": "news-events" }
];

const footerServices = [
  { "label": "Hydropower Projects", "targetId": "services" },
  { "label": "Solar Energy Solutions", "targetId": "services" },
  { "label": "Environmental Assessment", "targetId": "services" },
  { "label": "Infrastructure Development", "targetId": "services" },
  { "label": "Wind Energy", "targetId": "services" }
];

const mapCoordinates = contactConfig.mapCoordinates || [];

const checkIsCompanyOpen = (officeHours) => {
  if (!officeHours || officeHours.length === 0) return null;
  const now = new Date();
  const day = now.getDay();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  for (const rule of officeHours) {
    const daysStr = rule.days.toLowerCase();
    let isDayMatching = false;

    if (daysStr.includes('sun - fri') || daysStr.includes('sun-fri')) {
      if (day >= 0 && day <= 5) isDayMatching = true;
    } else if (daysStr.includes('sat')) {
      if (day === 6) isDayMatching = true;
    } else if (daysStr.includes('mon - fri') || daysStr.includes('mon-fri')) {
      if (day >= 1 && day <= 5) isDayMatching = true;
    } else if (daysStr.includes('everyday') || daysStr.includes('daily') || daysStr.includes('sun - sat')) {
      isDayMatching = true;
    }

    if (isDayMatching) {
      if (rule.openTime === 'Closed' || rule.closeTime === 'Closed') {
        return false;
      }

      const parseTimeToMinutes = (timeStr) => {
        const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
        if (!match) return null;
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      const openMin = parseTimeToMinutes(rule.openTime);
      const closeMin = parseTimeToMinutes(rule.closeTime);

      if (openMin !== null && closeMin !== null) {
        return currentTimeInMinutes >= openMin && currentTimeInMinutes < closeMin;
      }
    }
  }
  return false;
};

const Footer = ({ company = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    name = defaultCompanyData.name,
    shortName = defaultCompanyData.shortName,
    description = defaultCompanyData.description,
    contact = {},
    social = {}
  } = company;

  const [activeMapIndex, setActiveMapIndex] = React.useState(0);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const [isOpen, setIsOpen] = React.useState(null);

  useEffect(() => {
    const checkOpen = () => {
      setIsOpen(checkIsCompanyOpen(contactConfig.officeHours));
    };
    checkOpen();
    const interval = setInterval(checkOpen, 30000);
    return () => clearInterval(interval);
  }, []);

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

          // Add clean zoom control at the bottom right
          L.control.zoom({
            position: 'bottomright'
          }).addTo(mapRef.current);

          // Clear old markers
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
                    <strong style="display: block; font-size: 12px; color: #10b981; margin-bottom: 2px;">${pName}</strong>
                    ${type ? `<span style="display: inline-block; font-size: 9px; background: #e2e8f0; color: #475569; padding: 1px 4px; border-radius: 3px; margin-bottom: 4px;">${type}</span>` : ''}
                    ${address ? `<div style="font-size: 10px; margin-bottom: 1px;"><i class="fas fa-map-marker-alt" style="color: #10b981; margin-right: 3px;"></i>${address}</div>` : ''}
                    ${phone ? `<div style="font-size: 10px; margin-bottom: 1px;"><i class="fas fa-phone" style="color: #10b981; margin-right: 3px;"></i>${phone}</div>` : ''}
                    ${email ? `<div style="font-size: 10px; margin-bottom: 4px;"><i class="fas fa-envelope" style="color: #10b981; margin-right: 3px;"></i>${email}</div>` : ''}
                    <a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${cLat},${cLng}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; font-size: 10px; background: #10b981; color: white; padding: 3px 8px; border-radius: 4px; text-decoration: none; font-weight: 600; margin-top: 4px;">
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
  }, []);

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
  }, [activeMapIndex]);

  const logo = company.logo || defaultCompanyData.logo;

  const mergedContact = { ...defaultCompanyData.contact, ...contact };
  const mergedSocial = { ...defaultCompanyData.social, ...social };

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
                {logo && <img src={logo} alt={name} />}
                {shortName && (
                  <h3>
                    {shortName.split(' ')[0]}
                    {shortName.split(' ').slice(1).join(' ') && (
                      <span>{shortName.split(' ').slice(1).join(' ')}</span>
                    )}
                  </h3>
                )}
              </div>
              {description && (
                <p className={styles.footerDesc}>
                  {description}
                </p>
              )}
              {Object.values(mergedSocial).some(val => val) && (
                <div className={styles.socials}>
                  {mergedSocial.facebook && (
                    <a href={mergedSocial.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                  {mergedSocial.linkedin && (
                    <a href={mergedSocial.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  {mergedSocial.twitter && (
                    <a href={mergedSocial.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  {mergedSocial.instagram && (
                    <a href={mergedSocial.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Quick Links */}
            {quickLinks && quickLinks.length > 0 && (
              <div className={styles.footerCol}>
                <h4>Quick Links</h4>
                <ul>
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={`#${link.targetId}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(link.targetId);
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Services */}
            {footerServices && footerServices.length > 0 && (
              <div className={styles.footerCol}>
                <h4>Our Services</h4>
                <ul>
                  {footerServices.map((service, index) => (
                    <li key={index}>
                      <a
                        href={`#${service.targetId}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(service.targetId);
                        }}
                      >
                        {service.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Info */}
            {Object.values(mergedContact).some(val => val) && (
              <div className={styles.footerCol}>
                <h4>Contact Us</h4>
                <ul className={styles.contactInfo}>
                  {mergedContact.address && (
                    <li>
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{mergedContact.address}</span>
                    </li>
                  )}
                  {mergedContact.phone && (
                    <li>
                      <i className="fas fa-phone"></i>
                      <span>{mergedContact.phone}</span>
                    </li>
                  )}
                  {mergedContact.email && (
                    <li>
                      <i className="fas fa-envelope"></i>
                      <span>{mergedContact.email}</span>
                    </li>
                  )}
                  {mergedContact.openingHours && (
                    <li>
                      <i className="fas fa-clock"></i>
                      <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        {mergedContact.openingHours}
                        {isOpen !== null && (
                          <span className={isOpen ? styles.statusOpen : styles.statusClosed}>
                            <span className={styles.statusDot}></span>
                            {isOpen ? 'Open Now' : 'Closed'}
                          </span>
                        )}
                      </span>
                    </li>
                  )}
                </ul>
                {mapCoordinates && mapCoordinates.length > 0 && (
                  <div className={styles.mapWrapper}>
                    <div className={styles.mapTabs}>
                      {mapCoordinates.map((coord, index) => (
                        <button
                          key={index}
                          className={`${styles.mapTabBtn} ${activeMapIndex === index ? styles.activeMapTab : ''}`}
                          onClick={() => setActiveMapIndex(index)}
                        >
                          {coord.popUpDetails?.type || `Location ${index + 1}`}
                        </button>
                      ))}
                    </div>
                    <div ref={mapContainerRef} className={styles.mapContainer}></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <div className={styles.footerBottomContent}>
            <p>&copy; {new Date().getFullYear()} {shortName.split(' ').join('') || name || 'Company'}. All Rights Reserved.</p>
            <div className={styles.footerLinks}>
              <Link to="/privacy">Privacy Policy</Link>
              <span className={styles.separator}>|</span>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
