import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Projects.module.css';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const Projects = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });

  // Service images from cecnepal.com.np
  const serviceImages = [
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Survey.png',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Desk.png',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Mapping.png',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Detailed-Engineering.png',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Construction-Supervision.png',
    'https://cecnepal.com.np/wp-content/uploads/2024/01/0-02-03-6caf56c02a149e4ba48702ff0a0e52fb25dad5469ecc879ffe5f58462b77cf18_59eccfe8a97d9d44.jpg',
    'https://cecnepal.com.np/wp-content/uploads/2024/02/viber_image_2024-02-05_13-28-15-068.jpg',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Discharge-Measurement.jpg',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Road-Design-Analysis.jpg',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Geotechnical-InvestigationCore-Drilling-1.jpg',
  ];

  const statusImages = {
    generation: 'https://cecnepal.com.np/wp-content/uploads/2023/10/CEC-studies-Project.jpg',
    'under construction': 'https://cecnepal.com.np/wp-content/uploads/2024/12/Construction-Supervision.png',
    'ppa stage': 'https://cecnepal.com.np/wp-content/uploads/2024/12/Desk.png',
    'testing and commissioning': 'https://cecnepal.com.np/wp-content/uploads/2024/02/viber_image_2024-02-05_13-28-15-068.jpg',
  };

  // Get rotated service image based on project ID
  const getServiceImage = (projectId) => {
    return serviceImages[projectId % serviceImages.length];
  };

  const projects = [
    // Generation Status
    { id: 1, name: 'Kabeli-B HEP', capacity: '25 MW', developer: 'Arun Kabeli Power Limited', status: 'Generation', cecInputs: 'FSR/UFSR/Bank Technical Audit', image: '/images/projects/kabeli-b.jpg', description: 'A run-of-river hydroelectric project located in eastern Nepal, providing clean energy to the national grid.' },
    { id: 2, name: 'Jogmai Khola SHP', capacity: '7.60 MW', developer: 'Sanvi Energy Pvt. Ltd.', status: 'Generation', cecInputs: 'Bank Monitoring/Supervision', image: '/images/projects/jogmai.jpg', description: 'Small hydropower project utilizing the Jogmai Khola river for sustainable electricity generation.' },
    { id: 3, name: 'Upper Puwa I SHP', capacity: '3.00 MW', developer: 'Joshi Hydropower Company Pvt. Ltd.', status: 'Generation', cecInputs: 'Bank Monitoring', image: '/images/projects/upper-puwa.jpg', description: 'Eco-friendly hydropower facility designed to minimize environmental impact while maximizing energy output.' },
    { id: 4, name: 'Piluwa Khola SHP', capacity: '3.0 MW', developer: 'Joshi Hydropower Company Pvt. Ltd.', status: 'Generation', cecInputs: 'O/M and Technical Audit', image: '/images/projects/project-4.jpg', description: 'Small hydropower plant providing reliable operation and maintenance with comprehensive technical audits.' },
    { id: 5, name: 'Lower Piluwa HPP', capacity: '990 kW', developer: 'Baneshwor Hydropower Pvt. Ltd', status: 'Generation', cecInputs: 'DPR', image: '/images/projects/project-5.jpg', description: 'Compact hydropower facility delivering clean energy through efficient detailed project reporting and design.' },
    { id: 6, name: 'Hewa Khola SHP', capacity: '4.5 MW', developer: 'Barun Hydropower Company Limited', status: 'Generation', cecInputs: 'DPR', image: '/images/projects/project-6.jpg', description: 'Successfully operating hydropower project utilizing Hewa Khola river resources for sustainable energy production.' },
    { id: 7, name: 'Taksar Pikhuwa Khola HPP', capacity: '8.0 MW', developer: 'Taksar Pikhuwa Khola Hydropower Pvt. Ltd.', status: 'Generation', cecInputs: 'Bank Monitoring', image: '/images/projects/project-7.jpg', description: 'Medium-scale hydropower facility with ongoing bank monitoring ensuring financial and operational excellence.' },
    { id: 8, name: 'Upper Khorunga Khola SHP', capacity: '7.5 MW', developer: 'Terhathum Power Company Limited', status: 'Generation', cecInputs: 'FSR/DPR/Supervision', image: '/images/projects/project-8.jpg', description: 'Comprehensive hydropower project with full-cycle engineering from feasibility study to supervision and commissioning.' },
    { id: 9, name: 'Jiri Khola SHP', capacity: '2.40 MW', developer: 'Bojini Company Pvt. Ltd.', status: 'Generation', cecInputs: 'DPR', image: '/images/projects/project-9.jpg', description: 'Small-scale run-of-river project contributing to local energy security and rural electrification initiatives.' },
    { id: 10, name: 'Singati Khola Hydropower Project', capacity: '25 MW', developer: 'Singati HydroEergy Pvt. Ltd.', status: 'Generation', cecInputs: 'Due Diligence/Bank Monitoring', image: '/images/projects/project-10.jpg', description: 'Major hydropower installation with rigorous due diligence and continuous bank oversight for optimal performance.' },
    { id: 11, name: 'Jhyari Khola SHP', capacity: '2.0 MW', developer: 'Electrocom Research Pvt. Ltd.', status: 'Generation', cecInputs: 'Bank Due Diligence', image: '/images/projects/project-11.jpg', description: 'Micro hydropower project demonstrating sustainable energy solutions through comprehensive financial oversight.' },
    { id: 12, name: 'Upper Chaku A HPP', capacity: '22.0 MW', developer: 'Shiva Shree Hydropower Pvt. Ltd.', status: 'Generation', cecInputs: 'Design of HW, Penstock and PH', image: '/images/projects/project-12.jpg', description: 'Advanced hydropower facility featuring specialized design of headworks, penstock, and powerhouse infrastructure.' },
    { id: 13, name: 'Lower Balephi Khola HPP', capacity: '20 MW', developer: 'Sajha Power Development Pvt. Ltd.', status: 'Generation', cecInputs: 'DPR', image: '/images/projects/project-13.jpg', description: 'Strategically located hydropower project utilizing Balephi Khola river for consistent renewable energy generation.' },
    { id: 14, name: 'Tungun-Thosne SHP', capacity: '4.30 MW', developer: 'Khani Khola Hydropower Company Limited', status: 'Generation', cecInputs: 'UFSR/DPR', image: '/images/projects/project-14.jpg', description: 'Efficient small hydropower plant with updated feasibility studies ensuring optimal resource utilization.' },
    { id: 15, name: 'Khani Khola SHP', capacity: '2.0 MW', developer: 'Khani Khola Hydropower Company Limited', status: 'Generation', cecInputs: 'UFSR/DPR', image: '/images/projects/project-15.jpg', description: 'Compact hydropower facility on Khani Khola river contributing to regional renewable energy portfolio.' },
    { id: 16, name: 'Seti – II SHP', capacity: '990 kW', developer: 'Task Hydropower Company Pvt. Ltd.', status: 'Generation', cecInputs: 'Detailed Design', image: '/images/projects/project-16.jpg', description: 'Precision-engineered micro hydropower installation with detailed technical design and specifications.' },
    { id: 17, name: 'Bijayapur SHP', capacity: '4.50 MW', developer: 'Bhagawati Hydropower Company Pvt. Ltd.', status: 'Generation', cecInputs: 'Detailed Design', image: '/images/projects/project-17.jpg', description: 'Small hydropower project delivering clean energy with comprehensive engineering design and execution.' },
    { id: 18, name: 'Rudi A SHP', capacity: '8.80 MW', developer: 'Bindhyabasini Hydropower Pvt. Ltd.', status: 'Generation', cecInputs: 'FSR/DPR', image: '/images/projects/project-18.jpg', description: 'Successfully operational hydropower facility with complete feasibility and detailed project documentation.' },
    { id: 19, name: 'Radhi Khola SHP', capacity: '4.50 MW', developer: 'Radhi Bidhut Company Limited', status: 'Generation', cecInputs: 'Bank Due Diligence', image: '/images/projects/project-19.jpg', description: 'Run-of-river hydropower project with thorough financial due diligence and sustainable operations.' },
    { id: 20, name: 'Rudi Khola B SHP', capacity: '6.60 MW', developer: 'Bindhyabasini Hydropower Pvt. Ltd.', status: 'Generation', cecInputs: 'FSR/DPR', image: '/images/projects/project-20.jpg', description: 'Cascade hydropower development on Rudi Khola maximizing river potential for clean energy generation.' },
    { id: 21, name: 'Super Dordi HEP', capacity: '54.00 MW', developer: 'Peoples Hydropower Company Limited', status: 'Generation', cecInputs: 'DPR/Supervision', image: '/images/projects/project-21.jpg', description: 'Large-scale hydropower installation on Dordi river with comprehensive supervision and project management.' },
    { id: 22, name: 'Ridhi Hydropower Project', capacity: '2.40 MW', developer: 'Ridhi Hydropower Company Limited', status: 'Generation', cecInputs: 'Detailed Design', image: '/images/projects/project-22.jpg', description: 'Small-scale hydropower project with meticulous design ensuring efficient and reliable power generation.' },
    { id: 23, name: 'Nau Gad Khola Hydroelectric Project', capacity: '8.5 MW', developer: 'Api Power Company Limited', status: 'Generation', cecInputs: 'DPR', image: '/images/projects/project-23.jpg', description: 'Strategic hydropower facility in far-western Nepal contributing to regional energy independence.' },
    { id: 24, name: 'Upper Naugarh Gad Hydroelectric Project', capacity: '8.0 MW', developer: 'Api Power Company Limited', status: 'Generation', cecInputs: 'DPR', image: '/images/projects/project-24.jpg', description: 'Cascade development maximizing hydropower potential of Naugarh Gad river system.' },
    { id: 25, name: 'Siuri Khola SHP', capacity: '5.0 MW', developer: 'Nyadi Group Pvt. Ltd.', status: 'Generation', cecInputs: 'Detailed Design', image: '/images/projects/project-25.jpg', description: 'Well-designed small hydropower facility providing sustainable electricity to local communities.' },

    // Under Construction Status
    { id: 26, name: 'Upper Phawa HEP', capacity: '5.80 MW', developer: 'Unitech Hydropower Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Monitoring', image: '/images/projects/project-26.jpg', description: 'Hydropower project currently under construction with active bank monitoring for quality assurance.' },
    { id: 27, name: 'Mewa Khola HEP', capacity: '50.00 MW', developer: 'United Mewa Khola Hydropower Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Due Diligence', image: '/images/projects/project-27.jpg', description: 'Major hydropower development progressing with comprehensive financial oversight and construction monitoring.' },
    { id: 28, name: 'Kabeli B1 Cascade HPP', capacity: '9.94 MW', developer: 'Arun Valley Hydropower Development Company Ltd.', status: 'Under Construction', cecInputs: 'Bank Due Diligence', image: '/images/projects/project-28.jpg', description: 'Cascade hydropower system under development on Kabeli river with rigorous financial monitoring.' },
    { id: 29, name: 'Hewa A Small Hydropower Project', capacity: '5.00 MW', developer: 'Habitat Power Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'UFSR/DPR', image: '/images/projects/project-29.jpg', description: 'Small hydropower facility under construction with updated feasibility and detailed engineering plans.' },
    { id: 30, name: 'Jogmai Cascade Hydroelectric Project', capacity: '5.2 MW', developer: 'Sanvi Energy Pvt. Ltd.', status: 'Under Construction', cecInputs: 'UFSR/DPR', image: '/images/projects/project-30.jpg', description: 'Cascade development on Jogmai river system currently in advanced construction phase.' },
    { id: 31, name: 'Upper Piluwa Hills SHP', capacity: '4.99 MW', developer: 'Milke Jaljale Hydropower Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'FSR/IEE', image: '/images/projects/project-31.jpg', description: 'Environmentally conscious hydropower project with comprehensive impact assessment and mitigation measures.' },
    { id: 32, name: 'Maya Khola SHP', capacity: '14.90 MW', developer: 'Maya Khola Hydropower Company Ltd.', status: 'Under Construction', cecInputs: 'UFSR', image: '/images/projects/project-32.jpg', description: 'Medium-scale hydropower development progressing on schedule with updated feasibility assessments.' },
    { id: 33, name: 'Upper Hewa SHP', capacity: '8.5 MW', developer: 'Upper Hewa Hydropower Company Ltd.', status: 'Under Construction', cecInputs: 'FSR/DPR', image: '/images/projects/project-33.jpg', description: 'Strategic hydropower installation on Hewa river with complete engineering documentation and oversight.' },
    { id: 34, name: 'Lankhuwa SHP', capacity: '5.0 MW', developer: 'Sabha Pokhari Hydropower Pvt. Ltd.', status: 'Under Construction', cecInputs: 'FSR', image: '/images/projects/project-34.jpg', description: 'Small hydropower project under construction backed by comprehensive feasibility studies.' },
    { id: 35, name: 'Down Piluwa Khola SHP', capacity: '9.5 MW', developer: 'River Falls Power Limited', status: 'Under Construction', cecInputs: 'UFSR', image: '/images/projects/project-35.jpg', description: 'Downstream hydropower development on Piluwa Khola currently in construction phase with updated studies.' },
    { id: 36, name: 'Super Hewa SHP', capacity: '6.00 MW', developer: 'Super Hewa Power Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'UFSR/Bank Monitoring', image: '/images/projects/project-36.jpg', description: 'Hydropower facility under construction with continuous bank oversight and updated technical assessments.' },
    { id: 37, name: 'Isuwa Khola Hydropower Project', capacity: '97.20 MW', developer: 'KBNR Isuwa Power Limited', status: 'Under Construction', cecInputs: 'UFSR/Bank Monitoring', image: '/images/projects/project-37.jpg', description: 'Large-scale hydropower development representing significant investment in Nepal renewable energy sector.' },
    { id: 38, name: 'Upper Piluwa Khola-3 HEP', capacity: '4.95 MW', developer: 'Mabilung Energy Limited', status: 'Under Construction', cecInputs: 'Bank Due Diligence', image: '/images/projects/project-38.jpg', description: 'Third cascade development on Piluwa system progressing with comprehensive financial oversight.' },
    { id: 39, name: 'Sabha Khola B Hydropower Project', capacity: '21.5 MW', developer: 'Orbit Energy Pvt. Ltd.', status: 'Under Construction', cecInputs: 'UFSR/DPR/Supervision', image: '/images/projects/project-39.jpg', description: 'Major hydropower project with full engineering cycle from feasibility to active construction supervision.' },
    { id: 40, name: 'Sabha Khola C Hydropower Project', capacity: '6.3 MW', developer: 'Orbit Energy Pvt. Ltd.', status: 'Under Construction', cecInputs: 'UFSR/DPR/Supervision', image: '/images/projects/project-40.jpg', description: 'Cascade development on Sabha Khola system under construction with comprehensive project management.' },
    { id: 41, name: 'Lower Khare SHP', capacity: '11 MW', developer: 'Universal Power Company Limited', status: 'Under Construction', cecInputs: 'DUFSR/DPR', image: '/images/projects/project-41.jpg', description: 'Downstream hydropower installation currently under construction with detailed feasibility and design reports.' },
    { id: 42, name: 'Lower Balephi Khola Hydroelectric Project', capacity: '20 MW', developer: 'Sajha Power Development Pvt. Ltd.', status: 'Under Construction', cecInputs: 'DPR/Supervision', image: '/images/projects/project-42.jpg', description: 'Strategic hydropower development on Balephi river with active construction supervision and quality control.' },
    { id: 43, name: 'Liping Khola Hydropower Project', capacity: '16.26 MW', developer: 'Him River Power Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Monitoring, Bill Verification', image: '/images/projects/project-43.jpg', description: 'Medium-scale hydropower project under construction with rigorous financial monitoring and verification.' },
    { id: 44, name: 'Upper Chaurikhola Hydropower Project', capacity: '6.0 MW', developer: 'Himalayan Water Resources and Energy Dev. Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Due Diligence', image: '/images/projects/project-44.jpg', description: 'Small hydropower facility under development in Himalayan region with thorough financial oversight.' },
    { id: 45, name: 'Seti Khola Hydropower Project', capacity: '22.00 MW', developer: 'Seti Khola Hydropower Pvt. Ltd.', status: 'Under Construction', cecInputs: 'DPR/Supervision', image: '/images/projects/project-45.jpg', description: 'Major hydropower installation on Seti Khola progressing with comprehensive supervision and management.' },
    { id: 46, name: 'Super Madi HEP', capacity: '44.00 MW', developer: 'Super Madi Hydropower Limited', status: 'Under Construction', cecInputs: 'Bank Monitoring', image: '/images/projects/project-46.jpg', description: 'Large hydropower development on Madi river under construction with continuous bank oversight.' },
    { id: 47, name: 'Phewa Siltation Check Dams repair and Maintenance', capacity: 'N/A', developer: 'Phewa Siltation Pvt. Ltd.', status: 'Under Construction', cecInputs: 'DPR', image: '/images/projects/project-47.jpg', description: 'Environmental infrastructure project for maintaining Phewa Lake water quality and siltation control.' },
    { id: 48, name: 'Super Nyadi HEP', capacity: '40.27 MW', developer: 'Nyadi Group Pvt. Ltd.', status: 'Under Construction', cecInputs: 'FSR', image: '/images/projects/project-48.jpg', description: 'Major hydropower project on Nyadi river currently under construction with detailed feasibility backing.' },
    { id: 49, name: 'Upper Midim Hydropower Project', capacity: '7.50 MW', developer: 'Bhujung Hydropower Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Monitoring', image: '/images/projects/project-49.jpg', description: 'Small hydropower development progressing with active financial monitoring and quality assurance.' },
    { id: 50, name: 'Doodhpokhari Chepe Hydropower Project', capacity: '8.8 MW', developer: 'Doodhpokhari Chepe Hydropower Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Due Diligence', image: '/images/projects/project-50.jpg', description: 'Hydropower facility under construction with comprehensive due diligence and financial oversight.' },
    { id: 51, name: 'Rele Khola Hydropower Project', capacity: '6.0 MW', developer: 'Ridhi Hydropower Company Limited', status: 'Under construction', cecInputs: 'FSR', image: '/images/projects/project-51.jpg', description: 'Small hydropower installation currently under construction backed by comprehensive feasibility studies.' },
    { id: 52, name: 'Mathillo Thulo Khola A Hydropower Project', capacity: '22.5 MW', developer: 'Thulo Khola Hydropower Pvt. Ltd.', status: 'Under construction', cecInputs: 'UFSR/DPR/Supervision', image: '/images/projects/project-52.jpg', description: 'Medium-scale hydropower development with full-cycle engineering and active construction supervision.' },
    { id: 53, name: 'Upper Chamelia Hydropower Project', capacity: '40.0 MW', developer: 'Api Power Company Limited', status: 'Under Construction', cecInputs: 'FSR/DPR', image: '/images/projects/project-53.jpg', description: 'Large-scale hydropower project in far-western region advancing with complete engineering documentation.' },

    // PPA Stage
    { id: 54, name: 'Upper Kabeli HPP', capacity: '28.10 MW', developer: 'Peace Energy Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'FSR/UFSR/DPR', image: '/images/projects/project-54.jpg', description: 'Hydropower project at PPA stage with complete feasibility studies and detailed engineering reports.' },
    { id: 55, name: 'Upper Kabeli-2 HPP', capacity: '15.00 MW', developer: 'Peace Energy Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'FSR/UFSR/DPR', image: '/images/projects/project-55.jpg', description: 'Cascade development on Kabeli river system awaiting power purchase agreement finalization.' },
    { id: 56, name: 'Sisuwa Khola HEP', capacity: '13.5 MW', developer: 'Matirbhumi Hydropower Dev. Company Pvt. Ltd', status: 'PPA Stage', cecInputs: 'FSR', image: '/images/projects/project-56.jpg', description: 'Medium-scale hydropower project with approved feasibility studies awaiting PPA execution.' },
    { id: 57, name: 'Irkhuwa Khola Ka Hydropower Project', capacity: '15 MW', developer: 'Estern Energy Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'Feasibility Survey/Progress Report', image: '/images/projects/project-57.jpg', description: 'Hydropower development in eastern Nepal with completed feasibility surveys and progress documentation.' },
    { id: 58, name: 'Khorunga Tangmaya Khola Hydropower Project', capacity: '2.0 MW', developer: 'Terhathum Power Company Limited', status: 'PPA Stage', cecInputs: 'FSR', image: '/images/projects/project-58.jpg', description: 'Small hydropower project with completed feasibility study awaiting power purchase agreement.' },
    { id: 59, name: 'Budum Khola Hydropower Project', capacity: '14.50 MW', developer: 'Arun Valley Hydropower Dev. Company Ltd.', status: 'PPA Stage', cecInputs: 'FSR', image: '/images/projects/project-59.jpg', description: 'Strategic hydropower facility in Arun basin ready for power purchase agreement execution.' },
    { id: 60, name: 'Khimti-Ghwang HEP', capacity: '9.0 MW', developer: 'Nilganga Hydropower Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'FSR/UFSR/EIA', image: '/images/projects/project-60.jpg', description: 'Environmentally assessed hydropower project with comprehensive studies awaiting PPA finalization.' },
    { id: 61, name: 'Himchuli Dordi HEP', capacity: '57.00 MW', developer: 'Peoples Hydropower Company Limited', status: 'PPA Stage', cecInputs: 'FSR/DPR', image: '/images/projects/project-61.jpg', description: 'Major hydropower development on Dordi river with complete engineering documentation ready for PPA.' },
    { id: 62, name: 'Upper Marsyandi HPP', capacity: '150 MW', developer: 'Multi Modal Developers Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'FSR', image: '/images/projects/project-62.jpg', description: 'Largest hydropower project in portfolio at PPA stage, utilizing Marsyandi river potential.' },
    { id: 63, name: 'Marsyangdi Nadi PRoR HPP', capacity: '99.8 MW', developer: 'M.A. Power Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'DSR/FSR/UFSR', image: '/images/projects/project-63.jpg', description: 'Major peaking run-of-river project with comprehensive studies awaiting power purchase agreement.' },
    { id: 64, name: 'Dana Khola Hydropower Project', capacity: '49.95 MW', developer: 'Lalupate Hydropower Company Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'FSR/DPR/Supervision', image: '/images/projects/project-64.jpg', description: 'Large hydropower facility with complete engineering documentation ready for construction phase.' },

    // Testing and Commissioning
    { id: 65, name: 'Upper Khimti HEP', capacity: '12 MW', developer: 'Hamalaya Urja Bikas Company Ltd', status: 'Testing and Commissioning', cecInputs: 'FSR/UFSR/DPR', image: '/images/projects/project-65.jpg', description: 'Hydropower facility in final testing phase before commercial operation commencement.' },
    { id: 66, name: 'Upper Khimti-II HEP', capacity: '7.0 MW', developer: 'Hamalaya Urja Bikas Company Ltd', status: 'Testing and Commissioning', cecInputs: 'FSR/UFSR/DPR', image: '/images/projects/project-66.jpg', description: 'Cascade development undergoing final testing and commissioning before grid synchronization.' },
  ];

  const statuses = ['all', 'Generation', 'Under Construction', 'PPA Stage', 'Testing and Commissioning'];
  
  const filteredProjects = projects
    .filter(p => selectedStatus === 'all' || p.status === selectedStatus)
    .filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.capacity.toString().includes(searchTerm)
    );

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.container}>
        <div 
          ref={headerRef}
          className={`${styles.sectionHeader} ${headerVisible ? styles.animate : ''}`}
        >
          <h2>Successful Projects</h2>
          <div className={styles.line}></div>
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by project name, developer, or capacity (MW)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        {/* Status Filter */}
        <div className={styles.statusFilter}>
          {statuses.map(status => (
            <button
              key={status}
              className={`${styles.filterBtn} ${selectedStatus === status ? styles.active : ''}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status === 'all' ? 'All Projects' : status}
            </button>
          ))}
        </div>

        {/* Projects List */}
        <div className={styles.projectsList}>
          {filteredProjects.map(project => (
            <Link to={`/project/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
              <div className={styles.projectCard}>
              {(() => {
                const normalizedStatus = project.status.toLowerCase();
                const statusImage = statusImages[normalizedStatus];
                const serviceImage = getServiceImage(project.id);
                // Alternate between status and service images for variety
                const imageUrl = (project.id % 2 === 0 ? statusImage : serviceImage) || project.image;

                return imageUrl ? (
                <div className={styles.projectImage}>
                  <img src={imageUrl} alt={project.name} />
                  <div className={styles.imageOverlay}>
                    <span className={`${styles.capacity} ${styles[project.status.replace(/\s+/g, '')]}`}>
                      {project.capacity}
                    </span>
                  </div>
                </div>
                ) : null;
              })()}
              <div className={styles.projectContent}>
                <div className={styles.projectHeader}>
                  <h3>{project.name}</h3>
                  {!project.image && (
                    <span className={`${styles.capacity} ${styles[project.status.replace(/\s+/g, '')]}`}>
                      {project.capacity}
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className={styles.projectDescription}>{project.description}</p>
                )}
                <div className={styles.projectDetails}>
                  <p><strong>Developer:</strong> {project.developer}</p>
                  <p><strong>Status:</strong> <span className={styles.statusBadge}>{project.status}</span></p>
                  <p><strong>CEC Inputs:</strong> {project.cecInputs}</p>
                </div>
              </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.summary}>
          <p>Total Projects: <strong>{projects.length}</strong> | Showing: <strong>{filteredProjects.length}</strong></p>
        </div>
      </div>
    </section>
  );
};

export default Projects;