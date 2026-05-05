import { useAuth } from '../hooks/useAuth';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <main style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Profile</h1>
      {user && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </main>
  );
}
