import '../../styles/site.css';
import { Outlet, useLocation } from 'react-router-dom';
import { publicContent } from '../../services/publicContent';
import NewsMarquee from './NewsMarquee';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import usePageMotion from '../../hooks/usePageMotion';

export default function SiteLayout() {
  const location = useLocation();
  usePageMotion(location.pathname);
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
          <a href={'mailto:' + publicContent.contact.email}>{publicContent.contact.email}</a>
        </div>
      </div>
      <SiteHeader />
      <NewsMarquee />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
