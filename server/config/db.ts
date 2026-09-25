import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Fail fast on database operations if offline
mongoose.set('bufferCommands', false);

let isMongooseConnected = false;
let dbStatusDetails = {
  isAtlasConnected: false,
  storageMode: 'local' as 'atlas' | 'local',
  clusterHost: null as string | null,
  notice: '',
};

export const connectDB = async (): Promise<boolean> => {
  const mongoURI = process.env.MONGODB_URI?.trim();

  if (!mongoURI || mongoURI.includes('<password>') || mongoURI.includes('<db_username>')) {
    dbStatusDetails = {
      isAtlasConnected: false,
      storageMode: 'local',
      clusterHost: null,
      notice: 'No MONGODB_URI configured. Running in persistent local storage mode.',
    };
    console.log('[Storage] Initialized with persistent local data store.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 15000,
    });
    isMongooseConnected = true;
    dbStatusDetails = {
      isAtlasConnected: true,
      storageMode: 'atlas',
      clusterHost: conn.connection.host || 'MongoDB Atlas',
      notice: 'Successfully connected to MongoDB Atlas cluster.',
    };
    console.log(`[Storage] ✅ Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (err: any) {
    isMongooseConnected = false;
    await mongoose.disconnect().catch(() => {});

    const isAuthError = err.message?.includes('auth') || err.message?.includes('authentication');
    const notice = isAuthError
      ? 'MongoDB Atlas authentication failed (check credentials in MONGODB_URI). Application is running seamlessly in persistent local storage mode.'
      : 'MongoDB Atlas connection unavailable (requires 0.0.0.0/0 IP whitelisting in Atlas). Application is running seamlessly in persistent local storage mode.';

    dbStatusDetails = {
      isAtlasConnected: false,
      storageMode: 'local',
      clusterHost: null,
      notice,
    };
    console.log(`[Storage] Note: ${notice} (${err.message})`);
    return false;
  }
};

export const getIsMongooseConnected = () => isMongooseConnected;
export const getDBStatusDetails = () => ({ ...dbStatusDetails });
