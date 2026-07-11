import { memo, useCallback, useState } from 'react'
import StatCard from '../components/StatCard.jsx'
import { seedEmployees } from '../data/seedEmployees.js'

const MemoEmployeeRow = memo(function MemoEmployeeRow({ employee, onSelect, selectedId }) {
  return (
    <div className={`mini-row ${selectedId === employee.id ? 'selected' : ''}`}>
      <button type="button" className="ghost-button" onClick={() => onSelect(employee.id)}>
        {selectedId === employee.id ? 'Selected' : 'Select'}
      </button>
      <strong>{employee.name}</strong>
      <span>{employee.department}</span>
    </div>
  )
})

export default function TaskEightPage() {
  const [selectedId, setSelectedId] = useState(1)

  const handleSelect = useCallback((id) => {
    setSelectedId(id)
  }, [])

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Task 8</p>
          <h2>Prevent Unnecessary Renders</h2>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard label="Memoized Rows" value={seedEmployees.length} tone="teal" />
        <StatCard label="Selected ID" value={selectedId} tone="violet" />
        <StatCard label="Technique" value="memo + callback" tone="gold" />
        <StatCard label="Result" value="Fewer rerenders" tone="rose" />
      </section>

      <section className="panel-card">
        {seedEmployees.map((employee) => (
          <MemoEmployeeRow
            key={employee.id}
            employee={employee}
            onSelect={handleSelect}
            selectedId={selectedId}
          />
        ))}
      </section>
    </div>
  )
}
