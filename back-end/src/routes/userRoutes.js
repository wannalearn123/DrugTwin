import express from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats,
} from '../controller/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes - admin only
router.use(protect);
router.use(restrictTo('admin'));

// User management routes
router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.get('/stats', getUserStats);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.patch('/:id/toggle-status', toggleUserStatus);

export default router;