import { Link, useSearchParams } from 'react-router-dom';
import Page from '../components/public/Page';
import Arrow from '../components/public/Arrow';
import { publicContent } from '../services/publicContent';
export default function Downloads() {
  const [params] = useSearchParams();
  const category = params.get('category') || '';
  const query = params.get('q') || '';
  const items = publicContent.downloads.filter(
    (item) =>
      (!category || item.category === category) &&
      item.title.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Page
      title="Resources for the road ahead."
      intro="Explore engineering templates, technical guidance, and company publications."
    >
      <form className="cec-filter" method="get">
        <label>
          Search resources
          <input name="q" type="search" defaultValue={query} key={query} />
        </label>
        <label>
          Category
          <select name="category" defaultValue={category} key={category}>
            <option value="">All categories</option>
            {[...new Set(publicContent.downloads.map((item) => item.category))].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button className="cec-button cec-button--dark" type="submit">
          Filter
        </button>
        <Link to="/downloads">Clear filters</Link>
      </form>
      <p className="cec-results-count">{items.length} resources</p>
      <ul className="cec-resource-grid">
        {items.map((item) => (
          <li key={item.slug}>
            <p className="cec-eyebrow">
              {item.category} / {item.type}
            </p>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <span>{item.size}</span>
            {item.downloadUrl && item.downloadUrl !== '#' ? (
              <a className="cec-text-link" href={item.downloadUrl} download>
                Download
                <Arrow diagonal />
              </a>
            ) : (
              <p className="cec-unavailable">File not published yet.</p>
            )}
          </li>
        ))}
      </ul>
      {!items.length && <p>No matching resources.</p>}
    </Page>
  );
}
