import dotenv from 'dotenv';
dotenv.config();

const jwtSecretRaw = process.env.JWT_SECRET;

export const jwtSecret: string = jwtSecretRaw || 'secret';
export const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '7d');
