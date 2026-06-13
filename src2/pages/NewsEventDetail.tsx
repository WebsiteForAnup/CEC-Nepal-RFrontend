import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './NewsEventDetail.module.css';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import newsJson from '../data/collections/news-events/feed.json';
import labelMappings from '../data/global/label-mappings.json';
import { trackEvent } from '../utils/analytics';

interface YoutubeParsed {
  embedUrl: string;
  isShort: boolean;
}

const parseYoutubeUrl = (url: string | undefined): YoutubeParsed | null => {
    if (!url) return null;
    
    let videoId = '';
    let isShort = false;

    try {
        if (url.includes('/shorts/')) {
            isShort = true;
            const parts = url.split('/shorts/');
            if (parts[1]) {
                videoId = parts[1].split(/[?#]/)[0];
            }
        } else if (url.includes('youtu.be/')) {
            const parts = url.split('youtu.be/');
            if (parts[1]) {
                videoId = parts[1].split(/[?#]/)[0];
            }
        } else if (url.includes('youtube.com/watch')) {
            const urlObj = new URL(url);
            videoId = urlObj.searchParams.get('v') || '';
        } else if (url.includes('youtube.com/embed/')) {
            const parts = url.split('youtube.com/embed/');
            if (parts[1]) {
                videoId = parts[1].split(/[?#]/)[0];
            }
        }
    } catch (e) {
        console.error('Error parsing YouTube URL:', e);
    }

    if (videoId) {
        return {
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            isShort
        };
    }
    
    return {
        embedUrl: url,
        isShort: url.includes('/shorts/')
    };
};

interface RichContentBlock {
  type: string;
  value?: string;
  url?: string;
  caption?: string;
}

interface NewsEventItem {
  id: number;
  slug: string;
  title: string;
  image?: string;
  type?: string;
  date?: string;
  author?: string;
  category?: string;
  location?: string;
  capacity?: string;
  registration?: string;
  excerpt?: string;
  description?: string;
  content?: string;
  isDemo?: boolean;
  relatedNewsSlugs?: string[];
  projectSpecs?: {
    title?: string;
    [key: string]: any;
  };
  richContent?: RichContentBlock[];
}

const NewsEventDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const allNewsEvents = (newsJson.newsAndEvents || []) as NewsEventItem[];
    const sampleNewsEvents = process.env.NODE_ENV === 'production'
        ? allNewsEvents.filter(item => !item.isDemo)
        : allNewsEvents;
    const item = sampleNewsEvents.find(item => item.slug === id || (id && item.id === parseInt(id)));

    React.useEffect(() => {
        if (item?.title) {
            trackEvent('content_loaded', 'News & Events', item.title);
        }
    }, [item]);

    if (!item) {
        return (
            <>
                <NavbarRedesigned />
                <div className={styles['container']}>
                    <div className={styles['not-found']}>
                        <h1>News or Event Not Found</h1>
                        <p>The page you're looking for doesn't exist.</p>
                        <button onClick={() => navigate('/')} className={styles['back-btn']}>
                            Back to Home
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return '';
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString('en-US', options);
        } catch (e) {
            return dateString;
        }
    };

    const relatedItems = sampleNewsEvents.filter(
        news => item.relatedNewsSlugs && item.relatedNewsSlugs.includes(news.slug)
    );

    const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'email') => {
        if (typeof window === 'undefined') return;
        
        const shareUrl = encodeURIComponent(window.location.href);
        const shareTitle = encodeURIComponent(item.title);
        
        let url = '';
        switch (platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
                break;
            case 'email':
                url = `mailto:?subject=${shareTitle}&body=${encodeURIComponent("Check out this article: ")}${shareUrl}`;
                break;
            default:
                return;
        }
        
        if (platform === 'email') {
            window.location.href = url;
        } else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <>
            <NavbarRedesigned />
            <main className={styles['main-content']}>
                <div className={styles['container']}>
                    {/* Breadcrumb */}
                    <nav className={styles['breadcrumb']}>
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/#news-events">News & Events</Link>
                        <span>/</span>
                        <span>{item.title}</span>
                    </nav>

                    {/* Detail Content */}
                    <article className={styles['detail-content']}>
                        {/* Hero Image */}
                        {item.image && (
                            <div className={styles['hero-image']}>
                                <img src={item.image} alt={item.title || ''} />
                                {item.type && (
                                    <div className={styles['badge-container']}>
                                        <span className={`${styles['badge']} ${styles[item.type] || ''}`}>
                                            {item.type === 'news' ? 'News' : 'Event'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Article Header */}
                        <div className={styles['article-header']}>
                            {item.title && <h1 className={styles['title']}>{item.title}</h1>}
                            
                            {/* Meta Information */}
                            <div className={styles['meta-info']}>
                                {item.date && (
                                    <div className={styles['meta-item']}>
                                        <i className="fas fa-calendar"></i>
                                        <span>{formatDate(item.date)}</span>
                                    </div>
                                )}
                                {item.author && (
                                    <div className={styles['meta-item']}>
                                        <i className="fas fa-user"></i>
                                        <span>{item.author}</span>
                                    </div>
                                )}
                                {item.category && (
                                    <div className={styles['meta-item']}>
                                        <i className="fas fa-tag"></i>
                                        <span>{item.category}</span>
                                    </div>
                                )}
                                {item.type === 'event' && item.location && (
                                    <div className={styles['meta-item']}>
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span>{item.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Details for Events */}
                        {item.type === 'event' && (item.date || item.location || item.capacity || item.registration) && (
                            <div className={styles['event-details']}>
                                <div className={styles['detail-box']}>
                                    <h3>Event Details</h3>
                                    <div className={styles['detail-grid']}>
                                        {item.date && (
                                            <div className={styles['detail-item']}>
                                                <strong>Date & Time:</strong>
                                                <p>{formatDate(item.date)}</p>
                                            </div>
                                        )}
                                        {item.location && (
                                            <div className={styles['detail-item']}>
                                                <strong>Location:</strong>
                                                <p>{item.location}</p>
                                            </div>
                                        )}
                                        {item.capacity && (
                                            <div className={styles['detail-item']}>
                                                <strong>Capacity:</strong>
                                                <p>{item.capacity}</p>
                                            </div>
                                        )}
                                        {item.registration && (
                                            <div className={styles['detail-item']}>
                                                <strong>Registration:</strong>
                                                <p>{item.registration}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Project Specifications */}
                        {item.projectSpecs && Object.entries(item.projectSpecs).filter(([key, val]) => key !== 'title' && val !== null && val !== undefined && val !== '').length > 0 && (
                            <div className={styles['project-details']}>
                                <div className={styles['detail-box']}>
                                    <h3>{item.projectSpecs.title || "Project Specifications"}</h3>
                                    <div className={styles['detail-grid']}>
                                        {Object.entries(item.projectSpecs)
                                            .filter(([key, val]) => key !== 'title' && val !== null && val !== undefined && val !== '')
                                            .map(([key, value]) => {
                                                const specMappings = (labelMappings.projectSpecs || {}) as Record<string, string>;
                                                let label = specMappings[key] || key
                                                    .replace(/([A-Z])/g, ' $1')
                                                    .replace(/^./, (str) => str.toUpperCase());

                                                let displayValue = value;
                                                if (key.toLowerCase().includes('date') && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                                                    displayValue = formatDate(value);
                                                }

                                                return (
                                                    <div key={key} className={styles['detail-item']}>
                                                        <strong>{label}:</strong>
                                                        <p>{displayValue}</p>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Article Content */}
                        <div className={styles['article-body']}>
                            {item.richContent && item.richContent.length > 0 ? (
                                item.richContent.map((block, index) => {
                                    switch (block.type) {
                                        case 'paragraph':
                                            return (
                                                <p key={index} className={styles['rich-media-paragraph']} dangerouslySetInnerHTML={{ __html: block.value || '' }} />
                                            );
                                        case 'image':
                                            return (
                                                <figure key={index} className={styles['rich-media-figure']}>
                                                    <img src={block.url} alt={block.caption || ''} className={styles['rich-media-image']} />
                                                    {block.caption && <figcaption className={styles['rich-media-caption']}>{block.caption}</figcaption>}
                                                </figure>
                                            );
                                        case 'youtube':
                                        case 'youtube-shorts': {
                                            const ytData = parseYoutubeUrl(block.url);
                                            const embedUrl = ytData ? ytData.embedUrl : (block.url || '');
                                            const isShort = block.type === 'youtube-shorts' || (ytData ? ytData.isShort : false);
                                            return (
                                                <div key={index} className={styles['rich-media-container']}>
                                                    <div className={isShort ? styles['shorts-wrapper'] : styles['video-wrapper']}>
                                                        <iframe
                                                            src={embedUrl}
                                                            title={block.caption || "YouTube video"}
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                    {block.caption && <p className={styles['rich-media-caption']}>{block.caption}</p>}
                                                </div>
                                            );
                                        }
                                        case 'video':
                                            return (
                                                <div key={index} className={styles['rich-media-container']}>
                                                    <div className={styles['video-wrapper']}>
                                                        <video controls width="100%">
                                                            <source src={block.url} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    </div>
                                                    {block.caption && <p className={styles['rich-media-caption']}>{block.caption}</p>}
                                                </div>
                                            );
                                        case 'facebook':
                                            return (
                                                <div key={index} className={styles['rich-media-container']}>
                                                    <div className={styles['facebook-wrapper']}>
                                                        <iframe
                                                            src={block.url}
                                                            width="500"
                                                            height="650"
                                                            scrolling="no"
                                                            frameBorder="0"
                                                            allowFullScreen={true}
                                                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                                            title={block.caption || "Facebook Post"}
                                                        ></iframe>
                                                    </div>
                                                    {block.caption && <p className={styles['rich-media-caption']}>{block.caption}</p>}
                                                </div>
                                            );
                                        default:
                                            return null;
                                    }
                                })
                            ) : item.content ? (
                                item.content.split('\n\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))
                            ) : null}
                        </div>

                        {/* CTA Button for Events */}
                        {item.type === 'event' && (
                            <div className={styles['cta-section']}>
                                <button className={styles['register-btn']}>
                                    Register Now
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        )}
                    </article>

                    {/* Sidebar */}
                    <aside className={styles['sidebar']}>
                        {/* Related Articles */}
                        {relatedItems.length > 0 && (
                            <div className={styles['related-section']}>
                                <h3>Related {item.type === 'news' ? 'News' : 'Events'}</h3>
                                <div className={styles['related-list']}>
                                    {relatedItems.map(relatedItem => (
                                        <Link 
                                            key={relatedItem.slug}
                                            to={`/news-event/${relatedItem.slug}`}
                                            className={styles['related-item']}
                                        >
                                            <img src={relatedItem.image} alt={relatedItem.title} />
                                            <div className={styles['related-content']}>
                                                <h4>{relatedItem.title}</h4>
                                                <span className={styles['related-date']}>
                                                    {formatDate(relatedItem.date)}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Share Section */}
                        <div className={styles['share-section']}>
                            <h3>Share</h3>
                            <div className={styles['share-buttons']}>
                                <button className={styles['share-btn']} title="Share on Facebook" onClick={() => handleShare('facebook')}>
                                    <i className="fab fa-facebook-f"></i>
                                </button>
                                <button className={styles['share-btn']} title="Share on Twitter" onClick={() => handleShare('twitter')}>
                                    <i className="fab fa-twitter"></i>
                                </button>
                                <button className={styles['share-btn']} title="Share on LinkedIn" onClick={() => handleShare('linkedin')}>
                                    <i className="fab fa-linkedin-in"></i>
                                </button>
                                <button className={styles['share-btn']} title="Share via Email" onClick={() => handleShare('email')}>
                                    <i className="fas fa-envelope"></i>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default NewsEventDetail;
