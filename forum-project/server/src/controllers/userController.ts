import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { User } from '../models/User';

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error' });
  }
}
