import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './ProjectDetail.module.css';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import projectsData from '../data/projects.json';

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

    // Initial load and URL synchronization
    useEffect(() => {
        const allProjects = projectsData.projects;
        
        if (id) {
            const project = allProjects.find(p => p.id === parseInt(id));
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
                                        key={p.id}
                                        className={`${styles['project-item']} ${activeProject.id === p.id ? styles.active : ''}`}
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
                                <img src={activeProject.image_url} alt={activeProject.name} />
                                <div className={styles['detail-overlay']}>
                                    <h2>{activeProject.name}</h2>
                                    <div className={styles['hero-meta']}>
                                        <span><i className="fas fa-bolt"></i> {activeProject.capacity}</span>
                                        <span><i className="fas fa-map-marker-alt"></i> {activeProject.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles['detail-inner-content']}>
                                <div className={styles['info-grid']}>
                                    <div className={styles['info-box']}>
                                        <strong>Developer</strong>
                                        <span>{activeProject.developer}</span>
                                    </div>
                                    <div className={styles['info-box']}>
                                        <strong>Status</strong>
                                        <span>{activeProject.status}</span>
                                    </div>
                                    <div className={styles['info-box']}>
                                        <strong>CEC Role</strong>
                                        <span>{activeProject.cecInputs}</span>
                                    </div>
                                </div>

                                <section className={styles['project-description']}>
                                    <h2>Detailed Description</h2>
                                    <p>{activeProject.description}</p>
                                </section>

                                <div className={styles['info-grid']} style={{marginTop: '30px'}}>
                                    <div className={styles['info-box']}>
                                        <strong>Location</strong>
                                        <span>{activeProject.location}</span>
                                    </div>
                                    <div className={styles['info-box']}>
                                        <strong>Capacity</strong>
                                        <span>{activeProject.capacity}</span>
                                    </div>
                                    <div className={styles['info-box']}>
                                        <strong>Type</strong>
                                        <span>{activeProject.type}</span>
                                    </div>
                                </div>

                                {activeProject.technicalDetails && (
                                    <section className={styles['technical-section']}>
                                        <h2>Technical Data</h2>
                                        <div className={styles['specs-grid']}>
                                            <div className={styles['spec-item']}>
                                                <i className="fas fa-ruler-vertical"></i>
                                                <div>
                                                    <strong>Head</strong>
                                                    <span>{activeProject.technicalDetails.headHeight}</span>
                                                </div>
                                            </div>
                                            <div className={styles['spec-item']}>
                                                <i className="fas fa-water"></i>
                                                <div>
                                                    <strong>Discharge</strong>
                                                    <span>{activeProject.technicalDetails.discharge}</span>
                                                </div>
                                            </div>
                                        </div>
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
                                                        <p>{item}</p>
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
