"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { applicationsAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Saksham Rojgar - Dashboard";
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getMyApplications();
      console.log('Dashboard applications:', response);
      setApplications(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get counts
  const appliedJobsCount = applications.length;
  const acceptedCount = applications.filter(a => a.status === 'accepted').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;
  const pendingCount = applications.filter(a => 
    a.status === 'reviewing' || a.status === 'applied' || a.status === 'pending'
  ).length;
  
  // Calculate profile completion
  const profileFields = ['name', 'email', 'phone', 'location', 'resume', 'skills', 'experience', 'education'];
  const completedFields = profileFields.filter(field => {
    const value = user?.[field];
    return value && (Array.isArray(value) ? value.length > 0 : true);
  }).length;
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

  // Get recent applications
  const recentApplications = applications.slice(0, 3);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's an overview of your job search activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{appliedJobsCount}</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Accepted</p>
              <p className="text-3xl font-bold text-gray-900">{acceptedCount}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">{rejectedCount}</p>
            </div>
            <div className="text-4xl">❌</div>
          </div>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {profileCompletion < 100 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-2xl mr-3">⚠️</div>
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                Your profile is {profileCompletion}% complete. 
                <Link href="/jobseeker/profile" className="font-medium underline ml-1">
                  Complete your profile
                </Link> to increase your chances of getting hired!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
            <Link href="/jobseeker/applied" className="text-sm text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{app.jobId?.title || 'Job Title'}</h3>
                      <p className="text-sm text-gray-600 mb-2">{app.jobId?.company || 'Company'}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          (app.status === 'reviewing' || app.status === 'applied' || app.status === 'pending') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {app.status === 'accepted' ? 'Accepted' :
                           app.status === 'rejected' ? 'Rejected' :
                           (app.status === 'reviewing' || app.status === 'applied' || app.status === 'pending') ? 'Applied' :
                           app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <Link 
                      href={`/jobseeker/job-details/${app.jobId?._id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Job →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-600 mb-4">You haven't applied to any jobs yet</p>
              <Link 
                href="/jobseeker/browse" 
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse Jobs
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions & Profile Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                href="/jobseeker/browse"
                className="block w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center font-medium"
              >
                Browse Jobs
              </Link>
              <Link 
                href="/jobseeker/profile"
                className="block w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-center font-medium"
              >
                Edit Profile
              </Link>
              <Link 
                href="/jobseeker/applied"
                className="block w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-center font-medium"
              >
                View Applications
              </Link>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Summary</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900">{user?.location || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-medium text-gray-900">{user?.experience || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
