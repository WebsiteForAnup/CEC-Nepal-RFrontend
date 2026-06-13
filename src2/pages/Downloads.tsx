import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Downloads.module.css';
import NavbarRedesigned from '../components/Layout/Navbar.redesigned';
import Footer from '../components/Layout/Footer';
import downloadsJson from '../data/collections/downloads.json';

interface DownloadResource {
  slug: string;
  category: string;
  title: string;
  description: string;
  icon?: string;
  type: string;
  size: string;
}

const Downloads: React.FC = () => {
    const downloadResources = downloadsJson.downloads as DownloadResource[];
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const categories = ['all', ...Array.from(new Set(downloadResources.map(item => item.category)))];

    const filteredResources = downloadResources.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleDownload = (resource: DownloadResource) => {
        console.log('Downloading:', resource.title);
        // In production, this would trigger actual download
        alert(`Download started: ${resource.title}`);
    };

    return (
        <>
            <NavbarRedesigned />
            <main className={styles['main-content']}>
                {/* Hero Section */}
                <div className={styles['hero-section']}>
                    <div className={styles['hero-overlay']}>
                        <div className={styles['hero-content']}>
                            <h1>Downloads Center</h1>
                            <p>Access our comprehensive collection of resources including annual reports, project templates, technical guidelines, environmental standards, case studies, and industry tools. Download professional materials to support your infrastructure and renewable energy projects.</p>
                        </div>
                    </div>
                </div>

                <div className={styles['container']}>
                    {/* Search and Filter Section */}
                    <div className={styles['controls-section']}>
                        <div className={styles['search-box']}>
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search for resources..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className={styles['filter-buttons']}>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`${styles['filter-btn']} ${selectedCategory === category ? styles['active'] : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category === 'all' ? 'All Resources' : category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Downloads Grid */}
                    <div className={styles['downloads-grid']}>
                        {filteredResources.map(resource => (
                            <div key={resource.slug} className={styles['download-card']}>
                                <div className={styles['card-icon']}>
                                    {resource.icon && <i className={resource.icon}></i>}
                                </div>
                                <div className={styles['card-content']}>
                                    <div className={styles['card-header']}>
                                        <h3>{resource.title}</h3>
                                        <span className={styles['category-badge']}>{resource.category}</span>
                                    </div>
                                    <p className={styles['description']}>{resource.description}</p>
                                    <div className={styles['card-meta']}>
                                        <span className={styles['file-type']}>
                                            <i className="fas fa-file"></i> {resource.type}
                                        </span>
                                        <span className={styles['file-size']}>
                                            <i className="fas fa-hdd"></i> {resource.size}
                                        </span>
                                    </div>
                                    <button 
                                        className={styles['download-btn']}
                                        onClick={() => handleDownload(resource)}
                                    >
                                        <i className="fas fa-download"></i>
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredResources.length === 0 && (
                        <div className={styles['no-results']}>
                            <i className="fas fa-search"></i>
                            <h3>No resources found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    )}

                    {/* Stats Section */}
                    <div className={styles['stats-section']}>
                        <div className={styles['stat-item']}>
                            <i className="fas fa-download"></i>
                            <h3>{downloadResources.length}</h3>
                            <p>Resources Available</p>
                        </div>
                        <div className={styles['stat-item']}>
                            <i className="fas fa-folder-open"></i>
                            <h3>{categories.length - 1}</h3>
                            <p>Categories</p>
                        </div>
                        <div className={styles['stat-item']}>
                            <i className="fas fa-users"></i>
                            <h3>1000+</h3>
                            <p>Downloads</p>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className={styles['info-banner']}>
                        <i className="fas fa-info-circle"></i>
                        <div>
                            <h4>Need Custom Documentation?</h4>
                            <p>Contact our team for customized templates, reports, or technical documentation tailored to your project needs.</p>
                        </div>
                        <button onClick={() => navigate('/#contact')}>
                            Contact Us
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Downloads;
