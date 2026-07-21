const express = require('express');
const router = express.Router();
const {
  getAllHistory,
  getTodayAll,
  getHistoryForEmployee,
  checkIn,
  breakStart,
  breakEnd,
  checkOut,
} = require('../controllers/attendanceController');

// Action endpoints
router.post('/checkin', checkIn);
router.post('/break-start', breakStart);
router.post('/break-end', breakEnd);
router.post('/checkout', checkOut);

// NOTE: /today must be declared BEFORE /:employeeId
// otherwise Express will treat "today" as an :employeeId param.
router.get('/today', getTodayAll);

router.get('/', getAllHistory);
router.get('/:employeeId', getHistoryForEmployee);

module.exports = router;
