import express from 'express';
import { registerUser, loginUser, logoutUser, getMe,getLeaderboard } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { updateUserProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.get('/leaderboard', protect, getLeaderboard);
router.put('/profile', protect, updateUserProfile);
export default router;