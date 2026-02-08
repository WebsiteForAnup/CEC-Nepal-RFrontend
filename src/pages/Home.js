import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Hero from '../components/Sections/Hero';
import About from '../components/Sections/About';
import Services from '../components/Sections/Services';
import Projects from '../components/Sections/Projects';
import Statistics from '../components/Sections/Statistics';
import FAQ from '../components/Sections/FAQ';
import Team from '../components/Sections/Team';
import NewsEvents from '../components/Sections/NewsEvents';
import Contact from '../components/Sections/Contact';
import Footer from '../components/Layout/Footer';

const Home = () => {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <About />
                <Services />
                <Projects />
                <Statistics />
                <FAQ />
                <Team />
                <NewsEvents />
                <Contact />
            </main>
            <Footer />
        </>
    );
};

export default Home;
