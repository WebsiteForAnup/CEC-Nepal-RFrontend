import { Link } from 'react-router-dom';
import { publicContent as data } from '../services/publicContent';
import Arrow from '../components/public/Arrow';
const expertise = [
  ['01', 'Plan your project', '/service/feasibility-studies'],
  ['02', 'Know your terrain', '/service/survey-investigations'],
  ['03', 'Design with precision', '/service/detail-engineering-design'],
  ['04', 'Build with confidence', '/service/construction-supervision'],
  ['05', 'Power the future', '/services'],
];
const serviceSlugs = [
  'feasibility-studies',
  'survey-investigations',
  'detail-engineering-design',
  'construction-supervision',
  'due-diligence-audit',
];
const projects = ['seti-khola-hydropower-project', 'upper-kabeli-hpp', 'rudi-a-shp']
  .map((slug) => data.projects.find((project) => project.slug === slug))
  .filter(Boolean);
export default function Home() {
  return (
    <main id="main-content" className="cec-home">
      <section className="cec-hero" aria-labelledby="hero-title">
        <img
          className="cec-hero-image"
          src="/images/gallery/projects/seti-khola-hydro.jpg"
          alt="Aerial view of the Seti Khola hydropower site and river"
          fetchPriority="high"
        />
        <div className="cec-hero-shape" aria-hidden="true" />
        <div className="cec-container cec-hero-content">
          <p className="cec-eyebrow">
            <span />
            ENGINEERING NEPAL’S ENERGY FUTURE
          </p>
          <h1 id="hero-title">
            <span className="cec-headline-band">From nature</span>
            <br />
            <span className="cec-headline-band">to nation.</span>
            <br />
            <span className="cec-headline-band cec-headline-band--lime">Clean energy.</span>
          </h1>
          <p className="cec-hero-intro">
            Turning renewable potential into lasting progress.
            <br />
            Your engineering partner, from concept to commissioning.
          </p>
          <Link className="cec-button cec-button--lime" to="/contact">
            Talk to our experts
            <Arrow diagonal />
          </Link>
        </div>
        <div className="cec-container cec-hero-foot">
          <span>HYDROPOWER / SOLAR / INFRASTRUCTURE</span>
          <Link to="/project/seti-khola-hydropower-project">
            <span>
              SETI KHOLA, NEPAL
              <br />
              <strong>22 MW of renewable potential</strong>
            </span>
            <Arrow diagonal />
          </Link>
        </div>
      </section>
      <nav className="cec-expertise" aria-label="Explore our expertise">
        <div className="cec-container">
          {expertise.map(([number, title, href]) => (
            <Link key={number} to={href}>
              <span>{number}</span>
              <strong>{title}</strong>
              <Arrow diagonal />
            </Link>
          ))}
        </div>
      </nav>
      <section className="cec-partner cec-container">
        <div>
          <p className="cec-eyebrow">YOUR CLEAN ENERGY PARTNER</p>
          <h2>
            Local knowledge.
            <br />A wider <span className="cec-blue-text">horizon.</span>
          </h2>
        </div>
        <div>
          <p className="cec-lead">
            Good engineering begins with understanding the place, the people, and the potential.
          </p>
          <p>{data.about.intro}</p>
          <Link className="cec-text-link" to="/about">
            Discover CEC Nepal
            <Arrow diagonal />
          </Link>
        </div>
      </section>
      <section className="cec-approach cec-container">
        <div className="cec-field-photo">
          <img
            src="/images/data/cecnepal.com.np_wp-content_uploads_2024_12_Geotechnical-InvestigationCore-Drilling-1.jpg_e22edc01.jpeg"
            alt="CEC engineers conducting core drilling and geotechnical investigation"
            loading="lazy"
          />
          <div>
            <span>ON THE GROUND.</span>
            <strong>Always looking ahead.</strong>
            <Arrow diagonal />
          </div>
        </div>
        <div className="cec-approach-copy">
          <p className="cec-eyebrow">FROM CONCEPT TO COMMISSIONING</p>
          <h2>
            Potential.
            <br />
            Precision.
            <br />
            <span className="cec-green-text">Progress.</span>
          </h2>
          <p>
            Every site tells a different story. We bring field investigation, engineering design,
            and on-site supervision together to help your project move forward with confidence.
          </p>
          <Link className="cec-text-link" to="/services">
            See how we help
            <Arrow diagonal />
          </Link>
        </div>
      </section>
      <section className="cec-impact">
        <div className="cec-container">
          <div className="cec-impact-heading">
            <p className="cec-eyebrow">EXPERIENCE THAT MAKES A DIFFERENCE</p>
            <p>
              Built on expertise.
              <br />
              Measured in impact.
            </p>
          </div>
          <dl>
            {data.home.statistics.slice(0, 3).map((item) => (
              <div key={item.id}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="cec-projects cec-container">
        <div className="cec-section-heading">
          <div>
            <p className="cec-eyebrow">EXPERIENCE ACROSS NEPAL</p>
            <h2>Progress, in practice.</h2>
          </div>
          <Link className="cec-text-link" to="/projects">
            Explore our portfolio
            <Arrow diagonal />
          </Link>
        </div>
        <div className="cec-project-grid">
          {projects.map((project: any, index) => (
            <article key={project.slug} className="cec-project">
              <Link to={'/project/' + project.slug} className="cec-project-image">
                <img
                  src={
                    index === 0
                      ? '/images/gallery/projects/seti-khola-hydro.jpg'
                      : project.image_url
                  }
                  alt={project.name}
                  loading="lazy"
                />
                <span className="cec-project-number">0{index + 1}</span>
                <span className="cec-project-capacity">{project.capacity}</span>
                <span className="cec-project-arrow">
                  <Arrow diagonal />
                </span>
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
      <section className="cec-services">
        <div className="cec-container cec-services-inner">
          <div>
            <p className="cec-eyebrow">ONE PARTNER. EVERY PROJECT STAGE.</p>
            <h2>
              Expertise that
              <br />
              moves you
              <br />
              <span className="cec-blue-text">forward.</span>
            </h2>
            <p>Integrated engineering for hydropower, renewable energy, and infrastructure.</p>
            <Link className="cec-text-link" to="/services">
              All our services
              <Arrow diagonal />
            </Link>
          </div>
          <div className="cec-services-list">
            {serviceSlugs.map((slug, index) => {
              const service = data.services.find((item) => item.slug === slug);
              return (
                service && (
                  <details key={slug} open={index === 0}>
                    <summary>
                      <span>0{index + 1}</span>
                      <h3>{service.title}</h3>
                      <span className="cec-disclosure-sign" aria-hidden="true" />
                    </summary>
                    <div>
                      <p>{service.description}</p>
                      <Link className="cec-text-link" to={'/service/' + slug}>
                        Explore service
                        <Arrow diagonal />
                      </Link>
                    </div>
                  </details>
                )
              );
            })}
          </div>
        </div>
      </section>
      <section className="cec-news cec-container">
        <div className="cec-section-heading">
          <div>
            <p className="cec-eyebrow">IDEAS. MILESTONES. MOMENTUM.</p>
            <h2>From the field.</h2>
          </div>
          <Link className="cec-text-link" to="/news">
            All news & events
            <Arrow diagonal />
          </Link>
        </div>
        <div className="cec-news-grid">
          {data.news.slice(0, 3).map((item) => (
            <article key={item.slug}>
              <Link className="cec-news-image" to={'/news-event/' + item.slug}>
                {item.image && <img src={item.image} alt="" loading="lazy" />}
              </Link>
              <p className="cec-eyebrow">{item.category}</p>
              <h3>
                <Link to={'/news-event/' + item.slug}>{item.title}</Link>
              </h3>
              <div>
                <time dateTime={item.date}>{item.date}</time>
                <Link to={'/news-event/' + item.slug} aria-label={'Read ' + item.title}>
                  <Arrow diagonal />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="cec-contact-band">
        <div className="cec-container">
          <div>
            <p className="cec-eyebrow">LET’S TAKE THE NEXT STEP TOGETHER</p>
            <h2>
              Your vision.
              <br />
              <span>Our expertise.</span>
            </h2>
          </div>
          <div>
            <p>
              Planning a new project or advancing an existing one?
              <br />
              Let’s turn your next step into lasting progress.
            </p>
            <Link className="cec-button cec-button--dark" to="/contact">
              Start a conversation
              <Arrow diagonal />
            </Link>
          </div>
        </div>
        <span className="cec-contact-symbol" aria-hidden="true">
          ↗
        </span>
      </section>
    </main>
  );
}
