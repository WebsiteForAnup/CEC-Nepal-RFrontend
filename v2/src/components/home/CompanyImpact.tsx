import { publicContent } from '../../services/publicContent';

export default function CompanyImpact() {
  return (
    <section className="cec-impact">
      <div className="cec-container">
        <div className="cec-impact-heading">
          <p className="cec-eyebrow">EXPERIENCE THAT MAKES A DIFFERENCE</p>
          <p>
            Built on expertise.
            <br />
            Measured in impact.
          </p>
        </div>
        <dl>
          {publicContent.home.statistics.slice(0, 3).map((item) => (
            <div key={item.id}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
