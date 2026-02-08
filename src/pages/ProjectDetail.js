import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './ProjectDetail.module.css';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

// Image arrays from cecnepal.com.np
const serviceImages = [
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Survey.png',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Desk.png',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Mapping.png',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Detailed-Engineering.png',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Construction-Supervision.png',
    'https://cecnepal.com.np/wp-content/uploads/2024/01/0-02-03-6caf56c02a149e4ba48702ff0a0e52fb25dad5469ecc879ffe5f58462b77cf18_59eccfe8a97d9d44.jpg',
    'https://cecnepal.com.np/wp-content/uploads/2024/02/viber_image_2024-02-05_13-28-15-068.jpg',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Discharge-Measurement.jpg',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Road-Design-Analysis.jpg',
    'https://cecnepal.com.np/wp-content/uploads/2024/12/Geotechnical-InvestigationCore-Drilling-1.jpg',
];

const statusImages = {
    'generation': 'https://cecnepal.com.np/wp-content/uploads/2023/10/CEC-studies-Project.jpg',
    'under construction': 'https://cecnepal.com.np/wp-content/uploads/2024/12/Construction-Supervision.png',
    'ppa stage': 'https://cecnepal.com.np/wp-content/uploads/2024/12/Desk.png',
    'testing and commissioning': 'https://cecnepal.com.np/wp-content/uploads/2024/02/viber_image_2024-02-05_13-28-15-068.jpg',
};

// Get rotated service image based on project ID
const getServiceImage = (projectId) => {
    return serviceImages[projectId % serviceImages.length];
};

// Get image for project based on status and ID
const getProjectImage = (project) => {
    const normalizedStatus = project.status.toLowerCase();
    const statusImage = statusImages[normalizedStatus];
    const serviceImage = getServiceImage(project.id);
    // Alternate between status and service images for variety
    return (project.id % 2 === 0 ? statusImage : serviceImage) || statusImage || serviceImage;
};

