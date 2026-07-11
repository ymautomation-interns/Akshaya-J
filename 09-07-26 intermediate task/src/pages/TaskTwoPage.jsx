import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import EmployeeTable from '../components/EmployeeTable'
import StatCard from '../components/StatCard'
import { fetchEmployees } from '../services/employeeApi'

const PAGE_SIZE = 3

export default function TaskTwoPage() {
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)

  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  })

  const departments = useMemo(
    () => ['All', ...new Set(data.map((employee) => employee.department))],
    [data],
  )

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return data.filter((employee) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [employee.name, employee.email, employee.role, employee.department]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)

      const matchesDepartment =
        departmentFilter === 'All' || employee.department === departmentFilter
      const matchesStatus = statusFilter === 'All' || employee.status === statusFilter

      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [data, departmentFilter, search, statusFilter])

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE)),
    [filteredEmployees.length],
  )

  const currentPage = Math.min(page, totalPages)

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredEmployees.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredEmployees])

  const stats = useMemo(
    () => [
      { label: 'Fetched', value: data.length, tone: 'teal' },
      { label: 'Filtered', value: filteredEmployees.length, tone: 'violet' },
      { label: 'Pages', value: totalPages, tone: 'gold' },
      { label: 'Query Status', value: isLoading ? 'Loading' : 'Ready', tone: 'rose' },
    ],
    [data.length, filteredEmployees.length, isLoading, totalPages],
  )

  if (isLoading) {
    return <div className="page-shell panel-card">Loading employee data from React Query…</div>
  }

  if (isError) {
    return (
      <div className="page-shell panel-card error-card">
        <h3>Could not load employee data</h3>
        <button type="button" className="primary-button" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Task 2</p>
          <h2>Fetch Employees using React Query</h2>
        </div>
        <button type="button" className="primary-button" onClick={() => refetch()}>
          Refresh Query
        </button>
      </div>

      <section className="stats-grid">
        {stats.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} tone={card.tone} />
        ))}
      </section>

      <section className="panel-card filter-card">
        <div className="filter-row">
          <label>
            Search
            <input
              type="text"
              placeholder="Search by name, email or role"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label>
            Department
            <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Remote">Remote</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
      </section>

      {paginatedEmployees.length > 0 ? (
        <EmployeeTable employees={paginatedEmployees} showActions={false} />
      ) : (
        <div className="panel-card empty-state">
          <h3>No query results found</h3>
          <p>Try a different search combination.</p>
        </div>
      )}

      <section className="pagination-row">
        <button
          type="button"
          className="ghost-button"
          disabled={page === 1}
          onClick={() => setPage((current) => Math.max(current - 1, 1))}
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
          onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
        >
          Next
        </button>
      </section>
    </div>
  )
}
