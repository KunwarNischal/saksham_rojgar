"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { jobsAPI } from "@/utils/api";

export default function BrowseJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Saksham Rojgar - Browse Jobs";
  }, []);

  // Fetch jobs from backend
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAllJobs();
      console.log("API Response:", response);
      setJobs(Array.isArray(response) ? response : []);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
      console.error("Fetch jobs error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "" || job.location.includes(locationFilter);
    const matchesType = typeFilter === "" || job.jobType === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  // Get unique locations
  const locations = [...new Set(jobs.map(job => {
    const city = job.location.split(',')[0].trim();
    return city;
  }))];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-base md:text-lg text-gray-600">Find your next opportunity from {jobs.length} available positions</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select
              placeholder="All Locations"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              options={locations}
            />

            <Select
              placeholder="All Job Types"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={["Full-time", "Part-time", "Contract", "Freelance"]}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading jobs...</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm md:text-base text-gray-600">
                Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
              </p>
            </div>

            {/* Job Listings */}
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl md:text-6xl mb-4">🔍</div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-sm md:text-base text-gray-600">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
