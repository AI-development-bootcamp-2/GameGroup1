import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('forum_auth');
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore malformed stored data
    }
  }
  return config;
});

export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const postsApi = {
  getAll: () => api.get('/posts'),
  create: (data: { title: string; body: string }) => api.post('/posts', data),
  delete: (id: string) => api.delete(`/posts/${id}`),
};

export default api;
