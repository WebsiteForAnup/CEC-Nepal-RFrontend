import React from 'react';
import styles from './ServiceCard.module.css';

const ServiceCard = ({ title, description, icon }) => {
  return (
    <div className={styles.serviceCard}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ServiceCard;
