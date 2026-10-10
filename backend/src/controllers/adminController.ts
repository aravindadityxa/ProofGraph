import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User, UserRole, UserStatus } from '../models/User';
import { Record } from '../models/Record';
import mongoose from 'mongoose';

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const usersWithRecordCount = await Promise.all(
      users.map(async (user) => {
        const recordCount = await Record.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          recordCount,
        };
      })
    );

    res.json(usersWithRecordCount);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'An error occurred retrieving users' });
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const records = await Record.find({ user: id });
    const recordCount = records.length;
    const verifiedCount = records.filter((r) => r.status === 'Verified').length;
    const pendingCount = records.filter((r) => r.status === 'Pending').length;

    res.json({
      ...user.toObject(),
      recordCount,
      verifiedCount,
      pendingCount,
      records,
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'An error occurred retrieving user' });
  }
};

export const createUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, userId, email, password: userPassword, role, status, department, organization } = req.body;

    if (!name || !userId || !email || !userPassword) {
      res.status(400).json({ message: 'Name, userId, email, and password are required' });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ userId: userId.toLowerCase() }, { email: email.toLowerCase() }],
    });

    if (existingUser) {
      res.status(400).json({ message: 'User ID or email already exists' });
      return;
    }

    const user = new User({
      name,
      userId: userId.toLowerCase(),
      email: email.toLowerCase(),
      password: userPassword,
      role: role || UserRole.GENERAL_USER,
      status: status || UserStatus.ACTIVE,
      department,
      organization,
    });

    await user.save();

    const { password, ...userResponse } = user.toObject();

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'An error occurred creating user' });
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role, status, department, organization, password: userPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== id) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (status) user.status = status;
    if (department !== undefined) user.department = department;
    if (organization !== undefined) user.organization = organization;
    if (userPassword) user.password = userPassword;

    await user.save();

    const { password, ...userResponse } = user.toObject();

    res.json(userResponse);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'An error occurred updating user' });
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await Record.deleteMany({ user: id });
    await User.findByIdAndDelete(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'An error occurred deleting user' });
  }
};
