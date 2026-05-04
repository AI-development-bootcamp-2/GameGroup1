import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';

export async function register(username: string, email: string, password: string) {
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  return { token: signToken({ id: user._id }), user: { id: user._id, username, email } };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  return {
    token: signToken({ id: user._id }),
    user: { id: user._id, username: user.username, email },
  };
}
