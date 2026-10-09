import { Link } from 'react-router-dom';
import { publicContent } from '../../services/publicContent';
const serviceSlugs = [
  'feasibility-studies',
  'survey-investigations',
  'detail-engineering-design',
  'construction-supervision',
  'due-diligence-audit',
];

export default function HomeServices() {
  return (
    <section className="cec-services">
      <div className="cec-container cec-services-inner">
        <div>
          <p className="cec-eyebrow">ONE PARTNER. EVERY PROJECT STAGE.</p>
          <h2>
            Expertise that
            <br />
            moves you
            <br />
            <span className="cec-emphasis">forward.</span>
          </h2>
          <p>Integrated engineering for hydropower, renewable energy, and infrastructure.</p>
          <Link className="cec-text-link" to="/services">
            All our services
          </Link>
        </div>
        <div className="cec-services-list">
          {serviceSlugs.map((slug, index) => {
            const service = publicContent.services.find((item) => item.slug === slug);
            return (
              service && (
                <details key={slug} name="home-services" open={index === 0}>
                  <summary>
                    <span>0{index + 1}</span>
                    <h3>{service.title}</h3>
                    <span className="cec-disclosure-sign" aria-hidden="true" />
                  </summary>
                  <div>
                    <p>{service.description}</p>
                    <Link className="cec-text-link" to={'/service/' + slug}>
                      Explore service
                    </Link>
                  </div>
                </details>
              )
            );
          })}
        </div>
      </div>
    </section>
  );
}
