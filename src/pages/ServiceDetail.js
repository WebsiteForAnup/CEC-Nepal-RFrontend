import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './ServiceDetail.module.css';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import servicesJson from '../data/services.json';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const servicesData = servicesJson.services;
    const service = servicesData.find(s => s.id === parseInt(id));

    if (!service) {
        return (
            <>
                <NavbarRedesigned />
                <div className={styles['container']}>
                    <div className={styles['not-found']}>
                        <h1>Service Not Found</h1>
                        <p>The service you're looking for doesn't exist.</p>
                        <button onClick={() => navigate('/#services')} className={styles['back-btn']}>
                            Back to Services
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const otherServices = servicesData.filter(s => s.id !== service.id).slice(0, 3);

    return (
        <>
            <NavbarRedesigned />
            <main className={styles['main-content']}>
                <div className={styles['container']}>
                    {/* Breadcrumb */}
                    <nav className={styles['breadcrumb']}>
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/#services">Services</Link>
                        <span>/</span>
                        <span>{service.title}</span>
                    </nav>

                    {/* Hero Section */}
                    <div className={styles['hero-section']}>
                        <img src={service.image} alt={service.title} />
                        <div className={styles['hero-overlay']}>
                            <div className={styles['hero-content']}>
                                <i className={`${service.icon} ${styles['hero-icon']}`}></i>
                                <h1>{service.title}</h1>
                                <p className={styles['hero-description']}>{service.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles['content-wrapper']}>
                        {/* Main Content */}
                        <article className={styles['detail-content']}>
                            <div className={styles['service-body']}>
                                {service.fullDescription.split('\n\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>

                            {/* Benefits Section */}
                            <div className={styles['benefits-section']}>
                                <h2>Key Benefits</h2>
                                <div className={styles['benefits-grid']}>
                                    {service.benefits.map((benefit, index) => (
                                        <div key={index} className={styles['benefit-card']}>
                                            <i className="fas fa-check-circle"></i>
                                            <p>{benefit}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Process Section */}
                            <div className={styles['process-section']}>
                                <h2>Our Process</h2>
                                <div className={styles['process-timeline']}>
                                    {service.process.map((step, index) => (
                                        <div key={index} className={styles['process-step']}>
                                            <div className={styles['step-number']}>{index + 1}</div>
                                            <div className={styles['step-content']}>
                                                <h3>{step}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Section */}
                            <div className={styles['cta-section']}>
                                <h2>Ready to Get Started?</h2>
                                <p>Contact our team to discuss your project requirements</p>
                                <button 
                                    className={styles['contact-btn']}
                                    onClick={() => navigate('/#contact')}
                                >
                                    Get in Touch
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className={styles['sidebar']}>
                            {/* Service Overview Card */}
                            <div className={styles['overview-card']}>
                                <h3>Service Overview</h3>
                                <div className={styles['overview-item']}>
                                    <strong>Category:</strong>
                                    <span>{service.category}</span>
                                </div>
                                <div className={styles['overview-item']}>
                                    <strong>Experience:</strong>
                                    <span>15+ Years</span>
                                </div>
                                <div className={styles['overview-item']}>
                                    <strong>Projects:</strong>
                                    <span>50+ Completed</span>
                                </div>
                            </div>

                            {/* Other Services */}
                            {otherServices.length > 0 && (
                                <div className={styles['related-services']}>
                                    <h3>Other Services</h3>
                                    <div className={styles['services-list']}>
                                        {otherServices.map(s => (
                                            <Link 
                                                key={s.id}
                                                to={`/service/${s.id}`}
                                                className={styles['service-link']}
                                            >
                                                <i className={s.icon}></i>
                                                <span>{s.title}</span>
                                                <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contact Card */}
                            <div className={styles['contact-card']}>
                                <h3>Need Help?</h3>
                                <p>Our team is ready to assist you with all your service needs.</p>
                                <button 
                                    className={styles['contact-btn-small']}
                                    onClick={() => navigate('/#contact')}
                                >
                                    Contact Us
                                </button>
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
