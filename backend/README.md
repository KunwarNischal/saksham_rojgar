# Job Portal Backend API

A professional RESTful API built with Node.js, Express, and MongoDB for a job portal system. Features include JWT authentication, role-based access control, and file uploads with Cloudinary.

## 🚀 Features

- **Authentication & Authorization**
  - JWT token-based authentication
  - Password hashing with bcrypt
  - Role-based access control (Job Seeker, Employer, Admin)

- **User Management**
  - User registration and login
  - Profile management
  - Resume upload for job seekers
  - Company logo upload for employers

- **Job Management**
  - Create, read, update, delete job postings
  - Search and filter jobs
  - Employer-specific job management

- **Application Management**
  - Apply for jobs with resume upload
  - Track application status
  - Employer view of applicants

- **Admin Dashboard**
  - Manage all users
  - View all jobs
  - System statistics
  - Delete inappropriate content

- **File Uploads**
  - Multer for file handling
  - Cloudinary for cloud storage
  - PDF support for resumes
  - Image support for company logos

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with your credentials:
     - MongoDB connection string
     - JWT secret key
     - Cloudinary credentials (cloud_name, api_key, api_secret)

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── jobController.js   # Job management logic
│   ├── applicationController.js  # Application logic
│   └── adminController.js # Admin operations
├── middleware/
│   ├── auth.js           # JWT verification
│   ├── roleCheck.js      # Role-based authorization
│   └── upload.js         # File upload handling
├── models/
│   ├── User.js           # User schema
│   ├── Job.js            # Job schema
│   └── Application.js    # Application schema
├── routes/
│   ├── auth.js           # Auth routes
│   ├── jobs.js           # Job routes
│   ├── applications.js   # Application routes
│   └── admin.js          # Admin routes
├── .env                  # Environment variables
├── .env.example          # Environment variables template
├── server.js             # Express app entry point
└── package.json
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update user profile | Private |

### Jobs (`/api/jobs`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all jobs (with filters) | Public |
| GET | `/:id` | Get single job | Public |
| POST | `/` | Create new job | Employer |
| PUT | `/:id` | Update job | Employer (owner) |
| DELETE | `/:id` | Delete job | Employer/Admin |
| GET | `/employer/my-jobs` | Get employer's jobs | Employer |

### Applications (`/api/applications`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/apply` | Apply for a job | Job Seeker |
| POST | `/upload-resume` | Upload resume | Job Seeker |
| GET | `/my-applications` | Get user's applications | Job Seeker |
| GET | `/job/:jobId` | Get job applicants | Employer |
| PUT | `/:id/status` | Update application status | Employer |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/stats` | Dashboard statistics | Admin |
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get user by ID | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| GET | `/jobs` | Get all jobs | Admin |

## 📝 Request Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "jobseeker",
  "phone": "+1234567890",
  "location": "New York, NY"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Job (Employer)
```bash
POST /api/jobs
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Senior Frontend Developer",
  "description": "We are looking for an experienced Frontend Developer...",
  "requirements": ["5+ years React", "TypeScript", "Team player"],
  "responsibilities": ["Build UI components", "Code reviews"],
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "jobType": "Full-time",
  "salary": "$120,000 - $150,000"
}
```

### Apply for Job
```bash
POST /api/applications/apply
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

jobId: 507f1f77bcf86cd799439011
coverLetter: I am excited to apply...
resume: [FILE] (PDF)
```

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Tokens are returned upon successful login/registration and expire after 30 days.

## 👥 User Roles

1. **Job Seeker**
   - Browse and search jobs
   - Apply for jobs
   - Upload resume
   - Track applications

2. **Employer**
   - Post job listings
   - Manage own jobs
   - View applicants
   - Update application status

3. **Admin**
   - Full system access
   - Manage all users
   - View all jobs
   - Delete content
   - View statistics

## 📤 File Upload

### Supported Files
- **Resumes**: PDF only, max 5MB
- **Company Logos**: Images (JPG, PNG), max 5MB

### Upload Endpoints
```bash
# Upload Resume
POST /api/applications/upload-resume
Content-Type: multipart/form-data
Authorization: Bearer YOUR_JWT_TOKEN

resume: [PDF FILE]
```

Files are automatically uploaded to Cloudinary and URLs are stored in the database.

## 🌐 CORS Configuration

The API allows requests from the frontend URL specified in `.env`:
```
FRONTEND_URL=http://localhost:3000
```

## 🔍 Query Parameters

### Get All Jobs
```
GET /api/jobs?search=developer&location=New York&jobType=Full-time&page=1&limit=10
```

### Get All Users (Admin)
```
GET /api/admin/users?role=jobseeker&page=1&limit=20
```

## ⚠️ Error Handling

All errors return JSON in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🧪 Testing with Postman

1. Import the API endpoints into Postman
2. Set up environment variables:
   - `baseURL`: http://localhost:5000/api
   - `token`: (will be set after login)
3. Test authentication first to get a token
4. Use the token for protected routes

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production` in production
2. Use a strong `JWT_SECRET`
3. Set up MongoDB Atlas for cloud database
4. Configure Cloudinary with production credentials

### Deployment Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **Render**: Free tier available
- **Railway**: Simple setup
- **DigitalOcean**: VPS hosting

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the Next.js frontend. Key integration points:

1. **Base URL**: Update frontend API calls to point to backend
2. **Token Storage**: Store JWT token in localStorage/cookies
3. **File Uploads**: Use FormData for resume/logo uploads
4. **Error Handling**: Handle error responses from backend

## 📚 Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud file storage
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## 📄 License

MIT License - Feel free to use for internship projects and learning.

## 🎓 Perfect for Internships

This backend is designed with interns in mind:
- Clean, readable code
- Well-commented
- Professional structure
- Industry-standard practices
- Easy to explain in interviews
- Complete API documentation

## 💡 Tips for Viva/Presentation

1. **Explain the flow**: User registers → Login → Get token → Access protected routes
2. **Security**: Mention JWT, bcrypt, role-based access
3. **File uploads**: Explain Multer → Cloudinary process
4. **Scalability**: Indexed database queries, pagination
5. **Best practices**: Error handling, validation, separation of concerns

Good luck with your internship project! 🚀
