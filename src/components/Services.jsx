import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import Icon from './Icon.jsx';
import { services } from '../data.js';

export default function Services() {
  return (
    <section id="layanan">
      <div className="container">
        <Reveal>
          <SectionHead eyebrow="Layanan" title="Satu mitra, semua kebutuhan engineering." />
        </Reveal>

        <Reveal className="services-grid">
          {services.map((s, i) => (
            <article className="service" key={s.title}>
              <span className="service-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="service-arrow">
                <Icon name="arrowUpRight" strokeWidth={2} />
              </span>
              <div className="service-icon">
                <Icon name={s.icon} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
