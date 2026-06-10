import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import newsData from '../data/collections/news-events/feed.json';
import styles from './NewsIndex.module.css';

const NewsIndex = () => {
  const navigate = useNavigate();
  const allNewsAndEvents = newsData.newsAndEvents || [];
  const newsAndEvents = process.env.NODE_ENV === 'production'
    ? allNewsAndEvents.filter(item => !item.isDemo)
    : allNewsAndEvents;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    document.title = 'News & Events | CEC Nepal';
    window.scrollTo(0, 0);
  }, []);

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

  // Filter items based on type filter and search query
  const filteredItems = newsAndEvents.filter((item) => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <>
      <NavbarRedesigned />
      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <div className={styles.breadcrumbs}>
                <Link to="/">Home</Link>
                <span className={styles.separator}>/</span>
                <span className={styles.activeBreadcrumb}>News & Events</span>
              </div>
              <h1 className={styles.heroTitle}>News & Events</h1>
              <p className={styles.heroSubtitle}>
                Stay informed with the latest updates, announcements, and upcoming industry events from CEC Nepal.
              </p>
            </div>
          </div>
        </section>

        {/* Filter and Search Section */}
        <section className={styles.controlsSection}>
          <div className={styles.container}>
            <div className={styles.controlsGrid}>
              {/* Type Filter Buttons */}
              <div className={styles.filterGroup}>
                {['all', 'news', 'event'].map((type) => (
                  <button
                    key={type}
                    className={`${styles.filterBtn} ${selectedType === type ? styles.activeFilter : ''}`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + (type === 'event' ? 's' : '')}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className={styles.searchWrapper}>
                <i className={`fas fa-search ${styles.searchIcon}`}></i>
                <input
                  type="text"
                  placeholder="Search news & events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button className={styles.clearSearchBtn} onClick={() => setSearchTerm('')} aria-label="Clear search">
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Grid Results Section */}
        <section className={styles.gridSection}>
          <div className={styles.container}>
            {filteredItems.length > 0 ? (
              <div className={styles.newsGrid}>
                {filteredItems.map((item) => (
                  <article 
                    key={item.id} 
                    className={styles.newsCard}
                    onClick={() => navigate(`/news-event/${item.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.cardImageContainer}>
                      <img src={item.image} alt={item.title} className={styles.cardImage} />
                      <div className={styles.badgeOverlay}>
                        <span className={`${styles.badge} ${styles[item.type]}`}>
                          {item.type === 'event' ? 'Event' : 'News'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardDate}>
                          <i className="fas fa-calendar-alt"></i> {formatDate(item.date)}
                        </span>
                        {item.type === 'event' && (
                          <span className={styles.daysBadge}>
                            {getDaysUntilEvent(item.date) > 0 ? (
                              `In ${getDaysUntilEvent(item.date)} days`
                            ) : (
                              'Passed'
                            )}
                          </span>
                        )}
                      </div>
                      <h3 
                        className={styles.cardTitle}
                        onClick={(e) => e.stopPropagation()} // Prevent double navigation when clicking title
                      >
                        <Link to={`/news-event/${item.id}`}>{item.title}</Link>
                      </h3>
                      <p className={styles.cardExcerpt}>
                        {item.description || (item.content && item.content.substring(0, 120) + '...')}
                      </p>
                      <span className={styles.readMoreLink}>
                        <span>Read More</span>
                        <i className="fas fa-arrow-right"></i>
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <i className="fas fa-search-minus"></i>
                <h2>No articles found</h2>
                <p>We couldn't find any news or events matching "{searchTerm}". Please try a different query.</p>
                <button 
                  className={styles.resetBtn} 
                  onClick={() => { setSearchTerm(''); setSelectedType('all'); }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default NewsIndex;
