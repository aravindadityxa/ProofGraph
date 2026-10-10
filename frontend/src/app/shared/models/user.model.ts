export enum UserRole {
  GENERAL_USER = 'General User',
  ADMIN = 'Admin'
}

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending'
}

export interface User {
  id: string;
  name: string;
  userId: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  organization?: string;
  createdAt?: string;
  updatedAt?: string;
  recordCount?: number;
  verifiedCount?: number;
  pendingCount?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  userId: string;
  password: string;
  role: UserRole;
}
