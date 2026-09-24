import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { Admin } from '../models/index.js';

dotenv.config();

async function runSeedAdmin() {
  await connectDB();

  const name = process.env.ADMIN_NAME || 'Humayoon';
  const email = (process.env.ADMIN_EMAIL || 'humayoonkhan003@gmail.com').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('❌ Error: ADMIN_PASSWORD must be defined in your .env to seed an admin.');
    process.exit(1);
  }

  const existing = await Admin.findOne({ email });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  if (existing) {
    await Admin.findByIdAndUpdate(String(existing._id), {
      name,
      passwordHash,
      isActive: true,
    });
    console.log(`✅ Admin updated for ${email}`);
  } else {
    await Admin.create({
      name,
      email,
      passwordHash,
      role: 'admin',
      isActive: true,
    });
    console.log(`✅ Admin created for ${email}`);
  }

  process.exit(0);
}

runSeedAdmin().catch((err) => {
  console.error('Failed to seed admin:', err);
  process.exit(1);
});
