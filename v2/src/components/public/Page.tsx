import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
export default function Page({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <main id="main-content" className="cec-page">
      <header className="cec-page-heading">
        <div className="cec-container">
          <Link to="/" className="cec-eyebrow">
            CEC NEPAL /
          </Link>
          <h1>{title}</h1>
          {intro && <p>{intro}</p>}
        </div>
      </header>
      <div className="cec-container cec-page-content">{children}</div>
    </main>
  );
}
