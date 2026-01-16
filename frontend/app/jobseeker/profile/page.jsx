"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { authAPI } from "@/utils/api";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import Select from "@/components/Select";

// Predefined skills options
const SKILLS_OPTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust',
  'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express.js', 'Django', 'Flask',
  'Spring Boot', 'Laravel', 'ASP.NET', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Git', 'CI/CD',
  'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'REST API', 'GraphQL',
  'Machine Learning', 'Data Analysis', 'SQL', 'NoSQL', 'Agile', 'Scrum',
  'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Communication', 'Leadership',
  'Project Management', 'Problem Solving', 'Team Work', 'Time Management'
];

const EXPERIENCE_LEVELS = [
  'Entry Level (0-1 years)',
  'Junior (1-3 years)',
  'Mid Level (3-5 years)',
  'Senior (5-8 years)',
  'Lead (8+ years)',
  'Expert (10+ years)'
];

const EDUCATION_LEVELS = [
  'High School',
  'Diploma',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctorate (PhD)',
  'Professional Certificate',
  'Bootcamp Graduate'
];

export default function JobSeekerProfile() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    education: '',
    bio: ''
  });
  const [originalFormData, setOriginalFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    education: '',
    bio: ''
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [originalSkills, setOriginalSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const skillDropdownRef = useRef(null);

  useEffect(() => {
    document.title = "Saksham Rojgar - Profile";
  }, []);

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        experience: user.experience || '',
        education: user.education || '',
        bio: user.bio || ''
      };
      setFormData(userData);
      setOriginalFormData(userData);
      setSelectedSkills(user.skills || []);
      setOriginalSkills(user.skills || []);
    }
  }, [user]);

  // Check for changes
  useEffect(() => {
    const formChanged = JSON.stringify(formData) !== JSON.stringify(originalFormData);
    const skillsChanged = JSON.stringify(selectedSkills) !== JSON.stringify(originalSkills);
    setHasChanges(formChanged || skillsChanged);
  }, [formData, originalFormData, selectedSkills, originalSkills]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target)) {
        setShowSkillDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const handleSkillRemove = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleCustomSkillAdd = () => {
    if (skillSearch.trim() && !selectedSkills.includes(skillSearch.trim())) {
      setSelectedSkills([...selectedSkills, skillSearch.trim()]);
      setSkillSearch('');
      setShowSkillDropdown(false);
    }
  };

  const filteredSkills = SKILLS_OPTIONS.filter(skill => 
    skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !selectedSkills.includes(skill)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Exclude email from update data
      const { email, ...updateData } = formData;
      const finalUpdateData = {
        ...updateData,
        skills: selectedSkills
      };
      const response = await authAPI.updateProfile(finalUpdateData);
      updateUser(response.data || response);
      
      // Update original data after successful save
      setOriginalFormData(formData);
      setOriginalSkills(selectedSkills);
      
      addToast('Profile updated successfully!', 'success');
      setSuccess('Profile updated successfully!');
    } catch (error) {
      addToast(error.message || 'Failed to update profile', 'error');
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData(originalFormData);
      setSelectedSkills(originalSkills);
      setError('');
      setSuccess('');
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-sm md:text-base text-gray-600">Manage your personal information and resume</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <Textarea
                label="Bio / Summary"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell employers about yourself..."
              />
            </div>

            {/* Professional Information */}
            <div className="pt-6 border-t">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Select
                  label="Experience Level"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  options={EXPERIENCE_LEVELS}
                />
                <Select
                  label="Education Level"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  options={EDUCATION_LEVELS}
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                
                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-md">
                    {selectedSkills.map((skill, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 md:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleSkillRemove(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Skill Search Input */}
                <div className="relative" ref={skillDropdownRef}>
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => {
                      setSkillSearch(e.target.value);
                      setShowSkillDropdown(true);
                    }}
                    onFocus={() => setShowSkillDropdown(true)}
                    placeholder="Search or type to add skills..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {/* Dropdown with suggestions */}
                  {showSkillDropdown && (skillSearch || filteredSkills.length > 0) && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {skillSearch && !SKILLS_OPTIONS.includes(skillSearch) && (
                        <button
                          type="button"
                          onClick={handleCustomSkillAdd}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-200 text-blue-600 font-medium"
                        >
                          + Add "{skillSearch}"
                        </button>
                      )}
                      {filteredSkills.slice(0, 10).map((skill, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSkillSelect(skill)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          {skill}
                        </button>
                      ))}
                      {filteredSkills.length === 0 && !skillSearch && (
                        <div className="px-4 py-2 text-gray-500 text-sm">
                          Start typing to search skills...
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Select from suggestions or type custom skills. Click × to remove.
                </p>
              </div>
            </div>

            {/* Resume */}
            <div className="pt-6 border-t">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Resume</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center">
                <div className="text-4xl mb-3">📄</div>
                <p className="text-gray-700 font-medium mb-2">Current Resume</p>
                <p className="text-sm text-gray-600 mb-4">{formData.resume}</p>
                <Button variant="outline">
                  Upload New Resume
                </Button>
                <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX (Max 5MB)</p>
              </div>
            </div>

            {/* Skills Tags - Current Skills Display */}
            <div className="pt-6 border-t">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Your Skills Summary</h2>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.length > 0 ? (
                  selectedSkills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 md:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills added yet. Add skills above to get started.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            {hasChanges && (
              <div className="pt-6 border-t flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <Button 
                  variant="secondary" 
                  disabled={loading}
                  onClick={handleCancel}
                  type="button"
                  fullWidth={false}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  fullWidth={false}
                  className="w-full sm:w-auto"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
