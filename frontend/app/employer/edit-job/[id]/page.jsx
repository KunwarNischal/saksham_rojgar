"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useAuth } from "@/context/AuthContext";
import { jobsAPI } from "@/utils/api";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";

export default function EditJobPage({ params }) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    salary: "",
    description: "",
    requirements: "",
    responsibilities: ""
  });

  useEffect(() => {
    document.title = "Saksham Rojgar - Edit Job";
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setFetchingJob(true);
        console.log('Starting fetch for jobId:', jobId);
        const job = await jobsAPI.getJobById(jobId);
        console.log('Fetched job:', job);
        console.log('Current user ID:', user?._id);
        console.log('Job employerId:', job?.employerId);
        
        // Check if the user is the owner of this job
        // employerId might be an object if populated, or a string
        const jobEmployerId = typeof job?.employerId === 'object' ? job.employerId._id : job?.employerId;
        if (job && jobEmployerId && jobEmployerId.toString() !== user?._id?.toString()) {
          addToast('You are not authorized to edit this job', 'error');
          router.push('/employer/manage-jobs');
          return;
        }

        if (job) {
          const newFormData = {
            title: job.title || "",
            company: job.company || "",
            location: job.location || "",
            jobType: job.jobType || "",
            salary: job.salary || "",
            description: job.description || "",
            // Convert arrays to newline-separated strings
            requirements: Array.isArray(job.requirements) 
              ? job.requirements.join('\n') 
              : job.requirements || "",
            responsibilities: Array.isArray(job.responsibilities) 
              ? job.responsibilities.join('\n') 
              : job.responsibilities || ""
          };
          console.log('Setting form data:', newFormData);
          setFormData(newFormData);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        addToast('Failed to load job details', 'error');
        // Don't redirect immediately, show the error
      } finally {
        console.log('Setting fetchingJob to false');
        setFetchingJob(false);
      }
    };

    if (jobId && user) {
      fetchJob();
    }
  }, [jobId, user, router, addToast]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await jobsAPI.updateJob(jobId, formData);
      addToast('Job updated successfully!', 'success');
      router.push("/employer/manage-jobs");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update job';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingJob) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/employer/manage-jobs")}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Manage Jobs
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Job</h1>
          <p className="text-gray-600">Update the job posting details</p>
        </div>

        {/* Job Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
                <Input
                  label="Company Name"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., San Francisco, CA or Remote"
                  required
                />
                <Select
                  label="Job Type"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  options={["Full-time", "Part-time", "Contract"]}
                  required
                />
                <div className="md:col-span-2">
                  <Input
                    label="Salary Range"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g., $80,000 - $120,000"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <Textarea
                label="Job Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Provide a detailed description of the role, team, and what the candidate will be working on..."
                required
              />
            </div>

            {/* Responsibilities */}
            <div>
              <Textarea
                label="Key Responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows={6}
                placeholder="Enter each responsibility on a new line:&#10;- Design and develop new features&#10;- Collaborate with the team&#10;- Write clean, maintainable code"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Enter each responsibility on a new line</p>
            </div>

            {/* Requirements */}
            <div>
              <Textarea
                label="Requirements & Qualifications"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={6}
                placeholder="Enter each requirement on a new line:&#10;- 3+ years of experience with React&#10;- Strong knowledge of JavaScript&#10;- Bachelor's degree in Computer Science"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Enter each requirement on a new line</p>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t flex justify-end space-x-4">
              <Button 
                variant="secondary"
                type="button"
                onClick={() => router.push("/employer/manage-jobs")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Job'}
              </Button>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 bg-amber-50 border-l-4 border-amber-600 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">ℹ️ Important Information</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Updating the job will notify applicants of changes</li>
            <li>• Active applications will not be affected</li>
            <li>• Job status (Active/Closed) can be changed from Manage Jobs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
