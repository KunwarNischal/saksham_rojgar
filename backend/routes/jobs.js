import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getEmployerJobs
} from '../controllers/jobController.js';

/**
 * @route   GET /api/jobs
 * @desc    Get all jobs (with filters)
 * @access  Public
 */
router.get('/', getAllJobs);

/**
 * @route   GET /api/jobs/employer/my-jobs
 * @desc    Get employer's own jobs
 * @access  Private (Employer only)
 */
router.get('/employer/my-jobs', protect, authorize('employer'), getEmployerJobs);

/**
 * @route   GET /api/jobs/:id
 * @desc    Get single job by ID
 * @access  Public
 */
router.get('/:id', getJobById);

/**
 * @route   POST /api/jobs
 * @desc    Create a new job
 * @access  Private (Employer only)
 */
router.post('/', protect, authorize('employer'), createJob);

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update job
 * @access  Private (Employer - own jobs only)
 */
router.put('/:id', protect, authorize('employer'), updateJob);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete job
 * @access  Private (Employer - own jobs, Admin - all jobs)
 */
router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);

export default router;
