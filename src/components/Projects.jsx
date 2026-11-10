import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import { imgSrc } from '../data.js';
import { useContent } from '../content.jsx';

export default function Projects() {
  const { projects } = useContent();
  const { highlight } = projects;

  return (
    <section className="projects" id="proyek">
      <div className="container">
        <Reveal>
          <SectionHead eyebrow={projects.eyebrow} title={projects.title} />
        </Reveal>

        <Reveal className="gallery">
          {projects.items.map((p, i) => (
            <figure className={`shot ${p.size ?? ''}`} key={i}>
              <img src={imgSrc(p.img)} alt={p.alt} loading="lazy" />
              <figcaption>
                {p.title}
                <span>{p.sub}</span>
              </figcaption>
            </figure>
          ))}
        </Reveal>

        {highlight?.title && (
          <Reveal className="highlight">
            <div>
              <strong>{highlight.title}</strong>
              <p>{highlight.desc}</p>
            </div>
            <span className="year">{highlight.year}</span>
          </Reveal>
        )}
      </div>
    </section>
  );
}
