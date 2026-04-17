import React from 'react';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Hero from '../components/Sections/Hero';
import About from '../components/Sections/About';
import Services from '../components/Sections/Services';
import Projects from '../components/Sections/Projects';
import Statistics from '../components/Sections/Statistics';
import FAQ from '../components/Sections/FAQ';
import Team from '../components/Sections/Team';
import CompanyProfile from '../components/Sections/CompanyProfile';
import NewsEvents from '../components/Sections/NewsEvents';
import Contact from '../components/Sections/Contact';
import Footer from '../components/Layout/Footer';

// ─── Data sources ─────────────────────────────────────────────────────────────
// Change any import path here to swap data without touching section components.
import heroJson from '../data/hero.json';
import aboutJson from '../data/about.json';
import servicesJson from '../data/services.json';
import projectsJson from '../data/projects.json';
import statisticsJson from '../data/statistics.json';
import newsJson from '../data/newsAndEvents.json';
import teamJson from '../data/team.json';
import companyJson from '../data/company.json';
import faqJson from '../data/faq.json';
import profileJson from '../data/company_profile.json';

import {
    getHero,
    getAbout,
    getServices,
    getProjects,
    getStatistics,
    getNewsAndEvents,
    getTeamCategories,
    getTeamCategoryNames,
    getCompany,
    getCompanyProfile,
    getFAQs,
} from '../services/homeService';

const Home = () => {
    const hero = getHero(heroJson);
    const about = getAbout(aboutJson);
    const services = getServices(servicesJson);
    const projects = getProjects(projectsJson);
    const statCards = getStatistics(statisticsJson);
    const newsAndEvents = getNewsAndEvents(newsJson);
    const teamCategories = getTeamCategories(teamJson);
    const teamCategoryNames = getTeamCategoryNames(teamJson);
    const company = getCompany(companyJson);
    const profile = getCompanyProfile(profileJson);
    const faqs = getFAQs(faqJson);

    return (
        <>
            <NavbarRedesigned />
            <main>

                <Hero hero={hero} />
                <Team
                    teamCategories={teamCategories}
                    menuOptions={teamCategoryNames}
                />
                <CompanyProfile profile={profile} />
                <About about={about} />

                <Services services={services} />
                <Projects projects={projects} />
                <Statistics stats={statCards} />
                <FAQ faqs={faqs} />
                <NewsEvents newsAndEvents={newsAndEvents} />
                <Contact company={company} />
            </main>
            <Footer company={company} />
        </>
    );
};

export default Home;
