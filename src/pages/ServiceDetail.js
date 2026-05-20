import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './ServiceDetail.module.css';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadService = async () => {
            setLoading(true);
            setError(false);
            try {
                // Dynamic import for Webpack/Vite
                const data = await import(`../data/collections/services/${id}.json`);
                setService(data.default || data);
            } catch (err) {
                console.error("Failed to load service", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        loadService();
    }, [id]);

    if (loading) {
        return (
            <>
                <NavbarRedesigned />
                <div className={styles['container']} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p>Loading...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !service) {
        return (
            <>
                <NavbarRedesigned />
                <div className={styles['container']}>
                    <div className={styles['not-found']}>
                        <h1>Service Not Found</h1>
                        <p>The engineering service you're looking for doesn't exist or is currently unavailable.</p>
                        <button onClick={() => navigate('/#services')} className={styles['back-btn']}>
                            Back to Services
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <NavbarRedesigned />
            <main className={styles['main-content']}>
                {/* 1. Header & Hero Section */}
                <div className={styles['hero-section']}>
                    <img src={service.image} alt={service.title} className={styles['hero-bg']} />
                    <div className={styles['hero-overlay']}>
                        <div className={styles['hero-content-wrapper']}>
                            <div className={styles['breadcrumb']}>
                                <Link to="/">Home</Link>
                                <span>/</span>
                                <Link to="/#services">Services</Link>
                                <span>/</span>
                                <span className={styles['breadcrumb-current']}>{service.title}</span>
                            </div>
                            <div className={styles['hero-text']}>
                                <h1>{service.title}</h1>
                                <p className={styles['hero-subheadline']}>{service.subheadline}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles['container']}>
                    <div className={styles['page-layout']}>
                        <article className={styles['detail-content']}>
                            
                            {/* 2. The Core Problem & Solution */}
                            <section className={styles['section-block']}>
                                <h2>The Challenge & Our Approach</h2>
                                <div className={styles['problem-solution-box']}>
                                    <div className={styles['problem-box']}>
                                        <h3><i className="fas fa-exclamation-triangle"></i> The Pain Point</h3>
                                        <p>{service.painPoints}</p>
                                    </div>
                                    <div className={styles['solution-box']}>
                                        <h3><i className="fas fa-lightbulb"></i> Our Solution</h3>
                                        <p>{service.approach}</p>
                                    </div>
                                </div>
                            </section>

                            {/* 3. Scope of Capabilities */}
                            <section className={styles['section-block']}>
                                <h2>Scope of Capabilities</h2>
                                <p className={styles['section-intro']}>We provide a comprehensive suite of {service.title.toLowerCase()} tailored to complex engineering requirements:</p>
                                <div className={styles['capabilities-grid']}>
                                    {service.capabilities && service.capabilities.map((cap, index) => (
                                        <div key={index} className={styles['capability-card']}>
                                            <i className="fas fa-check-circle"></i>
                                            <span>{cap}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* 4. Technical Specifications & Software Proficiency */}
                            <section className={styles['section-block']}>
                                <h2>Technical & Software Proficiency</h2>
                                <p className={styles['section-intro']}>Our engineers utilize industry-standard software and adhere to strict compliance codes.</p>
                                <div className={styles['tech-stack-flex']}>
                                    {service.techStack && service.techStack.map((tech, index) => (
                                        <span key={index} className={styles['tech-badge']}>{tech}</span>
                                    ))}
                                </div>
                            </section>

                            {/* 5. The Process: "How We Work" */}
                            <section className={styles['section-block']}>
                                <h2>Project Methodology</h2>
                                <div className={styles['process-timeline']}>
                                    {service.process && service.process.map((step, index) => (
                                        <div key={index} className={styles['process-step']}>
                                            <div className={styles['step-number']}>0{index + 1}</div>
                                            <div className={styles['step-content']}>
                                                <h4>Phase {index + 1}</h4>
                                                <p>{step}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* 6. Social Proof & Case Studies */}
                            <section className={styles['section-block']}>
                                <h2>Proven Track Record</h2>
                                <div className={styles['proof-grid']}>
                                    {service.caseStudy && (
                                        <div className={styles['case-study-card']}>
                                            <span className={styles['card-label']}>Featured Case Study</span>
                                            <h3>{service.caseStudy.title}</h3>
                                            <div className={styles['metric-highlight']}>
                                                <i className="fas fa-chart-line"></i>
                                                <span>{service.caseStudy.metric}</span>
                                            </div>
                                            <p>{service.caseStudy.description}</p>
                                        </div>
                                    )}
                                    {service.testimonial && (
                                        <div className={styles['testimonial-card']}>
                                            <i className="fas fa-quote-left"></i>
                                            <p className={styles['quote']}>"{service.testimonial.quote}"</p>
                                            <div className={styles['author-info']}>
                                                <strong>{service.testimonial.author}</strong>
                                                <span>{service.testimonial.title}, {service.testimonial.company}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                            
                        </article>

                        {/* Sidebar */}
                        <aside className={styles['sidebar']}>
                            <div className={styles['sidebar-card']}>
                                <h3>Technical Consultation</h3>
                                <p>Speak directly with a Lead Engineer to discuss specifications, timelines, and technical requirements.</p>
                                <button className={styles['sidebar-btn']} onClick={() => navigate('/#contact')}>
                                    Schedule a Review
                                </button>
                            </div>
                            
                            <div className={styles['sidebar-card']}>
                                <h3>Trust & Compliance</h3>
                                <div className={styles['trust-seals']}>
                                    <div className={styles['seal']}><i className="fas fa-certificate"></i> ISO 9001:2015</div>
                                    <div className={styles['seal']}><i className="fas fa-shield-alt"></i> NEC Registered</div>
                                    <div className={styles['seal']}><i className="fas fa-globe"></i> FIDIC Compliant</div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ServiceDetail;
