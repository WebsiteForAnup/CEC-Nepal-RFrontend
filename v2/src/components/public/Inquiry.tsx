import { Link } from 'react-router-dom';
import Arrow from './Arrow';
export default function Inquiry({ subject = 'your next project' }: { subject?: string }) {
  return (
    <aside className="cec-inquiry">
      <p className="cec-eyebrow">LET’S MOVE FORWARD</p>
      <h2>Let’s talk about {subject}.</h2>
      <p>Connect with our team to discuss your needs, site, and project stage.</p>
      <Link className="cec-button cec-button--dark" to="/contact">
        Talk to our experts
        <Arrow diagonal />
      </Link>
    </aside>
  );
}
