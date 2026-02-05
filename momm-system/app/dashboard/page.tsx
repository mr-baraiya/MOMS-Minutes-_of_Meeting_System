'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, get the user's role from authentication context/session
    // For now, redirect to admin dashboard as default
    // You should replace this with actual auth logic
    
    const getUserRole = () => {
      // TODO: Get from authentication context or session
      // Example: const { user } = useAuth();
      // return user.role;
      
      // For demo purposes, check localStorage or default to admin
      if (typeof window !== 'undefined') {
        const role = localStorage.getItem('userRole') || 'admin';
        return role;
      }
      return 'admin';
    };

    const role = getUserRole();
    router.push(`/dashboard/${role}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    </div>
  );
}
