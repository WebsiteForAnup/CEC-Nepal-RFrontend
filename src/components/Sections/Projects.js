import React, { useState } from 'react';
import styles from './Projects.module.css';

const Projects = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const projects = [
    // Generation Status
    { id: 1, name: 'Kabeli-B HEP', capacity: '25 MW', developer: 'Arun Kabeli Power Limited', status: 'Generation', cecInputs: 'FSR/UFSR/Bank Technical Audit' },
    { id: 2, name: 'Jogmai Khola SHP', capacity: '7.60 MW', developer: 'Sanvi Energy Pvt. Ltd.', status: 'Generation', cecInputs: 'Bank Monitoring/Supervision' },
    { id: 3, name: 'Upper Puwa I SHP', capacity: '3.00 MW', developer: 'Joshi Hydropower Company Pvt. Ltd.', status: 'Generation', cecInputs: 'Bank Monitoring' },
    { id: 4, name: 'Piluwa Khola SHP', capacity: '3.0 MW', developer: 'Joshi Hydropower Company Pvt. Ltd.', status: 'Generation', cecInputs: 'O/M and Technical Audit' },
    { id: 5, name: 'Lower Piluwa HPP', capacity: '990 kW', developer: 'Baneshwor Hydropower Pvt. Ltd', status: 'Generation', cecInputs: 'DPR' },
    { id: 6, name: 'Hewa Khola SHP', capacity: '4.5 MW', developer: 'Barun Hydropower Company Limited', status: 'Generation', cecInputs: 'DPR' },
    { id: 7, name: 'Taksar Pikhuwa Khola HPP', capacity: '8.0 MW', developer: 'Taksar Pikhuwa Khola Hydropower Pvt. Ltd.', status: 'Generation', cecInputs: 'Bank Monitoring' },
    { id: 8, name: 'Upper Khorunga Khola SHP', capacity: '7.5 MW', developer: 'Terhathum Power Company Limited', status: 'Generation', cecInputs: 'FSR/DPR/Supervision' },
    { id: 9, name: 'Jiri Khola SHP', capacity: '2.40 MW', developer: 'Bojini Company Pvt. Ltd.', status: 'Generation', cecInputs: 'DPR' },
    { id: 10, name: 'Singati Khola Hydropower Project', capacity: '25 MW', developer: 'Singati HydroEergy Pvt. Ltd.', status: 'Generation', cecInputs: 'Due Diligence/Bank Monitoring' },
    { id: 11, name: 'Jhyari Khola SHP', capacity: '2.0 MW', developer: 'Electrocom Research Pvt. Ltd.', status: 'Generation', cecInputs: 'Bank Due Diligence' },
    { id: 12, name: 'Upper Chaku A HPP', capacity: '22.0 MW', developer: 'Shiva Shree Hydropower Pvt. Ltd.', status: 'Generation', cecInputs: 'Design of HW, Penstock and PH' },
    { id: 13, name: 'Lower Balephi Khola HPP', capacity: '20 MW', developer: 'Sajha Power Development Pvt. Ltd.', status: 'Generation', cecInputs: 'DPR' },
    { id: 14, name: 'Tungun-Thosne SHP', capacity: '4.30 MW', developer: 'Khani Khola Hydropower Company Limited', status: 'Generation', cecInputs: 'UFSR/DPR' },
    { id: 15, name: 'Khani Khola SHP', capacity: '2.0 MW', developer: 'Khani Khola Hydropower Company Limited', status: 'Generation', cecInputs: 'UFSR/DPR' },
    { id: 16, name: 'Seti – II SHP', capacity: '990 kW', developer: 'Task Hydropower Company Pvt. Ltd.', status: 'Generation', cecInputs: 'Detailed Design' },
    { id: 17, name: 'Bijayapur SHP', capacity: '4.50 MW', developer: 'Bhagawati Hydropower Company Pvt. Ltd.', status: 'Generation', cecInputs: 'Detailed Design' },
    { id: 18, name: 'Rudi A SHP', capacity: '8.80 MW', developer: 'Bindhyabasini Hydropower Pvt. Ltd.', status: 'Generation', cecInputs: 'FSR/DPR' },
    { id: 19, name: 'Radhi Khola SHP', capacity: '4.50 MW', developer: 'Radhi Bidhut Company Limited', status: 'Generation', cecInputs: 'Bank Due Diligence' },
    { id: 20, name: 'Rudi Khola B SHP', capacity: '6.60 MW', developer: 'Bindhyabasini Hydropower Pvt. Ltd.', status: 'Generation', cecInputs: 'FSR/DPR' },
    { id: 21, name: 'Super Dordi HEP', capacity: '54.00 MW', developer: 'Peoples Hydropower Company Limited', status: 'Generation', cecInputs: 'DPR/Supervision' },
    { id: 22, name: 'Ridhi Hydropower Project', capacity: '2.40 MW', developer: 'Ridhi Hydropower Company Limited', status: 'Generation', cecInputs: 'Detailed Design' },
    { id: 23, name: 'Nau Gad Khola Hydroelectric Project', capacity: '8.5 MW', developer: 'Api Power Company Limited', status: 'Generation', cecInputs: 'DPR' },
    { id: 24, name: 'Upper Naugarh Gad Hydroelectric Project', capacity: '8.0 MW', developer: 'Api Power Company Limited', status: 'Generation', cecInputs: 'DPR' },
    { id: 25, name: 'Siuri Khola SHP', capacity: '5.0 MW', developer: 'Nyadi Group Pvt. Ltd.', status: 'Generation', cecInputs: 'Detailed Design' },

    // Under Construction Status
    { id: 26, name: 'Upper Phawa HEP', capacity: '5.80 MW', developer: 'Unitech Hydropower Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Monitoring' },
    { id: 27, name: 'Mewa Khola HEP', capacity: '50.00 MW', developer: 'United Mewa Khola Hydropower Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Due Diligence' },
    { id: 28, name: 'Kabeli B1 Cascade HPP', capacity: '9.94 MW', developer: 'Arun Valley Hydropower Development Company Ltd.', status: 'Under Construction', cecInputs: 'Bank Due Diligence' },
    { id: 29, name: 'Hewa A Small Hydropower Project', capacity: '5.00 MW', developer: 'Habitat Power Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'UFSR/DPR' },
    { id: 30, name: 'Jogmai Cascade Hydroelectric Project', capacity: '5.2 MW', developer: 'Sanvi Energy Pvt. Ltd.', status: 'Under Construction', cecInputs: 'UFSR/DPR' },
    { id: 31, name: 'Upper Piluwa Hills SHP', capacity: '4.99 MW', developer: 'Milke Jaljale Hydropower Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'FSR/IEE' },
    { id: 32, name: 'Maya Khola SHP', capacity: '14.90 MW', developer: 'Maya Khola Hydropower Company Ltd.', status: 'Under Construction', cecInputs: 'UFSR' },
    { id: 33, name: 'Upper Hewa SHP', capacity: '8.5 MW', developer: 'Upper Hewa Hydropower Company Ltd.', status: 'Under Construction', cecInputs: 'FSR/DPR' },
    { id: 34, name: 'Lankhuwa SHP', capacity: '5.0 MW', developer: 'Sabha Pokhari Hydropower Pvt. Ltd.', status: 'Under Construction', cecInputs: 'FSR' },
    { id: 35, name: 'Down Piluwa Khola SHP', capacity: '9.5 MW', developer: 'River Falls Power Limited', status: 'Under Construction', cecInputs: 'UFSR' },
    { id: 36, name: 'Super Hewa SHP', capacity: '6.00 MW', developer: 'Super Hewa Power Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'UFSR/Bank Monitoring' },
    { id: 37, name: 'Isuwa Khola Hydropower Project', capacity: '97.20 MW', developer: 'KBNR Isuwa Power Limited', status: 'Under Construction', cecInputs: 'UFSR/Bank Monitoring' },
    { id: 38, name: 'Upper Piluwa Khola-3 HEP', capacity: '4.95 MW', developer: 'Mabilung Energy Limited', status: 'Under Construction', cecInputs: 'Bank Due Diligence' },
    { id: 39, name: 'Sabha Khola B Hydropower Project', capacity: '21.5 MW', developer: 'Orbit Energy Pvt. Ltd.', status: 'Under Construction', cecInputs: 'UFSR/DPR/Supervision' },
    { id: 40, name: 'Sabha Khola C Hydropower Project', capacity: '6.3 MW', developer: 'Orbit Energy Pvt. Ltd.', status: 'Under Construction', cecInputs: 'UFSR/DPR/Supervision' },
    { id: 41, name: 'Lower Khare SHP', capacity: '11 MW', developer: 'Universal Power Company Limited', status: 'Under Construction', cecInputs: 'DUFSR/DPR' },
    { id: 42, name: 'Lower Balephi Khola Hydroelectric Project', capacity: '20 MW', developer: 'Sajha Power Development Pvt. Ltd.', status: 'Under Construction', cecInputs: 'DPR/Supervision' },
    { id: 43, name: 'Liping Khola Hydropower Project', capacity: '16.26 MW', developer: 'Him River Power Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Monitoring, Bill Verification' },
    { id: 44, name: 'Upper Chaurikhola Hydropower Project', capacity: '6.0 MW', developer: 'Himalayan Water Resources and Energy Dev. Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Due Diligence' },
    { id: 45, name: 'Seti Khola Hydropower Project', capacity: '22.00 MW', developer: 'Seti Khola Hydropower Pvt. Ltd.', status: 'Under Construction', cecInputs: 'DPR/Supervision' },
    { id: 46, name: 'Super Madi HEP', capacity: '44.00 MW', developer: 'Super Madi Hydropower Limited', status: 'Under Construction', cecInputs: 'Bank Monitoring' },
    { id: 47, name: 'Phewa Siltation Check Dams repair and Maintenance', capacity: 'N/A', developer: 'Phewa Siltation Pvt. Ltd.', status: 'Under Construction', cecInputs: 'DPR' },
    { id: 48, name: 'Super Nyadi HEP', capacity: '40.27 MW', developer: 'Nyadi Group Pvt. Ltd.', status: 'Under Construction', cecInputs: 'FSR' },
    { id: 49, name: 'Upper Midim Hydropower Project', capacity: '7.50 MW', developer: 'Bhujung Hydropower Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Monitoring' },
    { id: 50, name: 'Doodhpokhari Chepe Hydropower Project', capacity: '8.8 MW', developer: 'Doodhpokhari Chepe Hydropower Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Due Diligence' },
    { id: 51, name: 'Rele Khola Hydropower Project', capacity: '6.0 MW', developer: 'Ridhi Hydropower Company Limited', status: 'Under construction', cecInputs: 'FSR' },
    { id: 52, name: 'Mathillo Thulo Khola A Hydropower Project', capacity: '22.5 MW', developer: 'Thulo Khola Hydropower Pvt. Ltd.', status: 'Under construction', cecInputs: 'UFSR/DPR/Supervision' },
    { id: 53, name: 'Upper Chamelia Hydropower Project', capacity: '40.0 MW', developer: 'Api Power Company Limited', status: 'Under Construction', cecInputs: 'FSR/DPR' },

    // PPA Stage
    { id: 54, name: 'Upper Kabeli HPP', capacity: '28.10 MW', developer: 'Peace Energy Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'FSR/UFSR/DPR' },
    { id: 55, name: 'Upper Kabeli-2 HPP', capacity: '15.00 MW', developer: 'Peace Energy Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'FSR/UFSR/DPR' },
    { id: 56, name: 'Sisuwa Khola HEP', capacity: '13.5 MW', developer: 'Matirbhumi Hydropower Dev. Company Pvt. Ltd', status: 'PPA Stage', cecInputs: 'FSR' },
    { id: 57, name: 'Irkhuwa Khola Ka Hydropower Project', capacity: '15 MW', developer: 'Estern Energy Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'Feasibility Survey/Progress Report' },
    { id: 58, name: 'Khorunga Tangmaya Khola Hydropower Project', capacity: '2.0 MW', developer: 'Terhathum Power Company Limited', status: 'PPA Stage', cecInputs: 'FSR' },
    { id: 59, name: 'Budum Khola Hydropower Project', capacity: '14.50 MW', developer: 'Arun Valley Hydropower Dev. Company Ltd.', status: 'PPA Stage', cecInputs: 'FSR' },
    { id: 60, name: 'Khimti-Ghwang HEP', capacity: '9.0 MW', developer: 'Nilganga Hydropower Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'FSR/UFSR/EIA' },
    { id: 61, name: 'Himchuli Dordi HEP', capacity: '57.00 MW', developer: 'Peoples Hydropower Company Limited', status: 'PPA Stage', cecInputs: 'FSR/DPR' },
    { id: 62, name: 'Upper Marsyandi HPP', capacity: '150 MW', developer: 'Multi Modal Developers Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'FSR' },
    { id: 63, name: 'Marsyangdi Nadi PRoR HPP', capacity: '99.8 MW', developer: 'M.A. Power Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'DSR/FSR/UFSR' },
    { id: 64, name: 'Dana Khola Hydropower Project', capacity: '49.95 MW', developer: 'Lalupate Hydropower Company Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'FSR/DPR/Supervision' },

    // Testing and Commissioning
    { id: 65, name: 'Upper Khimti HEP', capacity: '12 MW', developer: 'Hamalaya Urja Bikas Company Ltd', status: 'Testing and Commissioning', cecInputs: 'FSR/UFSR/DPR' },
    { id: 66, name: 'Upper Khimti-II HEP', capacity: '7.0 MW', developer: 'Hamalaya Urja Bikas Company Ltd', status: 'Testing and Commissioning', cecInputs: 'FSR/UFSR/DPR' },
  ];

  const statuses = ['all', 'Generation', 'Under Construction', 'PPA Stage', 'Testing and Commissioning'];
  
  const filteredProjects = selectedStatus === 'all' 
    ? projects 
    : projects.filter(p => p.status === selectedStatus);

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Successful Projects</h2>
          <div className={styles.line}></div>
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
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <h3>{project.name}</h3>
                <span className={`${styles.capacity} ${styles[project.status.replace(/\s+/g, '')]}`}>
                  {project.capacity}
                </span>
              </div>
              <div className={styles.projectDetails}>
                <p><strong>Developer:</strong> {project.developer}</p>
                <p><strong>Status:</strong> <span className={styles.statusBadge}>{project.status}</span></p>
                <p><strong>CEC Inputs:</strong> {project.cecInputs}</p>
              </div>
            </div>
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