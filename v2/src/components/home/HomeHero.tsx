import { Link } from 'react-router-dom';

export default function HomeHero() {
  return (
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
          <span className="cec-headline-band cec-headline-band--cec-color-brand-accent">Clean energy.</span>
        </h1>
        <p className="cec-hero-intro">
          Turning renewable potential into lasting progress.
          <br />
          Your engineering partner, from concept to commissioning.
        </p>
        <Link className="cec-button cec-feature-button" to="/contact">
          Contact us
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
        </Link>
      </div>
    </section>
  );
}
