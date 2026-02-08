import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './ServiceDetail.module.css';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const servicesData = [
    {
        id: 1,
        icon: 'fas fa-water',
        title: 'Hydropower',
        shortDescription: 'Feasibility and EPCM for hydroelectric projects.',
        image: '/images/services/hydropower.jpg',
        category: 'Energy',
        content: `Hydropower development is one of our core competencies. We provide comprehensive services across the entire project lifecycle from initial feasibility studies to detailed project reports and implementation support.

Our Expertise:
- Feasibility Studies and Prefeasibility Reports
- Detailed Project Reports (DPR)
- Hydrological and Hydrodynamic Studies
- Geotechnical Engineering
- Environmental and Social Impact Assessment
- EPCM Services (Engineering, Procurement, Construction Management)
- Operation and Maintenance Support

Key Projects:
We have successfully completed over 150 MW of hydropower projects with various developers and international lenders. Our team combines local expertise with international best practices to ensure project success.

Why Choose Us:
- Over 15 years of experience in hydropower development
- Track record of successful project completions
- International quality standards
- Expert team with global exposure
- Strong relationships with lenders and developers`,
        benefits: [
            'Reduced project risks through comprehensive feasibility',
            'Optimized project design for maximum efficiency',
            'International quality standards compliance',
            'Timely project delivery and completion',
            'Sustainable development practices'
        ],
        process: [
            'Initial Consultation and Site Visit',
            'Feasibility Study and Preliminary Design',
            'Detailed Engineering and DPR Preparation',
            'Lender Engagement and Approval',
            'Implementation and Construction Support',
            'Operations and Maintenance Advisory'
        ]
    },
    {
        id: 2,
        icon: 'fas fa-solar-panel',
        title: 'Solar Energy',
        shortDescription: 'Utility-scale solar farms and grid integration.',
        image: '/images/services/solar-1.jpg',
        category: 'Renewable Energy',
        content: `Solar energy is transitioning from niche to mainstream power generation. We provide end-to-end solutions for utility-scale solar projects with focus on maximum energy yield and grid integration.

Our Services:
- Solar Resource Assessment and Mapping
- Technology Selection and Optimization
- Detailed Project Reports (DPR)
- Grid Integration Studies
- Environmental Impact Assessment
- Design and Engineering Support
- EPCM Services (Engineering, Procurement, Construction Management)
- O&M Strategy Development

Capabilities:
We specialize in large-scale utility projects ranging from 5 MW to 50+ MW capacity. Our expertise covers different terrain types including flat lands, hilly regions, and rooftop installations.

Project Examples:
- 25 MW Solar Farm (Central Nepal) - Grid Connected
- 10 MW Solar Array (Eastern Nepal) - Hybrid System
- 5 MW Community Solar Project (Western Nepal)

Technology Partners:
We work with leading solar equipment manufacturers and technology providers to ensure optimal project performance.`,
        benefits: [
            'High return on investment with predictable cash flows',
            'Minimal environmental impact',
            'Reduced operational complexity',
            'Grid stability support through proper integration',
            'Community benefits and employment generation'
        ],
        process: [
            'Site Evaluation and Resource Assessment',
            'Technology and Layout Optimization',
            'Detailed Design and Engineering',
            'Environmental and Social Studies',
            'Permitting and Approvals',
            'Construction Support and Commissioning',
            'Performance Monitoring and O&M'
        ]
    },
    {
        id: 3,
        icon: 'fas fa-leaf',
        title: 'Environment',
        shortDescription: 'Detailed EIA/IEE assessments and green compliance.',
        image: '/images/services/environment.jpg',
        category: 'Environmental Services',
        content: `Environmental sustainability is integral to all our projects. We provide comprehensive environmental and social impact assessments ensuring compliance with international standards and national regulations.

Services Offered:
- Environmental Impact Assessment (EIA)
- Initial Environmental Examination (IEE)
- Resettlement Action Plans (RAP)
- Community Compensation Framework
- Biodiversity Assessment and Management Plans
- Water Quality and Quantity Studies
- Air and Noise Impact Assessment
- Occupational Health and Safety Planning
- Environmental Monitoring and Audit

Regulatory Expertise:
Our team has extensive experience with:
- Nepal Environmental Protection Act
- Operation Directives and Guidelines
- World Bank and ADB Safeguard Policies
- IFC Performance Standards
- Multilateral Development Bank Requirements

Track Record:
We have successfully completed EIA/IEE for 50+ projects with zero regulatory rejections. Our assessments consistently receive positive feedback from government agencies and lenders.`,
        benefits: [
            'Regulatory compliance and reduced legal risks',
            'Community acceptance and social license',
            'Identification and mitigation of environmental hazards',
            'Enhanced project sustainability',
            'Long-term operational stability',
            'Lender confidence and easy financing'
        ],
        process: [
            'Scope Definition and Baseline Studies',
            'Impact Identification and Assessment',
            'Mitigation Measures Development',
            'Stakeholder Consultation',
            'Final Report Preparation',
            'Regulatory Approval Support',
            'Monitoring and Compliance Verification'
        ]
    },
    {
        id: 4,
        icon: 'fas fa-bridge',
        title: 'Infrastructure',
        shortDescription: 'Bridges, tunnels, and highways in Himalayan geology.',
        image: '/images/services/infrastructure.jpg',
        category: 'Civil Works',
        content: `Infrastructure development in challenging Himalayan terrain requires specialized expertise. We provide comprehensive engineering support for bridges, tunnels, and road infrastructure in difficult geological and geographic conditions.

Core Competencies:
- Bridge Design and Engineering (Multiple Specifications)
- Tunnel Design and Excavation Planning
- Highway and Road Engineering
- Geological and Geotechnical Surveys
- Slope Stability Analysis
- Foundation Engineering
- Quality Control and Testing
- Construction Supervision

Specialized Services:
- Himalayan Terrain Navigation
- Earthquake and Seismic Engineering
- High Altitude Construction Challenges
- Landslide Mitigation
- Drainage and Hydrology Management

Notable Projects:
- 200m Span Bridge (Eastern Nepal) - Completed
- 1.5 km Tunnel Project (Central Nepal) - In Progress
- 50 km Highway Development (Northern Nepal) - Under Design

Equipment and Technology:
We utilize state-of-the-art surveying equipment, 3D modeling tools, and international design standards to ensure maximum safety and efficiency.`,
        benefits: [
            'Safe and durable infrastructure solutions',
            'Optimized design for rugged terrain',
            'Cost-effective construction methodology',
            'Reduced environmental impact',
            'Long lifespan and minimal maintenance',
            'Enhanced regional connectivity'
        ],
        process: [
            'Site Investigation and Surveys',
            'Geological and Geotechnical Assessment',
            'Preliminary Design and Alignment',
            'Detailed Engineering and DPR',
            'Environmental and Social Clearance',
            'Tender Document Preparation',
            'Construction Supervision and Quality Assurance'
        ]
    },
    {
        id: 5,
        icon: 'fas fa-wind',
        title: 'Wind Energy',
        shortDescription: 'Resource mapping and turbine layout optimization.',
        image: '/images/services/wind-1.jpg',
        category: 'Renewable Energy',
        content: `Wind energy holds significant potential in Nepal's mountain regions. We provide comprehensive feasibility and design services for wind power projects from resource assessment to implementation planning.

Services Include:
- Wind Resource Assessment and Mapping
- Micro-siting and Layout Optimization
- Wake Effect Analysis
- Detailed Project Reports (DPR)
- Foundation and Structural Design
- Grid Integration Assessment
- Environmental and Bird Impact Studies
- EPCM Support Services
- O&M Training and Support

Technical Expertise:
- Advanced wind modeling software
- Multi-year wind data validation
- International technical standards
- Grid integration protocols
- Maintenance planning

Project Experience:
We have completed wind resource assessments for potential sites across Nepal with identified capacity of 200+ MW. Our studies have informed policy development for wind energy in Nepal.

Strategic Advantages:
- Nepal's geography offers excellent wind resources
- Seasonal wind patterns support renewable energy goals
- Integration with hydropower provides complementary generation
- Growing government incentives for renewable energy`,
        benefits: [
            'Clean and renewable energy generation',
            'Excellent resource potential in mountain regions',
            'Low operating costs once installed',
            'Rapid deployment capability',
            'Community benefit through local employment',
            'Grid stability through predictable generation'
        ],
        process: [
            'Wind Resource Assessment',
            'Site Characterization Study',
            'Micro-siting Analysis',
            'Detailed Design and Layout',
            'Environmental Impact Assessment',
            'Feasibility Report Preparation',
            'Project Implementation Support'
        ]
    },
    {
        id: 6,
        icon: 'fas fa-handshake',
        title: 'Project Consulting',
        shortDescription: 'Lender\'s engineering and technical audits.',
        image: '/images/services/consulting.jpg',
        category: 'Technical Advisory',
        content: `Technical consulting and lender's engineering services are critical for successful project financing. We provide independent technical assessment and advisory services to development banks, commercial banks, and other lenders.

Consulting Services:
- Lender's Engineering Assessment
- Independent Technical Audits
- Risk Assessment and Mitigation
- Due Diligence Studies
- Technical Appraisal for Financing
- Project Management Consulting
- Organizational Development Advisory
- Training and Capacity Building

Lender Relationships:
We have worked with:
- World Bank and IDA
- Asian Development Bank (ADB)
- International Finance Corporation (IFC)
- European Bank for Reconstruction and Development (EBRD)
- Various Commercial Banks and Impact Investors

Assessment Capabilities:
- Technical feasibility appraisal
- Financial and commercial analysis
- Operational readiness assessment
- Risk identification and mitigation planning
- Monitoring and supervision frameworks
- Performance evaluation studies

Value Proposition:
Our independent assessments provide lenders confidence in project viability and reduce financing risks. We ensure borrowers understand technical requirements and constraints.`,
        benefits: [
            'Enhanced lender confidence for easier financing',
            'Reduced project risks through thorough assessment',
            'Improved project management and execution',
            'Expert guidance on technical challenges',
            'Compliance with international standards',
            'Career development for project teams'
        ],
        process: [
            'Scope Definition with Client',
            'Data Collection and Review',
            'Field Investigations and Assessments',
            'Technical Analysis and Risk Assessment',
            'Reporting and Recommendations',
            'Presentation and Follow-up Support',
            'Ongoing Advisory Services'
        ]
    }
];

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const service = servicesData.find(s => s.id === parseInt(id));

    if (!service) {
        return (
            <>
                <Navbar />
                <div className={styles['container']}>
                    <div className={styles['not-found']}>
                        <h1>Service Not Found</h1>
                        <p>The service you're looking for doesn't exist.</p>
                        <button onClick={() => navigate('/#services')} className={styles['back-btn']}>
                            Back to Services
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const otherServices = servicesData.filter(s => s.id !== service.id).slice(0, 3);

    return (
        <>
            <Navbar />
            <main className={styles['main-content']}>
                <div className={styles['container']}>
                    {/* Breadcrumb */}
                    <nav className={styles['breadcrumb']}>
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/#services">Services</Link>
                        <span>/</span>
                        <span>{service.title}</span>
                    </nav>

                    {/* Hero Section */}
                    <div className={styles['hero-section']}>
                        <img src={service.image} alt={service.title} />
                        <div className={styles['hero-overlay']}>
                            <div className={styles['hero-content']}>
                                <i className={`${service.icon} ${styles['hero-icon']}`}></i>
                                <h1>{service.title}</h1>
                                <p className={styles['hero-description']}>{service.shortDescription}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles['content-wrapper']}>
                        {/* Main Content */}
                        <article className={styles['detail-content']}>
                            <div className={styles['service-body']}>
                                {service.content.split('\n\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>

                            {/* Benefits Section */}
                            <div className={styles['benefits-section']}>
                                <h2>Key Benefits</h2>
                                <div className={styles['benefits-grid']}>
                                    {service.benefits.map((benefit, index) => (
                                        <div key={index} className={styles['benefit-card']}>
                                            <i className="fas fa-check-circle"></i>
                                            <p>{benefit}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Process Section */}
                            <div className={styles['process-section']}>
                                <h2>Our Process</h2>
                                <div className={styles['process-timeline']}>
                                    {service.process.map((step, index) => (
                                        <div key={index} className={styles['process-step']}>
                                            <div className={styles['step-number']}>{index + 1}</div>
                                            <div className={styles['step-content']}>
                                                <h3>{step}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Section */}
                            <div className={styles['cta-section']}>
                                <h2>Ready to Get Started?</h2>
                                <p>Contact our team to discuss your project requirements</p>
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
                            {/* Service Overview Card */}
                            <div className={styles['overview-card']}>
                                <h3>Service Overview</h3>
                                <div className={styles['overview-item']}>
                                    <strong>Category:</strong>
                                    <span>{service.category}</span>
                                </div>
                                <div className={styles['overview-item']}>
                                    <strong>Experience:</strong>
                                    <span>15+ Years</span>
                                </div>
                                <div className={styles['overview-item']}>
                                    <strong>Projects:</strong>
                                    <span>50+ Completed</span>
                                </div>
                            </div>

                            {/* Other Services */}
                            {otherServices.length > 0 && (
                                <div className={styles['related-services']}>
                                    <h3>Other Services</h3>
                                    <div className={styles['services-list']}>
                                        {otherServices.map(s => (
                                            <Link 
                                                key={s.id}
                                                to={`/service/${s.id}`}
                                                className={styles['service-link']}
                                            >
                                                <i className={s.icon}></i>
                                                <span>{s.title}</span>
                                                <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contact Card */}
                            <div className={styles['contact-card']}>
                                <h3>Need Help?</h3>
                                <p>Our team is ready to assist you with all your service needs.</p>
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

export default ServiceDetail;
