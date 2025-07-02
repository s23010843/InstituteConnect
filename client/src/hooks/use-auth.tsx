import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getCurrentUser, 
  setCurrentUser, 
  removeCurrentUser,
  initializeGoogleAuth,
  initializeAppleAuth,
  signInWithGoogle as signInWithGoogleAuth,
  signInWithApple as signInWithAppleAuth
} from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  signOut: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login for development
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      setUser(mockUser);
      setCurrentUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Mock registration for development
      const mockUser: User = {
        id: Date.now().toString(),
        name: name,
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      setUser(mockUser);
      setCurrentUser(mockUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await initializeGoogleAuth();
      const result = await signInWithGoogleAuth();
      const mockUser: User = {
        id: 'google-' + Date.now(),
        name: 'Google User',
        email: 'user@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
      };
      setUser(mockUser);
      setCurrentUser(mockUser);
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    try {
      await initializeAppleAuth();
      const result = await signInWithAppleAuth();
      const mockUser: User = {
        id: 'apple-' + Date.now(),
        name: 'Apple User',
        email: 'user@icloud.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=apple',
      };
      setUser(mockUser);
      setCurrentUser(mockUser);
    } catch (error) {
      console.error('Apple sign-in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    signOut: logout,
    signInWithGoogle,
    signInWithApple,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}