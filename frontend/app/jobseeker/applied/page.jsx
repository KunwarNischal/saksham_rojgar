"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { applicationsAPI } from "@/utils/api";

export default function AppliedJobsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Saksham Rojgar - Applied Jobs";
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getMyApplications();
      console.log('Applications response:', response);
      setApplications(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-sm md:text-base text-gray-600">Track your job applications and their status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 border-l-4 border-gray-400">
          <p className="text-xs md:text-sm text-gray-600 mb-1">Total Applications</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{applications.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 border-l-4 border-green-400">
          <p className="text-xs md:text-sm text-gray-600 mb-1">Accepted</p>
          <p className="text-xl md:text-2xl font-bold text-green-600">
            {applications.filter(a => a.status === 'accepted').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 border-l-4 border-red-400">
          <p className="text-xs md:text-sm text-gray-600 mb-1">Rejected</p>
          <p className="text-xl md:text-2xl font-bold text-red-600">
            {applications.filter(a => a.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {applications.length > 0 ? (
          <>
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
                <div className="p-4 md:p-6">
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-3">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">💼</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                            {app.jobId?.title || 'Unknown Job'}
                          </h3>
                          <p className="text-sm md:text-base text-gray-600 font-medium">
                            {app.jobId?.company || 'Unknown Company'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Job Details */}
                      <div className="flex flex-wrap gap-3 text-xs md:text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                          <span>📍</span>
                          {app.jobId?.location || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                          <span>💼</span>
                          {app.jobId?.jobType || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                          <span>📅</span>
                          {new Date(app.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold ${
                        app.status === 'accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                        (app.status === 'reviewing' || app.status === 'applied' || app.status === 'pending') ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        {app.status === 'accepted' ? 'Accepted' :
                         app.status === 'rejected' ? 'Rejected' :
                         (app.status === 'reviewing' || app.status === 'applied' || app.status === 'pending') ? 'Applied' :
                         app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {app.coverLetter && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-semibold text-gray-700">Cover Letter</p>
                      </div>
                      <p className="text-xs md:text-sm text-gray-700 line-clamp-3">
                        {app.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Application ID: <span className="font-mono">{app._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <Link
                      href={`/jobseeker/job-details/${app.jobId?._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">Start applying to jobs to see them here</p>
            <Link 
              href="/jobseeker/browse"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
