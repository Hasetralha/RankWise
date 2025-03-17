import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

const client = new MongoClient(process.env.MONGODB_URI);

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getDB = () => client.db('rankwise');
export const getClient = () => client; 