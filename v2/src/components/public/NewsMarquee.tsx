import { useState } from 'react';
import { Link } from 'react-router-dom';
import { publicContent } from '../../services/publicContent';

type NewsItem = (typeof publicContent.news)[number];
function NewsCopy({ items, duplicate = false }: { items: NewsItem[]; duplicate?: boolean }) {
  return (
    <div className="cec-marquee-copy" aria-hidden={duplicate || undefined}>
      {items.map((item) =>
        duplicate ? (
          <span key={item.slug}>
            <span>{item.category}</span>
            {item.title}
          </span>
        ) : (
          <Link key={item.slug} to={'/news-event/' + item.slug}>
            <span>{item.category}</span>
            {item.title}
          </Link>
        ),
      )}
    </div>
  );
}
function PlaybackIcon({ paused }: { paused: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {paused ? (
        <path d="M7 4v16l13-8z" />
      ) : (
        <>
          <path d="M6 4h4v16H6z" />
          <path d="M14 4h4v16h-4z" />
        </>
      )}
    </svg>
  );
}
export default function NewsMarquee() {
  const [paused, setPaused] = useState(false);
  const news = publicContent.news.slice(0, 4);
  if (!news.length) return null;
  const actionLabel = paused ? 'Resume news ticker' : 'Pause news ticker';
  return (
    <section className={'cec-marquee' + (paused ? ' is-paused' : '')} aria-label="Latest news">
      <span className="cec-marquee-label">LATEST AT CEC</span>
      <div className="cec-marquee-window">
        <div className="cec-marquee-track">
          <NewsCopy items={news} />
          <NewsCopy items={news} duplicate />
        </div>
      </div>
      <button
        type="button"
        aria-pressed={paused}
        aria-label={actionLabel}
        title={actionLabel}
        onClick={() => setPaused((value) => !value)}
      >
        <PlaybackIcon paused={paused} />
      </button>
    </section>
  );
}
