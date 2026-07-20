const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  getReportingOptions,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

// NOTE: /reporting/:role must be declared BEFORE /:id
// otherwise Express will treat "reporting" as an :id param.
router.get('/reporting/:role', getReportingOptions);

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
