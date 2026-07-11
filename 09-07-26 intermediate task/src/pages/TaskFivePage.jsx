import { useCallback, useState } from 'react'
import EmployeeModal from '../components/EmployeeModal.jsx'
import EmployeeTable from '../components/EmployeeTable.jsx'
import StatCard from '../components/StatCard.jsx'
import { seedEmployees } from '../data/seedEmployees.js'

export default function TaskFivePage() {
  const [employees, setEmployees] = useState(seedEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleSave = useCallback(
    (payload) => {
      if (selectedEmployee?.id) {
        setEmployees((current) =>
          current.map((employee) =>
            employee.id === selectedEmployee.id ? { ...employee, ...payload } : employee,
          ),
        )
      } else {
        setEmployees((current) => [{ id: Date.now(), ...payload }, ...current])
      }

      closeModal()
    },
    [closeModal, selectedEmployee],
  )

  const handleDelete = useCallback((id) => {
    setEmployees((current) => current.filter((employee) => employee.id !== id))
  }, [])

  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Task 5</p>
          <h2>Build Modal for Add/Edit</h2>
        </div>
        <button type="button" className="primary-button" onClick={openCreateModal}>
          + Add Employee
        </button>
      </div>

      <section className="stats-grid">
        <StatCard label="Demo Rows" value={employees.length} tone="teal" />
        <StatCard label="Modal Mode" value={selectedEmployee ? 'Edit' : 'Create'} tone="violet" />
        <StatCard label="Status" value="Ready" tone="gold" />
        <StatCard label="Workflow" value="Add/Edit" tone="rose" />
      </section>

      <section className="panel-card">
        <EmployeeTable employees={employees} onEdit={openEditModal} onDelete={handleDelete} />
      </section>

      <EmployeeModal
        key={selectedEmployee?.id ?? 'new-employee'}
        isOpen={isModalOpen}
        initialValues={selectedEmployee}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  )
}
