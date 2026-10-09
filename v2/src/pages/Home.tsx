import HomeHero from '../components/home/HomeHero';
import ExpertiseNavigation from '../components/home/ExpertiseNavigation';
import PartnerIntroduction from '../components/home/PartnerIntroduction';
import EngineeringApproach from '../components/home/EngineeringApproach';
import CompanyImpact from '../components/home/CompanyImpact';
import FeaturedProjects from '../components/home/FeaturedProjects';
import HomeServices from '../components/home/HomeServices';
import LatestNews from '../components/home/LatestNews';
import ProjectInquiry from '../components/home/ProjectInquiry';
import styles from './Home.module.css';

export default function Home() {
  return (
    <main id="main-content" className={'cec-home ' + styles.root}>
      <HomeHero />
      <ExpertiseNavigation />
      <PartnerIntroduction />
      <EngineeringApproach />
      <CompanyImpact />
      <FeaturedProjects />
      <HomeServices />
      <LatestNews />
      <ProjectInquiry />
    </main>
  );
}
