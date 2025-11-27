import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

client.interceptors.request.use((cfg) => {
  const tok = localStorage.getItem('authToken');
  if (tok) cfg.headers.Authorization = `Bearer ${tok}`;
  return cfg;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default client;