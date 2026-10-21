import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import { organization } from '../data.js';

const initials = (text) =>
  text
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

function Member({ name, role, note, lead }) {
  return (
    <div className={`org-card ${lead ? 'lead' : ''}`}>
      <span className="org-avatar">{initials(name ?? role)}</span>
      <div>
        <strong>{name ?? role}</strong>
        <span>{name ? role : 'Tim'}</span>
        {note && <small>↳ {note}</small>}
      </div>
    </div>
  );
}

export default function Structure() {
  return (
    <section className="structure" id="struktur">
      <div className="container">
        <Reveal>
          <SectionHead eyebrow="Struktur Organisasi" title="Tim di balik setiap proyek." />
        </Reveal>

        <Reveal className="org">
          {organization.map((tier) => (
            <div className="org-tier" style={{ '--n': tier.members.length }} key={tier.level}>
              {tier.members.map((m) => (
                <Member key={m.role} {...m} />
              ))}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
