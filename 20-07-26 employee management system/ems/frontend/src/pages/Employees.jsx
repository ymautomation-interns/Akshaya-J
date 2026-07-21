import { useEffect, useState } from 'react';
import { Pencil, Trash2, UserPlus, X } from 'lucide-react';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Table from '../components/Table';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import Avatar from '../components/Avatar';
import employeeService from '../services/employeeService';
import roleService from '../services/roleService';

const emptyForm = {
  employee_id: '',
  employee_name: '',
  role_id: '',
  reporting_to: '',
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [reportingOptions, setReportingOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingReportingOptions, setLoadingReportingOptions] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const selectedRole = roles.find((r) => String(r.role_id) === String(form.role_id));
  const isSuperAdmin = selectedRole?.role_name === 'Super Admin';

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [empRes, roleRes] = await Promise.all([
        employeeService.getAll(),
        roleService.getAll(),
      ]);
      setEmployees(empRes.data.data);
      setRoles(roleRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Whenever the selected role changes, fetch valid "Reporting To" options
  // from the backend. All hierarchy logic lives server-side.
  useEffect(() => {
    const fetchReportingOptions = async () => {
      if (!selectedRole) {
        setReportingOptions([]);
        return;
      }

      if (selectedRole.role_name === 'Super Admin') {
        setReportingOptions([]);
        setForm((prev) => ({ ...prev, reporting_to: '' }));
        return;
      }

      try {
        setLoadingReportingOptions(true);
        const res = await employeeService.getReportingOptions(selectedRole.role_name);
        setReportingOptions(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reporting options');
      } finally {
        setLoadingReportingOptions(false);
      }
    };

    fetchReportingOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.role_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset reporting_to whenever role changes to avoid stale/invalid selection
      ...(name === 'role_id' ? { reporting_to: '' } : {}),
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.employee_id.trim()) newErrors.employee_id = 'Employee ID cannot be empty';
    if (!form.employee_name.trim()) newErrors.employee_name = 'Employee Name cannot be empty';
    if (!form.role_id) newErrors.role_id = 'Role must be selected';
    if (!isSuperAdmin && form.role_id && !form.reporting_to) {
      newErrors.reporting_to = 'Reporting To is required for this role';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      employee_id: form.employee_id.trim(),
      employee_name: form.employee_name.trim(),
      role_id: Number(form.role_id),
      reporting_to: isSuperAdmin ? null : form.reporting_to ? Number(form.reporting_to) : null,
    };

    try {
      setSaving(true);
      if (editingId) {
        await employeeService.update(editingId, payload);
        setSuccess('Employee updated successfully');
      } else {
        await employeeService.create(payload);
        setSuccess('Employee added successfully');
      }
      resetForm();
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setForm({
      employee_id: emp.employee_id,
      employee_name: emp.employee_name,
      role_id: String(emp.role_id),
      reporting_to: emp.reporting_to ? String(emp.reporting_to) : '',
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (emp) => {
    if (!window.confirm(`Delete employee "${emp.employee_name}"?`)) return;
    try {
      await employeeService.remove(emp.id);
      setSuccess('Employee deleted successfully');
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const roleOptions = roles.map((r) => ({ value: r.role_id, label: r.role_name }));
  const reportingSelectOptions = reportingOptions.map((e) => ({
    value: e.id,
    label: e.employee_id,
  }));

  const columns = [
    {
      key: 'employee_name',
      label: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.employee_name} size="sm" />
          <div className="leading-tight">
            <p className="font-medium text-gray-800">{row.employee_name}</p>
            <p className="text-xs text-gray-400">{row.employee_id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role_name',
      label: 'Role',
      render: (row) => (
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-50 text-primary-700">
          {row.role_name}
        </span>
      ),
    },
    {
      key: 'reporting_to_employee_id',
      label: 'Reporting To',
      render: (row) => row.reporting_to_employee_id || <span className="text-gray-400">—</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-display font-bold text-gray-900">Employee Details</h2>
        <p className="text-sm text-gray-500 mt-1">Add employees and manage the reporting hierarchy.</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Employee Form */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <UserPlus size={16} className="text-primary-600" />
            </span>
            {editingId ? 'Edit Employee' : 'Add New Employee'}
          </h3>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"
            >
              <X size={14} /> Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Employee ID"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            placeholder="EMP011"
            error={errors.employee_id}
          />
          <Input
            label="Employee Name"
            name="employee_name"
            value={form.employee_name}
            onChange={handleChange}
            placeholder="Jane Doe"
            error={errors.employee_name}
          />
          <Select
            label="Role"
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            options={roleOptions}
            placeholder="Select a role"
            error={errors.role_id}
          />

          {isSuperAdmin ? (
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reporting To</label>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-400">
                No Reporting Required
              </div>
            </div>
          ) : (
            <Select
              label="Reporting To"
              name="reporting_to"
              value={form.reporting_to}
              onChange={handleChange}
              options={reportingSelectOptions}
              placeholder={
                !form.role_id
                  ? 'Select a role first'
                  : loadingReportingOptions
                  ? 'Loading...'
                  : reportingSelectOptions.length === 0
                  ? 'No eligible managers found'
                  : 'Select employee ID'
              }
              error={errors.reporting_to}
              disabled={!form.role_id || loadingReportingOptions}
            />
          )}

          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            {editingId && (
              <Button variant="secondary" type="button" onClick={resetForm}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Employee' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>

      {/* Employee Table */}
      {loading ? (
        <Loader label="Loading employees..." />
      ) : (
        <Table columns={columns} data={employees} emptyMessage="No employees found" />
      )}
    </div>
  );
};

export default Employees;
