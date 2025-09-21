import { useState, useLayoutEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { login as supabaseLogin, LoginRequest } from '@/lib/api/supabase-auth';
import {
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  setAuthHeader,
} from '@/lib/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = Boolean(getAuthToken());

  // We don't want flashing content
  useLayoutEffect(() => {
    const token = getAuthToken();
    if (token) {
      setAuthHeader(token);
    }
    setIsLoading(false);
  }, []);

  // We don't want flashing content
  useLayoutEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && pathname === '/login') {
      router.replace('/');
    }
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await supabaseLogin(credentials);
      setAuthToken(response.access_token);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearAuthToken();
  };

  return {
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
};
