import React, { useEffect, Suspense, lazy } from 'react';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import HeroSlider from '../components/Sections/HeroSlider';
import NewsTicker from '../components/Sections/NewsTicker';
// ─── Data sources ─────────────────────────────────────────────────────────────
// Change any import path here to swap data without touching section components.
import heroJson from '../data/pages/home.json';
import aboutJson from '../data/pages/about.json';
import servicesJson from '../data/collections/services.json';
import projectsJson from '../data/collections/projects.json';
import statisticsJson from '../data/pages/home.json';
import newsJson from '../data/collections/news-events/feed.json';
import teamJson from '../data/collections/team/registry.json';
import companyJson from '../data/global/site-config.json';
import faqJson from '../data/collections/faq.json';
import profileJson from '../data/pages/company_profile.json';

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

const About = lazy(() => import('../components/Sections/About'));
const Services = lazy(() => import('../components/Sections/Services'));
const Projects = lazy(() => import('../components/Sections/Projects'));
const ProjectMap = lazy(() => import('../components/Sections/ProjectMap'));
const Statistics = lazy(() => import('../components/Sections/Statistics'));
const FAQ = lazy(() => import('../components/Sections/FAQ'));
const Team = lazy(() => import('../components/Sections/Team'));
const CompanyProfile = lazy(() => import('../components/Sections/CompanyProfile'));
// const NewsEvents = lazy(() => import('../components/Sections/NewsEvents'));
const Contact = lazy(() => import('../components/Sections/Contact'));
const Footer = lazy(() => import('../components/Layout/Footer'));

const Home = () => {
    const hero = getHero(heroJson);
    const about = getAbout(aboutJson);
    const services = getServices(servicesJson);
    const projects = getProjects(projectsJson);
    const stats = getStatistics(statisticsJson);
    const newsAndEvents = getNewsAndEvents(newsJson);
    const teamCategories = getTeamCategories(teamJson);
    const teamCategoryNames = getTeamCategoryNames(teamJson);
    const company = getCompany(companyJson);
    const profile = getCompanyProfile(profileJson);
    const faqs = getFAQs(faqJson);

    useEffect(() => {
        if (company?.name) {
            document.title = `Home | ${company.name}`;
        }
    }, [company]);

    return (
        <>
            <NavbarRedesigned />
            <NewsTicker news={newsAndEvents} />
            <main>
                <HeroSlider hero={hero} news={newsAndEvents} />
                <Suspense fallback={<div style={{ padding: '5vh', textAlign: 'center' }}>Loading content...</div>}>
                    <CompanyProfile profile={profile} />
                    <Team
                        teamCategories={teamCategories}
                        menuOptions={teamCategoryNames}
                    />
                    <About about={about} />

                    <Services services={services} />
                    <Projects projects={projects} />
                    <ProjectMap />
                    <Statistics stats={stats} />
                    <FAQ faqs={faqs} />
                    {/* <NewsEvents newsAndEvents={newsAndEvents} /> */}
                    <Contact company={company} />
                </Suspense>
            </main>
            <Suspense fallback={null}>
                <Footer company={company} />
            </Suspense>
        </>
    );
};

export default Home;
