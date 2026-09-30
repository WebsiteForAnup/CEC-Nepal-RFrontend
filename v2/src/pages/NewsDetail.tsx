import { Link, useParams } from 'react-router-dom';
import Page from '../components/public/Page';
import Facts from '../components/public/Facts';
import RichArticle from '../components/public/RichArticle';
import Inquiry from '../components/public/Inquiry';
import NotFound from './NotFound';
import Arrow from '../components/public/Arrow';
import { publicContent, getRelatedNews } from '../services/publicContent';
import labels from '../data/global/label-mappings.json';
export default function NewsDetail() {
  const { id } = useParams();
  const item: any = publicContent.news.find((item) => item.slug === id || String(item.id) === id);
  if (!item) return <NotFound />;
  const related = getRelatedNews(item.slug);
  return (
    <Page title={item.title} intro={item.description}>
      <nav className="cec-breadcrumb" aria-label="Breadcrumb">
        <Link to="/news">News & events</Link>
        <span> / {item.category}</span>
      </nav>
      <div className="cec-detail-layout">
        <article>
          <p className="cec-article-meta">
            <span>{item.category}</span>
            <time dateTime={item.date}>{item.date}</time>
            {item.author && <span>By {item.author}</span>}
          </p>
          {item.image && <img className="cec-detail-image" src={item.image} alt={item.title} />}
          <RichArticle blocks={item.richContent} content={item.content} />
          {item.importantDates?.length > 0 && (
            <section>
              <h2>Important dates</h2>
              <Facts items={item.importantDates.map((date: any) => [date.date_title, date.date])} />
            </section>
          )}
        </article>
        <aside className="cec-detail-sidebar">
          {item.projectSpecs && (
            <section>
              <h2>{item.projectSpecs.title || 'Project specifications'}</h2>
              <Facts
                items={Object.entries(item.projectSpecs)
                  .filter(([key]) => key !== 'title')
                  .map(([key, value]) => [
                    (labels.projectSpecs as Record<string, string>)[key] || key,
                    value,
                  ])}
              />
            </section>
          )}
          <section>
            <h2>{item.type === 'event' ? 'Event information' : 'At a glance'}</h2>
            <Facts
              items={Object.entries({
                Location: item.location,
                'CEC role': item.cecRole,
                Trainer: item.trainer,
                Coordinator: item.coordinator,
                Team: item.team,
                Award: item.awardName,
              })}
            />
            {item.registration &&
              (item.registration.startsWith('https://') ||
                item.registration.startsWith('http://')) && (
                <a className="cec-text-link" href={item.registration}>
                  Event registration
                  <Arrow diagonal />
                </a>
              )}
          </section>
          <Inquiry />
        </aside>
      </div>
      {related.length > 0 && (
        <section className="cec-related">
          <h2>Related news & events</h2>
          <div className="cec-related-grid">
            {related.map((news) => (
              <Link key={news.slug} to={'/news-event/' + news.slug}>
                <div>
                  <p className="cec-eyebrow">{news.category}</p>
                  <h3>{news.title}</h3>
                  <time dateTime={news.date}>{news.date}</time>
                  <Arrow diagonal />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Page>
  );
}
