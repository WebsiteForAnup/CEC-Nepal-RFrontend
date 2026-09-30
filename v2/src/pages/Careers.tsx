import Page from '../components/public/Page';
import Arrow from '../components/public/Arrow';
import { publicContent } from '../services/publicContent';
export default function Careers() {
  const { page, benefits, openings } = publicContent.careers;
  const open = openings.filter((item) => item.status.toLowerCase() === 'open');
  return (
    <Page title={page.title} intro={page.subtitle}>
      <section>
        <p className="cec-eyebrow">BUILD SOMETHING THAT MATTERS</p>
        <h2>Your expertise. A cleaner future.</h2>
        <div className="cec-benefit-grid">
          {benefits.map((item, index) => (
            <article key={item.title}>
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2>Current opportunities</h2>
        {!open.length && (
          <div className="cec-empty-state">
            <h3>No open vacancies right now.</h3>
            <p>Stay in touch for future opportunities with our engineering team.</p>
            <a
              className="cec-text-link"
              href={'mailto:' + publicContent.contact.email + '?subject=Career%20inquiry'}
            >
              Introduce yourself
              <Arrow diagonal />
            </a>
          </div>
        )}
        {openings.map((item) => (
          <article className="cec-job" key={item.id}>
            <div>
              <p className="cec-eyebrow">
                {item.department} / {item.type}
              </p>
              <h3>{item.title}</h3>
              <p>
                {item.location} · {item.experience}
              </p>
            </div>
            <span className="cec-status">{item.status}</span>
            <details>
              <summary>Position details</summary>
              <p>{item.description}</p>
              <ul className="cec-checklist">
                {item.requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
              <p>
                Posted: <time dateTime={item.postedDate}>{item.postedDate}</time>
              </p>
              {item.status.toLowerCase() === 'open' && (
                <a
                  className="cec-button cec-button--dark"
                  href={'mailto:' + item.applyEmail + '?subject=' + encodeURIComponent(item.title)}
                >
                  Apply by email
                  <Arrow diagonal />
                </a>
              )}
            </details>
          </article>
        ))}
      </section>
    </Page>
  );
}
