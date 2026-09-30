import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavbarRedesigned from '../../components/Layout/Navbar.redesigned';
import Footer from '../../components/Layout/Footer';
import { serviceDbService, EngineeringService } from '../../services/serviceDbService';
import { authClient } from '../../lib/auth';
import { SignedIn, SignedOut } from '@neondatabase/neon-js/auth/react';
import styles from './ListEvents.module.css'; // Reusing existing admin list styles

const ListServices: React.FC = () => {
  const navigate = useNavigate();
  const session = authClient.useSession();

  // States
  const [items, setItems] = useState<EngineeringService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch Services
  const loadItems = () => {
    setLoading(true);
    serviceDbService.getAllServices()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load services', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Delete Service
  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceDbService.deleteService(id);
        loadItems();
      } catch (err) {
        console.error('Failed to delete service', err);
        alert('Failed to delete service');
      }
    }
  };

  // Filter & Search Services
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <>
      <NavbarRedesigned />

      <SignedOut>
        <div className={styles.centeredPage}>
          <div className={styles.glassCard}>
            <div className={styles.warningIcon}>
              <i className="fas fa-lock"></i>
            </div>
            <h2 className={styles.cardTitle}>Admin Access Required</h2>
            <p className={styles.cardText}>
              Please sign in to manage engineering services.
            </p>
            <div className={styles.actionRow}>
              <Link to="/auth/sign-in" className={styles.primaryBtn}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className={styles.adminContainer}>
          {/* Admin Header */}
          <div className={styles.adminHeader}>
            <div>
              <span className={styles.badge}>Security Session Active</span>
              <h1 className={styles.mainTitle}>Engineering Services Manager</h1>
              <p className={styles.subtitle}>
                Signed in as <span className={styles.userEmail}>{session?.data?.user?.email || 'Admin'}</span>. Manage services shown on the public site.
              </p>
            </div>
            <Link to="/admin/services/create" className={styles.createBtn} style={{ textDecoration: 'none' }}>
              <i className="fas fa-plus"></i> Add Service
            </Link>
          </div>

          {/* Dashboard Controls */}
          <div className={styles.controlsBar}>
            <div className={styles.searchBox}>
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by service title or category..."
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
                <i className="fas fa-cogs"></i>
                <h3>No services found</h3>
                <p>Try refining your search or add a new service.</p>
              </div>
            ) : (
              <div className={styles.tableResponsive}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Icon</th>
                      <th>Service Title & Slug</th>
                      <th>Category</th>
                      <th>Detail Page</th>
                      <th>Ordering Rank</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ fontSize: '24px', color: '#00B4D8' }}>
                            <i className={item.icon || 'fas fa-cog'}></i>
                          </div>
                        </td>
                        <td>
                          <div className={styles.titleCol}>
                            <span className={styles.tableTitle}>{item.title}</span>
                            <span className={styles.tableCategory}>{item.slug}</span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.statusBadge} style={{ display: 'inline-block' }}>
                            {item.category || 'General'}
                          </span>
                        </td>
                        <td>
                          {item.has_page ? (
                            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                              <i className="fas fa-check-circle"></i> Yes
                            </span>
                          ) : (
                            <span style={{ color: '#e74c3c' }}>
                              <i className="fas fa-times-circle"></i> No
                            </span>
                          )}
                        </td>
                        <td>{item.ordering_rank}</td>
                        <td>
                          <div className={styles.btnGroup}>
                            <button
                              onClick={() => navigate(`/admin/services/edit/${item.id}`)}
                              className={styles.editBtn}
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id as string | number)}
                              className={styles.deleteBtn}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                            {item.has_page && (
                              <Link
                                to={`/service/${item.slug}`}
                                className={styles.viewBtn}
                                title="View Public Page"
                                target="_blank"
                              >
                                <i className="fas fa-external-link-alt"></i>
                              </Link>
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
      </SignedIn>
      <Footer />
    </>
  );
};

export default ListServices;
