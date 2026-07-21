const RoleModel = require('../models/roleModel');

// GET /api/roles
const getRoles = async (req, res, next) => {
  try {
    const roles = await RoleModel.getAll();
    res.json({ success: true, data: roles });
  } catch (err) {
    next(err);
  }
};

// GET /api/roles/:id
const getRoleById = async (req, res, next) => {
  try {
    const role = await RoleModel.getById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
};

// POST /api/roles
const createRole = async (req, res, next) => {
  try {
    const { role_name, description } = req.body;

    if (!role_name || !role_name.trim()) {
      return res.status(400).json({ success: false, message: 'Role name is required' });
    }

    const existing = await RoleModel.getByName(role_name.trim());
    if (existing) {
      return res.status(409).json({ success: false, message: 'Role already exists' });
    }

    const role = await RoleModel.create({ role_name: role_name.trim(), description });
    res.status(201).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
};

// PUT /api/roles/:id
const updateRole = async (req, res, next) => {
  try {
    const { role_name, description } = req.body;

    if (!role_name || !role_name.trim()) {
      return res.status(400).json({ success: false, message: 'Role name is required' });
    }

    const role = await RoleModel.update(req.params.id, {
      role_name: role_name.trim(),
      description,
    });

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    res.json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/roles/:id
const deleteRole = async (req, res, next) => {
  try {
    const role = await RoleModel.remove(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.json({ success: true, message: 'Role deleted successfully' });
  } catch (err) {
    // Foreign key violation -> role still assigned to employees
    if (err.code === '23503') {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete role: it is still assigned to one or more employees',
      });
    }
    next(err);
  }
};

module.exports = { getRoles, getRoleById, createRole, updateRole, deleteRole };
