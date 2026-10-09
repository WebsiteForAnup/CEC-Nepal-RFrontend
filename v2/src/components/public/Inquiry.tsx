import { Link } from 'react-router-dom';
export default function Inquiry({ subject = 'your next project' }: { subject?: string }) {
  return (
    <aside className="cec-inquiry">
      <p className="cec-eyebrow">PROJECT INQUIRIES</p>
      <h2>Inquiries about {subject}</h2>
      <p>Contact our team for information about our services and project requirements.</p>
      <Link className="cec-button cec-button--dark" to="/contact">
        Contact us
      </Link>
    </aside>
  );
}
