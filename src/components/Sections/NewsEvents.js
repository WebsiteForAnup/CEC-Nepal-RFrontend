import React, { useState, useEffect } from 'react';
import styles from './NewsEvents.module.css';

// Sample news and events data
const sampleNewsEvents = [
    {
        id: 1,
        type: 'news',
        title: 'CEC Nepal Completes Major Infrastructure Project',
        date: '2026-01-28',
        description: 'CEC Nepal successfully delivered the final phase of the hydroelectric project, setting new industry standards for engineering excellence and sustainable development.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=500&q=60',
        link: '#'
    },
    {
        id: 2,
        type: 'event',
        title: 'Industry Seminar: Future of Renewable Energy',
        date: '2026-02-15',
        description: 'Join us for an exclusive seminar featuring industry experts discussing the latest trends in renewable energy and sustainable engineering solutions.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60',
        link: '#'
    },
    {
        id: 3,
        type: 'news',
        title: 'CEC Nepal Receives International Engineering Award',
        date: '2026-01-20',
        description: 'Our innovative approach to sustainable infrastructure development has been recognized with the prestigious International Engineering Excellence Award 2026.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60',
        link: '#'
    },
    {
        id: 4,
        type: 'event',
        title: 'Career Development Workshop',
        date: '2026-02-20',
        description: 'Enhance your career prospects with our comprehensive workshop on professional development, leadership, and technical skills in the engineering sector.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60',
        link: '#'
    },
    {
        id: 5,
        type: 'news',
        title: 'Expansion Announcement: New Office in Pokhara',
        date: '2026-01-15',
        description: 'CEC Nepal announces the opening of a new regional office in Pokhara to better serve clients and expand our engineering services across Nepal.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=60',
        link: '#'
    },
    {
        id: 6,
        type: 'event',
        title: 'Community Outreach: Engineering for Change',
        date: '2026-03-05',
        description: 'Participate in our community outreach program dedicated to bringing sustainable engineering solutions to underserved communities in Nepal.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=60',
        link: '#'
    }
];

const NewsEvents = () => {
    const [displayedItems, setDisplayedItems] = useState(4);
    const [filter, setFilter] = useState('all');

    // Filter items based on selected type
    const filteredItems = filter === 'all' 
        ? sampleNewsEvents 
        : sampleNewsEvents.filter(item => item.type === filter);

    // Get items to display
    const visibleItems = filteredItems.slice(0, displayedItems);

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Calculate days until event
    const getDaysUntilEvent = (dateString) => {
        const today = new Date();
        const eventDate = new Date(dateString);
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <section className={styles['news-events']} id="news-events">
            <div className="container">
                {/* Section Header */}
                <div className={styles['section-header']}>
                    <span className={styles['section-subtitle']}>Stay Informed</span>
                    <h2 className={styles['section-title']}>News & Events</h2>
                    <p className={styles['section-description']}>
                        Latest updates from CEC Nepal and upcoming events featuring industry insights and community engagement.
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className={styles['filter-buttons']}>
                    <button 
                        className={`${styles['filter-btn']} ${filter === 'all' ? styles['active'] : ''}`}
                        onClick={() => {
                            setFilter('all');
                            setDisplayedItems(4);
                        }}
                    >
                        All
                    </button>
                    <button 
                        className={`${styles['filter-btn']} ${filter === 'news' ? styles['active'] : ''}`}
                        onClick={() => {
                            setFilter('news');
                            setDisplayedItems(4);
                        }}
                    >
                        News
                    </button>
                    <button 
                        className={`${styles['filter-btn']} ${filter === 'event' ? styles['active'] : ''}`}
                        onClick={() => {
                            setFilter('event');
                            setDisplayedItems(4);
                        }}
                    >
                        Events
                    </button>
                </div>

                {/* News & Events Grid */}
                <div className={styles['news-grid']}>
                    {visibleItems.map((item) => (
                        <div key={item.id} className={styles['news-card']}>
                            {/* Card Image */}
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

                            {/* Card Content */}
                            <div className={styles['card-content']}>
                                {/* Date */}
                                <div className={styles['card-date']}>
                                    <i className="fas fa-calendar"></i>
                                    <span>{formatDate(item.date)}</span>
                                </div>

                                {/* Title */}
                                <h3 className={styles['card-title']}>
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className={styles['card-description']}>
                                    {item.description}
                                </p>

                                {/* Read More Link */}
                                <a href={item.link} className={styles['read-more']}>
                                    <span>Read More</span>
                                    <i className="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Show More Button */}
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

                {/* See All Button */}
                <div className={styles['see-all-container']}>
                    <a href="#" className={styles['see-all-btn']}>
                        See All News & Events
                        <i className="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default NewsEvents;
