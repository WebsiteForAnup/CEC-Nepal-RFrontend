import { Link } from 'react-router-dom';

export default function ProjectInquiry() {
  return (
    <section className="cec-contact-band">
      <div className="cec-container">
        <div>
          <p className="cec-eyebrow">PROJECT INQUIRIES</p>
          <h2>
            Engineering expertise.
            <br />
            <span>Project delivery.</span>
          </h2>
        </div>
        <div>
          <p>
            Contact CEC Nepal for engineering consultancy and project support.
            <br />
            Our team supports projects from feasibility through commissioning.
          </p>
          <Link className="cec-button cec-action-button" to="/contact">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
