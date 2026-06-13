import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import NavbarRedesigned from '../../components/Layout/Navbar.redesigned';
import Footer from '../../components/Layout/Footer';
import { newsDbService, NewsEventItem } from '../../services/newsDbService';
import { authClient } from '../../lib/auth';
import { SignedIn, SignedOut } from '@neondatabase/neon-js/auth/react';
import styles from './CreateEvent.module.css';

interface RichContentBlock {
  type: 'paragraph' | 'image' | 'video' | 'youtube-shorts' | 'facebook';
  value?: string;
  url?: string;
  caption?: string;
}

const CreateEvent: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const session = authClient.useSession();
  
  // Base Page States
  const [loadingItem, setLoadingItem] = useState<boolean>(false);
  
  // Form Fields
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [category, setCategory] = useState<string>('Workshop');
  const [author, setAuthor] = useState<string>('CEC Events');
  const [content, setContent] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [status, setStatus] = useState<string>('Active');
  const [capacity, setCapacity] = useState<string>('');
  const [registration, setRegistration] = useState<string>('');
  const [trainer, setTrainer] = useState<string>('');
  const [coordinator, setCoordinator] = useState<string>('');

  // Rich Content Blocks State
  const [blocks, setBlocks] = useState<RichContentBlock[]>([]);

  // Load editing item if ID exists in URL
  useEffect(() => {
    if (id) {
      setLoadingItem(true);
      newsDbService.getNewsAndEvents()
        .then((data) => {
          const item = data.find(i => String(i.id) === String(id));
          if (item && item.type === 'event') {
            setTitle(item.title);
            setSlug(item.slug);
            setDate(item.date);
            setDescription(item.description || '');
            setImage(item.image || '');
            setCategory(item.category || 'Workshop');
            setAuthor(item.author || 'CEC Events');
            setContent(item.content || '');
            setLocation(item.location || '');
            setStatus(item.status || 'Active');
            setCapacity(item.capacity || '');
            setRegistration(item.registration || '');
            setTrainer(item.trainer || '');
            setCoordinator(item.coordinator || '');
            setBlocks(item.richContent || []);
          }
          setLoadingItem(false);
        })
        .catch((err) => {
          console.error('Failed to load event for editing', err);
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
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !slug || !date) {
      alert('Please fill in Title, Slug, and Date.');
      return;
    }

    const payload: Omit<NewsEventItem, 'id'> = {
      title,
      slug,
      type: 'event', // Force Event type
      date,
      description,
      image,
      category,
      author,
      content,
      location: location || undefined,
      status: status || undefined,
      capacity: capacity || undefined,
      registration: registration || undefined,
      trainer: trainer || undefined,
      coordinator: coordinator || undefined,
      richContent: blocks,
      isDemo: false,
    };

    try {
      if (id) {
        await newsDbService.updateNewsAndEvent(id, payload);
      } else {
        await newsDbService.createNewsAndEvent(payload);
      }
      navigate('/admin/events');
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Failed to save event. Check console for details.');
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
              Please sign in to manage events. Authenticated actions are secured by database policy.
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
        {/* Header section with back arrow */}
        <div className={styles.pageHeader}>
          <Link to="/admin/events" className={styles.backLink} title="Back to Events">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className={styles.mainTitle}>{id ? 'Edit Event' : 'New Event'}</h1>
            <p className={styles.subtitle}>
              {id ? `Modifying database record ID: ${id}` : 'Fill in the fields to create an upcoming event'}
            </p>
          </div>
        </div>

        {loadingItem ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className={styles.spinner} />
            <p>Loading event content from database...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.adminForm}>
            {/* 1. Basic Metadata Card */}
            <div className={styles.formCard}>
              <h2 className={styles.cardSectionTitle}>Basic Event Details</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Event Date *</label>
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
                    placeholder="e.g. Workshop, Seminar, Community"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Event Title *</label>
                <input
                  type="text"
                  placeholder="Enter event title"
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
                  placeholder="e.g. industry-seminar-future-of-renewable-energy"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Organizer / Host</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Featured Event Image URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /images/events/seminar.jpg or Unsplash link"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Brief Description</label>
                <textarea
                  placeholder="Summarize the event in 2-3 sentences..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.formTextarea}
                  rows={3}
                />
              </div>
            </div>

            {/* 2. Event Specific settings */}
            <div className={styles.formCard}>
              <h2 className={styles.cardSectionTitle}>Event Setup & Logistics</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. CEC Nepal Headquarters, Kathmandu"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g. 200 participants"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <input
                    type="text"
                    placeholder="e.g. Registration Open, Completed"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Registration Status</label>
                  <input
                    type="text"
                    placeholder="e.g. Available on website"
                    value={registration}
                    onChange={(e) => setRegistration(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Trainer / Expert Speaker</label>
                  <input
                    type="text"
                    placeholder="e.g. Expert Consultants"
                    value={trainer}
                    onChange={(e) => setTrainer(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Coordinator / Department</label>
                  <input
                    type="text"
                    placeholder="e.g. CSR Department"
                    value={coordinator}
                    onChange={(e) => setCoordinator(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>

            {/* 3. Rich Block-Based Content Editor */}
            <div className={styles.formCard}>
              <h2 className={styles.cardSectionTitle}>Rich Content Blocks (Layout Builder)</h2>
              
              <div className={styles.richEditorContainer}>
                {/* Blocks list */}
                <div className={styles.blockList}>
                  {blocks.map((block, index) => (
                    <div key={index} className={styles.blockCard}>
                      <div className={styles.blockHeader}>
                        <span className={`${styles.blockTypeBadge} ${
                          block.type === 'paragraph' ? styles.paragraphBadge : 
                          block.type === 'image' ? styles.imageBadge : 
                          block.type === 'youtube-shorts' ? styles.youtubeBadge : 
                          block.type === 'video' ? styles.videoBadge : styles.facebookBadge
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

                      {/* Content inside each block */}
                      {block.type === 'paragraph' ? (
                        <div className={styles.formGroup}>
                          <label>Paragraph Value (HTML elements like strong/em supported)</label>
                          <textarea
                            placeholder="Write paragraph text..."
                            value={block.value || ''}
                            onChange={(e) => updateBlock(index, { value: e.target.value })}
                            className={styles.formTextarea}
                            rows={4}
                          />
                        </div>
                      ) : (
                        <div className={styles.formRow}>
                          <div className={styles.formGroup} style={{ flex: 2 }}>
                            <label>Media/Embed URL *</label>
                            <input
                              type="text"
                              placeholder={
                                block.type === 'image' ? 'e.g. /images/events/photo.jpg' : 
                                block.type === 'youtube-shorts' ? 'e.g. https://youtube.com/shorts/...' : 
                                block.type === 'video' ? 'e.g. https://assets.mixkit.co/...' : 'e.g. Facebook URL'
                              }
                              value={block.url || ''}
                              onChange={(e) => updateBlock(index, { url: e.target.value })}
                              className={styles.formInput}
                              required
                            />
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
              <button type="button" onClick={() => navigate('/admin/events')} className={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
                {id ? 'Save Changes' : 'Publish Event'}
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

export default CreateEvent;