const projectsData = [
    { id: 1, name: 'Kabeli-B HEP', capacity: '25 MW', developer: 'Arun Kabeli Power Limited', status: 'Generation', cecInputs: 'FSR/UFSR/Bank Technical Audit', type: 'Hydroelectric', location: 'Eastern Nepal', commissioned: '2019', description: 'A run-of-river hydroelectric project located in eastern Nepal, providing clean energy to the national grid. This strategic project demonstrates excellence in sustainable energy development with comprehensive technical audit and supervision.', technicalDetails: { headHeight: '156 m', discharge: '19.5 m³/s', type: 'Run-of-River', turbineType: 'Pelton'}, timeline: ['Feasibility Study - 2014', 'DPR Completion - 2015', 'Construction Start - 2016', 'Commissioning - 2019']},
    { id: 2, name: 'Jogmai Khola SHP', capacity: '7.60 MW', developer: 'Sanvi Energy Pvt. Ltd.', status: 'Generation', cecInputs: 'Bank Monitoring/Supervision', type: 'Small Hydro', location: 'Mid-Hills', commissioned: '2020', description: 'Small hydropower project utilizing the Jogmai Khola river for sustainable electricity generation. Features comprehensive bank monitoring and construction supervision ensuring quality and financial compliance.', technicalDetails: { headHeight: '127 m', discharge: '7.2 m³/s', type: 'Run-of-River', turbineType: 'Francis'}, timeline: ['Planning - 2015', 'Approval - 2016', 'Construction - 2017-2019', 'Operation - 2020']},
    { id: 3, name: 'Upper Puwa I SHP', capacity: '3.00 MW', developer: 'Joshi Hydropower Company Pvt. Ltd.', status: 'Generation', cecInputs: 'Bank Monitoring', type: 'Small Hydro', location: 'Western Hills', commissioned: '2018', description: 'Eco-friendly hydropower facility designed to minimize environmental impact while maximizing energy output. Ongoing bank monitoring ensures sustained operational excellence.', technicalDetails: { headHeight: '98 m', discharge: '4.1 m³/s', type: 'Run-of-River', turbineType: 'Pelton'}, timeline: ['Feasibility - 2014', 'Design - 2015', 'Construction - 2016-2017', 'Commissioned - 2018']},
    { id: 4, name: 'Piluwa Khola SHP', capacity: '3.0 MW', developer: 'Joshi Hydropower Company Pvt. Ltd.', status: 'Generation', cecInputs: 'O/M and Technical Audit', type: 'Small Hydro', location: 'Eastern Nepal', commissioned: '2017', description: 'Small hydropower plant providing reliable operation and maintenance with comprehensive technical audits. CEC provides ongoing technical support and operational optimization services.', technicalDetails: { headHeight: '105 m', discharge: '3.8 m³/s', type: 'Run-of-River', turbineType: 'Pelton'}, timeline: ['Survey - 2013', 'DPR - 2014', 'Construction - 2015-2016', 'Operation - 2017']},
    { id: 5, name: 'Lower Piluwa HPP', capacity: '990 kW', developer: 'Baneshwor Hydropower Pvt. Ltd', status: 'Generation', cecInputs: 'DPR', type: 'Micro Hydro', location: 'Eastern Region', commissioned: '2019', description: 'Compact hydropower facility delivering clean energy through efficient detailed project reporting and design. Demonstrates viability of micro-hydropower for rural electrification.', technicalDetails: { headHeight: '78 m', discharge: '1.8 m³/s', type: 'Run-of-River', turbineType: 'Cross-flow'}, timeline: ['Planning - 2016', 'DPR - 2017', 'Construction - 2018', 'Commissioned - 2019']},
    { id: 6, name: 'Hewa Khola SHP', capacity: '4.5 MW', developer: 'Barun Hydropower Company Limited', status: 'Generation', cecInputs: 'DPR', type: 'Small Hydro', location: 'Far-Eastern Nepal', commissioned: '2020', description: 'Successfully operating hydropower project utilizing Hewa Khola river resources for sustainable energy production. CEC provided comprehensive DPR and technical guidance throughout development.', technicalDetails: { headHeight: '112 m', discharge: '5.5 m³/s', type: 'Run-of-River', turbineType: 'Francis'}, timeline: ['Feasibility - 2015', 'DPR - 2016', 'Construction - 2017-2019', 'Operation - 2020']},
    { id: 7, name: 'Taksar Pikhuwa Khola HPP', capacity: '8.0 MW', developer: 'Taksar Pikhuwa Khola Hydropower Pvt. Ltd.', status: 'Generation', cecInputs: 'Bank Monitoring', type: 'Small Hydro', location: 'Mid-Hills Region', commissioned: '2021', description: 'Medium-scale hydropower facility with ongoing bank monitoring ensuring financial and operational excellence. CEC provides continuous oversight and technical support.', technicalDetails: { headHeight: '145 m', discharge: '7.2 m³/s', type: 'Run-of-River', turbineType: 'Pelton'}, timeline: ['Survey - 2015', 'Approval - 2016', 'Construction - 2017-2020', 'Commissioned - 2021']},
    { id: 8, name: 'Upper Khorunga Khola SHP', capacity: '7.5 MW', developer: 'Terhathum Power Company Limited', status: 'Generation', cecInputs: 'FSR/DPR/Supervision', type: 'Small Hydro', location: 'Terhathum District', commissioned: '2020', description: 'Comprehensive hydropower project with full-cycle engineering from feasibility study to supervision and commissioning. Exemplifies CEC excellence in complete project lifecycle management.', technicalDetails: { headHeight: '128 m', discharge: '7.8 m³/s', type: 'Run-of-River', turbineType: 'Francis'}, timeline: ['FSR - 2014', 'DPR - 2015', 'Construction - 2016-2019', 'Commissioned - 2020']},
    { id: 9, name: 'Jiri Khola SHP', capacity: '2.40 MW', developer: 'Bojini Company Pvt. Ltd.', status: 'Generation', cecInputs: 'DPR', type: 'Small Hydro', location: 'Central Hills', commissioned: '2018', description: 'Small-scale run-of-river project contributing to local energy security and rural electrification initiatives. CEC DPR ensured technical and economic viability.', technicalDetails: { headHeight: '92 m', discharge: '3.5 m³/s', type: 'Run-of-River', turbineType: 'Pelton'}, timeline: ['Planning - 2015', 'DPR - 2016', 'Construction - 2017', 'Operation - 2018']},
    { id: 10, name: 'Singati Khola Hydropower Project', capacity: '25 MW', developer: 'Singati HydroEergy Pvt. Ltd.', status: 'Generation', cecInputs: 'Due Diligence/Bank Monitoring', type: 'Hydroelectric', location: 'Dolakha District', commissioned: '2021', description: 'Major hydropower installation with rigorous due diligence and continuous bank oversight for optimal performance. Strategic project contributing significantly to national grid.', technicalDetails: { headHeight: '168 m', discharge: '18.5 m³/s', type: 'Run-of-River', turbineType: 'Pelton'}, timeline: ['Due Diligence - 2014', 'Approval - 2015', 'Construction - 2016-2020', 'Commissioned - 2021']},
    { id: 26, name: 'Upper Phawa HEP', capacity: '5.80 MW', developer: 'Unitech Hydropower Company Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Monitoring', type: 'Small Hydro', location: 'Mid-Hills', estimated: '2025', description: 'Hydropower project currently under construction with active bank monitoring for quality assurance. CEC provides continuous oversight ensuring adherence to technical standards and budget compliance.', technicalDetails: { headHeight: '118 m', discharge: '6.5 m³/s', type: 'Run-of-River', turbineType: 'Francis'}, timeline: ['Planning - 2020', 'Approval - 2021', 'Construction Start - 2022', 'Expected COD - 2025']},
    { id: 27, name: 'Mewa Khola HEP', capacity: '50.00 MW', developer: 'United Mewa Khola Hydropower Pvt. Ltd.', status: 'Under Construction', cecInputs: 'Bank Due Diligence', type: 'Medium Hydro', location: 'Eastern Nepal', estimated: '2026', description: 'Major hydropower development progressing with comprehensive financial oversight and construction monitoring. One of the larger projects under CEC technical guidance.', technicalDetails: { headHeight: '245 m', discharge: '25.8 m³/s', type: 'Run-of-River', turbineType: 'Francis'}, timeline: ['Feasibility - 2018', 'DPR - 2019', 'Financial Close - 2021', 'Expected COD - 2026']},
    { id: 54, name: 'Upper Kabeli HPP', capacity: '28.10 MW', developer: 'Peace Energy Pvt. Ltd.', status: 'PPA Stage', cecInputs: 'FSR/UFSR/DPR', type: 'Hydroelectric', location: 'Taplejung District', estimated: 'TBD', description: 'Hydropower project at PPA stage with complete feasibility studies and detailed engineering reports. CEC provided comprehensive technical documentation for regulatory approvals and financing.', technicalDetails: { headHeight: '185 m', discharge: '19.2 m³/s', type: 'Run-of-River', turbineType: 'Pelton'}, timeline: ['FSR - 2019', 'UFSR - 2020', 'DPR - 2021', 'PPA Negotiations - Ongoing']},
];

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const project = projectsData.find(p => p.id === parseInt(id));

    if (!project) {
        return (
            <>
                <Navbar />
                <div className={styles['container']}>
                    <div className={styles['not-found']}>
                        <h1>Project Not Found</h1>
                        <p>The project you're looking for doesn't exist.</p>
                        <button onClick={() => navigate('/#projects')} className={styles['back-btn']}>
                            Back to Projects
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const relatedProjects = projectsData
        .filter(p => p.id !== project.id && (p.status === project.status || p.type === project.type))
        .slice(0, 3);

    const getStatusColor = (status) => {
        const colors = {
            'Generation': '#10b981',
            'Under Construction': '#f59e0b',
            'PPA Stage': '#3b82f6',
            'Testing and Commissioning': '#8b5cf6'
        };
        return colors[status] || '#6b7280';
    };

    return (
        <>
            <Navbar />
            <main className={styles['main-content']}>
                <div className={styles['container']}>
                    {/* Breadcrumb */}
                    <nav className={styles['breadcrumb']}>
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/#projects">Projects</Link>
                        <span>/</span>
                        <span>{project.name}</span>
                    </nav>

                    {/* Hero Section */}
                    <div className={styles['hero-section']}>
                        <img src={getProjectImage(project)} alt={project.name} />
                        <div className={styles['hero-overlay']}>
                            <div className={styles['hero-content']}>
                                <div className={styles['hero-badge']} style={{background: getStatusColor(project.status)}}>
                                    {project.status}
                                </div>
                                <h1>{project.name}</h1>
                                <div className={styles['hero-meta']}>
                                    <span><i className="fas fa-bolt"></i> {project.capacity}</span>
                                    <span><i className="fas fa-map-marker-alt"></i> {project.location}</span>
                                    <span><i className="fas fa-industry"></i> {project.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Wrapper */}
                    <div className={styles['content-wrapper']}>
                        {/* Main Content */}
                        <article className={styles['detail-content']}>
                            {/* Project Description */}
                            <section className={styles['project-description']}>
                                <h2>Project Overview</h2>
                                <p>{project.description}</p>
                            </section>

                            {/* Technical Specifications */}
                            {project.technicalDetails && (
                                <section className={styles['technical-section']}>
                                    <h2>Technical Specifications</h2>
                                    <div className={styles['specs-grid']}>
                                        <div className={styles['spec-item']}>
                                            <i className="fas fa-ruler-vertical"></i>
                                            <div>
                                                <strong>Head Height</strong>
                                                <span>{project.technicalDetails.headHeight}</span>
                                            </div>
                                        </div>
                                        <div className={styles['spec-item']}>
                                            <i className="fas fa-water"></i>
                                            <div>
                                                <strong>Design Discharge</strong>
                                                <span>{project.technicalDetails.discharge}</span>
                                            </div>
                                        </div>
                                        <div className={styles['spec-item']}>
                                            <i className="fas fa-project-diagram"></i>
                                            <div>
                                                <strong>Project Type</strong>
                                                <span>{project.technicalDetails.type}</span>
                                            </div>
                                        </div>
                                        <div className={styles['spec-item']}>
                                            <i className="fas fa-cog"></i>
                                            <div>
                                                <strong>Turbine Type</strong>
                                                <span>{project.technicalDetails.turbineType}</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Project Timeline */}
                            {project.timeline && project.timeline.length > 0 && (
                                <section className={styles['timeline-section']}>
                                    <h2>Project Timeline</h2>
                                    <div className={styles['timeline']}>
                                        {project.timeline.map((milestone, index) => (
                                            <div key={index} className={styles['timeline-item']}>
                                                <div className={styles['timeline-marker']}></div>
                                                <div className={styles['timeline-content']}>
                                                    <p>{milestone}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* CTA Section */}
                            <div className={styles['cta-section']}>
                                <h2>Interested in Similar Projects?</h2>
                                <p>Contact our team to discuss your hydropower development needs</p>
                                <button 
                                    className={styles['contact-btn']}
                                    onClick={() => navigate('/#contact')}
                                >
                                    Get in Touch
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className={styles['sidebar']}>
                            {/* Project Info Card */}
                            <div className={styles['info-card']}>
                                <h3>Project Information</h3>
                                <div className={styles['info-item']}>
                                    <strong>Capacity:</strong>
                                    <span>{project.capacity}</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <strong>Developer:</strong>
                                    <span>{project.developer}</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <strong>Status:</strong>
                                    <span className={styles['status-badge']} style={{background: getStatusColor(project.status)}}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className={styles['info-item']}>
                                    <strong>Location:</strong>
                                    <span>{project.location}</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <strong>Type:</strong>
                                    <span>{project.type}</span>
                                </div>
                                {(project.commissioned || project.estimated) && (
                                    <div className={styles['info-item']}>
                                        <strong>{project.commissioned ? 'Commissioned:' : 'Expected COD:'}</strong>
                                        <span>{project.commissioned || project.estimated}</span>
                                    </div>
                                )}
                                <div className={styles['info-item']}>
                                    <strong>CEC Services:</strong>
                                    <span>{project.cecInputs}</span>
                                </div>
                            </div>

                            {/* Related Projects */}
                            {relatedProjects.length > 0 && (
                                <div className={styles['related-projects']}>
                                    <h3>Related Projects</h3>
                                    <div className={styles['projects-list']}>
                                        {relatedProjects.map(p => (
                                            <Link 
                                                key={p.id}
                                                to={`/project/${p.id}`}
                                                className={styles['project-link']}
                                            >
                                                <div className={styles['project-link-content']}>
                                                    <span className={styles['project-name']}>{p.name}</span>
                                                    <span className={styles['project-capacity']}>{p.capacity}</span>
                                                </div>
                                                <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contact Card */}
                            <div className={styles['contact-card']}>
                                <h3>Need More Info?</h3>
                                <p>Our project team is ready to provide detailed information about this and similar projects.</p>
                                <button 
                                    className={styles['contact-btn-small']}
                                    onClick={() => navigate('/#contact')}
                                >
                                    Contact Us
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ProjectDetail;
