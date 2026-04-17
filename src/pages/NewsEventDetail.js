import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './NewsEventDetail.module.css';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import newsJson from '../data/newsAndEvents.json';

const NewsEventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const sampleNewsEvents = newsJson.newsAndEvents;
    const item = sampleNewsEvents.find(item => item.id === parseInt(id));

    if (!item) {
        return (
            <>
                <NavbarRedesigned />
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
            <NavbarRedesigned />
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
