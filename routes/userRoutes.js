import express from 'express';
import { authUser, logoutUser, registerUser, getUserIncome, saveUserIncome } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/auth', authUser);

router.post('/logout', protect, logoutUser);
router.post('/income', protect, saveUserIncome);
router.get('/income', protect, getUserIncome);

export default router;