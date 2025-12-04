import client from './httpClient';

export const patientAPI = {
  getAll: (params) => client.get('/admin/patient', { params }).then(r => r.data),
  getOne: (id) => client.get(`/admin/patient/${id}`).then(r => r.data),
  add: (data) => client.post('/admin/patient', data).then(r => r.data),
  edit: ({ id, ...data }) => client.put(`/admin/patient/${id}`, data).then(r => r.data),
  remove: (id) => client.delete(`/admin/patient/${id}`).then(r => r.data),
};