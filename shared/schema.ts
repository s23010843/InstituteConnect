
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'apple';
  providerId: string;
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

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: Date;
}

export interface InsertUser {
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'apple';
  providerId: string;
  isStudent?: boolean;
  isFaculty?: boolean;
  isAdmin?: boolean;
}

export interface InsertSession {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface InsertContact {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

// Validation schemas for Firebase data
export const insertUserSchema = {
  email: 'string',
  name: 'string',
  avatar: 'string?',
  provider: 'google | apple',
  providerId: 'string',
  isStudent: 'boolean?',
  isFaculty: 'boolean?',
  isAdmin: 'boolean?',
};

export const insertSessionSchema = {
  userId: 'string',
  token: 'string',
  expiresAt: 'Date',
};
