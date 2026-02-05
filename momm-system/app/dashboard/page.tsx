'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuthGuard();

  useEffect(() => {
    if (!loading && user) {
      // Redirect to role-specific dashboard
      router.push(`/dashboard/${user.role}`);
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    </div>
  );
}
