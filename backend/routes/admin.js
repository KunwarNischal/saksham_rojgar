import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import {
  getAllUsers,
  getUserById,
  deleteUser,
  getAllJobsAdmin,
  getDashboardStats
} from '../controllers/adminController.js';

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin only)
 */
router.get('/stats', protect, authorize('admin'), getDashboardStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get('/users', protect, authorize('admin'), getAllUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin only)
 */
router.get('/users/:id', protect, authorize('admin'), getUserById);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

/**
 * @route   GET /api/admin/jobs
 * @desc    Get all jobs (admin view)
 * @access  Private (Admin only)
 */
router.get('/jobs', protect, authorize('admin'), getAllJobsAdmin);

export default router;
