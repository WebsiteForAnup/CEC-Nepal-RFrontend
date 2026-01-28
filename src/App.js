import React from 'react';
import styles from './App.module.css';
import Navbar from './components/Layout/Navbar';
import Hero from './components/Sections/Hero';
import About from './components/Sections/About';
import Services from './components/Sections/Services';
import Projects from './components/Sections/Projects';
import Team from './components/Sections/Team';
import Contact from './components/Sections/Contact';
import Footer from './components/Layout/Footer';

function App() {
  return (
    <div className={styles.app}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;