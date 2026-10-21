export default function SectionHead({ eyebrow, title, children, flush = false }) {
  return (
    <div className="section-head" style={flush ? { marginBottom: 0 } : undefined}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
