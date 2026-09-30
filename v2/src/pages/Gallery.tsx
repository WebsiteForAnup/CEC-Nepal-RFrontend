import { useSearchParams, Link } from 'react-router-dom';
import Page from '../components/public/Page';
import PhotoGallery from '../components/public/PhotoGallery';
import { publicContent } from '../services/publicContent';
export default function Gallery() {
  const [params] = useSearchParams();
  const category = params.get('category') || '';
  const items = publicContent.gallery.filter((item) => !category || item.category === category);
  return (
    <Page title="Our work, in pictures." intro="People, projects, and engineering in the field.">
      <form className="cec-filter" method="get">
        <label>
          Category
          <select name="category" defaultValue={category} key={category}>
            <option value="">All categories</option>
            {[...new Set(publicContent.gallery.map((item) => item.category))].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button className="cec-button cec-button--dark" type="submit">
          Filter
        </button>
        <Link to="/gallery">Clear filter</Link>
      </form>
      <p className="cec-results-count">{items.length} images</p>
      <PhotoGallery
        key={category}
        photos={items.map((item) => ({
          src: item.image,
          caption: item.title + ' · ' + item.description,
        }))}
      />
      {!items.length && <p>No images in this category.</p>}
    </Page>
  );
}
