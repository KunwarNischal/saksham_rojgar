"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import { jobsAPI, applicationsAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";

export default function JobDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    if (job) {
      document.title = `Saksham Rojgar - ${job.title}`;
    } else {
      document.title = "Saksham Rojgar - Job Details";
    }
  }, [job]);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (resolvedParams?.id) {
      fetchJob();
    }
  }, [resolvedParams?.id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobById(resolvedParams.id);
      console.log("Job detail response:", response);
      setJob(response);
    } catch (err) {
      setError("Failed to load job details");
      console.error("Fetch job error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      addToast('Please login to apply for jobs', 'error');
      router.push('/login');
      return;
    }
    if (user?.role !== 'jobseeker') {
      addToast('Only job seekers can apply for jobs', 'error');
      return;
    }
    setShowApplyModal(true);
  };

  const handleApply = async () => {
    if (!coverLetter.trim()) {
      addToast('Please write a cover letter', 'error');
      return;
    }

    setApplying(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('jobId', resolvedParams.id);
      formData.append('coverLetter', coverLetter);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await applicationsAPI.applyForJob(formData);
      
      setShowApplyModal(false);
      addToast('Application submitted successfully!', 'success');
      router.push('/jobseeker/applied');
    } catch (err) {
      addToast(err.message || 'Failed to submit application', 'error');
      setError(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole={user?.role || "guest"} />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole={user?.role || "guest"} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <Link href="/jobs" className="text-blue-600 hover:underline">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={user?.role || "guest"} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/jobs" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to Jobs
        </Link>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{job.title}</h1>
              <h2 className="text-xl text-gray-700 font-semibold mb-4">{job.company}</h2>
              
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">💼</span>
                  <span>{job.jobType}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center">
                    <span className="mr-2">💰</span>
                    <span>{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="mr-2">👥</span>
                  <span>{job.applicants} applicants</span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:ml-6">
              <Button onClick={handleApplyClick} size="lg">
                Apply Now
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-500">
              Posted on {new Date(job.postedDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Job Description</h3>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Key Responsibilities</h3>
              <ul className="space-y-3">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-3">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Overview</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Company</p>
                  <p className="font-medium text-gray-900">{job.company}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-medium text-gray-900">{job.location}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Job Type</p>
                  <p className="font-medium text-gray-900">{job.jobType}</p>
                </div>
                
                {job.salary && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Salary Range</p>
                    <p className="font-medium text-gray-900">{job.salary}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Applicants</p>
                  <p className="font-medium text-gray-900">{job.applicants} people applied</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button onClick={handleApplyClick} fullWidth>
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Apply for {job.title}</h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us why you're a great fit for this role..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume (Optional - PDF only)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If you don't upload a resume now, we'll use your profile resume.
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowApplyModal(false)}
                disabled={applying}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {applying ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
