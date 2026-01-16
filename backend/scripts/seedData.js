import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('Cleared existing data');

    // Create employers
    const employers = [
      {
        name: 'TechCorp Solutions',
        email: 'hr@techcorp.com',
        password: await bcrypt.hash('password123', 10),
        role: 'employer',
        company: 'TechCorp Solutions',
        location: 'New York, NY',
        phone: '+1-555-0101'
      },
      {
        name: 'InnovateLabs Inc',
        email: 'careers@innovatelabs.com',
        password: await bcrypt.hash('password123', 10),
        role: 'employer',
        company: 'InnovateLabs Inc',
        location: 'San Francisco, CA',
        phone: '+1-555-0102'
      },
      {
        name: 'GlobalTech Systems',
        email: 'jobs@globaltech.com',
        password: await bcrypt.hash('password123', 10),
        role: 'employer',
        company: 'GlobalTech Systems',
        location: 'Austin, TX',
        phone: '+1-555-0103'
      }
    ];

    const createdEmployers = await User.insertMany(employers);
    console.log('Created employers');

    // Create jobseekers
    const jobseekers = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'jobseeker',
        location: 'New York, NY',
        phone: '+1-555-0201',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: '3 years',
        education: 'Bachelor of Computer Science'
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'jobseeker',
        location: 'San Francisco, CA',
        phone: '+1-555-0202',
        skills: ['Python', 'Django', 'PostgreSQL'],
        experience: '5 years',
        education: 'Master of Software Engineering'
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'jobseeker',
        location: 'Austin, TX',
        phone: '+1-555-0203',
        skills: ['Java', 'Spring Boot', 'MySQL'],
        experience: '4 years',
        education: 'Bachelor of Information Technology'
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'jobseeker',
        location: 'Seattle, WA',
        phone: '+1-555-0204',
        skills: ['C#', '.NET', 'SQL Server'],
        experience: '6 years',
        education: 'Bachelor of Computer Engineering'
      },
      {
        name: 'Emma Brown',
        email: 'emma@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'jobseeker',
        location: 'Boston, MA',
        phone: '+1-555-0205',
        skills: ['JavaScript', 'Vue.js', 'MongoDB'],
        experience: '2 years',
        education: 'Associate Degree in Web Development'
      }
    ];

    const createdJobseekers = await User.insertMany(jobseekers);
    console.log('Created jobseekers');

    // Create jobs
    const jobs = [
      {
        title: 'Senior Frontend Developer',
        description: 'We are looking for an experienced frontend developer to join our team. You will be responsible for building responsive web applications using modern JavaScript frameworks.',
        requirements: ['3+ years of experience with React', 'Proficiency in JavaScript/TypeScript', 'Experience with CSS frameworks', 'Knowledge of REST APIs'],
        responsibilities: ['Develop and maintain web applications', 'Collaborate with design and backend teams', 'Optimize applications for performance', 'Write clean, maintainable code'],
        company: 'TechCorp Solutions',
        location: 'New York, NY',
        jobType: 'Full-time',
        salary: '$80,000 - $120,000',
        employerId: createdEmployers[0]._id,
        status: 'active'
      },
      {
        title: 'Backend Engineer',
        description: 'Join our backend team to build scalable APIs and services. You will work with modern technologies and contribute to our growing platform.',
        requirements: ['Experience with Node.js or Python', 'Knowledge of databases (SQL/NoSQL)', 'Understanding of RESTful APIs', 'Experience with cloud platforms'],
        responsibilities: ['Design and implement APIs', 'Work with databases and data modeling', 'Ensure application security', 'Collaborate with frontend developers'],
        company: 'InnovateLabs Inc',
        location: 'San Francisco, CA',
        jobType: 'Full-time',
        salary: '$90,000 - $130,000',
        employerId: createdEmployers[1]._id,
        status: 'active'
      },
      {
        title: 'Full Stack Developer',
        description: 'We need a versatile full stack developer who can work on both frontend and backend technologies. This is a great opportunity to work on diverse projects.',
        requirements: ['Experience with MERN stack', 'Knowledge of database design', 'Understanding of version control', 'Problem-solving skills'],
        responsibilities: ['Develop full-stack web applications', 'Design database schemas', 'Implement responsive UIs', 'Maintain and update existing code'],
        company: 'GlobalTech Systems',
        location: 'Austin, TX',
        jobType: 'Full-time',
        salary: '$75,000 - $110,000',
        employerId: createdEmployers[2]._id,
        status: 'active'
      },
      {
        title: 'DevOps Engineer',
        description: 'Looking for a DevOps engineer to help us streamline our deployment processes and infrastructure management.',
        requirements: ['Experience with AWS/Azure/GCP', 'Knowledge of Docker and Kubernetes', 'CI/CD pipeline experience', 'Scripting skills (Bash/Python)'],
        responsibilities: ['Manage cloud infrastructure', 'Set up CI/CD pipelines', 'Monitor system performance', 'Ensure security best practices'],
        company: 'TechCorp Solutions',
        location: 'New York, NY',
        jobType: 'Full-time',
        salary: '$95,000 - $140,000',
        employerId: createdEmployers[0]._id,
        status: 'active'
      },
      {
        title: 'UI/UX Designer',
        description: 'Join our design team to create beautiful and intuitive user interfaces. You will work closely with developers to bring designs to life.',
        requirements: ['Proficiency in Figma/Sketch', 'Understanding of user-centered design', 'Knowledge of design systems', 'Portfolio showcasing web/mobile designs'],
        responsibilities: ['Create wireframes and mockups', 'Design user interfaces', 'Conduct user research', 'Collaborate with development team'],
        company: 'InnovateLabs Inc',
        location: 'San Francisco, CA',
        jobType: 'Contract',
        salary: '$60,000 - $90,000',
        employerId: createdEmployers[1]._id,
        status: 'active'
      },
      {
        title: 'Data Analyst',
        description: 'We are seeking a data analyst to help us make data-driven decisions. You will work with large datasets and create insightful reports.',
        requirements: ['Experience with SQL and Python', 'Knowledge of data visualization tools', 'Statistical analysis skills', 'Excel proficiency'],
        responsibilities: ['Analyze business data', 'Create dashboards and reports', 'Identify trends and insights', 'Present findings to stakeholders'],
        company: 'GlobalTech Systems',
        location: 'Austin, TX',
        jobType: 'Full-time',
        salary: '$65,000 - $95,000',
        employerId: createdEmployers[2]._id,
        status: 'active'
      }
    ];

    const createdJobs = await Job.insertMany(jobs);
    console.log('Created jobs');

    // Create applications
    const applications = [
      {
        jobId: createdJobs[0]._id,
        jobSeekerId: createdJobseekers[0]._id,
        resumeUrl: 'https://example.com/resume1.pdf',
        coverLetter: 'I am very interested in this position and believe my skills in React and JavaScript make me a great fit.',
        status: 'pending'
      },
      {
        jobId: createdJobs[0]._id,
        jobSeekerId: createdJobseekers[1]._id,
        resumeUrl: 'https://example.com/resume2.pdf',
        coverLetter: 'With my experience in Python and web development, I am excited to contribute to your team.',
        status: 'under review'
      },
      {
        jobId: createdJobs[1]._id,
        jobSeekerId: createdJobseekers[1]._id,
        resumeUrl: 'https://example.com/resume3.pdf',
        coverLetter: 'I have extensive experience with backend technologies and would love to work on your platform.',
        status: 'pending'
      },
      {
        jobId: createdJobs[2]._id,
        jobSeekerId: createdJobseekers[2]._id,
        resumeUrl: 'https://example.com/resume4.pdf',
        coverLetter: 'My full stack development skills would be perfect for this role.',
        status: 'accepted'
      },
      {
        jobId: createdJobs[2]._id,
        jobSeekerId: createdJobseekers[3]._id,
        resumeUrl: 'https://example.com/resume5.pdf',
        coverLetter: 'I am passionate about software development and would be thrilled to join your team.',
        status: 'pending'
      },
      {
        jobId: createdJobs[3]._id,
        jobSeekerId: createdJobseekers[4]._id,
        resumeUrl: 'https://example.com/resume6.pdf',
        coverLetter: 'My DevOps experience aligns perfectly with your requirements.',
        status: 'rejected'
      },
      {
        jobId: createdJobs[4]._id,
        jobSeekerId: createdJobseekers[0]._id,
        resumeUrl: 'https://example.com/resume7.pdf',
        coverLetter: 'I have a strong background in UI/UX design and would love to contribute to your projects.',
        status: 'pending'
      }
    ];

    await Application.insertMany(applications);
    console.log('Created applications');

    // Update job applicants count
    for (const job of createdJobs) {
      const applicantsCount = await Application.countDocuments({ jobId: job._id });
      await Job.findByIdAndUpdate(job._id, { applicants: applicantsCount });
    }
    console.log('Updated job applicants count');

    console.log('✅ Dummy data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Employers: ${createdEmployers.length}`);
    console.log(`   Jobseekers: ${createdJobseekers.length}`);
    console.log(`   Jobs: ${createdJobs.length}`);
    console.log(`   Applications: ${applications.length}`);
    console.log('\n🔐 Test Accounts:');
    console.log('   Admin: admin@sakshamrojgar.com / admin123');
    console.log('   Employer: hr@techcorp.com / password123');
    console.log('   Jobseeker: alice@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();