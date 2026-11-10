import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';
import CountUp from './CountUp.jsx';
import { imgSrc } from '../data.js';
import { useContent } from '../content.jsx';

export default function Hero() {
  const { hero } = useContent();

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <Reveal>
            <span className="pill">
              <i className="pulse" />
              {hero.pill}
            </span>
            <h1>
              {hero.titleBefore}{' '}
              {hero.titleHighlight && (
                <em>
                  {hero.titleHighlight}
                  <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 9C50 3 150 2 198 7" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </em>
              )}{' '}
              {hero.titleAfter}
            </h1>
            <p className="hero-lead">{hero.lead}</p>
            <div className="hero-cta">
              <a href="#kontak" className="btn btn-primary">
                Konsultasi Proyek <Icon name="arrow" strokeWidth={2} />
              </a>
              <a href="#proyek" className="btn btn-ghost">
                Lihat Proyek
              </a>
            </div>
          </Reveal>

          <Reveal className="hero-media">
            <img src={imgSrc(hero.image)} alt={hero.imageAlt} />
            <span className="hero-chip">
              <Icon name="bolt" strokeWidth={2} />
              {hero.chip}
            </span>
            <div className="hero-badge float">
              <i className="dot" />
              <div>
                <strong>{hero.badgeTitle}</strong>
                <span>{hero.badgeText}</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="stats">
          {hero.stats.map((s, i) => (
            <div className="stat" key={i}>
              <b>
                <CountUp to={Number(s.value) || 0} />
                {s.suffix && <sup>{s.suffix}</sup>}
              </b>
              <span>{s.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
