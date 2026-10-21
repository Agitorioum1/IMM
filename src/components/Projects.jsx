import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import { highlightProject, projects } from '../data.js';

export default function Projects() {
  return (
    <section className="projects" id="proyek">
      <div className="container">
        <Reveal>
          <SectionHead eyebrow="Proyek" title="Hasil kerja di lapangan." />
        </Reveal>

        <Reveal className="gallery">
          {projects.map((p) => (
            <figure className={`shot ${p.size ?? ''}`} key={p.img}>
              <img src={`/img/${p.img}`} alt={p.alt} loading="lazy" />
              <figcaption>
                {p.title}
                <span>{p.sub}</span>
              </figcaption>
            </figure>
          ))}
        </Reveal>

        <Reveal className="highlight">
          <div>
            <strong>{highlightProject.title}</strong>
            <p>{highlightProject.desc}</p>
          </div>
          <span className="year">{highlightProject.year}</span>
        </Reveal>
      </div>
    </section>
  );
}
