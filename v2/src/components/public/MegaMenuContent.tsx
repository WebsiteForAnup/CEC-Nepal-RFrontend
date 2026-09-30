import { Link } from 'react-router-dom';
import { publicContent, serviceGroups, serviceCategories } from '../../services/publicContent';
import Arrow from './Arrow';

const explore = [
  ['Company profile', '/company-profile', 'Our mission, vision, and objectives.'],
  ['Our team', '/team', 'The people behind the progress.'],
  ['Careers', '/careers', 'Build your future with CEC.'],
  ['FAQ', '/faq', 'Answers to common questions.'],
];

type Menu = 'Services' | 'Projects' | 'Insights' | 'About CEC';
export default function MegaMenuContent({ activeMenu }: { activeMenu: Menu }) {
  return (
    <div className="cec-mega-columns">
      {activeMenu === 'Services' &&
        serviceGroups.map((group) => (
          <section key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            {group.slugs.map((slug) => {
              const service = publicContent.services.find((item) => item.slug === slug);
              return (
                service && (
                  <Link key={slug} to={'/service/' + slug}>
                    {service.title}
                    <Arrow diagonal />
                  </Link>
                )
              );
            })}
          </section>
        ))}
      {activeMenu === 'Projects' && (
        <>
          <section>
            <h3>By CEC service</h3>
            {Object.entries(serviceCategories).map(([slug, category]) => (
              <Link key={slug} to={'/projects?service=' + slug}>
                {category}
                <Arrow diagonal />
              </Link>
            ))}
          </section>
          <section>
            <h3>By project status</h3>
            {[...new Set(publicContent.projects.map((project) => project.status))].map((status) => (
              <Link key={status} to={'/projects?category=' + encodeURIComponent(status)}>
                {status}
                <Arrow diagonal />
              </Link>
            ))}
          </section>
          <section>
            <h3>Featured project</h3>
            <img
              src="/images/gallery/projects/seti-khola-hydro.jpg"
              alt="Seti Khola hydropower site"
            />
            <Link to="/project/seti-khola-hydropower-project">
              Seti Khola · 22 MW
              <Arrow diagonal />
            </Link>
          </section>
        </>
      )}
      {activeMenu === 'Insights' && (
        <>
          <section>
            <h3>From the field</h3>
            {publicContent.news.slice(0, 3).map((item) => (
              <Link key={item.slug} to={'/news-event/' + item.slug}>
                {item.title}
                <Arrow diagonal />
              </Link>
            ))}
          </section>
          <section>
            <h3>Resources</h3>
            <Link to="/downloads">
              Downloads & publications
              <Arrow diagonal />
            </Link>
            <Link to="/gallery">
              Our work in pictures
              <Arrow diagonal />
            </Link>
            <Link to="/news">
              All news & events
              <Arrow diagonal />
            </Link>
          </section>
        </>
      )}
      {activeMenu === 'About CEC' && (
        <>
          <section>
            <h3>Who we are</h3>
            <Link to="/about">
              About CEC Nepal
              <Arrow diagonal />
            </Link>
            <Link to="/contact">
              Offices & contact
              <Arrow diagonal />
            </Link>
          </section>
          <section>
            <h3>People & purpose</h3>
            {explore.map(([label, href, description]) => (
              <Link key={href} to={href}>
                <span>
                  {label}
                  <small>{description}</small>
                </span>
                <Arrow diagonal />
              </Link>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
