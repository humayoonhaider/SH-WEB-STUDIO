import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isMongooseConnected = false;
let dbStatusDetails = {
  isAtlasConnected: false,
  storageMode: 'local' as 'atlas' | 'local',
  clusterHost: null as string | null,
  notice: '',
};

export const connectDB = async (): Promise<boolean> => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
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
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
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
    console.error(`[Storage] ❌ Atlas Connection Failed: ${err.message}`);
    // When Atlas cluster blocks the preview environment dynamic IP, seamlessly run on local storage
    isMongooseConnected = false;
    dbStatusDetails = {
      isAtlasConnected: false,
      storageMode: 'local',
      clusterHost: null,
      notice:
        'MongoDB Atlas requires IP whitelisting (0.0.0.0/0 in Atlas Network Access) to connect from cloud container environments. Application is operating seamlessly in persistent local storage mode.',
    };
    console.log('[Storage] Operating in persistent local storage mode.');
    return false;
  }
};

export const getIsMongooseConnected = () => isMongooseConnected;
export const getDBStatusDetails = () => ({ ...dbStatusDetails });
