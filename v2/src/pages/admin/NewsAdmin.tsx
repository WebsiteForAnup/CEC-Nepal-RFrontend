import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavbarRedesigned from '../../components/Layout/Navbar.redesigned';
import Footer from '../../components/Layout/Footer';
import { newsDbService, NewsEventItem } from '../../services/newsDbService';
import { authClient } from '../../lib/auth';
import styles from './NewsAdmin.module.css';

const NewsAdmin: React.FC = () => {
  const navigate = useNavigate();
  const session = authClient.useSession();
  
  // States
  const [items, setItems] = useState<NewsEventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'all' | 'news' | 'event'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch Items
  const loadItems = () => {
    setLoading(true);
    newsDbService.getNewsAndEvents()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load news events', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Delete Item
  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await newsDbService.deleteNewsAndEvent(id);
        loadItems();
      } catch (err) {
        console.error('Failed to delete item', err);
        alert('Failed to delete item');
      }
    }
  };

  // Filter & Search Items
  const filteredItems = items.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
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
              Please sign in to manage news and events. Authenticated actions are secured by database policy.
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
            <h1 className={styles.mainTitle}>News & Events Manager</h1>
            <p className={styles.subtitle}>
              Signed in as <span className={styles.userEmail}>{session.data.user.email}</span>. Manage publications populated in the database.
            </p>
          </div>
          <Link to="/admin/news/create" className={styles.createBtn} style={{ textDecoration: 'none' }}>
            <i className="fas fa-plus"></i> Add News/Event
          </Link>
        </div>

        {/* Dashboard Controls */}
        <div className={styles.controlsBar}>
          <div className={styles.tabGroup}>
            {(['all', 'news', 'event'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`${styles.tabBtn} ${filterType === t ? styles.activeTab : ''}`}
              >
                {t === 'all' ? 'All Publications' : t === 'news' ? 'News Articles' : 'Events'}
              </button>
            ))}
          </div>

          <div className={styles.searchBox}>
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by title, description, or category..."
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
              <i className="fas fa-folder-open"></i>
              <h3>No publications found</h3>
              <p>Try refining your search or add a new record to populate the database.</p>
            </div>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Title & Category</th>
                    <th>Publish Date</th>
                    <th>Author</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className={`${styles.typeBadge} ${item.type === 'news' ? styles.newsType : styles.eventType}`}>
                          {item.type.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className={styles.titleCol}>
                          <span className={styles.tableTitle}>{item.title}</span>
                          <span className={styles.tableCategory}>{item.category || 'General'}</span>
                        </div>
                      </td>
                      <td>{item.date}</td>
                      <td>{item.author || 'CEC Nepal Team'}</td>
                      <td>
                        <div className={styles.btnGroup}>
                          <button
                            onClick={() => navigate(`/admin/news/edit/${item.id}`)}
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

export default NewsAdmin;
