import { Link, useSearchParams } from 'react-router-dom';
import Page from './Page';
import Arrow from './Arrow';
import { serviceCategories } from '../../services/publicContent';
import ProjectGeography from './ProjectGeography';
type Item = {
  slug: string;
  title?: string;
  name?: string;
  description?: string;
  category?: string;
  status?: string;
  capacity?: string;
  date?: string;
  image?: string;
  image_url?: string;
  categories?: string[];
};

type CollectionFilters = { query: string; category: string; service: string };

function matchesCollectionFilters(item: Item, filters: CollectionFilters) {
  const name = (item.title || item.name || '').toLowerCase();
  const matchesName = name.includes(filters.query.toLowerCase());
  const matchesCategory = !filters.category || (item.category || item.status) === filters.category;
  const matchesService =
    !filters.service || item.categories?.includes(serviceCategories[filters.service]);
  return matchesName && matchesCategory && matchesService;
}
export default function Collection({
  title,
  items,
  detailPath,
}: {
  title: string;
  items: Item[];
  detailPath: string;
}) {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const category = params.get('category') || '';
  const service = params.get('service') || '';
  const categories = [
    ...new Set(items.map((item) => item.category || item.status).filter(Boolean)),
  ];
  const filtered = items.filter((item) =>
    matchesCollectionFilters(item, { query, category, service }),
  );
  return (
    <Page title={title}>
      <form className="cec-filter" method="get">
        <label>
          Search{' '}
          <input
            type="search"
            name="q"
            placeholder={'Search ' + title.toLowerCase()}
            defaultValue={query}
            key={query}
          />
        </label>
        <label>
          Category{' '}
          <select name="category" defaultValue={category} key={category}>
            <option value="">All</option>
            {categories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        {detailPath === '/project/' && (
          <label>
            CEC expertise
            <select name="service" defaultValue={service} key={service}>
              <option value="">All services</option>
              {Object.entries(serviceCategories).map(([slug, label]) => (
                <option key={slug} value={slug}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        )}
        <button type="submit" className="cec-button cec-button--dark">
          Filter
          <Arrow />
        </button>
        <Link
          to={
            detailPath === '/service/'
              ? '/services'
              : detailPath === '/project/'
                ? '/projects'
                : '/news'
          }
        >
          Clear filters
        </Link>
      </form>
      {detailPath === '/project/' && (
        <ProjectGeography
          projectSlugs={filtered.map((item) => item.slug)}
          includeUnlinked={!service}
          query={query}
          status={category}
          showFilters
        />
      )}
      <p className="cec-results-count">{filtered.length} results</p>
      <ul className="cec-collection-grid">
        {filtered.map((item) => (
          <li key={item.slug}>
            <CollectionCard item={item} detailPath={detailPath} />
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p>No matching results.</p>}
    </Page>
  );
}

function CollectionCard({ item, detailPath }: { item: Item; detailPath: string }) {
  return (
    <article className="cec-collection-card">
      {(item.image || item.image_url) && (
        <Link to={detailPath + item.slug} tabIndex={-1} aria-hidden="true">
          <img src={item.image || item.image_url} alt="" loading="lazy" />
        </Link>
      )}
      <div>
        <p className="cec-eyebrow">{item.category || item.status}</p>
        <h2>
          <Link to={detailPath + item.slug}>{item.title || item.name}</Link>
        </h2>
        {item.date && <time dateTime={item.date}>{item.date}</time>}
        <p>{item.description}</p>
        {item.capacity && <strong>{item.capacity}</strong>}
        <Link className="cec-text-link" to={detailPath + item.slug}>
          Discover more
          <Arrow diagonal />
        </Link>
      </div>
    </article>
  );
}
