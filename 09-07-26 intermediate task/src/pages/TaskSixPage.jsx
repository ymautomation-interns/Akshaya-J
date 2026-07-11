import { useLocalStorage } from '../hooks/useLocalStorage.js'
import StatCard from '../components/StatCard.jsx'

export default function TaskSixPage() {
  const [savedNote, setSavedNote] = useLocalStorage('demo-note', 'Employee sync is active.')

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Task 6</p>
          <h2>Create Reusable useLocalStorage Hook</h2>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard label="Storage Key" value="demo-note" tone="teal" />
        <StatCard label="Browser Persisted" value="Yes" tone="violet" />
        <StatCard label="Current Value" value={savedNote.length > 20 ? 'Saved' : 'Ready'} tone="gold" />
        <StatCard label="Hook" value="useLocalStorage" tone="rose" />
      </section>

      <section className="panel-card">
        <label>
          Local Storage Demo
          <textarea
            rows="4"
            value={savedNote}
            onChange={(event) => setSavedNote(event.target.value)}
          />
        </label>
        <p className="helper-text">This value stays preserved in the browser after refresh.</p>
      </section>
    </div>
  )
}
