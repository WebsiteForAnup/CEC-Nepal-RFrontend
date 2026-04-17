import React from 'react';
import styles from './CompanyProfile.module.css';

const CompanyProfile = ({ profile }) => {
  if (!profile) return null;

  const { title, vision, mission, objectives, goals } = profile;

  return (
    <section id="company-profile" className={styles.companyProfile}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>{title}</h2>
          <div className={styles.line}></div>
        </div>

        <div className={styles.profileGrid}>
          {/* Vision Card */}
          <div className={styles.profileCard}>
            <div className={styles.iconWrapper}>
              <i className={vision.icon}></i>
            </div>
            <h3>{vision.title}</h3>
            <p className={styles.content}>{vision.content}</p>
          </div>

          {/* Mission Card */}
          <div className={styles.profileCard}>
            <div className={styles.iconWrapper}>
              <i className={mission.icon}></i>
            </div>
            <h3>{mission.title}</h3>
            <p className={styles.content}>{mission.content}</p>
          </div>

          {/* Objectives Card */}
          <div className={styles.profileCard}>
            <div className={styles.iconWrapper}>
              <i className={objectives.icon}></i>
            </div>
            <h3>{objectives.title}</h3>
            <ul className={styles.itemList}>
              {objectives.items.map((item, index) => (
                <li key={index} className={styles.item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Goals Card */}
          <div className={styles.profileCard}>
            <div className={styles.iconWrapper}>
              <i className={goals.icon}></i>
            </div>
            <h3>{goals.title}</h3>
            <ul className={styles.itemList}>
              {goals.items.map((item, index) => (
                <li key={index} className={styles.item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyProfile;
