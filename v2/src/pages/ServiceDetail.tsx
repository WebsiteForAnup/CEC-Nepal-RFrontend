import { Link, useParams } from 'react-router-dom';
import Page from '../components/public/Page';
import Inquiry from '../components/public/Inquiry';
import ProjectLinks from '../components/public/ProjectLinks';
import Arrow from '../components/public/Arrow';
import NotFound from './NotFound';
import { publicContent, findService, getServiceProjects } from '../services/publicContent';
export default function ServiceDetail() {
  const { id = '' } = useParams();
  const item: any = findService(id);
  if (!item) return <NotFound />;
  const projects = getServiceProjects(id);
  const caseProject = publicContent.projects.find(
    (project) => project.name === item.caseStudy?.title,
  );
  return (
    <Page title={item.title} intro={item.subheadline || item.description}>
      <nav className="cec-breadcrumb" aria-label="Breadcrumb">
        <Link to="/services">All services</Link>
        <span> / {item.title}</span>
      </nav>
      <div className="cec-detail-layout">
        <article>
          {item.image && <img className="cec-detail-image" src={item.image} alt={item.title} />}
          <section>
            <p className="cec-eyebrow">THE BIG PICTURE</p>
            <h2>Confidence starts with clarity.</h2>
            <p>{item.fullDescription || item.description}</p>
          </section>
          {(item.painPoints || item.approach) && (
            <section className="cec-two-cards">
              {item.painPoints && (
                <div>
                  <h3>The challenge</h3>
                  <p>{item.painPoints}</p>
                </div>
              )}
              {item.approach && (
                <div>
                  <h3>Our approach</h3>
                  <p>{item.approach}</p>
                </div>
              )}
            </section>
          )}
          {(item.capabilities || item.benefits) && (
            <section>
              <h2>{item.capabilities ? 'Scope of expertise' : 'What you gain'}</h2>
              <ul className="cec-checklist">
                {(item.capabilities || item.benefits).map((value: string) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </section>
          )}
          {item.process?.length > 0 && (
            <section>
              <h2>From first step to delivery</h2>
              <ol className="cec-process">
                {item.process.map((step: string) => (
                  <li key={step}>
                    <h3>{step}</h3>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {item.caseStudy && (
            <section className="cec-case-study">
              <p className="cec-eyebrow">CASE STUDY</p>
              <h2>{item.caseStudy.title}</h2>
              <p>{item.caseStudy.metric}</p>
              <p>{item.caseStudy.description}</p>
              {caseProject && (
                <Link className="cec-text-link" to={'/project/' + caseProject.slug}>
                  Explore project
                  <Arrow diagonal />
                </Link>
              )}
            </section>
          )}
          {item.testimonial && (
            <blockquote className="cec-quote">
              <p>“{item.testimonial.quote}”</p>
              <footer>
                {item.testimonial.author}
                <br />
                {item.testimonial.title} · {item.testimonial.company}
              </footer>
            </blockquote>
          )}
        </article>
        <aside className="cec-detail-sidebar">
          <Inquiry subject={item.title.toLowerCase()} />
          {item.techStack?.length > 0 && (
            <section>
              <h2>Tools & technology</h2>
              <ul className="cec-tags">
                {item.techStack.map((tool: string) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h2>More expertise</h2>
            {publicContent.services
              .filter((service) => service.slug !== id)
              .slice(0, 5)
              .map((service) => (
                <Link
                  className="cec-sidebar-link"
                  key={service.slug}
                  to={'/service/' + service.slug}
                >
                  {service.title}
                  <Arrow diagonal />
                </Link>
              ))}
          </section>
        </aside>
      </div>
      <ProjectLinks projects={projects} />
      {projects.length > 0 && (
        <Link className="cec-text-link" to={'/projects?service=' + id}>
          All projects for this service
          <Arrow diagonal />
        </Link>
      )}
    </Page>
  );
}
