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

function AppContent(): React.ReactElement {
  // Scroll to top on route changes
  useScrollToTop();

  return (
    <div className={styles.app}>
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