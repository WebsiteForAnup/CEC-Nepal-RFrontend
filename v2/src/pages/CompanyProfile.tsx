import Page from '../components/public/Page';
import Inquiry from '../components/public/Inquiry';
import { publicContent } from '../services/publicContent';
export default function CompanyProfile() {
  const data = publicContent.profile;
  return (
    <Page
      title="Purpose that powers progress."
      intro="Our vision, mission, and commitment to Nepal’s clean energy future."
    >
      <section className="cec-two-cards cec-purpose-cards">
        {[data.vision, data.mission].map((item, index) => (
          <div key={item.title}>
            <p className="cec-eyebrow">0{index + 1} / OUR PURPOSE</p>
            <h2>{item.title}</h2>
            <p>{item.content}</p>
          </div>
        ))}
      </section>
      <section>
        <h2>{data.objectives.title}</h2>
        <ol className="cec-numbered-list">
          {data.objectives.items.map((item, index) => (
            <li key={item}>
              <span>0{index + 1}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h2>{data.goals.title}</h2>
        <ul className="cec-checklist">
          {data.goals.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <Inquiry />
    </Page>
  );
}
