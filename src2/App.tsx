import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import Home from './pages/Home';
import NewsEventDetail from './pages/NewsEventDetail';
import NewsIndex from './pages/NewsIndex';
import ServiceDetail from './pages/ServiceDetail';
import ProjectDetail from './pages/ProjectDetail';
import Gallery from './pages/Gallery';
import Downloads from './pages/Downloads';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TeamPage from './pages/TeamPage';
import Careers from './pages/Careers';
import useScrollToTop from './hooks/useScrollToTop';
import Auth from './pages/Auth';
import Account from './pages/Account';
import ListNews from './pages/admin/ListNews';
import CreateNews from './pages/admin/CreateNews';
import ListEvents from './pages/admin/ListEvents';
import CreateEvent from './pages/admin/CreateEvent';
import ListTeam from './pages/admin/ListTeam';
import CreateTeam from './pages/admin/CreateTeam';
import ListSliders from './pages/admin/ListSliders';
import CreateSlider from './pages/admin/CreateSlider';
import ListServices from './pages/admin/ListServices';
import CreateService from './pages/admin/CreateService';
import GalleryAdmin from './pages/admin/GalleryAdmin';
import CreateGallery from './pages/admin/CreateGallery';
import { SignedIn } from '@neondatabase/neon-js/auth/react';
import { authClient } from './lib/auth';
import { Link } from 'react-router-dom';

function AppContent(): React.ReactElement {
  // Scroll to top on route changes
  useScrollToTop();

  return (
    <div className={styles.app}>
      <SignedIn>
        <div style={{
          backgroundColor: '#002B5B', // Match site branding
          padding: '10px 20px',
          display: 'flex',
          gap: '20px',
          color: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <span style={{ fontWeight: 'bold' }}>Admin Dashboard:</span>
          <Link to="/account" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 500 }}>My Account</Link>
          <Link to="/admin/news" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 500 }}>Manage News</Link>
          <Link to="/admin/events" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 500 }}>Manage Events</Link>
          <Link to="/admin/team" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 500 }}>Manage Team</Link>
          <Link to="/admin/sliders" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 500 }}>Manage Sliders</Link>
          <Link to="/admin/services" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 500 }}>Manage Services</Link>
          <Link to="/admin/gallery" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 500 }}>Manage Gallery</Link>
          <div style={{ marginLeft: 'auto' }}>
            <button 
              onClick={() => authClient.signOut()} 
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </SignedIn>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<NewsIndex />} />
        <Route path="/news-event/:id" element={<NewsEventDetail />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/auth/:pathname" element={<Auth />} />
        <Route path="/account/" element={<Account />} />
        <Route path="/admin/news" element={<ListNews />} />
        <Route path="/admin/news/create" element={<CreateNews />} />
        <Route path="/admin/news/edit/:id" element={<CreateNews />} />
        <Route path="/admin/events" element={<ListEvents />} />
        <Route path="/admin/events/create" element={<CreateEvent />} />
        <Route path="/admin/events/edit/:id" element={<CreateEvent />} />
        <Route path="/admin/team" element={<ListTeam />} />
        <Route path="/admin/team/create" element={<CreateTeam />} />
        <Route path="/admin/team/edit/:id" element={<CreateTeam />} />
        <Route path="/admin/sliders" element={<ListSliders />} />
        <Route path="/admin/sliders/create" element={<CreateSlider />} />
        <Route path="/admin/sliders/edit/:id" element={<CreateSlider />} />
        <Route path="/admin/services" element={<ListServices />} />
        <Route path="/admin/services/create" element={<CreateService />} />
        <Route path="/admin/services/edit/:id" element={<CreateService />} />
        <Route path="/admin/gallery" element={<GalleryAdmin />} />
        <Route path="/admin/gallery/create" element={<CreateGallery />} />
        <Route path="/admin/gallery/edit/:id" element={<CreateGallery />} />
      </Routes>
    </div>
  );
}

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;