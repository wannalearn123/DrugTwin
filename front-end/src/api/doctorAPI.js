import client from './httpClient';

export const doctorAPI = {
  // Doctor's own routes
  getMyPatients: (params) => client.get('/doctor/my-patients', { params }).then(r => r.data),
  getPatientDetails: (id) => client.get(`/doctor/patients/${id}`).then(r => r.data),
  createCheckup: (data) => client.post('/doctor/checkup', data).then(r => r.data),
  getCheckupHistory: (patientId, params) => client.get(`/doctor/checkups/${patientId}`, { params }).then(r => r.data),
  
  // Admin managing doctors
  getAllDoctors: (params) => client.get('/admin/doctor', { params }).then(r => r.data),
  getDoctor: (id) => client.get(`/admin/doctor/${id}`).then(r => r.data),
  createDoctor: (data) => client.post('/admin/doctor', data).then(r => r.data),
  updateDoctor: ({ id, ...data }) => client.put(`/admin/doctor/${id}`, data).then(r => r.data),
  deleteDoctor: (id) => client.delete(`/admin/doctor/${id}`).then(r => r.data),
  assignDoctor: (data) => client.post('/admin/assign-doctor', data).then(r => r.data),
  getAvailableDoctors: () => client.get('/admin/available-doctors').then(r => r.data),
};