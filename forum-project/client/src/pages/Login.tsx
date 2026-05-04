import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { AuthResponse } from '../types';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      const res = await authApi.login({
        email: form.get('email') as string,
        password: form.get('password') as string,
      });
      const data: AuthResponse = res.data;
      login(data.token, data.user);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>Login</h1>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
}
