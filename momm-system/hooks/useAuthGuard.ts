'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthGuardOptions {
  redirectTo?: string;
  allowedRoles?: Array<'admin' | 'convener' | 'staff'>;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { redirectTo = '/auth/login', allowedRoles } = options;
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!loading && !hasRedirected.current) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        const currentPath = window.location.pathname;
        const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
        hasRedirected.current = true;
        router.push(redirectUrl);
        return;
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // User doesn't have the required role
        hasRedirected.current = true;
        router.push(`/${user.role}/dashboard`); // Redirect to role dashboard
        return;
      }
    }
  }, [user, loading, isAuthenticated, redirectTo, allowedRoles, router]);

  return {
    user,
    loading,
    isAuthenticated,
    isAuthorized: !allowedRoles || (user && allowedRoles.includes(user.role)),
  };
}