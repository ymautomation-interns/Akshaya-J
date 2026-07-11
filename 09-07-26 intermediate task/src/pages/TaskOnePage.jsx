import { useCallback, useMemo, useState } from 'react'
import EmployeeModal from '../components/EmployeeModal'
import EmployeeTable from '../components/EmployeeTable'
import StatCard from '../components/StatCard'
import { seedEmployees } from '../data/seedEmployees'
import { useLocalStorage } from '../hooks/useLocalStorage'

const PAGE_SIZE = 3

export default function TaskOnePage() {
  const [employees, setEmployees] = useLocalStorage('employee-list', seedEmployees)
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const departments = useMemo(
    () => ['All', ...new Set(employees.map((employee) => employee.department))],
    [employees],
  )

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return employees.filter((employee) => {
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
  }, [departmentFilter, employees, search, statusFilter])

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE)),
    [filteredEmployees.length],
  )

  const currentPage = Math.min(page, totalPages)

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredEmployees.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredEmployees])

  const openCreateModal = useCallback(() => {
    setSelectedEmployee(null)
    setIsModalOpen(true)
  }, [])

  const openEditModal = useCallback((employee) => {
    setSelectedEmployee(employee)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedEmployee(null)
  }, [])

  const handleSaveEmployee = useCallback(
    (payload) => {
      if (selectedEmployee?.id) {
        setEmployees((current) =>
          current.map((employee) =>
            employee.id === selectedEmployee.id ? { ...employee, ...payload } : employee,
          ),
        )
      } else {
        setEmployees((current) => [
          {
            id: Date.now(),
            ...payload,
          },
          ...current,
        ])
      }

      closeModal()
    },
    [closeModal, selectedEmployee, setEmployees],
  )

  const handleDeleteEmployee = useCallback(
    (id) => {
      setEmployees((current) => current.filter((employee) => employee.id !== id))
    },
    [setEmployees],
  )

  const stats = useMemo(() => {
    const total = employees.length
    const active = employees.filter((employee) => employee.status === 'Active').length
    const departmentsCount = new Set(employees.map((employee) => employee.department)).size

    return [
      { label: 'Employees', value: total, tone: 'teal' },
      { label: 'Active', value: active, tone: 'violet' },
      { label: 'Departments', value: departmentsCount, tone: 'gold' },
      { label: 'Filtered', value: filteredEmployees.length, tone: 'rose' },
    ]
  }, [employees, filteredEmployees.length])

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Task 1</p>
          <h2>Employee CRUD with Local State</h2>
        </div>
        <button type="button" className="primary-button" onClick={openCreateModal}>
          + Add Employee
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
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />
          </label>

          <label>
            Department
            <select
              value={departmentFilter}
              onChange={(event) => {
                setDepartmentFilter(event.target.value)
                setPage(1)
              }}
            >
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value)
                setPage(1)
              }}
            >
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
        <EmployeeTable employees={paginatedEmployees} onEdit={openEditModal} onDelete={handleDeleteEmployee} />
      ) : (
        <div className="panel-card empty-state">
          <h3>No matching employees</h3>
          <p>Adjust the filters or add a new employee card.</p>
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

      <EmployeeModal
        isOpen={isModalOpen}
        initialValues={selectedEmployee}
        onClose={closeModal}
        onSave={handleSaveEmployee}
      />
    </div>
  )
}
