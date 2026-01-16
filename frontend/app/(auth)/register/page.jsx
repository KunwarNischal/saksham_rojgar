"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import GuestRoute from "@/components/GuestRoute";

// Popular locations/cities in Nepal and nearby regions
const LOCATIONS = [
  'Kathmandu, Nepal',
  'Lalitpur, Nepal',
  'Bhaktapur, Nepal',
  'Pokhara, Nepal',
  'Biratnagar, Nepal',
  'Birgunj, Nepal',
  'Dharan, Nepal',
  'Butwal, Nepal',
  'Hetauda, Nepal',
  'Janakpur, Nepal',
  'Nepalgunj, Nepal',
  'Bharatpur, Nepal',
  'Itahari, Nepal',
  'Dhangadhi, Nepal',
  'Tulsipur, Nepal',
  'Damak, Nepal',
  'Gorkha, Nepal',
  'Chitwan, Nepal',
  'Lumbini, Nepal',
  'Bandipur, Nepal',
  'Patan, Nepal',
  'Kirtipur, Nepal',
  'Dhulikhel, Nepal',
  'Nagarkot, Nepal',
  'Remote'
];

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { addToast } = useToast();
  
  useEffect(() => {
    document.title = "Saksham Rojgar - Register";
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobseeker",
    phone: "",
    location: "",
    company: "" // For employers
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationDropdownRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
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
    setError("");
  };

  const handleLocationSelect = (location) => {
    setFormData({ ...formData, location });
    setLocationSearch(location);
    setShowLocationDropdown(false);
  };

  const handleLocationSearchChange = (e) => {
    const value = e.target.value;
    setLocationSearch(value);
    setFormData({ ...formData, location: value });
    setShowLocationDropdown(true);
  };

  const filteredLocations = LOCATIONS.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await registerUser(registerData);
      
      if (result.success) {
        // Show success toast
        addToast("Account created successfully! Please login to continue.", "success");
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        setError(result.error || "Registration failed. Please try again.");
        addToast(result.error || "Registration failed. Please try again.", "error");
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestRoute>
      <Navbar userRole="guest" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join our job portal today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Register As <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "jobseeker" })}
                className={`py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                  formData.role === "jobseeker"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "employer" })}
                className={`py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                  formData.role === "employer"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Employer
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Password with eye toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password with eye toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="+977 98XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            {/* Dynamic Location Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={locationDropdownRef}>
                <input
                  type="text"
                  value={locationSearch}
                  onChange={handleLocationSearchChange}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder="Kathmandu, Nepal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                
                {/* Dropdown with suggestions */}
                {showLocationDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {locationSearch && !LOCATIONS.includes(locationSearch) && (
                      <button
                        type="button"
                        onClick={() => handleLocationSelect(locationSearch)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-200 text-blue-600 font-medium text-sm"
                      >
                        + Use "{locationSearch}"
                      </button>
                    )}
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleLocationSelect(location)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                        >
                          {location}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        No locations found. Type to add custom location.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {formData.role === "employer" && (
            <Input
              label="Company Name"
              type="text"
              name="company"
              placeholder="Your Company Inc."
              value={formData.company}
              onChange={handleChange}
              required
            />
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700">
              Already have an account? <span className="font-semibold">Login here</span>
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link href="/jobs" className="text-sm text-gray-600 hover:text-gray-800">
            ← Browse Jobs as Guest
          </Link>
        </div>
      </div>
      </div>
    </GuestRoute>
  );
}
