import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import Icon from './Icon.jsx';
import { useContent } from '../content.jsx';

export default function About() {
  const { about } = useContent();

  return (
    <section className="about" id="tentang">
      <div className="container">
        <Reveal>
          <SectionHead eyebrow={about.eyebrow} title={about.title} />
        </Reveal>

        <Reveal className="about-intro">
          <p className="about-lead">{about.lead}</p>
        </Reveal>

        <Reveal className="vm">
          <article className="vm-item">
            <span className="vm-label">
              <i>01</i> Visi
            </span>
            <p className="vm-vision">{about.vision}</p>
          </article>
          <article className="vm-item">
            <span className="vm-label">
              <i>02</i> Misi
            </span>
            <ul className="vm-list">
              {about.mission.map((m, i) => (
                <li key={i}>
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
