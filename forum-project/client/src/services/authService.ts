import api from './api';
import { User } from '../types';

interface AuthResult {
  token: string | null;
  user: User | null;
  error: string | null;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const res = await api.post('/auth/login', { email, password });
      return { token: res.data.token, user: res.data.user, error: null };
    } catch (err: any) {
      return { token: null, user: null, error: err.response?.data?.message ?? 'Login failed' };
    }
  },

  async register(username: string, email: string, password: string): Promise<AuthResult> {
    try {
      const res = await api.post('/auth/register', { username, email, password });
      return { token: res.data.token, user: res.data.user, error: null };
    } catch (err: any) {
      return { token: null, user: null, error: err.response?.data?.message ?? 'Registration failed' };
    }
  },
};
