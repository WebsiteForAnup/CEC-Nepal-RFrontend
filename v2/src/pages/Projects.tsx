import Collection from '../components/public/Collection';
import { publicContent } from '../services/publicContent';
export default function Projects() {
  return <Collection title="Projects" items={publicContent.projects} detailPath="/project/" />;
}
