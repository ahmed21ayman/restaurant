const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-order');
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@cravedirect.com';
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user already exists!');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      admin = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('Successfully created admin account!');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: admin123`);
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding admin:', error);
    mongoose.disconnect();
  }
};

seedAdmin();
