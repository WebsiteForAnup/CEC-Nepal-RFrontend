import { Link, useParams } from 'react-router-dom';
import Page from '../components/public/Page';
import Facts from '../components/public/Facts';
import Inquiry from '../components/public/Inquiry';
import PhotoGallery from '../components/public/PhotoGallery';
import ProjectLinks from '../components/public/ProjectLinks';
import Arrow from '../components/public/Arrow';
import NotFound from './NotFound';
import ProjectGeography from '../components/public/ProjectGeography';
import { publicContent, getProjectServices } from '../services/publicContent';
export default function ProjectDetail() {
  const { id } = useParams();
  const project: any = publicContent.projects.find((item) => item.slug === id);
  if (!project) return <NotFound />;
  const services = getProjectServices(project);
  const related = publicContent.projects.filter(
    (item) =>
      item.slug !== id && item.categories.some((category) => project.categories.includes(category)),
  );
  const photos = [
    ...new Set<string>([project.image_url, ...(project.images || [])].filter(Boolean)),
  ];
  return (
    <Page title={project.name} intro={project.description}>
      <nav className="cec-breadcrumb" aria-label="Breadcrumb">
        <Link to="/projects">All projects</Link>
        <span> / {project.name}</span>
      </nav>
      <div className="cec-detail-layout">
        <article>
          <div className="cec-project-highlights">
            <div>
              <span>CAPACITY</span>
              <strong>{project.capacity || '—'}</strong>
            </div>
            <div>
              <span>PROJECT STATUS</span>
              <strong>{project.status}</strong>
            </div>
          </div>
          <section>
            <h2>Project overview</h2>
            <Facts
              items={Object.entries({
                Developer: project.developer,
                Location: project.location,
                Type: project.type,
                'CEC inputs': project.cecInputs,
                Commissioned: project.commissioned,
              })}
            />
          </section>
          {project.technicalDetails && (
            <section>
              <h2>Technical specifications</h2>
              <Facts
                items={Object.entries(project.technicalDetails).map(([key, value]) => [
                  key.replace(/([a-z])([A-Z])/g, '$1 $2'),
                  value,
                ])}
              />
            </section>
          )}
          {project.timeline?.length > 0 && (
            <section>
              <h2>Project journey</h2>
              <ol className="cec-timeline">
                {project.timeline.map((event: any, index: number) => (
                  <li key={index}>
                    <strong>
                      {typeof event.dateRange === 'string'
                        ? event.dateRange
                        : [
                            event.dateRange?.start?.slice(0, 4),
                            event.dateRange?.end?.slice(0, 4) || 'Ongoing',
                          ]
                            .filter(Boolean)
                            .join(' – ')}
                    </strong>
                    <p>{event.details}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {photos.length > 0 && (
            <section>
              <h2>In pictures</h2>
              <PhotoGallery
                key={id}
                photos={photos.map((src) => ({ src, caption: project.name }))}
              />
            </section>
          )}
        </article>
        <aside className="cec-detail-sidebar">
          <section>
            <p className="cec-eyebrow">CEC’S ROLE</p>
            <h2>Expertise on this project</h2>
            {services.map((service) => (
              <Link key={service.slug} className="cec-sidebar-link" to={'/service/' + service.slug}>
                {service.title}
                <Arrow diagonal />
              </Link>
            ))}
            {!services.length && <p>{project.cecInputs}</p>}
          </section>
          <Inquiry />
        </aside>
      </div>
      <ProjectGeography projectSlugs={[project.slug]} />
      <ProjectLinks projects={related} title="More projects with shared expertise" />
    </Page>
  );
}
