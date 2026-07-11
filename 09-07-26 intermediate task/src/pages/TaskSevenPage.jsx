import { useMemo, useState } from 'react'
import StatCard from '../components/StatCard.jsx'
import { seedEmployees } from '../data/seedEmployees.js'

export default function TaskSevenPage() {
  const [search, setSearch] = useState('')

  const filteredEmployees = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return seedEmployees.filter((employee) =>
      keyword.length === 0 ||
      [employee.name, employee.email, employee.role, employee.department]
        .join(' ')
        .toLowerCase()
        .includes(keyword),
    )
  }, [search])

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Task 7</p>
          <h2>Optimize Search with useMemo</h2>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard label="Total Employees" value={seedEmployees.length} tone="teal" />
        <StatCard label="Memoized Matches" value={filteredEmployees.length} tone="violet" />
        <StatCard label="Search Mode" value="useMemo" tone="gold" />
        <StatCard label="Status" value="Optimized" tone="rose" />
      </section>

      <section className="panel-card">
        <label>
          Search by employee
          <input
            type="text"
            placeholder="Type to filter employees"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="task-list-preview">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="mini-row">
              <strong>{employee.name}</strong>
              <span>{employee.role}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
