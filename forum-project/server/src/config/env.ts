import dotenv from 'dotenv';
dotenv.config();

const jwtSecretRaw = process.env.JWT_SECRET;
if (!jwtSecretRaw) throw new Error('JWT_SECRET environment variable is not set');

export const jwtSecret: string = jwtSecretRaw;
export const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '7d');
