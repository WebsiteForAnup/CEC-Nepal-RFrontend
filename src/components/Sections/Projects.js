import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Projects.module.css';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const Projects = ({ projects = [] }) => {
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

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeProject, setActiveProject] = useState(null);

  // Initialize with the first available project in the first category
  useEffect(() => {
    if (projects.length > 0) {
      const firstProject = projects.find(p => p.categories && p.categories.includes(activeCategory));
      setActiveProject(firstProject || projects[0]);
    }
  }, [projects, activeCategory]);

  const handleCategoryChange = (category) => {
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
                    key={p.id}
                    className={`${styles.projectItem} ${activeProject?.id === p.id ? styles.active : ''}`}
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
                    <img src={activeProject.image_url} alt={activeProject.name} />
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

                    {activeProject.technicalDetails && (
                      <section className={styles.technicalSection}>
                        <h3>Technical Specifications</h3>
                        <div className={styles.specsGrid}>
                          {Object.entries(activeProject.technicalDetails).map(([key, value]) => {
                            // Map camelCase keys to Human Readable Labels
                            const labelMap = {
                              headHeight: 'Gross Head',
                              discharge: 'Design Discharge',
                              type: 'Project Type',
                              turbineType: 'Turbine Type',
                              annualEnergy: 'Annual Deemed Energy',
                              weir: 'Weir Length/Height',
                              intake: 'Intake Dimensions',
                              desander: 'Desander Specs',
                              headrace: 'Headrace Alignment',
                              penstock: 'Penstock Details',
                              transmission: 'Transmission Line'
                            };
                            const iconsMap = {
                              headHeight: 'fa-ruler-vertical',
                              discharge: 'fa-water',
                              type: 'fa-industry',
                              turbineType: 'fa-fan',
                              annualEnergy: 'fa-bolt',
                              weir: 'fa-bridge',
                              intake: 'fa-faucet',
                              desander: 'fa-filter',
                              headrace: 'fa-road',
                              penstock: 'fa-pipe-section',
                              transmission: 'fa-tower-cell'
                            };
                            return (
                              <div key={key} className={styles.specBox}>
                                <i className={`fas ${iconsMap[key] || 'fa-info-circle'}`}></i>
                                <div>
                                  <strong>{labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                                  <span>{value}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {activeProject.timeline && activeProject.timeline.length > 0 && (
                      <section className={styles.timelineSection}>
                        <h3>Engagement Timeline</h3>
                        <div className={styles.timelineList}>
                          {activeProject.timeline.map((item, index) => (
                            <div key={index} className={styles.timelineItem}>
                              <div className={styles.marker}></div>
                              <p>{item}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    <div className={styles.actions}>
                      <button 
                        className={styles.inquiryBtn}
                        onClick={() => {
                          const contactSection = document.getElementById('contact');
                          if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Inquire About This Project
                        <i className="fas fa-paper-plane"></i>
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