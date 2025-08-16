'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';

export default function HomePage() {
  const { isAuthenticated, setUser, setToken } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for hydration, then auto-authenticate
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        // Set a mock user session for personal use
        setUser({
          id: 'personal-user',
          email: 'user@personal.com',
          name: 'Personal User',
          role: 'USER'
        });
        setToken('personal-session-token');
      }
      
      // Redirect to dashboard after authentication
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
      
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [router, setUser, setToken, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}
