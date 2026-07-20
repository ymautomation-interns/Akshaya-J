import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import roleService from '../services/roleService';

const emptyForm = { role_name: '', description: '' };

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await roleService.getAll();
      setRoles(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openAddModal = () => {
    setEditingRole(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setForm({ role_name: role.role_name, description: role.description || '' });
    setFormError('');
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role_name.trim()) {
      setFormError('Role name is required');
      return;
    }

    try {
      setSaving(true);
      if (editingRole) {
        await roleService.update(editingRole.role_id, form);
        setSuccess('Role updated successfully');
      } else {
        await roleService.create(form);
        setSuccess('Role created successfully');
      }
      setModalOpen(false);
      fetchRoles();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role) => {
    if (!window.confirm(`Delete role "${role.role_name}"?`)) return;
    try {
      await roleService.remove(role.role_id);
      setSuccess('Role deleted successfully');
      fetchRoles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete role');
    }
  };

  const columns = [
    {
      key: 'role_name',
      label: 'Role Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-accent-100 text-accent-700 flex items-center justify-center shrink-0">
            <ShieldCheck size={15} />
          </span>
          <span className="font-medium text-gray-800">{row.role_name}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => row.description || <span className="text-gray-400">—</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
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
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-display font-bold text-gray-900">Roles Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage organizational roles.</p>
        </div>
        <Button icon={Plus} onClick={openAddModal}>
          Add Role
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {loading ? (
        <Loader label="Loading roles..." />
      ) : (
        <Table columns={columns} data={roles} emptyMessage="No roles found" />
      )}

      <Modal
        title={editingRole ? 'Edit Role' : 'Add Role'}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Role Name"
            name="role_name"
            value={form.role_name}
            onChange={handleChange}
            placeholder="e.g. Team Lead"
            error={formError}
          />
          <Input
            label="Description (optional)"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Roles;
