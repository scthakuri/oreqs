'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User, LoginCredentials } from '@/lib/auth-service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user on mount from session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await authService.getSession();
        setUser(session.user);
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  // Auto-refresh user data every 5 minutes to pick up permission changes
  useEffect(() => {
    console.log('[Auth] Setting up auto-refresh (every 5 minutes)');

    const interval = setInterval(async () => {
      console.log('[Auth] Auto-refreshing user permissions...');
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        console.log('[Auth] User permissions refreshed successfully');
      } catch (error) {
        console.error('[Auth] Failed to auto-refresh user:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      console.log('[Auth] Clearing auto-refresh interval');
      clearInterval(interval);
    };
  }, []); // Empty deps - only set up once

  // Refresh permissions when tab becomes visible
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        console.log('[Auth] Tab focused - refreshing permissions...');
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          console.log('[Auth] Permissions refreshed on tab focus');
        } catch (error) {
          console.error('[Auth] Failed to refresh on visibility change:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []); // Empty deps - only set up once

  // Listen for 403 errors and refresh permissions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePermissionDenied = async () => {
      console.log('[Auth] 403 error detected - refreshing permissions...');
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        console.log('[Auth] Permissions refreshed after 403 error');
      } catch (error) {
        console.error('[Auth] Failed to refresh permissions:', error);
      }
    };

    window.addEventListener('permission-denied', handlePermissionDenied);
    return () => window.removeEventListener('permission-denied', handlePermissionDenied);
  }, []); // Empty deps - only set up once

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      router.push('/admin'); // Redirect to dashboard after login
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      setUser(null);
      router.push('/login');
    }
  };

  const refetchUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refetch user:', error);
      setUser(null);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
