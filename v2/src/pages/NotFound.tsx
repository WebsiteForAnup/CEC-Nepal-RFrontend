import { Link } from 'react-router-dom';
import Page from '../components/public/Page';
import Arrow from '../components/public/Arrow';
export default function NotFound() {
  return (
    <Page title="A different path ahead.">
      <div className="cec-empty-state">
        <p className="cec-eyebrow">404 / PAGE NOT FOUND</p>
        <h2>We couldn’t find that page.</h2>
        <p>Explore our work or get in touch to find what you need.</p>
        <Link className="cec-button cec-button--dark" to="/">
          Back to home
          <Arrow diagonal />
        </Link>
      </div>
    </Page>
  );
}
