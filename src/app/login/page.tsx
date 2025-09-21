'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return <LoginForm />;
}
