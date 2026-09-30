import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavbarRedesigned from '../../components/Layout/Navbar.redesigned';
import Footer from '../../components/Layout/Footer';
import { sliderDbService, Slider } from '../../services/sliderDbService';
import { authClient } from '../../lib/auth';
import { SignedIn, SignedOut } from '@neondatabase/neon-js/auth/react';
import styles from './ListEvents.module.css'; // Reusing existing admin list styles

const ListSliders: React.FC = () => {
  const navigate = useNavigate();
  const session = authClient.useSession();

  // States
  const [items, setItems] = useState<Slider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Sliders
  const loadItems = () => {
    setLoading(true);
    sliderDbService.getAllSliders()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load sliders', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Delete Slider
  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      try {
        await sliderDbService.deleteSlider(id);
        loadItems();
      } catch (err) {
        console.error('Failed to delete slider', err);
        alert('Failed to delete slider');
      }
    }
  };

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
              Please sign in to manage sliders.
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
              <h1 className={styles.mainTitle}>Hero Sliders Manager</h1>
              <p className={styles.subtitle}>
                Signed in as <span className={styles.userEmail}>{session?.data?.user?.email || 'Admin'}</span>. Manage the landing page hero sliders.
              </p>
            </div>
            <Link to="/admin/sliders/create" className={styles.createBtn} style={{ textDecoration: 'none' }}>
              <i className="fas fa-plus"></i> Add Slider
            </Link>
          </div>

          {/* Database List / Table */}
          <div className={styles.tableCard}>
            {loading ? (
              <div className={styles.tableSpinner}>
                <div className={styles.spinner} />
                <p>Fetching database records...</p>
              </div>
            ) : items.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="fas fa-images"></i>
                <h3>No sliders found</h3>
                <p>Try adding a new slider to populate the database.</p>
              </div>
            ) : (
              <div className={styles.tableResponsive}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title & Badge</th>
                      <th>Description</th>
                      <th>Ordering</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ width: '80px', height: '50px', overflow: 'hidden', borderRadius: '4px' }}>
                            {item.image ? (
                              <img src={item.image} alt="Slider" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', background: '#333' }}></div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className={styles.titleCol}>
                            <span className={styles.tableTitle}>{item.titleHighlight} {item.titleSuffix}</span>
                            <span className={styles.tableCategory}>{item.badge || 'No Badge'}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.description}
                          </div>
                        </td>
                        <td>{item.ordering}</td>
                        <td>
                          <div className={styles.btnGroup}>
                            <button
                              onClick={() => navigate(`/admin/sliders/edit/${item.id}`)}
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

export default ListSliders;
