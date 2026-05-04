import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { RegisterInput, LoginInput, AuthResponse } from '../types/auth.types';

function httpError(message: string, statusCode: number): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  return err;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const email = input.email.toLowerCase();

  if (await User.findOne({ username: input.username })) {
    throw httpError('Username already taken', 409);
  }
  if (await User.findOne({ email })) {
    throw httpError('Email already registered', 409);
  }

  const hashed = await bcrypt.hash(input.password, 10);
  const user = await User.create({ username: input.username, email, password: hashed });

  const token = signToken({ userId: String(user._id), username: user.username, role: user.role });

  return {
    token,
    user: { id: String(user._id), username: user.username, email: user.email, role: user.role },
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const email = input.email.toLowerCase();

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw httpError('Invalid email or password.', 401);

  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) throw httpError('Invalid email or password.', 401);

  const token = signToken({ userId: String(user._id), username: user.username, role: user.role });

  return {
    token,
    user: { id: String(user._id), username: user.username, email: user.email, role: user.role },
  };
}
