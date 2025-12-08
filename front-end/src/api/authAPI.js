import client from './httpClient';

export const authAPI = {
  login: (creds) => client.post('/auth/login', creds).then(r => r.data),
  register: (data) => client.post('/auth/register', data).then(r => r.data),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }).then(r => r.data),
  resetPassword: (data) => client.post('/auth/reset-password', data).then(r => r.data),
};