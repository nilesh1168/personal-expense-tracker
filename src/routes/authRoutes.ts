import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';

const router = Router();

router.post('/api/auth/signup', registerUser);
router.post('/api/auth/login', loginUser);

export default router;