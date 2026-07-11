import { Link } from 'react-router-dom'
import { useTheme } from '../context/useTheme.js'
import StatCard from '../components/StatCard'

const summaryCards = [
  { label: 'Employees', value: '48', tone: 'teal' },
  { label: 'Departments', value: '6', tone: 'violet' },
  { label: 'Remote', value: '12', tone: 'gold' },
  { label: 'Inactive', value: '3', tone: 'rose' },
]

export default function DashboardHome() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Mini Employee Dashboard</p>
          <h2>Overview</h2>
        </div>
        <button type="button" className="primary-button" onClick={toggleTheme}>
          Switch to {theme === 'dark' ? 'light' : 'dark'} theme
        </button>
      </div>

      <section className="stats-grid">
        {summaryCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} tone={card.tone} />
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel-card">
          <h3>Task Navigation</h3>
          <div className="task-links">
            <Link to="/task1" className="task-link">Open Task 1</Link>
            <Link to="/task2" className="task-link">Open Task 2</Link>
          </div>
        </article>

        <article className="panel-card">
          <h3>Features Covered</h3>
          <ul className="feature-list">
            <li>Local CRUD with persistent state</li>
            <li>React Query employee fetching</li>
            <li>Pagination, search, and filters</li>
            <li>Modal add/edit workflow</li>
            <li>Theme context and memoized optimization</li>
          </ul>
        </article>
      </section>
    </div>
  )
}
