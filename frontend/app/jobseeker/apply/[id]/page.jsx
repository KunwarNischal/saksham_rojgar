"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import { jobsAPI, applicationsAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";

export default function ApplyJobPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (job) {
      document.title = `Apply for ${job.title} - Saksham Rojgar`;
    } else {
      document.title = "Apply for Job - Saksham Rojgar";
    }
  }, [job]);

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
      addToast("Failed to load job details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        addToast('Please upload a PDF file only', 'error');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        addToast('File size must be less than 5MB', 'error');
        e.target.value = '';
        return;
      }
      setResumeFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      
      addToast('Application submitted successfully!', 'success');
      router.push('/jobseeker/applied');
    } catch (err) {
      const errorMessage = err.message || 'Failed to submit application';
      addToast(errorMessage, 'error');
      setError(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-3xl mx-auto text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading job details...</p>
        </div>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-3xl mx-auto text-center py-16">
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
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => router.push(`/jobseeker/job-details/${resolvedParams.id}`)}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          ← Back to Job Details
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Apply for Position</h1>
          <p className="text-gray-600">Complete the form below to submit your application</p>
        </div>

        {/* Job Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-600">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h2>
          <p className="text-lg text-gray-700 mb-3">{job.company}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="space-y-6">
            {/* Applicant Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    value={user?.name || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={8}
                placeholder="Tell us why you're a great fit for this role. Highlight your relevant skills, experience, and what excites you about this opportunity..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                A well-written cover letter increases your chances of getting noticed
              </p>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume (Optional - PDF only)
              </label>
              <div className="mt-1">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {fileName ? (
                        <>
                          <svg className="w-8 h-8 mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-700">
                            <span className="font-semibold">{fileName}</span>
                          </p>
                          <p className="text-xs text-gray-500">Click to change file</p>
                        </>
                      ) : (
                        <>
                          <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PDF only (MAX. 5MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                If you don't upload a resume now, we'll use your profile resume (if available)
              </p>
            </div>

            {/* Terms */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                By submitting this application, you confirm that the information provided is accurate and complete. 
                The employer will review your application and contact you if they're interested.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => router.push(`/jobseeker/job-details/${resolvedParams.id}`)}
                disabled={applying}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={applying || !coverLetter.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {applying ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
