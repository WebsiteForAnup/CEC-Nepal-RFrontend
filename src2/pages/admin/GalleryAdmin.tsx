import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavbarRedesigned from '../../components/Layout/Navbar.redesigned';
import Footer from '../../components/Layout/Footer';
import { galleryDbService, GalleryImage } from '../../services/galleryDbService';
import { authClient } from '../../lib/auth';
import styles from './GalleryAdmin.module.css';

const GalleryAdmin: React.FC = () => {
  const navigate = useNavigate();
  const session = authClient.useSession();

  // States
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch Items
  const loadItems = () => {
    setLoading(true);
    galleryDbService.getAllGalleryImages()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load gallery items', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Delete Item
  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      try {
        await galleryDbService.deleteGalleryImage(id);
        loadItems();
      } catch (err) {
        console.error('Failed to delete gallery item', err);
        alert('Failed to delete item');
      }
    }
  };

  // Get unique categories for filter tabs
  const categories = ['all', ...Array.from(new Set(items.map((item) => item.category)))];

  // Filter & Search Items
  const filteredItems = items.filter((item) => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
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
              Please sign in to manage project gallery. Authenticated actions are secured by database policy.
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
            <h1 className={styles.mainTitle}>Project Gallery Manager</h1>
            <p className={styles.subtitle}>
              Signed in as <span className={styles.userEmail}>{session.data.user.email}</span>. Manage gallery photos populated in the database.
            </p>
          </div>
          <Link to="/admin/gallery/create" className={styles.createBtn} style={{ textDecoration: 'none' }}>
            <i className="fas fa-plus"></i> Add Gallery Image
          </Link>
        </div>

        {/* Dashboard Controls */}
        <div className={styles.controlsBar}>
          <div className={styles.tabGroup}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`${styles.tabBtn} ${filterCategory === cat ? styles.activeTab : ''}`}
              >
                {cat === 'all' ? 'All Images' : cat}
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
              <h3>No gallery items found</h3>
              <p>Try refining your search or add a new record to populate the database.</p>
            </div>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title & Category</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ width: '80px', height: '50px', overflow: 'hidden', borderRadius: '4px' }}>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="fas fa-image" style={{ color: '#94a3b8' }}></i>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.titleCol}>
                          <span className={styles.tableTitle}>{item.title}</span>
                          <span className={styles.tableCategory}>{item.category}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.description}>
                          {item.description}
                        </div>
                      </td>
                      <td>
                        <div className={styles.btnGroup}>
                          <button
                            onClick={() => navigate(`/admin/gallery/edit/${item.id}`)}
                            className={styles.editBtn}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id!)}
                            className={styles.deleteBtn}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                          {item.image && (
                            <a
                              href={item.image}
                              className={styles.viewBtn}
                              title="View Full Resolution"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fas fa-external-link-alt"></i>
                            </a>
                          )}
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

export default GalleryAdmin;
