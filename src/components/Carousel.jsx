import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { imgSrc } from '../data.js';

// Galeri foto yang digeser ke samping (tombol sebelumnya/berikutnya, swipe, atau titik),
// klik foto untuk melihatnya lebih besar.
export default function Carousel({ images }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(null); // indeks foto yang sedang diperbesar
  const count = images.length;

  const goTo = (i) => {
    const el = track.current;
    el?.scrollTo({ left: i * el.clientWidth });
  };

  // Indeks aktif mengikuti posisi geser, apa pun caranya (tombol, swipe, trackpad)
  const onScroll = () => {
    const el = track.current;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="carousel" aria-roledescription="carousel" aria-label="Foto layanan">
      <div className="carousel-frame">
        <div className="carousel-track" ref={track} onScroll={onScroll}>
          {images.map((p, i) => (
            <button
              type="button"
              className="carousel-slide"
              key={i}
              onClick={() => setZoom(i)}
              aria-label={`Perbesar foto ${i + 1}${p.alt ? `: ${p.alt}` : ''}`}
            >
              <img src={imgSrc(p.img)} alt={p.alt} loading="lazy" />
            </button>
          ))}
        </div>
        {count > 1 && (
          <>
            <button
              type="button"
              className="carousel-nav prev"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Foto sebelumnya"
            >
              <Icon name="arrow" strokeWidth={2} />
            </button>
            <button
              type="button"
              className="carousel-nav next"
              onClick={() => goTo(index + 1)}
              disabled={index === count - 1}
              aria-label="Foto berikutnya"
            >
              <Icon name="arrow" strokeWidth={2} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="carousel-foot">
          <div className="carousel-dots">
            {images.map((_, i) => (
              <button
                type="button"
                key={i}
                className={i === index ? 'active' : ''}
                aria-label={`Foto ${i + 1}`}
                aria-current={i === index || undefined}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <span className="carousel-count">
            {index + 1} / {count}
          </span>
        </div>
      )}

      {zoom !== null && (
        <Lightbox
          images={images}
          index={zoom}
          onChange={setZoom}
          onClose={() => {
            // Slider ikut ke foto terakhir yang dilihat di tampilan besar
            goTo(zoom);
            setZoom(null);
          }}
        />
      )}
    </div>
  );
}

function Lightbox({ images, index, onChange, onClose }) {
  const closeBtn = useRef(null);
  const count = images.length;
  const prev = () => onChange((index - 1 + count) % count);
  const next = () => onChange((index + 1) % count);
  const photo = images[index];

  // Fokus ke tombol tutup, kunci scroll halaman; kembalikan keduanya saat ditutup
  useEffect(() => {
    const opener = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  // Esc menutup, panah kiri/kanan berpindah foto
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && count > 1) prev();
      else if (e.key === 'ArrowRight' && count > 1) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Foto diperbesar"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button type="button" ref={closeBtn} className="lightbox-close" onClick={onClose} aria-label="Tutup">
        ✕
      </button>
      {count > 1 && (
        <button type="button" className="lightbox-nav prev" onClick={prev} aria-label="Foto sebelumnya">
          <Icon name="arrow" strokeWidth={2} />
        </button>
      )}
      <figure key={index}>
        <img src={imgSrc(photo.img)} alt={photo.alt} />
        {(photo.alt || count > 1) && (
          <figcaption>
            {photo.alt && <span>{photo.alt}</span>}
            {count > 1 && (
              <span>
                {index + 1} / {count}
              </span>
            )}
          </figcaption>
        )}
      </figure>
      {count > 1 && (
        <button type="button" className="lightbox-nav next" onClick={next} aria-label="Foto berikutnya">
          <Icon name="arrow" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
