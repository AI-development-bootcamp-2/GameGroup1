import { Router } from 'express';
import { getAllPosts, createPost, deletePost } from '../controllers/postController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllPosts);
router.post('/', authenticate, createPost);
router.delete('/:id', authenticate, deletePost);

export default router;
