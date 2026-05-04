import { Response } from 'express';
import { Post } from '../models/Post';
import { AuthRequest } from '../middleware/authMiddleware';

export async function getAllPosts(_req: AuthRequest, res: Response) {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function createPost(req: AuthRequest, res: Response) {
  try {
    const post = await Post.create({ ...req.body, author: req.userId });
    res.status(201).json(post);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function deletePost(req: AuthRequest, res: Response) {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.userId });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
