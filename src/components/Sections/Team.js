import React, { useState } from 'react';
import styles from './Team.module.css';

const Team = ({ teamCategories = {}, menuOptions = [] }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(menuOptions[0] || '');



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

        <div className={styles.categoryGrid}>
          {menuOptions.map(option => (
            <button 
              key={option} 
              className={`${styles.categoryBtn} ${selectedCategory === option ? styles.activeCategoryBtn : ''}`}
              onClick={() => {
                setSelectedCategory(option);
                setSelectedMember(null);
              }}
            >
              {option}
            </button>
          ))}
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
