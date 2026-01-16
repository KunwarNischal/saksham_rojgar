import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  jobSeekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeUrl: {
    type: String,
    required: [true, 'Resume is required']
  },
  coverLetter: {
    type: String,
    maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'under review', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate applications (one user can apply once per job)
applicationSchema.index({ jobId: 1, jobSeekerId: 1 }, { unique: true });

// Index for faster queries
applicationSchema.index({ jobSeekerId: 1 });
applicationSchema.index({ jobId: 1 });
applicationSchema.index({ status: 1 });

export default mongoose.model('Application', applicationSchema);
