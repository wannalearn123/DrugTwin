import express from 'express';
import { register, login, getProfile, forgotPassword, resetPassword } from '../controller/authController.js';
import { protect } from '../middleware/authWare.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);

export default router;