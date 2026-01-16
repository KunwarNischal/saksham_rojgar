"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Button from "@/components/Button";
import { jobsAPI, applicationsAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

export default function JobDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [applicationDetails, setApplicationDetails] = useState(null);

  useEffect(() => {
    if (job) {
      document.title = `Saksham Rojgar - ${job.title}`;
    } else {
      document.title = "Saksham Rojgar - Job Details";
    }
  }, [job]);

  useEffect(() => {
    if (resolvedParams?.id) {
      fetchJob();
      checkIfApplied();
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

  const checkIfApplied = async () => {
    try {
      setCheckingApplication(true);
      const applications = await applicationsAPI.getMyApplications();
      if (Array.isArray(applications)) {
        const myApplication = applications.find(app => app.jobId?._id === resolvedParams.id);
        if (myApplication) {
          setHasApplied(true);
          setApplicationDetails(myApplication);
        }
      }
    } catch (err) {
      console.error("Error checking application status:", err);
    } finally {
      setCheckingApplication(false);
    }
  };

  const handleApplyClick = () => {
    router.push(`/jobseeker/apply/${resolvedParams.id}`);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading job details...</p>
        </div>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto text-center py-16">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <button 
            onClick={() => router.push('/jobseeker/browse')} 
            className="text-blue-600 hover:underline"
          >
            ← Back to Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => router.push('/jobseeker/browse')}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          ← Back to Browse Jobs
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{job.title}</h1>
              <h2 className="text-lg md:text-xl text-gray-700 font-semibold mb-4">{job.company}</h2>
              
              <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-600">
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
              {hasApplied ? (
                <div className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg border border-green-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Already Applied</span>
                </div>
              ) : (
                <Button onClick={handleApplyClick} size="lg" disabled={checkingApplication}>
                  {checkingApplication ? 'Loading...' : 'Apply Now'}
                </Button>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              Posted on {new Date(job.createdAt || job.postedDate).toLocaleDateString('en-US', { 
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
            {/* Application Details - Show if user has applied */}
            {hasApplied && applicationDetails && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 md:p-8 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">Your Application</h3>
                    <p className="text-sm text-gray-600">Submitted on {new Date(applicationDetails.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</p>
                  </div>
                </div>

                {/* Application Status */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      applicationDetails.status === 'accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
                      applicationDetails.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                      applicationDetails.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {applicationDetails.status === 'accepted' ? 'Accepted' :
                       applicationDetails.status === 'rejected' ? 'Rejected' :
                       applicationDetails.status === 'reviewing' ? 'Under Review' :
                       applicationDetails.status.charAt(0).toUpperCase() + applicationDetails.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Application ID: <span className="font-mono font-semibold">{applicationDetails._id.slice(-8).toUpperCase()}</span>
                  </p>
                </div>

                {/* Cover Letter */}
                {applicationDetails.coverLetter && (
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h4 className="text-base font-semibold text-gray-900">Your Cover Letter</h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {applicationDetails.coverLetter}
                    </p>
                  </div>
                )}

                {/* Resume */}
                {applicationDetails.resume && (
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Resume Attached</p>
                          <p className="text-xs text-gray-600">PDF Document</p>
                        </div>
                      </div>
                      <a
                        href={applicationDetails.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        View Resume
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Job Description</h3>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Key Responsibilities</h3>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-3 mt-1">✓</span>
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-3 mt-1">•</span>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Job Overview</h3>
              
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
                {hasApplied ? (
                  <div className="flex items-center justify-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg border border-green-200 w-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">Already Applied</span>
                  </div>
                ) : (
                  <Button onClick={handleApplyClick} fullWidth disabled={checkingApplication}>
                    {checkingApplication ? 'Loading...' : 'Apply Now'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
