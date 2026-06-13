import React, { useState, useEffect } from 'react';
import styles from './Projects.module.css';
import { useNavigate } from 'react-router-dom';
import useScrollAnimation from '../../hooks/useScrollAnimation';

interface Project {
  id: string | number;
  slug?: string;
  name: string;
  categories: string[];
  capacity?: string;
  location?: string;
  image_url?: string;
  type?: string;
  developer?: string;
  status?: string;
  cecInputs?: string;
  description?: string;
  [key: string]: any;
}

interface ProjectsProps {
  projects?: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects = [] }) => {
  const navigate = useNavigate();
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });

  // Categorical clusters requested by the user
  const categories = [
    "Detail Engineering Design",
    "Feasibility Study",
    "Construction Supervision",
    "Bill Verification",
    "Due Diligence Audit"
  ];

  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Initialize with the first available project in the first category
  useEffect(() => {
    if (projects.length > 0) {
      const firstProject = projects.find(p => p.categories && p.categories.includes(activeCategory));
      setActiveProject(firstProject || projects[0]);
    }
  }, [projects, activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const firstInCat = projects.find(p => p.categories && p.categories.includes(category));
    if (firstInCat) setActiveProject(firstInCat);
  };

  const filteredProjects = projects.filter(p =>
    p.categories && p.categories.includes(activeCategory)
  );

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.container}>
        <div
          ref={headerRef}
          className={`${styles.sectionHeader} ${headerVisible ? styles.animate : ''}`}
        >
          <h2>Project Portfolio Explorer</h2>
          <p className={styles.subtitle}>Browse our multi-disciplinary engineering expertise across specialized clusters.</p>
          <div className={styles.line}></div>
        </div>

        {/* Explorer Interface */}
        <div className={styles.explorerWrapper}>
          {/* 1. Category Cluster Buttons */}
          <div className={styles.categoryNavigation}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 2. Two-Column Explorer Body */}
          <div className={styles.explorerBody}>
            {/* Column 1: Sidebar List */}
            <aside className={styles.sidebarList}>
              <div className={styles.sidebarHeader}>
                <h3>{activeCategory} Projects</h3>
                <span className={styles.count}>{filteredProjects.length} found</span>
              </div>
              <div className={styles.itemsContainer}>
                {filteredProjects.map(p => (
                  <div
                    key={p.slug || p.id}
                    className={`${styles.projectItem} ${(activeProject?.slug || activeProject?.id) === (p.slug || p.id) ? styles.active : ''}`}
                    onClick={() => setActiveProject(p)}
                  >
                    <div className={styles.itemInfo}>
                      <h4>{p.name}</h4>
                      <div className={styles.itemMeta}>
                        <span>{p.capacity}</span>
                        <span>{p.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Column 2: Selected Project Details */}
            <div className={styles.detailPanel}>
              {activeProject ? (
                <>
                  <div className={styles.detailHero}>
                    {activeProject.image_url && <img src={activeProject.image_url} alt={activeProject.name} />}
                    <div className={styles.detailOverlay}>
                      <h2>{activeProject.name}</h2>
                      <div className={styles.heroMeta}>
                        <span><i className="fas fa-bolt"></i> {activeProject.capacity}</span>
                        <span><i className="fas fa-map-marker-alt"></i> {activeProject.location}</span>
                        <span><i className="fas fa-industry"></i> {activeProject.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.detailInnerContent}>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoBox}>
                        <strong>Developer</strong>
                        <span>{activeProject.developer}</span>
                      </div>
                      <div className={styles.infoBox}>
                        <strong>Project Status</strong>
                        <span>{activeProject.status}</span>
                      </div>
                      <div className={styles.infoBox}>
                        <strong>CEC Role</strong>
                        <span>{activeProject.cecInputs}</span>
                      </div>
                    </div>

                    <article className={styles.descriptionSection}>
                      <h3>Project Overview</h3>
                      <p>{activeProject.description}</p>
                    </article>

                    <div className={styles.actions}>
                      <button
                        className={styles.inquiryBtn}
                        onClick={() => navigate(`/project/${activeProject.slug || activeProject.id}`)}
                      >
                        More Information
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.placeholder}>
                  <i className="fas fa-project-diagram"></i>
                  <p>Select a project to view detailed explorer information</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;