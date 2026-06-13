import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import NavbarRedesigned from '../../components/Layout/Navbar.redesigned';
import Footer from '../../components/Layout/Footer';
import { serviceDbService, EngineeringService } from '../../services/serviceDbService';
import { uploadToB2 } from '../../services/b2Service';
import { authClient } from '../../lib/auth';
import { SignedIn, SignedOut } from '@neondatabase/neon-js/auth/react';
import styles from './CreateNews.module.css'; // Reusing styles

const CreateService: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const session = authClient.useSession();
  
  const [loadingItem, setLoadingItem] = useState<boolean>(false);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  
  // Basic Fields
  const [slug, setSlug] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [icon, setIcon] = useState<string>('fas fa-cog');
  const [category, setCategory] = useState<string>('');
  const [orderingRank, setOrderingRank] = useState<number>(999);
  const [description, setDescription] = useState<string>('');
  const [hasPage, setHasPage] = useState<boolean>(false);

  // Detail Fields
  const [subheadline, setSubheadline] = useState<string>('');
  const [fullDescription, setFullDescription] = useState<string>('');
  const [painPoints, setPainPoints] = useState<string>('');
  const [approach, setApproach] = useState<string>('');
  const [image, setImage] = useState<string>('');
  
  // Array Fields (Stored as newline separated strings for editing)
  const [benefitsStr, setBenefitsStr] = useState<string>('');
  const [processStr, setProcessStr] = useState<string>('');
  const [capabilitiesStr, setCapabilitiesStr] = useState<string>('');
  const [techStackStr, setTechStackStr] = useState<string>('');

  // Object Fields
  const [caseStudyTitle, setCaseStudyTitle] = useState<string>('');
  const [caseStudyMetric, setCaseStudyMetric] = useState<string>('');
  const [caseStudyDesc, setCaseStudyDesc] = useState<string>('');

  const [testQuote, setTestQuote] = useState<string>('');
  const [testAuthor, setTestAuthor] = useState<string>('');
  const [testTitle, setTestTitle] = useState<string>('');
  const [testCompany, setTestCompany] = useState<string>('');

  // Load existing item
  useEffect(() => {
    if (id) {
      setLoadingItem(true);
      serviceDbService.getAllServices()
        .then((data) => {
          const item = data.find(i => String(i.id) === String(id));
          if (item) {
            setSlug(item.slug || '');
            setTitle(item.title || '');
            setIcon(item.icon || 'fas fa-cog');
            setCategory(item.category || '');
            setOrderingRank(item.ordering_rank || 999);
            setDescription(item.description || '');
            setHasPage(item.has_page || false);
            setSubheadline(item.subheadline || '');
            setFullDescription(item.fullDescription || '');
            setPainPoints(item.painPoints || '');
            setApproach(item.approach || '');
            setImage(item.image || '');

            setBenefitsStr(item.benefits?.join('\n') || '');
            setProcessStr(item.process?.join('\n') || '');
            setCapabilitiesStr(item.capabilities?.join('\n') || '');
            setTechStackStr(item.techStack?.join('\n') || '');

            if (item.caseStudy) {
              setCaseStudyTitle(item.caseStudy.title || '');
              setCaseStudyMetric(item.caseStudy.metric || '');
              setCaseStudyDesc(item.caseStudy.description || '');
            }

            if (item.testimonial) {
              setTestQuote(item.testimonial.quote || '');
              setTestAuthor(item.testimonial.author || '');
              setTestTitle(item.testimonial.title || '');
              setTestCompany(item.testimonial.company || '');
            }
          }
          setLoadingItem(false);
        })
        .catch((err) => {
          console.error('Failed to load service', err);
          setLoadingItem(false);
        });
    }
  }, [id]);

  const handleImageUpload = async (file: File) => {
    try {
      setUploadPct(0);
      const uploadedResult = await uploadToB2(file, 'services', (pct) => setUploadPct(pct));
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

    if (!slug || !title) {
      alert("Slug and Title are required.");
      return;
    }

    // Parse array fields
    const parseList = (str: string) => str.split('\n').map(s => s.trim()).filter(s => s !== '');

    const payload: Partial<EngineeringService> = {
      slug,
      title,
      icon: icon || undefined,
      category: category || undefined,
      ordering_rank: orderingRank,
      description: description || undefined,
      has_page: hasPage,
      subheadline: subheadline || undefined,
      fullDescription: fullDescription || undefined,
      painPoints: painPoints || undefined,
      approach: approach || undefined,
      image: image || undefined,
      benefits: parseList(benefitsStr),
      process: parseList(processStr),
      capabilities: parseList(capabilitiesStr),
      techStack: parseList(techStackStr),
    };

    if (caseStudyTitle || caseStudyDesc) {
      payload.caseStudy = {
        title: caseStudyTitle,
        metric: caseStudyMetric,
        description: caseStudyDesc
      };
    } else {
      payload.caseStudy = undefined;
    }

    if (testQuote || testAuthor) {
      payload.testimonial = {
        quote: testQuote,
        author: testAuthor,
        title: testTitle,
        company: testCompany
      };
    } else {
      payload.testimonial = undefined;
    }

    try {
      if (id) {
        await serviceDbService.updateService(id, payload);
      } else {
        await serviceDbService.createService(payload);
      }
      navigate('/admin/services');
    } catch (err) {
      console.error('Error saving service:', err);
      alert('Failed to save service. Check console for details. Remember slugs must be unique.');
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
            <p className={styles.cardText}>Please sign in to manage services.</p>
            <div className={styles.actionRow}>
              <Link to="/auth/sign-in" className={styles.primaryBtn}>Sign In</Link>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className={styles.createContainer}>
          <div className={styles.pageHeader}>
            <Link to="/admin/services" className={styles.backLink} title="Back to Services">
              <i className="fas fa-arrow-left"></i>
            </Link>
            <div>
              <h1 className={styles.mainTitle}>{id ? 'Edit Service' : 'New Service'}</h1>
              <p className={styles.subtitle}>
                {id ? `Modifying database record ID: ${id}` : 'Create a new engineering service offering'}
              </p>
            </div>
          </div>

          {loadingItem ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className={styles.spinner} />
              <p>Loading service from database...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.adminForm}>
              {/* Basic Details */}
              <div className={styles.formCard}>
                <h2 className={styles.cardSectionTitle}>1. Core Details (Used on Home Page)</h2>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Service Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Detailed Engineering Design"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={styles.formInput}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>URL Slug (Unique) *</label>
                    <input
                      type="text"
                      placeholder="e.g. detail-engineering-design"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Engineering, Consulting, Auditing"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>FontAwesome Icon Class</label>
                    <input
                      type="text"
                      placeholder="e.g. fas fa-hard-hat"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Short Description (Used on cards)</label>
                  <textarea
                    placeholder="Brief description for the home page card..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.formTextarea}
                    rows={2}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Ordering Rank (Lowest shows first)</label>
                    <input
                      type="number"
                      value={orderingRank}
                      onChange={(e) => setOrderingRank(Number(e.target.value))}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '30px' }}>
                    <input
                      type="checkbox"
                      id="hasPage"
                      checked={hasPage}
                      onChange={(e) => setHasPage(e.target.checked)}
                      style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
                    />
                    <label htmlFor="hasPage" style={{ cursor: 'pointer', margin: 0, userSelect: 'none' }}>
                      Has Dedicated Detail Page?
                    </label>
                  </div>
                </div>
              </div>

              {/* Detailed Content (Only used if Has Page is true) */}
              <div className={styles.formCard} style={{ opacity: hasPage ? 1 : 0.5, transition: '0.3s opacity' }}>
                <h2 className={styles.cardSectionTitle}>2. Deep Dive Content (Used on Detail Page)</h2>
                {!hasPage && <p style={{ color: '#e74c3c', fontSize: '0.9rem', marginBottom: '15px' }}>Check "Has Dedicated Detail Page" above to enable this content on the public site.</p>}
                
                <div className={styles.formGroup}>
                  <label>Detail Page Subheadline</label>
                  <input
                    type="text"
                    placeholder="e.g. Ensuring quality, safety, and compliance on the ground."
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Detail Page Background Hero Image</label>
                  <div className={styles.uploadFieldRow}>
                    <input
                      type="text"
                      placeholder="e.g. /images/services/bg.jpg"
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
                    <div className={styles.imagePreview} style={{ maxHeight: '200px' }}>
                      <img src={image} alt="Featured preview" style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>The Pain Point (Problem)</label>
                    <textarea
                      placeholder="Describe the client's challenge..."
                      value={painPoints}
                      onChange={(e) => setPainPoints(e.target.value)}
                      className={styles.formTextarea}
                      rows={4}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Our Approach (Solution)</label>
                    <textarea
                      placeholder="Describe how CEC Nepal solves this..."
                      value={approach}
                      onChange={(e) => setApproach(e.target.value)}
                      className={styles.formTextarea}
                      rows={4}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Full Comprehensive Description</label>
                  <textarea
                    placeholder="Expanded description for SEO and deep reading..."
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    className={styles.formTextarea}
                    rows={3}
                  />
                </div>
              </div>

              {/* Arrays */}
              <div className={styles.formCard}>
                <h2 className={styles.cardSectionTitle}>3. Lists & Capabilities</h2>
                <p style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '15px' }}>Enter one item per line.</p>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Service Benefits</label>
                    <textarea
                      placeholder="High precision and accuracy&#10;Optimized resource utilization..."
                      value={benefitsStr}
                      onChange={(e) => setBenefitsStr(e.target.value)}
                      className={styles.formTextarea}
                      rows={5}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Project Methodology (Process Steps)</label>
                    <textarea
                      placeholder="Concept Refinement&#10;Drafting and 3D Modeling..."
                      value={processStr}
                      onChange={(e) => setProcessStr(e.target.value)}
                      className={styles.formTextarea}
                      rows={5}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Specific Capabilities</label>
                    <textarea
                      placeholder="Resident Engineering&#10;Quality Assurance..."
                      value={capabilitiesStr}
                      onChange={(e) => setCapabilitiesStr(e.target.value)}
                      className={styles.formTextarea}
                      rows={5}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tech Stack / Software</label>
                    <textarea
                      placeholder="Primavera P6&#10;AutoCAD&#10;Procore..."
                      value={techStackStr}
                      onChange={(e) => setTechStackStr(e.target.value)}
                      className={styles.formTextarea}
                      rows={5}
                    />
                  </div>
                </div>
              </div>

              {/* Objects */}
              <div className={styles.formCard}>
                <h2 className={styles.cardSectionTitle}>4. Social Proof</h2>
                
                <div style={{ marginBottom: '30px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: 'white' }}>Featured Case Study</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Project Title</label>
                      <input type="text" value={caseStudyTitle} onChange={(e) => setCaseStudyTitle(e.target.value)} className={styles.formInput} placeholder="e.g. Jogmai Khola SHP" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Metric Highlight</label>
                      <input type="text" value={caseStudyMetric} onChange={(e) => setCaseStudyMetric(e.target.value)} className={styles.formInput} placeholder="e.g. Capacity: 7.60 MW" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea value={caseStudyDesc} onChange={(e) => setCaseStudyDesc(e.target.value)} className={styles.formTextarea} rows={2} />
                  </div>
                </div>

                <div style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: 'white' }}>Client Testimonial</h3>
                  <div className={styles.formGroup}>
                    <label>Quote</label>
                    <textarea value={testQuote} onChange={(e) => setTestQuote(e.target.value)} className={styles.formTextarea} rows={2} placeholder='"Having CEC Nepal engineers..."' />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Author Name</label>
                      <input type="text" value={testAuthor} onChange={(e) => setTestAuthor(e.target.value)} className={styles.formInput} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Author Title</label>
                      <input type="text" value={testTitle} onChange={(e) => setTestTitle(e.target.value)} className={styles.formInput} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Company</label>
                      <input type="text" value={testCompany} onChange={(e) => setTestCompany(e.target.value)} className={styles.formInput} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form submission */}
              <div className={styles.formActions}>
                <button type="button" onClick={() => navigate('/admin/services')} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {id ? 'Save Changes' : 'Create Service'}
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

export default CreateService;
