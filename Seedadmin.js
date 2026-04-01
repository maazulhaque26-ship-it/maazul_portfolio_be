// ============================================================
// backend/seedAdmin.js
// ============================================================
// Run once to create the first admin user:
//   node seedAdmin.js
//
// Default credentials (change after first login):
//   Email:    admin@portfolio.com
//   Password: Admin@123
// ============================================================

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existing = await User.findOne({ email: 'admin@portfolio.com' });
    if (existing) {
      console.log('⚠️  Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    // Create admin user (password is auto-hashed by User model pre-save hook)
    await User.create({
      name:     'Admin',
      email:    'admin@portfolio.com',
      password: 'Admin@123',
      isAdmin:  true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Email:    admin@portfolio.com');
    console.log('   Password: Admin@123');
    console.log('   ⚠️  Change these credentials after first login!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedAdmin();