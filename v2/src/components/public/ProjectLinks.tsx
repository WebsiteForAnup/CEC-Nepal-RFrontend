import { Link } from 'react-router-dom';
import Arrow from './Arrow';
export default function ProjectLinks({
  projects,
  title = 'Projects with this expertise',
}: {
  projects: {
    slug: string;
    name: string;
    capacity?: string;
    status?: string;
    image_url?: string;
  }[];
  title?: string;
}) {
  if (!projects.length) return null;
  return (
    <section className="cec-related">
      <p className="cec-eyebrow">PROGRESS IN PRACTICE</p>
      <h2>{title}</h2>
      <div className="cec-related-grid">
        {projects.slice(0, 3).map((project) => (
          <Link key={project.slug} to={'/project/' + project.slug}>
            {project.image_url && <img src={project.image_url} alt="" loading="lazy" />}
            <div>
              <span>
                {project.capacity} / {project.status}
              </span>
              <h3>{project.name}</h3>
              <Arrow diagonal />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
