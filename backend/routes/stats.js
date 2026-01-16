import express from 'express';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

const router = express.Router();

// @route   GET /api/stats
// @desc    Get platform statistics
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Count active jobs
    const activeJobs = await Job.countDocuments({ status: 'active' });

    // Count total users
    const totalUsers = await User.countDocuments();

    // Count unique companies (employers)
    const companies = await User.countDocuments({ role: 'employer' });

    // Count total applications
    const totalApplications = await Application.countDocuments();

    res.json({
      success: true,
      data: {
        activeJobs,
        totalUsers,
        companies,
        totalApplications
      }
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

export default router;
