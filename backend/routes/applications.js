import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { upload, handleMulterError } from '../middleware/upload.js';
import {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  getEmployerApplications,
  updateApplicationStatus,
  uploadResume,
  getApplicationById
} from '../controllers/applicationController.js';

/**
 * @route   POST /api/applications/apply
 * @desc    Apply for a job (with optional resume upload)
 * @access  Private (Job Seeker only)
 */
router.post(
  '/apply',
  protect,
  authorize('jobseeker'),
  upload.single('resume'),
  handleMulterError,
  applyForJob
);

/**
 * @route   GET /api/applications/my-applications
 * @desc    Get job seeker's own applications
 * @access  Private (Job Seeker only)
 */
router.get('/my-applications', protect, authorize('jobseeker'), getMyApplications);

/**
 * @route   GET /api/applications/employer/applications
 * @desc    Get all applications for employer's jobs
 * @access  Private (Employer only)
 */
router.get('/employer/applications', protect, authorize('employer'), getEmployerApplications);

/**
 * @route   GET /api/applications/job/:jobId
 * @desc    Get applicants for a specific job
 * @access  Private (Employer - own jobs only)
 */
router.get('/job/:jobId', protect, authorize('employer'), getJobApplicants);

/**
 * @route   GET /api/applications/:id
 * @desc    Get single application by ID
 * @access  Private (Employer only)
 */
router.get('/:id', protect, authorize('employer'), getApplicationById);

/**
 * @route   PUT /api/applications/:id/status
 * @desc    Update application status
 * @access  Private (Employer only)
 */
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

/**
 * @route   POST /api/applications/upload-resume
 * @desc    Upload or update resume
 * @access  Private (Job Seeker only)
 */
router.post(
  '/upload-resume',
  protect,
  authorize('jobseeker'),
  upload.single('resume'),
  handleMulterError,
  uploadResume
);

export default router;
