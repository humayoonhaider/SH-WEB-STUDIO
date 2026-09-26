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
  lastError: null as string | null,
};

let autoRetryTimer: NodeJS.Timeout | null = null;

export const connectDB = async (): Promise<boolean> => {
  // Clean surrounding quotes or whitespaces
  let mongoURI = process.env.MONGODB_URI?.trim();
  if (mongoURI) {
    mongoURI = mongoURI.replace(/^["']|["']$/g, '').trim();
  }

  if (!mongoURI || mongoURI.includes('<password>') || mongoURI.includes('<db_username>') || mongoURI.includes('YOUR_PASSWORD')) {
    dbStatusDetails = {
      isAtlasConnected: false,
      storageMode: 'local',
      clusterHost: null,
      notice: 'MONGODB_URI environment variable is missing or contains placeholder credentials in Railway. Add MONGODB_URI in Railway -> Variables.',
      lastError: 'Missing or placeholder MONGODB_URI',
    };
    console.log('[Storage] Initialized with persistent local data store. Add MONGODB_URI to connect MongoDB Atlas.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
    });

    isMongooseConnected = true;
    dbStatusDetails = {
      isAtlasConnected: true,
      storageMode: 'atlas',
      clusterHost: conn.connection.host || 'MongoDB Atlas Cluster',
      notice: `Connected to MongoDB Atlas (${conn.connection.host})`,
      lastError: null,
    };
    console.log(`[Storage] ✅ MongoDB Atlas Connected: ${conn.connection.host}`);

    if (autoRetryTimer) {
      clearInterval(autoRetryTimer);
      autoRetryTimer = null;
    }

    return true;
  } catch (err: any) {
    isMongooseConnected = false;
    await mongoose.disconnect().catch(() => {});

    const errMsg = err?.message || 'Unknown connection error';
    const isAuthError = errMsg.includes('auth') || errMsg.includes('authentication') || errMsg.includes('bad auth');
    const isIpError = errMsg.includes('timed out') || errMsg.includes('selection timed out') || errMsg.includes('ECONNREFUSED') || errMsg.includes('ENOTFOUND');

    let notice = '';
    if (isAuthError) {
      notice = 'MongoDB Atlas authentication failed. Please check username & password in Railway MONGODB_URI (URL encode special characters like @ as %40).';
    } else if (isIpError) {
      notice = 'MongoDB Atlas connection timed out. Railway IP is blocked. Go to MongoDB Atlas -> Network Access -> Add IP Address -> Select "Allow Access from Anywhere" (0.0.0.0/0).';
    } else {
      notice = `MongoDB Atlas error: ${errMsg}`;
    }

    dbStatusDetails = {
      isAtlasConnected: false,
      storageMode: 'local',
      clusterHost: null,
      notice,
      lastError: errMsg,
    };
    console.warn(`[Storage] Atlas connection attempt failed: ${notice} (${errMsg})`);

    // Start background auto-retry if not already running
    if (!autoRetryTimer && mongoURI) {
      autoRetryTimer = setInterval(async () => {
        if (!isMongooseConnected) {
          console.log('[Storage] Background retry connecting to MongoDB Atlas...');
          await connectDB();
        }
      }, 30000);
    }

    return false;
  }
};

export const getIsMongooseConnected = () => isMongooseConnected;
export const getDBStatusDetails = () => ({ ...dbStatusDetails });
