import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import Icon from './Icon.jsx';
import { imgSrc } from '../data.js';
import { useContent } from '../content.jsx';

export default function Quality() {
  const { quality } = useContent();

  return (
    <section>
      <div className="container">
        <div className="quality-grid">
          <Reveal className="quality-media">
            {quality.images.map((p, i) => (
              <img key={i} src={imgSrc(p.img)} alt={p.alt} loading="lazy" />
            ))}
          </Reveal>
          <Reveal>
            <SectionHead eyebrow={quality.eyebrow} title={quality.title} flush />
            <ul className="checklist">
              {quality.points.map((q, i) => (
                <li key={i}>
                  <Icon name="check" strokeWidth={2} />
                  {q}
                </li>
              ))}
            </ul>
            <div className="products">
              <h3>Produk</h3>
              <div className="tags">
                {quality.products.map((p, i) => (
                  <span className="tag" key={i}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
