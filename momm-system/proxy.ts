import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Define protected routes
const protectedRoutes = ['/admin', '/convener', '/staff'];
const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/auth/login?redirect=' + encodeURIComponent(pathname), request.url));
    }

    try {
      // Verify the token
      const payload = verifyToken(token);
      if (!payload) {
        throw new Error('Invalid token');
      }

      // Role guard: path must match role segment
      const roleFromPath = protectedRoutes.find(route => pathname.startsWith(route))?.slice(1);
      if (roleFromPath && payload.role !== roleFromPath) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Add user info to headers for the protected route
      const response = NextResponse.next();
      response.headers.set('X-User-ID', payload.userId.toString());
      response.headers.set('X-User-Role', payload.role);
      return response;
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL('/auth/login?redirect=' + encodeURIComponent(pathname), request.url));
    }
  }

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthRoute && token) {
    try {
      const payload = verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, request.url));
      }
    } catch (error) {
      // Token is invalid, let them proceed to auth routes
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};