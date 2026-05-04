import { Router } from 'express';
import { register, loginHandler } from '../controllers/authController';
import { validateRegisterInput } from '../middleware/validateRegister';

const router = Router();

router.post('/register', validateRegisterInput, register);
router.post('/login', loginHandler);

export default router;
