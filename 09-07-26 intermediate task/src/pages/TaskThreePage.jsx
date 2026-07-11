import { useMemo, useState } from 'react'
import EmployeeTable from '../components/EmployeeTable.jsx'
import StatCard from '../components/StatCard.jsx'
import { seedEmployees } from '../data/seedEmployees.js'

const PAGE_SIZE = 3

export default function TaskThreePage() {
  const [page, setPage] = useState(1)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(seedEmployees.length / PAGE_SIZE)), [])
  const currentPage = Math.min(page, totalPages)

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return seedEmployees.slice(start, start + PAGE_SIZE)
  }, [currentPage])

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Task 3</p>
          <h2>Implement Pagination</h2>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard label="Employees" value={seedEmployees.length} tone="teal" />
        <StatCard label="Page Size" value={PAGE_SIZE} tone="violet" />
        <StatCard label="Current Page" value={currentPage} tone="gold" />
        <StatCard label="Total Pages" value={totalPages} tone="rose" />
      </section>

      <section className="panel-card">
        <EmployeeTable employees={paginatedEmployees} showActions={false} />
      </section>

      <section className="pagination-row">
        <button
          type="button"
          className="ghost-button"
          disabled={currentPage === 1}
          onClick={() => setPage((value) => Math.max(value - 1, 1))}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          className="ghost-button"
          disabled={currentPage === totalPages}
          onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
        >
          Next
        </button>
      </section>
    </div>
  )
}
