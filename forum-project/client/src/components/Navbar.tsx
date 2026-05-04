import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
      <Link to="/" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Forum</Link>
      <span style={{ flex: 1 }} />
      {user ? (
        <>
          <span style={{ color: '#6b7280' }}>{user.username}</span>
          <button onClick={logout} style={{ cursor: 'pointer' }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
