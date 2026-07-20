import api from './api';

const roleService = {
  getAll: () => api.get('/roles'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (payload) => api.post('/roles', payload),
  update: (id, payload) => api.put(`/roles/${id}`, payload),
  remove: (id) => api.delete(`/roles/${id}`),
};

export default roleService;
