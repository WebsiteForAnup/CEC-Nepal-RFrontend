import { Link } from 'react-router-dom';
import { publicContent } from '../../services/publicContent';
import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <footer className={'cec-footer ' + styles.root}>
      <div className="cec-container">
        <div className="cec-footer-top">
          <div>
            <Link className="cec-footer-brand" to="/">
              cEc<span>NEPAL</span>
              <span className="cec-brand-dot" />
            </Link>
            <p>
              From nature to nation.
              <br />
              Clean energy for generations.
            </p>
            <a className="cec-text-link" href={'mailto:' + publicContent.contact.email}>
              {publicContent.contact.email}
            </a>
          </div>
          <div>
            <h2>Explore CEC</h2>
            <Link to="/about">About us</Link>
            <Link to="/projects">Our projects</Link>
            <Link to="/team">Our team</Link>
            <Link to="/careers">Careers</Link>
          </div>
          <div>
            <h2>Our expertise</h2>
            <Link to="/services">All services</Link>
            <Link to="/service/feasibility-studies">Feasibility studies</Link>
            <Link to="/service/survey-investigations">Survey & investigation</Link>
            <Link to="/service/construction-supervision">Construction supervision</Link>
          </div>
          <div>
            <h2>Stay connected</h2>
            <Link to="/news">News & events</Link>
            <Link to="/downloads">Resources</Link>
            <Link to="/contact">Contact us</Link>
            <a href={publicContent.company.socialMedia.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="cec-footer-bottom">
          <span>© 2026 Clean Energy Consultants Pvt. Ltd.</span>
          <div>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/terms">Terms of service</Link>
            <Link to="/auth/sign-in">Admin sign in</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
