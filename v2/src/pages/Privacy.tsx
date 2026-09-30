import LegalDocument from '../components/public/LegalDocument';
import { privacyPolicyHtml } from '../data/privacyPolicy';
export default function Privacy() {
  return <LegalDocument title="Privacy policy" html={privacyPolicyHtml} />;
}
