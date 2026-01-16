import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sakshamrojgar.com' });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email: admin@sakshamrojgar.com');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@sakshamrojgar.com',
      password: hashedPassword,
      role: 'admin',
      phone: '9800000000',
      location: 'Kathmandu, Nepal'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@sakshamrojgar.com');
    console.log('🔑 Password: Admin@123');
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
