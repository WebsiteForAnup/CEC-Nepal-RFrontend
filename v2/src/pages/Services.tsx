import Collection from '../components/public/Collection';
import { publicContent } from '../services/publicContent';
export default function Services() {
  return <Collection title="Services" items={publicContent.services} detailPath="/service/" />;
}
