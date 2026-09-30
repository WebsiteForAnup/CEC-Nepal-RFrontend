import React from 'react';
import styles from './CompanyProfile.module.css';

interface VisionMission {
  icon?: string;
  title?: string;
  content?: string;
}

interface ObjectivesGoals {
  icon?: string;
  title?: string;
  items?: string[];
}

interface ProfileData {
  vision?: VisionMission;
  mission?: VisionMission;
  objectives?: ObjectivesGoals;
  goals?: ObjectivesGoals;
}

interface CompanyProfileProps {
  profile?: ProfileData;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ profile }) => {
  if (!profile) return null;

  const { vision, mission, objectives, goals } = profile;

  return (
    <section id="company-profile" className={styles.companyProfile}>
      <div className={styles.container}>
        <div className={styles.profileGrid}>
          {/* Vision Card */}
          {vision && (
            <div className={styles.profileCard}>
              <div className={styles.iconWrapper}>
                {vision.icon && <i className={vision.icon}></i>}
              </div>
              <h3>{vision.title}</h3>
              <p className={styles.content}>{vision.content}</p>
            </div>
          )}

          {/* Mission Card */}
          {mission && (
            <div className={styles.profileCard}>
              <div className={styles.iconWrapper}>
                {mission.icon && <i className={mission.icon}></i>}
              </div>
              <h3>{mission.title}</h3>
              <p className={styles.content}>{mission.content}</p>
            </div>
          )}

          {/* Objectives Card */}
          {objectives && (
            <div className={styles.profileCard}>
              <div className={styles.iconWrapper}>
                {objectives.icon && <i className={objectives.icon}></i>}
              </div>
              <h3>{objectives.title}</h3>
              <ul className={styles.itemList}>
                {(objectives.items || []).map((item, index) => (
                  <li key={index} className={styles.item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Goals Card */}
          {goals && (
            <div className={styles.profileCard}>
              <div className={styles.iconWrapper}>
                {goals.icon && <i className={goals.icon}></i>}
              </div>
              <h3>{goals.title}</h3>
              <ul className={styles.itemList}>
                {(goals.items || []).map((item, index) => (
                  <li key={index} className={styles.item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CompanyProfile;
