import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavbarRedesigned from '../../components/Layout/Navbar.redesigned';
import Footer from '../../components/Layout/Footer';
import { teamDbService, Member } from '../../services/teamService';
import { authClient } from '../../lib/auth';
import { SignedIn, SignedOut } from '@neondatabase/neon-js/auth/react';
import styles from './ListEvents.module.css'; // Reusing styles from ListEvents for consistency

const ListTeam: React.FC = () => {
  const navigate = useNavigate();
  const session = authClient.useSession();
  
  // States
  const [items, setItems] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch Team Members
  const loadItems = () => {
    setLoading(true);
    teamDbService.getAllTeamMembers()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load team members', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Delete Member
  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamDbService.deleteTeamMember(id);
        loadItems();
      } catch (err) {
        console.error('Failed to delete team member', err);
        alert('Failed to delete team member');
      }
    }
  };

  // Filter & Search Members
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.designation && item.designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.bio && item.bio.toLowerCase().includes(searchTerm.toLowerCase()));
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
              Please sign in to manage team members. Authenticated actions are secured by database policy.
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
      </SignedOut>

      <SignedIn>
        <div className={styles.adminContainer}>
          {/* Admin Header */}
          <div className={styles.adminHeader}>
            <div>
              <span className={styles.badge}>Security Session Active</span>
              <h1 className={styles.mainTitle}>Team Manager</h1>
              <p className={styles.subtitle}>
                Signed in as <span className={styles.userEmail}>{session?.data?.user?.email || 'Admin'}</span>. Manage team members populated in the database.
              </p>
            </div>
            <Link to="/admin/team/create" className={styles.createBtn} style={{ textDecoration: 'none' }}>
              <i className="fas fa-plus"></i> Add Member
            </Link>
          </div>

          {/* Dashboard Controls */}
          <div className={styles.controlsBar}>
            <div className={styles.tabGroup}>
              <button className={styles.tabBtn} onClick={() => navigate('/admin/news')}>News Articles</button>
              <button className={styles.tabBtn} onClick={() => navigate('/admin/events')}>Upcoming Events</button>
              <button className={`${styles.tabBtn} ${styles.activeTab}`}>Team Members</button>
            </div>
            <div className={styles.searchBox}>
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by name, designation, or bio..."
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
                <i className="fas fa-users"></i>
                <h3>No team members found</h3>
                <p>Try refining your search or add a new team member to populate the database.</p>
              </div>
            ) : (
              <div className={styles.tableResponsive}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name & Designation</th>
                      <th>Categories</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className={styles.tableImageWrapper} style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fas fa-user" style={{ color: '#aaa' }}></i>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className={styles.titleCol}>
                            <span className={styles.tableTitle}>{item.name}</span>
                            <span className={styles.tableCategory}>{item.designation || 'No Designation'}</span>
                          </div>
                        </td>
                        <td>
                          {item.assignments?.categories?.map((cat, i) => {
                            const metaDesig = item.assignments?.meta?.[cat];
                            // Quick formatter for the category slug
                            const formattedCat = cat.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                            return (
                              <div key={i} style={{ marginBottom: '6px' }}>
                                <span className={styles.statusBadge} style={{ marginRight: '8px', display: 'inline-block' }}>
                                  {formattedCat}
                                </span>
                                {metaDesig && <span style={{ fontSize: '0.85rem', color: '#ccc' }}> {metaDesig}</span>}
                              </div>
                            );
                          })}
                        </td>
                        <td>
                          <div className={styles.btnGroup}>
                            <button
                              onClick={() => navigate(`/admin/team/edit/${item.id}`)}
                              className={styles.editBtn}
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id as string)}
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

export default ListTeam;
