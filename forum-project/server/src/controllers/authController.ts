import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { RegisterInput } from '../types/auth.types';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input: RegisterInput = req.body;
    const result = await authService.register(input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}
