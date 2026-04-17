import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Projects.module.css';
import useScrollAnimation from '../../hooks/useScrollAnimation';

// Rotating service images used as fallback thumbnails
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

const getServiceImage = (projectId) => serviceImages[projectId % serviceImages.length];

const Projects = ({ projects = [] }) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });

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