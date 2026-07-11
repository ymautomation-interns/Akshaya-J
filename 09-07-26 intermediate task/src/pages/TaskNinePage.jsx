import { useTheme } from '../context/useTheme.js'
import StatCard from '../components/StatCard.jsx'

export default function TaskNinePage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Task 9</p>
          <h2>Context API Theme Provider</h2>
        </div>
        <button type="button" className="primary-button" onClick={toggleTheme}>
          Switch to {theme === 'dark' ? 'light' : 'dark'} mode
        </button>
      </div>

      <section className="stats-grid">
        <StatCard label="Theme" value={theme} tone="teal" />
        <StatCard label="Provider" value="Context" tone="violet" />
        <StatCard label="Scope" value="App shell" tone="gold" />
        <StatCard label="Status" value="Live" tone="rose" />
      </section>

      <section className="dashboard-grid">
        <article className="panel-card">
          <h3>Theme Preview</h3>
          <p>Use the button above to switch between light and dark layout modes.</p>
        </article>
        <article className="panel-card">
          <h3>Shared UI State</h3>
          <p>The theme context is used across the dashboard layout and page shell.</p>
        </article>
      </section>
    </div>
  )
}
