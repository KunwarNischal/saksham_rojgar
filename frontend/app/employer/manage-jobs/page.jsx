"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jobsAPI } from "@/utils/api";
import { useToast } from "@/components/Toast";

export default function ManageJobsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [employerJobs, setEmployerJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    document.title = "Saksham Rojgar - Manage Jobs";
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobsAPI.getEmployerJobs();
      console.log('Employer jobs:', data);
      const jobs = Array.isArray(data) ? data : [];
      setEmployerJobs(jobs);
      const total = jobs.reduce((sum, job) => sum + (job.applicants || 0), 0);
      setTotalApplicants(total);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      addToast('Failed to load jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    
    try {
      setDeletingJobId(jobToDelete._id);
      await jobsAPI.deleteJob(jobToDelete._id);
      addToast('Job deleted successfully', 'success');
      setShowDeleteModal(false);
      setJobToDelete(null);
      fetchJobs();
    } catch (error) {
      console.error('Delete error:', error);
      addToast(error.message || 'Failed to delete job', 'error');
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleEdit = (jobId) => {
    router.push(`/employer/edit-job/${jobId}`);
  };

  const handleToggleStatus = async (job) => {
    try {
      const newStatus = job.status === 'active' ? 'closed' : 'active';
      await jobsAPI.updateJob(job._id, { status: newStatus });
      addToast(`Job ${newStatus === 'active' ? 'activated' : 'closed'} successfully`, 'success');
      fetchJobs();
    } catch (error) {
      console.error('Status toggle error:', error);
      addToast('Failed to update job status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Jobs</h1>
            <p className="text-gray-600">View and manage all your job postings</p>
          </div>
          <Link 
            href="/employer/post-job"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            + Post New Job
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Posted</p>
              <p className="text-3xl font-bold text-gray-900">{employerJobs.length}</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
              <p className="text-3xl font-bold text-green-600">
                {employerJobs.filter(j => j.status === 'active').length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-purple-600">{totalApplicants}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="grid grid-cols-1 gap-6">
        {employerJobs.length > 0 ? (
          <>
            {employerJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">💼</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              job.jobType === "Full-time" ? "bg-blue-100 text-blue-800" :
                              job.jobType === "Part-time" ? "bg-green-100 text-green-800" :
                              "bg-purple-100 text-purple-800"
                            }`}>
                              {job.jobType}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status === 'active' ? '🟢 Active' : '⚪ Closed'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                      </div>
                      
                      {/* Job Details */}
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                          <span>📍</span>
                          {job.location}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                            <span>💰</span>
                            {job.salary}
                          </span>
                        )}
                        <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                          <span>👥</span>
                          {job.applicants || 0} applicants
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                          <span>📅</span>
                          {new Date(job.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>

                      <p className="text-gray-700 line-clamp-2">{job.description}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/employer/applicants?jobId=${job._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        View Applicants ({job.applicants || 0})
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          job.status === 'active' 
                            ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' 
                            : 'text-green-700 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        {job.status === 'active' ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Close Job
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Activate Job
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(job._id)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(job)}
                        disabled={deletingJobId === job._id}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Jobs Posted Yet</h3>
            <p className="text-gray-600 mb-6">Start by posting your first job</p>
            <Link 
              href="/employer/post-job"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Post Your First Job
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && jobToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Job Posting</h3>
            </div>
            
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete <span className="font-semibold">"{jobToDelete.title}"</span>?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. All applicant data for this job will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setJobToDelete(null);
                }}
                disabled={deletingJobId}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletingJobId}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
              >
                {deletingJobId ? 'Deleting...' : 'Delete Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
