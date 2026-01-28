import React from 'react';
import styles from './SectionHeader.module.css';

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className={styles.sectionHeader}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
