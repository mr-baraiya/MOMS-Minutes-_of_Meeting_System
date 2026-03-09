import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Define protected routes
const protectedRoutes = ['/admin', '/convener', '/staff'];
const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

// Add security headers to response
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy to prevent extension script injection
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.emailjs.com https://fonts.googleapis.com https://meet.jit.si",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.emailjs.com https://meet.jit.si wss://meet.jit.si https://*.jitsi.net wss://*.jitsi.net",
    "frame-src 'self' https: https://meet.jit.si",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; '));

  // Permissions policy to prevent unload event violations (updated format)
  response.headers.set('Permissions-Policy', [
    'unload=()',
    'accelerometer=(self)',
    'camera=(self)',
    'geolocation=(self)',
    'gyroscope=(self)',
    'magnetometer=(self)',
    'microphone=(self)',
    'payment=(self)',
    'usb=()'
  ].join(', '));

  // Additional security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

  return response;
}

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
      
      if (roleFromPath) {
        const isAuthorized =
          payload.role === 'admin' ||
          payload.role === roleFromPath ||
          (payload.role === 'convener' && roleFromPath === 'staff');

        if (!isAuthorized) {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }

      // Add user info to headers for the protected route
      const response = NextResponse.next();
      response.headers.set('X-User-ID', payload.userId.toString());
      response.headers.set('X-User-Role', payload.role);
      return addSecurityHeaders(response);
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

  return addSecurityHeaders(NextResponse.next());
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