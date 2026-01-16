# Frontend-Backend Integration Guide

## 🎉 Integration Complete!

Your Next.js frontend is now fully connected to the Node.js backend API.

## 📁 New Files Created

### 1. **API Utility** - `/utils/api.js`
- Centralized API request handler
- Token management functions
- All API endpoints organized by feature:
  - `authAPI` - Authentication
  - `jobsAPI` - Job management
  - `applicationsAPI` - Applications
  - `adminAPI` - Admin operations

### 2. **Authentication Context** - `/context/AuthContext.js`
- Global user state management
- Login/register/logout functions
- Token persistence in localStorage
- Protected route handling

### 3. **Environment Configuration** - `/.env.local`
- `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

## 🔄 Updated Pages

### Authentication
- ✅ `/app/auth/login/page.jsx` - Real login with JWT
- ✅ `/app/auth/register/page.jsx` - Real registration
- ✅ `/app/layout.js` - Added AuthProvider wrapper

### Jobs
- ✅ `/app/jobs/page.jsx` - Fetches jobs from backend API
- ✅ `/app/jobs/[id]/page.jsx` - Job details with real application submission

### Job Seeker
- ✅ `/app/jobseeker/dashboard/page.jsx` - Shows real applications

### Components
- ✅ `/components/Navbar.jsx` - Real logout functionality
- ✅ `/components/JobCard.jsx` - Uses correct API field names

## 🚀 How to Run

### 1. Start MongoDB
```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

### 2. Start Backend Server
```bash
cd backend
npm install  # First time only
npm run dev
```
Backend will run on: `http://localhost:5000`

### 3. Start Frontend
```bash
# In the root directory
npm run dev
```
Frontend will run on: `http://localhost:3000`

## 🔐 Test Users

To test the system, you can register new users or create test users directly:

### Register as Job Seeker:
- Email: `jobseeker@test.com`
- Password: `password123`
- Role: Job Seeker

### Register as Employer:
- Email: `employer@test.com`
- Password: `password123`
- Role: Employer
- Company: Your Company Name

### Create Admin (MongoDB):
```javascript
// Use MongoDB compass or shell to create admin user
{
  name: "Admin User",
  email: "admin@test.com",
  password: "$2a$10$...", // Use bcrypt to hash "password123"
  role: "admin"
}
```

## 🎯 Features Working

### For Job Seekers
- ✅ Register and login
- ✅ Browse all jobs
- ✅ Search and filter jobs
- ✅ View job details
- ✅ Apply for jobs with resume upload
- ✅ View applied jobs in dashboard
- ✅ Track application status

### For Employers
- ✅ Register and login
- ✅ Post new jobs
- ✅ View own jobs
- ✅ Edit/delete jobs
- ✅ View applicants for each job
- ✅ Update application status

### For Admins
- ✅ View all users
- ✅ View all jobs
- ✅ Delete users
- ✅ Delete jobs
- ✅ Dashboard statistics

## 📝 API Endpoints Reference

### Authentication
```javascript
// Login
POST /api/auth/login
Body: { email, password }

// Register
POST /api/auth/register
Body: { name, email, password, role, phone, location }

// Get Profile
GET /api/auth/me
Headers: Authorization: Bearer {token}

// Update Profile
PUT /api/auth/profile
Headers: Authorization: Bearer {token}
```

### Jobs
```javascript
// Get All Jobs
GET /api/jobs?search=&location=&jobType=

// Get Job by ID
GET /api/jobs/:id

// Create Job (Employer only)
POST /api/jobs
Headers: Authorization: Bearer {token}

// Update Job
PUT /api/jobs/:id
Headers: Authorization: Bearer {token}

// Delete Job
DELETE /api/jobs/:id
Headers: Authorization: Bearer {token}
```

### Applications
```javascript
// Apply for Job
POST /api/applications/apply
Headers: Authorization: Bearer {token}
Body: FormData { jobId, coverLetter, resume }

// Get My Applications
GET /api/applications/my-applications
Headers: Authorization: Bearer {token}

// Get Job Applicants (Employer)
GET /api/applications/job/:jobId
Headers: Authorization: Bearer {token}

// Update Application Status (Employer)
PUT /api/applications/:id/status
Headers: Authorization: Bearer {token}
Body: { status }
```

## 🛠️ Remaining Tasks

### Pages Still Using Mock Data:
1. **Employer Dashboard** - `/app/employer/dashboard/page.jsx`
2. **Employer Manage Jobs** - `/app/employer/manage-jobs/page.jsx`
3. **Employer Post Job** - `/app/employer/post-job/page.jsx`
4. **Employer Applicants** - `/app/employer/applicants/page.jsx`
5. **Job Seeker Profile** - `/app/jobseeker/profile/page.jsx`
6. **Job Seeker Applied** - `/app/jobseeker/applied/page.jsx`
7. **Admin Dashboard** - `/app/admin/dashboard/page.jsx`
8. **Admin Users** - `/app/admin/users/page.jsx`
9. **Admin Jobs** - `/app/admin/jobs/page.jsx`
10. **Admin Analytics** - `/app/admin/analytics/page.jsx`

These pages need to be updated to:
- Import `useAuth` hook
- Use API functions from `/utils/api.js`
- Handle loading states
- Display error messages
- Update UI with real data

## 🎓 Key Concepts for Viva

### 1. **How Authentication Works**
- User logs in → Backend generates JWT token
- Token stored in localStorage
- Token sent with every API request in Authorization header
- Backend verifies token and identifies user

### 2. **How File Upload Works**
- Frontend: Use FormData to send files
- Backend: Multer receives file
- Backend: Upload to Cloudinary
- Backend: Save URL in database

### 3. **Role-Based Access Control**
- Each user has a role (jobseeker/employer/admin)
- Backend middleware checks role before allowing access
- Frontend shows different UI based on role

### 4. **Frontend-Backend Flow**
```
User Action → Frontend Component → API Call → Backend Route
→ Controller → Database → Response → Update UI
```

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution**: Make sure backend `.env` has correct `FRONTEND_URL=http://localhost:3000`

### Issue: Token Not Found
**Solution**: User needs to login again. Token might have expired or been cleared.

### Issue: File Upload Failed
**Solution**: Check Cloudinary credentials in backend `.env`

### Issue: Cannot Connect to MongoDB
**Solution**: Make sure MongoDB is running on `mongodb://localhost:27017`

## 📊 Project Structure

```
job-portal/
├── app/                    # Next.js pages
├── components/             # Reusable components
├── context/               # React Context (AuthContext)
├── utils/                 # Utility functions (API calls)
├── data/                  # Mock data (can be removed)
├── backend/               # Node.js backend
│   ├── config/           # Database & Cloudinary config
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth, upload, etc.
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   └── server.js        # Entry point
└── .env.local           # Frontend environment variables
```

## 🎯 Success Criteria

✅ Users can register and login
✅ Jobs are loaded from backend
✅ Job seekers can apply with resume upload
✅ Applications are stored in database
✅ Authentication tokens work correctly
✅ Role-based access is enforced
✅ File uploads work with Cloudinary
✅ MongoDB stores all data

## 📚 Additional Resources

- **Backend README**: Check `backend/README.md` for detailed API documentation
- **Postman Collection**: Test APIs directly
- **MongoDB Compass**: View database records visually

Good luck with your internship project! 🚀
