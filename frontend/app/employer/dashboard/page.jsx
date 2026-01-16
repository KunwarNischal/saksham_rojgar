"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { jobsAPI, applicationsAPI } from "@/utils/api";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [employerJobs, setEmployerJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    interviewing: 0,
    hired: 0
  });

  useEffect(() => {
    document.title = "Saksham Rojgar - Dashboard";
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [jobsData, applicationsData] = await Promise.all([
        jobsAPI.getEmployerJobs(),
        applicationsAPI.getEmployerApplications()
      ]);
      
      setEmployerJobs(jobsData);
      setRecentApplications(applicationsData.slice(0, 5));
      
      setStats({
        activeJobs: jobsData.length,
        totalApplicants: applicationsData.length,
        interviewing: applicationsData.filter(app => app.status === 'reviewing' || app.status === 'under review').length,
        hired: applicationsData.filter(app => app.status === 'accepted').length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600">Manage your job postings and view applicants</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeJobs}</p>
            </div>
            <div className="text-4xl">💼</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Applicants</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalApplicants}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Interviewing</p>
              <p className="text-3xl font-bold text-gray-900">{stats.interviewing}</p>
            </div>
            <div className="text-4xl">👁️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Hired</p>
              <p className="text-3xl font-bold text-gray-900">{stats.hired}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to hire?</h3>
            <p className="text-gray-600">Post a new job and reach thousands of qualified candidates</p>
          </div>
          <Link 
            href="/employer/post-job"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Post New Job
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
            <Link href="/employer/applicants" className="text-sm text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{app.jobSeekerId?.name || 'Unknown'}</h3>
                      <p className="text-sm text-gray-600 mb-2">Applied for: {app.jobId?.title || 'Unknown'}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📧 {app.jobSeekerId?.email || 'N/A'}</span>
                        <span>📅 {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      app.status === 'under review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-600">No applications yet</p>
            </div>
          )}
        </div>

        {/* Posted Jobs Summary */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Info</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-medium text-gray-900">{user?.company || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900">{user?.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="font-medium text-green-600">✓ Verified Employer</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                href="/employer/post-job"
                className="block w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center font-medium"
              >
                Post New Job
              </Link>
              <Link 
                href="/employer/manage-jobs"
                className="block w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-center font-medium"
              >
                Manage Jobs
              </Link>
              <Link 
                href="/employer/applicants"
                className="block w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-center font-medium"
              >
                View Applicants
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
