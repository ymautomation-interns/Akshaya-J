const AttendanceModel = require('../models/attendanceModel');
const EmployeeModel = require('../models/employeeModel');

const ensureEmployeeExists = async (employeeId) => {
  const employee = await EmployeeModel.getById(employeeId);
  return employee;
};

// GET /api/attendance
const getAllHistory = async (req, res, next) => {
  try {
    const records = await AttendanceModel.getAllHistory();
    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

// GET /api/attendance/today
const getTodayAll = async (req, res, next) => {
  try {
    const records = await AttendanceModel.getTodayAll();
    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

// GET /api/attendance/:employeeId
const getHistoryForEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const employee = await ensureEmployeeExists(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    const records = await AttendanceModel.getHistoryForEmployee(employeeId);
    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

// POST /api/attendance/checkin  { employee_id }
const checkIn = async (req, res, next) => {
  try {
    const { employee_id } = req.body;
    if (!employee_id) {
      return res.status(400).json({ success: false, message: 'employee_id is required' });
    }

    const employee = await ensureEmployeeExists(employee_id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const existing = await AttendanceModel.getTodayForEmployee(employee_id);
    if (existing) {
      if (existing.status === 'checked_out') {
        return res.status(409).json({
          success: false,
          message: 'This employee has already checked out for today',
        });
      }
      return res.status(409).json({
        success: false,
        message: 'This employee has already checked in today',
      });
    }

    const attendance = await AttendanceModel.checkIn(employee_id);
    res.status(201).json({ success: true, data: attendance });
  } catch (err) {
    next(err);
  }
};

// POST /api/attendance/break-start  { employee_id }
const breakStart = async (req, res, next) => {
  try {
    const { employee_id } = req.body;
    if (!employee_id) {
      return res.status(400).json({ success: false, message: 'employee_id is required' });
    }

    const attendance = await AttendanceModel.getTodayForEmployee(employee_id);

    if (!attendance) {
      return res.status(409).json({
        success: false,
        message: 'Employee must check in before starting a break',
      });
    }
    if (attendance.status === 'on_break') {
      return res.status(409).json({ success: false, message: 'Break is already in progress' });
    }
    if (attendance.status === 'checked_out') {
      return res.status(409).json({
        success: false,
        message: 'Cannot start a break after checking out',
      });
    }

    await AttendanceModel.startBreak(attendance.attendance_id);
    const updated = await AttendanceModel.getTodayForEmployee(employee_id);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// POST /api/attendance/break-end  { employee_id }
const breakEnd = async (req, res, next) => {
  try {
    const { employee_id } = req.body;
    if (!employee_id) {
      return res.status(400).json({ success: false, message: 'employee_id is required' });
    }

    const attendance = await AttendanceModel.getTodayForEmployee(employee_id);

    if (!attendance) {
      return res.status(409).json({ success: false, message: 'Employee has not checked in today' });
    }
    if (attendance.status !== 'on_break') {
      return res.status(409).json({
        success: false,
        message: 'Break End can only be used while a break is in progress',
      });
    }

    const openBreak = attendance.breaks.find((b) => !b.break_end);
    if (!openBreak) {
      return res.status(409).json({ success: false, message: 'No active break found' });
    }

    await AttendanceModel.endBreak(attendance.attendance_id, openBreak.break_id);
    const updated = await AttendanceModel.getTodayForEmployee(employee_id);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// POST /api/attendance/checkout  { employee_id }
const checkOut = async (req, res, next) => {
  try {
    const { employee_id } = req.body;
    if (!employee_id) {
      return res.status(400).json({ success: false, message: 'employee_id is required' });
    }

    const attendance = await AttendanceModel.getTodayForEmployee(employee_id);

    if (!attendance) {
      return res.status(409).json({
        success: false,
        message: 'Employee must check in before checking out',
      });
    }
    if (attendance.status === 'on_break') {
      return res.status(409).json({
        success: false,
        message: 'End the current break before checking out',
      });
    }
    if (attendance.status === 'checked_out') {
      return res.status(409).json({
        success: false,
        message: 'Employee has already checked out for today',
      });
    }

    await AttendanceModel.checkOut(attendance.attendance_id);
    const updated = await AttendanceModel.getTodayForEmployee(employee_id);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllHistory,
  getTodayAll,
  getHistoryForEmployee,
  checkIn,
  breakStart,
  breakEnd,
  checkOut,
};
