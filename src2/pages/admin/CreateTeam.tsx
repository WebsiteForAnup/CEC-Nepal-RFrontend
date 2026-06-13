import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import NavbarRedesigned from '../../components/Layout/Navbar.redesigned';
import Footer from '../../components/Layout/Footer';
import { teamDbService, Member } from '../../services/teamService';
import teamRegistry from '../../data/collections/team/registry.json';
import { uploadToB2 } from '../../services/b2Service';
import { authClient } from '../../lib/auth';
import { SignedIn, SignedOut } from '@neondatabase/neon-js/auth/react';
import styles from './CreateNews.module.css'; // Reusing styles from CreateNews

const CreateTeam: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const session = authClient.useSession();
  
  const [loadingItem, setLoadingItem] = useState<boolean>(false);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  
  // Available categories from DB
  const [availableCategories, setAvailableCategories] = useState<{slug: string, label: string}[]>([]);

  useEffect(() => {
    teamDbService.getTeamCategoriesList().then(data => {
      setAvailableCategories(data.map(d => ({ slug: d.slug, label: d.label })));
    });
  }, []);

  // Form Fields
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  
  // Experience
  const [joinDate, setJoinDate] = useState<string>('');
  const [recruitmentType, setRecruitmentType] = useState<string>('Full-time');
  const [moreInfoExp, setMoreInfoExp] = useState<string>('');

  // Assignments
  const [categories, setCategories] = useState<string[]>([]);
  const [designation, setDesignation] = useState<string>('');
  const [metaMap, setMetaMap] = useState<Record<string, string>>({});
  const [ordering, setOrdering] = useState<number>(999);

  // Load editing item if ID exists
  useEffect(() => {
    if (id) {
      setLoadingItem(true);
      teamDbService.getAllTeamMembers()
        .then((data) => {
          const item = data.find(i => String(i.id) === String(id));
          if (item) {
            setName(item.name || '');
            setSlug(item.slug || '');
            setImageUrl(item.image_url || '');
            setEducation(item.education || '');
            setBio(item.bio || '');

            if (item.experience && typeof item.experience === 'object') {
              setJoinDate(String(item.experience.joinDate || ''));
              setRecruitmentType(item.experience.recruitmentType || 'Full-time');
              setMoreInfoExp(item.experience.more_info || '');
            }

            if (item.assignments) {
              setCategories(item.assignments.categories || []);
              setMetaMap(item.assignments.meta || {});
              setDesignation(item.assignments.designation || '');
              setOrdering(item.assignments.ordering || 999);
            }
          }
          setLoadingItem(false);
        })
        .catch((err) => {
          console.error('Failed to load team member for editing', err);
          setLoadingItem(false);
        });
    }
  }, [id]);

  // Auto-generate slug from name (only in create mode)
  useEffect(() => {
    if (!id && name) {
      const generated = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlug(generated);
    }
  }, [name, id]);

  const handleImageUpload = async (file: File) => {
    try {
      setUploadPct(0);
      const uploadedResult = await uploadToB2(file, 'team', (pct) => setUploadPct(pct));
      setImageUrl(uploadedResult.publicUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Ensure you are signed in and check the console.");
    } finally {
      setUploadPct(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleCategoryToggle = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !slug) {
      alert('Please fill in Name and Slug.');
      return;
    }

    const payload: Partial<Member> = {
      name,
      slug,
      image_url: imageUrl || undefined,
      education: education || undefined,
      bio: bio || undefined,
      experience: {
        joinDate: joinDate || undefined,
        recruitmentType: recruitmentType || undefined,
        more_info: moreInfoExp || undefined
      },
      assignments: {
        categories: categories.length > 0 ? categories : undefined,
        designation: designation || undefined,
        meta: Object.keys(metaMap).length > 0 ? metaMap : undefined,
        ordering: ordering
      }
    };

    try {
      if (id) {
        await teamDbService.updateTeamMember(id, payload);
      } else {
        await teamDbService.createTeamMember(payload);
      }
      navigate('/admin/team');
    } catch (err) {
      console.error('Error saving team member:', err);
      alert('Failed to save member. Check console for details.');
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
              Please sign in to manage team members.
            </p>
            <div className={styles.actionRow}>
              <Link to="/auth/sign-in" className={styles.primaryBtn}>Sign In</Link>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className={styles.createContainer}>
          <div className={styles.pageHeader}>
            <Link to="/admin/team" className={styles.backLink} title="Back to Team">
              <i className="fas fa-arrow-left"></i>
            </Link>
            <div>
              <h1 className={styles.mainTitle}>{id ? 'Edit Team Member' : 'New Team Member'}</h1>
              <p className={styles.subtitle}>
                {id ? `Modifying database record ID: ${id}` : 'Fill in the fields to add a new member'}
              </p>
            </div>
          </div>

          {loadingItem ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className={styles.spinner} />
              <p>Loading member from database...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.adminForm}>
              {/* 1. Basic Metadata */}
              <div className={styles.formCard}>
                <h2 className={styles.cardSectionTitle}>Basic Details</h2>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Er. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Slug (URL Segment) *</label>
                    <input
                      type="text"
                      placeholder="e.g. john-doe"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Designation / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Civil Engineer"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Education</label>
                    <input
                      type="text"
                      placeholder="e.g. MSc in Structural Engineering"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Profile Image URL</label>
                  <div className={styles.uploadFieldRow}>
                    <input
                      type="text"
                      placeholder="e.g. /images/data/user.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className={styles.formInput}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileRef}
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(f);
                      }}
                    />
                    <button
                      type="button"
                      className={styles.uploadBtn}
                      onClick={() => fileRef.current?.click()}
                      disabled={uploadPct !== null}
                      title="Upload image to Backblaze B2"
                    >
                      {uploadPct !== null ? (
                        <span className={styles.uploadBtnProgress}>{uploadPct}%</span>
                      ) : (
                        <><i className="fas fa-cloud-upload-alt" /> Upload</>  
                      )}
                    </button>
                  </div>
                  {uploadPct !== null && (
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${uploadPct}%` }} />
                    </div>
                  )}
                  {imageUrl && (
                    <div className={styles.imagePreview}>
                      <img src={imageUrl} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Professional Biography</label>
                  <textarea
                    placeholder="Write a brief professional bio..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className={styles.formTextarea}
                    rows={4}
                  />
                </div>
              </div>

              {/* 2. Experience */}
              <div className={styles.formCard}>
                <h2 className={styles.cardSectionTitle}>Experience at CEC</h2>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Join Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2015"
                      value={joinDate}
                      onChange={(e) => setJoinDate(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Recruitment Type</label>
                    <select
                      value={recruitmentType}
                      onChange={(e) => setRecruitmentType(e.target.value)}
                      className={styles.formInput}
                      style={{ backgroundColor: 'rgba(10, 15, 30, 0.6)' }}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>More Experience Info</label>
                  <textarea
                    placeholder="E.g. 15+ years of experience in Hydropower Development..."
                    value={moreInfoExp}
                    onChange={(e) => setMoreInfoExp(e.target.value)}
                    className={styles.formTextarea}
                    rows={2}
                  />
                </div>
              </div>

              {/* 3. Assignments & Grouping */}
              <div className={styles.formCard}>
                <h2 className={styles.cardSectionTitle}>Grouping & Sorting</h2>
                
                <div className={styles.formGroup}>
                  <label>Categories</label>
                  <div style={{ marginTop: '10px' }}>
                    <select
                      multiple
                      value={categories}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setCategories(selected);
                      }}
                      className={styles.formInput}
                      style={{ height: '120px', backgroundColor: 'rgba(10, 15, 30, 0.6)', padding: '10px' }}
                    >
                      {availableCategories.map(cat => (
                        <option key={cat.slug} value={cat.slug} style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <small style={{ color: '#aaa', marginTop: '5px', display: 'block' }}>Hold Ctrl (Windows) or Command (Mac) to select multiple options.</small>
                    
                    {categories.length > 0 && (
                      <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                        <label style={{ fontSize: '0.9rem', color: '#ccc' }}>Designations per Category</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                          {categories.map(catSlug => {
                            const catLabel = availableCategories.find(c => c.slug === catSlug)?.label || catSlug;
                            return (
                              <div key={catSlug} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: '150px', color: 'white', fontSize: '0.9rem' }}>{catLabel}</span>
                                <input
                                  type="text"
                                  placeholder={`Designation in ${catLabel}`}
                                  value={metaMap[catSlug] || ''}
                                  onChange={(e) => setMetaMap({ ...metaMap, [catSlug]: e.target.value })}
                                  className={styles.formInput}
                                  style={{ flex: 1, padding: '8px' }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Display Ordering (Lower number = shown first)</label>
                  <input
                    type="number"
                    value={ordering}
                    onChange={(e) => setOrdering(Number(e.target.value))}
                    className={styles.formInput}
                  />
                </div>
              </div>

              {/* Form submission */}
              <div className={styles.formActions}>
                <button type="button" onClick={() => navigate('/admin/team')} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {id ? 'Save Changes' : 'Add Team Member'}
                </button>
              </div>
            </form>
          )}
        </div>
      </SignedIn>
      <Footer />
    </>
  );
};

export default CreateTeam;
