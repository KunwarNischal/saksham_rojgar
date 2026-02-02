'use client';

import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JobCard from "@/components/JobCard";

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalUsers: 0,
    companies: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [popularJobs, setPopularJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Saksham Rojgar - Find Your Dream Job";
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`);
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchPopularJobs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs?limit=6`);
        const data = await response.json();
        
        if (data.success) {
          setPopularJobs(data.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchPopularJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.append('title', searchTitle);
    if (searchLocation) params.append('location', searchLocation);
    router.push(`/jobs?${params.toString()}`);
  };

  const popularSearches = [
    "Frontend Dev",
    "UX Designer",
    "Product Manager",
    "Data Scientist"
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0f172a] to-[#1e1b4b] opacity-100"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#0a0f1a]/50"></div>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl"></div>
        
        {/* Navigation Header */}
        <nav className="relative z-10 container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 md:space-x-3">
              <Image 
                src="/logo.png" 
                alt="Saksham Rojgar\" 
                width={48} 
                height={48}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain flex-shrink-0"
              />
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                Saksham<span className="text-blue-400">Rojgar</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/jobs" className="text-gray-300 hover:text-white transition-colors">Find Jobs</Link>
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">Companies</Link>
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">Salaries</Link>
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">Resources</Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
              <Link 
                href="/login"
                className="px-3 sm:px-4 md:px-6 py-2 text-sm md:text-base font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/register"
                className="px-3 sm:px-4 md:px-6 py-2 text-sm md:text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pb-4 border-t border-white/10 pt-4">
              <div className="flex flex-col space-y-3">
                <Link href="/jobs" className="text-gray-300 hover:text-white transition-colors py-2">Find Jobs</Link>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors py-2">Companies</Link>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors py-2">Salaries</Link>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors py-2">Resources</Link>
                <div className="flex flex-col space-y-2 pt-3 border-t border-white/10">
                  <Link 
                    href="/login"
                    className="px-4 py-2.5 text-center font-semibold text-gray-300 hover:text-white border border-white/20 rounded-lg transition-colors"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register"
                    className="px-4 py-2.5 text-center font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-8 md:py-0">
          <div className="max-w-4xl mx-auto text-center w-full">
            {/* Stats Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-gray-300">Over {loading ? '...' : `${stats.activeJobs}+`} jobs added today</span>
            </div>

            {/* Hero Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Find your next<br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                career defining
              </span> moment.
            </h2>

            {/* Hero Subtitle */}
            <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2">
              Join the fastest-growing community of developers, designers, and creators. We connect top talent with the world's most innovative companies.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 px-2 sm:px-0">
              <div className="bg-white rounded-xl p-2 sm:p-3 md:p-4 flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-0 shadow-2xl">
                <div className="flex-1 flex items-center px-3 sm:px-4 border-b md:border-b-0 md:border-r border-gray-200">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Job title, keywords..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="flex-1 outline-none text-gray-900 placeholder-gray-500 py-2.5 sm:py-3 md:py-2 text-sm md:text-base min-w-0"
                  />
                </div>
                <div className="flex-1 flex items-center px-3 sm:px-4 border-b md:border-b-0 md:border-r border-gray-200">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="City or remote"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="flex-1 outline-none text-gray-900 placeholder-gray-500 py-2.5 sm:py-3 md:py-2 text-sm md:text-base min-w-0"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg transition-all duration-300 text-sm md:text-base w-full md:w-auto"
                >
                  Search Jobs
                </button>
              </div>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 px-2">
              <span className="text-gray-400 text-xs sm:text-sm w-full sm:w-auto text-center sm:text-left mb-1 sm:mb-0">Popular:</span>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTitle(search);
                    setTimeout(() => {
                      const params = new URLSearchParams();
                      params.append('title', search);
                      router.push(`/jobs?${params.toString()}`);
                    }, 0);
                  }}
                  className="text-gray-300 hover:text-blue-400 text-xs sm:text-sm md:text-base transition-colors cursor-pointer px-2 py-1 sm:px-0 sm:py-0 bg-slate-800/50 sm:bg-transparent rounded-full sm:rounded-none"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {!loading && (
        <div className="border-t border-white/10 bg-[#0f172a]/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
              <div className="p-3 sm:p-4 rounded-lg bg-white/5 sm:bg-transparent">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                  {stats.activeJobs}+
                </p>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base">Active Jobs</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-white/5 sm:bg-transparent">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                  {stats.totalUsers}+
                </p>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base">Job Seekers</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-white/5 sm:bg-transparent">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                  {stats.companies}+
                </p>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base">Top Companies</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-white/5 sm:bg-transparent">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                  {stats.totalApplications}+
                </p>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base">Applications</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popular Jobs Section */}
      <div className="bg-[#0a0f1a] py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Popular Jobs
            </h3>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
              Discover the most sought-after opportunities from top companies
            </p>
          </div>

          {jobsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 md:p-6 animate-pulse">
                  <div className="h-5 sm:h-6 bg-white/10 rounded w-3/4 mb-3 sm:mb-4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2 mb-2 sm:mb-3"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : popularJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {popularJobs.map((job) => (
                <Link key={job._id} href={`/jobs/${job._id}`}>
                  <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-xl p-4 sm:p-5 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 h-full active:scale-[0.98]">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-base sm:text-lg">
                          {job.company?.charAt(0) || 'J'}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs bg-blue-500/20 text-blue-400 px-2 sm:px-3 py-1 rounded-full">
                        {job.jobType || 'Full-time'}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2 line-clamp-1">
                      {job.title}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="text-green-400">
                          {job.salary}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No jobs available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-8 sm:mt-10">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base w-full sm:w-auto mx-4 sm:mx-0"
            >
              View All Jobs
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-[#0f172a] py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              How It Works
            </h3>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 md:gap-8">
            <div className="text-center p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">1</span>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Create Profile</h4>
              <p className="text-gray-400 text-sm sm:text-base">
                Sign up and build your professional profile to showcase your skills and experience
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">2</span>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Find Jobs</h4>
              <p className="text-gray-400 text-sm sm:text-base">
                Browse thousands of opportunities and find the perfect match for your career goals
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
                <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">3</span>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Apply & Get Hired</h4>
              <p className="text-gray-400 text-sm sm:text-base">
                Apply with one click and track your applications until you land your dream job
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
