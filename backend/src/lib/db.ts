import { MongoClient, Db } from 'mongodb';

let db: Db;

export const connectToDb = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rankwise');
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

export const closeDb = async () => {
  if (client) {
    await client.close();
    db = null;
    client = null;
    console.log('Disconnected from MongoDB');
  }
}; 