import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import Icon from './Icon.jsx';
import { mission, vision } from '../data.js';

export default function About() {
  return (
    <section className="about" id="tentang">
      <div className="container">
        <Reveal>
          <SectionHead eyebrow="Tentang Kami" title="Tim solid. Mesin modern." />
        </Reveal>

        <Reveal className="about-intro">
          <p className="about-lead">Solusi engineering yang dirancang, dibangun, dan dipasang sesuai kebutuhan Anda.</p>
        </Reveal>

        <Reveal className="vm">
          <article className="vm-item">
            <span className="vm-label">
              <i>01</i> Visi
            </span>
            <p className="vm-vision">{vision}</p>
          </article>
          <article className="vm-item">
            <span className="vm-label">
              <i>02</i> Misi
            </span>
            <ul className="vm-list">
              {mission.map((m) => (
                <li key={m}>
                  <Icon name="check" strokeWidth={2} />
                  {m}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
