const EmployeeModel = require('../models/employeeModel');
const RoleModel = require('../models/roleModel');

// GET /api/employees
const getEmployees = async (req, res, next) => {
  try {
    const employees = await EmployeeModel.getAll();
    res.json({ success: true, data: employees });
  } catch (err) {
    next(err);
  }
};

// GET /api/employees/:id
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.getById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/employees/reporting/:role
 *
 * Business logic (kept entirely on the backend):
 * - Super Admin has no one above it -> return []
 * - HR reports to Super Admin
 * - Manager reports to HR
 * - Employee reports to Manager
 * - Intern reports to Employee
 */
const getReportingOptions = async (req, res, next) => {
  try {
    const { role } = req.params;

    const roleExists = await RoleModel.getByName(role);
    if (!roleExists) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    const parentRoleName = RoleModel.getParentRoleName(role);

    if (!parentRoleName) {
      // Top of hierarchy (Super Admin) - reports to no one
      return res.json({ success: true, data: [] });
    }

    const options = await EmployeeModel.getByRoleName(parentRoleName);
    res.json({ success: true, data: options });
  } catch (err) {
    next(err);
  }
};

// POST /api/employees
const createEmployee = async (req, res, next) => {
  try {
    const { employee_id, employee_name, role_id, reporting_to } = req.body;

    if (!employee_id || !employee_id.trim()) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }
    if (!employee_name || !employee_name.trim()) {
      return res.status(400).json({ success: false, message: 'Employee Name is required' });
    }
    if (!role_id) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }

    const role = await RoleModel.getById(role_id);
    if (!role) {
      return res.status(400).json({ success: false, message: 'Invalid role selected' });
    }

    // Server-side enforcement of the reporting hierarchy
    const parentRoleName = RoleModel.getParentRoleName(role.role_name);

    if (parentRoleName && !reporting_to) {
      return res.status(400).json({
        success: false,
        message: `Reporting To is required for role "${role.role_name}"`,
      });
    }

    if (!parentRoleName && reporting_to) {
      return res.status(400).json({
        success: false,
        message: 'Super Admin cannot report to anyone',
      });
    }

    const existing = await EmployeeModel.getByEmployeeId(employee_id.trim());
    if (existing) {
      return res.status(409).json({ success: false, message: 'Employee ID already exists' });
    }

    const employee = await EmployeeModel.create({
      employee_id: employee_id.trim(),
      employee_name: employee_name.trim(),
      role_id,
      reporting_to: reporting_to || null,
    });

    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

// PUT /api/employees/:id
const updateEmployee = async (req, res, next) => {
  try {
    const { employee_id, employee_name, role_id, reporting_to } = req.body;

    if (!employee_id || !employee_id.trim()) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }
    if (!employee_name || !employee_name.trim()) {
      return res.status(400).json({ success: false, message: 'Employee Name is required' });
    }
    if (!role_id) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }

    const role = await RoleModel.getById(role_id);
    if (!role) {
      return res.status(400).json({ success: false, message: 'Invalid role selected' });
    }

    const parentRoleName = RoleModel.getParentRoleName(role.role_name);

    if (parentRoleName && !reporting_to) {
      return res.status(400).json({
        success: false,
        message: `Reporting To is required for role "${role.role_name}"`,
      });
    }

    if (!parentRoleName && reporting_to) {
      return res.status(400).json({
        success: false,
        message: 'Super Admin cannot report to anyone',
      });
    }

    const employee = await EmployeeModel.update(req.params.id, {
      employee_id: employee_id.trim(),
      employee_name: employee_name.trim(),
      role_id,
      reporting_to: reporting_to || null,
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/employees/:id
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.remove(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete employee: other employees report to this person',
      });
    }
    next(err);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  getReportingOptions,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
