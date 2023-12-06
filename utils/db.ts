import mongoose from 'mongoose';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable");
}

let cachedDb: null | typeof mongoose = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log("Using cached database instance");
    return cachedDb;
  }

  try {
    const dbInstance = await mongoose.connect(DATABASE_URL!, {
      minPoolSize: 10,
      maxPoolSize: 25,
    });
    cachedDb = dbInstance;
    console.log("New database connection established");
    return dbInstance;
  } catch (error) {
    console.error("Database connection failed", error);
  }
}

export default connectDB;