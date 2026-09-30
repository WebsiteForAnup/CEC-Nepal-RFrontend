import { useEffect, useState, lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { getPageMetadata } from './routing/metadata';
import useScrollToTop from './hooks/useScrollToTop';
import SiteLayout from './components/public/SiteLayout';
import Home from './pages/Home';
import About from './pages/About';
import CompanyProfile from './pages/CompanyProfile';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Team from './pages/Team';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Gallery from './pages/Gallery';
import Downloads from './pages/Downloads';
import Careers from './pages/Careers';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
const AdminApp = lazy(() => import('./AdminApp'));
function BrowserAdmin() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted)
    return (
      <main id="main-content">
        <h1>Account & administration</h1>
        <p role="status">Loading secure workspace…</p>
        <noscript>Enable JavaScript to sign in and manage content.</noscript>
      </main>
    );
  return (
    <Suspense fallback={<p role="status">Loading…</p>}>
      <AdminApp />
    </Suspense>
  );
}
export default function App() {
  const location = useLocation();
  useScrollToTop();
  useEffect(() => {
    document.title = getPageMetadata(location.pathname + location.search).title;
  }, [location.pathname, location.search]);
  // AdminApp owns full absolute routes. Keep it outside a parent route so its
  // descendant Routes receive the complete /admin, /auth, or /account pathname.
  if (/^\/(admin|auth|account)(\/|$)/.test(location.pathname)) return <BrowserAdmin />;
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/news" element={<News />} />
        <Route path="/news-event/:id" element={<NewsDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
