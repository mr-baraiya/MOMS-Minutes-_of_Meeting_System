import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

// JWT Secret - In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expiration time

export interface JWTPayload {
  userId: number;
  username: string;
  role: 'admin' | 'convener' | 'staff';
  staffId?: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return null;
  }

  // Support both "Bearer TOKEN" and "TOKEN" formats
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  
  return authHeader;
}

/**
 * Extract token from cookies
 */
export function extractTokenFromCookies(request: NextRequest): string | null {
  const token = request.cookies.get('token')?.value;
  return token || null;
}

/**
 * Get user from request (checks both header and cookies)
 */
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  // Try to get token from Authorization header first
  let token = extractTokenFromHeader(request);
  
  // If not in header, try cookies
  if (!token) {
    token = extractTokenFromCookies(request);
  }
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

/**
 * Check if user has required role
 */
export function hasRole(
  user: JWTPayload | null,
  allowedRoles: ('admin' | 'convener' | 'staff')[]
): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

/**
 * Create response with authentication error
 */
export function createAuthError(message: string, status: number = 401) {
  return Response.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}
