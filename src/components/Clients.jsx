import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import { useContent } from '../content.jsx';

export default function Clients() {
  const { clients } = useContent();

  return (
    <section className="clients" id="klien">
      <div className="container">
        <Reveal>
          <SectionHead eyebrow={clients.eyebrow} title={clients.title} />
        </Reveal>

        <Reveal className="client-grid">
          {clients.items.map((c, i) => (
            <div className="client" key={i}>
              {c}
            </div>
          ))}
        </Reveal>

        <Reveal className="partners">
          <h3>Partner</h3>
          {clients.partners.map((p, i) => (
            <div className="partner" key={i}>
              <strong>{p.name}</strong>
              <span>{p.desc}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
