import React, { useState } from 'react';
import styles from './Team.module.css';

const Team = () => {
  const teamCategories = {
    'Board of Directors': [
      {
        id: 1,
        name: 'Mr. Mani Raj Dahal',
        designation: 'Founder & Director',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2024/01/mani-raj-dahal-768x576.jpg',
        education: 'MSc Hydraulic Engineering & River Basin Development (Delft, Netherlands), BE Civil Engineering (IOE Pulchowk)',
        experience: '25+ years in hydropower sector, technical consultant for numerous hydropower projects',
        bio: 'Founder and Director of Clean Energy Consultants Pvt. Ltd., one of Nepal\'s leading hydropower consultancy firms with extensive expertise in hydropower development and technical consultancy.'
      },
      {
        id: 2,
        name: 'Er. Santosh Dhakal',
        designation: 'Board Director & Electrical Expert',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2024/12/Er-S-Photo.png',
        education: 'ME Electrical Engineering',
        experience: '18+ years as Electrical Engineer and Electromechanical Expert at CEC, 60+ hydropower projects designed',
        bio: 'Board Director at Clean Energy Consultants since mid-2006. Has led the electrical and electromechanical design for approximately 60 hydropower projects with several more under feasibility and detailed design stages. Currently working with Hydro Tasmania, Australia.'
      },
      {
        id: 3,
        name: 'Mr. Narayan Poudel',
        designation: 'Finance Director',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2024/12/image_2024-12-24_202752759.png',
        education: 'Chartered Accountant',
        experience: 'Extensive professional experience in finance and project financial analysis',
        bio: 'Finance Director at Clean Energy Consultants Pvt. Ltd. Leads financial feasibility studies, project financial analysis, and overall financial assessment for hydropower projects. Also serves as Finance Director for Aayu Entertainment Pvt. Ltd. and Chairman of Finman Services Pvt. Ltd.'
      },
      {
        id: 4,
        name: 'Er. Kosa Raj Chapagain',
        designation: 'Project Director & Board Member',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Kosa-Raj-Chapagain-1536x1152.jpg',
        education: 'BE Civil Engineering',
        experience: '12+ years as Senior Civil Engineer and Project Manager at CEC',
        bio: 'Project Director and Board Member at Clean Energy Consultants since mid-2011. Brings extensive expertise in feasibility studies, detailed design, and project monitoring. Responsible for overseeing major hydropower project implementations and technical delivery.'
      }
    ],
    'Key Personnel': [
      {
        id: 5,
        name: 'Dr. Chhatra Basnet',
        designation: 'Chief Executive Officer (CEO)',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Chhatra-Basnet-2048x1536.jpg',
        education: 'PhD Rock Mechanics, MSc Hydropower Development',
        experience: '12+ years at Clean Energy Consultants Pvt. Ltd., strategic leadership and innovation',
        bio: 'Chief Executive Officer with 12 years of pivotal experience at Clean Energy Consultants Pvt. Ltd. Dr. Basnet has shaped the company\'s strategic direction, driving innovation and sustainable engineering practices in the hydropower sector. Leads organizational vision and technical excellence.'
      }
    ],
    'Technical Directors & Senior Experts': [
      {
        id: 6,
        name: 'Dr. Bishnu Raj Baral',
        designation: 'Technical Director – Hydraulics & Sediment Transport',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Bishnu-R-Baral-1474x1536.jpg',
        education: 'PhD/MSc Hydraulic Engineering and Sediment Transport',
        experience: '5 years international research (UK, Italy, Netherlands), 15+ years hydropower consulting',
        bio: 'Technical Director specializing in river hydraulics, sediment transport, and numerical/physical modelling. Expert in feasibility studies, detailed design, and construction supervision. Founding member of Policy and Planning Commission of Gandaki Province. Brings cutting-edge international expertise to CEC\'s technical team.'
      },
      {
        id: 7,
        name: 'Mr. Ghan Bahadur Shrestha',
        designation: 'Geologist / RS & GIS / Tunneling & Geophysics Expert',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Ghan-B-Shrestha-1536x1152.jpg',
        education: 'MSc Geology',
        experience: 'Major national projects: Nalsing Gad (410 MW), Melamchi Water Supply, Kabeli-3 (49 MW), Upper Chameliya (40 MW)',
        bio: 'Geological and geophysical expert with specialized expertise in geological mapping, geophysical surveys, drilling supervision, GIS, and remote sensing. Extensive experience on significant national hydropower projects. Brings critical earth science expertise to complex feasibility and design phases.'
      }
    ],
    'Engineering & Project Team': [
      {
        id: 8,
        name: 'Er. Dinesh Silwal',
        designation: 'Construction Engineer',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Dinesh-Silwal-1536x1152.jpg',
        education: 'BE Civil Engineering (PU), MSc Construction Management (PU)',
        experience: '13 years in construction engineering and project management',
        bio: 'Experienced Construction Engineer with 13 years of expertise in construction supervision, project management, and site engineering. Specializes in hydropower project execution and quality assurance.'
      },
      {
        id: 9,
        name: 'Er. K.B. Garamja',
        designation: 'Civil Engineer',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Kamal-B-Garamja-1342x1536.jpg',
        bio: 'Senior Civil Engineer with 10 years of experience in hydropower project design and implementation. Contributes to feasibility studies and detailed engineering design.'
      },
      {
        id: 10,
        name: 'Er. Rabin Aryal',
        designation: 'Structural Engineer',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Rabin-Aryal-1536x1152.jpg',
        bio: 'Structural Engineer with 5 years of specialized experience in dam design, structural analysis, and civil works for hydropower projects.'
      },
      {
        id: 11,
        name: 'Er. Prajwal Khatiwada',
        designation: 'Electrical Engineer',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-28-at-11.09.31_3e9eedbb.jpg',
        bio: 'Electrical Engineer focusing on electrical design, power system analysis, and electromechanical component specification for hydropower facilities.'
      },
      {
        id: 12,
        name: 'Er. Nanda Lal Pal',
        designation: 'Mechanical Engineer',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Nanda-Lal-Pal.jpg',
        bio: 'Mechanical Engineer with expertise in turbine-generator systems, penstock design, and mechanical systems for hydropower projects.'
      },
      {
        id: 13,
        name: 'Er. Prajwal Poudel',
        designation: 'Hydropower Engineer',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/WhatsApp-Image-2023-10-08-at-12.31.15_6360e318.jpg',
        bio: 'Specialized Hydropower Engineer with advanced expertise in run-of-river and storage hydropower systems. Contributes to feasibility studies, design optimization, and project development.'
      },
      {
        id: 14,
        name: 'Mr. Rajan Mahat',
        designation: 'Engineering Geologist',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Rajan-Mahat.jpg',
        bio: 'Engineering Geologist providing geological mapping, geotechnical investigations, and site characterization for hydropower projects.'
      },
      {
        id: 15,
        name: 'Er. Charchit Khan Thakuri',
        designation: 'Civil Engineer',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Charchit-Thakuri-.jpg',
        bio: 'Civil Engineer specializing in detailed engineering design and construction management for hydropower facilities.'
      },
      {
        id: 16,
        name: 'Er. Bharat Bista',
        designation: 'Civil Engineer',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-28-at-11.02.31_6aeed208-1152x1536.jpg',
        bio: 'Civil Engineer contributing to project development, technical design support, and site investigations.'
      },
      {
        id: 17,
        name: 'Er. Suraj Shreesh',
        designation: 'Site Engineer',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Suraj-Shreesh.jpg',
        bio: 'Site Engineer with specialized expertise in tunneling, rock engineering, and construction site management for hydropower projects.'
      }
    ],
    'Finance & Support Team': [
      {
        id: 18,
        name: 'Ms. Minu Chitrakar',
        designation: 'Draft Person',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Minu-Chitrakar-1152x1536.jpg',
        bio: 'Senior Drafter with 23 years of experience in preparing technical drawings, CAD documentation, and design visualization for hydropower projects.'
      },
      {
        id: 19,
        name: 'Mr. Pramod Gautam',
        designation: 'Engineering Geologist',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Pramod-Gautam-1263x1536.jpg',
        education: 'MSc Engineering Geology (TU)',
        experience: '1 year in geological support and site assessment',
        bio: 'Engineering Geologist providing geological and geotechnical support for project investigations and feasibility studies.'
      },
      {
        id: 20,
        name: 'Mr. Purna Raj Tamang',
        designation: 'Site Engineer',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Purna-B-Tamang-1280x1536.jpg',
        education: 'Diploma in Civil Engineering (TU)',
        experience: '1 year in site operations and project coordination',
        bio: 'Site Engineer supporting field operations, site investigations, and project coordination activities.'
      },
      {
        id: 21,
        name: 'Mr. Buddha Raj Tamang',
        designation: 'Assistant Accountant',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Buddha-R-Tamang.jpg',
        education: '+2 Management',
        experience: '3 years in accounting and financial administration',
        bio: 'Assistant Accountant managing financial records, accounting transactions, and administrative support for project accounts.'
      },
      {
        id: 22,
        name: 'Mr. Karma Raj Tamang',
        designation: 'Head Accountant',
        image_url: 'https://cecnepal.com.np/wp-content/uploads/2023/11/Karma-R-Tamang.jpg',
        education: 'MBS (TU)',
        experience: '15 years in accounting, finance administration, and financial management',
        bio: 'Head Accountant with 15 years of comprehensive experience in financial management, project accounting, cost tracking, and financial reporting.'
      }
    ]
  };

  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Board of Directors');

  const menuOptions = Object.keys(teamCategories);

  const renderContent = () => {
    const currentTeam = teamCategories[selectedCategory] || [];
    
    return (
      <div className={styles.teamListContainer}>
        {currentTeam.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No team members in this category.</p>
          </div>
        ) : (
          <div className={styles.teamMembersList}>
            {currentTeam.map(member => (
              <div 
                key={member.id} 
                className={styles.teamMemberCard}
                onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
              >
                <div className={styles.memberHeader}>
                  <div className={styles.memberHeaderContent}>
                    {member.image_url && (
                      <div className={styles.memberImageSmall}>
                        <img src={member.image_url} alt={member.name} />
                      </div>
                    )}
                    <div>
                      <h3 className={styles.memberName}>{member.name}</h3>
                      <p className={styles.memberDesignation}>{member.designation}</p>
                    </div>
                  </div>
                  <button className={styles.expandBtn}>
                    {selectedMember?.id === member.id ? '−' : '+'}
                  </button>
                </div>

                {selectedMember?.id === member.id && (
                  <div className={styles.memberDetails}>
                    {member.image_url && (
                      <div className={styles.memberImageLarge}>
                        <img src={member.image_url} alt={member.name} />
                      </div>
                    )}
                    <div className={styles.detailSection}>
                      <p className={styles.detailLabel}>Education:</p>
                      <p className={styles.detailText}>{member.education}</p>
                    </div>
                    <div className={styles.detailSection}>
                      <p className={styles.detailLabel}>Experience:</p>
                      <p className={styles.detailText}>{member.experience}</p>
                    </div>
                    <div className={styles.detailSection}>
                      <p className={styles.detailLabel}>Overview:</p>
                      <p className={styles.detailText}>{member.bio}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="team" className={styles.team}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Our Team</h2>
          <p>Meet the experts behind CEC Nepal's success</p>
          <div className={styles.line}></div>
        </div>

        <div className={styles.dropdownContainer}>
          <select 
            value={selectedCategory} 
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedMember(null);
            }}
            className={styles.dropdownSelect}
          >
            {menuOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {renderContent()}

        <div className={styles.teamStats}>
          <div className={styles.statItem}>
            <h4>23+</h4>
            <p>Professional Team Members</p>
          </div>
          <div className={styles.statItem}>
            <h4>380+</h4>
            <p>Combined Years of Experience</p>
          </div>
          <div className={styles.statItem}>
            <h4>5</h4>
            <p>Specialized Departments</p>
          </div>
        </div>

        <div className={styles.joinTeamBox}>
          <h3>Join Our Team</h3>
          <p>We're always looking for talented engineers and consultants passionate about clean energy.</p>
          <a href="#contact" className={styles.ctaButton}>Contact Us for Opportunities</a>
        </div>
      </div>
    </section>
  );
};

export default Team;
