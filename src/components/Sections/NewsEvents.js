import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NewsEvents.module.css';

const NewsEvents = ({ newsAndEvents = [] }) => {
    const [displayedItems, setDisplayedItems] = useState(4);
    const [filter, setFilter] = useState('all');

    const filteredItems = filter === 'all'
        ? newsAndEvents
        : newsAndEvents.filter(item => item.type === filter);

    const visibleItems = filteredItems.slice(0, displayedItems);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getDaysUntilEvent = (dateString) => {
        const today = new Date();
        const eventDate = new Date(dateString);
        const diffTime = eventDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <section className={styles['news-events']} id="news-events">
            <div className="container">
                {/* Section Header */}
                <div className={styles['section-header']}>
                    <span className={styles['section-subtitle']}>Stay Informed</span>
                    <h2 className={styles['section-title']}>News &amp; Events</h2>
                    <p className={styles['section-description']}>
                        Latest updates from CEC Nepal and upcoming events featuring industry insights and community engagement.
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className={styles['filter-buttons']}>
                    {['all', 'news', 'event'].map(type => (
                        <button
                            key={type}
                            className={`${styles['filter-btn']} ${filter === type ? styles['active'] : ''}`}
                            onClick={() => { setFilter(type); setDisplayedItems(4); }}
                        >
                            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + (type === 'event' ? 's' : '')}
                        </button>
                    ))}
                </div>

                {/* News & Events Grid */}
                <div className={styles['news-grid']}>
                    {visibleItems.map((item) => (
                        <div key={item.id} className={styles['news-card']}>
                            <div className={styles['card-image']}>
                                <img src={item.image} alt={item.title} />
                                <div className={styles['card-badge']}>
                                    <span className={`${styles['badge']} ${styles[item.type]}`}>
                                        {item.type === 'event'
                                            ? `In ${getDaysUntilEvent(item.date)} days`
                                            : 'News'}
                                    </span>
                                </div>
                            </div>
                            <div className={styles['card-content']}>
                                <div className={styles['card-date']}>
                                    <i className="fas fa-calendar"></i>
                                    <span>{formatDate(item.date)}</span>
                                </div>
                                <h3 className={styles['card-title']}>{item.title}</h3>
                                <p className={styles['card-description']}>
                                    {item.excerpt || item.description}
                                </p>
                                <Link to={`/news-event/${item.id}`} className={styles['read-more']}>
                                    <span>Read More</span>
                                    <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                {visibleItems.length < filteredItems.length && (
                    <div className={styles['load-more-container']}>
                        <button
                            className={styles['load-more-btn']}
                            onClick={() => setDisplayedItems(displayedItems + 3)}
                        >
                            Load More
                        </button>
                    </div>
                )}

                {/* See All */}
                <div className={styles['see-all-container']}>
                    <button className={styles['see-all-btn']} onClick={() => window.location.href = '/#news-events'}>
                        See All News &amp; Events
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NewsEvents;
