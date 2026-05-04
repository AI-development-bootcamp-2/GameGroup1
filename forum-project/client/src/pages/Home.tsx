import { useEffect, useState } from 'react';
import { postsApi } from '../services/api';
import { Post } from '../types';

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postsApi
      .getAll()
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <main style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Latest Posts</h1>
      {posts.length === 0 && <p>No posts yet. Be the first!</p>}
      {posts.map((post) => (
        <article
          key={post._id}
          style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem', paddingBottom: '1.5rem' }}
        >
          <h2 style={{ margin: '0 0 0.5rem' }}>{post.title}</h2>
          <p style={{ color: '#374151' }}>{post.body}</p>
          <small style={{ color: '#9ca3af' }}>
            by {post.author.username} &middot; {new Date(post.createdAt).toLocaleDateString()}
          </small>
        </article>
      ))}
    </main>
  );
}
