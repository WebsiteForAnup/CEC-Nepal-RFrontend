import React, { useState, useEffect } from 'react';
import styles from './Gallery.module.css';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import { galleryDbService, GalleryImage } from '../services/galleryDbService';

const Gallery: React.FC = () => {
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    useEffect(() => {
        setLoading(true);
        galleryDbService.getAllGalleryImages()
            .then(data => {
                setGalleryImages(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch gallery images:", err);
                setLoading(false);
            });
    }, []);

    const categories = ['all', ...Array.from(new Set(galleryImages.map(img => img.category)))];

    const filteredImages = selectedCategory === 'all' 
        ? galleryImages 
        : galleryImages.filter(img => img.category === selectedCategory);

    return (
        <>
            <NavbarRedesigned />
            <main className={styles['main-content']}>
                {/* Hero Section */}
                <div className={styles['hero-section']}>
                    <div className={styles['hero-overlay']}>
                        <div className={styles['hero-content']}>
                            <h1>Project Gallery</h1>
                            <p>Showcasing our expertise in engineering, construction, and renewable energy projects</p>
                        </div>
                    </div>
                </div>

                <div className={styles['container']}>
                    {/* Category Filter */}
                    <div className={styles['filter-section']}>
                        <h2>Filter by Category</h2>
                        <div className={styles['filter-buttons']}>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`${styles['filter-btn']} ${selectedCategory === category ? styles['active'] : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category === 'all' ? 'All Images' : category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '15px' }}>
                            <div className={styles['spinner']} />
                            <p style={{ color: '#64748b', fontSize: '15px' }}>Loading project gallery...</p>
                        </div>
                    ) : filteredImages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                            <i className="fas fa-image" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px', display: 'block' }}></i>
                            <p>No gallery images found.</p>
                        </div>
                    ) : (
                        <div className={styles['gallery-grid']}>
                            {filteredImages.map(image => (
                                <div 
                                    key={image.slug} 
                                    className={styles['gallery-item']}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <img src={image.image} alt={image.title} />
                                    <div className={styles['image-overlay']}>
                                        <div className={styles['image-info']}>
                                            <span className={styles['category-badge']}>{image.category}</span>
                                            <h3>{image.title}</h3>
                                            <p>{image.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stats Section */}
                    <div className={styles['stats-section']}>
                        <div className={styles['stat-item']}>
                            <i className="fas fa-images"></i>
                            <h3>{galleryImages.length}</h3>
                            <p>Total Images</p>
                        </div>
                        <div className={styles['stat-item']}>
                            <i className="fas fa-folder"></i>
                            <h3>{categories.length - 1}</h3>
                            <p>Categories</p>
                        </div>
                        <div className={styles['stat-item']}>
                            <i className="fas fa-project-diagram"></i>
                            <h3>50+</h3>
                            <p>Projects</p>
                        </div>
                    </div>
                </div>

                {/* Lightbox Modal */}
                {selectedImage && (
                    <div className={styles['lightbox']} onClick={() => setSelectedImage(null)}>
                        <div className={styles['lightbox-content']} onClick={(e) => e.stopPropagation()}>
                            <button className={styles['close-btn']} onClick={() => setSelectedImage(null)}>
                                <i className="fas fa-times"></i>
                            </button>
                            <img src={selectedImage.image} alt={selectedImage.title} />
                            <div className={styles['lightbox-info']}>
                                <span className={styles['category-badge']}>{selectedImage.category}</span>
                                <h2>{selectedImage.title}</h2>
                                <p>{selectedImage.description}</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
};

export default Gallery;
