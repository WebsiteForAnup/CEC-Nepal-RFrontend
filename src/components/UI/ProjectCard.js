import React from 'react';
import styles from './ProjectCard.module.css';

const ProjectCard = ({ title, description, image }) => {
  return (
    <div className={styles.projectCard}>
      {image && <img src={image} alt={title} />}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ProjectCard;
