import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

async function seedDefaultAdmin() {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@jobportal.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_NAME || 'System Admin';

    // Create default admin user
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });

    await admin.save();

    console.log('\n✅ Default admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: ${admin.role}`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('🚀 Login at: http://localhost:3000/login\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating default admin:', error.message);
    process.exit(1);
  }
}

seedDefaultAdmin();
