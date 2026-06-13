import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import NavbarRedesigned from '../../components/Layout/Navbar.redesigned';
import Footer from '../../components/Layout/Footer';
import { newsDbService, NewsEventItem } from '../../services/newsDbService';
import { uploadToB2 } from '../../services/b2Service';
import { authClient } from '../../lib/auth';
import styles from './CreateNews.module.css';

interface RichContentBlock {
  type: 'paragraph' | 'image' | 'video' | 'youtube-shorts' | 'facebook' | 'document';
  value?: string;
  url?: string;
  caption?: string;
  /** Original filename shown in document block previews */
  filename?: string;
}

const CreateNews: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const session = authClient.useSession();
  
  // Base Page States
  const [loadingItem, setLoadingItem] = useState<boolean>(false);
  
  // Form Fields
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const type = 'news';
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [category, setCategory] = useState<string>('General');
  const [author, setAuthor] = useState<string>('CEC Nepal Team');
  const [content, setContent] = useState<string>('');
  const [cecRole, setCecRole] = useState<string>('');
  
  // Additional Metadata Fields
  const [importantDates, setImportantDates] = useState<{ date_title: string; date: string; meta?: any }[]>([]);
  const [awardName, setAwardName] = useState<string>('');
  const [team, setTeam] = useState<string>('');

  // Rich Content Blocks State
  const [blocks, setBlocks] = useState<RichContentBlock[]>([]);

  // Upload state: featured image
  const [featuredUploadPct, setFeaturedUploadPct] = useState<number | null>(null);
  const featuredFileRef = useRef<HTMLInputElement>(null);

  // Upload state: per-block (keyed by block index)
  const [blockUploadPct, setBlockUploadPct] = useState<Record<number, number | null>>({});

  // Load editing item if ID exists in URL
  useEffect(() => {
    if (id) {
      setLoadingItem(true);
      newsDbService.getNewsAndEvents()
        .then((data) => {
          const item = data.find(i => String(i.id) === String(id));
          if (item && item.type === 'news') {
            setTitle(item.title);
            setSlug(item.slug);
            setDate(item.date);
            setDescription(item.description || '');
            setImage(item.image || '');
            setCategory(item.category || 'General');
            setAuthor(item.author || 'CEC Nepal Team');
            setContent(item.content || '');
            setCecRole(item.cecRole || '');
            setImportantDates(item.importantDates || []);
            setAwardName(item.awardName || '');
            setTeam(item.team || '');
            setBlocks(item.richContent || []);
          }
          setLoadingItem(false);
        })
        .catch((err) => {
          console.error('Failed to load item for editing', err);
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

  // Rich Text Block Additions
  const addBlock = (blockType: RichContentBlock['type']) => {
    const newBlock: RichContentBlock = {
      type: blockType,
      value: blockType === 'paragraph' ? '' : undefined,
      url: blockType !== 'paragraph' ? '' : undefined,
      caption: blockType !== 'paragraph' ? '' : undefined,
    };
    setBlocks([...blocks, newBlock]);
  };

  // Update specific block
  const updateBlock = (index: number, updatedFields: Partial<RichContentBlock>) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], ...updatedFields };
    setBlocks(updated);
  };

  // Remove block
  const deleteBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
    // Clean up corresponding uploading percentage track if any
    setBlockUploadPct((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  // Re-order blocks
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[swapIndex];
    updated[swapIndex] = temp;
    setBlocks(updated);

    // Swap block upload percentages tracking map
    setBlockUploadPct((prev) => {
      const copy = { ...prev };
      const tempPct = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = tempPct;
      return copy;
    });
  };

  // Upload featured image to B2
  const handleFeaturedImageUpload = async (file: File) => {
    setFeaturedUploadPct(0);
    try {
      const result = await uploadToB2(file, 'news/featured', (pct) => setFeaturedUploadPct(pct));
      setImage(result.publicUrl);
    } catch (err: any) {
      console.error('Featured image upload failed:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setFeaturedUploadPct(null);
      if (featuredFileRef.current) featuredFileRef.current.value = '';
    }
  };

  // Upload a media file or asset for a specific content block (Image, Video, Document)
  const handleBlockFileUpload = async (index: number, file: File) => {
    setBlockUploadPct((prev) => ({ ...prev, [index]: 0 }));
    const blockType = blocks[index]?.type;
    
    const folder =
      blockType === 'video' ? 'news/videos' :
      blockType === 'document' ? 'news/documents' :
      'news/images';

    try {
      const result = await uploadToB2(file, folder, (pct) =>
        setBlockUploadPct((prev) => ({ ...prev, [index]: pct }))
      );
      
      const extra: Partial<RichContentBlock> = { url: result.publicUrl };
      if (blockType === 'document') {
        extra.filename = file.name;
      }
      updateBlock(index, extra);
    } catch (err: any) {
      console.error(`Block ${index} upload failed:`, err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setBlockUploadPct((prev) => ({ ...prev, [index]: null }));
    }
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !slug || !date) {
      alert('Please fill in Title, Slug, and Date.');
      return;
    }

    // Dynamic processing to ensure metadata structural arrays match JSON typing rules
    const processedImportantDates = importantDates
      .filter(d => d.date_title && d.date)
      .map(d => {
        if (typeof d.meta === 'string' && d.meta.trim() !== '') {
          try {
            // Attempt to clean JSON conversion strings safely
            return { ...d, meta: JSON.parse(d.meta) };
          } catch {
            return d;
          }
        }
        return d;
      });

    const payload: Omit<NewsEventItem, 'id'> = {
      title,
      slug,
      type,
      date,
      description,
      image,
      category,
      author,
      content,
      cecRole: cecRole || undefined,
      importantDates: processedImportantDates,
      awardName: awardName || undefined,
      team: team || undefined,
      richContent: blocks,
      isDemo: false,
    };

    try {
      if (id) {
        await newsDbService.updateNewsAndEvent(id, payload);
      } else {
        await newsDbService.createNewsAndEvent(payload);
      }
      navigate('/admin/news');
    } catch (err) {
      console.error('Error saving news item:', err);
      alert('Failed to save item. Check console for details.');
    }
  };

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
      <div className={styles.createContainer}>
        <div className={styles.pageHeader}>
          <Link to="/admin/news" className={styles.backLink} title="Back to Publications">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className={styles.mainTitle}>{id ? 'Edit Publication' : 'New Publication'}</h1>
            <p className={styles.subtitle}>
              {id ? `Modifying database record ID: ${id}` : 'Fill in the fields to create a news article or event'}
            </p>
          </div>
        </div>

        {loadingItem ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className={styles.spinner} />
            <p>Loading publication content from database...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.adminForm}>
            {/* 1. Basic Metadata Card */}
            <div className={styles.formCard}>
              <h2 className={styles.cardSectionTitle}>Basic Publication Details</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Publish Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Milestone, Workshop, Recognition"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="Enter publication title"
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
                  placeholder="e.g. breakthrough-upper-kabeli-hydropower"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Author / Publisher</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Featured Image</label>
                  <div className={styles.uploadFieldRow}>
                    <input
                      type="text"
                      placeholder="Paste URL or upload a file →"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className={styles.formInput}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={featuredFileRef}
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFeaturedImageUpload(f);
                      }}
                    />
                    <button
                      type="button"
                      className={styles.uploadBtn}
                      onClick={() => featuredFileRef.current?.click()}
                      disabled={featuredUploadPct !== null}
                      title="Upload image to Backblaze B2"
                    >
                      {featuredUploadPct !== null ? (
                        <span className={styles.uploadBtnProgress}>{featuredUploadPct}%</span>
                      ) : (
                        <><i className="fas fa-cloud-upload-alt" /> Upload</>  
                      )}
                    </button>
                  </div>
                  {featuredUploadPct !== null && (
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${featuredUploadPct}%` }} />
                    </div>
                  )}
                  {image && (
                    <div className={styles.imagePreview}>
                      <img src={image} alt="Featured preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Brief Description</label>
                <textarea
                  placeholder="Summarize the article or event in 2-3 sentences..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.formTextarea}
                  rows={3}
                />
              </div>
            </div>

            {/* 2. News / Milestone Specific Metadata */}
            <div className={styles.formCard}>
              <h2 className={styles.cardSectionTitle}>News / Milestone Specific Metadata</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>CEC Role (for projects)</label>
                  <input
                    type="text"
                    placeholder="e.g. Design and Supervision Consultant"
                    value={cecRole}
                    onChange={(e) => setCecRole(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>

              {/* Dynamic Milestone Dates Builder */}
              <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                <label>Important Milestone Dates</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '5px' }}>
                  {importantDates.map((dateObj, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Milestone Title (e.g. Project Start Date)"
                        value={dateObj.date_title}
                        onChange={(e) => {
                          const updated = [...importantDates];
                          updated[index] = { ...updated[index], date_title: e.target.value };
                          setImportantDates(updated);
                        }}
                        className={styles.formInput}
                        style={{ flex: 2, minWidth: '150px' }}
                      />
                      <input
                        type="date"
                        value={dateObj.date}
                        onChange={(e) => {
                          const updated = [...importantDates];
                          updated[index] = { ...updated[index], date: e.target.value };
                          setImportantDates(updated);
                        }}
                        className={styles.formInput}
                        style={{ flex: 1.5, minWidth: '130px' }}
                      />
                      <input
                        type="text"
                        placeholder="Meta (optional)"
                        value={dateObj.meta ? (typeof dateObj.meta === 'string' ? dateObj.meta : JSON.stringify(dateObj.meta)) : ''}
                        onChange={(e) => {
                          const updated = [...importantDates];
                          updated[index] = { ...updated[index], meta: e.target.value };
                          setImportantDates(updated);
                        }}
                        className={styles.formInput}
                        style={{ flex: 2, minWidth: '150px' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImportantDates(importantDates.filter((_, idx) => idx !== index));
                        }}
                        className={styles.cancelBtn}
                        style={{ padding: '8px 12px', minWidth: 'auto', margin: 0, height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Delete Milestone Date"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => setImportantDates([...importantDates, { date_title: '', date: '', meta: '' }])}
                    className={styles.cancelBtn}
                    style={{ padding: '8px 16px', minWidth: 'auto', alignSelf: 'flex-start', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className="fas fa-plus"></i> Add Milestone Date
                  </button>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Award / Recognition Name</label>
                  <input
                    type="text"
                    placeholder="e.g. International Engineering Excellence Award 2026"
                    value={awardName}
                    onChange={(e) => setAwardName(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Regional / Project Team</label>
                  <input
                    type="text"
                    placeholder="e.g. Pokhara Office Team, Management"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>

            {/* 3. Rich Block-Based Content Editor */}
            <div className={styles.formCard}>
              <h2 className={styles.cardSectionTitle}>Rich Content Blocks (Layout Builder)</h2>
              
              <div className={styles.richEditorContainer}>
                <div className={styles.blockList}>
                  {blocks.map((block, index) => (
                    <div key={index} className={styles.blockCard}>
                      <div className={styles.blockHeader}>
                        <span className={`${styles.blockTypeBadge} ${
                          block.type === 'paragraph' ? styles.paragraphBadge :
                          block.type === 'image' ? styles.imageBadge :
                          block.type === 'youtube-shorts' ? styles.youtubeBadge :
                          block.type === 'video' ? styles.videoBadge :
                          block.type === 'document' ? styles.documentBadge :
                          styles.facebookBadge
                        }`}>
                          Block #{index + 1}: {block.type}
                        </span>
                        
                        <div className={styles.blockActions}>
                          <button
                            type="button"
                            onClick={() => moveBlock(index, 'up')}
                            className={styles.blockActionBtn}
                            title="Move Up"
                            disabled={index === 0}
                          >
                            <i className="fas fa-arrow-up"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlock(index, 'down')}
                            className={styles.blockActionBtn}
                            title="Move Down"
                            disabled={index === blocks.length - 1}
                          >
                            <i className="fas fa-arrow-down"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBlock(index)}
                            className={`${styles.blockActionBtn} ${styles.deleteBlockBtn}`}
                            title="Delete Block"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>

                      {/* Content block dispatcher views */}
                      {block.type === 'paragraph' ? (
                        <div className={styles.formGroup}>
                          <label>Paragraph Value (HTML tags supported)</label>
                          <textarea
                            placeholder="Write paragraph text..."
                            value={block.value || ''}
                            onChange={(e) => updateBlock(index, { value: e.target.value })}
                            className={styles.formTextarea}
                            rows={4}
                          />
                        </div>
                      ) : block.type === 'document' ? (
                        <div className={styles.formGroup}>
                          <label>Document File</label>
                          <div className={styles.uploadFieldRow}>
                            <input
                              type="text"
                              placeholder="Paste a document URL or upload a file →"
                              value={block.url || ''}
                              onChange={(e) => updateBlock(index, { url: e.target.value })}
                              className={styles.formInput}
                              style={{ flex: 1 }}
                            />
                            <input
                              id={`block-file-${index}`}
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleBlockFileUpload(index, f);
                              }}
                            />
                            <button
                              type="button"
                              className={`${styles.uploadBtn} ${styles.uploadBtnDoc}`}
                              onClick={() => document.getElementById(`block-file-${index}`)?.click()}
                              disabled={blockUploadPct[index] !== null && blockUploadPct[index] !== undefined}
                              title="Upload document to Backblaze B2"
                            >
                              {blockUploadPct[index] !== null && blockUploadPct[index] !== undefined ? (
                                <span className={styles.uploadBtnProgress}>{blockUploadPct[index]}%</span>
                              ) : (
                                <><i className="fas fa-file-upload" /> Upload File</>
                              )}
                            </button>
                          </div>

                          {blockUploadPct[index] !== null && blockUploadPct[index] !== undefined && (
                            <div className={styles.progressBar}>
                              <div className={styles.progressFill} style={{ width: `${blockUploadPct[index]}%` }} />
                            </div>
                          )}

                          {block.url && (
                            <div className={styles.docPreview}>
                              <i className="fas fa-file-alt" />
                              <div className={styles.docPreviewInfo}>
                                <span className={styles.docPreviewName}>
                                  {block.filename || block.url.split('/').pop() || 'Document asset'}
                                </span>
                                <a href={block.url} target="_blank" rel="noopener noreferrer" className={styles.docPreviewLink}>
                                  <i className="fas fa-external-link-alt" /> Open
                                </a>
                              </div>
                            </div>
                          )}

                          <label style={{ marginTop: 12 }}>Label / Description</label>
                          <input
                            type="text"
                            placeholder="e.g. Project Report 2024, Terms of Reference"
                            value={block.caption || ''}
                            onChange={(e) => updateBlock(index, { caption: e.target.value })}
                            className={styles.formInput}
                          />
                        </div>
                      ) : (
                        <div className={styles.formRow}>
                          <div className={styles.formGroup} style={{ flex: 2 }}>
                            <label>Media/Embed URL *</label>
                            <div className={styles.uploadFieldRow}>
                              <input
                                type="text"
                                placeholder={
                                  block.type === 'image' ? 'Paste URL or upload →' :
                                  block.type === 'youtube-shorts' ? 'e.g. https://youtube.com/shorts/...' :
                                  block.type === 'video' ? 'Paste URL or upload →' : 'e.g. Facebook URL'
                                }
                                value={block.url || ''}
                                onChange={(e) => updateBlock(index, { url: e.target.value })}
                                className={styles.formInput}
                                style={{ flex: 1 }}
                              />
                              {(block.type === 'image' || block.type === 'video') && (
                                <>
                                  <input
                                    id={`block-file-${index}`}
                                    type="file"
                                    accept={block.type === 'video' ? 'video/*' : 'image/*'}
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleBlockFileUpload(index, f);
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className={styles.uploadBtn}
                                    onClick={() => document.getElementById(`block-file-${index}`)?.click()}
                                    disabled={blockUploadPct[index] !== null && blockUploadPct[index] !== undefined}
                                    title={`Upload ${block.type} to Backblaze B2`}
                                  >
                                    {blockUploadPct[index] !== null && blockUploadPct[index] !== undefined ? (
                                      <span className={styles.uploadBtnProgress}>{blockUploadPct[index]}%</span>
                                    ) : (
                                      <><i className={block.type === 'video' ? 'fas fa-video' : 'fas fa-image'} /> Upload</>
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                            {blockUploadPct[index] !== null && blockUploadPct[index] !== undefined && (
                              <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${blockUploadPct[index]}%` }} />
                              </div>
                            )}
                            {block.type === 'image' && block.url && (
                              <div className={styles.imagePreview}>
                                <img src={block.url} alt="Block preview" />
                              </div>
                            )}
                          </div>
                          <div className={styles.formGroup} style={{ flex: 1 }}>
                            <label>Caption / Text</label>
                            <input
                              type="text"
                              placeholder="Media Caption"
                              value={block.caption || ''}
                              onChange={(e) => updateBlock(index, { caption: e.target.value })}
                              className={styles.formInput}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Blocks creator tools bar */}
                <div className={styles.blockCreatorRow}>
                  <span className={styles.blockCreatorLabel}>Add Block Element:</span>
                  <button type="button" onClick={() => addBlock('paragraph')} className={styles.addBlockBtn}>
                    <i className="fas fa-paragraph"></i> Paragraph
                  </button>
                  <button type="button" onClick={() => addBlock('image')} className={styles.addBlockBtn}>
                    <i className="fas fa-image"></i> Image
                  </button>
                  <button type="button" onClick={() => addBlock('youtube-shorts')} className={styles.addBlockBtn}>
                    <i className="fab fa-youtube"></i> YouTube Shorts
                  </button>
                  <button type="button" onClick={() => addBlock('video')} className={styles.addBlockBtn}>
                    <i className="fas fa-video"></i> Video
                  </button>
                  <button type="button" onClick={() => addBlock('facebook')} className={styles.addBlockBtn}>
                    <i className="fab fa-facebook"></i> Facebook Embed
                  </button>
                  <button type="button" onClick={() => addBlock('document')} className={`${styles.addBlockBtn} ${styles.addBlockBtnDoc}`}>
                    <i className="fas fa-file-alt"></i> Document
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Text Content Backup */}
            <div className={styles.formCard}>
              <h2 className={styles.cardSectionTitle}>Legacy Text Content (Fallback)</h2>
              <div className={styles.formGroup}>
                <label>Text Content (General plaintext fallback)</label>
                <textarea
                  placeholder="General fallback copy..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={styles.formTextarea}
                  rows={6}
                />
              </div>
            </div>

            {/* Form submission row */}
            <div className={styles.formActions}>
              <button type="button" onClick={() => navigate('/admin/news')} className={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
                {id ? 'Save Changes' : 'Publish to Database'}
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CreateNews;