import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProjectDetail.module.css';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import projectsData from '../data/collections/projects.json';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
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
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Reset active image when project changes
    useEffect(() => {
        setActiveImageIndex(0);
    }, [activeProject]);

    // Initial load and URL synchronization
    useEffect(() => {
        const allProjects = projectsData.projects;
        
        if (id) {
            const project = allProjects.find(p => p.slug === id || p.id === parseInt(id));
            if (project) {
                setActiveProject(project);
                const matchingCategory = categories.find(cat => project.categories.includes(cat));
                if (matchingCategory) {
                    setActiveCategory(matchingCategory);
                }
            }
        } else {
            const initialCategory = categories[0];
            const firstProject = allProjects.find(p => p.categories.includes(initialCategory));
            setActiveCategory(initialCategory);
            setActiveProject(firstProject);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Handle category change
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        const firstInCat = projectsData.projects.find(p => p.categories.includes(category));
        setActiveProject(firstInCat);
    };

    if (!activeProject) {
        return (
            <>
                <NavbarRedesigned />
                <div className={styles['container']}>
                    <div className={styles['not-found']}>
                        <h1>Loading Projects...</h1>
                        <div className={styles['loader']}></div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const filteredProjects = projectsData.projects.filter(p => 
        p.categories.includes(activeCategory)
    );

    const formatTimelineDate = (dateRange) => {
        if (!dateRange) return 'Ongoing';
        if (typeof dateRange === 'string') return dateRange;
        
        const startYear = dateRange.start ? new Date(dateRange.start).getFullYear() : null;
        const endYear = dateRange.end ? new Date(dateRange.end).getFullYear() : null;
        
        if (startYear && endYear) {
            if (startYear === endYear) {
                return `${startYear}`;
            }
            return `${startYear} - ${endYear}`;
        } else if (startYear) {
            return `${startYear} - Ongoing`;
        }
        return 'Ongoing';
    };

    return (
        <>
            <NavbarRedesigned />
            <main className={styles['main-content']} style={{paddingTop: '100px', background: '#fcfdfc'}}>
                <div className={styles['container']}>
                    {/* Explorer Header */}
                    <div className={styles['explorer-header']}>
                        <h1>Project Portfolio</h1>
                        <div className={styles['category-buttons']}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`${styles['category-btn']} ${activeCategory === cat ? styles.active : ''}`}
                                    onClick={() => handleCategoryChange(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Explorer Body: Two Columns */}
                    <div className={styles['explorer-body']}>
                        {/* Column 1: Projects List */}
                        <aside className={styles['sidebar-list']}>
                            <div className={styles['sidebar-header']}>
                                <h3>{activeCategory} ({filteredProjects.length})</h3>
                            </div>
                            <div className={styles['items-container']}>
                                {filteredProjects.map(p => (
                                    <div 
                                        key={p.slug}
                                        className={`${styles['project-item']} ${activeProject.slug === p.slug ? styles.active : ''}`}
                                        onClick={() => setActiveProject(p)}
                                    >
                                        <div className={styles['item-info']}>
                                            <h4>{p.name}</h4>
                                            <div className={styles['item-meta']}>
                                                <span>{p.capacity}</span>
                                                <span>{p.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>

                        {/* Column 2: Selected Project Details */}
                        <section className={styles['detail-panel']}>
                            <div className={styles['detail-hero']}>
                                <img 
                                    src={activeProject.images && activeProject.images.length > 0 
                                        ? activeProject.images[activeImageIndex] 
                                        : activeProject.image_url} 
                                    alt={activeProject.name} 
                                />
                                <div className={styles['detail-overlay']}>
                                    <h2>{activeProject.name}</h2>
                                    <div className={styles['hero-meta']}>
                                        <span><i className="fas fa-bolt"></i> {activeProject.capacity}</span>
                                        <span><i className="fas fa-map-marker-alt"></i> {activeProject.location}</span>
                                    </div>
                                </div>
                            </div>

                            {activeProject.images && activeProject.images.length > 1 && (
                                <div className={styles['thumbnails-container']}>
                                    {activeProject.images.map((img, idx) => (
                                        <button 
                                            key={idx} 
                                            className={`${styles['thumbnail-btn']} ${activeImageIndex === idx ? styles['active-thumbnail'] : ''}`}
                                            onClick={() => setActiveImageIndex(idx)}
                                        >
                                            <img src={img} alt={`${activeProject.name} gallery ${idx + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className={styles['detail-inner-content']}>
                                <section className={styles['project-description']}>
                                    <h2>Detailed Description</h2>
                                    <p>{activeProject.description}</p>
                                </section>

                                {(activeProject.developer || activeProject.location || activeProject.capacity || activeProject.status || activeProject.cecInputs || activeProject.type || activeProject.technicalDetails?.headHeight || activeProject.technicalDetails?.discharge) && (
                                    <section className={styles['technical-section']} style={{marginTop: '40px'}}>
                                        <h2 className={styles['section-title']}>Technical Specifications</h2>
                                        <table className={styles['technical-info-table']}>
                                            <tbody>
                                                {activeProject.developer && (
                                                    <tr>
                                                        <th>Developer</th>
                                                        <td>{activeProject.developer}</td>
                                                    </tr>
                                                )}
                                                {activeProject.location && (
                                                    <tr>
                                                        <th>Location</th>
                                                        <td>{activeProject.location}</td>
                                                    </tr>
                                                )}
                                                {activeProject.capacity && (
                                                    <tr>
                                                        <th>Capacity</th>
                                                        <td>{activeProject.capacity}</td>
                                                    </tr>
                                                )}
                                                {activeProject.status && (
                                                    <tr>
                                                        <th>Status</th>
                                                        <td>{activeProject.status}</td>
                                                    </tr>
                                                )}
                                                {activeProject.cecInputs && (
                                                    <tr>
                                                        <th>CEC Role</th>
                                                        <td>{activeProject.cecInputs}</td>
                                                    </tr>
                                                )}
                                                {activeProject.type && (
                                                    <tr>
                                                        <th>Type</th>
                                                        <td>{activeProject.type}</td>
                                                    </tr>
                                                )}
                                                {activeProject.technicalDetails?.headHeight && (
                                                    <tr>
                                                        <th>Head</th>
                                                        <td>{activeProject.technicalDetails.headHeight}</td>
                                                    </tr>
                                                )}
                                                {activeProject.technicalDetails?.discharge && (
                                                    <tr>
                                                        <th>Discharge</th>
                                                        <td>{activeProject.technicalDetails.discharge}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </section>
                                )}

                                {activeProject.timeline && activeProject.timeline.length > 0 && (
                                    <section className={styles['timeline-section']} style={{marginTop: '40px'}}>
                                        <h2>Project Timeline</h2>
                                        <div className={styles['timeline']}>
                                            {activeProject.timeline.map((item, index) => (
                                                <div key={index} className={styles['timeline-item']}>
                                                    <div className={styles['timeline-marker']}></div>
                                                    <div className={styles['timeline-content']}>
                                                        {typeof item === 'string' ? (
                                                            <p>{item}</p>
                                                        ) : (
                                                            <div className={styles['timeline-content-split']}>
                                                                <span className={styles['timeline-date-range']}>{formatTimelineDate(item.dateRange)}</span>
                                                                <p className={styles['timeline-details']}>{item.details}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                <div className={styles['cta-section']}>
                                    <button 
                                        className={styles['contact-btn']}
                                        onClick={() => navigate('/#contact')}
                                    >
                                        Inquire About This Project
                                        <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ProjectDetail;
