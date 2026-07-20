import api from './api';

const attendanceService = {
  checkIn: (employeeId) => api.post('/attendance/checkin', { employee_id: employeeId }),
  breakStart: (employeeId) => api.post('/attendance/break-start', { employee_id: employeeId }),
  breakEnd: (employeeId) => api.post('/attendance/break-end', { employee_id: employeeId }),
  checkOut: (employeeId) => api.post('/attendance/checkout', { employee_id: employeeId }),

  getToday: () => api.get('/attendance/today'),
  getHistory: () => api.get('/attendance'),
  getEmployeeHistory: (employeeId) => api.get(`/attendance/${employeeId}`),
};

export default attendanceService;
