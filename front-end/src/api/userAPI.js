import client from './httpClient';

export const userAPI = {
  getAllUsers: (params) => client.get('/admin/user', { params }).then(r => r.data),
  getUser: (id) => client.get(`/admin/user/${id}`).then(r => r.data),
  createUser: (data) => client.post('/admin/user', data).then(r => r.data),
  updateUser: ({ id, ...data }) => client.put(`/admin/user/${id}`, data).then(r => r.data),
  deleteUser: (id) => client.delete(`/admin/user/${id}`).then(r => r.data),
  toggleStatus: (id) => client.patch(`/admin/user/${id}/toggle-status`).then(r => r.data),
};