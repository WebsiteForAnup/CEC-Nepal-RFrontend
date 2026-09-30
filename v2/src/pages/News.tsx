import Collection from '../components/public/Collection';
import { publicContent } from '../services/publicContent';
export default function News() {
  return <Collection title="News & events" items={publicContent.news} detailPath="/news-event/" />;
}
