'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';

export default function HomePage() {
  const { isAuthenticated, setUser, setToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Auto-authenticate for personal use
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
    
    // Always redirect to dashboard
    router.push('/dashboard');
  }, [isAuthenticated, router, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}
