"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { jobsAPI } from "@/utils/api";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import Button from "@/components/Button";

export default function PostJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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
    document.title = "Saksham Rojgar - Post Job";
  }, []);

  useEffect(() => {
    if (user?.company) {
      setFormData(prev => ({ ...prev, company: user.company }));
    }
  }, [user]);

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
      await jobsAPI.createJob(formData);
      router.push("/employer/manage-jobs");
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Fill in the details to create a new job posting</p>
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
                onClick={() => router.push("/employer/dashboard")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Posting...' : 'Post Job'}
              </Button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Tips for a great job posting</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Use a clear and specific job title</li>
            <li>• Provide a detailed description of the role</li>
            <li>• List requirements realistically</li>
            <li>• Include salary range to attract more candidates</li>
            <li>• Highlight company culture and benefits</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
