import React, { useState, useEffect } from 'react';
import styles from './Team.module.css';
import teamRegistry from '../../data/collections/team/registry.json';
import { teamDbService, Member } from '../../services/teamService';

interface Stat {
  value: string;
  label: string;
}

interface JoinTeam {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

interface TeamProps {
  title?: string;
  subtitle?: string;
  stats?: Stat[];
  joinTeam?: JoinTeam;
}

const Team: React.FC<TeamProps> = ({ 
  title = teamRegistry.title || "Our Team",
  subtitle = teamRegistry.subtitle || "Meet the experts behind CEC Nepal's success",
  stats = teamRegistry.stats as Stat[] || [],
  joinTeam = teamRegistry.joinTeam || {}
}) => {
  const [teamCategories, setTeamCategories] = useState<Record<string, Member[]>>({});
  const [menuOptions, setMenuOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    teamDbService.getTeamCategories()
      .then(categories => {
        setTeamCategories(categories);
        const options = Object.keys(categories);
        setMenuOptions(options);
        if (options.length > 0) {
          setSelectedCategory(options[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load team categories", err);
        setLoading(false);
      });
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p>Loading team members...</p>
        </div>
      );
    }

    const currentTeam = teamCategories[selectedCategory] || [];

    return (
      <div className={styles.teamGrid}>
        {currentTeam.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No team members found in this category.</p>
          </div>
        ) : (
          currentTeam.map((member, index) => (
            <div
              key={member.id || index}
              className={styles.memberCard}
            >
              <div className={styles.cardImageWrapper}>
                <img src={member.image_url || '/images/cec-logo.png'} alt={member.name} />
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
                  <img src={selectedMember.image_url || '/images/cec-logo.png'} alt={selectedMember.name} />
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
                      <p className={styles.statValue}>{selectedMember.experience as any}</p>
                    </div>
                  )}

                  {selectedMember.more_info && (
                    <div className={styles.statSection}>
                      <p className={styles.statLabel}>Additional Info</p>
                      <p className={styles.statValue}>{selectedMember.more_info}</p>
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
