'use client';

import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function Home() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalUsers: 0,
    companies: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <nav className="flex items-center justify-between mb-8 md:mb-16">
          <Link href="/" className="flex items-center space-x-2 md:space-x-3">
            <Image 
              src="/logo.png" 
              alt="Saksham Rojgar" 
              width={40} 
              height={40}
              className="object-contain w-8 h-8 md:w-12 md:h-12"
            />
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-[#45A28E] via-[#5D99C6] to-[#E67E22] bg-clip-text text-transparent">Saksham Rojgar</h1>
          </Link>
          <div className="flex space-x-2 md:space-x-4">
            <Link 
              href="/login"
              className="px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base font-semibold text-gray-700 hover:text-blue-600 border-2 border-gray-300 hover:border-blue-600 rounded-lg transition-all duration-300 hover:shadow-md"
            >
              Login
            </Link>
            <Link 
              href="/register"
              className="px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Register
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Find Your Dream Job Today
          </h2>
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8">
            Connect with top employers and discover thousands of job opportunities
          </p>
          <Link 
            href="/jobs"
            className="inline-block px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white text-base md:text-lg rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">For Job Seekers</h3>
            <p className="text-gray-600 mb-6">
              Browse thousands of jobs, apply with ease, and track your applications
            </p>
            <Link 
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Get Started →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">For Employers</h3>
            <p className="text-gray-600 mb-6">
              Post jobs, manage applications, and find the perfect candidates
            </p>
            <Link 
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Post a Job →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Easy Process</h3>
            <p className="text-gray-600 mb-6">
              Simple, streamlined application process with instant notifications
            </p>
            <Link 
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Start Applying →
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-blue-600 rounded-lg shadow-xl p-6 md:p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <div>
              <p className="text-2xl md:text-4xl font-bold mb-2">
                {loading ? '...' : `${stats.activeJobs}+`}
              </p>
              <p className="text-xs md:text-base text-blue-100">Active Jobs</p>
            </div>
            <div>
              <p className="text-2xl md:text-4xl font-bold mb-2">
                {loading ? '...' : `${stats.totalUsers}+`}
              </p>
              <p className="text-xs md:text-base text-blue-100">Registered Users</p>
            </div>
            <div>
              <p className="text-2xl md:text-4xl font-bold mb-2">
                {loading ? '...' : `${stats.companies}+`}
              </p>
              <p className="text-xs md:text-base text-blue-100">Top Companies</p>
            </div>
            <div>
              <p className="text-2xl md:text-4xl font-bold mb-2">
                {loading ? '...' : `${stats.totalApplications}+`}
              </p>
              <p className="text-xs md:text-base text-blue-100">Applications</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8 md:mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8">
            Join thousands of professionals finding their perfect match
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Link 
              href="/register"
              className="px-6 md:px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Create Account
            </Link>
            <Link 
              href="/jobs"
              className="px-6 md:px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
            >
              View Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
