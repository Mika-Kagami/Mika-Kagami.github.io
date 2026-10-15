export function SectionHeading({ index, eyebrow, title, text }) {
  return (
    <div className="section-heading">
      <div className="section-heading__meta">
        <span>{index}</span>
        <p>{eyebrow}</p>
      </div>
      <h2>{title}</h2>
      {text && <p className="section-heading__text">{text}</p>}
    </div>
  );
}
