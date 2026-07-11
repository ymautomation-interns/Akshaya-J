export default function TaskPageShell({ number, title, subtitle, bullets = [] }) {
  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Task {number}</p>
          <h2>{title}</h2>
        </div>
      </div>

      <section className="panel-card">
        <p>{subtitle}</p>
        <ul className="feature-list">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
