import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import Icon from './Icon.jsx';
import { products, qualityPoints } from '../data.js';

export default function Quality() {
  return (
    <section>
      <div className="container">
        <div className="quality-grid">
          <Reveal className="quality-media">
            <img src="/img/overhaul.jpg" alt="Tim IMM melakukan overhaul alat berat di lapangan" loading="lazy" />
            <img src="/img/hero-boiler.jpg" alt="Pengecekan burner steam boiler" loading="lazy" />
          </Reveal>
          <Reveal>
            <SectionHead eyebrow="Kebijakan Mutu" title="Tanpa kompromi soal kualitas." flush />
            <ul className="checklist">
              {qualityPoints.map((q) => (
                <li key={q}>
                  <Icon name="check" strokeWidth={2} />
                  {q}
                </li>
              ))}
            </ul>
            <div className="products">
              <h3>Produk</h3>
              <div className="tags">
                {products.map((p) => (
                  <span className="tag" key={p}>
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
