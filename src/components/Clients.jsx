import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import { clients, partners } from '../data.js';

export default function Clients() {
  return (
    <section className="clients" id="klien">
      <div className="container">
        <Reveal>
          <SectionHead eyebrow="Klien & Partner" title="Dipercaya 24+ perusahaan." />
        </Reveal>

        <Reveal className="client-grid">
          {clients.map((c) => (
            <div className="client" key={c}>
              {c}
            </div>
          ))}
        </Reveal>

        <Reveal className="partners">
          <h3>Partner</h3>
          {partners.map((p) => (
            <div className="partner" key={p.name}>
              <strong>{p.name}</strong>
              <span>{p.desc}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
