import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Record } from '../models/Record';
import mongoose from 'mongoose';

export const getUserProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    if (req.user?.id !== id && req.user?.role !== 'Admin') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'An error occurred retrieving user profile' });
  }
};

export const getUserRecords = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { delay } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    if (req.user?.id !== id && req.user?.role !== 'Admin') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const delayMs = delay ? parseInt(delay as string, 10) : 0;
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const records = await Record.find({ user: id }).sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    console.error('Get user records error:', error);
    res.status(500).json({ message: 'An error occurred retrieving records' });
  }
};
