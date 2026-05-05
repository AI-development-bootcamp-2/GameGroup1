import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRegisterInput } from '../middleware/validateRegister';
import { validateLoginInput } from '../middleware/validateLogin';

const router = Router();

router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);

export default router;
