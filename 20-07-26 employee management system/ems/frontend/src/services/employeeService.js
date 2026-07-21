import api from './api';

const employeeService = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (payload) => api.post('/employees', payload),
  update: (id, payload) => api.put(`/employees/${id}`, payload),
  remove: (id) => api.delete(`/employees/${id}`),
  // Dynamic "Reporting To" options based on selected role name
  getReportingOptions: (roleName) =>
    api.get(`/employees/reporting/${encodeURIComponent(roleName)}`),
};

export default employeeService;
