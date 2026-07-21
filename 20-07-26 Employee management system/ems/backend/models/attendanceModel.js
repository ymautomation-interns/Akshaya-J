const pool = require('../config/db');

/**
 * Fetch today's attendance row (if any) for an employee, including its breaks.
 * Returns null if the employee hasn't checked in today.
 */
const getTodayForEmployee = async (employeeId) => {
  const attRes = await pool.query(
    `SELECT * FROM attendance
     WHERE employee_id = $1 AND attendance_date = CURRENT_DATE`,
    [employeeId]
  );
  const attendance = attRes.rows[0];
  if (!attendance) return null;

  const breaksRes = await pool.query(
    `SELECT * FROM attendance_breaks WHERE attendance_id = $1 ORDER BY break_id ASC`,
    [attendance.attendance_id]
  );

  return { ...attendance, breaks: breaksRes.rows };
};

/**
 * Today's attendance for ALL employees (used to render employee cards / status).
 */
const getTodayAll = async () => {
  const attRes = await pool.query(
    `SELECT a.*, e.employee_id AS emp_code, e.employee_name, r.role_name
     FROM attendance a
     JOIN employees e ON a.employee_id = e.id
     JOIN roles r ON e.role_id = r.role_id
     WHERE a.attendance_date = CURRENT_DATE
     ORDER BY a.attendance_id ASC`
  );

  const attendanceIds = attRes.rows.map((r) => r.attendance_id);
  let breaksByAttendance = {};

  if (attendanceIds.length > 0) {
    const breaksRes = await pool.query(
      `SELECT * FROM attendance_breaks WHERE attendance_id = ANY($1::int[]) ORDER BY break_id ASC`,
      [attendanceIds]
    );
    breaksByAttendance = breaksRes.rows.reduce((acc, b) => {
      acc[b.attendance_id] = acc[b.attendance_id] || [];
      acc[b.attendance_id].push(b);
      return acc;
    }, {});
  }

  return attRes.rows.map((row) => ({
    ...row,
    breaks: breaksByAttendance[row.attendance_id] || [],
  }));
};

/**
 * Full attendance history (all employees, all dates) for the history table.
 */
const getAllHistory = async () => {
  const result = await pool.query(
    `SELECT a.*, e.employee_id AS emp_code, e.employee_name, r.role_name
     FROM attendance a
     JOIN employees e ON a.employee_id = e.id
     JOIN roles r ON e.role_id = r.role_id
     ORDER BY a.attendance_date DESC, a.attendance_id DESC`
  );
  return result.rows;
};

/**
 * Full attendance history for one specific employee.
 */
const getHistoryForEmployee = async (employeeId) => {
  const result = await pool.query(
    `SELECT a.*, e.employee_id AS emp_code, e.employee_name, r.role_name
     FROM attendance a
     JOIN employees e ON a.employee_id = e.id
     JOIN roles r ON e.role_id = r.role_id
     WHERE a.employee_id = $1
     ORDER BY a.attendance_date DESC, a.attendance_id DESC`,
    [employeeId]
  );
  return result.rows;
};

const checkIn = async (employeeId) => {
  await pool.query(
    `INSERT INTO attendance (employee_id, attendance_date, check_in, status)
     VALUES ($1, CURRENT_DATE, NOW(), 'checked_in')`,
    [employeeId]
  );
  return getTodayForEmployee(employeeId);
};

const startBreak = async (attendanceId) => {
  await pool.query(
    `INSERT INTO attendance_breaks (attendance_id, break_start) VALUES ($1, NOW())`,
    [attendanceId]
  );
  await pool.query(
    `UPDATE attendance SET status = 'on_break' WHERE attendance_id = $1`,
    [attendanceId]
  );
};

const endBreak = async (attendanceId, breakId) => {
  const breakRes = await pool.query(
    `UPDATE attendance_breaks
     SET break_end = NOW()
     WHERE break_id = $1
     RETURNING break_start, break_end`,
    [breakId]
  );
  const { break_start, break_end } = breakRes.rows[0];
  const durationSeconds = Math.round((new Date(break_end) - new Date(break_start)) / 1000);

  await pool.query(
    `UPDATE attendance
     SET status = 'checked_in',
         total_break_seconds = total_break_seconds + $2
     WHERE attendance_id = $1`,
    [attendanceId, durationSeconds]
  );
};

const checkOut = async (attendanceId) => {
  const attRes = await pool.query(
    `SELECT check_in, total_break_seconds FROM attendance WHERE attendance_id = $1`,
    [attendanceId]
  );
  const { check_in, total_break_seconds } = attRes.rows[0];
  const now = new Date();
  const totalElapsed = Math.round((now - new Date(check_in)) / 1000);
  const workingSeconds = Math.max(totalElapsed - total_break_seconds, 0);

  await pool.query(
    `UPDATE attendance
     SET check_out = NOW(),
         total_working_seconds = $2,
         status = 'checked_out'
     WHERE attendance_id = $1`,
    [attendanceId, workingSeconds]
  );
};

module.exports = {
  getTodayForEmployee,
  getTodayAll,
  getAllHistory,
  getHistoryForEmployee,
  checkIn,
  startBreak,
  endBreak,
  checkOut,
};
