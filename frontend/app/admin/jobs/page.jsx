"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminAPI } from "@/utils/api";
import Select from "@/components/Select";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    document.title = "Saksham Rojgar - Jobs";
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllJobs();
      setJobs(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Defensive: always use array for jobs
  const jobsArray = Array.isArray(jobs) ? jobs : [];

  // Filter jobs
  const filteredJobs = jobsArray.filter(job => {
    const matchesSearch = searchTerm === "" || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "" || job.jobType === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteJob = async (jobId) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      try {
        await adminAPI.deleteJob(jobId);
        fetchJobs();
      } catch (error) {
        alert('Failed to delete job');
      }
    }
  };

  // Get employer name for a job
  const getEmployerName = (job) => {
    return job.postedBy?.name || 'Unknown';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Jobs</h1>
        <p className="text-gray-600">Monitor and manage all job postings on the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
            </div>
            <div className="text-4xl">💼</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Full-time</p>
              <p className="text-3xl font-bold text-gray-900">
                {jobs.filter(j => j.type === 'Full-time').length}
              </p>
            </div>
            <div className="text-4xl">🕐</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Part-time</p>
              <p className="text-3xl font-bold text-gray-900">
                {jobs.filter(j => j.type === 'Part-time').length}
              </p>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Applicants</p>
              <p className="text-3xl font-bold text-gray-900">
                {jobsArray.length > 0 ? Math.round(jobsArray.reduce((sum, j) => sum + (j.applicants || 0), 0) / jobsArray.length) : 0}
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Select
            placeholder="All Job Types"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={["Full-time", "Part-time", "Contract"]}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> jobs
        </p>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow-md">
        {filteredJobs.length > 0 ? (
          <div className="divide-y">
            {filteredJobs.map((job) => (
              <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.jobType === "Full-time" ? "bg-blue-100 text-blue-800" :
                        job.jobType === "Part-time" ? "bg-green-100 text-green-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {job.jobType}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 font-medium mb-3">{job.company}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <span className="mr-1">📍</span>
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">💰</span>
                        {job.salary}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">👥</span>
                        {job.applicants || 0} applicants
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">📅</span>
                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">👤</span>
                        By: {getEmployerName(job)}
                      </span>
                    </div>

                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Link
                    href={`/jobs/${job._id}`}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
