import { Link } from 'react-router-dom';

export default function EngineeringApproach() {
  return (
    <section className="cec-approach cec-container">
      <div className="cec-field-photo">
        <img
          src="/images/data/cecnepal.com.np_wp-content_uploads_2024_12_Geotechnical-InvestigationCore-Drilling-1.jpg_e22edc01.jpeg"
          alt="CEC engineers conducting core drilling and geotechnical investigation"
          loading="lazy"
        />
        <div>
          <span>ON THE GROUND.</span>
          <strong>Always looking ahead.</strong>
        </div>
      </div>
      <div className="cec-approach-copy">
        <p className="cec-eyebrow">FROM CONCEPT TO COMMISSIONING</p>
        <h2>
          Potential.
          <br />
          Precision.
          <br />
          <span className="cec-secondary-emphasis">Progress.</span>
        </h2>
        <p>
          Every site tells a different story. We bring field investigation, engineering design, and
          on-site supervision together to help your project move forward with confidence.
        </p>
        <Link className="cec-text-link" to="/services">
          Our services
        </Link>
      </div>
    </section>
  );
}
