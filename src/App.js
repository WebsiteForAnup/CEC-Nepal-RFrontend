import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import Home from './pages/Home';
import NewsEventDetail from './pages/NewsEventDetail';
import ServiceDetail from './pages/ServiceDetail';
import ProjectDetail from './pages/ProjectDetail';
import Gallery from './pages/Gallery';
import Downloads from './pages/Downloads';
import useScrollToTop from './hooks/useScrollToTop';

function AppContent() {
  // Scroll to top on route changes
  useScrollToTop();

  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news-event/:id" element={<NewsEventDetail />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/downloads" element={<Downloads />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;