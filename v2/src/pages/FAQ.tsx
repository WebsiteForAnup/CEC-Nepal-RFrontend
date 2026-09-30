import { Link, useSearchParams } from 'react-router-dom';
import Page from '../components/public/Page';
import Inquiry from '../components/public/Inquiry';
import { publicContent } from '../services/publicContent';
export default function FAQ() {
  const [params] = useSearchParams();
  const category = params.get('category') || '';
  const items = publicContent.faq.filter((item) => !category || item.category === category);
  return (
    <Page
      title="Questions? Let’s find clarity."
      intro="A starting point for understanding our work, process, and expertise."
    >
      <nav className="cec-tabs" aria-label="FAQ categories">
        <Link to="/faq" aria-current={!category ? 'page' : undefined}>
          All questions
        </Link>
        {[...new Set(publicContent.faq.map((item) => item.category))].map((item) => (
          <Link
            key={item}
            to={'/faq?category=' + encodeURIComponent(item)}
            aria-current={category === item ? 'page' : undefined}
          >
            {item}
          </Link>
        ))}
      </nav>
      <section className="cec-faq-list">
        {items.map((item) => (
          <details key={item.slug}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>
      {!items.length && <p>No questions in this category.</p>}
      <Inquiry subject="your questions" />
    </Page>
  );
}
