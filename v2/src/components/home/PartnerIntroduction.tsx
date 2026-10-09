import { Link } from 'react-router-dom';
import { publicContent } from '../../services/publicContent';

export default function PartnerIntroduction() {
  return (
    <section className="cec-partner cec-container">
      <div>
        <p className="cec-eyebrow">YOUR CLEAN ENERGY PARTNER</p>
        <h2>
          Local knowledge.
          <br />A wider <span className="cec-emphasis">horizon.</span>
        </h2>
      </div>
      <div>
        <p className="cec-lead">
          Good engineering begins with understanding the place, the people, and the potential.
        </p>
        <p>{publicContent.about.intro}</p>
        <Link className="cec-text-link" to="/about">
          About CEC Nepal
        </Link>
      </div>
    </section>
  );
}
