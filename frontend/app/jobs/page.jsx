"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { jobsAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

export default function JobsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Saksham Rojgar - Jobs";
  }, []);

  // Check if user is authenticated to determine navbar role
  const userRole = user ? user.role : 'guest';
  const showNavbar = true;

  // Fetch jobs from backend
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAllJobs();
      setJobs(response || []);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
      console.error(err);
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
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar userRole={user?.role || "guest"} />}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-lg text-gray-600">Browse through {jobs.length} available positions</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
              placeholder="Job Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={["Full-time", "Part-time", "Contract"]}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> jobs
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : (
          <>
            {/* Job Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* No Results */}
            {filteredJobs.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
