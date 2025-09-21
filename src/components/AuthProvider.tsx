'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { usePathname } from 'next/navigation';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Show loading spinner while checking auth
  if (
    isLoading ||
    (isAuthenticated && pathname === '/login') ||
    (!isAuthenticated && pathname !== '/login')
  ) {
    {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      );
    }
  }
  return <>{children}</>;
}
