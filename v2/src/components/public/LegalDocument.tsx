import Page from './Page';
export default function LegalDocument({ title, html }: { title: string; html: string }) {
  const headings = [...html.matchAll(/<h[12] id="([^"]+)"[^>]*>([\s\S]*?)<\/h[12]>/g)].map(
    (match) => ({ id: match[1], title: match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ') }),
  );
  return (
    <Page title={title}>
      <div className="cec-legal-layout">
        <nav aria-label="On this page">
          <h2>On this page</h2>
          {headings.map((item) => (
            <a key={item.id} href={'#' + item.id}>
              {item.title}
            </a>
          ))}
        </nav>
        <article
          className="cec-legal-copy"
          dangerouslySetInnerHTML={{
            __html: html.replace(/<h1\b/g, '<h2').replace(/<\/h1>/g, '</h2>'),
          }}
        />
      </div>
    </Page>
  );
}
