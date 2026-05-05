import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { connectDB } from '../src/config/db';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Auth routes', () => {
  const uid = Date.now();
  const testUser = {
    username: `testuser_${uid}`,
    email: `test_${uid}@example.com`,
    password: 'password123',
  };

  it('POST /api/auth/register returns 201 with token', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', testUser.username);
  });

  it('POST /api/auth/login returns token for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/auth/login returns 200 for bad credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });
    expect(res.status).toBe(200);
  });
});
