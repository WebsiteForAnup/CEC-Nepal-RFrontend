import LegalDocument from '../components/public/LegalDocument';
import terms from '../data/terms.html?raw';
export default function Terms() {
  return <LegalDocument title="Terms of service" html={terms} />;
}
