import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth';
import { getDb } from '../lib/db';
import { ObjectId } from 'mongodb';
import cloudinary from '../config/cloudinary';
import { User, UserSettings, defaultUserSettings } from '../models/User';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get user settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user?._id) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update user settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const { name, email, company, role, settings } = req.body;

    const updateData: Partial<User> = {
      updatedAt: new Date()
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (company) updateData.company = company;
    if (role) updateData.role = role;
    if (settings) updateData.settings = settings;

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(req.user?._id) },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Upload avatar
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Convert the buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'avatars',
      public_id: `user_${req.user?._id}`,
      overwrite: true,
    });

    // Update user's avatar URL in database
    const db = getDb();
    const updatedUser = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(req.user?._id) },
      { $set: { avatar: result.secure_url, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router; 