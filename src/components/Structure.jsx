import { Fragment } from 'react';
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

// Anggota dengan teamLayout 'row' memakai kolom sebanyak timnya, supaya tim muat berjajar di bawahnya
const spanOf = (m) => (m.teamLayout === 'row' ? m.team.length : 1);

function Member({ name, role, note, lead, span = 1 }) {
  return (
    <div
      className={`org-card ${lead ? 'lead' : ''} ${span > 1 ? 'wide' : ''}`}
      style={span > 1 ? { '--span': span } : undefined}
    >
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
          {organization.map((tier, ti) => {
            const spans = tier.members.map(spanOf);
            // Kolom awal tiap anggota (1-based), dipakai untuk menaruh cabangnya tepat di bawahnya
            const starts = spans.map((_, i) => 1 + spans.slice(0, i).reduce((a, b) => a + b, 0));
            const cols = spans.reduce((a, b) => a + b, 0);

            return (
              <div
                className="org-tier"
                style={{ '--n': cols, '--fs': spans[0], '--ls': spans[spans.length - 1] }}
                key={tier.level}
              >
                {tier.members.map((m, i) => (
                  <Fragment key={m.role}>
                    <Member {...m} span={spans[i]} />
                    {m.team && (
                      <div
                        className={`org-branch ${m.teamLayout === 'row' ? 'row' : ''}`}
                        style={{ '--col': starts[i], '--span': spans[i] }}
                      >
                        {m.team.map((t, j) => (
                          <Member key={j} {...t} />
                        ))}
                      </div>
                    )}
                  </Fragment>
                ))}
                {/* Garis tengah hanya diteruskan bila masih ada tingkat di bawahnya */}
                {tier.members.some((m) => m.team) && ti < organization.length - 1 && (
                  <span className="org-stem" />
                )}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
