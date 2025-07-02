import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { initializeGoogleAuth, initializeAppleAuth, signInWithGoogle, signInWithApple } from "@/lib/auth";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem('auth_token')
  );
  
  const queryClient = useQueryClient();

  // Initialize auth providers
  useEffect(() => {
    initializeGoogleAuth().catch(console.error);
    initializeAppleAuth().catch(console.error);
  }, []);

  // Get current user
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    enabled: !!token,
    retry: false,
  });

  // Google Sign-In mutation
  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      const response = await signInWithGoogle();
      const result = await apiRequest("POST", "/api/auth/google", {
        credential: response.credential,
      });
      return result.json();
    },
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  // Apple Sign-In mutation
  const appleSignInMutation = useMutation({
    mutationFn: async () => {
      const response = await signInWithApple();
      const result = await apiRequest("POST", "/api/auth/apple", response);
      return result.json();
    },
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      if (token) {
        await apiRequest("POST", "/api/auth/signout", {});
      }
    },
    onSuccess: () => {
      setToken(null);
      localStorage.removeItem('auth_token');
      queryClient.clear();
    },
    onError: () => {
      // Sign out locally even if server request fails
      setToken(null);
      localStorage.removeItem('auth_token');
      queryClient.clear();
    },
  });

  // Update API request function to include auth header
  useEffect(() => {
    if (token) {
      // Override the default headers for authenticated requests
      const originalFetch = window.fetch;
      window.fetch = (url, options = {}) => {
        if (typeof url === 'string' && url.startsWith('/api')) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return originalFetch(url, options);
      };
      
      return () => {
        window.fetch = originalFetch;
      };
    }
  }, [token]);

  const contextValue: AuthContextType = {
    user: user || null,
    isLoading: isLoading || googleSignInMutation.isPending || appleSignInMutation.isPending,
    signInWithGoogle: async () => {
      const result = await googleSignInMutation.mutateAsync();
      // Redirect will be handled by the component calling this
      return result;
    },
    signInWithApple: async () => {
      const result = await appleSignInMutation.mutateAsync();
      // Redirect will be handled by the component calling this
      return result;
    },
    signOut: () => signOutMutation.mutateAsync(),
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
