import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavbarRedesigned from '../../components/Layout/Navbar.redesigned';
import Footer from '../../components/Layout/Footer';
import { newsDbService, NewsEventItem } from '../../services/newsDbService';
import { authClient } from '../../lib/auth';
import styles from './ListEvents.module.css';

const ListEvents: React.FC = () => {
  const navigate = useNavigate();
  const session = authClient.useSession();
  
  // States
  const [items, setItems] = useState<NewsEventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch Events
  const loadItems = () => {
    setLoading(true);
    newsDbService.getNewsAndEvents()
      .then((data) => {
        // Filter only event type
        const eventsOnly = data.filter(item => item.type === 'event');
        setItems(eventsOnly);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load events', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Delete Event
  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await newsDbService.deleteNewsAndEvent(id);
        loadItems();
      } catch (err) {
        console.error('Failed to delete event', err);
        alert('Failed to delete event');
      }
    }
  };

  // Filter & Search Events
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Render Session Loading
  if (session.isPending) {
    return (
      <div className={styles.centeredPage}>
        <div className={styles.spinner} />
        <p>Loading security session...</p>
      </div>
    );
  }

  // Render Unauthorized
  if (!session.data) {
    return (
      <>
        <NavbarRedesigned />
        <div className={styles.centeredPage}>
          <div className={styles.glassCard}>
            <div className={styles.warningIcon}>
              <i className="fas fa-lock"></i>
            </div>
            <h2 className={styles.cardTitle}>Admin Access Required</h2>
            <p className={styles.cardText}>
              Please sign in to manage events. Authenticated actions are secured by database policy.
            </p>
            <div className={styles.actionRow}>
              <Link to="/auth/sign-in" className={styles.primaryBtn}>
                Sign In
              </Link>
              <Link to="/" className={styles.secondaryBtn}>
                Back to Site
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavbarRedesigned />
      <div className={styles.adminContainer}>
        {/* Admin Header */}
        <div className={styles.adminHeader}>
          <div>
            <span className={styles.badge}>Security Session Active</span>
            <h1 className={styles.mainTitle}>Events Manager</h1>
            <p className={styles.subtitle}>
              Signed in as <span className={styles.userEmail}>{session.data.user.email}</span>. Manage upcoming events populated in the database.
            </p>
          </div>
          <Link to="/admin/events/create" className={styles.createBtn} style={{ textDecoration: 'none' }}>
            <i className="fas fa-plus"></i> Add Event
          </Link>
        </div>

        {/* Dashboard Controls */}
        <div className={styles.controlsBar}>
          <div className={styles.tabGroup}>
            <button className={styles.tabBtn} onClick={() => navigate('/admin/news')}>News Articles</button>
            <button className={`${styles.tabBtn} ${styles.activeTab}`}>Upcoming Events</button>
          </div>
          <div className={styles.searchBox}>
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by event title, location, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Database List / Table */}
        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.tableSpinner}>
              <div className={styles.spinner} />
              <p>Fetching database records...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fas fa-calendar-alt"></i>
              <h3>No events found</h3>
              <p>Try refining your search or add a new event to populate the database.</p>
            </div>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Event Title & Category</th>
                    <th>Event Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className={styles.locationBadge}>
                          <i className="fas fa-map-marker-alt"></i> {item.location || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.titleCol}>
                          <span className={styles.tableTitle}>{item.title}</span>
                          <span className={styles.tableCategory}>{item.category || 'General'}</span>
                        </div>
                      </td>
                      <td>{item.date}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${item.status === 'Completed' ? styles.statusCompleted : styles.statusOpen}`}>
                          {item.status || 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.btnGroup}>
                          <button
                            onClick={() => navigate(`/admin/events/edit/${item.id}`)}
                            className={styles.editBtn}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className={styles.deleteBtn}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                          <Link
                            to={`/news-event/${item.slug}`}
                            className={styles.viewBtn}
                            title="View Public Page"
                            target="_blank"
                          >
                            <i className="fas fa-external-link-alt"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListEvents;
