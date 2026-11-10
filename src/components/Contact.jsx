import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';
import { useContent } from '../content.jsx';

export default function Contact() {
  const { company, contact } = useContent();
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
            <span className="eyebrow">{contact.eyebrow}</span>
            <h2>{contact.title}</h2>
            <p>{contact.lead}</p>
            <div className="hero-cta">
              <a href={company.whatsapp} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                Chat WhatsApp <Icon name="arrow" strokeWidth={2} />
              </a>
              <a href={`mailto:${company.email}`} className="btn btn-ghost">
                Kirim Email
              </a>
            </div>
            <div className="people">
              {contact.persons.map((p, i) => (
                <div className="person" key={i}>
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
