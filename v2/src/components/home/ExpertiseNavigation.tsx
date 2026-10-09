import { Link } from 'react-router-dom';
const expertise = [
  { number: '01', title: 'Plan your project', href: '/service/feasibility-studies' },
  { number: '02', title: 'Know your terrain', href: '/service/survey-investigations' },
  { number: '03', title: 'Design with precision', href: '/service/detail-engineering-design' },
  { number: '04', title: 'Build with confidence', href: '/service/construction-supervision' },
  { number: '05', title: 'Power the future', href: '/services' },
];

export default function ExpertiseNavigation() {
  return (
    <nav className="cec-expertise" aria-label="Explore our expertise">
      <div className="cec-container">
        {expertise.map(({ number, title, href }) => (
          <Link key={number} to={href}>
            <span>{number}</span>
            <strong>{title}</strong>
          </Link>
        ))}
      </div>
    </nav>
  );
}
