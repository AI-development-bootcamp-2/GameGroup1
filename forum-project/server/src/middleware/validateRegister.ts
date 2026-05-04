import { Request, Response, NextFunction } from 'express';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegisterInput(req: Request, res: Response, next: NextFunction): void {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'username, email, and password are required' });
    return;
  }

  const u = String(username).trim();
  if (u.length < 3 || u.length > 30 || !USERNAME_REGEX.test(u)) {
    res.status(400).json({ message: 'username must be 3–30 characters: letters, numbers, and underscores only' });
    return;
  }

  if (!EMAIL_REGEX.test(String(email))) {
    res.status(400).json({ message: 'invalid email format' });
    return;
  }

  if (String(password).length < 8) {
    res.status(400).json({ message: 'password must be at least 8 characters' });
    return;
  }

  next();
}
