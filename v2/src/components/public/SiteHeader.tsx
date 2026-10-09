import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { publicContent } from '../../services/publicContent';
import MegaMenuContent from './MegaMenuContent';
import styles from './SiteHeader.module.css';
const groups = ['Services', 'Projects', 'Insights', 'About CEC'] as const;
type Menu = (typeof groups)[number];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<Menu | null>(null);
  const location = useLocation();
  const header = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
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
    <>
      <header
        ref={header}
        className={'cec-header cec-header--mega ' + styles.root}
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
            <Link className="cec-button cec-nav-button" to="/contact">
              Contact us
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
    </>
  );
}
