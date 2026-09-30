import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { publicContent } from '../../services/publicContent';
import Arrow from './Arrow';
import NewsMarquee from './NewsMarquee';
import MegaMenuContent from './MegaMenuContent';
import usePageMotion from '../../hooks/usePageMotion';
import '../../styles/site.css';
const groups = ['Services', 'Projects', 'Insights', 'About CEC'] as const;
type Menu = (typeof groups)[number];

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<Menu | null>(null);
  const location = useLocation();
  const header = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  usePageMotion(location.pathname);
  useEffect(() => {
    setMenuOpen(false);
    setActiveMenu(null);
  }, [location.pathname, location.search]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
        setMenuOpen(false);
        trigger.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setActiveMenu(null);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', outside);
    };
  }, []);
  return (
    <div className="cec-site">
      <a className="cec-skip" href="#main-content">
        Skip to content
      </a>
      <div className="cec-topbar">
        <div className="cec-container">
          <span>
            <i />
            Clean energy. Lasting progress.
          </span>
          <a href={'mailto:' + publicContent.contact.email}>
            {publicContent.contact.email}
            <Arrow diagonal />
          </a>
        </div>
      </div>
      <header
        ref={header}
        className="cec-header cec-header--mega"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setActiveMenu(null);
        }}
      >
        <div className="cec-container cec-header-inner">
          <Link className="cec-brand cec-brand--trapezoid" to="/" aria-label="CEC Nepal home">
            <img src={publicContent.company.assets.logoUrl} alt="" width="48" height="48" />
            <span>
              <strong>
                cEc<span>NEPAL</span>
              </strong>
              <small>CLEAN ENERGY CONSULTANTS</small>
            </span>
          </Link>
          <button
            className="cec-menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="cec-navigation"
            onClick={(event) => {
              trigger.current = event.currentTarget;
              setMenuOpen(!menuOpen);
              setActiveMenu(null);
            }}
          >
            {menuOpen ? 'Close' : 'Menu'}
            <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
          </button>
          <nav
            id="cec-navigation"
            className={'cec-nav' + (menuOpen ? ' is-open' : '')}
            aria-label="Main navigation"
          >
            {groups.map((group) => (
              <button
                key={group}
                className="cec-nav-trigger"
                type="button"
                aria-expanded={activeMenu === group}
                aria-controls="cec-mega-panel"
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  setActiveMenu(activeMenu === group ? null : group);
                }}
              >
                {group}
                <span aria-hidden="true">⌄</span>
              </button>
            ))}
            <Link className="cec-button cec-button--lime" to="/contact">
              Let’s talk
              <Arrow diagonal />
            </Link>
          </nav>
        </div>
        {activeMenu && (
          <div
            id="cec-mega-panel"
            className="cec-mega-panel"
            aria-label={activeMenu + ' navigation'}
          >
            <div className="cec-container cec-mega-inner">
              <aside>
                <p className="cec-eyebrow">EXPLORE CEC / {activeMenu}</p>
                <h2>
                  {activeMenu === 'Services'
                    ? 'Expertise for every stage.'
                    : activeMenu === 'Projects'
                      ? 'Progress, in practice.'
                      : activeMenu === 'Insights'
                        ? 'Knowledge that moves us.'
                        : 'Your clean energy partner.'}
                </h2>
                <Link
                  className="cec-text-link"
                  to={
                    activeMenu === 'Services'
                      ? '/services'
                      : activeMenu === 'Projects'
                        ? '/projects'
                        : activeMenu === 'Insights'
                          ? '/news'
                          : '/about'
                  }
                >
                  View overview
                  <Arrow diagonal />
                </Link>
                <button
                  className="cec-mega-close"
                  type="button"
                  onClick={() => {
                    setActiveMenu(null);
                    trigger.current?.focus();
                  }}
                  aria-label="Close navigation panel"
                >
                  Close ×
                </button>
              </aside>
              <MegaMenuContent activeMenu={activeMenu} />
            </div>
          </div>
        )}
      </header>
      {activeMenu && (
        <button
          className="cec-mega-backdrop"
          type="button"
          aria-label="Dismiss navigation panel"
          tabIndex={-1}
          onClick={() => setActiveMenu(null)}
        />
      )}
      <NewsMarquee />
      <Outlet />
      <footer className="cec-footer">
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
                <Arrow diagonal />
              </a>
            </div>
            <div>
              <h2>Explore CEC</h2>
              <Link to="/about">About us</Link>
              <Link to="/projects">Our projects</Link>
              <Link to="/team">Our people</Link>
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
                LinkedIn ↗
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
    </div>
  );
}
