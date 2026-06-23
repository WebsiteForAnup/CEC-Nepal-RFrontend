import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import NavbarRedesigned from '../../components/Layout/Navbar.redesigned';
import Footer from '../../components/Layout/Footer';
import { galleryDbService, GalleryImage } from '../../services/galleryDbService';
import { uploadToB2 } from '../../services/b2Service';
import { authClient } from '../../lib/auth';
import { SignedIn, SignedOut } from '@neondatabase/neon-js/auth/react';
import styles from './CreateNews.module.css'; // Reusing existing beautiful form styles

const CreateGallery: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const session = authClient.useSession();

  const [loadingItem, setLoadingItem] = useState<boolean>(false);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Load editing item if ID exists
  useEffect(() => {
    if (id) {
      setLoadingItem(true);
      galleryDbService.getAllGalleryImages()
        .then((data) => {
          const item = data.find(i => String(i.id) === String(id));
          if (item) {
            setTitle(item.title);
            setSlug(item.slug);
            setCategory(item.category);
            setImage(item.image);
            setDescription(item.description);
          }
          setLoadingItem(false);
        })
        .catch((err) => {
          console.error('Failed to load gallery item for editing', err);
          setLoadingItem(false);
        });
    }
  }, [id]);

  // Auto-generate slug from title (only in create mode)
  useEffect(() => {
    if (!id) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlug(generated);
    }
  }, [title, id]);

  const handleImageUpload = async (file: File) => {
    try {
      setUploadPct(0);
      const result = await uploadToB2(file, 'gallery', (pct) => setUploadPct(pct));
      setImage(result.publicUrl);
    } catch (err: any) {
      console.error('Gallery image upload failed:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadPct(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !slug || !category || !image) {
      alert('Please fill in Title, Slug, Category, and Image.');
      return;
    }

    const payload: Omit<GalleryImage, 'id'> = {
      title,
      slug,
      category,
      image,
      description,
    };

    try {
      if (id) {
        await galleryDbService.updateGalleryImage(id, payload);
      } else {
        await galleryDbService.createGalleryImage(payload);
      }
      navigate('/admin/gallery');
    } catch (err) {
      console.error('Error saving gallery item:', err);
      alert('Failed to save item. Check console for details.');
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
      </SignedOut>

      <SignedIn>
        <div className={styles.createContainer}>
          <div className={styles.pageHeader}>
            <Link to="/admin/gallery" className={styles.backLink} title="Back to Gallery Manager">
              <i className="fas fa-arrow-left"></i>
            </Link>
            <div>
              <h1 className={styles.mainTitle}>{id ? 'Edit Gallery Image' : 'New Gallery Image'}</h1>
              <p className={styles.subtitle}>
                {id ? `Modifying database record ID: ${id}` : 'Fill in the fields to add an image to the project gallery'}
              </p>
            </div>
          </div>

          {loadingItem ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className={styles.spinner} />
              <p>Loading gallery item content from database...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.adminForm}>
              <div className={styles.formCard}>
                <h2 className={styles.cardSectionTitle}>Image Details</h2>

                <div className={styles.formGroup}>
                  <label>Title *</label>
                  <input
                    type="text"
                    placeholder="Enter image title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Slug (URL Segment) *</label>
                  <input
                    type="text"
                    placeholder="e.g. detailed-engineering"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Category *</label>
                  <input
                    type="text"
                    placeholder="e.g. Field Work, Engineering, Construction, Hydrology"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Image Source *</label>
                  <div className={styles.uploadFieldRow}>
                    <input
                      type="text"
                      placeholder="Paste URL or upload a file →"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className={styles.formInput}
                      style={{ flex: 1 }}
                      required
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
                      <img src={image} alt="Gallery item preview" />
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    placeholder="Brief description of this image..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.formTextarea}
                    rows={4}
                  />
                </div>
              </div>

              {/* Form actions */}
              <div className={styles.formActions}>
                <button type="button" onClick={() => navigate('/admin/gallery')} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {id ? 'Save Changes' : 'Add to Gallery'}
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

export default CreateGallery;
