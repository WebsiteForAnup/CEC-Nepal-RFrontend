export default function Facts({ items }: { items: [string, unknown][] }) {
  return (
    <dl className="cec-facts">
      {items
        .filter(([, value]) => value != null && value !== '')
        .map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{String(value)}</dd>
          </div>
        ))}
    </dl>
  );
}
