import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { RegisterInput, LoginInput } from '../types/auth.types';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input: RegisterInput = req.body;
    const result = await authService.register(input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input: LoginInput = req.body;
    const result = await authService.login(input);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
