import client from './httpClient';

export const authAPI = {
  login: (creds) => client.post('/auth/login', creds).then(r => r.data),
  register: (data) => client.post('/auth/register', data).then(r => r.data),
};