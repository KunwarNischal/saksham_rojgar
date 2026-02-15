'use client';

import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
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

  const isLoggedIn = !!user;

  useEffect(() => {
    document.title = "Saksham Rojgar - Find Your Dream Job";
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/stats`);
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/jobs?limit=6`);
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

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'employer') return '/employer/dashboard';
    return '/jobseeker/dashboard';
  };

  const categories = [
    { name: 'Technology', icon: '💻', count: 234, color: 'bg-blue-50 text-blue-600' },
    { name: 'Healthcare', icon: '🏥', count: 156, color: 'bg-green-50 text-green-600' },
    { name: 'Finance', icon: '💰', count: 189, color: 'bg-amber-50 text-amber-600' },
    { name: 'Education', icon: '📚', count: 98, color: 'bg-purple-50 text-purple-600' },
    { name: 'Marketing', icon: '📈', count: 145, color: 'bg-pink-50 text-pink-600' },
    { name: 'Design', icon: '🎨', count: 112, color: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/logo.png" 
                alt="Saksham Rojgar" 
                width={40} 
                height={40}
                className="w-9 h-9 md:w-10 md:h-10 object-contain"
              />
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Saksham Rojgar
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Find Jobs</Link>
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Companies</Link>
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Resources</Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              {isLoggedIn ? (
                <Link 
                  href={getDashboardLink()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="px-5 py-2.5 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/20"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
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
            <div className="lg:hidden pb-4 border-t border-gray-100 pt-4">
              <div className="flex flex-col space-y-3">
                <Link href="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors py-2 font-medium">Find Jobs</Link>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors py-2 font-medium">Companies</Link>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors py-2 font-medium">Resources</Link>
                <div className="flex flex-col space-y-2 pt-3 border-t border-gray-100">
                  {isLoggedIn ? (
                    <Link 
                      href={getDashboardLink()}
                      className="px-4 py-2.5 text-center font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link 
                        href="/login"
                        className="px-4 py-2.5 text-center font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Log In
                      </Link>
                      <Link 
                        href="/register"
                        className="px-4 py-2.5 text-center font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-40"></div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-emerald-700 font-medium">{loading ? '...' : `${stats.activeJobs}+`} jobs available now</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Discover Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Perfect Career</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Connect with top companies and find opportunities that match your skills, experience, and career goals.
              </p>

              {/* Search Box */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center bg-white rounded-xl px-4 border border-gray-100">
                    <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Job title or keyword"
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                      className="flex-1 outline-none text-gray-900 placeholder-gray-400 py-3.5 text-sm bg-transparent"
                    />
                  </div>
                  <div className="flex-1 flex items-center bg-white rounded-xl px-4 border border-gray-100">
                    <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Location"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="flex-1 outline-none text-gray-900 placeholder-gray-400 py-3.5 text-sm bg-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                </div>
              </form>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verified companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Daily updates</span>
                </div>
              </div>
            </div>

            {/* Right Content - How It Works */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Decorative blurs */}
                <div className="absolute -top-10 -right-10 w-56 h-56 bg-blue-100/50 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-emerald-100/50 rounded-full blur-3xl"></div>

                <div className="relative space-y-5">
                  {/* Step 1 */}
                  <div className="group flex items-start gap-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Step 1</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">Search & Explore</h3>
                      <p className="text-sm text-gray-500 mt-1">Browse thousands of jobs by title, location, or company that match your skills.</p>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex justify-start pl-12">
                    <div className="w-px h-4 bg-gradient-to-b from-blue-300 to-emerald-300"></div>
                  </div>

                  {/* Step 2 */}
                  <div className="group flex items-start gap-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ml-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Step 2</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">Apply with Ease</h3>
                      <p className="text-sm text-gray-500 mt-1">Submit your resume and cover letter in just a few clicks. Track your applications.</p>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex justify-start pl-[72px]">
                    <div className="w-px h-4 bg-gradient-to-b from-emerald-300 to-violet-300"></div>
                  </div>

                  {/* Step 3 */}
                  <div className="group flex items-start gap-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ml-12">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/25">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">Step 3</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">Get Hired</h3>
                      <p className="text-sm text-gray-500 mt-1">Hear back from employers, attend interviews, and land your dream job!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile - How It Works */}
          <div className="mt-12 lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 text-center">How It Works</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Search</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Find jobs</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Apply</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Send resume</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-violet-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Get Hired</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Land the job</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="py-20 lg:py-28 bg-white relative">
        {/* Subtle Background */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-blue-600 font-medium text-sm mb-2 block">Latest Openings</span>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Featured Jobs</h2>
            </div>
            <Link 
              href="/jobs"
              className="hidden sm:inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium group"
            >
              View all positions
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {jobsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-6 animate-pulse border border-gray-100">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : popularJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {popularJobs.map((job) => (
                <Link key={job._id} href={`/jobs/${job._id}`}>
                  <div className="group bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl h-full">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 font-bold text-lg group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                        {job.company?.charAt(0) || 'J'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-emerald-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        {job.jobType || 'Full-time'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      {job.salary ? (
                        <p className="text-sm font-semibold text-emerald-600">{job.salary}</p>
                      ) : (
                        <p className="text-sm text-gray-400">Salary not disclosed</p>
                      )}
                      <span className="text-xs text-gray-400">Apply now →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No jobs available</h3>
              <p className="text-gray-500 text-sm">Check back soon for new opportunities</p>
            </div>
          )}

          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-xl transition-colors"
            >
              View All Jobs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 lg:py-28 bg-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-300">Join {loading ? '...' : `${stats.totalUsers}+`} professionals</span>
            </span>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Take the Next Step in Your Career?
            </h2>
            <p className="text-gray-400 mb-10 text-lg">
              Join thousands of professionals who have found their dream jobs through our platform. Your next opportunity is waiting.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isLoggedIn ? (
                <Link 
                  href={getDashboardLink()}
                  className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg w-full sm:w-auto"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    href="/register"
                    className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
                  >
                    Get Started — It's Free
                  </Link>
                  <Link 
                    href="/jobs"
                    className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-colors w-full sm:w-auto"
                  >
                    Browse Jobs First
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
