import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/environment';
import { IUser, UserRole } from '../models/User';

export interface JwtPayload {
  userId: string;
  id: string;
  role: UserRole;
}

export const generateToken = (user: IUser): string => {
  const payload: JwtPayload = {
    userId: user.userId,
    id: user._id.toString(),
    role: user.role,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};
