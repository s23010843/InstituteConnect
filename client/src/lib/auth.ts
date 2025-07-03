
import { User } from '@shared/schema';

// Simple auth utilities for local development

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('current_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem('current_user', JSON.stringify(user));
};

export const removeCurrentUser = (): void => {
  localStorage.removeItem('current_user');
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Mock authentication functions for development
export const initializeGoogleAuth = async (): Promise<void> => {
  // Mock initialization for development
  return Promise.resolve();
};

export const initializeAppleAuth = async (): Promise<void> => {
  // Mock initialization for development
  return Promise.resolve();
};

export const signInWithGoogle = async (): Promise<{ credential: string }> => {
  // Mock Google sign-in for development
  return Promise.resolve({ credential: 'mock-google-credential' });
};

export const signInWithApple = async (): Promise<{ code: string; id_token: string }> => {
  // Mock Apple sign-in for development
  return Promise.resolve({ code: 'mock-apple-code', id_token: 'mock-apple-token' });
};
