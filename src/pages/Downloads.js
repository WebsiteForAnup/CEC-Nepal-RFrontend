import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Downloads.module.css';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const downloadResources = [
    {
        id: 1,
        title: 'Hydropower Feasibility Study Template',
        category: 'Templates',
        type: 'PDF',
        size: '2.5 MB',
        description: 'Comprehensive template for hydropower project feasibility studies including technical and financial analysis',
        icon: 'fas fa-file-pdf',
        downloadUrl: '#'
    },
    {
        id: 2,
        title: 'EIA/IEE Guidelines Nepal',
        category: 'Guidelines',
        type: 'PDF',
        size: '1.8 MB',
        description: 'Environmental Impact Assessment and Initial Environmental Examination guidelines for Nepal',
        icon: 'fas fa-file-pdf',
        downloadUrl: '#'
    },
    {
        id: 3,
        title: 'Solar Project Design Checklist',
        category: 'Checklists',
        type: 'DOCX',
        size: '450 KB',
        description: 'Complete checklist for solar energy project design and implementation',
        icon: 'fas fa-file-word',
        downloadUrl: '#'
    },
    {
        id: 4,
        title: 'CEC Company Profile 2024',
        category: 'Company',
        type: 'PDF',
        size: '5.2 MB',
        description: 'Detailed company profile including services, projects, and achievements',
        icon: 'fas fa-file-pdf',
        downloadUrl: '#'
    },
    {
        id: 5,
        title: 'Project Management Framework',
        category: 'Templates',
        type: 'XLSX',
        size: '1.2 MB',
        description: 'Excel-based project management framework for infrastructure projects',
        icon: 'fas fa-file-excel',
        downloadUrl: '#'
    },
    {
        id: 6,
        title: 'Hydropower Technical Standards',
        category: 'Standards',
        type: 'PDF',
        size: '3.4 MB',
        description: 'Technical standards and specifications for hydropower projects in Nepal',
        icon: 'fas fa-file-pdf',
        downloadUrl: '#'
    },
    {
        id: 7,
        title: 'Construction Supervision Report Format',
        category: 'Templates',
        type: 'DOCX',
        size: '680 KB',
        description: 'Standard format for construction supervision and progress reports',
        icon: 'fas fa-file-word',
        downloadUrl: '#'
    },
    {
        id: 8,
        title: 'Renewable Energy Policy Brief',
        category: 'Publications',
        type: 'PDF',
        size: '2.1 MB',
        description: 'Policy brief on renewable energy development in Nepal',
        icon: 'fas fa-file-pdf',
        downloadUrl: '#'
    },
    {
        id: 9,
        title: 'Infrastructure Safety Guidelines',
        category: 'Guidelines',
        type: 'PDF',
        size: '1.9 MB',
        description: 'Comprehensive safety guidelines for infrastructure development projects',
        icon: 'fas fa-file-pdf',
        downloadUrl: '#'
    },
    {
        id: 10,
        title: 'Environmental Monitoring Toolkit',
        category: 'Tools',
        type: 'XLSX',
        size: '890 KB',
        description: 'Excel toolkit for environmental monitoring and compliance tracking',
        icon: 'fas fa-file-excel',
        downloadUrl: '#'
    },
    {
        id: 11,
        title: 'Case Study: Kabeli-B HEP',
        category: 'Case Studies',
        type: 'PDF',
        size: '4.3 MB',
        description: 'Detailed case study of the successful Kabeli-B Hydroelectric Project',
        icon: 'fas fa-file-pdf',
        downloadUrl: '#'
    },
    {
        id: 12,
        title: 'Wind Energy Assessment Guide',
        category: 'Guidelines',
        type: 'PDF',
        size: '2.7 MB',
        description: 'Guide for wind energy resource assessment and site evaluation',
        icon: 'fas fa-file-pdf',
        downloadUrl: '#'
    },
    {
        id: 13,
        title: 'CEC Annual Report 2025',
        category: 'Annual Reports',
        type: 'PDF',
        size: '8.5 MB',
        description: 'Comprehensive annual report covering projects, achievements, and financial performance for 2025',
        icon: 'fas fa-file-pdf',
        downloadUrl: '#'
    },
    {
        id: 14,
        title: 'CEC Annual Report 2024',
        category: 'Annual Reports',
        type: 'PDF',
        size: '7.8 MB',
        description: 'Annual report highlighting major milestones and project deliveries in 2024',
        icon: 'fas fa-file-pdf',
        downloadUrl: '#'
    },
    {
        id: 15,
        title: 'CEC Annual Report 2023',
        category: 'Annual Reports',
        type: 'PDF',
        size: '7.2 MB',
        description: 'Annual report showcasing company growth and completed infrastructure projects in 2023',
        icon: 'fas fa-file-pdf',
        downloadUrl: '#'
    },
    {
        id: 16,
        title: 'CEC Annual Report 2022',
        category: 'Annual Reports',
        type: 'PDF',
        size: '6.9 MB',
        description: 'Annual report detailing renewable energy initiatives and consulting services in 2022',
        icon: 'fas fa-file-pdf',
        downloadUrl: '#'
    },
];

const Downloads = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['all', ...new Set(downloadResources.map(item => item.category))];

    const filteredResources = downloadResources.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleDownload = (resource) => {
        console.log('Downloading:', resource.title);
        // In production, this would trigger actual download
        alert(`Download started: ${resource.title}`);
    };

    return (
        <>
            <Navbar />
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
                            <div key={resource.id} className={styles['download-card']}>
                                <div className={styles['card-icon']}>
                                    <i className={resource.icon}></i>
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
