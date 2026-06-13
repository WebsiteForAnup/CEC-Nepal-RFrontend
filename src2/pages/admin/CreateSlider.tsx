import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import NavbarRedesigned from '../../components/Layout/Navbar.redesigned';
import Footer from '../../components/Layout/Footer';
import { sliderDbService, Slider } from '../../services/sliderDbService';
import { uploadToB2 } from '../../services/b2Service';
import { authClient } from '../../lib/auth';
import { SignedIn, SignedOut } from '@neondatabase/neon-js/auth/react';
import styles from './CreateNews.module.css'; // Reusing styles from CreateNews

const CreateSlider: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const session = authClient.useSession();
  
  const [loadingItem, setLoadingItem] = useState<boolean>(false);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  
  // Form Fields
  const [image, setImage] = useState<string>('');
  const [badge, setBadge] = useState<string>('');
  const [titleHighlight, setTitleHighlight] = useState<string>('');
  const [titleSuffix, setTitleSuffix] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [ordering, setOrdering] = useState<number>(999);

  // Load editing item if ID exists
  useEffect(() => {
    if (id) {
      setLoadingItem(true);
      sliderDbService.getAllSliders()
        .then((data) => {
          const item = data.find(i => String(i.id) === String(id));
          if (item) {
            setImage(item.image || '');
            setBadge(item.badge || '');
            setTitleHighlight(item.titleHighlight || '');
            setTitleSuffix(item.titleSuffix || '');
            setDescription(item.description || '');
            setLink(item.link || '');
            setOrdering(item.ordering || 999);
          }
          setLoadingItem(false);
        })
        .catch((err) => {
          console.error('Failed to load slider for editing', err);
          setLoadingItem(false);
        });
    }
  }, [id]);

  const handleImageUpload = async (file: File) => {
    try {
      setUploadPct(0);
      const uploadedResult = await uploadToB2(file, 'sliders', (pct) => setUploadPct(pct));
      setImage(uploadedResult.publicUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Ensure you are signed in and check the console.");
    } finally {
      setUploadPct(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<Slider> = {
      image: image || undefined,
      badge: badge || undefined,
      titleHighlight: titleHighlight || undefined,
      titleSuffix: titleSuffix || undefined,
      description: description || undefined,
      link: link || undefined,
      ordering: ordering
    };

    try {
      if (id) {
        await sliderDbService.updateSlider(id, payload);
      } else {
        await sliderDbService.createSlider(payload);
      }
      navigate('/admin/sliders');
    } catch (err) {
      console.error('Error saving slider:', err);
      alert('Failed to save slider. Check console for details.');
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
              <Link to="/auth/sign-in" className={styles.primaryBtn}>Sign In</Link>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className={styles.createContainer}>
          <div className={styles.pageHeader}>
            <Link to="/admin/sliders" className={styles.backLink} title="Back to Sliders">
              <i className="fas fa-arrow-left"></i>
            </Link>
            <div>
              <h1 className={styles.mainTitle}>{id ? 'Edit Slider' : 'New Slider'}</h1>
              <p className={styles.subtitle}>
                {id ? `Modifying database record ID: ${id}` : 'Create a new hero slider for the home page'}
              </p>
            </div>
          </div>

          {loadingItem ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className={styles.spinner} />
              <p>Loading slider from database...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.adminForm}>
              <div className={styles.formCard}>
                <h2 className={styles.cardSectionTitle}>Slider Content</h2>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Badge Text</label>
                    <input
                      type="text"
                      placeholder="e.g. HYDROPOWER EXCELLENCE"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Link / Scroll Target</label>
                    <input
                      type="text"
                      placeholder="e.g. projects"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Title Highlight (Colored Text)</label>
                    <input
                      type="text"
                      placeholder="e.g. Seti Khola"
                      value={titleHighlight}
                      onChange={(e) => setTitleHighlight(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Title Suffix (White Text)</label>
                    <input
                      type="text"
                      placeholder="e.g. Hydropower Project"
                      value={titleSuffix}
                      onChange={(e) => setTitleSuffix(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Background Image URL</label>
                  <div className={styles.uploadFieldRow}>
                    <input
                      type="text"
                      placeholder="e.g. /images/data/slider1.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
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
                  {image && (
                    <div className={styles.imagePreview}>
                      <img src={image} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    placeholder="Short description text..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.formTextarea}
                    rows={4}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Display Ordering</label>
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
                <button type="button" onClick={() => navigate('/admin/sliders')} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {id ? 'Save Changes' : 'Add Slider'}
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

export default CreateSlider;
