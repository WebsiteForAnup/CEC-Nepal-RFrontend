import React, { useState } from 'react';
import styles from './Team.module.css';
import teamRegistry from '../../data/collections/team/registry.json';
import { getTeamCategories } from '../../services/teamService';

const mappedCategories = getTeamCategories();

const Team = ({ 
  teamCategories = mappedCategories, 
  menuOptions = Object.keys(mappedCategories),
  title = teamRegistry.title || "Our Team",
  subtitle = teamRegistry.subtitle || "Meet the experts behind CEC Nepal's success",
  stats = teamRegistry.stats || [],
  joinTeam = teamRegistry.joinTeam || {}
}) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(menuOptions[0] || Object.keys(teamCategories)[0] || '');

  const renderContent = () => {
    const currentTeam = teamCategories[selectedCategory] || [];

    return (
      <div className={styles.teamGrid}>
        {currentTeam.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No team members found in this category.</p>
          </div>
        ) : (
          currentTeam.map(member => (
            <div
              key={member.id}
              className={styles.memberCard}
            >
              <div className={styles.cardImageWrapper}>
                <img src={member.image_url} alt={member.name} />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.designation}</p>
                <button
                  className={styles.moreInfoBtn}
                  onClick={() => {
                    setSelectedMember(member);
                    document.body.style.overflow = 'hidden';
                  }}
                >
                  More Info
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const closeModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <section id="team" className={styles.team}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
          <div className={styles.line}></div>
        </div>

        {menuOptions.length > 0 && (
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
        )}

        {renderContent()}

        {stats && stats.length > 0 && (
          <div className={styles.teamStats}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <h4>{stat.value}</h4>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {joinTeam && (joinTeam.title || joinTeam.description) && (
          <div className={styles.joinTeamBox}>
            {joinTeam.title && <h3>{joinTeam.title}</h3>}
            {joinTeam.description && <p>{joinTeam.description}</p>}
            {joinTeam.ctaLabel && (
              <a href={joinTeam.ctaLink || "#contact"} className={styles.ctaButton}>
                {joinTeam.ctaLabel}
              </a>
            )}
          </div>
        )}

        {/* Member Detail Modal */}
        {selectedMember && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={closeModal}>&times;</button>

              <div className={styles.modalBody}>
                <div className={styles.modalImageSide}>
                  <img src={selectedMember.image_url} alt={selectedMember.name} />
                </div>

                <div className={styles.modalInfoSide}>
                  <h2 className={styles.modalMemberName}>{selectedMember.name}</h2>
                  <p className={styles.modalMemberRole}>{selectedMember.designation}</p>

                  {selectedMember.education && (
                    <div className={styles.statSection}>
                      <p className={styles.statLabel}>Education</p>
                      <p className={styles.statValue}>{selectedMember.education}</p>
                    </div>
                  )}

                  {selectedMember.experience && (
                    <div className={styles.statSection}>
                      <p className={styles.statLabel}>Experience</p>
                      <p className={styles.statValue}>{selectedMember.experience}</p>
                    </div>
                  )}

                  {selectedMember.bio && (
                    <div className={styles.bioSection}>
                      <p className={styles.statLabel}>Professional Biography</p>
                      <p className={styles.bioText}>{selectedMember.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;
