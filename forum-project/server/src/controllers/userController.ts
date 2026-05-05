import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { User } from '../models/User';
import { Post } from '../models/Post';

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(id).select('_id username bio avatarUrl createdAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .select('_id title category likeCount commentCount createdAt');

    res.json({ ...user.toObject(), posts });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error' });
  }
}
