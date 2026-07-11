import { useMemo, useState } from 'react'
import EmployeeTable from '../components/EmployeeTable.jsx'
import StatCard from '../components/StatCard.jsx'
import { seedEmployees } from '../data/seedEmployees.js'

export default function TaskFourPage() {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All')
  const [status, setStatus] = useState('All')

  const filteredEmployees = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return seedEmployees.filter((employee) => {
      const matchesSearch =
        keyword.length === 0 ||
        [employee.name, employee.email, employee.role, employee.department]
          .join(' ')
          .toLowerCase()
          .includes(keyword)

      const matchesDepartment = department === 'All' || employee.department === department
      const matchesStatus = status === 'All' || employee.status === status

      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [department, search, status])

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Task 4</p>
          <h2>Search + Filter Employees</h2>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard label="Records" value={seedEmployees.length} tone="teal" />
        <StatCard label="Matches" value={filteredEmployees.length} tone="violet" />
        <StatCard label="Department" value={department} tone="gold" />
        <StatCard label="Status" value={status} tone="rose" />
      </section>

      <section className="panel-card filter-card">
        <div className="filter-row">
          <label>
            Search
            <input
              type="text"
              placeholder="Search employee"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label>
            Department
            <select value={department} onChange={(event) => setDepartment(event.target.value)}>
              <option value="All">All</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Support">Support</option>
            </select>
          </label>

          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Remote">Remote</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
      </section>

      <section className="panel-card">
        <EmployeeTable employees={filteredEmployees} showActions={false} />
      </section>
    </div>
  )
}
