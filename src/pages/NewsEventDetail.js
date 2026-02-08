import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './NewsEventDetail.module.css';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

// Sample news and events data
const sampleNewsEvents = [
    {
        id: 1,
        type: 'news',
        title: 'CEC Nepal Completes Major Infrastructure Project',
        date: '2026-01-28',
        description: 'CEC Nepal successfully delivered the final phase of the hydroelectric project, setting new industry standards for engineering excellence and sustainable development.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=500&q=60',
        category: 'Project Update',
        author: 'CEC Nepal Team',
        content: `CEC Nepal is proud to announce the successful completion of the major infrastructure project. This milestone represents years of dedicated work, innovative engineering solutions, and commitment to sustainable development.

The project involved multiple phases and complex engineering challenges that were overcome through our team's expertise and dedication. We implemented cutting-edge technologies and best practices in hydroelectric project development.

Key achievements include:
- 150 MW hydroelectric capacity
- Sustainable power generation for 500,000 households
- Environmental impact mitigation strategies
- Community engagement and support
- International standard compliance

This project demonstrates CEC Nepal's capability to deliver world-class infrastructure solutions that meet both technical and environmental standards. We remain committed to advancing Nepal's energy sector while maintaining our high standards of engineering excellence.`,
        relatedNews: [2, 3],
        location: 'Eastern Nepal',
        status: 'Completed'
    },
    {
        id: 2,
        type: 'event',
        title: 'Industry Seminar: Future of Renewable Energy',
        date: '2026-02-15',
        description: 'Join us for an exclusive seminar featuring industry experts discussing the latest trends in renewable energy and sustainable engineering solutions.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60',
        category: 'Workshop',
        author: 'CEC Events',
        content: `CEC Nepal invites you to attend our Industry Seminar on the Future of Renewable Energy. This is a unique opportunity to gain insights from leading experts in the renewable energy sector.

Event Details:
- Date: February 15, 2026
- Time: 9:00 AM - 5:00 PM
- Location: CEC Nepal Headquarters, Kathmandu
- Duration: Full Day

Topics Covered:
- Latest trends in hydropower development
- Solar and wind energy integration
- Smart grid technologies
- Environmental sustainability practices
- Financing and investment opportunities

Speakers include:
- International hydropower consultants
- Government regulatory officials
- Project developers and investors
- Academic researchers

This seminar is an excellent platform for networking, learning, and exploring collaboration opportunities in the renewable energy sector.`,
        location: 'Kathmandu',
        capacity: '200 participants',
        registration: 'Available on website',
        relatedNews: [3, 4]
    },
    {
        id: 3,
        type: 'news',
        title: 'CEC Nepal Receives International Engineering Award',
        date: '2026-01-20',
        description: 'Our innovative approach to sustainable infrastructure development has been recognized with the prestigious International Engineering Excellence Award 2026.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60',
        category: 'Recognition',
        author: 'CEC Nepal',
        content: `CEC Nepal has been honored with the prestigious International Engineering Excellence Award 2026, recognizing our outstanding contributions to sustainable infrastructure development.

This award acknowledges:
- Excellence in engineering design and implementation
- Commitment to environmental sustainability
- Innovation in renewable energy solutions
- Professional ethics and integrity
- Community impact and social responsibility

The award was presented at the International Engineering Conference in recognition of our work on multiple hydroelectric projects and our commitment to advancing Nepal's energy infrastructure.

Awards and recognition are a testament to our team's dedication, expertise, and unwavering commitment to excellence. As we continue to grow, we remain committed to delivering world-class engineering solutions that benefit society and the environment.`,
        location: 'International',
        awardName: 'International Engineering Excellence Award 2026',
        relatedNews: [1, 4]
    },
    {
        id: 4,
        type: 'event',
        title: 'Career Development Workshop',
        date: '2026-02-20',
        description: 'Enhance your career prospects with our comprehensive workshop on professional development, leadership, and technical skills in the engineering sector.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60',
        category: 'Workshop',
        author: 'HR Department',
        content: `Join CEC Nepal for an intensive Career Development Workshop designed to enhance your professional skills and advance your career in the engineering sector.

Workshop Agenda:
- Module 1: Leadership and Management Skills
- Module 2: Technical Excellence and Innovation
- Module 3: Project Management Best Practices
- Module 4: Communication and Professional Development
- Module 5: Networking and Career Advancement

Benefits:
- Learn from industry experts
- Develop practical skills
- Network with professionals
- Receive certification
- Explore career advancement opportunities

This workshop is open to engineers, project managers, and professionals looking to advance their careers in the renewable energy and infrastructure sectors.`,
        location: 'Kathmandu',
        trainer: 'Expert Consultants',
        capacity: '50 participants',
        relatedNews: [2]
    },
    {
        id: 5,
        type: 'news',
        title: 'Expansion Announcement: New Office in Pokhara',
        date: '2026-01-15',
        description: 'CEC Nepal announces the opening of a new regional office in Pokhara to better serve clients and expand our engineering services across Nepal.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=60',
        category: 'Company News',
        author: 'Management',
        content: `CEC Nepal is excited to announce the opening of a new regional office in Pokhara, expanding our presence and services across Nepal.

This expansion marks a significant milestone in our growth strategy and demonstrates our commitment to serving clients throughout the country.

New Office Details:
- Location: Pokhara Metropolitan Area
- Services: Engineering consultation, project management, feasibility studies
- Team: Experienced professionals with local expertise
- Opening: Q2 2026

Benefits of the Pokhara Office:
- Closer proximity to clients in Western Nepal
- Enhanced service delivery
- Local employment opportunities
- Support for regional development projects
- Strengthened relationships with local stakeholders

This expansion will enable us to better serve our growing client base and contribute to infrastructure development in Western Nepal.`,
        location: 'Pokhara',
        team: 'To be announced',
        relatedNews: [1, 5]
    },
    {
        id: 6,
        type: 'event',
        title: 'Community Outreach: Engineering for Change',
        date: '2026-03-05',
        description: 'Participate in our community outreach program dedicated to bringing sustainable engineering solutions to underserved communities in Nepal.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60',
        category: 'Community',
        author: 'Social Responsibility Team',
        content: `CEC Nepal's Community Outreach Program - Engineering for Change aims to bring sustainable engineering solutions to underserved communities across Nepal.

Program Overview:
- Provide technical expertise and resources
- Implement sustainable water and energy solutions
- Build local capacity through training
- Support community development initiatives
- Create lasting positive impact

Target Communities:
- Remote rural areas
- Underserved municipalities
- Communities affected by resource scarcity
- Youth development programs

How to Participate:
- Volunteer opportunities for professionals
- Community engagement
- Partnership opportunities
- Sponsorship possibilities

Through this program, we aim to leverage our engineering expertise to create positive change and contribute to sustainable development in Nepal's communities.`,
        location: 'Multiple Locations',
        coordinator: 'CSR Department',
        relatedNews: [1, 3]
    }
];

const NewsEventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const item = sampleNewsEvents.find(item => item.id === parseInt(id));

    if (!item) {
        return (
            <>
                <Navbar />
                <div className={styles['container']}>
                    <div className={styles['not-found']}>
                        <h1>News or Event Not Found</h1>
                        <p>The page you're looking for doesn't exist.</p>
                        <button onClick={() => navigate('/')} className={styles['back-btn']}>
                            Back to Home
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const relatedItems = sampleNewsEvents.filter(
        news => item.relatedNews && item.relatedNews.includes(news.id)
    );

    return (
        <>
            <Navbar />
            <main className={styles['main-content']}>
                <div className={styles['container']}>
                    {/* Breadcrumb */}
                    <nav className={styles['breadcrumb']}>
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/#news-events">News & Events</Link>
                        <span>/</span>
                        <span>{item.title}</span>
                    </nav>

                    {/* Detail Content */}
                    <article className={styles['detail-content']}>
                        {/* Hero Image */}
                        <div className={styles['hero-image']}>
                            <img src={item.image} alt={item.title} />
                            <div className={styles['badge-container']}>
                                <span className={`${styles['badge']} ${styles[item.type]}`}>
                                    {item.type === 'news' ? 'News' : 'Event'}
                                </span>
                            </div>
                        </div>

                        {/* Article Header */}
                        <div className={styles['article-header']}>
                            <h1 className={styles['title']}>{item.title}</h1>
                            
                            {/* Meta Information */}
                            <div className={styles['meta-info']}>
                                <div className={styles['meta-item']}>
                                    <i className="fas fa-calendar"></i>
                                    <span>{formatDate(item.date)}</span>
                                </div>
                                <div className={styles['meta-item']}>
                                    <i className="fas fa-user"></i>
                                    <span>{item.author}</span>
                                </div>
                                <div className={styles['meta-item']}>
                                    <i className="fas fa-tag"></i>
                                    <span>{item.category}</span>
                                </div>
                                {item.type === 'event' && (
                                    <div className={styles['meta-item']}>
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span>{item.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Details for Events */}
                        {item.type === 'event' && (
                            <div className={styles['event-details']}>
                                <div className={styles['detail-box']}>
                                    <h3>Event Details</h3>
                                    <div className={styles['detail-grid']}>
                                        <div className={styles['detail-item']}>
                                            <strong>Date & Time:</strong>
                                            <p>{formatDate(item.date)}</p>
                                        </div>
                                        <div className={styles['detail-item']}>
                                            <strong>Location:</strong>
                                            <p>{item.location}</p>
                                        </div>
                                        {item.capacity && (
                                            <div className={styles['detail-item']}>
                                                <strong>Capacity:</strong>
                                                <p>{item.capacity}</p>
                                            </div>
                                        )}
                                        {item.registration && (
                                            <div className={styles['detail-item']}>
                                                <strong>Registration:</strong>
                                                <p>{item.registration}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Article Content */}
                        <div className={styles['article-body']}>
                            {item.content.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>

                        {/* CTA Button for Events */}
                        {item.type === 'event' && (
                            <div className={styles['cta-section']}>
                                <button className={styles['register-btn']}>
                                    Register Now
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        )}
                    </article>

                    {/* Sidebar */}
                    <aside className={styles['sidebar']}>
                        {/* Related Articles */}
                        {relatedItems.length > 0 && (
                            <div className={styles['related-section']}>
                                <h3>Related {item.type === 'news' ? 'News' : 'Events'}</h3>
                                <div className={styles['related-list']}>
                                    {relatedItems.map(relatedItem => (
                                        <Link 
                                            key={relatedItem.id}
                                            to={`/news-event/${relatedItem.id}`}
                                            className={styles['related-item']}
                                        >
                                            <img src={relatedItem.image} alt={relatedItem.title} />
                                            <div className={styles['related-content']}>
                                                <h4>{relatedItem.title}</h4>
                                                <span className={styles['related-date']}>
                                                    {formatDate(relatedItem.date)}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Share Section */}
                        <div className={styles['share-section']}>
                            <h3>Share</h3>
                            <div className={styles['share-buttons']}>
                                <button className={styles['share-btn']} title="Share on Facebook" onClick={() => {/* Share on Facebook */}}>
                                    <i className="fab fa-facebook-f"></i>
                                </button>
                                <button className={styles['share-btn']} title="Share on Twitter" onClick={() => {/* Share on Twitter */}}>
                                    <i className="fab fa-twitter"></i>
                                </button>
                                <button className={styles['share-btn']} title="Share on LinkedIn" onClick={() => {/* Share on LinkedIn */}}>
                                    <i className="fab fa-linkedin-in"></i>
                                </button>
                                <button className={styles['share-btn']} title="Share via Email" onClick={() => {/* Share via Email */}}>
                                    <i className="fas fa-envelope"></i>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default NewsEventDetail;
