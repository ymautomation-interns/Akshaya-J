const pool = require('../config/db');

/**
 * Business hierarchy — order matters (1 = highest authority).
 * Used to determine which role an employee reports to.
 */
const HIERARCHY = ['Super Admin', 'HR', 'Manager', 'Employee', 'Intern'];

const RoleModel = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM roles ORDER BY role_id ASC');
    return result.rows;
  },

  getById: async (roleId) => {
    const result = await pool.query('SELECT * FROM roles WHERE role_id = $1', [roleId]);
    return result.rows[0];
  },

  getByName: async (roleName) => {
    const result = await pool.query('SELECT * FROM roles WHERE role_name = $1', [roleName]);
    return result.rows[0];
  },

  create: async ({ role_name, description }) => {
    const result = await pool.query(
      'INSERT INTO roles (role_name, description) VALUES ($1, $2) RETURNING *',
      [role_name, description || null]
    );
    return result.rows[0];
  },

  update: async (roleId, { role_name, description }) => {
    const result = await pool.query(
      'UPDATE roles SET role_name = $1, description = $2 WHERE role_id = $3 RETURNING *',
      [role_name, description || null, roleId]
    );
    return result.rows[0];
  },

  remove: async (roleId) => {
    const result = await pool.query('DELETE FROM roles WHERE role_id = $1 RETURNING *', [roleId]);
    return result.rows[0];
  },

  /**
   * Given a role name, return the role name immediately above it
   * in the hierarchy. Returns null if the role is the top (Super Admin)
   * or not found in the hierarchy.
   */
  getParentRoleName: (roleName) => {
    const index = HIERARCHY.indexOf(roleName);
    if (index <= 0) return null; // top of hierarchy or not found
    return HIERARCHY[index - 1];
  },

  HIERARCHY,
};

module.exports = RoleModel;
