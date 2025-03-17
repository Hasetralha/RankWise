import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDB } from '../utils/database';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDB();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In a real application, you would validate the password here
    // using bcrypt.compare or similar
    
    const token = jwt.sign(
      { email, id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: process.env.NODE_ENV === 'production' 
        ? 'Login failed' 
        : error.message 
    });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required' 
      });
    }

    const db = getDB();
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // In a real application, you would hash the password before storing
    const result = await users.insertOne({
      email,
      password, // Should be hashed in production
      name,
      createdAt: new Date(),
    });

    const token = jwt.sign(
      { email, id: result.insertedId },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: process.env.NODE_ENV === 'production' 
        ? 'Registration failed' 
        : error.message 
    });
  }
});

export const authRoutes = router; 