import { useRef, useState } from 'react';
export default function PhotoGallery({ photos }: { photos: { src: string; caption: string }[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  if (!photos.length) return null;
  return (
    <>
      <div className="cec-photo-grid">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={photo.src + index}
            onClick={() => {
              setActive(index);
              dialog.current?.showModal();
            }}
            aria-label={'View ' + photo.caption}
          >
            <img src={photo.src} alt={photo.caption} loading="lazy" />
            <span>
              {photo.caption}
              <b aria-hidden="true">↗</b>
            </span>
          </button>
        ))}
      </div>
      <dialog className="cec-lightbox" ref={dialog} aria-label="Image viewer">
        <form method="dialog">
          <button aria-label="Close image viewer">Close ×</button>
        </form>
        <img src={photos[active].src} alt={photos[active].caption} />
        <p>{photos[active].caption}</p>
        <div>
          <button type="button" disabled={active === 0} onClick={() => setActive(active - 1)}>
            ← Previous
          </button>
          <span>
            {active + 1} / {photos.length}
          </span>
          <button
            type="button"
            disabled={active === photos.length - 1}
            onClick={() => setActive(active + 1)}
          >
            Next →
          </button>
        </div>
      </dialog>
    </>
  );
}
