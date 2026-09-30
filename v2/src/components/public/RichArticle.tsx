import { Fragment } from 'react';
export function InlineCopy({ text }: { text: string }) {
  // Render limited editorial formatting as React nodes, never executable HTML.
  return (
    <>
      {text.split(/(<strong>.*?<\/strong>|<em>.*?<\/em>|<br\s*\/?>)/gi).map((part, index) => (
        <Fragment key={index}>
          {/^<strong>/i.test(part) ? (
            <strong>{part.replace(/<[^>]*>/g, '')}</strong>
          ) : /^<em>/i.test(part) ? (
            <em>{part.replace(/<[^>]*>/g, '')}</em>
          ) : /^<br/i.test(part) ? (
            <br />
          ) : (
            part.replace(/<[^>]*>/g, '')
          )}
        </Fragment>
      ))}
    </>
  );
}
export default function RichArticle({
  blocks,
  content,
}: {
  blocks?: { type: string; value?: string; url?: string; caption?: string }[];
  content?: string;
}) {
  return (
    <div className="cec-rich-article">
      {blocks?.length
        ? blocks.map((block, index) => {
            if (block.type === 'paragraph')
              return (
                <p key={index}>
                  <InlineCopy text={block.value || ''} />
                </p>
              );
            if (block.type === 'image')
              return (
                <figure key={index}>
                  <img src={block.url} alt={block.caption || ''} loading="lazy" />
                  {block.caption && <figcaption>{block.caption}</figcaption>}
                </figure>
              );
            if (block.type === 'video')
              return (
                <figure key={index}>
                  <video controls preload="none" src={block.url} />
                  {block.caption && <figcaption>{block.caption}</figcaption>}
                </figure>
              );
            if (block.type === 'youtube' || block.type === 'youtube-shorts') {
              let id = '';
              try {
                const url = new URL(block.url || '');
                if (
                  ['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtu.be'].includes(
                    url.hostname,
                  )
                )
                  id = url.hostname.includes('youtu.be')
                    ? url.pathname.slice(1)
                    : url.searchParams.get('v') || url.pathname.split('/')[2] || '';
              } catch {}
              return /^[a-zA-Z0-9_-]{11}$/.test(id) ? (
                <figure
                  key={index}
                  className={block.type === 'youtube-shorts' ? 'cec-video-short' : 'cec-video'}
                >
                  <iframe
                    src={'https://www.youtube-nocookie.com/embed/' + id}
                    title={block.caption || 'Project video'}
                    loading="lazy"
                    allowFullScreen
                  />
                  <figcaption>{block.caption}</figcaption>
                </figure>
              ) : null;
            }
            if (
              block.type === 'facebook' &&
              /^https:\/\/(www\.)?facebook\.com\//.test(block.url || '')
            )
              return (
                <p key={index}>
                  <a className="cec-text-link" href={block.url} target="_blank" rel="noreferrer">
                    {block.caption || 'View the Facebook post'} ↗
                  </a>
                </p>
              );
            return null;
          })
        : content?.split(/\n\n+/).map((paragraph, index) => (
            <p key={index}>
              <InlineCopy text={paragraph} />
            </p>
          ))}
    </div>
  );
}
