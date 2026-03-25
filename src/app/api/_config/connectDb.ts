import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    const conn = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        dbName: process.env.DB_NAME,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.name}`);
  } catch (error) {
    console.error(error);
  }
}