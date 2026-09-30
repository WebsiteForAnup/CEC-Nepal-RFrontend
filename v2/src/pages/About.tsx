import { Link } from 'react-router-dom';
import Page from '../components/public/Page';
import { InlineCopy } from '../components/public/RichArticle';
import Inquiry from '../components/public/Inquiry';
import Arrow from '../components/public/Arrow';
import { publicContent as data } from '../services/publicContent';
export default function About() {
  return (
    <Page title="Local knowledge. Lasting progress." intro={data.about.intro}>
      <section className="cec-editorial-split">
        <img
          src="/images/data/cecnepal.com.np_wp-content_uploads_2024_12_Geotechnical-InvestigationCore-Drilling-1.jpg_e22edc01.jpeg"
          alt="Engineers conducting site investigation"
        />
        <div>
          <p className="cec-eyebrow">ABOUT CEC NEPAL</p>
          <h2>{data.about.title}</h2>
          <p>
            Established in {data.about.history.founded} by {data.about.history.founder}.
          </p>
          <p>{data.about.history.milestone}</p>
          <Link className="cec-text-link" to="/team">
            Meet our people
            <Arrow diagonal />
          </Link>
        </div>
      </section>
      <section className="cec-potential">
        <p className="cec-eyebrow">NATURE’S POTENTIAL. ENGINEERING’S PURPOSE.</p>
        <h2>{data.about.potentialBox.heading}</h2>
        <p>
          <InlineCopy text={data.about.potentialBox.text} />
        </p>
      </section>
      <section>
        <p className="cec-eyebrow">OUR PURPOSE</p>
        <h2>{data.about.missionTitle}</h2>
        <ul className="cec-purpose-grid">
          {data.about.missionItems.map((item, index) => (
            <li key={item.label}>
              <span>0{index + 1}</span>
              <h3>{item.label}</h3>
            </li>
          ))}
        </ul>
        <Link className="cec-text-link" to="/company-profile">
          Our vision & objectives
          <Arrow diagonal />
        </Link>
      </section>
      <Inquiry />
    </Page>
  );
}
