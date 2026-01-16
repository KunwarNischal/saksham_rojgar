import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

/**
 * Helper function to upload file to Cloudinary
 */
const uploadToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    const readableStream = Readable.from(fileBuffer);
    readableStream.pipe(uploadStream);
  });
};

/**
 * @desc    Apply for a job
 * @route   POST /api/applications/apply
 * @access  Private (Job Seeker only)
 */
const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Validate job ID
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is active
    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      jobId,
      jobSeekerId: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Handle resume upload
    let resumeUrl = req.user.resume; // Use existing resume if no new file

    if (req.file) {
      try {
        const result = await uploadToCloudinary(
          req.file.buffer,
          'job-portal/resumes',
          'raw' // For PDF files
        );
        resumeUrl = result.secure_url;

        // Update user's resume URL
        await User.findByIdAndUpdate(req.user._id, { resume: resumeUrl });
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error uploading resume',
          error: uploadError.message
        });
      }
    }

    // Check if user has a resume
    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume to apply'
      });
    }

    // Create application
    const application = await Application.create({
      jobId,
      jobSeekerId: req.user._id,
      resumeUrl,
      coverLetter: coverLetter || '',
      status: 'pending'
    });

    // Increment applicants count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });

    // Populate application details
    const populatedApplication = await Application.findById(application._id)
      .populate('jobId', 'title company location salary jobType')
      .populate('jobSeekerId', 'name email phone location');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: populatedApplication
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    
    // Handle duplicate application error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error submitting application',
      error: error.message
    });
  }
};

/**
 * @desc    Get job seeker's own applications
 * @route   GET /api/applications/my-applications
 * @access  Private (Job Seeker only)
 */
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ jobSeekerId: req.user._id })
      .populate('jobId', 'title company location salary jobType status')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching applications',
      error: error.message
    });
  }
};

/**
 * @desc    Get applicants for a specific job
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Employer - own jobs only)
 */
const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists and belongs to employer
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if employer owns this job
    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applicants for this job'
      });
    }

    // Get all applications for this job
    const applications = await Application.find({ jobId })
      .populate('jobSeekerId', 'name email phone location skills experience education resume')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      jobTitle: job.title,
      data: applications
    });
  } catch (error) {
    console.error('Get job applicants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching applicants',
      error: error.message
    });
  }
};

/**
 * @desc    Get all applications for employer's jobs
 * @route   GET /api/applications/employer/applications
 * @access  Private (Employer only)
 */
const getEmployerApplications = async (req, res) => {
  try {
    // Find all jobs by this employer
    const employerJobs = await Job.find({ employerId: req.user._id }).select('_id');

    // Get job IDs
    const jobIds = employerJobs.map(job => job._id);

    // Get all applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId', 'title company location salary jobType')
      .populate('jobSeekerId', 'name email phone location')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get employer applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching applications',
      error: error.message
    });
  }
};

/**
 * @desc    Update application status
 * @route   PUT /api/applications/:id/status
 * @access  Private (Employer only)
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    // Validate status
    const validStatuses = ['pending', 'under review', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Find application
    const application = await Application.findById(applicationId).populate('jobId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if employer owns the job
    if (application.jobId.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update status
    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating application status',
      error: error.message
    });
  }
};

/**
 * @desc    Upload or update resume
 * @route   POST /api/applications/upload-resume
 * @access  Private (Job Seeker only)
 */
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file'
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      'job-portal/resumes',
      'raw'
    );

    // Update user's resume URL
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resumeUrl: result.secure_url
      }
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading resume',
      error: error.message
    });
  }
};

/**
 * @desc    Get single application by ID
 * @route   GET /api/applications/:id
 * @access  Private (Employer only)
 */
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId', 'title company location')
      .populate('jobSeekerId', 'name email phone location bio experience education skills resume');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify that the employer owns the job this application is for
    const job = await Job.findById(application.jobId._id);
    if (!job || job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

export {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  getEmployerApplications,
  updateApplicationStatus,
  uploadResume,
  getApplicationById
};
