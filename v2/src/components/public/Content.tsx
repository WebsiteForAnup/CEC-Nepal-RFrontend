// Render editorial JSON as semantic sections without implementation metadata.
const excluded =
  /^(id|slug|icon|image|image_url|images|heroImage|ordering|ordering_rank|has_page|isDemo|duration|start|end|color|link|scrollTo|ctaLink|downloadUrl)$/;
const label = (key: string) => key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
export default function Content({ value }: { value: unknown }) {
  if (value == null || typeof value === 'boolean') return null;
  if (typeof value === 'string' || typeof value === 'number') return <p>{String(value)}</p>;
  if (Array.isArray(value))
    return (
      <ul>
        {value.map((item, index) => (
          <li key={index}>
            <Content value={item} />
          </li>
        ))}
      </ul>
    );
  return (
    <>
      {Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !excluded.test(key))
        .map(([key, item]) => (
          <section key={key}>
            <h2>{label(key)}</h2>
            <Content value={item} />
          </section>
        ))}
    </>
  );
}
