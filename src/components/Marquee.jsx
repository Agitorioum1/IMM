import { jobScope } from '../data.js';

// Pita lingkup pekerjaan yang bergerak pelan. Daftar digandakan agar loop mulus.
export default function Marquee() {
  return (
    <div className="marquee" aria-label="Lingkup pekerjaan">
      <div className="marquee-track">
        {[...jobScope, ...jobScope].map((item, i) => (
          <span key={i} aria-hidden={i >= jobScope.length || undefined}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
