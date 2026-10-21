import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';
import CountUp from './CountUp.jsx';
import { stats } from '../data.js';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <Reveal>
            <span className="pill">
              <i className="pulse" />
              General Contractor · Batam
            </span>
            <h1>
              Engineering{' '}
              <em>
                presisi
                <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 9C50 3 150 2 198 7" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </em>{' '}
              untuk industri.
            </h1>
            <p className="hero-lead">Steam boiler, piping, electrical, hingga automation — dikerjakan dengan tepat.</p>
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
            <img src="/img/hero-boiler.jpg" alt="Teknisi IMM melakukan commissioning burner steam boiler" />
            <span className="hero-chip">
              <Icon name="bolt" strokeWidth={2} />
              Mechanical · Electrical · Automation
            </span>
            <div className="hero-badge float">
              <i className="dot" />
              <div>
                <strong>Office & Workshop</strong>
                <span>Batam, Kepulauan Riau</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <b>
                <CountUp to={s.value} />
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
