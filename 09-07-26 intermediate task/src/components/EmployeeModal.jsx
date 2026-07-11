import { useMemo, useState } from 'react'

const defaultFormData = {
  name: '',
  email: '',
  department: 'Engineering',
  role: '',
  status: 'Active',
}

export default function EmployeeModal({ isOpen, initialValues, onClose, onSave }) {
  const [formData, setFormData] = useState(() => ({
    ...defaultFormData,
    ...(initialValues || {}),
  }))

  const isEditMode = useMemo(() => Boolean(initialValues?.id), [initialValues])

  if (!isOpen) return null

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave(formData)
  }

  const resetForm = () => {
    setFormData({ ...defaultFormData, ...(initialValues || {}) })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Employee Form</p>
            <h2>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
          </div>
          <button type="button" className="ghost-button" onClick={() => {
            resetForm()
            onClose()
          }}>
            Close
          </button>
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Department
            <select name="department" value={formData.department} onChange={handleChange}>
              <option>Engineering</option>
              <option>HR</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>Finance</option>
              <option>Support</option>
            </select>
          </label>
          <label>
            Role
            <input name="role" value={formData.role} onChange={handleChange} required />
          </label>
          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange}>
              <option>Active</option>
              <option>On Leave</option>
              <option>Remote</option>
              <option>Inactive</option>
            </select>
          </label>

          <div className="form-actions">
            <button type="button" className="ghost-button" onClick={() => {
              resetForm()
              onClose()
            }}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {isEditMode ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
