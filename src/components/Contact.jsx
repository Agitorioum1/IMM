import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';
import { company, contactPersons } from '../data.js';

export default function Contact() {
  const rows = [
    { label: 'Alamat', value: company.address },
    { label: 'Telepon', value: company.phone.label, href: company.phone.href },
    { label: 'Handphone', value: company.mobile.label, href: company.mobile.href },
    { label: 'Email', value: company.email, href: `mailto:${company.email}` },
  ];

  return (
    <section id="kontak">
      <div className="container">
        <Reveal className="contact-card">
          <div>
            <span className="eyebrow">Kontak</span>
            <h2>Mari bicara.</h2>
            <p>Ceritakan kebutuhan proyek Anda.</p>
            <div className="hero-cta">
              <a href={company.whatsapp} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                Chat WhatsApp <Icon name="arrow" strokeWidth={2} />
              </a>
              <a href={`mailto:${company.email}`} className="btn btn-ghost">
                Kirim Email
              </a>
            </div>
            <div className="people">
              {contactPersons.map((p) => (
                <div className="person" key={p.name}>
                  <strong>{p.name}</strong>
                  <span>{p.role}</span>
                  <a href={p.href}>{p.phone}</a>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-list">
            {rows.map((r) => (
              <div className="contact-row" key={r.label}>
                <span>{r.label}</span>
                {r.href ? <a href={r.href}>{r.value}</a> : <p>{r.value}</p>}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
