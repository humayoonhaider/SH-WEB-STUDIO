import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AdminModel } from '../models/schemas.js';

dotenv.config();

async function updateAdmin() {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('MONGODB_URI not found in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const result = await AdminModel.updateOne(
      { email: 'humayoonkhan003@gmail.com' },
      { $set: { name: 'Admin' } }
    );

    if (result.modifiedCount > 0) {
      console.log('Admin name updated to "Admin" successfully.');
    } else {
      console.log('Admin not found or name already "Admin".');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error updating admin:', err);
    process.exit(1);
  }
}

updateAdmin();
