import { Link } from 'react-router-dom';
import ContentImage from '../public/ContentImage';
import { publicContent } from '../../services/publicContent';
const projects = ['seti-khola-hydropower-project', 'upper-kabeli-hpp', 'rudi-a-shp']
  .map((slug) => publicContent.projects.find((project) => project.slug === slug))
  .filter(Boolean);

export default function FeaturedProjects() {
  return (
    <section className="cec-projects cec-container">
      <div className="cec-section-heading">
        <div>
          <p className="cec-eyebrow">EXPERIENCE ACROSS NEPAL</p>
          <h2>Progress, in practice.</h2>
        </div>
        <Link className="cec-text-link" to="/projects">
          Explore our portfolio
        </Link>
      </div>
      <div className="cec-project-grid">
        {projects.map((project, index) => (
          <article key={project.slug} className="cec-project">
            <Link to={'/project/' + project.slug} className="cec-project-image">
              <ContentImage
                src={
                  index === 0 ? '/images/gallery/projects/seti-khola-hydro.jpg' : project.image_url
                }
                alt={project.name}
                loading="lazy"
              />
              <span className="cec-project-number">0{index + 1}</span>
              <span className="cec-project-capacity">{project.capacity}</span>
            </Link>
            <p className="cec-eyebrow">{project.location} / HYDROPOWER</p>
            <h3>
              <Link to={'/project/' + project.slug}>{project.name}</Link>
            </h3>
            <p>{project.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
