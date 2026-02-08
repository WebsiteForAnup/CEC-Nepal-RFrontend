import React, { useState } from 'react';
import styles from './Gallery.module.css';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const galleryImages = [
    {
        id: 1,
        title: 'Survey Operations',
        category: 'Field Work',
        image: 'https://cecnepal.com.np/wp-content/uploads/2024/12/Survey.png',
        description: 'Advanced surveying and mapping operations for hydropower projects'
    },
    {
        id: 2,
        title: 'Desk Studies',
        category: 'Engineering',
        image: 'https://cecnepal.com.np/wp-content/uploads/2024/12/Desk.png',
        description: 'Comprehensive desk studies and technical analysis'
    },
    {
        id: 3,
        title: 'GIS Mapping',
        category: 'Technology',
        image: 'https://cecnepal.com.np/wp-content/uploads/2024/12/Mapping.png',
        description: 'Geographic Information System mapping and spatial analysis'
    },
    {
        id: 4,
        title: 'Detailed Engineering',
        category: 'Engineering',
        image: 'https://cecnepal.com.np/wp-content/uploads/2024/12/Detailed-Engineering.png',
        description: 'Detailed engineering design and project planning'
    },
    {
        id: 5,
        title: 'Construction Supervision',
        category: 'Construction',
        image: 'https://cecnepal.com.np/wp-content/uploads/2024/12/Construction-Supervision.png',
        description: 'On-site construction supervision and quality control'
    },
    {
        id: 6,
        title: 'Project Site Visit',
        category: 'Field Work',
        image: 'https://cecnepal.com.np/wp-content/uploads/2024/01/0-02-03-6caf56c02a149e4ba48702ff0a0e52fb25dad5469ecc879ffe5f58462b77cf18_59eccfe8a97d9d44.jpg',
        description: 'Team conducting site inspection and assessment'
    },
    {
        id: 7,
        title: 'Team Collaboration',
        category: 'Team',
        image: 'https://cecnepal.com.np/wp-content/uploads/2024/02/viber_image_2024-02-05_13-28-15-068.jpg',
        description: 'Collaborative project planning and execution'
    },
    {
        id: 8,
        title: 'Discharge Measurement',
        category: 'Hydrology',
        image: 'https://cecnepal.com.np/wp-content/uploads/2024/12/Discharge-Measurement.jpg',
        description: 'Hydrological measurements and river discharge analysis'
    },
    {
        id: 9,
        title: 'Road Design Analysis',
        category: 'Infrastructure',
        image: 'https://cecnepal.com.np/wp-content/uploads/2024/12/Road-Design-Analysis.jpg',
        description: 'Infrastructure design and road network planning'
    },
    {
        id: 10,
        title: 'Geotechnical Investigation',
        category: 'Geology',
        image: 'https://cecnepal.com.np/wp-content/uploads/2024/12/Geotechnical-InvestigationCore-Drilling-1.jpg',
        description: 'Core drilling and geotechnical site investigation'
    },
    {
        id: 11,
        title: 'Hydropower Project Studies',
        category: 'Projects',
        image: 'https://cecnepal.com.np/wp-content/uploads/2023/10/CEC-studies-Project.jpg',
        description: 'Comprehensive hydropower feasibility studies'
    },
];

const Gallery = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);

    const categories = ['all', ...new Set(galleryImages.map(img => img.category))];

    const filteredImages = selectedCategory === 'all' 
        ? galleryImages 
        : galleryImages.filter(img => img.category === selectedCategory);

    return (
        <>
            <Navbar />
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
                    <div className={styles['gallery-grid']}>
                        {filteredImages.map(image => (
                            <div 
                                key={image.id} 
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
