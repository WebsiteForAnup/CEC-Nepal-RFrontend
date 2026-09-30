import Page from '../components/public/Page';
import Arrow from '../components/public/Arrow';
import { publicContent, serviceGroups } from '../services/publicContent';
import LeafletMap from '../components/public/LeafletMap';
import type { MapLayer } from '../services/projectGeography';
const officeLayers: MapLayer[] = publicContent.contact.mapCoordinates.map((office, index) => ({
  id: 'office-' + index,
  projectSlug: '',
  name: office.popUpDetails.type,
  source: office.popUpDetails.address,
  geojson: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: office.popUpDetails.type },
        geometry: {
          type: 'Point',
          coordinates: [Number(office.longitude), Number(office.latitude)],
        },
      },
    ],
  },
}));
export default function Contact() {
  const data = publicContent.contact;
  return (
    <Page
      title="Your vision. Our expertise."
      intro="Planning a new project or advancing an existing one? Start a conversation with CEC Nepal."
    >
      <div className="cec-contact-layout">
        <section>
          <p className="cec-eyebrow">LET’S CONNECT</p>
          <h2>Talk to our team.</h2>
          <address>
            {data.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <a href={'mailto:' + data.email}>
              {data.email}
              <Arrow diagonal />
            </a>
            <a href={'tel:' + data.phone}>
              {data.phone}
              <Arrow diagonal />
            </a>
          </address>
          <h3>Office hours</h3>
          <ul className="cec-hours">
            {data.officeHours.map((item) => (
              <li key={item.days}>
                <span>{item.days}</span>
                <strong>
                  {item.openTime}
                  {item.openTime !== 'Closed' && ' – ' + item.closeTime}
                </strong>
              </li>
            ))}
          </ul>
        </section>
        <section className="cec-contact-form">
          <h2>Tell us about your project.</h2>
          <form method="post" action={'https://formspree.io/f/' + data.formspreeId}>
            <div className="cec-form-row">
              <p>
                <label>
                  Full name
                  <input name="name" autoComplete="name" required />
                </label>
              </p>
              <p>
                <label>
                  Email address
                  <input name="email" type="email" autoComplete="email" required />
                </label>
              </p>
            </div>
            <p>
              <label>
                Organization
                <input name="organization" autoComplete="organization" />
              </label>
            </p>
            <p>
              <label>
                How can we help?
                <select name="service">
                  <option value="">Select a project stage</option>
                  {serviceGroups.map((group) => (
                    <option key={group.title}>{group.title}</option>
                  ))}
                </select>
              </label>
            </p>
            <p>
              <label>
                Your message
                <textarea name="message" required />
              </label>
            </p>
            <p className="cec-form-note">
              Your inquiry is sent securely through Formspree. Please read our{' '}
              <a href="/privacy">privacy policy</a> before submitting.
            </p>
            <button type="submit" className="cec-button cec-button--dark">
              Send inquiry
              <Arrow diagonal />
            </button>
          </form>
        </section>
      </div>
      <section>
        <p className="cec-eyebrow">FIND US</p>
        <h2>Connected across Nepal.</h2>
        <LeafletMap layers={officeLayers} label="Interactive office map" />
        <div className="cec-offices">
          {data.mapCoordinates.map((office) => (
            <article key={office.popUpDetails.address}>
              <h3>{office.popUpDetails.type}</h3>
              <p>{office.popUpDetails.address}</p>
              <a href={'tel:' + office.popUpDetails.phone}>{office.popUpDetails.phone}</a>
              <a
                className="cec-text-link"
                href={
                  'https://www.google.com/maps/search/?api=1&query=' +
                  office.latitude +
                  ',' +
                  office.longitude
                }
                target="_blank"
                rel="noreferrer"
              >
                Open map
                <Arrow diagonal />
              </a>
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}
