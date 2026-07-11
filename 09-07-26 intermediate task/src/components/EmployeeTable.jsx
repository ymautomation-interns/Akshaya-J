import { memo } from 'react'

const EmployeeRow = memo(function EmployeeRow({ employee, onEdit, onDelete, showActions }) {
  return (
    <tr>
      <td>{employee.name}</td>
      <td>{employee.email}</td>
      <td>{employee.department}</td>
      <td>{employee.role}</td>
      <td>
        <span className="status-pill">{employee.status}</span>
      </td>
      {showActions ? (
        <td className="table-actions">
          <button type="button" className="ghost-button" onClick={() => onEdit(employee)}>
            Edit
          </button>
          <button type="button" className="danger-button" onClick={() => onDelete(employee.id)}>
            Delete
          </button>
        </td>
      ) : null}
    </tr>
  )
})

const EmployeeTable = memo(function EmployeeTable({ employees, onEdit, onDelete, showActions = true }) {
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            {showActions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              onEdit={onEdit}
              onDelete={onDelete}
              showActions={showActions}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default EmployeeTable
