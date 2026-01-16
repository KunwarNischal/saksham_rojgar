"use client";

import { useState, useEffect } from "react";
import { adminAPI, jobsAPI } from "@/utils/api";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Saksham Rojgar - Analytics";
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [statsData, jobsData] = await Promise.all([
        adminAPI.getDashboardStats(),
        jobsAPI.getAllJobs()
      ]);
      setStats(statsData);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) return <div className="p-8"><p className="text-red-600">Failed to load analytics</p></div>;

  // Calculate metrics
  const avgApplicationsPerJob = stats.totalJobs > 0 ? (stats.totalApplications / stats.totalJobs).toFixed(1) : 0;
  const avgJobsPerEmployer = stats.employers > 0 ? (stats.totalJobs / stats.employers).toFixed(1) : 0;
  const jobSeekerToEmployerRatio = stats.employers > 0 ? (stats.jobSeekers / stats.employers).toFixed(1) : 0;
  
  // Defensive: always use array for jobs
  const jobsArray = Array.isArray(jobs) ? jobs : [];

  // Job type breakdown
  const fullTimeJobs = jobsArray.filter(j => j.jobType === 'Full-time').length;
  const partTimeJobs = jobsArray.filter(j => j.jobType === 'Part-time').length;
  const contractJobs = jobsArray.filter(j => j.jobType === 'Contract').length;

  // Top companies by jobs posted
  const companiesJobCount = jobsArray.reduce((acc, job) => {
    acc[job.company] = (acc[job.company] || 0) + 1;
    return acc;
  }, {});
  const topCompanies = Object.entries(companiesJobCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Most popular jobs by applicants
  const topJobs = [...jobsArray].sort((a, b) => (b.applicants || 0) - (a.applicants || 0)).slice(0, 5);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Platform statistics and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <p className="text-sm text-gray-600 mb-1">Avg Applications/Job</p>
          <p className="text-3xl font-bold text-gray-900">{avgApplicationsPerJob}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <p className="text-sm text-gray-600 mb-1">Avg Jobs/Employer</p>
          <p className="text-3xl font-bold text-gray-900">{avgJobsPerEmployer}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <p className="text-sm text-gray-600 mb-1">Seeker:Employer Ratio</p>
          <p className="text-3xl font-bold text-gray-900">{jobSeekerToEmployerRatio}:1</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
          <p className="text-sm text-gray-600 mb-1">Total Interactions</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Application Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.pendingApplications || 0} ({stats.totalApplications > 0 ? ((stats.pendingApplications/stats.totalApplications)*100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gray-600 h-3 rounded-full" 
                  style={{ width: `${stats.totalApplications > 0 ? (stats.pendingApplications/stats.totalApplications)*100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Under Review</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.reviewingApplications || 0} ({stats.totalApplications > 0 ? ((stats.reviewingApplications/stats.totalApplications)*100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-yellow-600 h-3 rounded-full" 
                  style={{ width: `${stats.totalApplications > 0 ? (stats.reviewingApplications/stats.totalApplications)*100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Accepted</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.acceptedApplications || 0} ({stats.totalApplications > 0 ? ((stats.acceptedApplications/stats.totalApplications)*100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full" 
                  style={{ width: `${stats.totalApplications > 0 ? (stats.acceptedApplications/stats.totalApplications)*100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Rejected</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.rejectedApplications || 0} ({stats.totalApplications > 0 ? ((stats.rejectedApplications/stats.totalApplications)*100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-red-600 h-3 rounded-full" 
                  style={{ width: `${stats.totalApplications > 0 ? (stats.rejectedApplications/stats.totalApplications)*100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Type Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Type Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Full-time</span>
                <span className="text-sm font-semibold text-gray-900">
                  {fullTimeJobs} ({jobs.length > 0 ? ((fullTimeJobs/jobs.length)*100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full" 
                  style={{ width: `${jobs.length > 0 ? (fullTimeJobs/jobs.length)*100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Part-time</span>
                <span className="text-sm font-semibold text-gray-900">
                  {partTimeJobs} ({jobs.length > 0 ? ((partTimeJobs/jobs.length)*100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full" 
                  style={{ width: `${jobs.length > 0 ? (partTimeJobs/jobs.length)*100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Contract</span>
                <span className="text-sm font-semibold text-gray-900">
                  {contractJobs} ({jobs.length > 0 ? ((contractJobs/jobs.length)*100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full" 
                  style={{ width: `${jobsArray.length > 0 ? (contractJobs/jobsArray.length)*100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* User Distribution Pie */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Job Seekers</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.jobSeekers} ({stats.totalUsers > 0 ? ((stats.jobSeekers/stats.totalUsers)*100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Employers</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.employers} ({stats.totalUsers > 0 ? ((stats.employers/stats.totalUsers)*100).toFixed(0) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Companies */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Companies by Jobs Posted</h2>
          <div className="space-y-4">
            {topCompanies.map(([company, count], index) => (
              <div key={company} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{company}</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{count} jobs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Popular Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Most Popular Jobs</h2>
          <div className="space-y-4">
            {topJobs.map((job, index) => (
              <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center flex-1">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-xs text-gray-600">{job.company}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-green-600">{job.applicants || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
