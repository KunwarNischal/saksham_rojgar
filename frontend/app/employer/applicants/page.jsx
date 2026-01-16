"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { applicationsAPI } from "@/utils/api";
import Select from "@/components/Select";

export default function ApplicantsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterJob, setFilterJob] = useState("");

  useEffect(() => {
    document.title = "Saksham Rojgar - Applicants";
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationsAPI.getEmployerApplications();
      console.log('Applications data:', data);
      if (data.length > 0) {
        console.log('First application jobSeekerId:', data[0].jobSeekerId);
      }
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === "" || app.status === filterStatus;
    const matchesJob = filterJob === "" || app.jobId?.title === filterJob;
    return matchesStatus && matchesJob;
  });

  // Get unique job titles
  const jobTitles = [...new Set(applications.map(app => app.jobId?.title).filter(Boolean))];

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationsAPI.updateApplicationStatus(appId, newStatus);
      fetchApplications();
    } catch (error) {
      alert('Failed to update status');
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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Applicants</h1>
        <p className="text-gray-600">Review and manage applications for your job postings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-400">
          <p className="text-sm text-gray-600 mb-1">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400">
          <p className="text-sm text-gray-600 mb-1">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">
            {applications.filter(a => a.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-400">
          <p className="text-sm text-gray-600 mb-1">Under Review</p>
          <p className="text-2xl font-bold text-blue-600">
            {applications.filter(a => a.status === 'reviewing').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-400">
          <p className="text-sm text-gray-600 mb-1">Accepted</p>
          <p className="text-2xl font-bold text-green-600">
            {applications.filter(a => a.status === 'accepted').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            placeholder="All Jobs"
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            options={jobTitles}
          />
          <Select
            placeholder="All Statuses"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: "pending", label: "Pending" },
              { value: "under review", label: "Under Review" },
              { value: "accepted", label: "Accepted" },
              { value: "rejected", label: "Rejected" }
            ]}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredApplications.length}</span> applications
        </p>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredApplications.length > 0 ? (
          <>
            {filteredApplications.map((app) => (
              <div key={app._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border-2 border-white/30">
                        👤
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1">{app.jobSeekerId?.name || 'Unknown Applicant'}</h3>
                        <p className="text-blue-100 font-medium mb-2">
                          Applied for: <span className="text-white">{app.jobId?.title || 'Unknown Position'}</span>
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            <span>📧</span>
                            {app.jobSeekerId?.email || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            <span>📅</span>
                            {new Date(app.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                        app.status === 'accepted' ? 'bg-green-500 text-white' :
                        app.status === 'rejected' ? 'bg-red-500 text-white' :
                        app.status === 'reviewing' ? 'bg-yellow-400 text-gray-900' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {app.status === 'accepted' ? '✅ Accepted' :
                         app.status === 'rejected' ? '❌ Rejected' :
                         app.status === 'reviewing' ? '👁️ Under Review' :
                         '⏳ Pending'}
                      </span>
                      <span className="text-xs text-blue-100">
                        Application ID: {app._id.slice(-8)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {app.coverLetter && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">✉️</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Cover Letter</h4>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="text-gray-700 leading-relaxed">{app.coverLetter}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/employer/view-profile/${typeof app.jobSeekerId === 'object' ? app.jobSeekerId._id : app.jobSeekerId}?applicationId=${app._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                      </Link>
                      {app.resume && (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Resume
                        </a>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {app.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(app._id, 'reviewing')}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Review
                        </button>
                      )}
                      {app.status !== 'accepted' && (
                        <button
                          onClick={() => handleStatusChange(app._id, 'accepted')}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Accept
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(app._id, 'rejected')}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600">Try adjusting your filters or wait for candidates to apply</p>
          </div>
        )}
      </div>
    </div>
  );
}
