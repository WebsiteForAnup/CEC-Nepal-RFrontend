import { Link } from 'react-router-dom';
import ContentImage from '../public/ContentImage';
import { publicContent } from '../../services/publicContent';

export default function LatestNews() {
  return (
    <section className="cec-news cec-container">
      <div className="cec-section-heading">
        <div>
          <p className="cec-eyebrow">IDEAS. MILESTONES. MOMENTUM.</p>
          <h2>From the field.</h2>
        </div>
        <Link className="cec-text-link" to="/news">
          All news & events
        </Link>
      </div>
      <div className="cec-news-grid">
        {publicContent.news.slice(0, 3).map((item) => (
          <article key={item.slug}>
            <Link className="cec-news-image" to={'/news-event/' + item.slug}>
              <ContentImage src={item.image} alt="" loading="lazy" />
            </Link>
            <p className="cec-eyebrow">{item.category}</p>
            <h3>
              <Link to={'/news-event/' + item.slug}>{item.title}</Link>
            </h3>
            <div>
              <time dateTime={item.date}>{item.date}</time>
              <Link to={'/news-event/' + item.slug} aria-label={'Read ' + item.title}>
                Read story
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
