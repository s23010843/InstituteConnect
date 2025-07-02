import crypto from 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'apple' | 'email';
  providerId?: string;
  password?: string;
  isStudent: boolean;
  isFaculty: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  degree: string;
  department: string;
  credits: number;
  tuition: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Faculty {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone?: string;
  bio: string;
  expertise: string[];
  education: string[];
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertUser {
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'apple' | 'email';
  providerId?: string;
  password?: string;
  isStudent?: boolean;
  isFaculty?: boolean;
  isAdmin?: boolean;
}

export interface InsertSession {
  userId: string;
  token: string;
  expiresAt: Date;
}

export const storage = {
  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
};