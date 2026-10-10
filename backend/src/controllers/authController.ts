import { Request, Response } from 'express';
import { User, UserRole } from '../models/User';
import { generateToken } from '../utils/jwt';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, password, role } = req.body;

    if (!userId || !password || !role) {
      res.status(400).json({ message: 'User ID, password, and role are required' });
      return;
    }

    const user = await User.findOne({ userId: userId.toLowerCase() });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (user.role !== role) {
      res.status(403).json({ message: 'Role mismatch' });
      return;
    }

    if (user.status !== 'Active') {
      res.status(403).json({ message: 'Account is not active' });
      return;
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        userId: user.userId,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        organization: user.organization,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};
