const pool = require('../config/db');

const BASE_SELECT = `
  SELECT
    e.id,
    e.employee_id,
    e.employee_name,
    e.role_id,
    r.role_name,
    e.reporting_to,
    m.employee_id AS reporting_to_employee_id,
    m.employee_name AS reporting_to_employee_name,
    e.created_at
  FROM employees e
  JOIN roles r ON e.role_id = r.role_id
  LEFT JOIN employees m ON e.reporting_to = m.id
`;

const EmployeeModel = {
  getAll: async () => {
    const result = await pool.query(`${BASE_SELECT} ORDER BY e.id ASC`);
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query(`${BASE_SELECT} WHERE e.id = $1`, [id]);
    return result.rows[0];
  },

  getByEmployeeId: async (employeeId) => {
    const result = await pool.query(`${BASE_SELECT} WHERE e.employee_id = $1`, [employeeId]);
    return result.rows[0];
  },

  /**
   * Get all employees belonging to a given role name.
   * Used to populate the "Reporting To" dropdown.
   */
  getByRoleName: async (roleName) => {
    const result = await pool.query(
      `SELECT e.id, e.employee_id, e.employee_name
       FROM employees e
       JOIN roles r ON e.role_id = r.role_id
       WHERE r.role_name = $1
       ORDER BY e.employee_id ASC`,
      [roleName]
    );
    return result.rows;
  },

  create: async ({ employee_id, employee_name, role_id, reporting_to }) => {
    const result = await pool.query(
      `INSERT INTO employees (employee_id, employee_name, role_id, reporting_to)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [employee_id, employee_name, role_id, reporting_to || null]
    );
    return EmployeeModel.getById(result.rows[0].id);
  },

  update: async (id, { employee_id, employee_name, role_id, reporting_to }) => {
    const result = await pool.query(
      `UPDATE employees
       SET employee_id = $1, employee_name = $2, role_id = $3, reporting_to = $4
       WHERE id = $5 RETURNING id`,
      [employee_id, employee_name, role_id, reporting_to || null, id]
    );
    if (!result.rows[0]) return null;
    return EmployeeModel.getById(id);
  },

  remove: async (id) => {
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  count: async () => {
    const result = await pool.query('SELECT COUNT(*)::int AS count FROM employees');
    return result.rows[0].count;
  },
};

module.exports = EmployeeModel;
