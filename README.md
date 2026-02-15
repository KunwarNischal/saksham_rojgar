# Saksham Rojgar - Job Portal

A full-stack job portal web application connecting job seekers with employers. Built as an internship project using modern web technologies.

## Features

### Job Seekers
- Browse and search jobs by title, location, and category
- Apply to jobs with resume upload
- Track application status (pending, reviewed, shortlisted, rejected)
- Manage profile and view application history

### Employers
- Post, edit, and manage job listings
- Review applicants and update application status
- View applicant profiles and download resumes
- Dashboard with job and application statistics

### Admin Panel
- User management (view, delete users)
- Job oversight (view, delete any job)
- Company statistics and analytics
- Platform-wide dashboard with metrics

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | Next.js 14, React, Tailwind CSS     |
| Backend    | Express.js, Node.js                 |
| Database   | MongoDB Atlas, Mongoose             |
| Auth       | JWT (JSON Web Tokens), bcrypt       |
| Uploads    | Multer (local disk storage)         |
| Validation | express-validator                   |
| Security   | Helmet, express-rate-limit, CORS    |

## Project Structure

```
saksham_rojgar/
├── backend/          # Express.js REST API
│   ├── config/       # Database & service configuration
│   ├── controllers/  # Route handler logic
│   ├── middleware/    # Auth, role check, file upload
│   ├── models/       # Mongoose schemas (User, Job, Application)
│   ├── routes/       # API route definitions
│   └── scripts/      # Database seed scripts
├── frontend/         # Next.js application
│   ├── app/          # App router pages & layouts
│   ├── components/   # Reusable UI components
│   ├── context/      # React context (AuthContext)
│   └── utils/        # API client utilities
└── package.json      # Root scripts (concurrently)
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone <repository-url>
cd saksham_rojgar
```

### 2. Set up environment variables

Copy the example files and fill in your values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

### 3. Install dependencies
```bash
npm install        # installs root + concurrently
cd backend && npm install
cd ../frontend && npm install
```

### 4. Seed the database (optional)
```bash
cd backend
node scripts/seedDefaultAdmin.js   # creates default admin user
node scripts/seedData.js           # adds sample jobs & users
```

### 5. Run the application
```bash
# From root directory - starts both frontend & backend
npm run dev
```


## API Endpoints

| Method | Endpoint                       | Description            | Auth     |
| ------ | ------------------------------ | ---------------------- | -------- |
| POST   | `/api/auth/register`           | Register user          | No       |
| POST   | `/api/auth/login`              | Login                  | No       |
| GET    | `/api/jobs`                    | List all jobs          | No       |
| GET    | `/api/jobs/:id`                | Get job details        | No       |
| POST   | `/api/jobs`                    | Create job             | Employer |
| PUT    | `/api/jobs/:id`                | Update job             | Employer |
| DELETE | `/api/jobs/:id`                | Delete job             | Employer |
| POST   | `/api/applications/:jobId`     | Apply to job           | Seeker   |
| GET    | `/api/admin/stats`             | Dashboard stats        | Admin    |
| GET    | `/api/admin/users`             | List users             | Admin    |
| GET    | `/api/admin/jobs`              | List all jobs          | Admin    |
| GET    | `/api/admin/companies`         | Company statistics     | Admin    |

## Default Credentials

After running the seed script:
- **Admin**: admin@sakshamrojgar.com / admin123
- **Test Employer**: Register a new account with role "employer"
- **Test Job Seeker**: Register a new account with role "jobseeker"

## License

This project was built for educational/internship purposes.
