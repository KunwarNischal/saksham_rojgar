const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Helper function to remove auth token
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Helper function to get stored user
export const getStoredUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Helper function to store user
export const setStoredUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    ...options.headers,
  };

  // Add auth token if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Add Content-Type for JSON requests (unless it's FormData)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data.success ? data.data : data;
  } catch (error) {
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getProfile: () => apiRequest('/auth/me'),

  updateProfile: (userData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  getUserProfile: (userId) => apiRequest(`/auth/user/${userId}`),
};

// Jobs API calls
export const jobsAPI = {
  getAllJobs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/jobs${queryString ? `?${queryString}` : ''}`);
  },

  getJobById: (id) => apiRequest(`/jobs/${id}`),

  createJob: (jobData) => apiRequest('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  }),

  updateJob: (id, jobData) => apiRequest(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  }),

  deleteJob: (id) => apiRequest(`/jobs/${id}`, {
    method: 'DELETE',
  }),

  getEmployerJobs: () => apiRequest('/jobs/employer/my-jobs'),
};

// Applications API calls
export const applicationsAPI = {
  applyForJob: (formData) => apiRequest('/applications/apply', {
    method: 'POST',
    body: formData, // FormData for file upload
  }),

  uploadResume: (formData) => apiRequest('/applications/upload-resume', {
    method: 'POST',
    body: formData,
  }),

  getMyApplications: () => apiRequest('/applications/my-applications'),

  getEmployerApplications: () => apiRequest('/applications/employer/applications'),

  getJobApplicants: (jobId) => apiRequest(`/applications/job/${jobId}`),

  getApplicationById: (id) => apiRequest(`/applications/${id}`),

  updateApplicationStatus: (id, status) => apiRequest(`/applications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};

// Admin API calls
export const adminAPI = {
  getDashboardStats: () => apiRequest('/admin/stats'),

  getAllUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  getUserById: (id) => apiRequest(`/admin/users/${id}`),

  deleteUser: (id) => apiRequest(`/admin/users/${id}`, {
    method: 'DELETE',
  }),

  getAllJobs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/jobs${queryString ? `?${queryString}` : ''}`);
  },
};

export default {
  auth: authAPI,
  jobs: jobsAPI,
  applications: applicationsAPI,
  admin: adminAPI,
};
