import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtSecret, jwtExpiresIn } from '../config/env';

export function signToken(payload: object) {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn as SignOptions['expiresIn'] });
}

export function verifyToken(token: string) {
  return jwt.verify(token, jwtSecret);
}
