'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { Dashboard } from '@/components/dashboard/dashboard';
import { AppLayout } from '@/components/layout/app-layout';

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for store hydration
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!isAuthenticated) {
        router.push('/');
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}